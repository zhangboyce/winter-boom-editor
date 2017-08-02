'use strict';

import Component from './../Component';
import upload from '../../utils/upload';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);

        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            multiple: true,
            success: result => {
                let json = JSON.parse(result);
                this.parent.categoryList.flush();
            }
        });

        this.__category__ = {  };
        this.rendered();
    }

    category = __category__ => {
        if (__category__ == undefined) {
            return this.__category__;
        } else {
            this.find('.change-category-title').text(__category__.name);

            if(__category__._id == 'ALL' || __category__._id == 'NO_CATEGORY'){
                this.find('.rename-category').hide();
                this.find('.delete-category').hide();
            }else{
                this.find('.rename-category').show();
                this.find('.delete-category').show();
            }

            this.__category__ = __category__;
        }
    };

    changeStatus = () => {
        if (this.parent.imageList.hasSelected()) {
            this.__activeStatus__();
        } else {
            $("[name=js-check-checkbox]:checkbox").prop("checked", false);
            this.__disableStatus__();
        }
    };

    __deleteCategory__ = (categoryId) => {
        this.confirm('是否确定删除该分组?', () => {
            $.get('/images/categories/delete/'+categoryId, json => {
                if (json.status == "ok") {
                    this.__category__ = {  };
                    this.parent.categoryList.flush();
                }
            });
        });
    };

    __editCategoryName__ = (id, categoryName, callback) =>{
        $.post('/images/categories/update/' + id, { name:categoryName }, json => {
            if(json.status == "ok"){
                this.parent.categoryList.flush();
                callback();
            }
        });
    };


    //激活状态[可操作]
    __activeStatus__ = () => {
        this.find('#js-move-group').removeAttr("disabled");
        this.find('#js-delete-chose').removeAttr("disabled");
    };

    //不可操作状态
    __disableStatus__ = () => {
        this.find('#js-move-group').attr("disabled", "disabled");
        this.find('#js-delete-chose').attr("disabled", "disabled");
    };

    rendered = () => {
        //多个删除
        this.find('#js-delete-chose').on("click", () => {
            this.parent.imageList.deleteSelectedImages();
        });

        //多个移动分组
        let $moveCategory = this.find('#js-move-group');
        this.__popover__($moveCategory, {
            title: `移动分组`,
            content: `<div id="category-radios"></div>`,
            ok: ($popover, callback) => {
                let category = $popover.find('input:radio[name="category"]:checked').attr('id');
                this.parent.imageList.moveSelectedImages(category, callback);
            },
            shown: $popover => {
                let choseCategoryList = [...this.parent.categoryList.getCategories()];
                let activeCategory = this.parent.pagination.category();
                let index = choseCategoryList.findIndex(it => it._id == activeCategory);
                if (index != -1) choseCategoryList.splice(index, 1);
                choseCategoryList.forEach(item => {
                    $popover.find('#category-radios').append(`
                    <label class="edit-radio-label" for="${item._id}">
                        <input type="radio" class="edit-radio" name="category"  id="${item._id}">
                            <span class="content">${item.name}</span>
                    </label>`
                    );
                });
            }
        });

        //全选,全不选以及相应的样式变化
        this.find('#js-check-all').click(() => {
            if (this.parent.imageList.isEmpty()) {
                this.__disableStatus__();
            } else {
                if ($("#js-check-all").prop("checked")) {
                    $("[name=image-item-checkbox]:checkbox").prop("checked", true);
                    this.parent.imageList.selectAll();
                } else {
                    $("[name=image-item-checkbox]:checkbox").prop("checked", false);
                    this.parent.imageList.unSelectAll();
                }
            }
        });

        this.find('.button-upload-local').click(() => {
            this.upload.click({categoryId: this.category()._id});
        });
        this.find('.delete-category').click(() => {
            this.__deleteCategory__(this.category()._id);
        });

        let $renameCategory = this.find('.rename-category');
        let oldCategoryName = '';
        this.__popover__($renameCategory, {
            title: `编辑名称`,
            content: `<input type="text" class="item-name-input" value=''>`,
            ok: ($popover, callback) => {
                let categoryName = $popover.find('.item-name-input').val();
                if (categoryName && categoryName.trim() && categoryName != oldCategoryName && categoryName.trim().length<7) {
                    this.__editCategoryName__(this.category()._id, categoryName, () => {
                        this.find('.change-category-title').text(categoryName);
                        isFunction(callback) && callback();
                    });
                } else {
                    this.message.warn('名称不完美!');
                }
            },
            shown: $popover => {
                oldCategoryName = this.find('.change-category-title').text();
                $popover.find('.item-name-input').val(oldCategoryName);
            }
        });


    };

    render() {
        return $(`
            <div class="modal-right-header">
               <div class="change-category">
                         <div class="col col-md-8">
                                <div>
                                        <span class="title change-category-title"></span>
                                        <span class="title rename-category">重命名</span>
                                        <span class="title delete-category">删除分组</span>
                                </div>
                        </div>
                        <div class="col col-md-4 text-right">
                            <span>大小不超过2M</span><span class="button-upload-local">本地上传</span>
                        </div>
               </div>
                <div class="col col-md-12">
                    <div class="operation-area">
                        <label class="chose_checkbox_label" for="js-check-all">
                        <input id="js-check-all" type="checkbox" name="js-check-checkbox" class="js-check-checkbox" data-label="全选">
                        <i class="icon_checkbox"></i>
                        <span class="content">&nbsp;全选</span></label>
                        <a id="js-move-group" class="a-move" href="javascript:;" disabled="disabled">移动分组</a>
                        <a id="js-delete-chose" class="a-delete" href="javascript:;" disabled="disabled">删除</a>
                    </div>
                </div>
            </div>
        `);
    }
}










