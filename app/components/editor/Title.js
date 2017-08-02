'use strict';
import Component from './../Component';
import upload from '../../utils/upload';
import Modal from '../common/Modal';

export default class extends Component {
    constructor(props){
        super(props);

        this.selectImageModal = new Modal({ id: 'selectImageModal' });
        this.$titleInput = null;
        this.$authorInput = null;
        this.$coverImg = null;
        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            success: keys => {
                this.cover('http://editor.static.cceato.com/' + keys[0]);
            }
        });

        this.rendered();
    }

    title = val => {
        if (val == undefined) {
            return this.$titleInput.val();
        } else {
            this.$titleInput.val(val);
        }
    };

    author = val => {
        if (val == undefined) {
            return this.$authorInput.val();
        } else {
            this.$authorInput.val(val);
        }
    };

    cover = val => {
        if (val == undefined) {
            return this.$coverImg.val();
        } else {
            if(val) {
                this.$coverImg.attr('src', val);
            }else {
                this.$coverImg.removeAttr('src');
            }
        }
    };

    clear = () => {
        this.title('');
        this.author('');
        this.cover('');
    };

    __buildSelectImageModal__ = () => {
        let images = this.parent.editable.find('img');

    };

    rendered = () => {
        this.$coverImg = this.find('.cover > img');

        let $cover = this.find('.cover');

        let $cover_desc;
        $cover_desc = $(`<div class="cover-desc"></div>`);
        $(`<a href="javascript:;">上传封面</a>`)
            .appendTo($cover_desc)
            .click(() => {
                this.upload.click();
            });

        $(`<a href="javascript:;">正文选择封面</a>`)
            .appendTo($cover_desc)
            .click(() => {
                this.__buildSelectImageModal__();
                this.selectImageModal.open();
            });
        $cover.append($cover_desc.hide());

        $cover.hover(() => {
            $cover.find('.cover-desc').fadeIn();
            $cover.find('i').fadeOut();
        }, () => {
            $cover.find('.cover-desc').fadeOut();
            $cover.find('i').fadeIn();
        });

        this.$titleInput = this.find('input[name="title"]');
        this.$authorInput = this.find('input[name="author"]');

        let $titleCover = this.find('.title');
        this.$titleInput.keyup(() => {
            let val = this.$titleInput.val();
            val = (val && val.trim()) || '标题';
            $titleCover.text(val.trim());
        });
    };

    render() {
        return $(`
            <div class="row col-editor-title">
                <div class="col-md-8">
                    <input name="title" type="text" placeholder="请输入标题" />
                    <input name="author" type="text" placeholder="请输入作者" />
                </div>
                <div class="col-md-4">
                    <div class="cover">
                        <img src="">
                        <i class="fa fa-picture-o fa-3x"></i>
                    </div>
                    <div class="title">标题</div>
                </div>
            </div>
        `);
    }
}