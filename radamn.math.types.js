var assert = require('assert');

/**
Define
- Polygon
- Rectangle
- Circle
- Segment2
- Line2
- AABB2
- Vec2
*/

/**
 * @class Vec2
 */
var Vec2 = this.Vec2 = global.Vec2 = new Type('Vec2', function(object){
    if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'vec2') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
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
    set: function(x,y) {
        this.x = x;
        this.y = y;
    },
    /**
     * @member Vec2
     * @returns Vec2 this
     */
    lerp : function(that,t){
        return new Vec2(this.x+(that.x-this.x)*t,this.y+(that.y-this.y)*t);
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
     * @param {Vec2} b
     * @returns Vec2 this
     */
    sub : function(b, a) {
        //Radamn.assert(typeOf(b) != "vec2", "Vec2::sub, b is not a Vec2");
        var btype = typeOf(b);
		switch(btype) {
			case 'vec2' :
				this.x -= b.x;
				this.y -= b.y;
				break;
			case 'number' :
				var atype = typeOf(a);
				if(atype !== "number") {
					assert.ok(true, "Vec2::sub(b,a), b is not a Vec2 or a Number or b&a are not Number");
				}
				this.x -= b;
				this.y -= a;
				break;
			default : 
			assert.ok(true, "Vec2::sub(b,a), b is not a Vec2 or a Number or b&a are not Number");
		}

        return this;
    },
    /**
     * @member Vec2
     * @param {Vec2} b
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
				console.log(atype);
				console.log("??");
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
		assert.notEqual(["vec2", "number"].contains(btype), false, "Vec2::mul, b is not a Vec2 or a Number");
		
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
     * @param {Vec2} b
     * @returns Vec2 this
     */
    dot : function(b) {
		assert.notEqual(typeOf(b) == "vec2", false, "Vec2::dot, b is not a Vec2");

        return this.x * b.x + this.y * b.y;
    },
    /**
     * @member Vec2
     * @param {Vec2} b
     * @returns Vec2 this
     */
    length : function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },    
	/**
     * @member Vec2
     * @param {Vec2} b
     * @returns Vec2 this
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
	compare: function(vec2) {
		var comparison = '';
		comparison += vec2.x == this.x ? 'eq' : ( vec2.x < this.x ? 'gt' : 'lt' );
		comparison += vec2.y == this.y ? 'eq' : ( vec2.y < this.y ? 'gt' : 'lt' );
		return comparison;
	},
	gt: function() {
		return vec2.x > this.x && vec2.y > this.y;
	},
	lt: function() {
		return vec2.x < this.x && vec2.y < this.y;
	},
	eq: function() {
		return vec2.x == this.x && vec2.y == this.y;
	}
});


/**
 * @class Vec2
 */
var AABB2 = this.AABB2 = global.AABB2 = new Type('AABB2', function(object){
    if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 4) {
        var a = new Vec2(arguments[0], arguments[1]);
        var b = new Vec2(arguments[2], arguments[3]);

        this.set(a, b);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'aabb2') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});

AABB2.implement({
    min: null,
    max: null,
    set: function(a,b) {
        this.min = a;
        this.max = b;
    }
});


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
    rotate: function(angle) {

    },
    transform: function() {

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
    rotate: function(angle) {

    },
    scale: function(x,y) {

    },
    translate: function(x,y) {

    },
    transform: function() {

    }
});


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
    center: null,
    r: 0,
    set: function(center, r) {
        this.center = center.clone();
        this.r = r;
    }
});

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
	setTopLeft: function(vec2, normalize) {
		normalize = normalize | false;
		this.r1 = vec2;
		this.dirty = true;
		
		if(normalize) this.normalize();
		
	},
	setBottomRight: function(vec2) {
		normalize = normalize | false;
		this.r2 = vec2;
		this.dirty = true;
		
		if(normalize) this.normalize();
	},
	center: function() {
		return this.v1.clone().plus(this.v2).mul(0.5);
	},
	normalize: function(force) {
		force = (force | this.dirty) | false;
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