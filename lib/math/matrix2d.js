(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert"),
        Matrix2D;

    /**
     * based on cakejs
     * @class Matrix2D
     */
    Matrix2D = exports.Matrix2D = new Class("Matrix2D", {
        /**
         * @type Array
         */
        p: [1, 0, 0, 1, 0, 0],
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
        __construct: function (object) {
            var tobject = typeOf(object);

            switch (tobject) {
            case "array":
                this.set(object);
            break;
            case "Matrix2D":
                this.p = Array.clone(object.p);

                this.__scalex   = object.__scalex;
                this.__scaley   = object.__scaley;
                this.__skewx    = object.__skewx;
                this.__skewy    = object.__skewy;
                this.__rotation = object.__rotation;
            break;
            }

            return this;
        },
        debug: function () {
            //console.log(arguments);
        },
        /**
         * @member Matrix2D
         * @returns Matrix2D this for chaining
         */
        reset: function () {
            this.p = [1, 0, 0, 1, 0, 0];

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
         * @param {Array}
         * @returns Matrix2D this for chaining
         */
        set: function (p) {
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
            if (this.readonly) {
                throw new Error("readonly-matrix");
            }
        },
        /**
         * Rotates a transformation matrix by angle.
         * @member Matrix2D
         * @param {Number} angle
         * @returns Matrix2D this for chaining
         */
        rotate : function (angle) {
            this.__check_readonly();

            this.__rotation += angle;
            angle = angle * 0.017453292519943295769236907684886;
            var c = Math.cos(angle),
                s = Math.sin(angle),
                m11 = this.p[0] * c +  this.p[2] * s,
                m12 = this.p[1] * c +  this.p[3] * s,
                m21 = this.p[0] * -s + this.p[2] * c,
                m22 = this.p[1] * -s + this.p[3] * c;
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
        setRotation: function (angle) {
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
        translate : function (x, y) {
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
        gTranslate : function (x, y) {
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
        setPosition: function (x, y) {
            this.__check_readonly();

            if (x !== false) {
                this.p[4] = x;
            }
            if (y !== false) {
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
        scale : function (sx, sy) {
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
        setScale : function (sx, sy) {
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
        skewX : function (angle) {
            this.__check_readonly();

            this.__skewx += angle;
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
        skewY : function (angle) {
            this.__check_readonly();

            this.__skewy += angle;
            this.multiply(Matrix2D.skewYMatrix(angle));

            return this;
        },
        /**
         * TODO optimize!
         * @member Matrix2D
         * @returns Matrix2D this for chaining
         */
        setSkew: function (anglex, angley) {
            this.__check_readonly();

            var aux;
            if (anglex !== false) {
                aux = anglex  - this.__skewx;
                this.skewX(aux);
                this.__skewx = anglex;
            }
            if (angley !== false) {
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
        multiply : function (m2) {
            this.__check_readonly();

            var m11 = this.p[0] * m2[0] + this.p[2] * m2[1],
                m12 = this.p[1] * m2[0] + this.p[3] * m2[1],

                m21 = this.p[0] * m2[2] + this.p[2] * m2[3],
                m22 = this.p[1] * m2[2] + this.p[3] * m2[3],

                dx = this.p[0] * m2[4] + this.p[2] * m2[5] + this.p[4],
                dy = this.p[1] * m2[4] + this.p[3] * m2[5] + this.p[5];

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
        get : function () {
            return Array.clone(this.p);
        },
        /**
         * clone and return the array
         * @returns Array
         */
        getPosition : function () {
            return new Vec2(this.p[4], this.p[5]);
        },
        /**
         * apply (multiply) the transformation to the canvas
         * @returns Matrix2D this for chaining
         */
        applyToCanvas : function (ctx) {
            this.debug("applyToCanvas", this.p);
            var p = this.p;
            ctx.transform(p[0], p[1], p[2], p[3], p[4], p[5]);

            return this;
        },
        /**
         * apply (overwrite) the transformation to the canvas
         * @returns Matrix2D this for chaining
         */
        setToCanvas : function (ctx) {
            this.debug("setToCanvas", this.p);
            var p = this.p;
            ctx.setTransform(p[0], p[1], p[2], p[3], p[4], p[5]);

            return this;
        },
        apply: function (vec2) {
            return new Vec2(
                vec2.x * this.p[0] + vec2.x * this.p[2] + vec2.x * this.p[4],
                vec2.x * this.p[1] + vec2.x * this.p[3] + vec2.x * this.p[5]
            );
        },
        /**
         * @todo do it
         */
        inverse: function () {},
        /**
         * @todo do it
         */
        transpose: function () {},
        /**
         * @todo transform to a 0-6
         */
        determinant: function () {
            var fCofactor00 = this.p[1][1] * this.p[2][2] - this.p[1][2] * this.p[2][1],
                fCofactor10 = this.p[1][2] * this.p[2][0] - this.p[1][0] * this.p[2][2],
                fCofactor20 = this.p[1][0] * this.p[2][1] - this.p[1][1] * this.p[2][0];

            return this.p[0][0] * fCofactor00 +
                this.p[0][1] * fCofactor10 +
                this.p[0][2] * fCofactor20;
        }
    });

    /**
     * Returns a 3x2 2D column-major translation matrix for x and y.
     * @member Matrix2D
     * @static
     * @param {Number} x
     * @param {Number} y
     */
    Matrix2D.translationMatrix = function (x, y) {
        return new Matrix2D([ 1, 0, 0, 1, x, y ]);
    };
    /**
     * Returns a 3x2 2D column-major y-skew matrix for the angle.
     * @member Matrix2D
     * @static
     * @param {Number} angle
     */
    Matrix2D.skewXMatrix = function (angle) {
        return new Matrix2D([ 1, 0, Math.tan(angle * 0.017453292519943295769236907684886), 1, 0, 0 ]);
    };

    /**
     * Returns a 3x2 2D column-major y-skew matrix for the angle.
     * @member Matrix2D
     * @static
     * @param {Number} angle
     */
    Matrix2D.skewYMatrix = function (angle) {
        return new Matrix2D([ 1, Math.tan(angle * 0.017453292519943295769236907684886), 0, 1, 0, 0 ]);
    };
    /**
     * Returns a 3x2 2D column-major scaling matrix for sx and sy.
     * @member Matrix2D
     * @static
     * @param {Number} sx
     * @param {Number} sy
     */
    Matrix2D.scalingMatrix = function (sx, sy) {
        return new Matrix2D([ sx, 0, 0, sy, 0, 0 ]);
    };


}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));