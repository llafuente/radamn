(function (exports, browser) {
    "use strict";

    var assert = browser ? window.assert : require('assert'),
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof;

    Math.PI2 = 2 * Math.PI;
    Math.PIDIV2 = Math.PI * 0.5;


    Math.clamp = function (f, min, max) {
        return Math.min(Math.max(f, min), max);
    };
    Math.lerp = function (f1, f2, t) {
        return f1 * (1.0 - t) + f2 * t;
    };
    Math.lerpconst = function (f1, f2, d) {
        return f1 + Math.clamp(f2 - f1, -d, d);
    };

    // draw method is the same for all types/primitives
    (function () {
        function __drawPrimitive(ctx, delta) {
            var options = this.drawOptions || {style: "stroke"};
            if (options.style === "stroke") {
                ctx.strokePrimitive(this, options);
            }
            ctx.fillPrimitive(this, options);
        }

        [Polygon, Rectangle, Circle, Segment2, Line2, Vec2].forEach(function (type) {
            type.Implements({
                /**
                * @type DrawOptions
                */
                drawOptions: null,
                /**
                 * @param {Canvas} ctx
                 * @param {Number} delta
                 */
                draw: __drawPrimitive
            });
        });
    }); // TODO execute this ?!


    /**
    * @member Math
    */
    Math.isParallel = function (a, b) {
        var result = Math.intersection(a, b);

        if (result === true) {
            return false;
        }
        return result.reason === "parallel";
    };

    /**
    * @member Math
    */
    Math.intersection = function (a, b) {
        var types = [],
            atype = a.$name,
            btype = b.$name,
            fn,
            c;


        //swap
        if (atype.localeCompare(btype) > 0) {
            c = atype;
            atype = btype;
            btype = c;

        }

        fn = ("intersection_" + atype + "_vs_" + btype).toLowerCase();

        if (Math[fn] === undefined) {
            throw "Math." + fn + " is not declared";
        }

        if (!c) {
            return Math[fn](a, b);
        }

        return Math[fn](b, a);
    };

    /**
    * @member Math
    */
    Math.distance = function (a, b) {
        var types = [],
            atype = __typeof(a),
            fn;

        types.push(atype.toLowerCase());
        types.push(__typeof(b).toLowerCase());
        types.sort();

        fn = ("distance_" + types[0] + "_vs_" + types[1]).toLowerCase();

        assert.notEqual(Math[fn], undefined, "Math." + fn + " is not declared");

        if (types[0] === atype) {
            return Math[fn](a, b);
        }

        return Math[fn](b, a);
    };

    if (!browser) { // debug just in node
        var defines = [/*"Polygon", */"rectangle", "circle", "segment2", "line2", "vec2"],
            i,
            j,
            func;

        for (i = 0; i < defines.length; ++i) {
            for (j = 0; j < defines.length; ++j) {
                func = "distance_" + defines[i] + "_vs_" + defines[j];
                if (Math[func] === undefined) {
                    console.log("# function missing: Math." + func);
                }

                func = "intersection_" + defines[i] + "_vs_" + defines[j];
                if (Math[func] === undefined) {
                    console.log("# function missing: Math." + func);
                }
            }
        }
    }

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));