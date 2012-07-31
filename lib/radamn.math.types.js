/**
    Define
        Polygon
        Rectangle
        Circle
        Segment2
        Line2
        Vec2
*/

(function(exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert");

// TODO
// - rotate based on a rotation point
// - scale based on a scale point


/**
 ******************************************************************************
 */
 /**
 * @class Polygon
 */
var Polygon = exports.Polygon = new Class("Polygon", {
    points: [],
});

Polygon.implements({
    __construct: function() {
        switch(typeOf(object)) {
            case "Polygon" :
                    object = Object.clone(object.getClean());
                    for (var key in object) this[key] = object[key];
            break;
            case "array" :
                var i = 0,
                max = object.length;
                for(;i<max;++i) {
                    this.push(object[i]);
                }
            break;
        }
    },
    push: function() {
        if(arguments.length === 2 ) {
            this.points.push(new Vec2(arguments[0], arguments[1]));
            return this;
        }
        this.points.push(arguments[0]);

        return this;
    }
});

/**
 * based on cakejs
 * @class Matrix2D
 */
var Matrix2D = exports.Matrix2D = new Class("Matrix2D", {
    /**
     * @type Array
     */
    p: [],
    /**
     * @type Number
     */
    __scalex : 1,
    /**
     * @type Number
     */
    __scaley : 1,
    /**
     * @type Number
     */
    __skewx : 0,
    /**
     * @type Number
     */
    __skewy : 0,
    /**
     * @type Number
     */
    __rotation : 0,
    /**
     * @type Boolean
     */
    readonly: false,
});

Matrix2D.implements({
    __construct: function(object) {
        this.debug("new Matrix2D");
        this.reset();
        if(arguments.length == 1 && typeOf(arguments[0]) == "array") {
            this.set(arguments[0]);
        }
        else if(arguments.length == 1) {
            if (typeOf(object) == "matrix2d") object = Object.clone(object.getClean());
            for (var key in object) this[key] = object[key];
        }
        return this;
    },
    debug: function() {
        //console.log(arguments);
    },
    /**
     * @member Matrix2D
     * @returns Matrix2D this for chaining
     */
    reset: function() {
        delete this.p;
        this.p =[1,0,0,1,0,0];

        this.__scalex = 1;
        this.__scaley = 1;
        this.__skewx = 0;
        this.__skewy = 0;
        this.__rotation = 0;

        this.readonly = false;
        this.debug("reset", this);

        return this;
    },
    /**
     * @member Matrix2D
     * @returns Matrix2D this for chaining
     */
    set: function(p) {
        this.p[0] = p[0];
        this.p[1] = p[1];
        this.p[2] = p[2];
        this.p[3] = p[3];
        this.p[4] = p[4];
        this.p[5] = p[5];

        this.debug("set", this.p);

        return this;
    },
    /**
     * @member Matrix2D
     * @private
     */
    __check_readonly: function () {
        if(this.readonly) {
            throw new Error("readonly-matrix");
        }
    },
    /**
     * Rotates a transformation matrix by angle.
     * @member Matrix2D
     * @param {Number} angle
     * @returns Matrix2D this for chaining
     */
    rotate : function(angle) {
        this.__check_readonly();

        this.__rotation +=angle;
        angle = angle * 0.017453292519943295769236907684886;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var m11 = this.p[0] * c +  this.p[2] * s;
        var m12 = this.p[1] * c +  this.p[3] * s;
        var m21 = this.p[0] * -s + this.p[2] * c;
        var m22 = this.p[1] * -s + this.p[3] * c;
        this.p[0] = m11;
        this.p[1] = m12;
        this.p[2] = m21;
        this.p[3] = m22;

        this.debug("rotate", this.p);

        return this;
    },
    /**
     * @member Matrix2D
     * @returns Matrix2D this for chaining
     */
    setRotation: function(angle) {
        this.__check_readonly();

        var aux = angle - this.__rotation;
        this.rotate(aux);
        this.__rotation = angle;
        this.debug("setRotation", this.p);

        return this;
    },
    /**
     * transformation matrix by x and y
     * @note  Derived translation (include rotation)
     *
     * @member Matrix2D
     * @param {Number} x
     * @param {Number} y
     * @returns Matrix2D this for chaining
     */
    translate : function(x, y) {
        this.__check_readonly();


        this.p[4] += this.p[0] * x + this.p[2] * y;
        this.p[5] += this.p[1] * x + this.p[3] * y;
        this.debug("translate", this.p);

        return this;
    },
    /**
     * transformation matrix by x and y
     * @note Global translation (NO include rotation)
     *
     * @member Matrix2D
     * @param {Number} x
     * @param {Number} y
     * @returns Matrix2D this for chaining
     */
    gTranslate : function(x, y) {
        this.__check_readonly();

        this.p[4] += x;
        this.p[5] += y;
        this.debug("gTranslate", this.p);

        return this;
    },
    /**
     * transformation matrix by x and y
     * @note Global position (NO include rotation)
     *
     * @member Matrix2D
     * @param {Number} x use false to not skip set
     * @param {Number} y use false to not skip set
     * @returns Matrix2D this for chaining
     */
    setPosition: function(x, y) {
        this.__check_readonly();

        if(x !== false) {
            this.p[4] = x;
        }
        if(y !== false) {
            this.p[5] = y;
        }
        this.debug("setPosition", this.p);
        return this;
    },
    /**
     * Scales a transformation matrix by sx and sy.
     *
     * @member Matrix2D
     * @param {Number} sx
     * @param {Number} sy
     * @returns Matrix2D this for chaining
     */
    scale : function(sx, sy) {
        this.__check_readonly();

        this.__scalex *= sx;
        this.__scaley *= sy;
        this.p[0] *= sx;
        this.p[1] *= sx;
        this.p[2] *= sy;
        this.p[3] *= sy;

        return this;
    },
    /**
     * Scales a transformation matrix by sx and sy.
     *
     * @member Matrix2D
     * @param {Number} sx
     * @param {Number} sy
     * @returns Matrix2D this for chaining
     */
    setScale : function(sx, sy) {
        this.__check_readonly();

        this.__scalex /= sx;
        this.__scaley /= sy;
        this.p[0] /= this.__scalex;
        this.p[1] /= this.__scalex;
        this.p[2] /= this.__scaley;
        this.p[3] /= this.__scaley;

        this.__scalex = sx;
        this.__scaley = sy;

        return this;
    },
    /**
     * Skews a transformation matrix by angle on the x-axis.
     * TODO optimize!
     * @member Matrix2D
     * @param {Number} angle
     * @returns Matrix2D this for chaining
     */
    skewX : function(angle) {
        this.__check_readonly();

        this.__skewx+=angle;
        this.multiply(Matrix2D.skewXMatrix(angle));

        return this;
    },

    /**
     * Skews a transformation matrix by angle on the y-axis.
     * TODO optimize!
     * @member Matrix2D
     * @param {Number} angle
     * @returns Matrix2D this for chaining
     */
    skewY : function(angle) {
        this.__check_readonly();

        this.__skewy+=angle;
        this.multiply(Matrix2D.skewYMatrix(angle));

        return this;
    },
    /**
     * TODO optimize!
     * @member Matrix2D
     * @returns Matrix2D this for chaining
     */
    setSkew: function(anglex, angley) {
        this.__check_readonly();

        var aux;
        if(anglex !== false) {
            aux = anglex  - this.__skewx;
            this.skewX(aux);
            this.__skewx = anglex;
        }
        if(angley !== false) {
            aux = angley - this.__skewy;
            this.skewY(aux);
            this.__skewy = angley;
        }

        return this;
    },
    /**
     * Multiplies two 3x2 affine 2D column-major transformation matrices
     * with each other and stores the result in the first matrix.
     * @member Matrix2D
     * @todo SUPPORT skew. rotation and scale traking!
     * @param {Array} m2
     * @returns Matrix2D this for chaining
     */
    multiply : function(m2) {
        this.__check_readonly();

        var m11 = this.p[0] * m2[0] + this.p[2] * m2[1];
        var m12 = this.p[1] * m2[0] + this.p[3] * m2[1];

        var m21 = this.p[0] * m2[2] + this.p[2] * m2[3];
        var m22 = this.p[1] * m2[2] + this.p[3] * m2[3];

        var dx = this.p[0] * m2[4] + this.p[2] * m2[5] + this.p[4];
        var dy = this.p[1] * m2[4] + this.p[3] * m2[5] + this.p[5];

        this.p[0] = m11;
        this.p[1] = m12;
        this.p[2] = m21;
        this.p[3] = m22;
        this.p[4] = dx;
        this.p[5] = dy;

        return this;
    },
    /**
     * clone and return the array
     * @returns Array
     */
    get : function() {
        return Array.clone(this.p);
    },
    /**
     * clone and return the array
     * @returns Array
     */
    getPosition : function() {
        return new Vec2(this.p[4], this.p[5]);
    },
    /**
     * apply (multiply) the transformation to the canvas
     * @returns Matrix2D this for chaining
     */
    applyToCanvas : function(ctx) {
        this.debug("applyToCanvas", this.p);
        var p = this.p;
        ctx.transform(p[0],p[1],p[2],p[3],p[4],p[5]);

        return this;
    },
    /**
     * apply (overwrite) the transformation to the canvas
     * @returns Matrix2D this for chaining
     */
    setToCanvas : function(ctx) {
        this.debug("setToCanvas", this.p);
        var p = this.p;
        ctx.setTransform(p[0],p[1],p[2],p[3],p[4],p[5]);

        return this;
    },
    apply: function(vec2) {
        return new Vec2(
            vec2.x * this.p[0] + vec2.x * this.p[2] + vec2.x * this.p[4],
            vec2.x * this.p[1] + vec2.x * this.p[3] + vec2.x * this.p[5]
        );
    },
    /**
     * @todo do it
     */
    inverse: function() {},
    /**
     * @todo do it
     */
    transpose: function() {},
    /**
     * @todo transform to a 0-6
     */
    determinant: function() {
        var fCofactor00 = this.p[1][1]*this.p[2][2] -
        this.p[1][2]*this.p[2][1];
        var fCofactor10 = this.p[1][2]*this.p[2][0] -
        this.p[1][0]*this.p[2][2];
        var fCofactor20 = this.p[1][0]*this.p[2][1] -
        this.p[1][1]*this.p[2][0];

        var fDet =
        this.p[0][0]*fCofactor00 +
        this.p[0][1]*fCofactor10 +
        this.p[0][2]*fCofactor20;

        return fDet;
    }
});

/**
 * Returns a 3x2 2D column-major translation matrix for x and y.
 * @member Matrix2D
 * @static
 * @param {Number} x
 * @param {Number} y
 */
Matrix2D.translationMatrix = function(x, y) {
    return new Matrix2D([ 1, 0, 0, 1, x, y ]);
};
/**
 * Returns a 3x2 2D column-major y-skew matrix for the angle.
 * @member Matrix2D
 * @static
 * @param {Number} angle
 */
Matrix2D.skewXMatrix = function(angle) {
    return new Matrix2D([ 1, 0, Math.tan(angle * 0.017453292519943295769236907684886), 1, 0, 0 ]);
};

/**
 * Returns a 3x2 2D column-major y-skew matrix for the angle.
 * @member Matrix2D
 * @static
 * @param {Number} angle
 */
Matrix2D.skewYMatrix = function(angle) {
    return new Matrix2D([ 1, Math.tan(angle * 0.017453292519943295769236907684886), 0, 1, 0, 0 ]);
};
/**
 * Returns a 3x2 2D column-major scaling matrix for sx and sy.
 * @member Matrix2D
 * @static
 * @param {Number} sx
 * @param {Number} sy
 */
Matrix2D.scalingMatrix = function(sx, sy) {
    return new Matrix2D([ sx, 0, 0, sy, 0, 0 ]);
};

// draw method is the same for all types/primitives
(function(){
    function __drawPrimitive(ctx, delta) {
        var options = this.drawOptions || {style: "stroke"};
        if(options.style == "stroke") {
            ctx.strokePrimitive(this, options);
        }
        ctx.fillPrimitive(this, options);
    }

    [Polygon, Rectangle, Circle, Segment2, Line2, Vec2].forEach(function(type) {
        type.implements({
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
})();


/**
 * credits - CAAT
 *
 * @class Beizer
 */
var Beizer = exports.Beizer = new Class("Beizer", {
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

Beizer.implements({
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
    setCubic : function(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y, cp3x, cp3y) {
        this.points = [];
        this.points.push( new Vec2(cp0x, cp0y ) );
        this.points.push( new Vec2(cp1x, cp1y ) );
        this.points.push( new Vec2(cp2x, cp2y ) );
        this.points.push( new Vec2(cp3x, cp3y ) );

        this.cubic= true;

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
    setQuadric : function(cp0x, cp0y, cp1x, cp1y, cp2x, cp2y) {

        this.points = [];

        this.points.push( new Vec2(cp0x, cp0y ) );
        this.points.push( new Vec2(cp1x, cp1y ) );
        this.points.push( new Vec2(cp2x, cp2y ) );

        this.cubic= false;

        return this;
    },
    /**
     * Solves a quadric Bezier.
     * @param point {Vec2} the point to store the solved value on the curve.
     * @param t {number} the value to solve the curve for.
     * @returns Vec2
     */
    __get_quadric : function(point,t) {
        var cl= this.points;
        var cl0= cl[0];
        var cl1= cl[1];
        var cl2= cl[2];
        var t1= 1-t;

        return new Vec2(
            t1*t1*cl0.x + 2*t1*t*cl1.x + t*t*cl2.x,
            t1*t1*cl0.y + 2*t1*t*cl1.y + t*t*cl2.y
        );
    },
    /**
     * Solves a cubic Bezier.
     * @param t {number} the value to solve the curve for.
     * @returns Vec2
     */
    __get_cubic: function(t) {
        var t2= t*t;
        var t3= t*t2;

        var cl= this.points;
        var cl0= cl[0];
        var cl1= cl[1];
        var cl2= cl[2];
        var cl3= cl[3];


        return new Vec2(

            (cl0.x + t * (-cl0.x * 3 + t * (3 * cl0.x - cl0.x*t)))
                   + t*(3*cl1.x+t*(-6*cl1.x+ cl1.x*3*t))
                   + t2*(cl2.x*3-cl2.x*3*t)
                   + cl3.x * t3
            ,
            (cl0.y + t*(-cl0.y*3+t*(3*cl0.y-cl0.y*t)))
                   + t*(3*cl1.y+t*(-6*cl1.y+cl1.y*3*t))
                   + t2*(cl2.y*3-cl2.y*3*t)
                   + cl3.y * t3
        );
    },
    /**
     * Calculate the curve length by incrementally solving the curve every substep=CAAT.Curve.k. This value defaults
     * to .05 so at least 20 iterations will be performed.
     * @todo some kind of cache maybe it's needed!
     * @return {number} the approximate curve length.
     */
    length : function() {
        var x1,y1;
        x1 = this.coordlist[0].x;
        y1 = this.coordlist[0].y;
        var llength=0;
        var pt= new Vec2();
        for(var t=this.k;t<=1+this.k;t+=this.k){
            this.get(pt, t);
            llength += Math.sqrt((pt.x-x1)*(pt.x-x1) + (pt.y-y1)*(pt.y-y1));
            x1 = pt.x;
            y1 = pt.y;
        }

        this.length= llength;
        return llength;
    },
    get: function(t) {
        if(this.cubic) {
            return this.__get_cubic(t);
        }
        return this.__get_quadric(t);
    },
});


})(typeof exports === "undefined" ? this : global, typeof exports === "undefined");