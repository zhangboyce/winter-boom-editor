'use strict';

import Component from './../Component';
import Modal from '../common/Modal';
import ImageList from './ImageList';
import CategoryList from './CategoryList';
import Pagination from './Pagination';
import ToolBar from './ToolBar';
import UploadImage from './UploadImage'

export default class extends Component {
    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'pictureManagementModal'});

        this.toolBar = null;
        this.categoryList = null;
        this.imageList = null;
        this.pagination = null;
        this.uploadImage = null;
    }

    open = () => {
        this.toolBar = new ToolBar({ parent: this });
        this.uploadImage = new UploadImage({parent:this});

        this.pagination = new Pagination({ parent: this });
        this.imageList = new ImageList({ parent: this });
        this.categoryList = new CategoryList({ toolBar: this.toolBar, pagination: this.pagination, imageList: this.imageList });

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
        $right.prepend(this.toolBar);
        $right.prepend(this.uploadImage);
        let $upImage =  this.find('.change-category');
        $upImage.append(this.uploadImage);
        let $left = this.find('.modal-pic-left');
        $left.html('');
        $left.html(this.categoryList);

        this.modal.$header = $(`<h4>图片管理</h4>`);
        this.modal.$body = this;
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










