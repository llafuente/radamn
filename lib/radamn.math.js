(function(exports, browser) {
    "use strict";

    var assert = browser ? assert : require('assert');

    Math.PI2 = 2 * Math.PI;
    Math.PIDIV2 = Math.PI * 0.5;
    Math.EPS = 10e-3;
    Math.INV_PI = 1 / Math.PI;

    Math.RAD_TO_DEG = 180 / Math.PI;
    Math.DEG_TO_RAD = Math.PI / 180;

    Math.clamp = function(f, min, max) {
        return Math.min(Math.max(f, min), max);
    };
    Math.lerp = function(f1, f2, t) {
        return f1*(1.0 - t) + f2*t;
    };
    Math.lerpconst = function(f1, f2, d){
        return f1 + Math.clamp(f2 - f1, -d, d);
    }

    if(!browser) {
        require("./radamn.math.types.js");
        require("./radamn.math.distance.js");
        require("./radamn.math.intersection.js");
    }

    /**
    * @member Math
    */
    Math.isParallel = function(a,b) {
        var result = Math.intersection(a,b);

        if(result === true) return false;
        return result.reason == "parallel";
    };

    /**
    * @member Math
    */
    Math.intersection = function(a,b){
        var types = [],
            atype = typeOf(a);

        types.push(atype);
        types.push(typeOf(b));
        types.sort();

        var fn = "intersection_"+types[0]+"_vs_"+types[1];

        assert.notEqual(Math[fn], undefined, "Math."+fn + " is not declared");

        if(types[0] == atype) {
            return Math[fn](a,b);
        } else {
            return Math[fn](b,a);
        }
    };

    /**
    * @member Math
    */
    Math.distance = function(a,b){
        var types = [],
            atype = typeOf(a);

        types.push(atype);
        types.push(typeOf(b));
        types.sort();

        var fn = "distance_"+types[0]+"_vs_"+types[1];

        assert.notEqual(Math[fn], undefined, "Math."+fn + " is not declared");

        if(types[0] == atype) {
            return Math[fn](a,b);
        } else {
            return Math[fn](b,a);
        }
    };

    if(!browser) { // debug just in node
        var defines = [/*"Polygon", */"rectangle", "circle", "segment2", "line2", "vec2"];
        var i=0,
            j=0;
        for(;i<defines.length; ++i) {
            for(;j<defines.length; ++j) {
                var func = "distance_"+defines[i]+"_vs_"+defines[j];
                if(Math[func]=== undefined) {
                    console.warning("function missing: Math." + func);
                }
                func = "intersection_"+defines[i]+"_vs_"+defines[j];
                if(Math[func]=== undefined) {
                    console.warning("function missing: Math." + func);
                }
            }
        }
    }

})(typeof exports === "undefined" ? this : exports, typeof exports === "undefined");

