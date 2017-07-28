'use strict';
import Component from './../Component';
import Title from './Title';
import Editor from './Editor';
import EditorFooter from './EditorFooter';
import Operator from './Operator';
import Message from '../common/Message';
import ConfirmModal from '../common/ConfirmModal';

export default class extends Component {
    constructor(props) {
        super(props);
        this.title = new Title({ parent: this});
        this.editor = new Editor({ parent: this});
        this.editorFooter = new EditorFooter({ parent: this });
        this.operator = new Operator({ parent: this});
        this.originArticle = new Article({});

        this.rendered()
    }

    insert = $node => {
        this.editor.insert($node);
    };

    showArticle = article => {
        this.__check__(() => {
            this.originArticle = new Article(article);

            this.title.title(article.title || '');
            this.title.author(article.author || '');
            this.title.cover(article.cover || '');
            this.editorFooter.source(article.source || '');
            this.editorFooter.digest(article.digest || '');
            this.editor.content(article.content || '');
        });
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
        this.__check__(() => {
            this.editor.clear();
            this.title.clear();
            this.editorFooter.clear();
            this.message.success('已清空内容');
        });
    };

    deepClear = () => {
        this.showArticle({});
    };

    __check__ = callback => {
        let article = this.__getArticle__();
        if(!this.originArticle) {
            if(!article.isEmpty()) {
                this.confirm('未保存的临时文档，操作后内容将无法恢复,是否确认执行操作?', callback);
            }
        }else {
            if(!article.isEquals(this.originArticle)) {
                this.confirm('文档内容已更新，操作后内容将无法恢复,是否确认执行操作?', callback);
            }
        }
    };

    __getArticle__ = () => {
        return new Article({
            title: this.title.title(),
            author: this.title.author(),
            cover: this.title.cover(),
            source: this.editorFooter.source(),
            digest: this.editorFooter.digest() ,
            content: this.editor.content()
        });
    };

    rendered() {
        this.append(this.title);
        this.append(this.editor);
        this.append(this.editorFooter);
        this.append(this.operator);
    }

    render() {
        return $(`<div class="col col-md-6 col-editor"></div>`);
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