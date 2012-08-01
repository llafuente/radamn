var path = require("path"),
    tap = require("tap"),
    test = tap.test;

require(path.resolve(__dirname, "../lib/radamn.js"));

function near(a, b) {
    return a > b - Math.EPS && a < b + Math.EPS;
}

test("distance_4points", function(t) {

    t.equal(near(Math.distance_4points(0, 0, 2, 2), 2.8284271247461903), true, "4 points distance");
    t.end();
});

test("distance_circle_vs_circle", function(t) {
    var c1 = new Circle(0,0,5),
        c2 = new Circle(5,5,1);

    t.equal(near(Math.distance_circle_vs_circle(c1, c2), 1.0710678118654755), true, "4 points distance");
    t.end();
});

test("distance_line2_vs_vec2", function(t) {
    var v3 = new Vec2(5,6),
        l1 = new Line2(2, -4/3, 3);

    t.equal(near(Math.distance_line2_vs_vec2(l1, v3), 3), true, "Vec2 Line2 distance"); // should be: 3.328
    t.end();
});

test("distance_rectangle_vs_rectangle", function(t) {
    var r1 = new Rectangle(0,0,5,5),
        r2 = new Rectangle(10,10,15,15);

    t.equal(near(Math.distance_rectangle_vs_rectangle(r1, r2), 14.1421356237), true, "Rectangle Rectangle distance"); // should be: 3.328
    t.end();
});

test("distance_rectangle_vs_rectangle", function(t) {
    var v1 = new Vec2(0, 0),
        s1 = new Segment2(new Vec2(-1, 1), new Vec2(1, 1));


    t.equal(near(Math.distance_segment2_vs_vec2(s1, v1), 1), true, "Segment2 Vec2 distance"); // should be: 3.328
    t.end();
});


test("distance_rectangle_vs_rectangle", function(t) {
    var v1 = new Vec2(0, 0),
        r2 = new Rectangle(1,1,2,2);
    t.equal(near(Math.distance_rectangle_vs_vec2(r2, v1), 1.4142135623730951), true, "Rectangle Vec2 distance"); // should be: 3.328
    t.end();
});


test("distance_vec2_vs_vec2", function(t) {
    var v1 = new Vec2(0, 0),
        v2 = new Vec2(2, 2);

    t.equal(near(Math.distance_vec2_vs_vec2(v1, v2), 2.8284271247461903), true, "Vec2 Vec2 distance"); // should be: 3.328
    t.end();
});


test("fast_distance_vec2_vs_vec2", function(t) {
    var v1 = new Vec2(0, 0),
        v2 = new Vec2(2, 2);

    t.equal(near(Math.fast_distance_vec2_vs_vec2(v1, v2), 8), true, "Vec2 Vec2 distance (squared)"); // should be: 3.328
    t.end();
});
