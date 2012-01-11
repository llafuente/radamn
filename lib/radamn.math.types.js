var assert = require('assert');

/**
Define
- Polygon
- Rectangle
- Circle
- Segment2
- Line2
- Vec2
*/

// TODO
// - rotate based on a rotation point
// - scale based on a scale point

/**
 * @class Vec2
 */
var Vec2 = this.Vec2 = global.Vec2 = new Type('Vec2', function(object){
	switch(arguments.length) {
	case 2 : 
		this.set(arguments[0], arguments[1]);
	break;
	case 1 :
		this.set(arguments[0].x, arguments[0].y);
	break;
	}

    return this;
});

Vec2.implement({
    /**
     * @member Vec2
     * @type Number
     */
    x: 0,
    /**
     * @member Vec2
     * @type Number
     */
    y: 0,
	/**
	 * @member Vec2
	 * @returns Vec2 (this)
	 */
    set: function(x,y) {
        this.x = x;
        this.y = y;
		
		return this;
    },
    /**
     * @member Vec2
     * @returns Vec2 this
     */
    zero: function() {
        this.x = 0;
        this.y = 0;

        return this;
    },
	/**
	 * @member Vec2
	 * @return Number
	 */
	normalize: function() {
		var fLength = Math.sqrt( this.x * this.x + this.y * this.y);
		
		// Will also work for zero-sized vectors, but will change nothing
		if ( fLength > Math.EPS ) {
			var fInvLength = 1.0 / fLength;
			this.x *= fInvLength;
			this.y *= fInvLength;
		}
		
		return fLength;
	},
    /**
     * @member Vec2
     * @returns Vec2 this
     */
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		
		return this;
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @returns Number this
     */
	dist: function(v2){
		return this.clone().sub(v2).length();
		//return cpvlength(cpvsub(v1, v2));
	},
	distSquared: function(v2){
		return this.clone().sub(v2).lengthSquared();
		//return cpvlengthsq(cpvsub(v1, v2));
	},
	near: function(v2, dist){
		return this.distSquared(v2) < dist * dist;
		//return cpvdistsq(v1, v2) < dist*dist;
	},
	/**
	 * @member Vec2
     * @param {Vec2} v2
	 * @return Vec2 this
	 */
	midPoint: function(v2) {
		this.x = ( this.x + v2.x ) * 0.5;
		this.y = ( this.y + v2.y ) * 0.5;
		
		return this;
	},
	/**
	 * @member Vec2
	 * @return Vec2 this
	 */
	perpendicular: function() {
		var aux = this.x;
		this.x = -this.y;
		this.x = aux;
		
		return this;
	},
	/**
	 * @member Vec2
     * @param {Vec2} normal
	 * @return Vec2 this
	 */
	reflect: function(normal) {
		var aux = this.clone().dot(normal).mul(normal)
	
		this.sub(aux.mul(2));
	
		return this;
	},
    /**
     * @member Vec2
     * @param {Vec2|Number} b
     * @param {Number|Null} a
     * @returns Vec2 this
     */
    sub : function(b, a) {
        var btype = typeOf(b);
		switch(btype) {
			case 'vec2' :
				this.x -= b.x;
				this.y -= b.y;
				break;
			case 'number' :
				var atype = typeOf(a);
				switch(atype) {
					case 'null' :
						this.x -= b;
						this.y -= b;
					break;
					case 'number' : 
						this.x -= b;
						this.y -= a;
					break;
					default :
						assert.ok(true, "Vec2::sub(b,a), b is not a Vec2 or a Number or b&a are not Number");
				}
				break;
			default : 
			assert.ok(true, "Vec2::sub(b,a), b is not a Vec2 or a Number or b&a are not Number");
		}

        return this;
    },
    /**
     * @member Vec2
     * @param {Vec2|Number} b
     * @param {Number|Null} a
     * @returns Vec2 this
     */
    plus : function(b, a) {
        var btype = typeOf(b);
        switch(btype) {
            case 'vec2' :
                this.x += b.x;
                this.y += b.y;
                break;
            case 'number' :
				var atype = typeOf(a);
				switch(atype) {
					case 'null' :
						this.x += b;
						this.y += b;
					break;
					case 'number' : 
						this.x += b;
						this.y += a;
					break;
					default :
						assert.ok(true, "Vec2::plus(b,a), b is not a Vec2 or a Number or b&a are not Number");
				}
                break;
			default:
				assert.ok(true, "Vec2::plus(b,a), b is not a Vec2 or a Number or b&a are not Number");
        }
        return this;
    },
    /**
     * @member Vec2
     * @param {Vec2|number} b
     * @returns Vec2 this
     */
    mul : function(factor) {
        var btype = typeOf(factor);
		assert.notEqual(["vec2", "number"].contains(btype), false, "Vec2::mul("+btype+"), b is not a Vec2 or a Number");
		
        switch(btype) {
            case 'number' :
                this.x *= factor;
                this.y *= factor;
            break;
            case 'vec2' :
                this.x *= factor.x;
                this.y *= factor.y;
            break;
        }
        return this;
    },
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @returns Number
     */
    dot : function(v2) {
		assert.notEqual(typeOf(v2) == "vec2", false, "Vec2::dot, v2 is not a Vec2");

        return this.x * v2.x + this.y * v2.y;
    },
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @returns Number
     */
	cross: function(v2) {
		return this.x * v2.y - this.y * v2.x;
	},
    /**
     * @member Vec2
     * @returns Vec2 this
     */
	perp: function() {
		var aux = this.x;
		this.x = -this.y;
		this.y = aux;
		
		return this;
	},
    /**
     * @member Vec2
     * @returns Vec2 this
     */
	rerp: function() {
		var aux = this.x;
		this.x = this.y;
		this.y = -aux;
		
		return this;
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @param {Number} t
     * @returns Vec2 this
     */
    lerp : function(v2, t){
		this.x = this.x+(v2.x-this.x)*t;
		this.y = this.y+(v2.y-this.y)*t;
		
		return this;
    },
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @param {Number} d
     * @returns Vec2 this
     */
	lerpconst: function(v2, d){
		this.plus(v2.clamp(v1,d));
		
		return this;
		//return cpvadd(v1, cpvclamp(cpvsub(v2, v1), d));
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @param {Number} t
     * @returns Vec2 cloned!!
     */
	slerp: function(v2, t){
		var omega = Math.acos( this.dot(v2) );
		
		if(omega){
			var denom = 1.0/Math.sin(omega);
			
			var comp1 = this.clone().mul(Math.sin((1.0 - t)*omega)*denom);
			return comp1.plus(v2.clone().mul(Math.sin(t*omega)*denom));
			
			//return cpvadd(cpvmult(v1, cpfsin((1.0 - t)*omega)*denom), cpvmult(v2, Math.sin(t*omega)*denom));
		} else {
			return this.clone();
		}
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @param {Number} a
     * @returns Vec2 cloned!!
     */
	slerpconst: function(v2, a){
		var angle = Math.acos(this.dot(v2));
		return this.slerp(v2, Math.min(a, angle)/angle);
	},
    /**
     * @member Vec2
     * @param {Number} a Radians!
     * @returns Vec2 cloned!!
     */
	forangle: function(a) {
		this.x = Math.cos(a);
		this.y = Math.sin(a);
		
		return this;
	},
    /**
     * @member Vec2
     * @returns Number Radians!
     */
	toangle: function() {
		return Math.atan2(this.y, this.x);
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @returns Vec2 this
     */
	project: function(v2) {
		var dot1 = this.dot(v2);
		var dot2 = v2.dot(v2);
		
		this.mul(v2, dot1/dot2);
		
		return this;
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @returns Vec2 this
     */
	rotate: function(v2) {
		this.x = this.x*v2.x - this.y*v2.y;
		this.y = this.x*v2.y + this.y*v2.x;
		
		return this;
	},
    /**
     * @member Vec2
     * @param {Vec2} v2
     * @returns Vec2 this
     */
	unrotate: function(v2){
		this.x = this.x*v2.x + this.y*v2.y;
		this.y = this.y*v2.x - this.x*v2.y;
		
		return this;
	},
    /**
     * @member Vec2
     * @param {Vec2} b
     * @returns Number
     */
    length : function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },    
	/**
     * @member Vec2
     * @param {Vec2} b
     * @returns Number
     */
    lengthSquared : function() {
        return this.x * this.x + this.y * this.y;
    },
    /**
     * @member Vec2
     * @param {Vec2} b
     * @returns Vec2 this
     */
    div : function(b) {
		assert.notEqual(typeOf(b) == "vec2", false, "Vec2::div, b is not a Vec2");

        this.x /= b.x;
        this.y /= b.y;

        return this;
    },
    /**
     * @member Vec2
     * @returns Vec2 this
     */
    abs : function() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);

        return this;
    },
    /**
     * @member Vec2
     * @returns Boolean
     */
    isValid : function() {
        return !(is_infinite(this.x) || isNaN(this.x) || is_infinite(this.y) || isNaN(this.y));
    },
    /**
     * @member Vec2
     * @returns Vec2
     */
    clone: function() {
        return new Vec2(this.x, this.y);
    },
    /**
     * @member Vec2
     * @param {Vec2} b
     * @returns Vec2 this
     */
    min : function(b) {
		assert.notEqual(typeOf(b) == "vec2", false, "Vec2::min, b is not a Vec2");

        this.x = this.x < b.x ? this.x : b.x;
        this.y = this.y < b.y ? this.y : b.y;

        return this;
    },
    /**
     * @member Vec2
     * @param {Vec2} b
     * @returns Vec2 this
     */
    max : function(b) {
		assert.notEqual(typeOf(b) == "vec2", false, "Vec2::max, b is not a Vec2");

        this.x = this.x > b.x ? this.x : b.x;
        this.y = this.y > b.y ? this.y : b.y;

        return this;
    },
    /**
     * @member Vec2
     * @returns Vec2 cloned!!
     */
	clamp: function(len){
		if(this.dot(this) > len * len) {
			return this.clone().normalize().mul(len);
		}
		
		return this.clone();
	},
	/**
	 * @member Vec2
	 * @returns Number 0 equal, 1 top, 2 top-right, 3 right, 4 bottom right, 5 bottom, 6 bottom-left, 7 left, 8 top-left
	 */
	compare: function(vec2) {
		if(vec2.x == this.x && vec2.y == this.y) return 0;
		if(vec2.x == this.x) {
			return vec2.y > this.y ? 1: 5;
		}
		if(vec2.y == this.y) {
			return vec2.x > this.x ? 3: 7;
		}
		
		if(vec2.x > this.x && vec2.y > this.y) {
			return 2;
		}
		if(vec2.x > this.x && vec2.y < this.y) {
			return 4;
		}
		if(vec2.x < this.x && vec2.y > this.y) {
			return 6;
		}
		if(vec2.x < this.x && vec2.y < this.y) {
			return 8;
		}
		
		return -1;
	},
	/**
	 * @member Vec2
	 * @returns Boolean
	 */
	gt: function() {
		return vec2.x > this.x && vec2.y > this.y;
	},
	/**
	 * @member Vec2
	 * @returns Boolean
	 */
	lt: function() {
		return vec2.x < this.x && vec2.y < this.y;
	},
	/**
	 * @member Vec2
	 * @returns Boolean
	 */
	eq: function() {
		return vec2.x == this.x && vec2.y == this.y;
	}
});

// translate!
Vec2.alias('translate', 'plus');
Vec2.alias('rotateCW', 'perp');
Vec2.alias('rotateCCW', 'rerp');

/**
 ******************************************************************************
 */
 /**
 * @class Line2
 */
var Line2 = this.Line2 = global.Line2 = new Type('Line2', function(object){
    if(arguments.length == 4) {
        this.set(arguments[0], arguments[1], arguments[2], arguments[3]);
    } else if(arguments.length == 3) {
        this.set(arguments[0], arguments[1], arguments[2]);
    } else if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'line2') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});


Line2.implement({
    x : 0,
    y : 0,
    m : 0,
    initialize: function(x,y, m) {
        this.x = x;
        this.y = y;
        this.m = m;

        return this;
    },
    set: function(x1, y1, x2, y2) {
        if(arguments.length === 2) {
            //compute m
            this.x = x1.x;
            this.y = x1.y;

            this.m = this.magnitude(y1.x, y1.y);

            return this;
        }
        //compute m
        this.x = x1;
        this.y = y1;
		
        if(arguments.length === 4) {
            this.m = this.magnitude(x2, y2);
		} else if(arguments.lenght == 3) {
            this.m = x2;
		}

        return this;

    },
    translate: function(b,a) {
		var btype = typeOf(b);
		switch(btype) {
			case 'vec2' : 
				this.x += b.x;
				this.y += b.y;
			break;
			case 'number' : 
				this.x += b;
				this.y += a;
			break;
		}
		
		return this;
    },
    getParallel: function(d) {
        return new Line2(this.x1,this.x2, -1/m);
    },
    magnitude: function(x2,y2) {
        var _x = this.x - (x2 || 0);
        var _y = this.y - (y2|| 0);
		
        return _x / _y;
    },
});
/**
 ******************************************************************************
 */
 /**
 * @class Segment2
 */
var Segment2 = this.Segment2 = global.Segment2 = new Type('Segment2', function(){
    var object = null;

    if(arguments.length == 4) {
        this.initialize(arguments[0], arguments[1], arguments[2], arguments[3]);
    }
    if(arguments.length == 2) {
		this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'segment2') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});

Segment2.implement({
    x1 : 0,
    y1 : 0,
    x2 : 0,
    y2 : 0,
    initialize: function(x1, y1, x2, y2) {
        //compute m
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        return this;
    },
	clone: function() {
		return new Segment2(this.x1, this.y1, this.x2, this.y2);
	},
	translate: function(b,a) {
		this.x1+=b.x;
		this.x2+=b.x;
		this.y1+=b.y;
		this.y2+=b.y;
		
		return this;
	},	
    set: function(p0, p1) {
        //compute m
        this.x1 = p0.x;
        this.y1 = p0.y;
        this.x2 = p1.x;
        this.y2 = p1.y;

        return this;
    },
    length: function() {
        var x = this.x2 - this.x1;
        var y = this.y2 - this.y1;

        return Math.sqrt(x * x + y * y);
    },
    lengthSquared: function() {
        var x = this.x2 - this.x1;
        var y = this.y2 - this.y1;

        return x * x + y * y;
    },
	cross: function(A) {
		var AB = new Vec2(this.x1 - A.x, this.y1 - A.y);
		var AB = new Vec2(this.x2 - A.x, this.y2 - A.y);

		return AB.x * AC.y - AB.y * AC.x;
	},
});
/**
 ******************************************************************************
 */
 /**
 * @class Circle
 */
var Circle = this.Circle = global.Circle = new Type('Circle', function(object){
    if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'circle') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});

