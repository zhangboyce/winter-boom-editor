'use strict';
import Component from './../Component';

export default class extends Component {

    render() {
        let $columnEditor = $(`<div class="col col-md-6 col-editor"></div>`);
        return $columnEditor;
    }
}