/* NOTE: experimental and not production ready. Keep in touch for stable release */

import {normalize, createCanvas, addEventListeners, loop} from './helpers';

/**
 * BigMouse Core API
 * The minimalist API it exposes consist of three single methods: configure, enable and disable.
 * @type {{configure: Function({plugins, selector, draw}), enable: Function, disable: Function}}
 */
const BigMouse =  {

    configure(options){

        this.options = normalize(this, options);

        this.canvas = createCanvas(this);

        addEventListeners(this);

        loop(this);

    },

    enable(){

        this.enabled = true;
    },

    disable(){

        this.enabled = false;
    }
};

// Cheese/Mouse Freak Alias
BigMouse.cheese = BigMouse.configure;
BigMouse.feed = BigMouse.enable;
BigMouse.trap = BigMouse.disable;

// Note: not using "export default" es6 to bypass .default when using library globally from window scope.
/* export a singleton instance */
module.exports = exports = Object.create(BigMouse);