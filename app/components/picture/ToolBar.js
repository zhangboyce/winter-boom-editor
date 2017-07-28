'use strict';

import Component from './../Component';
import upload from '../../utils/uploadImageNew';

export default class extends Component {
    constructor(props) {
        super(props);

        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            success: result => {
                let json = JSON.parse(result);
                this.parent.imageList.addItem(json.item);
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
        if (this.parent.imageList.isSelected()) {
            this.__activeStatus__();
        } else {
            this.__disableStatus__();
        }
    };

    //激活状态[可操作]
    __activeStatus__ = () => {
        let $buttonMoveCategory = $('#js-move-group');
        let $buttonDelete = $('#js-delete-chose');
        $buttonMoveCategory.removeClass("active");
        $buttonMoveCategory.removeAttr("disabled");
        $buttonDelete.removeClass("active");
        $buttonDelete.removeAttr("disabled");
    };

    //不可操作状态
    __disableStatus__ = () => {
        let $buttonMoveCategory = $('#js-move-group');
        let $buttonDelete = $('#js-delete-chose');
        $buttonMoveCategory.addClass("active");
        $buttonMoveCategory.attr("disabled", "disabled");
        $buttonDelete.addClass("active");
        $buttonDelete.attr("disabled", "disabled");
    };

    rendered = () => {
        //多个删除
        this.find('#js-delete-chose').on("click", () => {
            this.parent.imageList.deleteSelectedImages();
        });

        //多个移动分组
        this.find('#js-move-group').on("click", ()=> {
            this.parent.imageList.moveSelectedImages("5979541d4faa98f06680a545");
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
            this.upload.uploadWithCategory(this.category());
        });
    };

    render() {
        return $(`
            <div class="modal-right-header">
                <div class="col col-md-8 padd">
                    <div class="img-text">图片管理</div>
                    <div class="operation-area">
                        <label class="chose_checkbox_label" for="js-check-all">
                        <input id="js-check-all" type="checkbox" class="frm_checkbox" data-label="全选">
                        <i class="icon_checkbox"></i>
                        <span class="content">&nbsp;全选</span></label>
                        <a id="js-move-group" class="move-category button active" href="javascript:;" disabled="disabled">移动分组</a>
                        <a id="js-delete-chose" class="delete-pic button active" href="javascript:;" disabled="disabled">删除</a>
                    </div>
                </div>
                <div class="col col-md-4 text-right">
                    <span>大小不超过2M</span><span class="button-upload-local">本地上传</span>
                </div>
            </div>
        `);
    }
}










