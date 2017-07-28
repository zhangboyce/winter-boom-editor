'use strict';

export default class  {
    constructor(props) {
        this.$header = null;
        this.$body = null;
        this.$footer = null;
        this.id = props.id;
    }

    open = options => {
        $('body').append(this.rendered());

        let $this = $('#' + this.id);
        $this.modal(options);

        $this.on('hidden.bs.modal', e => {
            $this.remove();
        });
    };

    close = () => {
        $('#' + this.id).modal('hide');
    };

    rendered = () => {
        let $this = this.render();
        let $content = $this.find('.modal-content');

        if (this.$header) {
            let $modal_header = $(`
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true" style="font-size: 32px">&times;</span>
                    </button>
                </div>
            `);
            $modal_header.append(this.$header);
            $content.append($modal_header);
        }
        this.$body && $content.append($(`<div class="modal-body"></div>`).append(this.$body));
        this.$footer && $content.append($(`<div class="modal-footer"></div>`).append(this.$footer));

        $this.attr('id', this.id);

        return $this;
    };

    render() {
        return $(`
            <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">

                    </div>
                </div>
            </div>
        `)
    }
}