'use strict';
import _ from 'lodash';
import Component from './../Component';
import SyncArticle from './SyncArticle';

let articleList;

export default class extends Component {

    __getArticleList__ = callback => {
        $.getJSON('/article/list', result => {
            let list = result.list;
            articleList = list;
            callback(articleList);
        });
    };

    __buildTitle__ = list => {
        let $title = $(`<div class="title"><span>${list.title}</span></div>`);
        let $updatetime = $(`<div class="datatime">${list.lastUpdated.substring(0, 10)}</div>`);
        $title.append($updatetime);
        return $title;
    };

    __buildDelBtn__ = article => {
        return $(`<a class ="delete-article" title="删除文章"></a>`)
            .hide()
            .append($('<i class="icon-trash" style="color: #fff;"></i>'))
            .click(e => {
                this.__deleteArticle__(article._id);
                return false;
            });
    };

    __buildEditBtn__ = article => {
        return $(`<a class="edit-article" title="编辑文章"></a>`)
            .hide()
            .append($('<i class="fa fa-pencil-square-o" style="color: #fff;"></i>'))
            .click(e => {
                return false;
            });
    };

    __deleteArticle__ = id => {
        //@TODO 需要判断是否是当前正在编辑的文章
        if (confirm('确定删除此文章吗？')) {
            $.getJSON('/article/delete/' + id, json => {
                $('#article_' + id).remove();
            });
        }
    };

    render() {

        let $articleList = $(`<div class=" col col-md-12 article-list-container"></div>`);
        let $btnHeader = $('<div class="header-content"></div>');
        let $bodyContent = $('<div class="body-content"></div>');
        $articleList.append($btnHeader);
        $articleList.append($bodyContent);

        let $btnArea = $('<div class="sync-article-btn">同步文章</div>');

        $btnArea.click( () => {
            SyncArticle();
        });
        $btnHeader.append($btnArea);

        this.__getArticleList__(articleList => {
            articleList.forEach(article => {
                let delBtn = this.__buildDelBtn__(article);
                let editBtn = this.__buildEditBtn__(article);
                let isShow = false;
                let showTimeout;

                let $li = $(`<div class="article-list" id="article_${article._id}"></div>`).css({
                    'background': `rgba(0, 0, 0, 0) url("${article.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`
                }).click(function () {
                    //showArticle(a._id);
                }).hover(() => {
                        showTimeout = setTimeout(function () {
                            delBtn.show('fast');
                            editBtn.show('fast');
                            isShow = true;
                        }, 200);
                    }, () => {
                        if (isShow) {
                            delBtn.hide('fast');
                            editBtn.hide('fast');
                            isShow = false;
                        } else {
                            clearTimeout(showTimeout);
                            showTimeout = false;
                        }
                    })
                    .append(delBtn)
                    .append(editBtn)
                    .appendTo($bodyContent)
                    .append(this.__buildTitle__(article));
            });
        });
        return $articleList;
    }
}