(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? assert : require("assert"),
        EPS = Math.EPS,
        acos = Math.acos,
        cos  = Math.cos,
        sqrt = Math.sqrt,
        abs  = Math.abs,
        sin  = Math.sin,
        min  = Math.min,
        atan2 = Math.atan2,
        Segment2;


    /**
     * @class Segment2
     */
    Segment2 = exports.Segment2 = new Class("Segment2", {
        x1 : 0,
        y1 : 0,
        x2 : 0,
        y2 : 0
    });

    Segment2.Implements({
        __construct: function (object) {
            if (arguments.length === 4) {
                this.x1 = arguments[0];
                this.y1 = arguments[1];
                this.x2 = arguments[2];
                this.y2 = arguments[3];
            } else if (arguments.length === 2) {
                this.set(arguments[0], arguments[1]);
            } else if (arguments.length === 1) {
                if (["Segment2", "object"].indexOf(__typeof(object)) === -1) {
                    throw new Error("how can i init this!?");
                }
                this.x1 = object.x1;
                this.y1 = object.y1;
                this.x2 = object.x2;
                this.y2 = object.y2;
            }
        },
        clone: function () {
            return new Segment2(this.x1, this.y1, this.x2, this.y2);
        },
        translate: function (b, a) {
            this.x1 += b.x;
            this.x2 += b.x;
            this.y1 += b.y;
            this.y2 += b.y;

            return this;
        },
        set: function (p0, p1) {
            //compute m
            this.x1 = p0.x;
            this.y1 = p0.y;
            this.x2 = p1.x;
            this.y2 = p1.y;

            return this;
        },
        length: function () {
            var x = this.x2 - this.x1,
                y = this.y2 - this.y1;

            return Math.sqrt(x * x + y * y);
        },
        lengthSquared: function () {
            var x = this.x2 - this.x1,
                y = this.y2 - this.y1;

            return x * x + y * y;
        },
        cross: function (A) {
            var AB = new Vec2(this.x1 - A.x, this.y1 - A.y),
                AC = new Vec2(this.x2 - A.x, this.y2 - A.y);

            return AB.x * AC.y - AB.y * AC.x;
        }
    });

}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));