'use strict';

import ConfirmModal from './common/ConfirmModal';
import Message from './common/Message';
import { isFunction } from '../../common/TypeUtils';

const confirmModal = new ConfirmModal();
const message = new Message();

const hasOwnProperty = Object.prototype.hasOwnProperty;
const __defineProperty__ = (self, name, value, options = {}) => {
    let defaultOpts = {
        writable: false,
        configurable: false,
        enumerable: false
    };
    let opts = Object.assign(defaultOpts, options, { value: value });
    Object.defineProperty(self, name, opts);
};

function Component(props) {
    props = props || {};

    // add props's property to this
    for (let k in props) {
        if (hasOwnProperty.call(props, k)) {
            __defineProperty__(this, k, props[k]);
        }
    }

    // add some common objects or functions to this
    __defineProperty__(this, 'confirm', confirmModal.confirm);
    __defineProperty__(this, 'message', message);

    if (!isFunction(this.render)) {
        throw new Error(`Component must have a render function.`);
    }

    let $this = this.render();
    if (!($this instanceof jQuery)) {
        throw new Error(`Component's render function must return a jQuery object.`);
    }

    let this__proto__ = Object.getPrototypeOf(this);
    let p_prototype = Component.prototype || {};
    for (let p in p_prototype) {
        if (hasOwnProperty.call(p_prototype, p)) {
            this__proto__[p] = p_prototype[p];
        }
    }

    let cs = $this.constructor;
    Object.setPrototypeOf(this__proto__, Object.getPrototypeOf($this));
    //Object.setPrototypeOf(this, this__proto__);
    Object.setPrototypeOf($this, this);

    $this.constructor = cs;
    return $this;
}

export default Component;