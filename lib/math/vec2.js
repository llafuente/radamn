(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? exports.assert : require("assert"),
        __assert_arg = browser ? NodeClass.__assert_arg : require("node-class").__assert_arg,
        EPS = Math.EPS,
        acos = Math.acos,
        cos  = Math.cos,
        sqrt = Math.sqrt,
        abs  = Math.abs,
        sin  = Math.sin,
        min  = Math.min,
        atan2 = Math.atan2,
        Vec2;

    /**
     * Point, Vector2, Vec2 Class.
     * This is made for insane performance in mind
     * Almost all methods modify the current Vector, so keep in mind
     * that you are forced to use clone!
     *
     * @name Vec2
     * @class Vec2
     */
    Vec2 = exports.Vec2 = new Class("Vec2", {
        /**
         * @member Vec2
         * @type Number
         */
        x: 0,
        /**
         * @member Vec2
         * @type Number
         */
        y: 0
    });


    Vec2.Implements({
        __construct: function (object) {
            if (arguments.length === 2) {
                // <debug>
                __assert_arg(arguments[0], "number", 0);
                __assert_arg(arguments[1], "number", 1);
                // </debug>

                this.x = parseFloat(arguments[0], 10);
                this.y = parseFloat(arguments[1], 10);
            } else if (arguments.length === 1) {
                // <debug>
                __assert_arg(arguments[0], ["Vec2", "object"], 0);
                // </debug>
                this.x = parseFloat(object.x, 10);
                this.y = parseFloat(object.y, 10);
            }
        },
        /**
         * set xy values
         * @name Vec2#set
         * @return {Vec2} this, chainable
         */
        set: function (x, y) {
            this.x = parseFloat(x, 10);
            this.y = parseFloat(y, 10);

            return this;
        },
        equals: function (v2) {
            // <debug>
            assert.equal(__typeof(v2), "Vec2", "a is not a Vec2");
            // </debug>

            return v2.x === this.x && v2.y === this.y;
        },
        /**
         * @member Vec2
         * @return Boolean
         */
        gt: function (vec2) {
            return vec2.x > this.x && vec2.y > this.y;
        },
        /**
         * @member Vec2
         * @return Boolean
         */
        lt: function () {
            return vec2.x < this.x && vec2.y < this.y;
        },
        /**
         * @member Vec2
         * @return {Boolean}
         */
        isValid : function () {
            return !(is_infinite(this.x) || isNaN(this.x) || is_infinite(this.y) || isNaN(this.y));
        },
        /**
        * Checks if this point has an undefined value for at least one of its coordinates.
        *
        * @returns {Boolean}
        */
        isNaN: function () {
            return isNaN(this.x) || isNaN(this.y);
        },
        /**
         * xy to zero
         * @member Vec2
         * @return {Vec2} this, chainable
         */
        zero: function () {
            this.x = 0;
            this.y = 0;

            return this;
        },
        /**
         * return the normalization factor
         * @member Vec2
         * @return {Number}
         */
        normalize: function () {
            var fLength = sqrt(this.x * this.x + this.y * this.y),
                fInvLength;

            // Will also work for zero-sized vectors, but will change nothing
            if (fLength > EPS) {
                fInvLength = 1.0 / fLength;
                this.x *= fInvLength;
                this.y *= fInvLength;
            }

            return fLength;
        },
        /**
         * @member {Vec2}
         * @return {Vec2} this chainable
         */
        negate: function () {
            this.x = -this.x;
            this.y = -this.y;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @return {Number}
         */
        distanceSquared: function (v2) {
            return this.clone().sub(v2).lengthSquared();
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @param {Number} dist
         * @return {Boolean}
         */
        near: function (v2, dist) {
            return this.distSquared(v2) < dist * dist;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @return {Vec2} this
         */
        midPoint: function (v2) {
            this.x = (this.x + v2.x) * 0.5;
            this.y = (this.y + v2.y) * 0.5;

            return this;
        },
        /**
         * @member Vec2
         * @return {Vec2} this chainable
         */
        perpendicular: function () {
            var aux = this.x;
            this.x = -this.y;
            this.x = aux;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} normal
         * @return {Vec2} this chainable
         */
        reflect: function (normal) {
            var aux = this.clone().dot(normal).multiply(normal);

            this.sub(aux.multiply(2));

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2|Number} b
         * @param {Number|Null} a
         * @return {Vec2} this chainable
         */
        subtract : function (a, b) {
            if (arguments.length === 1) {
                // <debug>
                assert.equal(__typeof(a), "Vec2", "a is not a Vec2");
                // </debug>

                this.x -= a.x;
                this.y -= a.y;
            } else {
                // <debug>
                assert.equal(__typeof(a), "number", "a is not a Number");
                assert.equal(__typeof(b), "number", "b is not a Number");
                // </debug>

                this.x -= a;
                this.y -= b;
            }

            return this;
        },
        /**
         * Returns the addition of the supplied value to both coordinates of
         * the point as a new point.
         * The object itself is not modified!
         * @member Vec2
         * @param {Vec2|Number} b
         * @param {Number} a
         * @return {Vec2} this, chainable
         */
        add : function (a, b) {
            if (arguments.length === 1) {
                // <debug>
                assert.equal(__typeof(a), "Vec2", "a is not a Vec2");
                // </debug>

                this.x += a.x;
                this.y += a.y;
            } else {
                // <debug>
                assert.equal(__typeof(a), "number", "a is not a Number");
                assert.equal(__typeof(b), "number", "b is not a Number");
                // </debug>

                this.x += a;
                this.y += b;
            }

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2|number} b
         * @return {Vec2} this, chainable
         */
        multiply : function (factor) {
            // <debug>
            var btype = __typeof(factor);
            assert.notEqual(["Vec2", "number"].indexOf(btype), -1, "Vec2::mul(" + btype + "), b is not a Vec2 or a Number");
            // </debug>

            switch (btype) {
            case "number":
                this.x *= factor;
                this.y *= factor;
            break;
            case "Vec2":
                this.x *= factor.x;
                this.y *= factor.y;
            break;
            }
            return this;
        },
        /**
         * Returns the dot product of the point and another point.
         *
         * @member Vec2
         * @param {Vec2} v2
         * @return {Number}
         */
        dot : function (v2) {
            // <debug>
            assert.equal(__typeof(v2), "Vec2", "Vec2::dot, v2 is not a Vec2");
            // </debug>

            return this.x * v2.x + this.y * v2.y;
        },
        /**
         * Returns the cross product of the point and another point.
         *
         * @member Vec2
         * @param {Vec2} v2
         * @return {Number}
         */
        cross: function (v2) {
            return this.x * v2.y - this.y * v2.x;
        },
        /**
         * @member Vec2
         * @return {Vec2} this, chainable
         */
        perp: function () {
            var aux = this.x;
            this.x = -this.y;
            this.y = aux;

            return this;
        },
        /**
         * @member Vec2
         * @return {Vec2} this, chainable
         */
        rerp: function () {
            var aux = this.x;
            this.x = this.y;
            this.y = -aux;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @param {Number} t
         * @return {Vec2} this, chainable
         */
        lerp : function (v2, t) {
            this.x = this.x + (v2.x - this.x) * t;
            this.y = this.y + (v2.y - this.y) * t;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @param {Number} d
         * @return {Vec2} this, chainable
         */
        lerpconst: function (v2, d) {
            this.add(v2.clone().substract(this).clamp(d));

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @param {Number} t
         * @return {Vec2} this, clone
         */
        slerp: function (v2, t) {
            var omega = acos(this.dot(v2)),
                denom,
                comp1;

            if (omega) {
                denom = 1.0 / sin(omega);
                comp1 = this.clone().multiply(sin((1.0 - t) * omega) * denom);
                return comp1.add(v2.clone().multiply(sin(t * omega) * denom));
            }

            return this.clone();
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @param {Number} a
         * @return {Vec2} this, clone
         */
        slerpconst: function (v2, a) {
            var angle = acos(this.dot(v2));
            return this.slerp(v2, min(a, angle) / angle);
        },
        /**
         * @member Vec2
         * @param {Number} a Radians!
         * @return {Vec2} this, clone
         */
        forangle: function (a) {
            this.x = cos(a);
            this.y = sin(a);

            return this;
        },
        /**
         * @member Vec2
         * @return {Number} in radians
         */
        toangle: function () {
            return atan2(this.y, this.x);
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @return {Vec2} this, chainable
         */
        project: function (v2) {
            var dot1 = this.dot(v2),
                dot2 = v2.dot(v2);

            this.multiply(v2, dot1 / dot2);

            return this;
        },

        /**
        * Rotates the point by the given angle around an optional center point.
        * The object itself is not modified.
        *
        * Read more about angle units and orientation in the description of the
        * {@link #angle} property.
        *
        * @param {Number} angle the rotation angle
        * @param {Vec2} center the center point of the rotation
        * @return {Vec2} this, chainable
        */
        rotate: function (angle, center) {
            if (center) {
                this.subtract(center);
            }

            var s = sin(angle),
                c = cos(angle),
                x = this.x,
                y = this.y;

            this.x = x * c - y * s;
            this.y = y * c + x * s;

            if (center) {
                this.add(center);
            }

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @return Vec2 this
         */
        rotateVec: function (v2) {
            this.x = this.x * v2.x - this.y * v2.y;
            this.y = this.x * v2.y + this.y * v2.x;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} v2
         * @return Vec2 this
         */
        unrotateVec: function (v2) {
            this.x = this.x * v2.x + this.y * v2.y;
            this.y = this.y * v2.x - this.x * v2.y;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} b
         * @return {Number}
         */
        length : function () {
            return sqrt(this.x * this.x + this.y * this.y);
        },
        /**
         * @member Vec2
         * @param {Vec2} b
         * @return {Number}
         */
        lengthSquared : function () {
            return this.x * this.x + this.y * this.y;
        },
        /**
         * @member Vec2
         * @param {Vec2} b
         * @return {Vec2} this, chainable
         */
        divide : function (b) {
            assert.equal(__typeof(b), "Vec2", "b is not a Vec2");

            this.x /= b.x;
            this.y /= b.y;

            return this;
        },
        /**
         * @member Vec2
         * @return {Vec2} this, chainable
         */
        abs : function () {
            this.x = abs(this.x);
            this.y = abs(this.y);

            return this;
        },
        /**
         * @member Vec2
         * @return {Vec2} this, clone
         */
        clone: function () {
            return new Vec2(this.x, this.y);
        },
        /**
         * @member Vec2
         * @param {Vec2} b
         * @return {Vec2} this, chainable
         */
        min : function (b) {
            assert.equal(__typeof(b), "Vec2", "Vec2::min, b is not a Vec2");

            this.x = this.x < b.x ? this.x : b.x;
            this.y = this.y < b.y ? this.y : b.y;

            return this;
        },
        /**
         * @member Vec2
         * @param {Vec2} b
         * @return {Vec2} this, chainable
         */
        max : function (b) {
            assert.equal(__typeof(b), "Vec2", "Vec2::max, b is not a Vec2");

            this.x = this.x > b.x ? this.x : b.x;
            this.y = this.y > b.y ? this.y : b.y;

            return this;
        },
        /**
         * @member Vec2
         * @return {Vec2}, cloned
         */
        clamp: function (len) {
            if (this.dot(this) > len * len) {
                return this.clone().normalize().multiply(len);
            }

            return this.clone();
        },
        /**
         * @member Vec2
         * @return {Number} 0 equal, 1 top, 2 top-right, 3 right, 4 bottom right, 5 bottom, 6 bottom-left, 7 left, 8 top-left
         */
        compare: function (vec2) {
            if (vec2.x === this.x && vec2.y === this.y) {
                return 0;
            }
            if (vec2.x === this.x) {
                return vec2.y > this.y ? 1 : 5;
            }
            if (vec2.y === this.y) {
                return vec2.x > this.x ? 3 : 7;
            }

            if (vec2.x > this.x && vec2.y > this.y) {
                return 2;
            }
            if (vec2.x > this.x && vec2.y < this.y) {
                return 4;
            }
            if (vec2.x < this.x && vec2.y > this.y) {
                return 6;
            }
            if (vec2.x < this.x && vec2.y < this.y) {
                return 8;
            }

            return -1;
        },
        /**
         * @member Vec2
         * @return {Intersection}
         */
        intersect: function (whoknows) {
            return Math.intersection(this, whoknows);
        },
        /**
         * @member Vec2
         * @return {Number}
         */
        distance: function (whoknows) {
            return Math.intersection(this, whoknows);
        }
    });

    // translate!
    Vec2.alias("add", "translate");
    Vec2.alias("perp", "rotateCW");
    Vec2.alias("rerp", "rotateCCW");


}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));