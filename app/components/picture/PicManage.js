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
            types = [{_id: 'all', name: '全部图片'}, ...types];
            callback(types);
        });
    };


    __typeOnClick__ = (type, callback) => {

        return e => {
            callback();
            e.stopPropagation();
            this.__showImageCagegoryList__(type);
        };
    };




    __showImageCagegoryList__ = (type, callback) => {
        $.get('/images/list',{category: type._id}, json => {
            console.log(json);
            if (json.status) callback(json.result);
        });
    };


    __showImageList__ = callback => {
        $.get('/images/list', json => {
            let items = json.list;
            callback(items);
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


        this.__loadTypes__(types => {
           /* let $allList = $(`<li class="col col-md-12" style="padding-left: 10px;"><a href="#"> 全部图片 (000)</a></li>`);
            $ul.append($allList);*/
            types.forEach(type => {
                let $liGetlist = $(`<li class="col col-md-12" categoryId='${type._id}'><a href="#">${type.name}</a></li>`);
                $ul.append($liGetlist);
                $liGetlist.click(this.__typeOnClick__(type, () => {
                    $liGetlist.addClass("active").siblings().removeClass("active");

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
                                    <label class="chose_checkbox_label" for="js-check_all">
                                    <input id="js-check_all" type="checkbox" class="frm_checkbox" data-label="全选">
                                    <i class="icon_checkbox"></i>
                                    <span class="content">&nbsp;全选</span></label>

                                  `);
        let $buttonMoveCategory = $('<span class="move-category button active">移动分组</span>');
        let $buttonDelete = $(`<span class="delete-pic button active">删除</span>`);
        $operationArea.append($buttonChooseAll);
        $operationArea.append($buttonMoveCategory);
        $operationArea.append($buttonDelete);
        $rightHeaderLeft.append($operationArea);
        let $buttonUpload = $(`<span>大小不超过2M</span><span class="button-upload-local">本地上传</span>`);
        $buttonUpload.click(() => {
            this.upload.click();
        });
        $rightHeaderRight.append($buttonUpload);




        //modal 右边区域的图片列表
        let $modalRightBody = $(`<div id="img-list-warp"></div>`);
        let $imgUL = $(`<ul class="clearfix"> </ul>`);
        $modalRightBody.append($imgUL);

        this.__showImageCagegoryList__(items => {
            items.forEach(item => {
                let $liGetlist = $(

                        ` <li class="img-item">
                                                    <div class="bg-warp">
                                                            <span class="cover" style="background-image:url(http://editor.static.cceato.com/${item.key});">
                                                            </span>
                                                            <span class="check-content">
                                                                      <label class="checkbox-label" for="checkbox10">
                                                                            <input type="checkbox" class="input-checkbox"  id="checkbox10"><i class=" "></i>
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
        });

        $modalRight.append($modalRightBody);
        this.modal.$body = $modalBody;
    }
}










