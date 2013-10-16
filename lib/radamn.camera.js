(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        Camera,
        chaser_steps,
        debug = function() {}; //debug;

    chaser_steps = function (leader, chaser) {
        var DELTAT = 0.01,
            SEGLEN = 1,
            SPRINGK = 75,
            MASS = 1,
            GRAVITY = 0,
            RESISTANCE = 10,
            STOPVEL = 0.1,
            STOPACC = 0.1,
            accel,
            SPEED = 50;

        chaser.dx = 0;
        chaser.dy = 0;

        return {
            set_speed: function (speed) {
                SPEED = speed;
            },
            set_leader: function (_leader) {
                leader.x = _leader.x;
                leader.y = _leader.y;
                //debug("set_leader", leader);
            },
            set_chaser: function (_chaser) {
                chaser.x = _chaser.x;
                chaser.y = _chaser.y;
                chaser.dx = 0;
                chaser.dx = y;
                //debug("set_chaser", chaser);
            },
            update: function (delta, i) {
                delta = delta / 1000;

                var spring = {x: 0, y: 0},
                    dx = leader.x - chaser.x,
                    dy = leader.y - chaser.y,
                    len = Math.sqrt(dx * dx + dy * dy),
                    springF,
                    resist,
                    factor,
                    x,
                    y;

                if (len < SEGLEN) {
                    chaser.x = leader.x;
                    chaser.y = leader.y;
                    return chaser;
                }

                springF = SPRINGK * (len - SEGLEN);
                spring.x = (dx / len) * springF;
                spring.y = (dy / len) * springF;

                factor = SPRINGK * (len - SEGLEN) / SPEED;


                if (dx > 0) {
                    x = Math.max(dx / len * factor, 1) * delta;
                    chaser.x = Math.min(leader.x, chaser.x + x);
                } else {
                    x = Math.min(dx / len * factor, -1) * delta;
                    chaser.x = Math.max(leader.x, chaser.x + x);
                }

                if (dy > 0) {
                    y = Math.max(dy / len * factor, 1) * delta;
                    chaser.y = Math.min(leader.y, chaser.y + y);
                } else {
                    y = Math.min(dy / len * factor, -1) * delta;
                    chaser.y = Math.max(leader.y, chaser.y + y);
                }

                /*
                debug(
                    "" + leader.y.toFixed(1),
                    "" + chaser.y.toFixed(1),

                    "" + len.toFixed(1),
                    "" + springF.toFixed(1),

                    "" + dy.toFixed(2),
                    "" + y.toFixed(2),

                    "" + spring.y.toFixed(2),
                    "" + delta.toFixed(4)
                );
                sprintf = require('sprintf').sprintf;
                debug(sprintf("%2s x=%7s y=%7s l=%7s s=%7s dx=%7s mx=%7s sx=%7s delta=%10s",
                    i,
                    "" + chaser.x.toFixed(1),
                    "" + chaser.y.toFixed(1),
                    "" + len.toFixed(1),
                    "" + springF.toFixed(1),
                    "" + dx.toFixed(2),
                    "" + x.toFixed(2),
                    "" + spring.x.toFixed(2),
                    "" + delta.toFixed(4)
                ));
                */


                return chaser;
            }
        };
    };



    /**
     * @class Camera
     */
    Camera = new Class("RadamnCamera",/** @lends Camera.prototype */{
        scene: null,
        __followOffset : null,
        __followNode : null,
        __chaser_step : null,

        rootNode : null,
        frustum: null
    });
    var count = 0;

    Camera.Implements(/** @lends Camera.prototype */{
        __construct: function (scene) {
            this.scene = scene;
            this.rootNode = this.scene.getRootNode();

            this.frustum = new Rectangle(0, 0, this.scene.width, this.scene.height);

            return this;
        },
        centerNode: function (node, offset, follow, delta) {
            var pos;

            offset = offset || {x: 0, y: 0};


            if (follow) {
                this.__followNode = node;
                this.__followOffset = offset;
                this.__chaser_step = chaser_steps(node.getDerivedPosition(false), node.getDerivedPosition(false));
            } else {
                //if((++count % 10) !== 0) return ;

                if (this.__chaser_step) {
                    this.__chaser_step.set_leader(node.getDerivedPosition(false));
                    pos = this.__chaser_step.update(delta);
                } else {
                    // direct set
                    pos = node.getDerivedPosition(false);
                }
                // follow the given path
                this.rootNode.setPosition(pos.x - this.scene.width * 0.5 + offset.x, pos.y - this.scene.height * 0.5 + offset.y);
            }

            return this;
        },
        scale: function (scalex, scaley) {
            scaley = scaley || scalex;
            this.rootNode.setScale(scalex, scaley);
        },
        translate: function (x, y, options) {
            this.rootNode.setAnimationLink(Animate.CANCEL);

            var r = this.rootNode.animate(Object.merge(options || {}, {
                    transition: Animate.Transitions.Linear,
                    time: 1000
                }), {
                    "0%": {
                        x: this.rootNode.matrix[4],
                        y: this.rootNode.matrix[5]
                    },
                    "100%": {
                        x: this.rootNode.matrix[4] + x,
                        y: this.rootNode.matrix[5] + y
                    }
                });

            Radamn.debug("camera:translate is [" + r + "]");
        },
        move: function (x, y, options) {
            this.rootNode.setAnimationLink(Animate.CANCEL);

            var r = this.rootNode.animate(Object.merge(options || {}, {
                    transition: Animate.Transitions.Linear,
                    time: 1000
                }), {
                    "0%": {
                        x: this.rootNode.matrix[4],
                        y: this.rootNode.matrix[5]
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
        update: function (delta) {
            if (this.__followNode !== null) {
                this.centerNode(this.__followNode, this.__followOffset, false, delta);
            }

            return this;
        },
        tick: function() {
            console.log("camera tick", new Error().stack);

            this.frustum = new Rectangle(0, 0, this.scene.width, this.scene.height);
            this.frustum.translate(this.rootNode.getPosition());
        },
    });

    exports.Camera = Camera;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));