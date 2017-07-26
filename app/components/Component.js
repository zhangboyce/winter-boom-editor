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
}

Component.prototype.inject = function () {
    // execute render function and return a jquery object as $this
    let $this = this.render();
    if (!($this instanceof jQuery)) {
        throw new Error(`Component's render function must return a jQuery object.`);
    }
    // add $this property to this
    __defineProperty__(this, '$this', $this);


    Component.prototype.rendered = function() {
        if (isFunction(this.__rendered__))
            this.__rendered__();

        return this.$this;
    };

    let jQO = $('');
    for (let k in jQO) {
        if (isFunction(jQO[k])) {
            Component.prototype[k] = function () {
                let args = Array.from(arguments).map(arg => {
                    if (arg instanceof Component) {
                        return arg.rendered();
                    } else
                        return arg;
                });
                return jQO[k].apply(this.$this, args);
            };
        }
    }

    return this;
};

export default Component;