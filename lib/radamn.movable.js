(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? window.assert : require("assert"),
        Matrix2D = browser ? window.Matrix2D : require("js-2dmath").Matrix2D,
        Rectangle = browser ? window.Rectangle : require("js-2dmath").Rectangle,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        BB2 = browser ? window.BB2 : require("js-2dmath").BB2,
        Vec2 = browser ? window.Vec2 : require("js-2dmath").Vec2,
        Movable,
        chase,

        __debug = function () {}; //console.log;


    /**
     * @class Node
     */
    Movable = new Class("Movable",/** @lends Node.prototype */{
        offset: [0, 0],
        matrix: null,
        look_at: null,
        look_at_offset: 0,
        tracking: null,
        tracking_offset: [0, 0],
        chase_step: null,
        chase_movable: null,
        chase_offset: [0, 0]
    });

    Movable.Extends(Animate, true, true);

    Movable.Implements({
        /**
         * Initialize the CanvasNode and merge an optional config hash.
         * @member Movable
         * @constructor
         * @param {Node} root
         */
        __construct: function (options) {
            this.parent();

            this.matrix = Matrix2D.create();

            this.childNodes = [];
        },
        //
        // matrix wrap
        //
        getScale: function () {
            return Matrix2D.getScale([0, 0], this.matrix);
        },
        scale: function (x, y) {
            var out = Matrix2D.scale(this.matrix, this.matrix, [x, y]);
            this._update_offset();
            return out;
        },
        scalation: function (x, y) {
            var out = Matrix2D.scalation(this.matrix, this.matrix, [x, y]);
            this._update_offset();
            return out;
        },
        skew: function (x, y) {
            return Matrix2D.skew(this.matrix, this.matrix, [x, y]);
        },
        rotate: function (angle) {
            return Matrix2D.rotate(this.matrix, this.matrix, angle);
        },
        rotation: function (angle) {
            return Matrix2D.rotation(this.matrix, this.matrix, angle);
        },
        getWorldPosition: function (include_root) {
            return Matrix2D.getPosition([0, 0], this.matrix);
        },
        getDerivedPosition: function (include_root) {
            return Matrix2D.getPosition([0, 0], this.matrix);
        },
        getPosition: function () {
            return Matrix2D.getPosition([0, 0], this.matrix);
        },
        position: function (x, y) {
            x = x === false ? this.matrix[4] : x;
            y = y === false ? this.matrix[5] : y;

            return Matrix2D.position(this.matrix, this.matrix, [x, y]);
        },
        translate: function (x, y) {
            return Matrix2D.translate(this.matrix, this.matrix, [x, y]);
        },
        /**
         * apply (overwrite) the transformation to the canvas
         * @returns Matrix2D this for chaining
         */
        setTransform: function (ctx) {
            var p = this.matrix,
                off = this.offset;

            ctx.setTransform(p[0], p[1], p[2], p[3], p[4] - off[0], p[5] - off[1]);

            return this;
        },
        //
        transform: function (ctx) {
            var p = this.matrix,
                off = this.offset;

            ctx.transform(p[0], p[1], p[2], p[3], p[4] - off[0], p[5] - off[1]);

            return this;
        },
        positionAlign: function (bb, alignament) {
            console.log(arguments);
            var vec2 = [0, 0];

            BB2.align(vec2, bb, alignament);
            Matrix2D.position(this.matrix, this.matrix, vec2);

            return this;
        },
        offsetAlign: function (alignament) {
            var bb = this.getBoundingBox();

            BB2.align(this.offset, bb, alignament);
            this.offset_alignament = alignament;

            return this;
        },
        _update_offset: function () {
            this.offsetAlign(this.offset_alignament);
        },
        /**
         * Look at the movable object the eyes on the top
         * For eyes on the right offset_rotation = Math.HALFPI
         */
        lookAt: function (movable_object, offset_rotation) {
            var rot = 0,
                origin = this.getPosition(),
                target = movable_object.getPosition();

            Vec2.sub(target, target, origin);
            rot = Vec2.toAngle(target) + (offset_rotation || 0);
            Matrix2D.setRotation(this.matrix, this.matrix, rot);

            return this;
        },
        /**
         * Keep the eye in the object
         */
        autoLookAt: function (enable, movable_object, offset_rotation) {
            if (!enable) {
                this.look_at = null;
            } else {
                this.look_at = movable_object;
                this.look_at_offset = offset_rotation || 0;
            }
        },
        /**
         * Track position
         */
        autoTracking: function (enable, movable_object, tracking_offset) {
            if (!enable) {
                this.tracking = null;
            } else {
                this.tracking = movable_object;
                this.tracking_offset[0] = tracking_offset && tracking_offset[0] ? tracking_offset[0] : 0;
                this.tracking_offset[1] = tracking_offset && tracking_offset[1] ? tracking_offset[1] : 0;
            }

        },
        chase: function (enable, movable, offset, options) {
            if (!enable) {
                this.chase_step = null;
                this.chase_movable = null;
            } else {
                options = options || {};

                this.chase_step = chase(movable.getDerivedPosition(),  this.getPosition(), options); // options not used atm!
                this.chase_movable  = movable;
                this.chase_offset[0] = offset && offset[0] ? offset[0] : 0;
                this.chase_offset[1] = offset && offset[1] ? offset[1] : 0;
            }

            return this;
        },
        tick: function (delta) {
            var pos;
            if (this.look_at !== null) {
                this.lookAt(this.look_at, this.look_at_offset);
            }

            if (this.tracking) {
                pos = this.tracking.getPosition();
                Vec2.add(pos, pos, this.tracking_offset);
                this.position(pos);
            }

            if (this.chase_step) {
                this.chase_step.set_leader(this.chase_movable.getDerivedPosition());
                pos = this.chase_step.update(delta);
                // follow the given path

                pos[0] = pos[0] + this.chase_offset[0];
                pos[1] = pos[1] + this.chase_offset[1];

                Matrix2D.position(this.matrix, this.matrix, pos);
            }
        }
    });

    Movable.Abstract({
        getBoundingBox: function () {}
    });

    Movable.setAnimationProterties("x", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            element.position(value, false);
        }
    });

    Movable.setAnimationProterties("y", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            element.position(false, value);
        }
    });

    Movable.setAnimationProterties("position", {
        mask: '@d @d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            var aux = value.split(" ");
            element.position(parseFloat(aux[0]), parseFloat(aux[1]));
        }
    });

    Movable.setAnimationProterties("rotate", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            element.rotation(value);
        }
    });

    Movable.setAnimationProterties("scale", {
        mask: '@d @d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            var aux = value.split(" ");
            element.scalation(aux[0], aux[1]);
        }
    });

    Movable.setAnimationProterties("scalex", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            element.scalation(value, 1);
        }
    });

    Movable.setAnimationProterties("scaley", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            element.scalation(1, value);
        }
    });

    Movable.setAnimationProterties("skew", {
        mask: '@d @d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            var aux = value.split(" ");
            element.skew(aux[0], aux[1]);
        }
    });

    Movable.setAnimationProterties("skewx", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            return Matrix2D.skewx(element.matrix, element.matrix, value);
        }
    });

    Movable.setAnimationProterties("skewy", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            return Matrix2D.skewy(element.matrix, element.matrix, value);
        }
    });


    exports.Movable = Movable;


    chase = function (leader, chaser) {
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
                leader[0] = _leader[0];
                leader[1] = _leader[1];
                //debug("set_leader", leader);
            },
            set_chaser: function (_chaser) {
                chaser[0] = _chaser[0];
                chaser[1] = _chaser[1];
                chaser.dx = 0;
                chaser.dy = 0;
                //debug("set_chaser", chaser);
            },
            update: function (delta) {
                delta = delta / 1000;
                var spring = [0, 0],
                    dx = leader[0] - chaser[0],
                    dy = leader[1] - chaser[1],
                    len = Math.sqrt(dx * dx + dy * dy),
                    springF,
                    resist,
                    factor,
                    x,
                    y;

                if (len < SEGLEN) {
                    chaser[0] = leader[0];
                    chaser[1] = leader[1];
                    return [chaser[0], chaser[1]];
                }

                springF = SPRINGK * (len - SEGLEN);
                spring[0] = (dx / len) * springF;
                spring[1] = (dy / len) * springF;

                factor = SPRINGK * (len - SEGLEN) / SPEED;

                if (dx > 0) {
                    x = Math.max(dx / len * factor, 1) * delta;
                    chaser[0] = Math.min(leader[0], chaser[0] + x);
                } else {
                    x = Math.min(dx / len * factor, -1) * delta;
                    chaser[0] = Math.max(leader[0], chaser[0] + x);
                }

                if (dy > 0) {
                    y = Math.max(dy / len * factor, 1) * delta;
                    chaser[1] = Math.min(leader[1], chaser[1] + y);
                } else {
                    y = Math.min(dy / len * factor, -1) * delta;
                    chaser[1] = Math.max(leader[1], chaser[1] + y);
                }

                /*
                debug(
                    "" + leader[1].toFixed(1),
                    "" + chaser[1].toFixed(1),

                    "" + len.toFixed(1),
                    "" + springF.toFixed(1),

                    "" + dy.toFixed(2),
                    "" + y.toFixed(2),

                    "" + spring[1].toFixed(2),
                    "" + delta.toFixed(4)
                );
                sprintf = require('sprintf').sprintf;
                debug(sprintf("%2s x=%7s y=%7s l=%7s s=%7s dx=%7s mx=%7s sx=%7s delta=%10s",
                    i,
                    "" + chaser[0].toFixed(1),
                    "" + chaser[1].toFixed(1),
                    "" + len.toFixed(1),
                    "" + springF.toFixed(1),
                    "" + dx.toFixed(2),
                    "" + x.toFixed(2),
                    "" + spring[0].toFixed(2),
                    "" + delta.toFixed(4)
                ));
                */


                return [chaser[0], chaser[1]];
            }
        };
    };


}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));