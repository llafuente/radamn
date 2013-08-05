(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? assert : require("assert"),
        Beizer,
        sqrt = Math.sqrt;

    /**
     * credits - CAAT
     *
     * @class Beizer
     */
    Beizer = exports.Beizer = new Class("Beizer", {
        /**
         * @member Vec2
         * @type Number
         */
        points: [],
        /**
         * @member Vec2
         * @type Number
         */
        cubic: true,
    });

    Beizer.Implements({
        /**
         * Set this curve as a cubic bezier defined by the given four control points.
         * @param cp0x {number}
         * @param cp0y {number}
         * @param cp1x {number}
         * @param cp1y {number}
         * @param cp2x {number}
         * @param cp2y {number}
         * @param cp3x {number}
         * @param cp3y {number}
         */
        setCubic : function (cp0x, cp0y, cp1x, cp1y, cp2x, cp2y, cp3x, cp3y) {
            this.points = [];
            this.points.push(new Vec2(cp0x, cp0y));
            this.points.push(new Vec2(cp1x, cp1y));
            this.points.push(new Vec2(cp2x, cp2y));
            this.points.push(new Vec2(cp3x, cp3y));

            this.cubic = true;

            return this;
        },

        /**
         * Set this curve as a quadric bezier defined by the three control points.
         * @param cp0x {number}
         * @param cp0y {number}
         * @param cp1x {number}
         * @param cp1y {number}
         * @param cp2x {number}
         * @param cp2y {number}
         */
        setQuadric : function (cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {

            this.points = [];

            this.points.push(new Vec2(cp0x, cp0y));
            this.points.push(new Vec2(cp1x, cp1y));
            this.points.push(new Vec2(cp2x, cp2y));

            this.cubic = false;

            return this;
        },
        /**
         * Solves a quadric Bezier.
         * @param point {Vec2} the point to store the solved value on the curve.
         * @param t {number} the value to solve the curve for.
         * @returns Vec2
         */
        __get_quadric : function (point, t) {
            var cl = this.points,
                cl0 = cl[0],
                cl1 = cl[1],
                cl2 = cl[2],
                t1 = 1 - t;

            return new Vec2(
                t1 * t1 * cl0.x + 2 * t1 * t * cl1.x + t * t * cl2.x,
                t1 * t1 * cl0.y + 2 * t1 * t * cl1.y + t * t * cl2.y
            );
        },
        /**
         * Solves a cubic Bezier.
         * @param t {number} the value to solve the curve for.
         * @returns Vec2
         */
        __get_cubic: function (t) {
            var t2 = t * t,
                t3 = t * t2,
                cl = this.points,
                cl0 = cl[0],
                cl1 = cl[1],
                cl2 = cl[2],
                cl3 = cl[3];

            return new Vec2(
                (cl0.x + t * (-cl0.x * 3 + t * (3 * cl0.x - cl0.x * t)))
                       + t * (3 * cl1.x + t * (-6 * cl1.x + cl1.x * 3 * t))
                       + t2 * (cl2.x * 3 - cl2.x * 3 * t)
                       + cl3.x * t3,
                (cl0.y + t * (-cl0.y * 3 + t * (3 * cl0.y - cl0.y * t)))
                       + t * (3 * cl1.y + t * (-6 * cl1.y + cl1.y * 3 * t))
                       + t2 * (cl2.y * 3 - cl2.y * 3 * t)
                       + cl3.y * t3
            );
        },
        /**
         * Calculate the curve length by incrementally solving the curve every substep=CAAT.Curve.k. This value defaults
         * to .05 so at least 20 iterations will be performed.
         * @todo some kind of cache maybe it's needed!
         * @return {number} the approximate curve length.
         */
        length : function () {
            var x1,
                y1,
                llength = 0,
                pt = new Vec2(),
                t;

            x1 = this.coordlist[0].x;
            y1 = this.coordlist[0].y;
            for (t = this.k; t <= 1 + this.k; t += this.k) {
                this.get(pt, t);
                llength += sqrt((pt.x - x1) * (pt.x - x1) + (pt.y - y1) * (pt.y - y1));
                x1 = pt.x;
                y1 = pt.y;
            }

            this.length = llength;
            return llength;
        },
        get: function (t) {
            if (this.cubic) {
                return this.__get_cubic(t);
            }
            return this.__get_quadric(t);
        }
    });


}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));