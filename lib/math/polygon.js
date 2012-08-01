(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert"),
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
            var key;
            switch (typeOf(object)) {
            case "Polygon":
                this.points = Array.clone(object.points);
            break;
            case "array":
                this.points = Array.clone(object);
            break;
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