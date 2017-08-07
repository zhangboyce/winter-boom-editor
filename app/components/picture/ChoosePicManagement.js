'use strict';

import Component from './../Component';
import Modal from '../common/Modal';
import ChooseImageList from './ChooseImageList';
import ChooseCategoryList from './ChooseCategoryList';
import ChoosePagination from './ChoosePagination';
import ChooseUploadImage from './ChooseUploadImage';
import ChooseModalFooter from './ChooseModalFooter';

export default class extends Component {
    constructor(props) {
        super(props);
        this.modal = new Modal({id: 'choosePictureManagementModal'});
        this.chooseCategoryList = null;
        this.chooseImageList = null;
        this.choosePagination = null;
        this.chooseUploadImage = null;
        this.chooseModalFooter = null;
    }

    open = () => {
        this.chooseUploadImage = new ChooseUploadImage({parent: this});
        this.choosePagination = new ChoosePagination({parent: this});
        this.chooseImageList = new ChooseImageList({parent: this});
        this.chooseCategoryList = new ChooseCategoryList({parent: this});
        this.chooseModalFooter = new ChooseModalFooter({parent: this});

        this.rendered();
        this.modal.open();

    };

    rendered = () => {


        let $wrap = $('<div id="img-list-warp"></div>');
        $wrap.append(this.chooseImageList);
        $wrap.append(this.choosePagination);

        let $right = this.find('.modal-pic-right');
        $right.html('');
        $right.html($wrap);

        let $rightHeader = $(`<div class="right-header">
                                     <div class="col col-md-8">
                                     </div>
                               </div>`);
        $right.prepend($rightHeader);
        $rightHeader.append(this.chooseUploadImage);


        let $left = this.find('.modal-pic-left');
        $left.html('');
        $left.html(this.chooseCategoryList);

        let $footer = this.find('.footer');
        $footer.html('');
        $footer.append(this.chooseModalFooter);

        this.modal.$header = $(`<h4>选择图片</h4>`);
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
                <div class="row">
                        <div class="footer">

                        </div>
                </div>
            </div>
        `);
    }
}










