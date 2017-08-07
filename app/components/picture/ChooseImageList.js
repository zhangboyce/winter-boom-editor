'use strict';

import Component from './../Component';
import ChooseImageItem from './ChooseImageItem';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.images = [];
        this.selectedImage = null;
        this.rendered();
    }

    select(item) {
        if (!item || !item._id) return;
        if (this.selectedImage && this.selectedImage._id == item._id) {
            this.selectedImage = null;
        } else {
            this.selectedImage = item;
        }
    }

    getSelected() {
        return this.selectedImage;
    }

    isEmpty = () => {
        return this.images.length < 1;
    };

    loadImages = (items, callback) => {
        this.images = items;
        this.__buildImageUl__();
        isFunction(callback) && callback();
    };

    //构建图片list
    __buildImageUl__ = () => {
        this.html('');
        if (this.images.length == 0) {
            this.html('<div class="tips-no-image">该分组暂时没有图片</div>');
        } else {
            this.images.forEach(item => {
                let imageItem = new ChooseImageItem({parent: this, item: item});
                this.append(imageItem);
            });
        }

    };

    rendered = () => {
        this.__buildImageUl__();
    };

    render() {
        return $(`<ul id="images" class="clearfix"></ul>`);
    }
}










