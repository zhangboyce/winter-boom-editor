'use strict';

import Component from './../Component';
import { isFunction } from '../../../common/TypeUtils';

export default class extends Component {
    constructor(props) {
        super(props);
        this.choseImage = [];
        this.rendered();
    }



    rendered = () => {
        $(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });

        this.find('.cover').css("background-image", "url(http://editor.static.cceato.com/" + this.item.key);
        this.find('.bottom-content').text(this.item.name);
        this.click(()=>{

            if (this.find('.select-image-icon').hasClass("active")) {
                this.find('.select-image-icon').removeClass("active");
                this.choseImage.splice(1, this.choseImage.findIndex(it => it === this.item._id));

            } else {
                this.find('.select-image-icon').addClass("active");
                this.siblings("li").find(".select-image-icon").removeClass("active");
                this.choseImage.push(this.item._id);
            }
            console.log(this.parent.images);
            console.log(this.choseImage);

        });


        console.log(this.choseImage);
        if (this.choseImage.indexOf(this.item._id) != -1) {
            alert("have");
            this.find('.select-image-icon').addClass("active");
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


