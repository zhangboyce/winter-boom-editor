'use strict';
import '../public/style/main.less';
import App from './App';

let app = new App();

$('#winter-boom-editor').html(app);

$(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false;
        }

    });
});