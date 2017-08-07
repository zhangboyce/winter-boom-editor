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

    __buildSelectImageModal__ = onClick => {
        let $body;
        let $images = this.parent.editor.editable.find('img');
        if ($images.length < 1) {
            $body = `<div class="select-image-note">很抱歉,正文中并没有可供选择的图片,请选择上传封面图片。</div>`
        } else {
            let $ul = $(`<ul></ul>`);
            let $lastIcon;
            let $selected;
            $images.each(function() {
                let $image = this;
                let $icon = $(`<div class="select-image-icon"><i class="fa fa-check-square"></i></div>`).hide();
                let $li = $('<li></li>').css({
                    background: `#fff url("${$image.src}") no-repeat scroll center center / cover `
                }).append($icon)
                    .hover(e => {
                        !($image === $selected) && $icon.show();
                    }, e => {
                        !($image === $selected) && $icon.hide();
                    }).click(e => {
                        if($selected === $image) return;
                        $selected = $image;
                        $lastIcon && $lastIcon.hide();
                        $lastIcon = $icon;
                        onClick($selected);
                    });

                $ul.append($li);
            });

            $body = $(`<div><p class="select-image-note">请从正文使用过的图片中选择封面:</p></div>`);
            $body.append($ul);
        }

        this.selectImageModal.$body = $body;
    };

    rendered = () => {
        this.$coverImg = this.find('.cover > img');

        let $cover = this.find('.cover');

        let $cover_desc;
        $cover_desc = $(`<div class="cover-desc"></div>`);
        $(`<a href="javascript:;">上传封面</a>`)
            .appendTo($cover_desc)
            .click(() => {
                this.parent.choosePicManagement.open(imageItem => {
                    this.cover(imageItem && 'http://editor.static.cceato.com/' + imageItem.key);
                })
            });

        let $selected;
        this.selectImageModal.$header = $(`<h4>从正文选择封面</h4>`);
        $(`<a href="javascript:;">从正文选择封面</a>`)
            .appendTo($cover_desc)
            .click(() => {
                this.__buildSelectImageModal__($image => {
                    $selected = $image;
                });

                this.selectImageModal.$footer = $(`<span class="btn">确    定</span>`).click(() => {
                    if ($selected && $selected.src) {
                        this.cover($selected.src);
                        $selected = null;
                    }
                    this.selectImageModal.close();
                });
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