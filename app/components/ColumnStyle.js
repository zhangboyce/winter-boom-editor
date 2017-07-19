'use strict';
import Component from './Component';
import StyleType from './StyleType';
import StyleItem from './StyleItem';

export default class extends Component {
    constructor(props) {
        super(props);

        this.styleType = new StyleType({ onGetItems: this.__handleGetItems__ });
        this.styleItem = new StyleItem();
    }

    __handleGetItems__ = items => {
        this.styleItem.setItems(items);
    };

    render() {
        let $columnStyle = $(`<div class="col col-md-4 col-style"></div>`);
        let $row = $(`<div class="row"></div>`).appendTo($columnStyle);

        $row.append(this.styleType.render());
        $row.append(this.styleItem.render());

        return $columnStyle;
    }
}