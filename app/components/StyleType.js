'use strict';
import Component from './Component';

export default class extends Component {

    __loadTypes__ = callback => {
        $.getJSON('/api/types', json => {
            if (json.status) {
                let types = json.result;
                types = [...types, { _id: 'all', name: '全部' }];
                callback(types);
            }
        });
    };

    __loadStyles__ = (type, callback) => {
        $.getJSON('/api/styles/' + type._id, json => {
            if (json.status) callback(json.result);
        });
    };

    __typeOnHover__ = $li => {
        let showTimeout;
        $li.hover(function () {
            showTimeout = setTimeout(function () {
                $li.addClass('show');
            }, 300);
        }, function () {
            $li.removeClass('show');
            clearTimeout(showTimeout);
        });
    };

    __typeOnClick__  = type => {
        return e => {
            e.stopPropagation();
            this.__loadStyles__(type, items => {
                this.props.onGetItems(items);
            });
        };
    };

    render() {
        let $ul = $(`<ul></ul>`);

        this.__loadTypes__(types => {
            types.forEach(type => {
                let $li_1 = $(`<li>${type.name}</li>`).appendTo($ul);

                $li_1.click(this.__typeOnClick__(type));
                this.__typeOnHover__($li_1);

                if (type.children && type.children.length != 0) {
                    let $subUl = $('<ul></ul>').appendTo($li_1);

                    type.children.forEach(child => {
                        let $li_2 = $(`<li>${child.name}</li>`).appendTo($subUl);
                        $li_2.click(this.__typeOnClick__(child));
                    });
                }
            });
            $ul.children('li').eq(0).click();
        });

        let $styleTypes = $(`<div class="col col-md-3 col-style-type"></div>`);
        $styleTypes.append($ul);
        return $styleTypes;
    }
}