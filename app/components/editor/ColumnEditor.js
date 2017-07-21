'use strict';
import Component from './../Component';
import Title from './Title';
import Editor from './Editor';
import Operator from './Operator';

export default class extends Component {

    constructor(props) {
        super(props);
        this.title = new Title({ parent: this});
        this.editor = new Editor({ parent: this});
        this.operator = new Operator({ parent: this});

        this.originArticle = new Article({});
    }

    insert = $node => {
        this.editor.insert($node);
    };

    save = callback => {
        let article = new Article({
            title: this.title.getTitle(),
            author: this.title.getAuthor(),
            //source: sourceInput.val(),
            cover: this.title.getCover(),
            //digest:summary ,
            content: this.editor.getContent()
        });

        if(!this.originArticle.isEmpty() ?
                article.isEquals(this.originArticle) :
                article.isEmpty()) {
            callback && callback();
            return;
        }
        let url;
        if(this.originArticle.id) {
            url = '/article/update/' + this.originArticle.id;
        }else {
            url = '/article/save';
        }
        $.post(url, { data: article.toJson() }, json => {
            this.originArticle = article;
            this.originArticle.id = json.id;
            callback && callback(article);
        });
    };

    clear = () => {
        this.editor.clear();
        this.title.clear();
    };

    deepClear = () => {
        this.clear();
        this.originArticle = new Article({});
    };

    render() {
        let $columnEditor = $(`<div class="col col-md-6 col-editor"></div>`);
        $columnEditor.append(this.title.render());
        $columnEditor.append(this.editor.render());
        $columnEditor.append(this.operator.render());

        return $columnEditor;
    }
}

function Article(options) {
    if (!(this instanceof Article)) {
        return new Article(options);
    }
    options = options || {};

    this.id = options.id || '';
    this.title = options.title || '';
    this.author = options.author || '';
    this.source = options.source || '';
    this.cover = options.cover || '';
    this.digest = options.digest || '';
    this.content = options.content || '';

}

Article.prototype.isEmpty = function() {
    for(let k in this) {
        if (this.hasOwnProperty(k)) {
            let v = this[k];
            if(v && v.trim()) {
                return false;
            }
        }
    }
    return true;
};

Article.prototype.isEquals = function(obj) {
    let article = new Article(obj);

    return article.title == this.title &&
        article.author == this.author &&
        article.source == this.source &&
        article.cover == this.cover &&
        article.digest == this.digest &&
        article.content == this.content ;

};

Article.prototype.toJson = function () {
    let json = {  };
    for(let k in this) {
        if (this.hasOwnProperty(k)) {
            json[k] = this[k];
        }
    }

    return json;
};