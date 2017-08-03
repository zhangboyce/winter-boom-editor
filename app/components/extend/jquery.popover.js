(function($) {
    'use strict';
     $.fn.extend({
         confirm: confirm
     });

    function confirm(message, placement= 'top' ) {
        return __confirm__($(this), {
            placement: placement,
            content: message
        });
    }

    function __confirm__($target, options) {
        let defaults = {
            trigger: 'click',
            html: true
        };

        options = $.extend(defaults, options);
        return this.each(function (){
            __popover__($target, options);
        });
    }

    function __popover__($target, options) {
        let ok = options.ok || function() {};
        let cancel = options.cancel || function() {};
        let shown = options.shown || function() {};
        let hidden = options.hidden || function() {};

        options.content = `
            <div class="edit-popover-warp">
                <div class="popover-inner">
                    <div class="edit-popover-content">
                          ${ options.content }
                    </div>
                    <div class="popover-bar">
                         <a href="javascript:;" class="btn btn-primary js-commitb-btn">确定</a>
                         <a href="javascript:;" class="btn btn-default js-canncel-btn">取消</a>
                    </div>
                </div>
            </div>`;

        let $this = $target;
        $this.on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
        }).popover(options);

        let $popover;
        $this.on('shown.bs.popover', () => {
            $popover = $this.next('.popover');

            // callback shown
            shown($popover);

            $popover.find('.popover-bar .js-commitb-btn').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                ok($popover, () => {
                    $this.popover('hide');
                    $this.click();
                });
            });

            $popover.find('.popover-bar .js-canncel-btn').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                $this.popover('hide');
                $this.click();

                // callback cancel
                cancel($popover);
            });
        });

        $this.on('hiden.bs.popover', () => {
            // callback shown
            hidden($popover);
        });
    }

    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false;
            }
        });
    });
})(jQuery);