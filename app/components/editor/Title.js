'use strict';
import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props){
        super(props);

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

    rendered = () => {
        this.$coverImg = this.find('.cover > img');

        let $cover = this.find('.cover');
        let $cover_desc;
        $cover.click(() => {
            upload({
                name: 'image',
                url: () => ('/upload/image/'),
                change: () => confirm('确认上传新图片？'),
                success: result => {
                    let json = JSON.parse(result);
                    this.cover('http://editor.static.cceato.com/' + json.key);
                }
            }).click();
        }).hover(() => {
            $cover_desc = $(`<div class="cover-desc">添加封面</div>`);
            $cover.append($cover_desc);
        }, () => {
            $cover_desc.remove();
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
                        <img src="/static/images/default_cover.jpg">
                    </div>
                    <div class="title">标题</div>
                </div>
            </div>
        `);
    }
}