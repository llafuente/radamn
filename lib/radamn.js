/**
inspiration
- http://love2d.org/wiki/Main_Page
- http://www.ogre3d.org the big render engine friendly monster

R.A.DAMN = render async damn!
RADAMN = real awful day after morning nap lol!
*/

console.once = function() {
    var args = Array.from(arguments);
    var type = args[0];
    args.shift();
    if(this[type] === undefined) {
        this[type] = true;
        console.log.apply(this, args);
    }
};

/**
debug guidlines
- while working use debug
- when stable move and clean to info
- do not use log, its messy in firebug
*/
if(typeof exports != "undefined") {
    //change colors and add the usual, timestamp, sessionid, ip, file-line
    console.warning = console.log;
    console.debug = console.log;
    console.error = console.log;
}

(function(exports, browser) {
//"use strict"; mootools is not strict :S

if(!browser) {
    // Radamn Cland, polute globals dont worry... do not use var... I now... browser fail
    // if there is no CRadamn, it means, client mode
    if(this.CRadamn === undefined) {
        exports.CRadamn = global.CRadamn = require('./radamn.node');
    }

    /**
     * include mootools to have a proper class design
     * also add this hack to keep keyboard compatibility :)
     * @ignore
     */
    var document;
    /**
     * @ignore
     */
    global.document = this.document = document = (function() {
        var events = null;
        return {
            addEvents: function(events) {

            },
            getEvents: function() {
                return events;
            },
            html : {
                style : {}
            },
            id: function(arg) { return arg; }
        }
    })();

    require('./mootools-core-1.4.3-server.js');
    require('./mootools-hash.js');
    require('./mootools-extensions.js');
    require('./mootools-extends-server.js');
    require('./radamn.math.js');
} else {
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
    }());
}

/**
 * @class Radamn
 */
var Radamn = new Class(
/** @lends Radamn.prototype */
{
    Implements: [Options, Events],

    intervals : {
        render: null,
        input: null
    },
    /**
     * @field
     * @member Radamn
     * @type Array of Windows
     * @private
     */
    __windows: [],
    /**
     * @field
     * @member Radamn
     * @type RadamnDefines
     * @public
     */
    $ : null,
    /**
     * @member Radamn
     * @constructs
     */
    initialize: function() {
    },
    /**
     * versions of each component
     * @member Radamn
     * @returns {Object}
     */
    getVersion: CRadamn.getVersion,
    /**
     * @member Radamn
     * @returns {Array} list of valid resolutions
     * @see Radamn.createWindow
     */
    getVideoModes: CRadamn.getVideoModes,
    /**
     * Create an OpenGL window and set and internal resolution (game) and external(window)
     * This only affects everything rendered inside the main loop
     * @TODO Think about OpenGL/ES(2)
     * @member Radamn
     * @param {Number} internal_width
     * @param {Number} internal_height
     * @param {Number} width
     * @param {Number} height
     * @param {Number} options
     * @returns {Window}
     */
    createWindow: function(internal_width, internal_height, width, height) {
        width = width || internal_width;
        height = height || internal_height;

        var canvas = CRadamn.createWindow(width, height);

        var window = new this.Window(canvas, width, height);

        this.__windows.push(window);
        // this is how you hack the restriction of scaling the root node
        // this is done this way so YOU KNOW WHAT YOU ARE DOING!
        window.getCamera().scale(width / internal_width, height / internal_height);
        //this.Input.addEvent("quit");
        return window;
    },
    /**
     * starts the render loop with a given delay in milisenconds
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    start: function(delay) {
        this.intervals.frameDelay = delay;
        var render_fn = this.__renderLoop.bind(this);
        var wrap_fn;

        if(typeof window != "undefined" && window.requestAnimationFrame) {
            wrap_fn = function() {
                window.requestAnimationFrame(wrap_fn);
                render_fn();
            };
            this.intervals.render = window.requestAnimationFrame(wrap_fn);
        } else {
            this.intervals.render = setInterval(render_fn, delay);
        }
    },
    /**
     * stops the render loop
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    stop: function() {
        if(typeof window != "undefined" && window.cancelAnimationFrame) {
            window.cancelAnimationFrame(this.intervals.render);
        } else {
            clearInterval(this.intervals.render);
        }
        this.intervals.render = null;
    },
    /**
     * stops the render loop
     * @member Radamn
     * @param {Number} delay miliseconds
     * @private
     */
    __renderLoop: function() {
        var now = Date.now();
        var delta = now - this.__windows[0].lastRenderDate;
        if(delta < this.intervals.frameDelay) return ;

        var i=0,max=this.__windows.length;
        for(i=0; i<max; ++i) {
            var win = this.__windows[i];
            //win.getRootNode().freeze();
           var canvas = win.getCanvas();
            var ctx = canvas.getContext("2d");

            //@native
            if(ctx.clear) {
               ctx.clear();
           } else {
                canvas.width = canvas.width;
               //ctx.clearRect(0, 0, win.width, win.height);
           }

           ctx.save();

            if(win.onRequestFrame) {
                win.onRequestFrame(delta);
            }

            if(ctx.__flip) ctx.__flip();
            ctx.restore();
            win.lastRenderDate = now;
            //win.getRootNode().unfreeze();
        }
    },
    /**
     * starts listening the input with the given delay in milisenconds
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    listenInput: function(delay) {
        this.intervals.input = setInterval(this.__listenInputLoop.bind(this), delay);
    },
    /**
     * stop listening the input
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    stopListeningInput: function() {
        clearInterval(this.intervals.input);
        this.intervals.input = null;
    },
    /**
     * listen loop
     * @member Radamn
     * @private
     */
    __listenInputLoop: function() {
        var data = null;
        while ((data = CRadamn.pollEvent()) !== false) {
            this.fireEvent(data.type, data);
        }
    },
    /**
     * destroy everything
     * - images
     * - fonts
     * - stop render loop
     * - stop listening input
     * - and send the quit to the cland
     * @member Radamn
     */
    quit: function() {
        Radamn.Assets.destroyAllImages();
        Radamn.Assets.destroyAllFonts();
        this.stop();
        this.stopListeningInput();
        CRadamn.quit();
    },
    getWindow: function(wid) {
        return this.__windows[wid || 0];
    },
    AI: {}
});

