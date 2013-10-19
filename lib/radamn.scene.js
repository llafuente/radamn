(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        __debug = function () {}, //console.log,
        Scene,
        RootNode;

    RootNode = new Class("RadamnRootNode", {
        scene: null
    });
    RootNode.Extends(Radamn.Node);
    RootNode.Implements({
        tick: function() {
            var ret = this.parent();

            if (this.matrix[6]) {
                this.scene.eachCamera(function(camera) {
                    camera.tick();
                });
                this.matrix[6] = false;
            }
            return ret;
        }
    });

    //copy Animate properties!
    RootNode.prototype.$__animation = Radamn.Node.prototype.$__animation;

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
        rootNode: null,
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
            this.lastRenderDate = Date.now();

            this.rootNode = new RootNode({id: "RootNode", scene: this});
            this.rootNode.isRoot = true;

            this.__camera = new Radamn.Camera(this);

            return this;
        },
        eachCamera: function(fn) {
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
         * @see Scene.render
         * @private
         */
        __renderNode: function (ctx, node, delta) {
            var i;

            if (node.visible === true && node.__visibility === true) {

                ctx.save();
                node.applyTransform(ctx);

                for (i = 0; i < node.childEntities.length; ++i) {
                    node.childEntities[i].draw(ctx, delta);
                }

                node._afterRender(ctx);

                for (i = 0; i < node.childNodes.length; ++i) {
                    this.__renderNode(ctx, node.childNodes[i], delta);
                }

                ctx.restore();
            }

            return this;
        },
        /**
         * @param {Number} delta
         * @param {Function} fnbefore exec before render any node
         * @param {Function} fnafter exec before render any node
         * @type {Function}
         */
        render: function (delta) {
            this.__camera.tick(delta);
            // emit "tick" event, that is needed by Animate
            this.rootNode.tick(delta);

            this.emit("render:start");
            this.__renderNode(this.getContext(), this.rootNode, delta);
            this.emit("render:end");

            return this;
        },
        /**
         * @TODO do it!
         * @param Number x
         * @param Number y
         */
        ray: function (x, y, bnode) {
            var offset,
                out,
                v,
                that = this;
            if (bnode === undefined) {
                offset = this.rootNode.getPosition();
                return this.ray(x - offset[0], y - offset[1], this.rootNode);
            }

            out = [];
            v = Vec2.create(x, y);

            if (!bnode.hasChildren()) {
                return out;
            }

            bnode.each(function ray_each_node(node) {
                var col = node.collide(v);
                if (col.reason < Intersection.OUTSIDE) {
                    out.push(node);
                }

                if (node.hasChildren()) {
                    Array.combine(out, that.ray(x, y, node));
                }
            });

            return out;
        },
        forEachNode: function(callback, bnode) {
            var that = this;

            if (bnode ===undefined ) {
                bnode = this.rootNode;
            }

            bnode.each(function (node) {
                callback(node);
                that.forEachNode(callback, node);
            });
        },
        isVisible: function(body) {
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
        createLayer: function(z_index) {
            z_index = z_index || Infinity;
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