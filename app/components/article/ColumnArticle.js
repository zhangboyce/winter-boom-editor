'use strict';
import Component from './../Component';
import ArticleList from './ArticleList';
import CollectionList from './CollectionList';

export default class extends Component {

    constructor(props) {
        super(props);
        this.articleSaveList = new ArticleList();
        this.collectionList = new CollectionList();
    }

    render() {
        let $columnArticle = $(`<div class="col col-md-2 col-article"></div>`);
        let $row = $(`<div class="row"></div>`).appendTo($columnArticle);
        let $tabNavbar = $('<div class="col col-md-2 tab-nav-bar"></div>');
        $row.append($tabNavbar);

        let $List = $('<div class="col change-list"></div>');
        $List.appendTo($row);
        let $articleList = $('<div class="col article-list"></div>');
        let $collectionList = $('<div class="col collection-list"></div>');
        $List.append($articleList);
        $List.append($collectionList);

        let $leftTab = $(`<span class="col col-md-6 save-article-bar">保存的文章</span>`);
        $leftTab.click(() => {
            $leftTab.addClass("active").siblings().removeClass("active");
            $articleList.empty();
            $articleList.append(this.articleSaveList.render());
            $articleList.show();
            $collectionList.hide();
        }).appendTo($tabNavbar);

        let $rightTab = $(`<span class="col col-md-6 collection-article-bar">我的收藏</span>`);
        $rightTab.click(() => {
            $rightTab.addClass("active").siblings().removeClass("active");
            $collectionList.empty();
            $collectionList.append(this.collectionList.render());
            $articleList.hide();
            $collectionList.show();
        }).appendTo($tabNavbar);

        $leftTab.click();

        return $columnArticle;
    }
}