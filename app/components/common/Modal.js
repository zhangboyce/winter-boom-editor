'use strict';
import Component from './../Component';

export default class extends Component {
    constructor(props) {
        super(props);

        this.$header = null;
        this.$body = null;
        this.$footer = null;
    }

    open = options => {
        $('body').append(this.render());

        let $this = $('#' + this.id);
        $this.modal(options);

        $this.on('hidden.bs.modal', e => {
            $this.remove();
        });
    };

    close = () => {
        $('#' + this.id).modal('hide');
    };

    render() {
        let $header = $(`<div class="modal-header"></div>`);
        $header.append(`
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" style="font-size: 32px">&times;</span>
            </button>`
        );
        this.$header && $header.append(this.$header);

        let $body = $(`<div class="modal-body"></div>`);
        $body.append(this.$body);

        let $footer = $(`<div class="modal-footer"></div>`);
        $footer.append(this.$footer);

        let $content = $(`<div class="modal-content"></div>`);
        $content.append($header);
        this.$body && $content.append($body);
        this.$footer && $content.append($footer);

        let $modal = $(`
            <div class="modal fade" id=${ this.id } tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalLabel">
            </div>`
        );

        $(`<div class="modal-dialog modal-lg" role="document"></div>`).append($content).appendTo($modal);
        return $modal;
    }
}