/**
    README

    Inspiration
    - http://love2d.org/wiki/Main_Page
    - http://www.ogre3d.org the big render engine friendly monster
*/

(function (exports, browser) {
    "use strict";
    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        typeOf = browser ? NodeClass.typeof : require("node-class").typeof,
        DomWindow = browser ? window : {},
        Radamn,
        __debug = browser ? NodeClass.debug : require("node-class").debug,
        __verbose = browser ? NodeClass.verbose : require("node-class").verbose,
        when_ready,
        dom_ready;

    if (!browser) {
        // Radamn Cland, polute globals dont worry... do not use var... I now... browser fail
        // if there is no CRadamn, it means, client mode
        if (global.CRadamn === undefined) {
            exports.CRadamn = global.CRadamn = require('./cradamn.node');
            require('./html/element.js');
            require('./html/document.js');
            require('./html/image.js');
            require('./html/canvas.js');
            require('./html/window.js');
        }

        require('./radamn.math.js');
    }

    (function () {
        ['ms', 'moz', 'webkit', 'o'].forEach(function (v, k) {
            var rq = v + 'RequestAnimationFrame';
            if (DomWindow[rq]) {
                DomWindow.requestAnimationFrame = DomWindow[rq];
            }
            rq = v + 'CancelAnimationFrame';
            if (DomWindow[rq]) {
                DomWindow.cancelAnimationFrame = DomWindow[rq];
            }
            rq = v + 'CancelRequestAnimationFrame';
            if (DomWindow[rq]) {
                DomWindow.cancelAnimationFrame = DomWindow[rq];
            }
        });

        if (!DomWindow.requestAnimationFrame) {
            DomWindow.requestAnimationFrame = function (fn, delay) {
                DomWindow.requestAnimationInterval = setTimeout(fn, delay);
            };

            DomWindow.requestAnimationInterval = null;

            DomWindow.cancelAnimationFrame = function () {
                clearTimeout(DomWindow.requestAnimationInterval);
            };
        } else {
            __debug("requestAnimationFrame suported");
        }
    }());

    /**
     * @class Radamn
     */
    Radamn = new Class("Radamn",
    /** @lends Radamn.prototype */
    {
        //define here all clases!
        Window: null,
        Node: null,
        Camera: null,
        Assets: null,
        Resource: null,
        ResourceRendereable: null,
        Image: null,
        Request: null,
        TMX: null,
        Font: null,
        $: null,
        Text: null,
        Bar: null,
        Animation: null,
        CanvasRenderingContext2D: null,
        Canvas: null,
        Sound: null,
        AI: null,

        vars: {},

        createRenderable: null,

        intervals : {
            render: null
        },
        /**
         * @field
         * @member Radamn
         * @type Array of Windows
         * @private
         */
        __windows: [],
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
        getVideoModes: CRadamn.getVideoModes
    });

    Radamn.Extends(Events);

    Radamn.Implements(
    /** @lends Radamn.prototype */
    {
        __construct: function () {
            this.parent();
        },
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
        createWindow: function (internal_width, internal_height, width, height) {
            width = width || internal_width;
            height = height || internal_height;

            var canvas_el = CRadamn.createWindow(width, height);
                var win = new exports.Radamn.Window({
                    canvas: canvas_el,
                    width: width,
                    height: height
                });

            this.__windows.push(win);

            win.pipe_events(this);
            // this is how you hack the restriction of scaling the root node
            // this is done this way so YOU KNOW WHAT YOU ARE DOING!
            win.getCamera().scale(width / internal_width, height / internal_height);
            //this.Input.addEvent("quit");
            return win;
        },
        /**
         * starts the render loop with a given delay in milisenconds
         * @member Radamn
         * @param {Number} delay miliseconds
         */
        start: function (delay) {
            this.intervals.frameDelay = delay;
            var render_fn = this.__renderLoop.bind(this), //throtthle ?
                wrap_fn;

            wrap_fn = function () {
                DomWindow.requestAnimationFrame(wrap_fn, delay);
                render_fn();
            };
            DomWindow.requestAnimationFrame(wrap_fn, delay);
        },
        /**
         * stops the render loop
         * @member Radamn
         * @param {Number} delay miliseconds
         */
        stop: function () {
            DomWindow.cancelAnimationFrame();
        },
        /**
         * stops the render loop
         * @member Radamn
         * @param {Number} delay miliseconds
         * @private
         */
        __renderLoop: function () {

            var now = Date.now(),
                delta = now - this.__windows[0].lastRenderDate;

            if (delta < this.intervals.frameDelay) {
                return;
            }

            var i,
                max = this.__windows.length;
            for (i = 0; i < max; ++i) {
                var win = this.__windows[i],
                    ctx = win.getContext();
                //win.getRootNode().freeze();

                //@native
                if (ctx.clear) {
                   ctx.clear();
                } else {
                    //ctx.canvas.width = ctx.canvas.width;
                    ctx.clearRect(0, 0, win.width, win.height);
                }

                ctx.save();

                if (win.onRequestFrame) {
                    win.onRequestFrame(delta);
                }

                ctx.restore();
                win.lastRenderDate = now;
                //win.getRootNode().unfreeze();
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
        quit: function () {
            exports.Radamn.Assets.destroyAllImages();
            exports.Radamn.Assets.destroyAllFonts();
            this.stop();
            CRadamn.quit();
            if(process && process.exit) {
                process.exit();
            }
        },
        getWindow: function (wid) {
            return this.__windows[wid || 0];
        },
        AI: {},
        set: function(variable, value) {
            var old = this.vars[variable] || null;

            this.vars[variable] = value;
            this.emit("var:change", [variable, value]);

            return old;
        },
        get: function(variable) {
            return this.vars[variable] || null;
        }
    });

    //
    //*********************************************************************************
    // Create Radamn object! polute globals dont worry...

    if (browser) {
        exports.Radamn = Radamn = new Radamn();
    } else {
        CRadamn.init();

        exports.Radamn = global.Radamn = Radamn = new Radamn();

        //
        //*********************************************************************************
        // Override some components that need to be inited after creation.

        Radamn.$ = require("./radamn.$.js").$; //manually in the browser...

        //
        //*********************************************************************************
        //

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
        Radamn.AI = {};
        /**
         * @type Sound
         */
        Radamn.AI.AStar = require("./radamn.ai.astar.js").AStar;
    }

    /**
     * @member Radamn
     * @param {Function} render_function, it will take to params ctx, delta
     */
    exports.Radamn.createRenderable = function (render_function) {
        var CustomRendereable = new Class("CustomRendereable", {});
        CustomRendereable.Extends(exports.Radamn.ResourceRendereable);
        CustomRendereable.Implements({
            draw: render_function
        });

        return (new CustomRendereable());
    };

    when_ready = function() {
        Radamn.emit("ready");
    };

    //from jQuery
    if(browser) {
        // The ready event handler and self cleanup method
        dom_ready = function() {
            document.removeEventListener( "DOMContentLoaded", dom_ready, false );
            window.removeEventListener( "load", dom_ready, false );

            when_ready.delay(0);
        };

        if ( document.readyState === "complete" ) {
            when_ready.delay(0);
        } else {
            document.addEventListener( "DOMContentLoaded", dom_ready, false );
            window.addEventListener( "load", dom_ready, false );
        }
    } else {
        when_ready.delay(0);
    }


}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));
