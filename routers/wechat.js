'use strict';
const Article = require('../models/editor/Article');
const ArticleContent = require('../models/editor/ArticleContent');
const router = require('koa-router')();
const _ = require('lodash');
const rp = require('request-promise');
const {SSO_API_Client} = require('koa-sso-auth-cli');

router.get('/wechat/mplist', function * () {
    let mpList = yield SSO_API_Client.getMPList(this.session.token);
    this.body = mpList;
});

router.get('/wechat/sync', function * () {
    let articleIdList = this.query['article[]'];
    if(typeof(articleIdList) === 'string') {
        articleIdList = [articleIdList];
    }
    articleIdList = _.uniq(articleIdList);

    let mpId = this.query.mp;
    let accountId = this.session.account._id;
    let mpAccessToken = yield getMpToken(mpId, this.session.token);
    if(!mpAccessToken) {
        this.body = {errmsg: '未能获取 access token'};
        return;
    }

    let successList = [];
    let failList = [];
    let errmsgList = [];
    for(let articleId of articleIdList) {
        let result = yield sync(articleId, accountId, mpId, mpAccessToken);
        if(result.errcode && result.errcode != 0) {
            failList.push(articleId);
            errmsgList.push(result);
        }else {
            successList.push(articleId);
        }
    }

    this.body = {successList, failList, errmsgList};
});

function * sync(articleId, accountId, mpId, token) {
    let article = yield Article.findOne({_id: articleId});
    if(!article || article.account != accountId) {
        return {errmsg: 'article is not found,' + articleId};
    }
    let content = yield ArticleContent.findOne({_id: article._id});

    let data = {
        title: article.title,
        thumb_media_id: yield getImageMediaId(token, mpId, accountId, article.cover),
        show_cover_pic: 1,
        author: article.author,
        digest: article.digest,
        content: content.content,
        content_source_url: article.sourceUrl
    };

    let result;
    let mpMap = article.mpMap;
    let mediaId = article.mpMap[mpId];
    function * addNew() {
        result = yield post(
            `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${token}`,
            {
                articles: [data]
            }
        );
        mpMap[mpId] = result['media_id'];
    }
    if(article.status == 1 || article.status == 0 || !mediaId) {
        yield addNew();
    } else {
        result = (yield post(
            `https://api.weixin.qq.com/cgi-bin/material/update_news?access_token=${token}`, {
                media_id: mediaId,
                index: 0,
                articles: data
            }
        ));

        if(result.errcode === 40007) {
            yield addNew();
        }
    }

    if(result.errcode && result.errcode != 0) {
        return result;
    }

    article.status = 3;
    yield Article.update(
        {_id: article._id},
        {$set: {
            status: 3,
            mpMap: mpMap
        }}
    );

    return result;
}

function * getImageMediaId(token, mpId, accountId, url) {
    let uploadFile, filePath;
    if(!url) {
        url = 'http://boom.static.cceato.com/null.jpg';
    }
    if(url.indexOf('editor.static.cceato.com/' + target_dir)) {
        let arr = url.split('/');
        let filename = arr[arr.length - 1];
        let key = target_dir + filename;
        uploadFile = yield UploadFile.findOne({account: accountId, key: key});
    }

    if(!uploadFile) {

    }

    let mediaMap = uploadFile.mpMap && uploadFile.mpMap[mpId];

    if(!mediaMap) {
        if(!filePath) {
            filePath = yield download(url);
        }
        let mpResult = JSON.parse(yield post(
            `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
            {}, 'file', {media: fs.createReadStream(filePath)}
        ));
        if(!mpResult.errcode || mpResult.errcode == 0) {
            mediaMap = mpResult;
            uploadFile.mpMap[mpId] = mediaMap;
            yield UploadFile.update({
                _id: uploadFile._id
            }, {
                $set: {
                    mpMap: uploadFile.mpMap
                }
            });
        }
    }

    if(filePath) {
        yield fs.unlinkAsync(filePath);
    }

    return mediaMap.media_id;
}

/**
 * 上传图片功能
 */
const KoaUploadMiddleware = require('../common/KoaUpload');
const IDUtils = require('../common/IDUtils');
const QiniuFileUtils = require('../common/QiniuFileUtils');
const UploadFile = require('../models/common/UploadFile');
const request = require('request');
const path = require('path');
const os = require('os');
const fs = require('fs');
require('bluebird').promisifyAll(fs);

const target_dir = 'upload/image/';

router.post('/upload/image', KoaUploadMiddleware, function *() {
    let files = this.files;
    let image = files.image;
    if(image) {
        let accountId = this.session.account._id;
        let uploadFile = yield upload(image.path, accountId);
        this.body = 'success:' + JSON.stringify({key: uploadFile.key});
    }else {
        this.body = 'error:not found';
    }
});

function * upload(imagePath, accountId) {
    let md5FileName = yield QiniuFileUtils.md5(imagePath);
    let key = target_dir + md5FileName;
    let uploadFile = yield UploadFile.findOne({ account: accountId, key: key });
    if (!uploadFile) {
        let result = yield QiniuFileUtils.uploadLocalFile({
            localFilePath: imagePath,
            targetDir: target_dir,
            targetFileName: md5FileName,
            forceUpload: true
        });
        if(result != key) {
            console.error(result, key);
            return null;
        }
        let stat = yield QiniuFileUtils.stat(key);

        uploadFile = new UploadFile({
            account: accountId,
            key: key,
            size: stat.fsize,
            mimeType: stat.mimeType
        });
        yield uploadFile.save();
    }
    return uploadFile;
}

function * download(url) {
    let tempFileName = IDUtils.md5ByString(url);
    let arr = url.split('/');
    let filePath = path.join(os.tmpDir(), tempFileName + arr[arr.length - 1]);
    yield new Promise((rl, rj) => {
        let stream = fs.createWriteStream(filePath);
        stream.on('finish',function(){
            rl();
        });
        request.get(url).on('error', function (err) {
            rj(err);
        }).pipe(stream);
    });
    return filePath;
}


//@TODO 公众号id是否考虑加密存储呢
function * getMpToken(mp, token) {
    return yield SSO_API_Client.getMpAccessToken(token, mp);
}

function * post(url, data, type = 'json', formData) {  //type: 'json' 'file'
    let opts = {
        url: url,
        method: 'POST'
    };
    if(type == 'json') {
        opts.json = data;
    }else if(type == 'file'){
        opts.formData = formData
    }
    return yield rp(opts);
}

module.exports = router;
