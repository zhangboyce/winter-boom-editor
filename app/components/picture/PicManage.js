'use strict';
import _ from 'lodash';
import Component from './../Component';
import Modal from '../common/Modal';
import upload from '../../utils/uploadImageNew';


export default class extends Component {


    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'pictureManagementModal'});
        this.render();

        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            // change: () => confirm('确认上传新图片？'),
            success: result => {
                let json = JSON.parse(result);
                // this.$coverImg.attr('src', 'http://editor.static.cceato.com/' + json.key);
            }
        });
    }

    open = () => {
        return () => {
            this.modal.open();
        };
    };


    __loadTypes__ = callback => {
        $.getJSON('/images/categories/list', json => {
            let types = json;
            types = [{_id: '', name: '全部图片'}, ...types];
            callback(types);
        });
    };


    __typeOnClick__ = (type, callback) => {
        return e => {
            e.stopPropagation();
            this.__showImageCategoryList__(type, callback);
        };
    };


    __showImageCategoryList__ = (type, callback) => {
        $.get('/images/list', {category: type._id}, json => {
            let items = json.list;
            if (typeof callback === 'function') {
                callback(items);
            }

        });
    };

    __buildImageUl__ = ($imgUL, items) => {
        $imgUL.html('');
        items.forEach(item => {
            let $liGetlist = $(
                ` <li class="img-item">
                                <div class="bg-warp">
                                        <span class="cover" style="background-image:url(http://editor.static.cceato.com/${item.key});">
                                        </span>
                                        <span class="check-content">
                                                  <label class="checkbox-label" for="${item.key}">
                                                        <input type="checkbox" class="input-checkbox" name="inputcheckbox"  id="${item.key}"><i class=" "></i>
                                                        <span class="bottom-content">${item._id}</span>
                                                  </label>
                                        </span>
                                </div>

                                <div class="list-card-ft">
                                    <ul>
                                        <li> <a href="#"><span><i class="fa fa-pencil"></i></span></a></li>
                                        <li> <a href="#"><span><i class="fa fa-arrows"></i></span></a></li>
                                        <li> <a href="#"><span><i class="fa fa-trash-o"></i></span></a></li>
                                    </ul>
                                </div>
                           </li> `
            );

            $imgUL.append($liGetlist);

        });
    };

    render() {


        let $modalBody = $('<div class="modal-content modal-pic-body"></div>');
        let $row = $('<div class="row"></div>');
        let $col2 = $(' <div class="col col-md-2"></div>');
        let $col10 = $(' <div class="col col-md-10"></div>');
        let $modalLeft = $(`<div class="modal-pic-left"> </div>`);
        let $ul = $(`<ul class="col col-md-12"> </ul>`);
        $modalLeft.append($ul);

        //modal 右边区域的图片列表
        let $modalRightBody = $(`<div id="img-list-warp"></div>`);
        let $imgUL = $(`<ul id="checkul" class="clearfix"> </ul>`);
        $modalRightBody.append($imgUL);

        this.__loadTypes__(types => {
            types.forEach(type => {
                let $liGetlist = $(`<li class="col col-md-12" categoryId='${type._id}'><a href="#">${type.name}</a></li>`);
                $ul.append($liGetlist);
                $liGetlist.click(this.__typeOnClick__(type, items => {
                    $liGetlist.addClass("active").siblings().removeClass("active");
                    this.__buildImageUl__($imgUL, items);
                }));
            });
            $ul.children('li').eq(0).click();
        });


        let $addGroup = $(`<li class="col col-md-12" style="padding-left: 10px;"><a href="#"> <i class="fa fa-plus"></i>新建分组</a></li>`);

        let $createGroupDiv = $(`<div class="create-group-div"></div>`);
        let $createGroupText = $(`<label class="create-group-text">创建分组</label>`);
        let $createGroupInput = $(`<input type="text" value="111" class="category-input">`);
        let $btnCommit = $(`<a class="btn-tool btn-commit" href="#">确定</a>`);
        $btnCommit.click(() => {
            $.post('/images/categories/save', {name: " "}, json => {
                if (json.status == "ok") {
                }
                $createGroupDiv.hide();
            });
        });
        let $btnCanncel = $(`<a class="btn-tool btn-canncel" href="#">取消</a>`);
        $btnCanncel.click(() => {
            $createGroupDiv.hide();
        });
        $createGroupDiv.append($createGroupText);
        $createGroupDiv.append($createGroupInput);
        $createGroupDiv.append($btnCommit);
        $createGroupDiv.append($btnCanncel);
        let $body = $('body');

        $addGroup.click(function () {
            $body.append($createGroupDiv);
        });
        $addGroup.insertAfter($ul);


        let $modalRight = $(` <div class="modal-pic-right"></div>`);
        $modalBody.append($row);
        $row.append($col2);
        $col2.append($modalLeft);
        $row.append($col10);
        $col10.append($modalRight);


        //modal 右边区域的头部
        let $modalRightHeader = $(`<div class="modal-right-header"> </div>`);
        let $rightHeaderLeft = $(`<div class="col col-md-8 padd"></div>`);
        let $rightHeaderRight = $(`<div class="col col-md-4 text-right"></div>`);
        $modalRightHeader.append($rightHeaderLeft);
        $modalRightHeader.append($rightHeaderRight);
        $modalRight.append($modalRightHeader);

        let $text = $(`<div class="img-text">图片管理</div>`);
        $rightHeaderLeft.append($text);

        let $operationArea = $(`<div class="operation-area"></div>`);
        let $buttonChooseAll = $(`
                                    <label class="chose_checkbox_label" for="js-check-all">
                                    <input id="js-check-all" type="checkbox" class="frm_checkbox" data-label="全选">
                                    <i class="icon_checkbox"></i>
                                    <span class="content">&nbsp;全选</span></label>

                                  `);



        let $buttonMoveCategory = $('<a id="js-move-group" class="move-category button active" href="javascript:;" disabled="disabled">移动分组</a>');
        let $buttonDelete = $(`<a id="js-delete-chose" class="delete-pic button active" href="javascript:;" disabled="disabled">删除</a>`);
        $operationArea.append($buttonChooseAll);
        $operationArea.append($buttonMoveCategory);
        $operationArea.append($buttonDelete);
        $rightHeaderLeft.append($operationArea);


        //全选,全不选以及相应的删除和移动分组功能
        $buttonChooseAll.click( () => {
            if ($("#js-check-all").prop("checked")) {
                /*var arrayCheckbox = document.getElementsByName('inputcheckbox');
                 for (var i = 0; i < arrayCheckbox.length; i++) {
                 arrayCheckbox[i].checked="checked";
                 }*/
                $("[name=inputcheckbox]:checkbox").prop("checked", true);
                $buttonMoveCategory.removeClass("active");
                $buttonMoveCategory.removeAttr("disabled");
                $buttonDelete.removeClass("active");
                $buttonDelete.removeAttr("disabled");
                $buttonMoveCategory.on("click",()=> {
                        alert("move");
                });
                $buttonDelete.on("click",()=> {
                        alert("delete");
                });

            } else {
                $("[name=inputcheckbox]:checkbox").prop("checked", false);
                $buttonMoveCategory.addClass("active");
                $buttonMoveCategory.attr("disabled","disabled");
                $buttonDelete.addClass("active");
                $buttonDelete.attr("disabled","disabled");
                $buttonMoveCategory.off("click");
                $buttonDelete.off("click");
            }

        });

        let $buttonUpload = $(`<span>大小不超过2M</span><span class="button-upload-local">本地上传</span>`);
        $buttonUpload.click(() => {
            this.upload.click();
        });
        $rightHeaderRight.append($buttonUpload);


        this.__showImageCategoryList__(items => {
            this.__buildImageUl__($imgUL, items);
        });

        $modalRight.append($modalRightBody);
        this.modal.$body = $modalBody;
    }
}










