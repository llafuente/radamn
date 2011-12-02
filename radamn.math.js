Math.EPS = 10e-3;

/**
 * @member Math
 */
Math.intersection_line2_vs_line2 =  function (aline, bline) {
    var a1 = new Vec2(aline.x, aline.y),
    a2 = a1.clone().plus(aline.m, 1), // XXX check! m,1 ??
    b1 = new Vec2(bline.x, bline.y),
    b2 = b1.clone().plus(bline.m, 1),
    result,
    ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
    ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
    u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    console.log("*************");
    console.log(a1);
    console.log(a2);
    console.log(b1);
    console.log(b2);

    console.log(u_b);
    console.log("*************");

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            result = {success: true, points: []};
            result.points.push(
                new Vec2(
                    a1.x + ua * (a2.x - a1.x),
                    a1.y + ua * (a2.y - a1.y)
                )
            );
        } else {
            result = {success: false, reason: "no-intersection"};
        }
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = {success: false, reason: "coincident"};
        } else {
            result = {success: false, reason: "parallel"};
        }
    }

    return result;

};

/*****
*
*   intersectLinePolygon
*
*****/
Math.intersect_line2_polygon = function(line2, vec2_list) {
    var result = {success: false, reason: "no-intersection"};

    var i = 0;
    var length = vec2_list.length;

    for (; i < length; ++i ) {
        var sg = new Segment2(vec2_list[i], vec2_list[(i+1) % length]);

        var inter = Math.intersection_line2_vs_segment2(line2, sg);

        result.points.append(inter.points);
    }

    if ( result.points.length > 0 ) result.success = true;

    return result;
};

// XXX could an alias ?
Math.intersection_line2_vs_segment2 = function (line, segment) {

};

