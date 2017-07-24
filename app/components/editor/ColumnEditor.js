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
        this.editorFooter = new EditorFooter({ parent: this });
        this.operator = new Operator({ parent: this});
        this.message = new Message();

        this.originArticle = new Article({});
    }

    insert = $node => {
        this.editor.insert($node);
    };

    showArticle = article => {
        if(!this.__check__()) {
            return;
        }
        this.originArticle = new Article(article);

        this.title.setTitle(article.title || '');
        this.title.setAuthor(article.author || '');
        this.title.setCover(article.cover || '');
        this.editorFooter.setSource(article.source || '');
        this.editorFooter.setDigest(article.digest || '');
        this.editor.setContent(article.content || '');
    };

    save = callback => {
        let article = this.__getArticle__();
        if(!this.originArticle.isEmpty() ?
                article.isEquals(this.originArticle) :
                article.isEmpty()) {
            callback && callback(article);

            this.message.info('已保存');
            return;
        }
        let url;
        if(this.originArticle._id) {
            article._id = this.originArticle._id;
            url = '/article/update';
        }else {
            url = '/article/save';
        }
        $.post(url, article.clone(), json => {
            callback && callback(json.article);
            if (json && json.status == 'ok') {
                this.originArticle = article;
                this.originArticle._id = json.article._id;

                this.parent.columnArticle.addArticle(json.article);
                this.message.success('保存成功');
            } else {
                this.message.error('保存失败');
            }
        });
    };

    clear = () => {
        if(!this.__check__()) {
            return;
        }

        this.editor.clear();
        this.title.clear();
        this.editorFooter.clear();
        this.message.success('已清空内容');
    };

    deepClear = () => {
        this.showArticle({});
    };

    __check__ = () => {
        let article = this.__getArticle__();
        if(!this.originArticle) {
            if(!article.isEmpty() && !confirm('未保存的临时文档，操作后内容将无法恢复,是否确认执行操作?')) {
                return false;
            }
        }else {
            if(!article.isEquals(this.originArticle) && !confirm('文档内容已更新，操作后内容将无法恢复,是否确认执行操作?')) {
                return false;
            }
        }
        return true;
    };

    __getArticle__ = () => {
        return new Article({
            title: this.title.getTitle(),
            author: this.title.getAuthor(),
            cover: this.title.getCover(),
            source: this.editorFooter.getSource(),
            digest: this.editorFooter.getDigest() ,
            content: this.editor.getContent()
        });
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

    this._id = options._id || '';
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