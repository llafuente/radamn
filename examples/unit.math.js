/*
test case not fully ready need assets!
*/

var vec2_0_0 = new Vec2(0,0);
var vec2_0_1 = new Vec2(0,1);
var vec2_1_1 = new Vec2(1,1);
var vec2_5_5 = new Vec2(5,5);
var vec2_m5_5 = new Vec2(-5,5);
var vec2_5_6 = new Vec2(5,6);

var vec2_7_7 = new Vec2(7,7);
var vec2_3_3 = new Vec2(3,3);

var segment2_0_to_5 = new Segment2(vec2_0_0, vec2_5_5);
var line2_0_to_5 = new Line2(vec2_0_0, vec2_5_5);
var line2_m5_to_5 = new Line2(vec2_0_0, vec2_m5_5);
var line2_1_to_5 = new Line2(vec2_0_1, vec2_5_6);


var circle_vec2_5_5_r3 = new circle(vec2_5_5, 3);
var circle_vec2_7_7_r3 = new circle(vec2_7_7, 3);

var circle_vec2_5_5_r1 = new circle(vec2_5_5, 1);
var circle_vec2_7_7_r1 = new circle(vec2_7_7, 1);


console.log("vector typeof", typeOf(vec2_0_0));
console.log("segment typeof", typeOf(segment2_0_to_5));
console.log("line typeof", typeOf(line2_0_to_5));
console.log("circle typeof", typeOf(circle_vec2_5_5_r3));

console.log("---");

console.log("distance between points: 0,0 - 1,1 : ", Math.distance(vec2_0_0, vec2_1_1));
console.log("distance between segment: 0,0 - 5,5 to point 1,1 : ", Math.distance(segment2_0_to_5, vec2_1_1));
console.log("distance between line: 0,0 - 5,5 to point 1,1 : ", Math.distance(line2_0_to_5, vec2_1_1));
console.log("distance between points: 5,5 - 7,7 : ", Math.distance(vec2_5_5, vec2_7_7));
console.log("distance between circle 55r3 77r3 :",Math.distance(circle_vec2_5_5_r3, circle_vec2_7_7_r3));
console.log("distance between circle 55r1 77r1 :",Math.distance(circle_vec2_5_5_r1, circle_vec2_7_7_r1));

console.log("---");

console.log("circle 55r3 77r3 intersection",Math.intersection(circle_vec2_5_5_r3, circle_vec2_7_7_r3));
console.log("line 0,0-5,5 to 0,0--5,5 intersection",Math.intersection(line2_0_to_5, line2_m5_to_5));
console.log("line 0,0-5,5 to 0,1-5,6 intersection",Math.intersection(line2_0_to_5, line2_1_to_5));



var polygon = new Polygon([
	vec2_0_0 ,
	vec2_0_1 ,
	vec2_1_1 ,
	vec2_5_5 ,
	vec2_m5_5,
	vec2_5_6 ,
	vec2_7_7 ,
	vec2_3_3 
]);


console.log(typeOf(polygon));
console.log((polygon));


process.exit();

var zz = new AABB2(2,2,4,4);
console.log(typeOf(zz));


process.exit();

