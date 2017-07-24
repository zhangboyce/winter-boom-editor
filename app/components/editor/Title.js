'use strict';
import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props){
        super(props);

        this.$titleInput = $('<input name="title" type="text" placeholder="请输入标题"/>');
        this.$authorInput = $('<input name="author" type="text" placeholder="请输入作者"/>');
        this.$coverImg = $(`<img src="/static/images/default_cover.jpg">`);

        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            change: () => confirm('确认上传新图片？'),
            success: result => {
                let json = JSON.parse(result);
                this.$coverImg.attr('src', 'http://editor.static.cceato.com/' + json.key);
            }
        });

        this.$titleCover = $(`<div class="title">标题</div>`);
        this.$titleInput.keyup(() => {
            let val = this.$titleInput.val();
            val = (val && val.trim()) || '标题';
            this.$titleCover.text(val.trim());
        });
    }

    getTitle = () => {
        return this.$titleInput.val();
    };

    setTitle = title => {
        this.$titleInput.val(title);
    };

    getAuthor = () => {
        return this.$authorInput.val();
    };

    setAuthor = author => {
        this.$authorInput.val(author);
    };

    getCover = () => {
        return this.$coverImg.attr('src');
    };

    setCover = cover => {
        if(cover) {
            this.$coverImg.attr('src', cover);
        }else {
            this.$coverImg.removeAttr('src');
        }
    };

    clear = () => {
        this.setTitle('');
        this.setAuthor('');
        this.setCover('');
    };

    render() {
        let $titlePanel = $(`<div class="row col-editor-title"></div>`);
        let $titlePanelLeft = $(`<div class="col-md-8"></div>`);
        let $titlePanelRight = $(`<div class="col-md-4"></div>`);
        $titlePanel.append($titlePanelLeft);
        $titlePanel.append($titlePanelRight);

        $titlePanelLeft.append(this.$titleInput);
        $titlePanelLeft.append(this.$authorInput);

        let $coverDiv = $(`<div class="cover"></div>`);
        $titlePanelRight.append($coverDiv);
        $titlePanelRight.append(this.$titleCover);

        $coverDiv.append(`<div>添加封面</div>`);
        $coverDiv.append(this.$coverImg);

        $coverDiv.click(() => {
            this.upload.click();
        });

        return $titlePanel;
    }
}