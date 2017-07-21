'use strict';
import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props){
        super(props);

        this.$sourceInput = {};
        this.$digestTextarea = {};
    }

    getDigest = () => {
        return this.$digestTextarea.val();
    };

    getSource = () => {
        return this.$sourceInput.val();
    };

    setDigest = digest => {
        this.$digestTextarea.val(digest);
    };

    setSource = source => {
        this.$sourceInput.val(source);
    };

    clear = () => {
        this.setDigest('');
        this.setSource('');
    };

    render() {
        let $editorFooter = $(`<div class="row col-editor-footer"></div>`);

        let $sourceEditor = $(`<div class="col-editor-footer-source"></div>`);
        this.$sourceInput = $('<input type="text" placeholder="请输入原文链接"/>');
        let $label = $(`<label>原文链接</label>`);
        $sourceEditor.append($label);
        $sourceEditor.append($(`<div></div>`).append(this.$sourceInput));

        let $digestEditor = $(
            `<div class="col-editor-footer-digest">
                <div>
                    <label>摘要</label>
                    <span>选填，如果不填写会默认抓取正文前54个字</span>
                </div>
            </div>`
        );
        this.$digestTextarea = $('<textarea></textarea>');
        $digestEditor.append(this.$digestTextarea);

        $editorFooter.append($sourceEditor);
        $editorFooter.append($digestEditor);

        return $editorFooter;
    }
}