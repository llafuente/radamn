(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert"),
        Circle;

    /**
     * @class Circle
     */
    Circle = exports.Circle = new Class("Circle", {
        c: null,
        r: 0,
    });


    Circle.implements({
        // circle
        // center, radius
        // x, y, radius
        __construct: function (object) {
            switch (arguments.length) {
            case 3:
                this.c = new Vec2(arguments[0], arguments[1]);
                this.r = arguments[2];
            break;
            case 2:
                this.set(arguments[0], arguments[1]);
            break;
            case 1:
                assert.equal(["Circle", "object"].indexOf(typeOf(object)), -1, "how can i init this!?");

                this.c = object.c.clone();
                this.r = object.r;
            break;
            }

            return this;
        },
        set: function (center, radious) {
            this.c = center.clone();
            this.r = radious;

            return this;
        },
        clone: function () {
            var circle =  new Circle();
            circle.r = this.r;
            circle.c = this.c.clone();
            return circle;
        },
        translate: function (b, a) {
            this.c.plus(b, a);

            return this;
        },
        applyMatrix: function (matrix) {
            //matrix.
        }
    });

}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));