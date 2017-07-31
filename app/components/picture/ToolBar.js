'use strict';

import Component from './../Component';
import upload from '../../utils/upload';

export default class extends Component {
    constructor(props) {
        super(props);

        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            success: result => {
                let json = JSON.parse(result);
                this.parent.uploadCallback(json.item);
            }
        });

        this.__category__ = '';

        this.rendered();
    }

    category = category => {
        if (category == undefined) {
            return this.__category__;
        }else {
            this.__category__ = category;
        }
    };

    changeStatus = () => {
        if (this.parent.imageList.hasSelected()) {
            this.__activeStatus__();
        } else {
            this.__disableStatus__();
        }
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
                this.parent.imageList.moveSelectedImages(category, () => {
                    this.parent.flush();
                    callback();
                });
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
            this.upload.click({ categoryId: this.category() });
        });
    };

    render() {
        return $(`
            <div class="modal-right-header">
                <div class="col col-md-8 padd">
                    <div class="operation-area">
                        <label class="chose_checkbox_label" for="js-check-all">
                        <input id="js-check-all" type="checkbox" class="frm_checkbox" data-label="全选">
                        <i class="icon_checkbox"></i>
                        <span class="content">&nbsp;全选</span></label>
                        <a id="js-move-group" href="javascript:;" disabled="disabled">移动分组</a>
                        <a id="js-delete-chose" href="javascript:;" disabled="disabled">删除</a>
                    </div>
                </div>
                <div class="col col-md-4 text-right">
                    <span>大小不超过2M</span><span class="button-upload-local">本地上传</span>
                </div>
            </div>
        `);
    }
}










