
//@todo - 11 July 2016 - watch out for memory leak in closures
//@todo - 11 July 2016 - selector just matches tag elements
//@todo - 11 July 2016 - hovering an element using a plugin does not render unless you hover it for a while (related to throttle)
//@todo - 11 July 2016 - unit test suite

/**
 * Parse and normalize default options
 * @param self BigMouse instance
 * @param options The input options
 * @returns {plugins, draw, selector}
 */
export function normalize(self, options){

    self.enabled = false;

    // Alias
    if(options.cheeses) options.plugins = options.cheeses;
    if(options.portions) options.selector = options.portions;
    if(options.harborage) options.draw = options.harborage;

    if(options.selector) options.selector = options.selector.toLowerCase();

    return options;
}

/**
 * Append a canvas element into the HTML body document sizing the whole page
 * @param self BigMouse instance
 * @returns {{el: Element, ctx: CanvasRenderingContext2D}}
 */
export function createCanvas(self){

    const canvas = document.createElement('canvas');

    canvas.width = document.body.scrollWidth;//window.innerWidth;
    canvas.height = document.body.scrollHeight;//window.innerHeight;
    canvas.setAttribute("style", "position:absolute;top:0;left:0;pointer-events:none;");

    document.body.appendChild(canvas);

    self.currentElement = canvas;

    return {el:canvas, ctx: canvas.getContext("2d")};
}

/**
 * Attach resize and mousemove event handler listeners
 * @param self BigMouse instance
 */
export function addEventListeners(self){

    self.mouseCoords = {x: self.canvas.el.width / 2, y: self.canvas.el.height/2};

    window.addEventListener('mousemove', throttle(onMouseMove(self), () => self.debouncing ? 0 : 150, {trailing:false}));

    window.addEventListener('resize', throttle(onResize(self), () => 150, {trailing:false}));
}

/**
 * Kick off the infinite render loop
 * @param self
 */
export function loop(self){

    self.loopID = requestAnimationFrame(()=> loop(self));

    if(!self.enabled || !self.painter) return;

    self.painter(self);
}

/**
 * Retrieve the current mouse coordinates position
 * @param canvasDOM
 * @param event
 * @returns {{x: number, y: number}}
 */
function  getCurrentMousePos(canvasDOM, event) {

    const rect = canvasDOM.getBoundingClientRect(); // abs. size of element
    const scaleX = canvasDOM.width / rect.width;    // relationship bitmap vs. element for X
    const scaleY = canvasDOM.height / rect.height;  // relationship bitmap vs. element for Y

    return {
        x: event.pageX - window.pageXOffset, // (event.pageX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: event.pageY - window.pageYOffset// (event.pageY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

/**
 * Manages plugin calls, if any, from user draw method
 * @param self
 * @param element
 * @returns {Function}
 */
function done(self, element){

    return (plugin, options) => {

        if(!plugin){

            self.enabled = false;
            self.canvas.ctx.clearRect(0, 0, self.canvas.el.width, self.canvas.el.height);
            return self.currentElement = self.canvas.el;

        }

        self.currentElement = element;

        self.painter = getPainter(self, self.options.plugins[plugin], options);
        self.enabled = true;

    }
}

/**
 * Request painter method to the active plugin
 * @param self
 * @param plugin
 * @param options
 * @returns {Function}
 */
function getPainter(self, plugin, options){

    if(!plugin) return;

    return plugin.painter(self, options);
}

/**
 * The mousemove event handler, in charge of calling user draw method if applicable
 * @param self
 * @returns {Function}
 */
function onMouseMove(self){

    return event => {

        //if(!self.enabled) return;

        if(self.options.draw){

            self.mouseCoords = getCurrentMousePos(self.canvas.el, event);

            const element = document.elementFromPoint(self.mouseCoords.x, self.mouseCoords.y);

            if(element && element.isSameNode(self.currentElement)) return;

            if(element && element.tagName.toLowerCase() === self.options.selector){

                self.debouncing = true;
                self.options.draw(element, done(self, element));

            }
            else{
                self.debouncing = false;
                done(self)();
            }


        }


    }
}

/**
 * The resize event handler, in charge of resizing canvas size to fit full screen
 * @param self
 * @returns {Function}
 */
function onResize(self){

    return event => {

        self.canvas.el.width = document.body.scrollWidth;
        self.canvas.el.height = document.body.scrollHeight;

    }
}

/**
 * Underscore implementation of throttle function modified to accept a function as the wait parameter.
 * This allows to calculate waiting time dynamically.
 * @param func
 * @param wait
 * @param options
 * @returns {throttled}
 */
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait() - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait()) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
}
