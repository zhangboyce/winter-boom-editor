'use strict';

import Component from './../Component';
import ImageItem from './ImageItem';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.images = [];
        this.selectedImages = [];

        this.rendered();
    }

    select = id => {
        let index = this.selectedImages.findIndex(it => it == id);
        if (index == -1) {
            this.selectedImages.push(id);
        } else {
            this.selectedImages.splice(index, 1);
        }
        this.parent.toolBar.changeStatus();
    };

    selectAll = () => {
        this.selectedImages = [];
        this.selectedImages.push(...this.images.map(it => it._id));
        this.parent.toolBar.changeStatus();
    };

    unSelectAll = () => {
        this.selectedImages = [];
        this.parent.toolBar.changeStatus();
    };

    hasSelected = () => {
        return this.selectedImages.length > 0;
    };

    isEmpty = () => {
        return this.images.length < 1;
    };

    editImageName = (imageIds, imageName, callback) =>{
        $.post('/images/update/'+imageIds,{ name:imageName }, json => {
            if(json.status == "ok"){
                callback();
            }
        });
    };

    moveImages = (imageIds, categoryId) => {
        if (!imageIds || imageIds.length == 0) return;

        $.get('/images/move', { image: imageIds, category: categoryId }, json => {
            if(json.status == "ok"){
                this.parent.categoryList.flush();
            }
        });
    };

    moveSelectedImages = (categoryId) => {
        this.moveImages(this.selectedImages, categoryId);
    };

    deleteImages = (imageIds) => {
        if (!imageIds || imageIds.length == 0) return;

        this.confirm('是否确定删除该图片?', () => {
            $.get('/images/delete', { image: imageIds }, json => {
                if (json.status == "ok") {
                    this.parent.categoryList.flush();
                }
            });
        });
    };

    deleteSelectedImages = () => {
        this.deleteImages(this.selectedImages);
    };


    loadImages = (items, callback) => {
        this.images = items;
        this.selectedImages = [];
        this.__buildImageUl__();

        isFunction(callback) && callback();
    };

    addItem = item => {
        this.loadImages([item, ...this.images])
    };

    //构建图片list
    __buildImageUl__ = () => {
        this.html('');
        if(this.images.length==0){
            this.html('<div class="tips-no-image">该分组暂时没有图片</div>');
        }else{
            this.images.forEach(item => {
                let imageItem = new ImageItem({ parent: this, item: item });
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










