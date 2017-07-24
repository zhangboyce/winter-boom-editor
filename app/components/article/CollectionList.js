'use strict';
import _ from 'lodash';
import modal from '../../utils/modal'
import * as projectTypes from '../../../common/ProjectTypes';
import FileUrlUtil from '../../../common/FileUrlUtil';
import Component from './../Component';
import Modal from '../common/Modal';

export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({ id: 'collectionArticleModal' });
    }

    __supplyText__ = data => {
        let $result = $('<div></div>');

        switch (data.type) {
            case projectTypes.FACEBOOK:
            case projectTypes.TWITTER:
            case projectTypes.INSTAGRAM:
                if (data.coverImg && data.coverImg.url) {
                    $(`<img src=${ FileUrlUtil.md5ImageUrl(data.coverImg.url, data.type) } / >`).appendTo($result);
                }
                $(`<p>${ data.desc }</p>`).appendTo($result);
                return $result;

            case projectTypes.STUDIO:
                $('<img/>').attr('src', `http://boom.static.cceato.com/${data.coverImg.fileName}`)
                    .appendTo(
                        $('<p></p>').css('text-align', 'center')
                            .appendTo($result)
                    );

                $('<div></div>').html(this.__textHandle__(data)).appendTo($result);

                return $result;

            default:
                return data.text ?
                    $('<div></div>').html(this.__textHandle__(data)) :
                    $(`<div><p>${ data.desc }</p></div>`);
        }
    };

    __textHandle__ = data => {
        let type = data.type;
        let $t = $('<div></div>').html(data.text);

        //过滤script
        $t.find('script').remove();

        //过滤class
        $t.find('*').removeAttr('class').removeAttr('id');

        //图片懒加载
        $t.find('img').each(function () {
            let $i = $(this);
            let imgUrl = $i.attr('src');
            if (type == projectTypes.WECHAT) {
                imgUrl = 'http://imgcache.cceato.com/cache/' + encodeURIComponent(imgUrl);
            }
            //$i.removeAttr('src');
            //$i.attr('data-original', imgUrl);
            $i.attr('src', imgUrl);
        });

        if (type == projectTypes.WECHAT) {
            $t.find('iframe').each(() => {
                try {
                    let $t = $(this);
                    let originSrc = $t.attr('data-src');
                    if (originSrc.indexOf('qq.com')) {
                        let vid = originSrc.split('?')[1].split('&')[0].split('=')[1];
                        $t.attr('src', `https://v.qq.com/iframe/player.html?vid=${vid}&tiny=0&auto=0`);
                    }
                } catch (e) {
                }
            });
        }

        return $t[0].innerHTML;
    };

    __getCollectionList__ = callback => {
        $.getJSON('/collection/list', list => {
            callback(list);
        });
    };

    __showArticleDetails__ = c => {
        $.getJSON('/collection/getText/' + c._id, pt => {
            let $t = $(`<div class="modal-body boom-content">
                    <div class="boom-content-header">
                        <div class="title-box col-xs-9">
                            <div class="title">${c.title}</div>
                            <!--<div class="extend"><span>/ </span>2016-10-31</div>-->
                        </div>
                        <div class="views-box col-xs-3 row">
                            <div class="views col-sm-6"><span class="number">${c.views}</span>Views</div>
                            <div class="views col-sm-6"><span class="number">${c.likes}</span>Likes</div>
                        </div>
                        <div style="clear: both;"></div>
                    </div>

                </div>`);

            let $header = $('<div class="collection-content-header"></div>');
            $header.append(`<h4>${c.title}</h4>`);
            $header.append(`
                <div>
                    <div><div>${ c.views }</div>Views</div>
                    <div><div>${ c.likes }</div>Likes</div>
                </div>`
            );

            this.modal.$header = $header;

            let $articleHtml = this.__supplyText__(_.assign(pt, c));
            let $body = $('<div class="boom-content-text"></div>');
            $body.append( $(`<button class="btn btn-success">编<br/>辑<br/>此<br/>文<br/>章</button>`)
                .click(e => {
                    this.parent.showArticle({
                        title: c.title,
                        digest: c.desc,
                        content: pt.text
                    });
                    this.modal.close();
                }));

            $body.append($articleHtml);

            this.modal.$body = $body;
            this.modal.open();
        });
    };

    render() {
        this.__getCollectionList__(list => {
            list.forEach(c => {
                let card = $(`<div class="card bg-white card-simple">
                                    <img src="" class="card-img-top img-responsive" style="display: block;"/>
                                    <div class="card-block">
                                        <h4 title="${c.title}" class="card-title content-title">${c.title}</h4>
                                        <p title="${c.desc}" class="card-text content-desc">${c.desc}</p>
                                    </div>
                            </div>`).click(e => {
                    this.__showArticleDetails__(c);
                });
                card.appendTo($collectionList);
            });
        });
        let $collectionList = $(`<div class="col col-md-12 collection-list-container"></div>`);

        return $collectionList;
    }
}