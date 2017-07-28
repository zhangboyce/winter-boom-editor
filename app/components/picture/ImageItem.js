'use strict';

import Component from './../Component';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered = () => {
        let $checkbox = this.find('.check-content');
        $checkbox.click(() => {
            this.parent.select(this.find('.input-checkbox').attr('id'));
        });

        $(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });

        this.find('li.edit-li').click(() => {
            this.parent.editImageName(this.item._id, "changename.jpg");
        });

        this.find('li.move-li').click(()=> {
            this.parent.moveImages([this.item._id], "5979541d4faa98f06680a545");
        });

        this.find('li.delete-li').click(()=> {
            this.parent.deleteImages([this.item._id]);
        });

        this.find('.cover').css("background-image", "url(http://editor.static.cceato.com/" + this.item.key );
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
                        <li class="move-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="移动分组"><span><i class="fa fa-arrows"></i></span></a></li>
                        <li class="delete-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="删除"><span><i class="fa fa-trash-o"></i></span></a></li>
                    </ul>
                </div>
            </li>
        `);
    }
}


