'use strict';
import Component from './../Component';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();

        this.categories = [];
    }

    categories() {
        return this.categories;
    }

    flushCount(item) {
        this.__addCategoryCount__('ALL');
        let category = item.category || 'NO_CATEGORY';
        this.__addCategoryCount__(category);
    }

    __addCategoryCount__ = category => {
        let $li = this.find(`li[categoryId=${category}] > i`);
        let total = $li.text();
        $li.text(total / 1 + 1);
    };

    __loadTypes__ = callback => {
        $.get('/images/categories/list', json => {
            let categories = json.list;
            this.categories = categories;
            categories = [
                {_id: 'ALL', name: '全部图片', imageCount: json.total},
                {_id: 'NO_CATEGORY', name: '未分组图片', imageCount: json.nocategoryCount},
                ...categories];
            callback(categories);
        });
    };

    __typeOnClick__ = (type, callback) => {
        return e => {
            e.stopPropagation();
            this.parent.pagination.category(type._id);
            this.parent.toolBar.category(type._id);
            this.parent.pagination.pagination(callback);
        };
    };

    __createCategory__ (name, callback) {
        if (name && name.trim() && name.trim().length < 7) {
            $.post('/images/categories/save', { name: name }, json => {
                if (json.status == "ok") {
                    if (isFunction(callback)) callback();
                    this.__buildCategoryLi__(json.category);
                }
            });
        } else {
            this.message.warn('分组名称为1~6个字符');
        }
    }

    __buildCategoryLi__ = category => {
        let $li = $(`<li class="col col-md-12" categoryId='${category._id}'>${category.name}(<i style="font-style: inherit">${ category.imageCount }</i>)</li>`);
        this.find('ul').append($li);
        $li.click(this.__typeOnClick__(category, items => {
            $li.addClass("active").siblings().removeClass("active");
            this.parent.imageList.loadImages(items);
        }));
    };

    rendered = () => {
        this.__loadTypes__(types => {
            types.forEach(type => {
                this.__buildCategoryLi__(type);
            });
            this.find('ul > li').eq(0).click();
        });

        this.__popover__(this.find('#create-category'), {
            title: `新建分组`,
            content: `<input type="text" class="create-category-input" value=''>`,
            ok: ($popover, callback) => {
                let categoryName = $popover.find('.create-category-input').val();
                this.__createCategory__(categoryName, callback);
            }
        });
    };

    render() {
        return $(`
            <div>
                <ul class="col col-md-12 ul-category"></ul>
                <div class="col col-md-12" style="padding-left: 10px;">
                    <a id="create-category" href="javascript:;"><i class="fa fa-plus"></i>新建分组</a>
                </div>
            </div>
        `);
    }
}










