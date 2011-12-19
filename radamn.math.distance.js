/**
* @member Math
*/
Math.distance_4points = function(x1,y1,x2,y2) {
    var x = x1 - x2;
    var y = y1 - y2;

    return Math.sqrt(x*x + y*y);
};
/**
* @member Math
*/
Math.distance_circle_vs_circle = function(a,b) {
	var dist = Math.distance_vec2_vs_vec2(a.center, b.center);
    return Math.max(0, dist - a.r - b.r);
};
/**
* @member Math
*/
Math.distance_line2_vs_vec2 = function(line, point) {
	var segment ={
		x1 : line.x,
		y1 : line.y,
		x2 : line.x + line.m,
		y2 : line.y + line.m
	};

	var r_numerator = (segment.x1-segment.x2)*(point.x-segment.x2) + (segment.y1-segment.y2)*(point.y-segment.y2),
		r_denomenator = (point.x-segment.x2)*(point.x-segment.x2) + (point.y-segment.y2)*(point.y-segment.y2),
		r = r_denomenator === 0 ? 0 : (r_numerator / r_denomenator),
		//
		px = segment.x2 + r*(point.x-segment.x2),
		py = segment.y2 + r*(point.y-segment.y2),
		//     
		s =  ((segment.y2-segment.y1)*(point.x-segment.x2)-(segment.x2-segment.x1)*(point.y-segment.y2) ) / r_denomenator,
		distanceLine = Math.abs(s)*Math.sqrt(r_denomenator);
	
	return ( (r >= 0) && (r <= 1) ) ? 0 : distanceLine;
};
/**
* @member Math
*/
Math.distance_rectangle_vs_rectangle = function(rect1, rect2) {
	return rect1.center().sub(rect2.center());
};
/**
* @member Math
*/
Math.distance_segment2_vs_vec2 = function(segment, v2) {

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
/**
* @member Math
*/
Math.distance_vec2_vs_vec2 = function(a,b) {
    var x = a.x - b.x;
    var y = a.y - b.y;
    return Math.sqrt(x*x + y*y);
};