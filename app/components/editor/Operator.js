'use strict';
import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props){
        super(props);
    }

    render() {
        let $operator = $(`<div class="row col-editor-operator"></div>`);

        let $saveBtn = $(`<span class="btn save">保存</span>`).appendTo($operator);
        let $clearBtn = $(`<span class="btn">清空</span>`).appendTo($operator);
        let $newBtn = $(`<span class="btn">新建</span>`).appendTo($operator);
        let $copyBtn = $(`<span id="copy-all" class="btn">全文复制</span>`).appendTo($operator);
        let $previewBtn = $(`<span class="btn">预览</span>`)//.appendTo($operator);

        $saveBtn.click(() => {
            this.parent.save(() => {

            });
        });

        $clearBtn.click(() => {
            this.parent.clear();
        });

        $newBtn.click(() => {
            this.parent.deepClear();
        });

        $copyBtn.click(() => {
            this.parent.editor.copy('#copy-all');
        });

        return $operator;
    }
}