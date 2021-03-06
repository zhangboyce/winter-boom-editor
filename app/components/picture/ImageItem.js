'use strict';

import Component from './../Component';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered = () => {
        $(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });

        let $checkbox = this.find('.input-checkbox');
        $checkbox.click(() => {
            this.parent.select(this.find('.input-checkbox').attr('id'));
        });

        this.find('.cover').css("background-image", "url(http://editor.static.cceato.com/" + this.item.key);
        this.find('.checkbox-label').attr('for', this.item._id);
        this.find('.input-checkbox').attr('id', this.item._id);
        this.find('.bottom-content').text(this.item.name);

        let $editImageName = this.find('li.edit-li');
        let oldItemName = '';
        this.__popover__($editImageName, {
            title: `编辑名称`,
            content: `<input type="text" class="item-name-input" value=''>`,
            ok: ($popover, callback) => {
                let itemName = $popover.find('.item-name-input').val();
                if (itemName && itemName.trim() && itemName != oldItemName) {
                    this.parent.editImageName(this.item._id, itemName, () => {
                        this.find('.bottom-content').text(itemName);
                        isFunction(callback) && callback();
                    });
                } else {
                    this.message.warn('名称不完美!');
                }
            },
            shown: $popover => {
                oldItemName = this.find('.bottom-content').text();
                $popover.find('.item-name-input').val(oldItemName);
            }
        });

        let $moveCategory = this.find('li.move-li');
        this.__popover__($moveCategory, {
            title: `移动分组`,
            content: `<div id="category-radios"></div>`,
            ok: ($popover, callback) => {
                let category = $popover.find('input:radio[name="category"]:checked').attr('id');
                this.parent.moveImages([this.item._id], category, callback);
            },
            shown: $popover => {
                let choseCategoryList = [...this.parent.parent.categoryList.getCategories()];
                let activeCategory = this.parent.parent.pagination.category();
                let index = choseCategoryList.findIndex(it => it._id == activeCategory);
                if (index != -1) choseCategoryList.splice(index, 1);
                if(choseCategoryList.length<1){
                    $popover.find('#category-radios').html("请先新建分组");
                }
                choseCategoryList.forEach(item => {
                    $popover.find('#category-radios').append(`
                    <label class="edit-radio-label" for="${item._id}">
                        <input type="radio" class="edit-radio" name="category"  id="${item._id}">
                            <span class="content">${item.name}</span>
                    </label>`
                    );
                });
            }
        });


        let $deleteCategory = this.find('li.delete-li');
        this.__popover__($deleteCategory, {
            title: ``,
            content: `<div style="padding:5px 0">确定删除此素材吗?</div>`,
            ok: ($popover, callback) => {
                this.parent.deleteImages([this.item._id], callback);
            }
        });


    };

    render() {
        return $(`
            <li class="img-item">
                <div class="bg-warp">
                    <span class="cover"></span>
                    <span class="check-content">
                      <label class="checkbox-label" for="">
                          <input type="checkbox" class="input-checkbox" id="" name="image-item-checkbox">
                              <span class="bottom-content"></span>
                      </label>
                  </span>
                </div>
                <div class="list-card-ft">
                    <ul>
                        <li class="edit-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="编辑名称"><span><i class="fa fa-pencil"></i></span></a></li>
                        <li class="move-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="移动分组"><span><i class="fa fa-exchange"></i></span></a></li>
                        <li class="delete-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="删除"><span><i class="fa fa-trash-o"></i></span></a></li>
                    </ul>
                </div>
            </li>
        `);
    }
}


