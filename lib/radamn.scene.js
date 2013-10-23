(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        __debug = function () {}, //console.log,
        Scene,
        RootNode = browser ? window.Radamn.RootNode : require("radamn.rootnode.js").RootNode,
        Layer = browser ? window.Radamn.Layer : require("radamn.layer.js").Layer;

    /**
     * @class Scene
     */
    Scene = new Class("RadamnScene",/** @lends Scene.prototype */{
        /**
         * @member Scene
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
        canvas: null,
        layers: [],
        last_render: 0
    });

    Scene.Extends(Events);

    Scene.Implements({
        /**
         * @constructs
         * @param {Number} id
         * @param {Canvas} canvas
         */
        __construct: function (options) {
            this.parent();

            __debug("init Scene:", options);
            this.last_render = Date.now();

            this.__camera = new Radamn.Camera({scene: this});

            return this;
        },
        eachCamera: function (fn) {
            fn(this.__camera);
        },
        /**
         * this call render but no now in 1ms
         * @param {Number} fps false means: as fast as possible!!!
         */
        start: function (fps) {
            this.running = true;

            Scene.requestAnimationFrame(this.bound.__renderLoop);
        },
        /**
         * is quad viewable, give the coords in screen position!
         */
        isPointVisible: function (x, y) {
            return true;
            //__debug(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
            // return x > 0 && x < this.width && y < this.height && y > 0;
        },
        /**
         * is quad viewable, give the coords in screen position!
         */
        isQuadVisible: function (x, y, w, h) {
            //__debug(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
            return x + w > 0 && x < this.width && y < this.height && y + h > 0;
        },
        /**
         * emit: render:start & render:end
         * @param {Number} delta
         * @type {Function}
         */
        render: function (delta) {
            this.__camera.tick(delta);

            var i,
                ctx = this.getContext(),
                p = this.__camera.matrix;

            //ctx.transform(p[0], p[1], p[2], p[3], p[4], p[5]);

            this.emit("render:start");

            for (i = 0; i < this.layers.length; ++i) {
                if (this.layers[i].visible) {
                    ctx.save();
                    this.layers[i].render(ctx, delta);
                    ctx.restore();
                }
            }

            this.emit("render:end");

            return this;
        },
        /**
         * @TODO do it!
         * @param Number x
         * @param Number y
         */
        ray: function (x, y) {
            var i,
                out = [];

            for (i = 0; i < this.layers.length; ++i) {
                if (this.layers[i].visible) {
                    Array.combine(out, this.layers[i].ray(x, y));
                }
            }

            return out;
        },
        forEachNode: function (callback, bnode) {
            var that = this,
                i;

            if (bnode === undefined) {
                // for each rootNode
                for (i = 0; i < this.layers.length; ++i) {
                    if (this.layers[i].visible) {
                        this.forEachNode(callback, this.layers[i].rootNode);
                    }
                }
            } else {
                bnode.each(function (node) {
                    callback(node);
                    that.forEachNode(callback, node);
                });
            }
        },
        getLayer: function (layer_name) {
            var i;

            for (i = 0; i < this.layers.length; ++i) {
                if (this.layers[i].id === layer_name) {
                    return this.layers[i];
                }
            }

            return null;
        },
        isVisible: function (body) {
            var cam = this.getCamera(),
                ret = Intersection.rectangle_rectangle(cam.frustum, body);

            return ret.reason < Intersection.OUTSIDE;
        },
        getCamera: function () {
            return this.__camera;
        },
        /**
         * @returns {Canvas}
         */
        getContext: function () {
            return this.canvas.getContext("2d");
        },
        setCanvas: function (ctx) {
            this.context = ctx;
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
        setSceneed: function (win) {},
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
        createLayer: function (name, origin, size, z_index) {
            var layer = new Layer({
                id: name,
                scene: this,
                size: this,
                origin: origin
            });
            this.layers.push(layer);

            return layer;
        },
        /**
         * take a screenshot
         */
        screenshot: function () {
            CRadamn.Scene.screenshot(this);
        },
        debug: function () {
            Radamn.debug(this.rootNode.debug().join("\n"));
        }
    });

    exports.Scene = Scene;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));