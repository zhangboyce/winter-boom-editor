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
            types = [{_id: '', name: '全部图片'}, ...types].reverse();
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
                this.__hideAlert__();
                this.__loadTypes__();

            }
        });
    };

    //hide alert
    __hideAlert__ = () =>{
        $(document).ready( ()=> {
            $(document).on("click", ".js-canncel-btn", () => {
                let $createCategory  = this.find('#create-category');
                $createCategory.popover('hide');
            });
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

       let $createCategory  = this.find('#create-category');

        //$createCategory.click(() => {
        //});

        let createCategoryHtml = (`
                    <div class="edit-popover-warp">
                            <div class="popover-inner">
                                <div class="edit-popover-content">
                                    <div class="popover-edit">
                                        <label for="" class="edit-label"></label>
                                        <div class="edit-controls">
                                        <span class="edit-input-box">
                                            <input type="text" class="edit-input js-name" value=''>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="popover-bar">
                                     <a href="javascript:;" class="btn btn-primary js-commitb-btn">确定</a>
                                     <a href="javascript:;" class="btn btn-default js-canncel-btn">取消</a>
                                </div>
                            </div>
                    </div>

            `);

        $createCategory.popover(
            {
                trigger: 'click',
                html: true,
                placement: "bottom",
                content: createCategoryHtml
            }
        );


        $(document).ready( ()=> {
            $(document).on("click", ".js-commitb-btn", () => {
                let val = $(".edit-input").val();
                this.__createCategory__(val);
            });

            this.__hideAlert__();


        });

        /*
         $createCategory.on('hidden.bs.popover',  () => {
            $createCategory.trigger("click");
         })
        */




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










