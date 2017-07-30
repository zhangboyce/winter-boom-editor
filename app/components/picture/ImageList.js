'use strict';

import Component from './../Component';
import ImageItem from './ImageItem';

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

        console.log(this.selectedImages);

        this.parent.toolBar.changeStatus();
    };

    selectAll = () => {
        this.selectedImages = [];
        this.selectedImages.push([...this.images.map(it => it._id)]);

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

    editImageName = (imageIds, imageName) =>{
        $.post('/images/update/'+imageIds,{name:imageName}, json => {
            if(json.status == "ok"){

            }
        });
    };

    moveImages = (imageIds, categoryId) => {
        if (!imageIds || imageIds.length == 0) return;

        $.get('/images/move', { image: imageIds, category: categoryId }, json => {
            if(json.status == "ok"){
                this.__delFromImageList__(imageIds);
            }
        });
    };

    moveSelectedImages = categoryId => {
        this.moveImages(this.selectedImages, categoryId);
    };

    deleteImages = imageIds => {
        if (!imageIds || imageIds.length == 0) return;

        this.confirm('是否确定删除该图片?', () => {
            $.get('/images/delete', { image: imageIds }, json => {
                if (json.status == "ok") {
                    this.__delFromImageList__(imageIds);
                }
            });
        });
    };

    deleteSelectedImages = () => {
        this.deleteImages(this.selectedImages);
    };

    __delFromImageList__ = imageIds => {
        for (let imageId of imageIds) {
            let index = this.images.findIndex(img => img._id == imageId);
            if (index != -1) this.images.splice(index, 1);
        }
        this.__buildImageUl__();
        this.parent.toolBar.changeStatus();
    };

    loadImages = items => {
        this.images = items;
        this.__buildImageUl__();
    };

    addItem = item => {
        this.loadImages([item, ...this.images])
    };

    //构建图片list
    __buildImageUl__ = () => {
        this.html('');
        this.images.forEach(item => {
            let imageItem = new ImageItem({ parent: this, item: item });
            this.append(imageItem);
        });
    };

    rendered = () => {
        this.__buildImageUl__();
    };

    render() {
        return $(`<ul id="images" class="clearfix"></ul>`);
    }
}










