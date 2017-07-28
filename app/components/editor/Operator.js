'use strict';
import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props){
        super(props);

        this.rendered();
    }

    rendered = () => {
        this.find('.save').click(() => {
            this.parent.save(() => {

            });
        });

        this.find('.clear').click(() => {
            this.parent.clear();
        });

        this.find('.new').click(() => {
            this.parent.deepClear();
        });

        this.find('.copy').click(() => {
            this.parent.editor.copy('#copy-all');
        });
    };

    render() {
        return $(`
            <div class="row col-editor-operator">
                <span class="btn save">保存</span>
                <span class="btn clear">清空</span>
                <span class="btn new">新建</span>
                <span id="copy-all" class="btn copy">全文复制</span>
            </div>`
        );
    }
}