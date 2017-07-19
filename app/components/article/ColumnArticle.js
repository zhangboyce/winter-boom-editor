'use strict';
import Component from './../Component';

export default class extends Component {
    render() {
        let $columnArticle = $(`<div class="col col-md-2 col-article"></div>`);

        return $columnArticle;
    }
}