'use strict';

import Component from './../Component';
import upload from '../../utils/upload';

export default  class extends Component {
    constructor(props) {
        super(props);

        this.upload = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            multiple: true,
            success: result => {
                this.parent.categoryList.flush();
            }
        });
        this.rendered();
    }

    rendered = () => {
        this.find('.button-upload-local').click(() => {
            let categoryId = this.parent.toolBar.category()._id;
            this.upload.click({categoryId: categoryId});
        });
    };

    render() {
        return $(`
                   <div class="col col-md-4 text-right">
                            <span>大小不超过2M</span><span class="button-upload-local">本地上传</span>
                   </div>
        `);
    }
}