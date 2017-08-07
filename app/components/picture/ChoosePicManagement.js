'use strict';
import Component from './../Component';
import Modal from '../common/Modal';
import CategoryList from './CategoryList';
import Pagination from './Pagination';
import ChooseUploadImage from './ChooseUploadImage';
import ChooseImageList from './ChooseImageList';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'choosePictureManagementModal'});
        this.toolBar = null;
        this.categoryList = null;
        this.imageList = null;
        this.pagination = null;

        this.modalCallback = function() {};
    }

    open = (modalCallback) => {
        this.toolBar = new ChooseUploadImage({ parent: this });
        this.pagination = new Pagination({ parent: this}, 10);
        this.imageList = new ChooseImageList({ parent: this });
        this.categoryList = new CategoryList({ toolBar: this.toolBar, pagination: this.pagination, imageList: this.imageList });

        this.modalCallback = modalCallback;

        this.rendered();
        this.modal.open();
    };

    rendered = () => {

        let $wrap = $('<div id="img-list-warp"></div>');
        $wrap.append(this.imageList);
        $wrap.append(this.pagination);

        let $right = this.find('.modal-pic-right');
        $right.html('');
        $right.html($wrap);

        let $rightHeader = $(`<div class="right-header">
                                     <div class="col col-md-8">
                                     </div>
                               </div>`);
        $right.prepend($rightHeader);
        $rightHeader.append(this.toolBar);


        let $left = this.find('.modal-pic-left');
        $left.html('');
        $left.html(this.categoryList);

        this.modal.$header = $(`<h4>选择图片</h4>`);
        this.modal.$body = this;

        let $footer = $(` <div class="footer"></div>`);
        $(`<button class="btn-go">确定</button>`).click(() => {
            let selected = this.imageList.getSelected();
            isFunction(this.modalCallback) && this.modalCallback(selected);
            this.modal.close();
        }).appendTo($footer);
        $(` <button class="btn-cancel">取消</button>`).click(() => {
            this.modal.close();
        }).appendTo($footer);

        this.modal.$footer = $footer;
    };

    render() {
        return $(`
            <div class="modal-content modal-pic-body">
                <div class="row">
                    <div class="col col-md-2">
                        <div class="modal-pic-left">

                        </div>
                    </div>
                    <div class="col col-md-10">
                        <div class="modal-pic-right">

                        </div>
                    </div>
                </div>

            </div>
        `);
    }
}










