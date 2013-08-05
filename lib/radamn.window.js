(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        typeOf = browser ? NodeClass.typeof : require("node-class").typeof,
        __debug = browser ? NodeClass.debug : require("node-class").debug;

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
        canvas: null,
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
        leaveFrame: null
    });

    Win.Extends(Events);

    Win.Implements({
        /**
         * @constructs
         * @param {Number} id
         * @param {Canvas} canvas
         */
        __construct: function (options) {
            this.parent();

            __debug("init window:", options);
            this.lastRenderDate = Date.now();

            //hacky, i like it!!
            var RootNode = new Class("RadamnNode", {});
            RootNode.Extends(Radamn.Node);

            //copy Animate properties!
            RootNode.prototype.$__animation = Radamn.Node.prototype.$__animation;

            RootNode.prototype.isRoot = function () {
                return true;
            };

            this.rootNode = new RootNode();

            this.__camera = new Radamn.Camera(this);

            /*
            //attach events
            this.canvas.addEventListener("click", function(event) {
                this.emit("click", [event, this, this.canvas]);
            }.bind(this));

            this.canvas.addEventListener("mouseenter", function(event) {
                this.emit("mouseenter", [event, this, this.canvas]);
            }.bind(this));

            this.canvas.addEventListener("mousemove", function(event) {
                this.emit("mousemove", [event, this, this.canvas]);
            }.bind(this));

            this.canvas.addEventListener("mouseleave", function(event) {
                this.emit("mouseleave", [event, this, this.canvas]);
            }.bind(this));

            this.canvas.addEventListener("mouseup", function(event) {
                this.emit("mouseup", [event, this, this.canvas]);
            }.bind(this));

            this.canvas.addEventListener("mousedown", function(event) {
                this.emit("mousedown", [event, this, this.canvas]);
            }.bind(this));

            // this should be removed!
            this.canvas.addEventListener("dblclick", function(event) {
                this.emit("dblclick", [event, this, this.canvas]);
            }.bind(this));

            this.canvas.addEventListener("touchstart", function(event) {
                //event.preventDefault();
                //transform to mouse down
                this.emit("mousedown", [event]);
            }.bind(this), false);

            this.canvas.addEventListener("touchend", function(event) {
                //event.preventDefault();
                //transform to mouse up -> click
                this.emit("mouseup", [event]);
                // TODO there is no preventDefault
                if(event.x !== undefined) {
                    this.emit("click", [event]);
                }
            }.bind(this), false);

            this.canvas.addEventListener("touchmove", function(event) {
                event.preventDefault();
                this.emit("mousemove", [event]);
            }.bind(this));
            */

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

            return this;
        },
        /**
         * @param {Number} delta
         * @param {Function} fnbefore exec before render any node
         * @param {Function} fnafter exec before render any node
         * @type {Function}
         */
        render: function (delta, fnbefore, fnafter) {
            this.__camera.update();
            this.rootNode.tick(delta);
            this.__renderNode(this.getContext(), this.rootNode, delta, fnbefore || null, fnafter || null);

            return this;
        },
        /**
         * @TODO do it!
         * @param Number x
         * @param Number y
         */
        ray: function (x, y, bnode) {
            if(bnode === undefined) {
                return this.ray(x, y, this.rootNode);
            }

            var out = [],
                v = new Vec2(x, y);

            if (!bnode.hasChildren()) return out;

            bnode.each(function(node) {
                var col = node.collide(v);
                if (col.success === true || (col.success === false && col.reason === "inside")) {
                    out.push(node);
                }

                if (node.hasChildren()) {
                    Array.Combine(out, this.ray(x, y, node));
                }
            }.bind(this));

            return out;
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
        setCanvas: function(ctx) {
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
        },
        debug: function() {
            console.log(this.rootNode.debug().join("\n"));
        },
    });

    exports.Window = Win;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));
