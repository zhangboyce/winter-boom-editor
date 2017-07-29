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
        $editImageName.click(() => {
            //this.parent.editImageName(this.item._id, "changename.jpg");
        });

        let editImageNameHtml = (`
                    <div class="edit-popover-warp">
                            <div class="popover-inner">
                                <div class="edit-popover-content">
                                    <div class="popover-edit">
                                        <label for="" class="edit-label">编辑名称</label>
                                        <div class="edit-controls">
                                        <span class="edit-input-box">
                                            <input type="text" class="edit-input js-name" value=''>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="popover-bar">
                                     <a href="javascript:;" class="btn btn-primary js-commitb-btn">确定</a>
                                     <a href="javascript:;" class="btn btn-default js-canncel-btn">取消</a>
                                </div>
                            </div>
                    </div>

            `);

        $editImageName.popover(
            {
                trigger: 'click',
                html: true,
                placement: "bottom",
                content: editImageNameHtml
            }
        );

        let $moveCategory = this.find('li.move-li');

        $moveCategory.click(()=> {
            //this.parent.moveImages([this.item._id], "5979541d4faa98f06680a545");
        });


        let moveCategoyHtml = (`
                    <div class="edit-popover-warp">
                            <div class="popover-inner">
                                <div class="edit-popover-content">
                                          <label class="edit-radio-label" for="checkbox609">
                                                  <input type="radio" class="edit-radio" name="categoryRadio" data-label="未分组" id="checkbox609">
                                                  <span class="content">未分组</span>
                                          </label>

                                          <label class="frm_radio_label" for="checkbox608">
                                                  <input type="radio" class="edit-radio" name="categoryRadio" data-label="未分组" id="checkbox608">
                                                  <span class="content">未分组</span>
                                          </label>

                                </div>
                                <div class="popover-bar">
                                     <a href="javascript:;" class="btn btn-primary js-commitb-btn">确定</a>
                                     <a href="javascript:;" class="btn btn-default js-canncel-btn">取消</a>
                                </div>
                            </div>
                    </div>

            `);

        $moveCategory.popover(
            {
                trigger: 'click',
                html: true,
                placement: "bottom",
                content: moveCategoyHtml
            }
        );


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
                        <li class="move-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="移动分组"><span><i class="fa fa-arrows"></i></span></a></li>
                        <li class="delete-li"><a href="javascript:;" data-toggle="tooltip" data-placement="top" title="删除"><span><i class="fa fa-trash-o"></i></span></a></li>
                    </ul>
                </div>
            </li>
        `);
    }
}


