(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate;

    function spring(pos, pos2) {
        if (pos.x === pos2.x && pos.y === pos2.y) {
            return {x: 0, y:0};
        }

        var angle = Math.atan2(pos2.y - pos.y, pos2.x - pos.x),
            vx = ((pos2.x - Math.cos(angle) * 0.03) - pos.x) * 100,
            vy = ((pos2.y - Math.sin(angle) * 0.03) - pos.y) * 100;

        vx *= 0.9;
        vy *= 0.9;

        return {x: vx, y: vy};
    }

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
            console.log(this.__root);

            return this;
        },
        centerNode: function (node, offset, follow) {
            var pos = node.getDerivedPosition(false),
                pos2 = this.__root.getPosition();

            offset = offset || {x: 0, y: 0};

            this.__root.setPosition(pos.x - this.__window.width * 0.5 + offset.x, pos.y - this.__window.height * 0.5 + offset.y);

            if (follow) {
                this.__followNode = node;
                this.__followOffset = offset;
            }

            return this;
        },
        scale: function (scalex, scaley) {
            scaley = scaley || scalex;
            this.__root.setScale(scalex, scaley);
        },
        translate: function (x, y, options) {
            this.__root.setAnimationLink(Animate.CANCEL);

            var r = this.__root.animate(Object.merge(options || {}, {
                    transition: Animate.Transitions.Linear,
                    time: 1000
                }), {
                "0%": {
                    x: this.__root.matrix[4],
                    y: this.__root.matrix[5]
                },
                "100%": {
                    x: this.__root.matrix[4] + x,
                    y: this.__root.matrix[5] + y
                }
            });

            Radamn.debug("camera:translate is [" + r + "]");
        },
        move: function (x, y, options) {
            this.__root.setAnimationLink(Animate.CANCEL);

            var r = this.__root.animate(Object.merge(options || {}, {
                    transition: Animate.Transitions.Linear,
                    time: 1000
                }), {
                "0%": {
                    x: this.__root.matrix[4],
                    y: this.__root.matrix[5]
                },
                "100%": {
                    x: x,
                    y: y
                }
            });

            Radamn.debug("camera:translate is [" + r + "]");
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
