'use strict';

import Component from './../Component';
import Modal from '../common/Modal';
import ImageList from './ImageList';
import CategoryList from './CategoryList';
import Pagination from './Pagination';
import ToolBar from './ToolBar';

export default class extends Component {
    constructor(props) {
        super(props);

        this.modal = new Modal({id: 'pictureManagementModal'});

        this.imageList = new ImageList({ parent: this });
        this.categoryList = new CategoryList({ parent: this });
        this.pagination = new Pagination({ parent: this });
        this.toolBar = new ToolBar({ parent: this });

        console.log(this);
        this.rendered();
    }

    open = () => {
        this.modal.open();
    };

    rendered = () => {
        this.find('#img-list-warp').append(this.imageList);
        this.find('.modal-pic-right').prepend(this.toolBar);
        this.find('.modal-pic-left').append(this.categoryList);
        this.find('.modal-pic-left').append(this.pagination);

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
                            <div id="img-list-warp">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}










