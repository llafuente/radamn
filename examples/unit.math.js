/*
*	LOAD TMX isometric map
*/
var Radamn = require('../radamn');

/*
test case not fully ready need assets!
*/
var Vec2_origin = new Vec2(0,0);
var vec2_0_1 = new Vec2(0,1);
var vec2_1_1 = new Vec2(1,1);
var vec2_2_2 = new Vec2(2,2);
var vec2_5_5 = new Vec2(5,5);
var vec2_5_0 = new Vec2(5,0);
var vec2_m5_5 = new Vec2(-5,5);
var vec2_5_6 = new Vec2(5,6);

var vec2_7_7 = new Vec2(7,7);
var vec2_3_3 = new Vec2(3,3);

var vec2_10_10 = new Vec2(10,10);



var segment2_0_to_5 = new Segment2(Vec2_origin, vec2_5_5);
var line2_0_to_5 = new Line2(Vec2_origin, vec2_5_5);
var line2_m5_to_5 = new Line2(Vec2_origin, vec2_m5_5);
var line2_1_to_5 = new Line2(vec2_0_1, vec2_5_6);

var rect1 = new Rectangle(Vec2_origin, vec2_1_1);
var rect2 = new Rectangle(vec2_1_1, vec2_2_2);
var rect3 = new Rectangle(Vec2_origin, vec2_5_5);

var circle_vec2_5_5_r3 = new Circle(vec2_5_5, 30);
var circle_vec2_7_7_r3 = new Circle(vec2_7_7, 3);

var circle_vec2_5_5_r1 = new Circle(vec2_5_5, 1);
var circle_vec2_7_7_r1 = new Circle(vec2_7_7, 1);


//console.log(rect1);
//console.log(rect2);
//console.log("Rectangle 0,0-1,1 1,1-2,2 intersection",Math.intersection(rect1, rect2));
//console.log("Rectangle 1,1-2,2 0,0-5,5 intersection",Math.intersection(rect2, rect3));
//console.log("Rectangle 0,0-1,1 1,1-2,2 distance",Math.distance(rect1, rect2));

var segment_t1_1 = new Segment2(Vec2_origin, vec2_5_5);
var segment_t1_2 = new Segment2(vec2_5_5, vec2_5_0);

var segment_t2_1 = new Segment2(Vec2_origin, vec2_5_5);
var segment_t2_2 = new Segment2(vec2_2_2, vec2_5_0);


var segment1 = new Segment2(Vec2_origin, vec2_5_5);
var segment2 = new Segment2(vec2_1_1, vec2_5_5);

var segment3 = new Segment2(vec2_1_1, vec2_2_2);
var segment4 = new Segment2(vec2_3_3, vec2_5_5);

//console.log("Segment2 intersection line: ",Math.intersection(segment_t1_1, segment_t1_2));
//console.log("Segment2 intersection line: ",Math.intersection(segment_t2_1, segment_t2_2));
//console.log("Segment2 intersection line: ",Math.intersection(segment4, segment3));

console.log("Segment2 intersection line: ",Math.intersection(segment1, segment2));


console.log("vector typeof", typeOf(Vec2_origin));
console.log("segment typeof", typeOf(segment2_0_to_5));
console.log("line typeof", typeOf(line2_0_to_5));
console.log("circle typeof", typeOf(circle_vec2_5_5_r3));
console.log("rectangle typeof", typeOf(rect1));

console.log("---");

console.log("distance between points: 0,0 - 1,1 : ", Math.distance(Vec2_origin, vec2_1_1));
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
	Vec2_origin ,
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


// visual test
var win = Radamn.createWindow(640, 480);
win.setCaption("math", "math");
var canvas = win.getCanvas();

Radamn.addEvent("keydown", function(e) {
    if (e.char == "F5") {
        win.screenshot();
    } else if (e.char == "Escape") {
        Radamn.quit();
    }
});

Radamn.addEvent("quit", function(e) {
    Radamn.quit();
});

var node = null;
var collideNodeList = [];

//circle
var collision_test_circle = new Circle(new Vec2(0,0), 30);
collision_test_circle.drawOptions = {color: "rgb(0,0,255)"};
node = win.getRootNode().createNode();
collideNodeList.push(node);
node.matrix.translate(50,50);

node.appendEntity(collision_test_circle);
node.addToBody(collision_test_circle);


//rectangle
var collision_test_rect = new Rectangle(new Vec2(0,0), new Vec2(50,50));
collision_test_rect.drawOptions = {color: "rgb(0,0,255)"};
var node2 = win.getRootNode().createNode();
collideNodeList.push(node2);
node2.matrix.translate(150,50);

node2.appendEntity(collision_test_rect);
node2.addToBody(collision_test_rect);


//segment2
var collision_test_seg = new Segment2(new Vec2(0,0), new Vec2(50,50));
collision_test_seg.drawOptions = {style: "stroke", color: "rgb(255,255,255)", lineWidth: 1};
var node3 = win.getRootNode().createNode();
collideNodeList.push(node3);

node3.matrix.translate(100,100);

node3.appendEntity(collision_test_seg);
node3.addToBody(collision_test_seg);




var circle_fill_color = "rgb(0,0,255)";
//basic collision detections
Radamn.addEvent("mousemove", function(e) {
	var mousepos = new Vec2(e.x, e.y);
	
	for(var i =0,max=collideNodeList.length; i<max;++i) {
		var intersection = collideNodeList[i].collide(mousepos);
		//cheating a bit!
		
		var color = "rgb(255,255,255)";
		
		if(intersection.reason == "outside")
			color = "rgb(0,255,0)";
		if(intersection.reason == "inside")
			color = "rgb(0,0,255)";
		if(intersection.reason == "collide")
			color = "rgb(255,0,0)";
		
		if(["outside", "inside"].contains(intersection.reason) &&  intersection.distance && intersection.distance < 5) {
			color = "rgb(255,255,0)";
		}
		
		collideNodeList[i].childEntities[0].drawOptions.color = color;
		
		//console.log("mousemove", mousepos, intersection);
	}
}.maxFPS(1));


win.onRequestFrame = function(delta) {
	win.render(delta);

	/*
	canvas.translate(10, 10);
	//canvas.scale(50,50);	
	
	canvas.strokeStyle="rgb(255,0,0)";
	canvas.strokePrimitive(rect1);
	canvas.strokeStyle="rgb(255,255,0)";
	canvas.strokePrimitive(rect2);
	canvas.strokeStyle="rgb(255,255,255)";
	canvas.strokePrimitive(rect3);
	
	
	
	canvas.strokeStyle="rgb(128,128,128)";
	canvas.strokePrimitive(segment1);
	canvas.strokeStyle="rgb(255,255,255)";
	canvas.strokePrimitive(segment2);

	canvas.strokeStyle="rgb(255,0,0)";
	var inter = Math.intersection(segment1, segment2);
	console.log(segment4);
	console.log(segment3);
	console.log(inter);
	
	canvas.strokePrimitive(inter. segments[0]);
	*/
	
	//canvas.fillStyle = circle_fill_color;
	//canvas.fillPrimitive(circle_vec2_5_5_r3);
};

Radamn.listenInput(50);
Radamn.start(50);