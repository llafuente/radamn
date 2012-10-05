(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert"),
        Rectangle;

    /**
     * @class Rectangle
     */
    Rectangle = exports.Rectangle = new Class("Rectangle", {
        v1 : null,
        v2 : null,
        dirty : true,
    });

    Rectangle.implements({
        __construct: function (object) {
            var key;

            switch(arguments.length) {
            case 4:
                this.v1 = new Vec2(arguments[0], arguments[1]);
                this.v2 = new Vec2(arguments[2], arguments[3]);
                this.normalize();
            break;
            case 2:
                this.set(arguments[0], arguments[1]);
            break;
            case 1:
                this.unserialize(object.serialize());
            break;
            }

            return this;
        },
        set: function (vec2_1, vec2_2) {
            this.v1 = vec2_1.clone();
            this.v2 = vec2_2.clone();

            this.normalize();
            return this;
        },
        center: function() {
            return this.v1.clone().add(this.v2).multiply(0.5);
        },
        clone: function () {
            var r = new Rectangle();
            r.v1 = this.v1.clone();
            r.v2 = this.v2.clone();
            r.dirty = this.dirty;
            return r;
        },
        translate: function (b, a) {
            this.v1.plus(b, a);
            this.v2.plus(b, a);

            return this;
        },
        setTopLeft: function (vec2, normalize) {
            normalize = normalize || false;
            this.r1 = vec2;
            this.dirty = true;

            if (normalize) {
                this.normalize();
            }

        },
        setBottomRight: function (vec2, normalize) {
            normalize = normalize || false;

            this.r2 = vec2;
            this.dirty = true;

            if (normalize) {
                this.normalize();
            }
        },
        getCenter: function () {
            return this.v1.clone().plus(this.v2).mul(0.5);
        },
        normalize: function (force) {
            force = (force || this.dirty) || false;

            if (!force) {
                return;
            }

            var min        = this.v1.clone().min(this.v2),
                max        = this.v1.clone().max(this.v2);

            this.v2 = this.v1 = null;

            this.v1 = new Vec2(min.x, max.y);
            this.v2 = new Vec2(max.x, min.y);
            this.dirty = false;

            return this;
        }
    });

}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));