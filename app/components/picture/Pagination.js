'use strict';
import Component from './../Component';
import { isFunction, isNumber } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props, size) {
        super(props);

        this.__category__ = '';
        this.__page__ = 1;
        this.__size__ = size || 6;

        this.paginationInfo = {};

        this.rendered();
    }

    page = page => {
        if (page == undefined) {
            return this.__page__;
        }else {
            if (!isNumber(page)) {
               throw new Error('page must be a number.');
            }
            this.__page__ = page;
        }
    };

    size = size => {
        if (size == undefined) {
            return this.__size__;
        }else {
            if (!isNumber(size)) {
                throw new Error('size must be a number.');
            }
            this.__size__ = size;
        }
    };

    category = category => {
        if (category == undefined) {
            return this.__category__;
        }else {
            this.__category__ = category;
        }
    };

    pagination = callback => {
        $.get('/images/list', { page: this.page(), size: this.size(), categoryId: this.category() }, json => {
            let items = json.list;
            this.paginationInfo = json.pagination;

            if (isFunction(callback)) {
                callback(items);
            }

            this.__flush__();
        });
    };

    flush(callback) {
        this.page(1);
        this.pagination(callback);
    }

    __flush__() {
        $('.show-number').text(this.page() + " / " + this.paginationInfo.maxPage);
        if (this.parent.imageList.isEmpty()) {
            this.css({"display": "none"});
        } else {
            this.css({"display": "inline-block"});
        }
        if (this.paginationInfo.hasPrev === true) {
            $('.last-page').css({"display": "inline-block"});
        } else {
            $('.last-page').css({"display": "none"});
        }
        if (this.paginationInfo.hasNext === false) {
            $('.next-page').css({"display": "none"});
        } else {
            $('.next-page').css({"display": "inline-block"});
        }
        if (this.paginationInfo.hasPrev === false && this.paginationInfo.hasNext === false) {
            this.css({"display": "none"});
        } else {
            this.css({"display": "inline-block"});
        }
    }

    rendered = () => {

        this.find('.last-page').click(() => {
            this.page(this.page() - 1);
            this.pagination(this.parent.imageList.loadImages);
        });

        this.find('.next-page').click(() => {
            this.page(this.page() + 1);
            this.pagination(this.parent.imageList.loadImages);
        });

        let $input_number = this.find('.input-number');
        $input_number.keyup(() => {
            $input_number.val($input_number.val().replace(/\D|^0/g, ''));
        }).bind("paste", () => {
            $input_number.val($input_number.val().replace(/\D|^0/g, ''));
        }).css("ime-mode", "disabled");

        this.find('.go-page').click(() => {
            let goPage = $input_number.val() / 1;
            if(goPage == 0){
                this.page(1);
            }else{
                this.page($input_number.val() / 1);
            }

            if (this.page() > this.paginationInfo.maxPage) {
                this.page(this.paginationInfo.maxPage);
                $input_number.val(this.page());
            }
            this.pagination(this.parent.imageList.loadImages);
        });
    };

    render() {
        return $(`
            <div id="paginationArea">
                <span class="last-page">上一页</span>
                <span class="show-number"></span>
                <span class="next-page">下一页</span>
                <input class="input-number" type="text">
                <span class="go-page">跳转</span>
            </div>
        `);
    }
}










