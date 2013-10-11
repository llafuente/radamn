(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        Camera,
        chaser_steps;

    chaser_steps = function (leader, chaser) {
        var DELTAT = 0.01,
            SEGLEN = 1,
            SPRINGK = 10,
            MASS = 1,
            GRAVITY = 0,
            RESISTANCE = 10,
            STOPVEL = 0.1,
            STOPACC = 0.1,
            accel;

        chaser.dx = 0;
        chaser.dy = 0;

        return {
            set_chaser: function (_chaser) {
                chaser.x = _chaser.x;
                chaser.y = _chaser.y;
            },
            update: function () {
                var spring = {x: 0, y: 0},
                    dx = leader.x - chaser.x,
                    dy = leader.y - chaser.y,
                    len = Math.sqrt(dx * dx + dy * dy),
                    springF,
                    resist;

                if (len < SEGLEN) {
                    chaser.x = leader.x;
                    chaser.y = leader.y;
                    return leader;
                }

                springF = SPRINGK * (len - SEGLEN);
                spring.x = (dx / len) * springF;
                spring.y = (dy / len) * springF;


                resist = {x: chaser.dx * RESISTANCE, y: -chaser.dy * RESISTANCE};

                accel = {
                    x: (spring.x + resist.x) / MASS,
                    y: (spring.y + resist.y) / MASS + GRAVITY
                };

                chaser.dx += (DELTAT * accel.x);
                chaser.dy += (DELTAT * accel.y);

                if (Math.abs(chaser.dx) < STOPVEL &&
                        Math.abs(chaser.dy) < STOPVEL &&
                        Math.abs(accel.x) < STOPACC &&
                        Math.abs(accel.y) < STOPACC) {
                    chaser.dx = 0;
                    chaser.dy = 0;
                }

                chaser.x += chaser.dx;
                chaser.y += chaser.dy;

                console.log("x", chaser.x, "y", chaser.y);

                return chaser;
            }
        };
    };



    /**
     * @class Camera
     */
    Camera = new Class("RadamnCamera",/** @lends Camera.prototype */{
        /**
         * @member Camera
         * @type {Object}
         */
        __window: null,
        __root : null,
        __followOffset : null,
        __followNode : null,
        __chaser_step : null
    });

    Camera.Implements(/** @lends Camera.prototype */{
        __construct: function (window) {
            this.__window = window;
            this.__root = this.__window.getRootNode();
            console.log(this.__root);

            return this;
        },
        centerNode: function (node, offset, follow) {
            var pos;

            offset = offset || {x: 0, y: 0};


            if (follow) {
                this.__followNode = node;
                this.__followOffset = offset;
                this.__chaser_step = chaser_steps(node.getDerivedPosition(false), node.getDerivedPosition(false));

            } else {
                if (this.__chaser_step) {
                    this.__chaser_step.set_chaser(node.getDerivedPosition(false));
                    console.log(pos = this.__chaser_step.update());
                } else {
                    // direct set
                    pos = node.getDerivedPosition(false);
                }
                console.log(pos);
                // follow the given path
                this.__root.setPosition(pos.x - this.__window.width * 0.5 + offset.x, pos.y - this.__window.height * 0.5 + offset.y);
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

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));