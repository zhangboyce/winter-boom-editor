'use strict';
import Component from './../Component';

export default class extends Component {
    constructor(props) {
        super(props);
        this.rendered();
    }


    rendered = () => {

    };

    render() {
        return $(`
                <button class="btn-go">确定</button>
                <button class="btn-cancel">取消</button>
        `);
    }
}










