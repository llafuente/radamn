(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? assert : require("assert"),
        //__debug = browser ? NodeClass.debug : require("node-class").debug,
        __debug = function () {},
        Matrix2D;

    /**
     * based on cakejs
     * @class Matrix2D
     */
    Matrix2D = exports.Matrix2D = new Class("Matrix2D", {
        /**
         * @type Array
         */
        matrix: [1, 0, 0, 1, 0, 0],
        /**
         * @type Array
         */
        gmatrix: [1, 1, 0, 0, 0],
        /**
         * @type Boolean
         */
        readonly: false
    });

    Matrix2D.Implements({
        __construct: function (object) {
            var tobject = __typeof(object);

            switch (tobject) {
            case "array":
                this.set(object);
                break;
            case "Matrix2D":
                this.matrix = Array.clone(object.matrix);
                this.gmatrix = Array.clone(object.gmatrix);
                break;
            }

            return this;
        },
        /**
         * @member Matrix2D
         * @returns Matrix2D this for chaining
         */
        reset: function () {
            this.matrix = [1, 0, 0, 1, 0, 0];
            this.gmatrix = [1, 1, 0, 0, 0];

            this.readonly = false;
            __debug("reset", this);

            return this;
        },
        /**
         * TODO this maybe lead to some problems, width gmatrix
         * @member Matrix2D
         * @param {Array}
         * @returns Matrix2D this for chaining
         */
        set: function (p) {
            if (p.length !== 6) {
                throw new Error("invalid array length");
            }

            this.matrix = Array.clone(p);

            __debug("set", this.matrix);

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
        rotate: function (angle) {
            this.__check_readonly();

            this.gmatrix[4] += angle;
            angle = angle * 0.017453292519943295769236907684886;
            var c = Math.cos(angle),
                s = Math.sin(angle),
                m11 = this.matrix[0] * c +  this.matrix[2] * s,
                m12 = this.matrix[1] * c +  this.matrix[3] * s,
                m21 = this.matrix[0] * -s + this.matrix[2] * c,
                m22 = this.matrix[1] * -s + this.matrix[3] * c;
            this.matrix[0] = m11;
            this.matrix[1] = m12;
            this.matrix[2] = m21;
            this.matrix[3] = m22;

            __debug("rotate", this.matrix);

            return this;
        },
        /**
         * @member Matrix2D
         * @returns Matrix2D this for chaining
         */
        setRotation: function (angle) {
            this.__check_readonly();

            var aux = angle - this.gmatrix[4];
            this.rotate(aux);
            this.gmatrix[4] = angle;
            __debug("setRotation", this.matrix);

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
        translate: function (x, y) {
            this.__check_readonly();


            this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
            this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;
            __debug("translate", this.matrix);

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
        gTranslate: function (x, y) {
            this.__check_readonly();

            this.matrix[4] += x;
            this.matrix[5] += y;
            __debug("gTranslate", this.matrix);

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
                this.matrix[4] = x;
            }
            if (y !== false) {
                this.matrix[5] = y;
            }
            __debug("setPosition", this.matrix);
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
        scale: function (sx, sy) {
            this.__check_readonly();

            if (sx !== false) {
                this.gmatrix[0] *= sx;
                this.matrix[0] *= sx;
                this.matrix[1] *= sx;
            }
            if (sy !== false) {
                this.gmatrix[1] *= sy;
                this.matrix[2] *= sy;
                this.matrix[3] *= sy;
            }

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
        setScale: function (sx, sy) {
            this.__check_readonly();

            if (sx !== false) {
                this.gmatrix[0] /= sx;
                this.matrix[0] /= this.gmatrix[0];
                this.matrix[1] /= this.gmatrix[0];

                this.gmatrix[0] = sx;
            }
            if (sy !== false) {
                this.gmatrix[1] /= sy;
                this.matrix[2] /= this.gmatrix[1];
                this.matrix[3] /= this.gmatrix[1];

                this.gmatrix[1] = sy;
            }

            return this;
        },
        /**
         * Skews a transformation matrix by angle on the x-axis.
         * TODO optimize!
         * @member Matrix2D
         * @param {Number} angle
         * @returns Matrix2D this for chaining
         */
        skewX: function (angle) {
            this.__check_readonly();

            this.gmatrix[2] += angle;
            this.multiply(Matrix2D.skewXMatrix(angle).matrix);

            return this;
        },

        /**
         * Skews a transformation matrix by angle on the y-axis.
         * TODO optimize!
         * @member Matrix2D
         * @param {Number} angle
         * @returns Matrix2D this for chaining
         */
        skewY: function (angle) {
            this.__check_readonly();

            this.gmatrix[3] += angle;
            this.multiply(Matrix2D.skewYMatrix(angle).matrix);

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
                aux = anglex  - this.gmatrix[2];
                this.skewX(aux);
                this.gmatrix[2] = anglex;
            }
            if (angley !== false) {
                aux = angley - this.gmatrix[3];
                this.skewY(aux);
                this.gmatrix[3] = angley;
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
        multiply: function (m2) {
            this.__check_readonly();

            var m11 = this.matrix[0] * m2[0] + this.matrix[2] * m2[1],
                m12 = this.matrix[1] * m2[0] + this.matrix[3] * m2[1],

                m21 = this.matrix[0] * m2[2] + this.matrix[2] * m2[3],
                m22 = this.matrix[1] * m2[2] + this.matrix[3] * m2[3],

                dx = this.matrix[0] * m2[4] + this.matrix[2] * m2[5] + this.matrix[4],
                dy = this.matrix[1] * m2[4] + this.matrix[3] * m2[5] + this.matrix[5];

            this.matrix[0] = m11;
            this.matrix[1] = m12;
            this.matrix[2] = m21;
            this.matrix[3] = m22;
            this.matrix[4] = dx;
            this.matrix[5] = dy;

            return this;
        },
        /**
         * clone and return the array
         * @returns Array
         */
        get: function () {
            return Array.clone(this.matrix);
        },
        /**
         * clone and return the array
         * @returns Array
         */
        getPosition: function () {
            return new Vec2(this.matrix[4], this.matrix[5]);
        },
        apply: function (vec2) {
            return new Vec2(
                vec2.x * this.matrix[0] + vec2.x * this.matrix[2] + vec2.x * this.matrix[4],
                vec2.x * this.matrix[1] + vec2.x * this.matrix[3] + vec2.x * this.matrix[5]
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
            var fCofactor00 = this.matrix[1][1] * this.matrix[2][2] - this.matrix[1][2] * this.matrix[2][1],
                fCofactor10 = this.matrix[1][2] * this.matrix[2][0] - this.matrix[1][0] * this.matrix[2][2],
                fCofactor20 = this.matrix[1][0] * this.matrix[2][1] - this.matrix[1][1] * this.matrix[2][0];

            return this.matrix[0][0] * fCofactor00 +
                this.matrix[0][1] * fCofactor10 +
                this.matrix[0][2] * fCofactor20;
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

    Matrix2D.disable_autoset();

}(typeof exports === "undefined" ? window : global, typeof exports === "undefined"));