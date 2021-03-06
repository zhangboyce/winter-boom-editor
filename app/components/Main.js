'use strict';
import Component from './Component';
import ColumnStyle from './style/ColumnStyle';
import ColumnEditor from './editor/ColumnEditor';
import ColumnArticle from './article/ColumnArticle';

export default class extends Component {

    constructor(props) {
        super(props);

        this.columnEditor = new ColumnEditor({ parent: this });
        this.columnStyle = new ColumnStyle({ editor: this.columnEditor });
        this.columnArticle = new ColumnArticle({ editor: this.columnEditor });

        this.rendered();
    }

    rendered() {
        this.append(this.columnStyle);
        this.append(this.columnEditor);
        this.append(this.columnArticle);
    }

    render() {
        return $(`<div class="row main"></div>`);
    }
}