'use strict';
import Component from './components/Component';
import Header from './components/Header';
import Main from './components/Main';

export default class extends Component {
    render() {
        let header = new Header();
        let main = new Main();

        let $app = $(`<div id="app" class="container-fluid"></div>`);
        $app.append(header.render());
        $app.append(main.render());

        return $app;
    }
}