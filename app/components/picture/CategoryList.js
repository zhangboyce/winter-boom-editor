'use strict';
import Component from './../Component';

export default class extends Component {
    constructor(props) {
        super(props);

        this.rendered();
    }

    __loadTypes__ = callback => {
        $.get('/images/categories/list', json => {
            let types = json.list;
            types = [{_id: '', name: '全部图片'}, ...types];
            callback(types);
        });
    };


    __typeOnClick__ = (type, callback) => {
        return e => {
            e.stopPropagation();
            this.parent.pagination.category(type._id);
            this.parent.toolBar.category(type._id);
            this.parent.pagination.pagination(callback);
        };
    };

    //创建新的分类
    __createCategory__ = (imgname) => {

        $.post('/images/categories/save', {name: imgname}, json => {
            if (json.status == "ok") {
                let $createGroupDiv = $(`<div class="create-group-div"></div>`);
                $createGroupDiv.remove();
            }
        });
    };


    rendered = () => {
        this.__loadTypes__(types => {
            types.forEach(type => {
                let $li = $(`<li class="col col-md-12" categoryId='${type._id}'><a href="javascript:;">${type.name}</a></li>`);
                this.prepend($li);
                $li.click(this.__typeOnClick__(type, items => {
                    $li.addClass("active").siblings().removeClass("active");
                    //this.categoryId = type._id;
                    //this.page = 1;
                    //if (this.images.length < 1) {
                    //    this.__disableStatus__();
                    //}
                    this.parent.imageList.loadImages(items);
                }));
            });
            this.children('li').eq(0).click();
        });

        this.find('#create-category').click(() => {

        });
    };

    render() {
        return $(`
            <ul class="col col-md-12 ul-category">
                <li id="create-category" class="col col-md-12" style="padding-left: 10px;">
                    <a href="javascript:;"><i class="fa fa-plus"></i>新建分组</a>
                </li>
            </ul>
        `);
    }
}










