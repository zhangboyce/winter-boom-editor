'use strict';
import Component from './../Component';
import StyleType from './StyleType';
import StyleItem from './StyleItem';

export default class extends Component {
    constructor(props) {
        super(props);

        this.styleType = new StyleType({ parent: this });
        this.styleItem = new StyleItem({ parent: this });

        this.rendered();
    }

    getItems = items => {
        this.styleItem.setItems(items);
    };

    rendered = () => {
        let $row = this.find('.row');
        $row.append(this.styleType);
        $row.append(this.styleItem);
    };

    render() {
        return $(`
            <div class="col col-md-4 col-style">
                <div class="row"></div>
            </div>`
        );
    }
}