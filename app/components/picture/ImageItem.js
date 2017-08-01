'use strict';

import Component from './../Component';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered = () => {
        let $checkbox = this.find('.input-checkbox');
        $checkbox.click(() => {
            this.parent.select(this.find('.input-checkbox').attr('id'));
        });

        $(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });

        let $editImageName = this.find('li.edit-li');
        this.__popover__($editImageName, {
            title: `编辑名称`,
            content: `<input type="text" class="item-name-input" value=${ this.item.name } />`,
            ok: ($popover) => {
                let itemName = $popover.find('.item-name-input').val();
                if (itemName && itemName.trim() && itemName != this.item.name) {
                    this.parent.editImageName(this.item._id, itemName, () => {
                        this.item.name = itemName;
                        this.find('.bottom-content').text(itemName);
                    });
                } else {
                    this.message.warn('名称不完美!');
                }
            }
        });

        let $moveCategory = this.find('li.move-li');
        this.__popover__($moveCategory, {
            title: `移动分组`,
            content: `<div id="category-radios"></div>`,
            ok: ($popover) => {
                let category = $popover.find('input:radio[name="category"]:checked').attr('id');
                this.parent.moveImages([this.item._id], category);
            },
            shown: $popover => {
                let choseCategoryList = [...this.parent.parent.categoryList.getCategories()];
                let activeCategory = this.parent.parent.pagination.category();
                let index = choseCategoryList.findIndex(it => it._id == activeCategory);
                if (index != -1) choseCategoryList.splice(index, 1);
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

        this.find('li.delete-li').click(()=> {
            this.parent.deleteImages([this.item._id]);
        });

        this.find('.cover').css("background-image", "url(http://editor.static.cceato.com/" + this.item.key);
        this.find('.checkbox-label').attr('for', this.item._id);
        this.find('.input-checkbox').attr('id', this.item._id);
        this.find('.bottom-content').text(this.item.name);
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


