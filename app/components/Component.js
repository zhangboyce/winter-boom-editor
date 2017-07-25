'use strict';

import ConfirmModal from './common/ConfirmModal';
import Message from './common/Message';

const confirmModal = new ConfirmModal();
const message = new Message();

function Component(props) {
    props = props || {};
    for (let k in props) {
        if (Object.prototype.hasOwnProperty.call(props, k)) {
            Object.defineProperty(this, k, {
                value: props[k],
                writable: false,
                configurable: false,
                enumerable: false
            });
        }
    }

    Object.defineProperty(this, 'confirm', {
        value: confirmModal.confirm,
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.defineProperty(this, 'message', {
        value: message,
        writable: false,
        configurable: false,
        enumerable: false
    });
}

Component.prototype.render = function() {};

export default Component;