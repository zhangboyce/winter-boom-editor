'use strict';
import _ from 'lodash';
import Component from './../Component';
import Modal from '../common/Modal';


export default class extends Component {

    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'pictureManagementModal'});
        this.render();
    }

    open = () => {
        return () => {
            this.modal.open();
        };
    };

    render() {

        let $modalBody = $('<div class="modal-content modal-pic-body"></div>');
        let $row = $('<div class="row"></div>');
        let $col2 = $(' <div class="col col-md-2"></div>');
        let $col10 = $(' <div class="col col-md-10"></div>');
        let $modalLeft = $(`<div class="modal-pic-left">
                                 <ul class="col col-md-12">
                                        <li class="col col-md-12"><a href="#"><strong>全部图片</strong><span>(13)</span></a></li>
                                        <li class="col col-md-12"><a href="#"> <i class="fa fa-plus"></i> 新建分组 </a></li>
                                 </ul>
                            </div>`);
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

        let $text  = $(`<div class="img-text">图片管理</div>`);
        $rightHeaderLeft.append($text);

        let $operationArea = $(`<div class="operation-area"></div>`);
        let $buttonChooseAll = $(`
                                    <label class="chose_checkbox_label" for="js-check_all">
                                    <input id="js-check_all" type="checkbox" class="frm_checkbox" data-label="全选">
                                    <i class="icon_checkbox"></i>
                                    <span class="content">&nbsp;全选</span></label>

                                  `);
        let $buttonMoveCategory = $('<span class="move-category button active">移动分组</span>');
        let $buttonDelete  = $(`<span class="delete-pic button active">删除</span>`);
        $operationArea.append($buttonChooseAll);
        $operationArea.append($buttonMoveCategory);
        $operationArea.append($buttonDelete);
        $rightHeaderLeft.append($operationArea);

        let $buttonUpload = $(`<span>大小不超过2M</span><span class="button-upload-local">本地上传</span>`);
        $rightHeaderRight.append($buttonUpload);


        //modal 右边区域的图片列表
        let $modalRightBody = $(`
                                <div id="img-list-warp">
                                        <ul class="clearfix">
                                            <li class="img-item">
                                                    <div class="bg-warp">
                                                            <span class="cover" src="https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg" style="background-image:url(https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg);">
                                                            </span>
                                                            <span class="check-content">
                                                                      <label class="checkbox-label" for="checkbox10">
                                                                            <input type="checkbox" class="input-checkbox"  id="checkbox10"><i class=" "></i>
                                                                            <span class="bottom-content">4998f946fadsfdasfdsafdsafasdf5e002a.jpg</span>
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
                                            </li>


                                             <li class="img-item">
                                                    <div class="bg-warp">
                                                            <span class="cover" src="https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg" style="background-image:url(https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg);">
                                                            </span>
                                                            <span class="check-content">
                                                                      <label class="checkbox-label" for="checkbox10">
                                                                            <input type="checkbox" class="input-checkbox"  id="checkbox10"><i class=" "></i>
                                                                            <span class="bottom-content">4998f946fadsfdasfdsafdsafasdf5e002a.jpg</span>
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
                                            </li>


                                             <li class="img-item">
                                                    <div class="bg-warp">
                                                            <span class="cover" src="https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg" style="background-image:url(https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg);">
                                                            </span>
                                                            <span class="check-content">
                                                                      <label class="checkbox-label" for="checkbox10">
                                                                            <input type="checkbox" class="input-checkbox"  id="checkbox10"><i class=" "></i>
                                                                            <span class="bottom-content">4998f946fadsfdasfdsafdsafasdf5e002a.jpg</span>
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
                                            </li>



                                             <li class="img-item">
                                                    <div class="bg-warp">
                                                            <span class="cover" src="https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg" style="background-image:url(https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg);">
                                                            </span>
                                                            <span class="check-content">
                                                                      <label class="checkbox-label" for="checkbox10">
                                                                            <input type="checkbox" class="input-checkbox"  id="checkbox10"><i class=" "></i>
                                                                            <span class="bottom-content">4998f946fadsfdasfdsafdsafasdf5e002a.jpg</span>
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
                                            </li>



                                             <li class="img-item">
                                                    <div class="bg-warp">
                                                            <span class="cover" src="https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg" style="background-image:url(https://mmbiz.qlogo.cn/mmbiz_jpg/6nu61EDibOsdVCcBUNibeEwuWyWytPkQFDQsg27Rgu20wC96On8snRxkklKMwibKogVJ6nkaXvTFLUVIxfmafYYeQ/0?wx_fmt=jpeg);">
                                                            </span>
                                                            <span class="check-content">
                                                                      <label class="checkbox-label" for="checkbox10">
                                                                            <input type="checkbox" class="input-checkbox"  id="checkbox10"><i class=" "></i>
                                                                            <span class="bottom-content">4998f946fadsfdasfdsafdsafasdf5e002a.jpg</span>
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
                                            </li>
                                        </ul>
                                </div>
                      `);
        $modalRight.append($modalRightBody);

        this.modal.$body = $modalBody;
    }
}










