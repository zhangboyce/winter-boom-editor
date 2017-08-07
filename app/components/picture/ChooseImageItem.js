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

        this.find('.cover').css("background-image", "url(http://editor.static.cceato.com/" + this.item.key);
        this.find('.bottom-content').text(this.item.name);
        this.click(() => {
            this.parent.select(this.item);
            this.parent.rendered();
        });

        let selected = this.parent.getSelected() || {};
        if (this.item._id == selected._id) {
            this.find('.select-image-icon').addClass("active");
        } else {
            this.find('.select-image-icon').removeClass("active");
        }
    };

    render() {
        return $(`
            <li class="img-item">
                <div class="bg-warp">
                    <span class="cover"></span>
                    <div class="select-image-icon"><i class="fa fa-check-square"></i></div>
                    <span class="check-content">
                              <span class="bottom-content"></span>
                   </span>
                </div>
            </li>
        `);
    }
}


