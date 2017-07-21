'use strict';
import Component from './../Component';
import Title from './Title';
import Editor from './Editor';
import EditorFooter from './EditorFooter';
import Operator from './Operator';
import Message from '../common/Message';

export default class extends Component {

    constructor(props) {
        super(props);
        this.title = new Title({ parent: this});
        this.editor = new Editor({ parent: this});
        this.editorFooter = new EditorFooter({ parent: this});
        this.operator = new Operator({ parent: this});
        this.message = new Message();

        this.originArticle = new Article({});
    }

    insert = $node => {
        this.editor.insert($node);
    };

    save = callback => {
        let article = new Article({
            title: this.title.getTitle(),
            author: this.title.getAuthor(),
            source: this.editorFooter.getSource(),
            cover: this.title.getCover(),
            digest: this.editorFooter.getDigest() ,
            content: this.editor.getContent()
        });

        if(!this.originArticle.isEmpty() ?
                article.isEquals(this.originArticle) :
                article.isEmpty()) {
            callback && callback();

            this.message.info('已保存');
            return;
        }
        let url;
        if(this.originArticle.id) {
            article.id = this.originArticle.id;
            url = '/article/update';
        }else {
            url = '/article/save';
        }
        $.post(url, article.clone(), json => {
            if (json && json.status == 'ok') {
                this.originArticle = article;
                this.originArticle.id = json.id;

                this.message.success('保存成功');
            } else {
                this.message.error('保存失败');
            }
            callback && callback(article);
        });
    };

    clear = () => {
        this.editor.clear();
        this.title.clear();
        this.editorFooter.clear();
        this.message.success('已清空内容');
    };

    deepClear = () => {
        this.clear();
        this.originArticle = new Article({});
    };

    render() {
        let $columnEditor = $(`<div class="col col-md-6 col-editor"></div>`);
        $columnEditor.append(this.title.render());
        $columnEditor.append(this.editor.render());
        $columnEditor.append(this.editorFooter.render());
        $columnEditor.append(this.operator.render());
        $columnEditor.append(this.message.render());

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

Article.prototype.clone = function () {
    let obj = {  };
    for(let k in this) {
        if (Object.prototype.hasOwnProperty.call(this, k)) {
            obj[k] = this[k];
        }
    }
    return obj;
};