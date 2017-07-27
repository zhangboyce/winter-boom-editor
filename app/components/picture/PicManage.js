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
            success: result => {
                let json = JSON.parse(result);
                this.images = [json.item, ...this.images];
                this.__buildImageUl__();
            }
        });

        this.categoryId = '';
        this.images = [];
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
            this.__showImageCategoryList__(type, callback);
        };
    };


    //不同分类显示不同图片
    __showImageCategoryList__ = (type, callback) => {
        $.get('/images/list', {categoryId: type._id}, json => {
            let items = json.list;
            if (typeof callback === 'function') {
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
        $buttonMoveCategory.off("click");
        $buttonDelete.off("click");
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

            let $libottom = $('<div class="list-card-ft"></div>');
            let $liToolBar = $(`<ul></ul>`);
            let $editImageName = $(`<li> <a href="javascript:;"><span><i class="fa fa-pencil"></i></span></a></li>`);
            let $moveGroup = $(`<li> <a href="javascript:;"><span><i class="fa fa-arrows"></i></span></a></li>`);
            let $deleteImage = $(`<li> <a href="javascript:;"><span><i class="fa fa-trash-o"></i></span></a></li>`);

            //编辑图片名称
            $editImageName.click(()=> {
                alert("编辑图片名称");
            });
            //移动单个分组
            $moveGroup.click( ()=> {
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

        this.__loadTypes__(types => {
            types.forEach(type => {
                let $liGetlist = $(`<li class="col col-md-12" categoryId='${type._id}'><a href="javascript:;">${type.name}</a></li>`);
                $ul.append($liGetlist);
                $liGetlist.click(this.__typeOnClick__(type, items => {
                    $liGetlist.addClass("active").siblings().removeClass("active");
                    this.categoryId = type._id;
                    this.images = items;
                    if (this.images.length < 1) {
                        this.__disableStatus__();
                    }
                    this.__buildImageUl__();
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

        $addGroup.popover({
            trigger:'click',
            template: '<div>1111111</div>',
            html: true,
            placement:"bottom",
            title:"这是一个弹出层",
            content:"这特么的是内容！"

        });
        $addGroup.popover('show');
        //$addGroup.click(function () {
        //    $body.append($createGroupDiv);
        //});
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

        $buttonDelete.click(()=> {
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


        //全选,全不选以及相应的删除和移动分组功能
        $buttonChooseAll.click(() => {

            if (this.images.length < 1) {
                this.__disableStatus__();
            } else {
                if ($("#js-check-all").prop("checked")) {
                    $("[name=inputcheckbox]:checkbox").prop("checked", true);
                    this.__activeStatus__();

                    $buttonMoveCategory.on("click", ()=> {
                        alert("多个移动分组");
                    });

                    $buttonDelete.on("click", ()=> {
                        var arrayCheckbox = document.getElementsByName('inputcheckbox');
                        var arrayImageId = [];
                        for (var i = 0; i < arrayCheckbox.length; i++) {
                            if (arrayCheckbox[i].checked) {
                                arrayImageId.push(arrayCheckbox[i].id)
                            }
                        }
                        this.__deleteImageList__(arrayImageId);
                    });

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


        this.__showImageCategoryList__(items => {
            this.images = items;
            this.__buildImageUl__();
        });

        $modalRight.append($modalRightBody);
        this.modal.$body = $modalBody;
    }
}










