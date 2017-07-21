'use strict';
import Component from './../Component';
import StyleTool from './StyleTool';
import range from '../../utils/range';
import dom from '../../utils/dom';
import _ from 'lodash';

export default class extends Component {
    constructor(props){
        super(props);

        this.editorDom = {};
        this.context = {};
        this.editable = {};
        this.lastSection = '';
        this.styleTool = {};
    }

    insert = $node => {
        let section = this.__insertSection__($node);
        this.editorDom.trigger('summernote.change');
        section.click(e => {
            this.__setLastSection__(section);
        });
        this.__setLastSection__(section);
    };

    copy = target => {
        this.styleTool.copy(target, this.editable.html())
    };

    clear =() => {
        if (!this.isEmpty() && confirm("是否确认清空文档?")) {
            this.editable.empty();
        }
    };

    isEmpty = () => {
        return dom.isEmpty(this.editable[0]) || dom.emptyPara === this.editable.html();
    };

    getContent = () => {
        return this.context.invoke('editor.isEmpty') ? '' : this.context.code()
    };

    setContent = content => {
        this.context.code(content || '');
    };

    __insertSection__ = $node => {
        let section = $('<section class="winter-section"></section>')
            .css({'margin-bottom': '5px'})
            .append($node);

        if (this.isEmpty()) {
            this.editable.empty();
            this.lastSection = undefined;
        }

        if (this.lastSection) {
            section.insertAfter(this.lastSection);
        } else {
            this.editable.append(section);
        }
        let textNode = _.find(section.find('*').contents(), c => {
            if (c.nodeType && c.nodeType === 3 && _.trim(c.textContent).length > 0) {
                return c;
            }
        });
        if (textNode) {
            let r = range.create(textNode, 0, textNode, 0);
            r.select();
            this.editable.focus();
        }
        return section;
    };

    __buildSummerEditor__ = $dom => {
        let __onFocus__ = this.__onFocus__;

        return $dom.summernote({
            toolbar: [
                ['color', ['color', 'video']],
                ['font', ['bold', 'underline', 'clear']]
            ],
            airMode: true,
            placeholder: '从这里开始写正文',
            callbacks: { onFocus: __onFocus__ }
        });
    };

    __onFocus__ = () => {
        if (dom.isEmpty(this.editable[0]) || dom.emptyPara === this.editable.html()) {
            let section = $('<section class="winter-section" style="margin-bottom: 5px;"><p><br/></p></section>');
            $('.note-editable').html(section);

            section.click(() => {
                this.__setLastSection__(section);
            });
            this.__setLastSection__(section);
        }
    };

    //判断是否有向上的移动图标
    __hasUpBtnIcon__ = () => {
        let prevDom = this.lastSection.prev();
        if (prevDom.length < 1) {
            $("#up-btn-editor").hide();
        } else {
            $("#up-btn-editor").show();
        }
    };

    //判断是否有向下的移动图标
    __hasDownBtnIcon__ = () => {
        let nextDom = this.lastSection.next();
        if (nextDom.length < 1) {
            $("#down-btn-editor").hide();
        } else {
            $("#down-btn-editor").show();
        }
    };

    //@TODO 仅仅增加一个class效果并不好，最好还是外套div，先这样。
    __setLastSection__ = section => {
        if (this.lastSection) {
            this.lastSection.removeClass('winter-section-active');
        }
        this.lastSection = section;
        if (this.lastSection) {
            this.styleTool.exec(section);
            this.lastSection.addClass('winter-section-active');

            this.__hasUpBtnIcon__();
            this.__hasDownBtnIcon__();

        } else {
            this.styleTool.hide();
        }
    };

    render() {
        let $wrapper = $(`<div class="row col-editor-wrapper"></div>`);
        let $editorDom = $('<div style="width: 100%;height: 100%;"></div>');

        $wrapper.append($editorDom);
        this.__buildSummerEditor__($editorDom);

        this.editorDom = $editorDom;
        this.context = $editorDom.data('summernote');
        this.editable = this.context.layoutInfo.editable;
        this.styleTool = StyleTool(this.editable, { setLastSection: this.__setLastSection__ });

        this.editable.keyup(() => {
            if (!this.lastSection ||
                this.lastSection.html() === dom.emptyPara ||
                this.lastSection.html() === '<p></p>') {
                this.styleTool.removeSection();
            }
        });

        //设置air模式的editor高度
        let editorHeight = '400px';
        this.editable.css('min-height', editorHeight)
            .parent().css('min-height', editorHeight)
            .parent().css('min-height', editorHeight);

        return $wrapper;
    }
}