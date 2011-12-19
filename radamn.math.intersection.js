/**
* @member Math
*/
Math.intersection_circle_vs_circle = function (acircle, bcircle) {
    var result,
		c1 = acircle.center,
		c2 = bcircle.center,
		r1 = acircle.r,
		r2 = bcircle.r,
		// Determine minimum and maximum radii where circles can intersect
		r_max = acircle.r + bcircle.r,
		r_min = Math.abs(acircle.r - bcircle.r),
		// Determine actual distance between circle circles
		c_dist = Math.distance(acircle.center, bcircle.center );

    if ( c_dist > r_max ) {
        result = { success: false, reason: "outside"};
    } else if ( c_dist < r_min ) {
        result = { success: false, reason: "inside"};
    } else {
        result = { success: true, points: []};

        var a = (r1*r1 - r2*r2 + c_dist*c_dist) / ( 2*c_dist ),
			h = Math.sqrt(r1*r1 - a*a),
			p = c1.lerp(c2, a/c_dist),
			b = h / c_dist;

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
/**
* @member Math
*/
Math.intersection_circle_vs_line2 = function (circle, line2) {
    var c = circle.center,
		a1 = new Vec2(line2.x1, line2.y1),
		a2 = new Vec2(line2.x2, line2.y2),
		result,
		a  = (a2.x - a1.x) * (a2.x - a1.x) +
             (a2.y - a1.y) * (a2.y - a1.y),
		b  = 2 * ( (a2.x - a1.x) * (a1.x - c.x) +
                   (a2.y - a1.y) * (a1.y - c.y) ),
		cc = c.x*c.x + c.y*c.y + a1.x*a1.x + a1.y*a1.y -
             2 * (c.x * a1.x + c.y * a1.y) - circle.r*circle.r,
		deter = b*b - 4*a*cc;

    if ( deter < 0 ) {
        result = { success: false, reason: "outside"};
    } else if ( deter == 0 ) {
        result = { success: false, reason: "tangent"};
        // NOTE: should calculate this point
    } else {
        var e  = Math.sqrt(deter),
			u1 = ( -b + e ) / ( 2*a ),
			u2 = ( -b - e ) / ( 2*a );

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
};
/**
* @member Math
*/
Math.intersection_circle_vs_rectangle = function (circle, rectangle) {
    var min        = rectangle.r1.clone().min(rectangle.r2),
		max        = rectangle.r1.clone().max(rectangle.r2),
		topRight   = new Vec2( max.x, min.y ),
		bottomLeft = new Vec2( min.x, max.y ),
		inter1 = Math.intersection_circle_vs_line2(circle.c, circle.r, min, topRight),
		inter2 = Math.intersection_circle_vs_line2(circle.c, circle.r, topRight, max),
		inter3 = Math.intersection_circle_vs_line2(circle.c, circle.r, max, bottomLeft),
		inter4 = Math.intersection_circle_vs_line2(circle.c, circle.r, bottomLeft, min),
		result = {success: true, points: []};

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
};
/**
* @member Math
*/
Math.intersection_circle_vs_vec2 = function (circle, vec2) {

	var distance_to_center = Math.distance_vec2_vec2(circle.center, vec2);
	
	if(distance_to_center == circle.r) {
		return {succes: true, points: [vec2]};
	} else if(distance_to_center < circle.r) {
		return {succes:false, reason: "inside"};
	}
	return {succes:false, reason: "outside"};
};
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
/**
* @member Math
*/
Math.intersection_line2_polygon = function(line2, vec2_list) {
    var result = {success: false, reason: "no-intersection"},
		i = 0;
		length = vec2_list.length;

    for (; i < length; ++i ) {
        var sg = new Segment2(vec2_list[i], vec2_list[(i+1) % length]),
			inter = Math.intersection_line2_vs_segment2(line2, sg);

        result.points.append(inter.points);
    }

    if ( result.points.length > 0 ) {
		result.success = true;
		delete result.reason;
	}

    return result;
};
/**
* @member Math
*/
Math.intersection_rectangle_vs_vec2 = function (rectangle, vec2) {

	rectangle.normalize();
	
	if (
		rectangle.r1.x < vec.x
		||
		rectangle.r2.x > vec.x
		||
		rectangle.r1.y < vec.y
		||
		rectangle.r2.y > vec.y
		) {
		return {succes:false, reason: "outside"};
	}

	if (
		(vec.x == rectangle.r1.x || vec.x == rectangle.r2.x)
		&&
		(vec.y == rectangle.r1.y || vec.x == rectangle.r2.y)
		) {
		return {succes: true, points: [vec2]};
	}
	
	return {succes:false, reason: "inside"};
};
/**
* @member Math
*/
Math.intersection_rectangle_vs_rectangle = function (rect1, rect2) {
	rect1.normalize();
	rect2.normalize();
	
	console.log("---");
	console.log(rect1);
	console.log(rect2);
	
	// r1 should be further left.
	if(rect2.x1 < rect1.x1) {
		var aux = rect2;
		rect2 = rect1;
		rect1 = rect2;
	}

	var outside = ( 
		rect1.v1.x > rect2.v2.x ||
		rect1.v2.x < rect2.v1.x ||
		rect1.v1.y < rect2.v2.y ||
		rect1.v2.y > rect2.v1.y 
    );
    if(outside) return {"success" : false, "reason" : "outside"};
	
	var inside = !( 
		rect1.v1.x < rect2.v1.x || rect2.v2.x < rect1.v2.x
        ||
		rect1.v1.y > rect2.v1.y || rect2.v2.y > rect1.v2.y
    );
    if(inside) return {"success" : false, "reason" : "inside"};
	
	var output = {"success" : true, "points" : [], "lines" : []};
	
	return output;
};
Math.intersection_segment2_vs_vec2 = function (seg, vec) {
	var dis = Math.distance(seg, vec);

	console.log(arguments);
	console.log("intersection_segment2_vs_vec2: ", dis);
	
	if(dis === 0) {
        return {
			success : true,
			points: [vec]
        };
	}
	
    return {
		success : false,
		"reason" : "outside",
    };

};
/**
* @member Math
*/
Math.intersection_segment2_vs_segment2 = function (asegment, bsegment) {
console.log(arguments);
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
		// check if the intersections is a line!
		var points = [];
		points.push(Math.intersection(new Vec2(asegment.x1,asegment.y1), bsegment));
		points.push(Math.intersection(new Vec2(asegment.x2,asegment.y2), bsegment));
		points.push(Math.intersection(new Vec2(bsegment.x1,bsegment.y1), asegment));
		points.push(Math.intersection(new Vec2(bsegment.x2,bsegment.y2), asegment));
		// now check those intersections, remove no intersections!
		var i=0,
			max = points.length,
		    minp = { distance: false, point: null},
			maxp = { distance: false, point: null};
		
		
		for(;i<max;++i) {
			if(points[i].success === false) {
				points.splice(i,1);
				--i;
				max = points.length;
				continue;
			}
			
			var dist = points[i].points[0].lengthSquared();
			
			if(minp.distance === false || minp.distance > dist) {
				minp.distance = dist;
				minp.point = points[i].points[0];
			}
	
			if(maxp.distance === false || minp.distance < dist) {
				maxp.distance = dist;
				maxp.point = points[i].points[0];
			}
		}
		
		if(points.length > 1) {
			//line intersection!
			return {
				success : true,
				reason : "coincident",
				points: [],
				segments: [new Segment2(minp.point, maxp.point)]
			};
		}

        return {
			success : true,
			reason : "coincident",
			points: [{
				x: (asegment.x1 + asegment.x2) * 0.5,
				y: (asegment.y1 + asegment.y2) * 0.5
			}]
        };
    }
    
    /* Are the line parallel */
    if (Math.abs(denom) < Math.EPS) {
        return output;
    }

    /* Is the intersection along the the segments */
    mua = numera / denom;
    mub = numerb / denom;
    if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
        return output;
    }
    output.success = true;
    output.points.push({
        x: asegment.x1 + mua * (asegment.x2 - asegment.x1),
        y: asegment.y1 + mua * (asegment.y2 - asegment.y1)
    });
    return output;
};