//
//*********************************************************************************
// Create Radamn object! polute globals dont worry...

if(browser) {
    exports.Radamn = new Radamn();
} else {

    CRadamn.init();
    exports.Radamn = global.Radamn = Radamn = new Radamn();
    //
    //*********************************************************************************
    // Override some components that need to be inited after creation.
    Radamn.$ = require("./radamn.$.js").$; //manually in the browser...
}

//
//*********************************************************************************
// Screen Object

/**
 * @member Radamn
 * @param {Function} render_function, it will take to params ctx, delta
 */
Radamn.createRenderable = function(render_function) {
    var rendereable = new Radamn.ResourceRendereable();
    rendereable.draw = render_function;
    return rendereable;
}

//
//*********************************************************************************
//

if(!browser) {

    /**
     * @type Camera
     */
    Radamn.Camera = require("./radamn.camera.js").Camera;
    /**
     * @type Window
     */
    Radamn.Window = require("./radamn.window.js").Window;
    /**
     * @type Assets
     */
    Radamn.Assets = require("./radamn.assets.js").Assets;
    /**
     * @type Resource
     */
    Radamn.Resource = require("./radamn.resource.js").Resource;
    /**
     * @type ResourceRendereable
     */
    Radamn.ResourceRendereable = require("./radamn.resource.rendereable.js").ResourceRendereable;
    /**
     * @type Text
     */
    Radamn.Text = require("./radamn.text.js").Text;
    /**
     * @type Text
     */
    Radamn.Bar = require("./radamn.bar.js").Bar;
    /**
     * @type Image
     */
    Radamn.Image = require("./radamn.image.js").Image;
    /**
     * @type Animation
     */
    Radamn.Animation = require("./radamn.animation.js").Animation;
    /**
     * @type Font
     */
    Radamn.Font = require("./radamn.font.js").Font;
    /**
     * @type Canvas
     */
    Radamn.Canvas = require("./radamn.canvas.js").Canvas;
    /**
     * @type node
     */
    Radamn.Node = require("./radamn.node.js").Node;
    /**
     * @type TMX
     */
    Radamn.TMX = require("./radamn.tmx.js").TMX;
    /**
     * @type Sound
     */
    Radamn.Sound = require("./radamn.sound.js").Sound;
    /**
     * @type Sound
     */
    Radamn.AI.AStar = require("./radamn.ai.astar.js").AStar;
}


})(typeof exports === "undefined" ? this : exports, typeof exports === "undefined");