Circle.implement({
    c: null,
    r: 0,
    set: function(center, radious) {
        this.c = center.clone();
        this.r = radious;
		
		return this;
    },
	clone: function() {
		var circle =  new Circle();
		circle.r = this.r;
		circle.c = this.c.clone();
		return circle;
	},
	translate: function(b,a) {
		this.c.plus(b,a);
		
		return this;
	},
	applyMatrix: function(matrix) {
		//matrix.
	}
});
/**
 ******************************************************************************
 */
 /**
 * @class Rectangle
 */
var Rectangle = this.Rectangle = global.Rectangle = new Type('Rectangle', function(){
    var object = null;

    if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'rectangle') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});

Rectangle.implement({
    v1 : 0,
    v2 : 0,
	dirty : true,
    set: function(vec2_1, vec2_2) {
        this.v1 = vec2_1;
        this.v2 = vec2_2;
		
		this.normalize();
        return this;
    },
	clone: function() {
		var r = new Rectangle();
		r.v1 = this.v1.clone();
		r.v2 = this.v2.clone();
		r.dirty = this.dirty;
		return r;
	},
	translate: function(b,a) {
		this.v1.plus(b,a);
		this.v2.plus(b,a);
		
		return this;
	},
	setTopLeft: function(vec2, normalize) {
		normalize = normalize || false;
		this.r1 = vec2;
		this.dirty = true;
		
		if(normalize) this.normalize();
		
	},
	setBottomRight: function(vec2) {
		normalize = normalize || false;
		this.r2 = vec2;
		this.dirty = true;
		
		if(normalize) this.normalize();
	},
	getCenter: function() {
		return this.v1.clone().plus(this.v2).mul(0.5);
	},
	normalize: function(force) {
		force = (force || this.dirty) || false;
		if(!force) return;
		var min        = this.v1.clone().min(this.v2),
			max        = this.v1.clone().max(this.v2);
		delete this.v1;
		delete this.v2;
		this.v1 = new Vec2( min.x, max.y );
		this.v2 = new Vec2( max.x, min.y );		
		delete min;
		delete max;
		this.dirty = false;
		
		return this;
	}
});
/**
 ******************************************************************************
 */
 /**
 * @class Polygon
 */
