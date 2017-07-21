'use strict';

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
}

Component.prototype.render = function() {};

export default Component;