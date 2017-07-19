'use strict';
import Component from './Component';
import ColumnStyle from './ColumnStyle';
import ColumnEditor from './ColumnEditor';
import ColumnArticle from './ColumnArticle';

export default class extends Component {
    render() {
        let $main = $(`<div class="row main"></div>`);

        let columnStyle = new ColumnStyle();
        let columnEditor = new ColumnEditor();
        let columnArticle = new ColumnArticle();

        $main.append(columnStyle.render());
        $main.append(columnEditor.render());
        $main.append(columnArticle.render());


        return $main;
    }
}