var Polygon = this.Polygon = global.Polygon = new Type('Polygon', function(object){
	this.initialize();
	switch(typeOf(object)) {
		case 'polygon' : 
				object = Object.clone(object.getClean());
				for (var key in object) this[key] = object[key];
		break;
		case 'array' :
			var i = 0,
			max = object.length;
			for(;i<max;++i) {
				this.push(object[i]);
			}
		break;
	}
    return this;
});


Polygon.implement({
    points: null,
	initialize: function() {
		this.points = [];
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
var Matrix2D = this.Matrix2D = global.Matrix2D = new Type('Matrix2D', function(object){
	this.debug("new Matrix2D");
	this.reset();
    if(arguments.length == 1 && typeOf(arguments[0]) == "array") {
        this.set(arguments[0]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'matrix2d') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});

Matrix2D.implement({
	debug: function() {
		//console.log(arguments);
	},
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
	/**
	 * @member Matrix2D
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
	},
	/**
	 * @member Matrix2D
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
    },
	/**
	 * @member Matrix2D
	 */
    setRotation: function(angle) {
		this.__check_readonly();
	
        var aux = angle - this.__rotation;
        this.rotate(aux);
        this.__rotation = angle;
		this.debug("setRotation", this.p);
    },
    /**
     * transformation matrix by x and y
     * @note  Derived translation (include rotation)
     *
     * @member Matrix2D
     * @param {Number} x
     * @param {Number} y
     */
    translate : function(x, y) {
        this.__check_readonly();
		

        this.p[4] += this.p[0] * x + this.p[2] * y;
        this.p[5] += this.p[1] * x + this.p[3] * y;
		this.debug("translate", this.p);
    },
    /**
     * transformation matrix by x and y
     * @note Global translation (NO include rotation)
     *
     * @member Matrix2D
     * @param {Number} x
     * @param {Number} y
     */
    gTranslate : function(x, y) {
        this.__check_readonly();

        this.p[4] += x;
        this.p[5] += y;
		this.debug("gTranslate", this.p);
    },
    /**
     * transformation matrix by x and y
     * @note Global position (NO include rotation)
     *
     * @member Matrix2D
     * @param {Number} x use false to not skip set
     * @param {Number} y use false to not skip set
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
    },
    /**
     * Scales a transformation matrix by sx and sy.
     *
     * @member Matrix2D
     * @param {Number} sx
     * @param {Number} sy
     */
    scale : function(sx, sy) {
        this.__check_readonly();

        this.__scalex *= sx;
        this.__scaley *= sy;
        this.p[0] *= sx;
        this.p[1] *= sx;
        this.p[2] *= sy;
        this.p[3] *= sy;
    },
    /**
     * Scales a transformation matrix by sx and sy.
     *
     * @member Matrix2D
     * @param {Number} sx
     * @param {Number} sy
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
    },
    /**
     * Skews a transformation matrix by angle on the x-axis.
     * TODO optimize!
     * @member Matrix2D
     * @param {Number} angle
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
     */
    skewY : function(angle) {
        this.__check_readonly();

        this.__skewy+=angle;
        return this.multiply(Matrix2D.skewYMatrix(angle));
    },
    /**
     * TODO optimize!
	 * @member Matrix2D
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
    },
    /**
     * Multiplies two 3x2 affine 2D column-major transformation matrices
     * with each other and stores the result in the first matrix.
     * @member Matrix2D
	 * @todo SUPPORT skew. rotation and scale traking!
     * @param {Array} m2
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
     * @return Array
     */
    get : function() {
        return Array.clone(this.p);
    },
    /**
     * clone and return the array
     * @return Array
     */
    getPosition : function() {
        return new Vec2(this.p[4], this.p[5]);
    },
    /**
     * apply (multiply) the transformation to the canvas
     * @return Array
     */
    applyToCanvas : function(ctx) {
		this.debug("applyToCanvas", this.p);
        ctx.transform.apply(ctx, this.p);
    },
    /**
     * apply (overwrite) the transformation to the canvas
     * @return Array
     */
    setToCanvas : function(ctx) {
		this.debug(this.p);
        ctx.setTransform.apply(ctx, this.p);
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
    return [ 1, 0, 0, 1, x, y ];
};
/**
 * Returns a 3x2 2D column-major y-skew matrix for the angle.
 * @member Matrix2D
 * @static
 * @param {Number} angle
 */
Matrix2D.skewXMatrix = function(angle) {
    return [ 1, 0, Math.tan(angle * 0.017453292519943295769236907684886), 1, 0, 0 ];
};

/**
 * Returns a 3x2 2D column-major y-skew matrix for the angle.
 * @member Matrix2D
 * @static
 * @param {Number} angle
 */
Matrix2D.skewYMatrix = function(angle) {
    return [ 1, Math.tan(angle * 0.017453292519943295769236907684886), 0, 1, 0, 0 ];
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

	[Polygon, Rectangle, Circle, Segment2, Line2, Vec2].each(function(type) {
		type.implement({
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