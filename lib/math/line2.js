(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert"),
        Line2;

     /**
     * @name Line2
     * @class Line2
     */
    Line2 = exports.Line2 = new Class("Line2", {
        x : 0,
        y : 0,
        m : 0
    });

    Line2.implements({
        __construct: function (object) {
            if (arguments.length === 4) {
                this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
            } else if (arguments.length === 3) {
                this.x = arguments[0];
                this.y = arguments[1];
                this.m = arguments[2];
            } else if (arguments.length === 2) {
                this.set(arguments[0], arguments[1]);
            } else if (arguments.length === 1) {
                // <debug>
                assert.equal(["Line2", "object"].indexOf(typeOf(object)), -1, "how can init this!?");
                // </debug>

                this.x = object.x;
                this.y = object.y;
                this.m = object.m;
            }
        },
        set: function (x1, y1, x2, y2) {
            switch(arguments.length) {
            case 2:
                //compute m
                this.x = x1.x;
                this.y = x1.y;

                this.m = this.magnitude(y1.x, y1.y);
            break;
            case 3:
                this.x = x1;
                this.y = y1;
                this.m = x2;
            break;
            case 4:
                //compute m
                this.x = x1;
                this.y = y1;

                this.m = this.magnitude(x2, y2);
            }

            return this;
        },
        add: function (a, b) {
            if (arguments.length === 1) {
                // <debug>
                assert.equal(typeOf(a), "Vec2", "a is not a Vec2");
                // </debug>

                this.x += a.x;
                this.y += a.y;
            } else {
                // <debug>
                assert.equal(typeOf(a), "number", "a is not a Number");
                assert.equal(typeOf(b), "number", "b is not a Number");
                // </debug>

                this.x += a;
                this.y += b;
            }

            return this;
        },
        subtract: function (a, b) {
            if (arguments.length === 1) {
                // <debug>
                assert.equal(typeOf(a), "Vec2", "a is not a Vec2");
                // </debug>

                this.x -= a.x;
                this.y -= a.y;
            } else {
                // <debug>
                assert.equal(typeOf(a), "number", "a is not a Number");
                assert.equal(typeOf(b), "number", "b is not a Number");
                // </debug>

                this.x -= a;
                this.y -= b;
            }

            return this;
        },
        /**
         * @return {Line2} cloned
         */
        getParallel: function () {
            return new Line2(this.x1, this.x2, -1 / this.m);
        },
        magnitude: function (x2, y2) {
            var _x = this.x - (x2 || 0),
                _y = this.y - (y2 || 0);

            return _x / _y;
        },
        /**
         * @return {Intersection}
         */
        intersect: function (whoknows) {
            return Math.intersection(this, whoknows);
        }
    });

    Line2.alias("translate", "add");

}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));