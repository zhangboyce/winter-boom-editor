'use strict';
import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props){
        super(props);

        this.$sourceInput = null;
        this.$digestTextarea = null;

        this.rendered();
    }

    rendered = () => {
        this.$sourceInput = this.find('.col-editor-footer-source input');
        this.$digestTextarea = this.find('.col-editor-footer-digest textarea');
    };

    digest = val => {
        if (val == undefined) {
            return this.$digestTextarea.val();
        } else {
            this.$digestTextarea.val(val);
        }
    };

    source = val => {
        if (val == undefined) {
            return this.$sourceInput.val();
        } else {
            this.$sourceInput.val(val);
        }
    };

    clear = () => {
        this.digest('');
        this.source('');
    };

    isEmpty = () => {
        let digest = this.digest();
        let source = this.source();

        return !(digest && digest.trim() || source && source.trim());
    };

    render() {
        return $(`
            <div class="row col-editor-footer">
                <div class="col-editor-footer-source">
                    <label>原文链接</label>
                    <div>
                        <input type="text" placeholder="请输入原文链接" />
                    </div>
                </div>
                <div class="col-editor-footer-digest">
                    <div>
                        <label>摘要</label>
                        <span>选填，如果不填写会默认抓取正文前54个字</span>
                    </div>
                    <textarea></textarea>
                </div>
            </div>
        `);
    }
}