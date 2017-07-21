'use strict';
import Component from './Component';
import ColumnStyle from './style/ColumnStyle';
import ColumnEditor from './editor/ColumnEditor';
import ColumnArticle from './article/ColumnArticle';

export default class extends Component {
    render() {
        let $main = $(`<div class="row main"></div>`);

        let columnEditor = new ColumnEditor();
        let columnStyle = new ColumnStyle({ editor: columnEditor });
        let columnArticle = new ColumnArticle({ editor: columnEditor });

        $main.append(columnStyle.render());
        $main.append(columnEditor.render());
        $main.append(columnArticle.render());


        return $main;
    }
}