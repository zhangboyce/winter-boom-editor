'use strict';
import _ from 'lodash';
import Component from './../Component';
import Modal from '../common/Modal';
import upload from '../../utils/uploadImageNew';
import { isFunction } from '../../../common/TypeUtils';


export default class extends Component {
    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'pictureManagementModal'});
        this.render();


        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            success: result => {
                let json = JSON.parse(result);
                this.images = [json.item, ...this.images];
                this.__buildImageUl__();
            }
        });

        this.categoryId = '';
        this.images = [];

        this.page = 1 / 1;
        this.size = 6 / 1;
        this.paginationInfo = {};
        this.paginationInfo.maxPage = '';
    }


    open = () => {
        return () => {
            this.modal.open();
        };
    };


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
            this.__showImageCategoryList__(type, callback, this.page, this.size);
        };
    };


    //不同分类显示不同图片
    __showImageCategoryList__ = (type, callback, page, size) => {
        $.get('/images/list', {page: page, size: size, categoryId: type._id}, json => {
            let items = json.list;
            this.paginationInfo = json.pagination;
            $(".show-number").text(page + " / " + this.paginationInfo.maxPage);
            if (items.length < 1) {
                $('#paginationArea').css({"display": "none"});
            } else {
                $('#paginationArea').css({"display": "inline-block"});
            }
            if (this.paginationInfo.hasPrev === true) {
                $('.last-page').css({"display": "inline-block"});
            } else {
                $('.last-page').css({"display": "none"});
            }
            if (this.paginationInfo.hasNext === false) {
                $('.next-page').css({"display": "none"});
            } else {
                $('.next-page').css({"display": "inline-block"});
            }
            if (this.paginationInfo.hasPrev === false && this.paginationInfo.hasNext === false) {
                $("#paginationArea").css({"display": "none"});
            } else {
                $("#paginationArea").css({"display": "inline-block"});
            }

            if (isFunction(callback)) {
                callback(items);
            }

        });
    };

    //删除图片
    __deleteImageList__ = imageIds => {
        this.confirm('是否确定删除该图片?', () => {
            $.get('/images/delete', {image: imageIds}, json => {
                if (json.status == "ok") {

                    for (let imageId of imageIds) {
                        let index = this.images.findIndex(img => img._id == imageId);
                        if (index != -1) this.images.splice(index, 1);
                    }
                    this.__buildImageUl__();
                    if (this.images.length < 1) {
                        this.__disableStatus__();
                    }
                }
            });
        });
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

    __loadImages__ = items => {
        this.images = items;
        this.__buildImageUl__();
    };


    //构建图片list
    __buildImageUl__ = () => {


        let $images = $('#images');
        $images.html('');
        this.images.forEach(item => {
            let $liGetlist = $(` <li class="img-item"> </li>`);
            let $litop = $(`<div class="bg-warp"></div>`);

            let $libgImg = $(` <span class="cover" style="background-image:url(http://editor.static.cceato.com/${item.key});">
                           </span>`);
            let $licheckbox = $(`<span class="check-content">
                                  <label class="checkbox-label" for="${item._id}">
                                      <input type="checkbox" class="input-checkbox" name="inputcheckbox"  id="${item._id}"><i class=" "></i>
                                          <span class="bottom-content">${item.name}</span>
                                  </label>
                              </span>`);

            $licheckbox.click(() => {
                var arrayCheckbox = document.getElementsByName('inputcheckbox');
                var isTrue = false;
                for (var i = 0; i < arrayCheckbox.length; i++) {
                    if (arrayCheckbox[i].checked == true) {
                        isTrue = true;
                        if (isTrue) {
                            this.__activeStatus__();
                        }
                    }

                    if (isTrue == false) {
                        this.__disableStatus__();
                    }
                }
            });

/*

            $(() => {
                $('[data-toggle="tooltip"]').tooltip();
            });
*/

            let $libottom = $('<div class="list-card-ft"></div>');
            let $liToolBar = $(`<ul></ul>`);
            let $editImageName = $(`<li> <a href="javascript:;" data-toggle="tooltip" data-placement="top" title="编辑名称"><span><i class="fa fa-pencil"></i></span></a></li>`);
            let $moveGroup = $(`<li> <a href="javascript:;" data-toggle="tooltip" data-placement="top" title="移动分组"><span><i class="fa fa-arrows"></i></span></a></li>`);
            let $deleteImage = $(`<li> <a href="javascript:;" data-toggle="tooltip" data-placement="top" title="删除"><span><i class="fa fa-trash-o"></i></span></a></li>`);

            //编辑图片名称
            $editImageName.click(()=> {
                alert("编辑图片名称");
            });
            //移动单个分组
            $moveGroup.click(()=> {
                alert("移动单个分组");
            });

            //删除单个图
            $deleteImage.click(()=> {
                this.__deleteImageList__([item._id]);
            });

            $liToolBar.append($editImageName);
            $liToolBar.append($moveGroup);
            $liToolBar.append($deleteImage);

            $litop.append($libgImg);
            $litop.append($licheckbox);
            $libottom.append($liToolBar);
            $liGetlist.append($litop);
            $liGetlist.append($libottom);

            $images.append($liGetlist);

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
        let $images = $(`<ul id="images" class="clearfix"> </ul>`);
        $modalRightBody.append($images);


        //分页
        let $paginationModal = $(`<div id="paginationArea"></div>`);
        let $lastPage = $(`<span class="last-page">上一页</span>`);
        let $totalNumber = $(`<span class="show-number"></span>`);
        let $nextPage = $(`<span class="next-page">下一页</span>`);
        let $inputPage = $(`<input class="input-number" type="text">`);
        let $goHandle = $('<span class="go-page">跳转</span>');

        $paginationModal.append($lastPage);
        $paginationModal.append($totalNumber);
        $paginationModal.append($nextPage);
        $paginationModal.append($inputPage);
        $paginationModal.append($goHandle);

        $nextPage.click(() => {
            this.page = this.page + 1;
            this.__showImageCategoryList__(this.categoryId, this.__loadImages__, this.page, this.size);
        });

        $lastPage.click(() => {
            this.page = this.page - 1;
            this.__showImageCategoryList__(this.categoryId, this.__loadImages__, this.page, this.size);
        });


        $inputPage.keyup(function () {
            $(this).val($(this).val().replace(/\D|^0/g, ''));
        }).bind("paste", function () {
            $(this).val($(this).val().replace(/\D|^0/g, ''));
        }).css("ime-mode", "disabled");

        $goHandle.click(() => {
            this.page = $inputPage.val() / 1;
            if (this.page > this.paginationInfo.maxPage) {
                this.page = this.paginationInfo.maxPage;
                $inputPage.val(this.page);
            }
            this.__showImageCategoryList__(this.categoryId, this.__loadImages__, this.page, this.size);
        });


        $modalRightBody.append($paginationModal);

        this.__loadTypes__(types => {
            types.forEach(type => {
                let $liGetlist = $(`<li class="col col-md-12" categoryId='${type._id}'><a href="javascript:;">${type.name}</a></li>`);
                $ul.append($liGetlist);
                $liGetlist.click(this.__typeOnClick__(type, items => {
                    $liGetlist.addClass("active").siblings().removeClass("active");
                    this.categoryId = type._id;
                    this.page = 1;
                    if (this.images.length < 1) {
                        this.__disableStatus__();
                    }
                    this.__loadImages__(items);
                }));
            });
            $ul.children('li').eq(0).click();
        });


        let $addGroup = $(`<li class="col col-md-12" style="padding-left: 10px;"><a href="javascript:;"> <i class="fa fa-plus"></i>新建分组</a></li>`);

        let $createGroupDiv = $(`<div class="create-group-div"></div>`);
        let $createGroupText = $(`<label class="create-group-text">创建分组</label>`);
        let $createGroupInput = $(`<input type="text" value="111" class="category-input">`);
        let $btnCommit = $(`<a class="btn-tool btn-commit" href="javascript:;">确定</a>`);
        $btnCommit.click(() => {
            $.post('/images/categories/save', {name: "测试目2"}, json => {
                if (json.status == "ok") {
                }
                $createGroupDiv.remove();
            });
        });
        let $btnCanncel = $(`<a class="btn-tool btn-canncel" href="javascript:;">取消</a>`);
        $btnCanncel.click(() => {
            $createGroupDiv.hide();
        });
        $createGroupDiv.append($createGroupText);
        $createGroupDiv.append($createGroupInput);
        $createGroupDiv.append($btnCommit);
        $createGroupDiv.append($btnCanncel);
        let $body = $('body');

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

        $buttonDelete.on("click", () => {
            var arrayCheckbox = document.getElementsByName('inputcheckbox');
            var arrayImageId = [];
            for (var i = 0; i < arrayCheckbox.length; i++) {
                if (arrayCheckbox[i].checked) {
                    arrayImageId.push(arrayCheckbox[i].id)
                }
            }
            if (arrayImageId.length == 0) return;

            this.__deleteImageList__(arrayImageId);
        });

        $buttonMoveCategory.on("click", ()=> {
            alert("多个移动分组");
        });

        //全选,全不选以及相应的删除和移动分组功能
        $buttonChooseAll.click(() => {
            if (this.images.length < 1) {
                this.__disableStatus__();
            } else {
                if ($("#js-check-all").prop("checked")) {
                    $("[name=inputcheckbox]:checkbox").prop("checked", true);
                    this.__activeStatus__();
                } else {
                    $("[name=inputcheckbox]:checkbox").prop("checked", false);
                    this.__disableStatus__();
                }
            }

        });


        let $buttonUpload = $(`<span>大小不超过2M</span><span class="button-upload-local">本地上传</span>`);
        $buttonUpload.click(() => {
            this.upload.uploadWithCategory(this.categoryId);
        });
        $rightHeaderRight.append($buttonUpload);

        $modalRight.append($modalRightBody);
        this.modal.$body = $modalBody;


    }
}










