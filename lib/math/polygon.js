(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert"),
        __assert_arg = browser ? $.__assert_arg : require("node-class").__assert_arg,
        Polygon;

    /**
     * @name Polygon
     * @class Polygon
     */
    Polygon = exports.Polygon = new Class("Polygon", {
        points: [],
    });

    Polygon.implements({
        __construct: function (object) {
            var key,
                i;
            switch (typeOf(object)) {
            case "Polygon":
                this.points = Array.clone(object.points);
            break;
            case "array":
                // check the type of object[0], if number -> Vec2
                switch(typeOf(object[0])) {
                case "number":
                    for(i = 0; i < object.length; i += 2) {
                        this.points.push(new Vec2(object[i], object[i+1]));
                    }
                break;
                case "Vec2":
                    this.points = Array.clone(object);
                break;
                default:
                    throw new Error("invalid arguments");
                }
            break;
            default:
                throw new Error("invalid arguments");
            }

            return this;
        },
        push: function() {
            if (arguments.length === 2) {
                this.points.push(new Vec2(arguments[0], arguments[1]));
                return this;
            }

            this.points.push(arguments[0]);

            return this;
        }
    });


}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));