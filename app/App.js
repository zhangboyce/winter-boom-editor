'use strict';
import Component from './components/Component';
import Header from './components/Header';
import Main from './components/Main';

export default class extends Component {
    constructor(props) {
        super(props);
        this.header = new Header();
        this.main = new Main();

        this.rendered();
    }

    rendered() {
        this.append(this.header);
        this.append(this.main);
    }

    render() {
       return $(`<div id="app" class="container-fluid"></div>`);
    }
}