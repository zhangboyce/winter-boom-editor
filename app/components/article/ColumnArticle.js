'use strict';
import Component from './../Component';
import ArticleList from './ArticleList';
import CollectionList from './CollectionList';

export default class extends Component {

    constructor(props) {
        super(props);
        this.articleList = new ArticleList({ parent: this });
        this.collectionList = new CollectionList({ parent: this });

        this.rendered();
    }

    showArticle = article => {
        this.editor.showArticle(article);
    };

    addArticle = article => {
        this.articleList.addArticle(article);
    };

    rendered = () => {
        let $articleList = this.find('.article-list');
        let $collectionList = this.find('.collection-list');
        let $leftTab = this.find('.save-article-bar');
        let $rightTab = this.find('.collection-article-bar');

        $leftTab.click(() => {
            $leftTab.addClass("active").siblings().removeClass("active");
            $articleList.empty();
            $articleList.append(this.articleList);
            $articleList.show();
            $collectionList.hide();
        });

        $rightTab.click(() => {
            $rightTab.addClass("active").siblings().removeClass("active");
            $collectionList.empty();
            this.articleList.empty();
            $collectionList.append(this.collectionList);
            $articleList.hide();
            $collectionList.show();
        });

        $leftTab.click();
    };

    render() {
        return $(`
            <div class="col col-md-2 col-article">
                <div class="row">
                    <div class="col col-md-2 tab-nav-bar">
                        <span class="col col-md-6 save-article-bar">保存的文章</span>
                        <span class="col col-md-6 collection-article-bar">我的收藏</span>
                    </div>
                    <div class="col change-list">
                        <div class="col article-list"></div>
                        <div class="col collection-list"></div>
                    </div>
                </div>
            </div>
        `)
    }
}