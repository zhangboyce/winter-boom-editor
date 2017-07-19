'use strict';
import '../public/style/winter.boom.editor.less';
import App from './App';

let app = new App();
$('#winter-boom-editor').html(app.render());