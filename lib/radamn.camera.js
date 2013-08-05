(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        typeOf = browser ? NodeClass.typeof : require("node-class").typeof,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate;

    /**
     * @class Camera
     */
    var Camera = new Class("RadamnCamera",
    /** @lends Camera.prototype */
    {
        /**
         * @member Camera
         * @type {Object}
         */
        __window: null,
        __root : null,
        __followOffset : null,
        __followNode : null
    });

    Camera.Implements(
    /** @lends Camera.prototype */
    {
        __construct: function (window) {
            this.__window = window;
            this.__root = this.__window.getRootNode();

            return this;
        },
        centerNode: function (node, offset, follow) {
            var pos = node.getDerivedPosition(false);
            offset = offset || {x: 0, y: 0};
            this.__root.matrix.setPosition(pos.x - this.__window.width * 0.5 + offset.x, pos.y - this.__window.height * 0.5 + offset.y);

            if (follow) {
                this.__followNode = node;
                this.__followOffset = offset;
            }

            return this;
        },
        scale: function (scalex, scaley) {
            scaley = scaley || scalex;
            this.__root.matrix.setScale(scalex, scaley);
        },
        translate: function (x, y, options) {
            this.__root.setAnimationLink(Animate.CHAINED);
            console.log("camera animated ? ",
            this.__root.animate(Object.merge(options|| {}, {
                    transition: Animate.Transitions.ElasticOut,
                    time: 500,
                }),{
                "0%": {
                    x: this.__root.matrix.p[4],
                    y: this.__root.matrix.p[5]
                },
                "100%": {
                    x: this.__root.matrix.p[4] + x,
                    y: this.__root.matrix.p[5] + y
                }
            })
            );

            //this.__root.matrix.translate(x, y);
        },
        stopFollowing: function () {
            this.__followNode = null;
            this.__followOffset = null;

            return this;
        },
        update: function () {
            if (this.__followNode !== null) {
                this.centerNode(this.__followNode, this.__followOffset);
            }

            return this;
        }
    });

    exports.Camera = Camera;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));
