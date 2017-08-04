'use strict';
import _ from 'lodash';
import Component from './../Component';
import SyncArticle from './SyncArticle';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.$articleList = {};
        this.articles = [];

        this.rendered();
    }

    empty = () => {
        this.$articleList.empty();
    };

    addArticle = article => {
        if (!article) return;

        let index = this.articles.findIndex(art => art.id == article.id);
        if (index == -1) {
            this.articles.push(article);
            this.$articleList.prepend(this.__build$Article__(article));
        } else {
            $(`#article_${article._id}`).remove();
            this.articles.splice(1, index);
            this.articles.push(article);
            this.$articleList.prepend(this.__build$Article__(article));
        }
    };

    __getArticleList__ = callback => {
        $.getJSON('/article/list', result => {
            this.articles = result.list;
            callback && callback();
        });
    };

    __build$Article__ = article => {
        let delBtn = this.__buildDelBtn__(article);
        let editBtn = this.__buildEditBtn__(article);
        let isShow = false;
        let showTimeout;

        return $(`<div class="article" id="article_${article._id}"></div>`).css({
            'background': `rgba(0, 0, 0, 0) url("${article.cover || 'http://boom-static.static.cceato.com/images/shirt.png'}") no-repeat scroll center center / cover`
        }).click(() => {
            this.parent.showArticle(article);
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
            .append(this.__buildTitle__(article))
    };

    __buildTitle__ = article => {
        let $title = $(`<div class="title"><span>${article.title}</span></div>`);
        let $updatetime = $(`<div class="datatime">${article.lastUpdated.substring(0, 10)}</div>`);
        $title.append($updatetime);
        return $title;
    };

    __buildDelBtn__ = article => {
        let $delBtn = $(`<a class ="delete-article" title="删除文章"></a>`)
            .hide()
            .append($('<i class="icon-trash" style="color: #fff;"></i>'));

        this.__popover__($delBtn, {
            title: ``,
            placement: 'left',
            content: `<div>确定删除该文章?</div>`,
            ok: ($popover, callback) => {
                this.__deleteArticle__(article._id, callback);
                return false;
            }
        });

        return $delBtn;
    };

    __buildEditBtn__ = article => {
        return $(`<a class="edit-article" title="编辑文章"></a>`)
            .hide()
            .append($('<i class="fa fa-pencil-square-o" style="color: #fff;"></i>'))
            .click(e => {
                this.parent.showArticle(article);
                return false;
            });
    };

    __deleteArticle__ = (id, callback) => {
        //@TODO 需要判断是否是当前正在编辑的文章
        $.getJSON('/article/delete/' + id, json => {
            $('#article_' + id).remove();
            isFunction(callback) && callback();
        });
    };

    rendered = () => {
        this.$articleList = this.find('.body-content');
        this.__getArticleList__(() => {
            this.articles.forEach(article => {
                this.$articleList.append(this.__build$Article__(article));
            });
        });

        this.find('.sync-article-btn').click(() => {
            SyncArticle();
        });
    };

    render() {
        return $(`
            <div class=" col col-md-12 article-list">
                <div class="header-content">
                    <div class="sync-article-btn">同步文章</div>
                </div>
                <div class="body-content"></div>
            </div>
        `);
    }
}