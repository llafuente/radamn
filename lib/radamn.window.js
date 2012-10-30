(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        __debug = browser ? $.debug : require("node-class").debug;

    /**
     * @class Window
     */
    var Win = new Class("RadamnWindow",
    /** @lends Window.prototype */
    {
        /**
         * @member Window
         * @type {Number}
         */
        id: null,
        /**
         * @type {Number}
         */
        width: null,
        /**
         * @type {Number}
         */
        height: null,
        /**
         * @type {Canvas}
         */
        __context: null,
        /**
         * @type {Function}
         */
        onRequestFrame: null, // buffer flip
        /**
         * @type {Function}
         */
        enterFrame: null,
        /**
         * @type {Function}
         */
        leaveFrame: null,
        /**
         * @type {Element}
         */
        surface: null
    });

    Win.implements({
        /**
         * @constructs
         * @param {Number} id
         * @param {Canvas} canvas
         */
        __construct: function (options) {
            __debug("init window:", options);
            this.lastRenderDate = Date.now();

            /*
            if (!this.surface) {
                this.surface = document.createElement("canvas");
                this.surface.width = this.width;
                this.surface.height = this.height;
            }

            this.__context = this.surface.getContext("2d");
            */

            //hacky, i like it!!
            var RootNode = new Class("RadamnNode", {});
            RootNode.extends(Radamn.Node);
            RootNode.prototype.isRoot = function () {
                return true;
            };

            this.rootNode = new RootNode();

            this.__camera = new Radamn.Camera(this);

            return this;
        },
        /**
         * this call render but no now in 1ms
         * @param {Number} fps false means: as fast as possible!!!
         */
        start: function (fps) {
            this.running = true;

            window.requestAnimationFrame(this.bound.__renderLoop);
        },
        /**
         * is quad viewable, give the coords in screen position!
         */
        isPointVisible: function (x, y) {
            return true;
            //__debug(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
            return x > 0 && x < this.width && y < this.height && y > 0;
        },
        /**
         * is quad viewable, give the coords in screen position!
         */
        isQuadVisible: function (x, y, w, h) {
            //__debug(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
            return x + w > 0 && x < this.width && y < this.height && y + h > 0;
        },
        /**
         * @see Window.render
         * @private
         */
        __renderNode: function (ctx, node, delta, fnbefore, fnafter) {
            ctx.save();
            node.matrix.applyToCanvas(ctx);

            if (fnbefore) {
                fnbefore(ctx, delta);
            }

            var i;
            for (i = 0; i < node.childEntities.length; ++i) {
                node.childEntities[i].draw(ctx, delta);
            }

            for (i = 0; i < node.childNodes.length; ++i) {
                this.__renderNode(ctx, node.childNodes[i], delta, null, null);
            }

            if (fnafter) {
                fnafter(ctx, delta);
            }

            ctx.restore();
        },
        /**
         * @param {Number} delta
         * @param {Function} fnbefore exec before render any node
         * @param {Function} fnafter exec before render any node
         * @type {Function}
         */
        render: function (delta, fnbefore, fnafter) {
            this.__camera.update();
            this.__renderNode(this.getContext(), this.rootNode, delta, fnbefore || null, fnafter || null);
        },
        /**
         * @TODO do it!
         * @param Number x
         * @param Number y
         */
        ray: function (x, y) {
            return [this.rootNode];
        },
        getCamera: function () {
            return this.__camera;
        },
        /**
         * @returns {Canvas}
         */
        getContext: function () {
            return this.__context;
        },
        setContext: function(ctx) {
            this.__context = ctx;
            return this;
        },
        /**
         * TODO what to do in the browser ?!
         * @params {Number} color Uint32 Color
         * @returns {Screen}
         */
        setBackgroundColor: function (color) {
            if (CRadamn.GL.setBackgroundColor) {
                CRadamn.GL.setBackgroundColor(color);
            }
        },
        /**
         * @params {Image} image
         * @returns {Screen}
         */
        setBackgroundImage: function (image) {},
        /**
         * @params {Image} image
         * @returns {Screen}
         */
        isFullscreen: function () {},
        /**
         * @params {Boolean} full
         * @returns {Boolean}
         */
        setFullscreen: function (full) {},
        /**
         * @params {Boolean} win
         * @returns {Boolean}
         */
        setWindowed: function (win) {},
        /**
         * @returns {Boolean}
         */
        toggleFullscreen: function () {},
        /**
         * @returns {Node}
         */
        getRootNode: function () {
            return this.rootNode;
        },
        /**
         * take a screenshot
         */
        screenshot: function () {
            CRadamn.Window.screenshot(this);
        }
    });

    exports.Window = Win;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));
