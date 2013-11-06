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
        BB2 = browser ? window.BB2 : require("js-2dmath").BB2,
        DomWindow = browser ? window : {},
        Radamn,
        __debug = console.log,
        __verbose = console.log,
        when_ready,
        dom_ready,
        path;

    if (!browser) {
        // Radamn Cland, polute globals dont worry... do not use var... I now... browser fail
        // if there is no CRadamn, it means, client mode
        if (global.CRadamn === undefined) {
            try {
                exports.CRadamn = global.CRadamn = require('./cradamn.node');
            } catch (e) {
                // this is for test purposes
                // load cradamn shim, same as browsers
                require('./shim.cradamn.js');
                console.log("# c-radamn not found. so you cannot create a window.");
            }
            require('./html/element.js');
            require('./html/document.js');
            require('./html/image.js');
            require('./html/canvas.js');
            require('./html/window.js');
        }

        require('./radamn.math.js');

        path = require("path");
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
            console.log("#requestAnimationFrame suported");
        }
    }());

    /**
     * @class Radamn
     */
    Radamn = new Class("Radamn",/** @lends Radamn.prototype */{
        //define here all clases!
        Scene: null,
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
        AI: {},
        ALIGN: {
            TOPLEF: BB2.TOPLEFT,
            TOPMIDDLE: BB2.TOPMIDDLE,
            TOPRIGHT: BB2.TOPRIGHT,
            CENTERLEFT: BB2.CENTERLEFT,
            CENTER: BB2.CENTER,
            CENTERRIGHT: BB2.CENTERRIGHT,
            BOTTOMLEFT: BB2.BOTTOMLEFT,
            BOTTOM: BB2.BOTTOM,
            BOTTOMRIGHT: BB2.BOTTOMRIGHT,
        },

        vars: {
            speed: 1
        },
        running: true,

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
        __scenes: [],
        /**
         * versions of each component
         * @member Radamn
         * @returns {Object}
         */
        getVersion: CRadamn.getVersion,
        /**
         * @member Radamn
         * @returns {Array} list of valid resolutions
         * @see Radamn.createScene
         */
        getVideoModes: CRadamn.getVideoModes
    });

    Radamn.Extends(Events);

    Radamn.Implements(/** @lends Radamn.prototype */{
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
        createScene: function (width, height, canvas) {
            console.log("# create scene: ", width, height, canvas);

            var scene = new exports.Radamn.Scene({
                    canvas: canvas || CRadamn.createWindow(width, height),
                    width: width,
                    height: height
                });

            this.__scenes.push(scene);

            scene.pipe_events(this);
            // this is how you hack the restriction of scaling the root node
            // this is done this way so YOU KNOW WHAT YOU ARE DOING!
            // scene.getCamera().scale(width / internal_width, height / internal_height);
            // this.Input.addEvent("quit");
            return scene;
        },
        /**
         * starts the render loop with a given delay in milisenconds
         * @member Radamn
         * @param {Number} delay miliseconds
         */
        start: function (delay) {
            this.intervals.frameDelay = delay;
            var render_fn;

            this.render_fn = render_fn = function () {
                if (this.running) {
                    DomWindow.requestAnimationFrame(render_fn, delay);
                }

                this.render();
            }.bind(this);
            DomWindow.requestAnimationFrame(render_fn, delay);
        },
        /**
         * stops the render loop
         * @member Radamn
         * @param {Number} delay miliseconds
         */
        stop: function () {
            this.running = false;
        },
        /**
         * stops the render loop
         * @member Radamn
         * @param {Number} delay miliseconds
         * @private
         */
        render: function () {

            var now = Date.now(),
                delta,
                i,
                scene,
                ctx;

            if (delta < this.intervals.frameDelay) {
                return;
            }

            for (i = 0; i < this.__scenes.length; ++i) {
                scene = this.__scenes[i];
                delta = (now - scene.last_render) * this.vars.speed;

                ctx = scene.getContext();
                //win.getRootNode().freeze();

                 ctx.save();
                //@native
                if (ctx.clear) {
                    ctx.clear();
                } else {
                    if ("undefined" === typeof ejecta) {
                        ctx.clearRect(0, 0, scene.width, scene.height);
                    } else {
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.fillStyle="#000000";
                        ctx.fillRect(0, 0, scene.width, scene.height);
                    }
                }
                ctx.restore();

                ctx.save();
                scene.render(delta);
                ctx.restore();

                scene.last_render = now;
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
            if (process && process.exit) {
                process.exit();
            }
        },
        getScene: function (wid) {
            return this.__scenes[wid || 0];
        },
        AI: {},
        set: function (variable, value) {
            var old = this.vars[variable] || null;

            this.vars[variable] = value;
            this.emit("var:change", [variable, value, old]);

            return old;
        },
        get: function (variable) {
            var out = this.vars[variable];
            return out === undefined ? null : out;
        },
        log: function () {
            this.emit("log", arguments);
        },
        debug: function () {
            this.emit("log:debug", arguments);
        },
        warning: function () {
            this.emit("log:warning", arguments);
        },
        verbose: function () {
            this.emit("log:verbose", arguments);
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
         * @type node
         */
        Radamn.Movable = require("./radamn.movable.js").Movable;
        /**
         * @type node
         */
        Radamn.Node = require("./radamn.node.js").Node;
        /**
         * @type node
         */
        Radamn.RootNode = require("./radamn.rootnode.js").RootNode;
        /**
         * @type node
         */
        Radamn.Layer = require("./radamn.layer.js").Layer;
        /**
         * @type Camera
         */
        Radamn.Camera = require("./radamn.camera.js").Camera;
        /**
         * @type Scene
         */
        Radamn.Scene = require("./radamn.scene.js").Scene;
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
         * @type Audio
         */
        Radamn.Audio = require("./radamn.audio.js").Audio;
        /**
         * @type Image
         */
        Radamn.Image = require("./radamn.image.js").Image;
        /**
         * @type Sprite
         */
        Radamn.Sprite = require("./radamn.sprite.js").Sprite;
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

    // set default config
    Radamn.set("root", browser ? "/" : path.dirname(__filename));


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

    when_ready = function () {
        Radamn.emit("ready");
    };

    //from jQuery
    if (browser) {
        // The ready event handler and self clean up method
        dom_ready = function () {
            document.removeEventListener("DOMContentLoaded", dom_ready, false);
            window.removeEventListener("load", dom_ready, false);

            when_ready.delay(0);
        };

        if (document.readyState === "complete") {
            when_ready.delay(0);
        } else {
            document.addEventListener("DOMContentLoaded", dom_ready, false);
            window.addEventListener("load", dom_ready, false);
        }
    } else {
        when_ready.delay(0);
    }


}("undefined" === typeof module ? window : module.exports, "undefined" === typeof module));