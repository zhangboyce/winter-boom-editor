'use strict';
import _ from 'lodash';
import Component from './../Component';
import { isArray } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
    }

    __section__ = style => {
        let $section = $(style.html);
        _.each($section.find('*').contents(), c => {
            if(c.nodeType && c.nodeType === 3 && _.trim(c.textContent).length == 0) {
                c.remove();
            }
        });
        return $section;
    };

    setItems = items => {
        if (!isArray(items)) return;

        this.html('');
        let $ul = $('<ul></ul>').appendTo(this);
        items.forEach(style => {
            let $li = $(`<li rel="${style._id}"></li>`).appendTo($ul);
            $li.append(this.__section__(style));
            $li.click(e => {
                e.preventDefault();
                let $t = $li.children().clone();
                this.parent.editor.insert($t);
            });
        });
    };

    render() {
        return $(`<div class="col col-md-10 col-style-item"></div>`);
    }
}