Math.intersection_circle_vs_rectangle = function (circle, rectangle) {
    var min        = rectangle.r1.clone().min(rectangle.r2);
    var max        = rectangle.r1.clone().max(rectangle.r2);
    var topRight   = new Vec2( max.x, min.y );
    var bottomLeft = new Vec2( min.x, max.y );

    var inter1 = Math.intersection_circle_vs_line2(circle.c, circle.r, min, topRight);
    var inter2 = Math.intersection_circle_vs_line2(circle.c, circle.r, topRight, max);
    var inter3 = Math.intersection_circle_vs_line2(circle.c, circle.r, max, bottomLeft);
    var inter4 = Math.intersection_circle_vs_line2(circle.c, circle.r, bottomLeft, min);

    var result = {success: true, points: []};

    if(inter1.success) {
        points.points.append(inter1.points);
    }
    if(inter2.success) {
        points.points.append(inter2.points);
    }
    if(inter3.success) {
        points.points.append(inter3.points);
    }
    if(inter4.success) {
        points.points.append(inter4.points);
    }

    if(points.points.length == 0) {
        return {success: false, reason: "unkown"};
    }

    return result;
}
Math.intersection_circle_vs_line2 = function (circle, line2) {
    var c = circle.center;
    var a1 = new Vec2(line2.x1, line2.y1);
    var a2 = new Vec2(line2.x2, line2.y2);

    var result;
    var a  = (a2.x - a1.x) * (a2.x - a1.x) +
             (a2.y - a1.y) * (a2.y - a1.y);
    var b  = 2 * ( (a2.x - a1.x) * (a1.x - c.x) +
                   (a2.y - a1.y) * (a1.y - c.y)   );
    var cc = c.x*c.x + c.y*c.y + a1.x*a1.x + a1.y*a1.y -
             2 * (c.x * a1.x + c.y * a1.y) - circle.r*circle.r;
    var deter = b*b - 4*a*cc;

    if ( deter < 0 ) {
        result = { success: false, reason: "outside"};
    } else if ( deter == 0 ) {
        result = { success: false, reason: "tangent"};
        // NOTE: should calculate this point
    } else {
        var e  = Math.sqrt(deter);
        var u1 = ( -b + e ) / ( 2*a );
        var u2 = ( -b - e ) / ( 2*a );

        if ( (u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1) ) {
            if ( (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) ) {
                result = { success: false, reason: "outside"};
            } else {
                result = { success: false, reason: "inside"};
            }
        } else {
            result = { success: true, points: []};

            if ( 0 <= u1 && u1 <= 1) {
                result.points.push( a1.lerp(a2, u1) );
            }

            if ( 0 <= u2 && u2 <= 1) {
                result.points.push( a1.lerp(a2, u2) );
            }
        }
    }

    return result;
}
Math.intersection_cirle_vs_cirle = function (acircle, bcircle) {
    var result;

    var c1 = acircle.center;
    var c2 = bcircle.center;
    var r1 = acircle.r;
    var r2 = bcircle.r;

    // Determine minimum and maximum radii where circles can intersect
    var r_max = acircle.r + bcircle.r;
    var r_min = Math.abs(acircle.r - bcircle.r);


    // Determine actual distance between circle circles
    var c_dist = Math.distance(acircle.center, bcircle.center );
    //XXX

    if ( c_dist > r_max ) {
        result = { success: false, reason: "outside"};
    } else if ( c_dist < r_min ) {
        result = { success: false, reason: "inside"};
    } else {
        result = { success: true, points: []};

        var a = (r1*r1 - r2*r2 + c_dist*c_dist) / ( 2*c_dist );
        var h = Math.sqrt(r1*r1 - a*a);
        var p = c1.lerp(c2, a/c_dist);
        var b = h / c_dist;

        result.points.push(
            new Vec2(
                p.x - b * (c2.y - c1.y),
                p.y + b * (c2.x - c1.x)
            )
        );
        result.points.push(
            new Vec2(
                p.x + b * (c2.y - c1.y),
                p.y - b * (c2.x - c1.x)
            )
        );
    }

    return result;
}
Math.intersection_segment2_vs_segment2 = function (asegment, bsegment) {
       var mua,
       mub,
       denom,
       numera,
       numerb
       output = {success: false, points: []};

   denom  = (bsegment.y2-bsegment.y1) * (asegment.x2-asegment.x1) - (bsegment.x2-bsegment.x1) * (asegment.y2-asegment.y1);
   numera = (bsegment.x2-bsegment.x1) * (asegment.y1-bsegment.y1) - (bsegment.y2-bsegment.y1) * (asegment.x1-bsegment.x1);
   numerb = (asegment.x2-asegment.x1) * (asegment.y1-bsegment.y1) - (asegment.y2-asegment.y1) * (asegment.x1-bsegment.x1);

   /* Are the line coincident? */
   if (Math.abs(numera) < Math.EPS && Math.abs(numerb) < Math.EPS && Math.abs(denom) < Math.EPS) {
      output.sucess = true;
      output.points.push({
          x: (asegment.x1 + asegment.x2) / 2,
          y: (asegment.y1 + asegment.y2) / 2
      });

      return output;
   }

   /* Are the line parallel */
   if (Math.abs(denom) < EPS) {
       return output;
   }

   /* Is the intersection along the the segments */
   mua = numera / denom;
   mub = numerb / denom;
   if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
      return output;
   }
  output.sucess = true;
  output.points.push({
      x: asegment.x1 + mua * (asegment.x2 - asegment.x1),
      y: asegment.y1 + mua * (asegment.y2 - asegment.y1)
  });
  return output;
};
Math.distance_segment2_vs_point2 = function(segment, point) {
    var LineMag = segment.magnitude(),
    U = ( ( ( point.x - segment.x1 ) * ( segment.x2 -segment.x1 ) ) +
            ( ( point.y - segment.y1 ) * ( segment.y2 - segment.y1 ) )
            //+ ( ( Point->Z - LineStart->Z ) * ( LineEnd->Z - LineStart->Z ) ) )
    ) /
    ( LineMag * LineMag );

    if( U < 0.0 || U > 1.0 )
        return false;   // closest point does not fall within the line segment

    var line = new Line2(
            point.x, point.y,
            segment.x1 + U * ( segment.x2 - segment.x1 ),
            segment.y1 + U * ( segment.y2 - segment.y1 )
    );
    //Intersection.Z = LineStart->Z + U * ( LineEnd->Z - LineStart->Z );

    return line.magnitude();
};
Math.distance_segment2_vs_point2 = function(segment, point) {
    var LineMag = segment.magnitude(),
    U = ( ( ( point.x - segment.x1 ) * ( segment.x2 -segment.x1 ) ) +
        ( ( point.y - segment.y1 ) * ( segment.y2 - segment.y1 ) )
            //+ ( ( Point->Z - LineStart->Z ) * ( LineEnd->Z - LineStart->Z ) ) )
        ) /
        ( LineMag * LineMag );

    if( U < 0.0 || U > 1.0 )
        return false;   // closest point does not fall within the line segment

    var line = new Line2(
            point.x, point.y,
            segment.x1 + U * ( segment.x2 - segment.x1 ),
            segment.y1 + U * ( segment.y2 - segment.y1 )
            );
    //Intersection.Z = LineStart->Z + U * ( LineEnd->Z - LineStart->Z );

    return line.magnitude();
};
Math.distance_vec2_vs_vec2 = function(a,b) {
    var x = a.x - b.x;
    var y = a.y - b.y;

    return Math.sqrt(x*x + y*y);
};
Math.distance_4points = function(x1,y1,x2,y2) {
    var x = x1 - x2;
    var y = y1 - y2;

    return Math.sqrt(x*x + y*y);
};
Math.distance_segment_vs_vec2 = function(segment, v2) {

    var A = v2.x - segment.x1;
    var B = v2.y - segment.y1;
    var C = segment.x2 - segment.x1;
    var D = segment.y2 - segment.y1;
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = dot / len_sq;

    var xx,
    yy;
    if(param < 0) {
        xx = segment.x1;
        yy = segment.y1;
    }else if(param > 1) {
        xx = segment.x2;
        yy = segment.y2;
    } else {
        xx = segment.x1 + param * C;
        yy = segment.y1 + param * D;
    }

    return Math.distance_4points(v2.x, v2.y, xx, yy);
};

Math.distance_line2_vs_vec2 = function(line, v2) {
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    return Math.abs(A * D - C * B) / Math.sqrt(C * C + D * D);
};
Math.isParallel = function(a,b) {
    var types = [];
    types.push(typeOf(a));
    types.push(typeOf(b));
    types.sort();

    var fn = "parallel_"+types[0]+"_vs_"+types[1];

    if(this[fn] === undefined) throw new Exception(fn+" is not declared");

    return Math[fn](a,b);
};
Math.intersection = function(a,b){
    var types = [];
    types.push(typeOf(a));
    types.push(typeOf(b));
    types.sort();

    var fn = "intersection_"+types[0]+"_vs_"+types[1];

    console.log(fn);

    if(this[fn] === undefined) throw new Exception(fn+ " is not declared");

    return Math[fn](a,b);
};
Math.distance = function(a,b){
    var types = [];
    types.push(typeOf(a));
    types.push(typeOf(b));
    types.sort();

    var fn = "distance_"+types[0]+"_vs_"+types[1];

    if(this[fn] === undefined) throw new Exception(fn+" is not declared");

    return Math[fn](a,b);
};


/**
 * @class Vec2
 */
var Vec2 = this.Vec2 = new Type('Vec2', function(object){
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
    sub : function(b) {
        //Radamn.assert(typeOf(b) != "vec2", "Vec2::sub, b is not a Vec2");

        this.x -= b.x;
        this.y -= b.y;

        return this;
    },
    /**
     * @member Vec2
     * @param {Vec2} b
     * @returns Vec2 this
     */
    plus : function(b, a) {
        var btype = typeOf(b);
        var atype = typeOf(a);
/*
        Radamn.assert(
                btype != "vec2" ||
            (btype != "number" && atype != "number" )
        ,"Vec2::plus("+btype+") is not a Vec2 OR Vec2::plus("btype","+atype+") is not Numbers");
*/

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
    /**
     * @member Vec2
     * @param {Vec2|number} b
     * @returns Vec2 this
     */
    mul : function(factor) {
        var btype = typeOf(factor);
        Radamn.assert(["vec2", "number"].contains(btype), "Vec2::mul, b is not a Vec2 or a Number");
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
        Radamn.assert(typeOf(b) != "vec2", "Vec2::dot, b is not a Vec2");

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
    div : function(b) {
        Radamn.assert(typeOf(b) != "vec2", "Vec2::div, b is not a Vec2");

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
        Radamn.assert(typeOf(b) != "vec2", "Vec2::min, b is not a Vec2");

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
        Radamn.assert(typeOf(b) != "vec2", "Vec2::max, b is not a Vec2");

        this.x = this.x > b.x ? this.x : b.x;
        this.y = this.y > b.y ? this.y : b.y;

        return this;
    }
});


/**
 * @class Vec2
 */
var AABB2 = this.AABB2 = new Type('AABB2', function(object){
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


var Line2 = this.Line = new Type('Line2', function(object){
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
        if(arguments.length == 2) {
            console.log(arguments);
            //compute m
            this.x = x1.x;
            this.y = x1.y;

            this.m = this.magnitude(y1.x, y1.y);

            return this;
        }
        //compute m
        this.x = x;
        this.y = y;

        if(arguments.lenght == 4)
            this.m = this.magnitude(x2, y2);
        if(arguments.lenght == 3)
            this.m = x2;
        return this;

    },
    rotate: function(angle) {

    },
    transform: function() {

    },
    getParallel: function(d) {
        return new Line2(this.x1,this.x2, -1/m);
    },
    magnitude: function(x,y) {
        var _x = this.x - x;
        var _y = this.y - y;

        return Math.sqrt(_x * _x + _y * _y);
    },
});

var Segment2 = this.Segment = new Type('Segment2', function(){
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
    __m  : 0,
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
    magnitude: function() {
        var x = this.x2 - this.x1;
        var y = this.y2 - this.y1;

        return (this.__m = Math.sqrt(x * x + y * y));
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


var Cirle = this.Line = new Type('Cirle', function(object){
    if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
    else if(arguments.length == 1) {
        if (typeOf(object) == 'cirle') object = Object.clone(object.getClean());
        for (var key in object) this[key] = object[key];
    }
    return this;
});

Cirle.implement({
    center: null,
    r: 0,
    set: function(center, r) {
        this.center = center.clone();
        this.r = r;
    }
});

var Rectangle = this.Rectangle = new Type('Rectangle', function(){
    var object = null;

    console.log(arguments);

    if(arguments.length == 2) {
        this.set(arguments[0], arguments[1]);
    }
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
    r1 : 0,
    r2 : 0,
    set: function(r1,r2) {
        //compute m
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        return this;
    },
});
/*
 *
test case not ready...


var v55 = new Vec2(5,5);
var v77 = new Vec2(7,7);
var v33 = new Vec2(-1,3);

console.log(v55);
console.log(v77);
console.log(v33);


console.log("distance from 5,5 to 7,7: ", Math.distance(v77, v55));

var c1 = new Cirle(v55, 3);
var c2 = new Cirle(v77, 3);

console.log("circle intersection",Math.intersection(c1, c2));

var l1 = new Line2(v55, v77);
var l2 = new Line2(v55, v33);

console.log(l1);
console.log(l2);
console.log("line2 intersection", Math.intersection(l1, l2));



var segment = new Segment2(2,2,4,4);
console.log(typeOf(segment));

console.log("distance: ",
        Math.distance_segment_vs_vec2(segment, v55)
);

var zz = new AABB2(2,2,4,4);
console.log(typeOf(zz));


process.exit();



*/