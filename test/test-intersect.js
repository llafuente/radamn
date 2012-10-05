var path = require("path"),
    tap = require("tap"),
    test = tap.test;

require(path.resolve(__dirname, "../lib/radamn.js"));

function near(a, b) {
    return a > b - Math.EPS && a < b + Math.EPS;
}

test("intersection_circle_vs_circle", function(t) {
    var c1 = new Circle(0,0,5),
        c2 = new Circle(5,5,1),
        c3 = new Circle(2,2,5),
        c4 = new Circle(0,0,2);

    t.deepEqual(Math.intersection_circle_vs_circle(c1, c2),
        { success: false, reason: "outside" },
        "intersection_circle_vs_circle outside");

    t.deepEqual(Math.intersection_circle_vs_circle(c1, c4),
        { success: false, reason: "inside" },
        "intersection_circle_vs_circle inside");

    t.deepEqual(Math.intersection_circle_vs_circle(c1, c3),
        { success: true,
          reason: "collide",
          points: [ { x: 0.625, y: 1.375 }, { x: 1.375, y: 0.625 } ] },
        "intersection_circle_vs_circle intersects");

    t.end();
});

test("intersection_circle_vs_line2", function(t) {
    var c1 = new Circle(0, 0, 5),
        s1 = new Segment2(0, 0, 5, 5),
        s2 = new Segment2(0, 0, 1, 1),
        s3 = new Segment2(10, 10, 15, 15);

    t.deepEqual(Math.intersection_circle_vs_segment2(c1, s1),
        { success: true, reason: "collide", points: [ { x: 3.5355339059327378, y: 3.5355339059327378 } ] },
        "intersection_circle_vs_circle collide");

    t.deepEqual(Math.intersection_circle_vs_segment2(c1, s2),
        { success: false, reason: "inside" },
        "intersection_circle_vs_circle inside");

    t.deepEqual(Math.intersection_circle_vs_segment2(c1, s3),
        { success: false, reason: "outside" },
        "intersection_circle_vs_circle outside");
    t.end();
});

test("distance_rectangle_vs_rectangle", function(t) {
    var c1 = new Circle(0,0,5),
        v1 = new Vec2(3.5355339059327378, 3.5355339059327378),
        v2 = new Vec2(0, 0),
        v3 = new Vec2(10, 10);


    t.deepEqual(Math.intersection_circle_vs_vec2(c1, v1),
        { success: true, reason: "collide", points: [ { x: 3.5355339059327378, y: 3.5355339059327378 } ] },
        "intersection_circle_vs_vec2 collide");

    t.deepEqual(Math.intersection_circle_vs_vec2(c1, v2),
        { success: false, reason: "inside", distance: 5 },
        "intersection_circle_vs_vec2 inside");

    t.deepEqual(Math.intersection_circle_vs_vec2(c1, v3),
        { success: false, reason: "outside", distance: 9.142135623730951 },
        "intersection_circle_vs_vec2 outside");

    t.end();
});

test("distance_rectangle_vs_rectangle", function(t) {
    var l1 = new Line2(0, 0, 1),
        l2 = new Line2(0, 0, -1),
        l3 = new Line2(1, 1, -1),
        l4 = new Line2(5, 0, 1);

    t.deepEqual(Math.intersection_line2_vs_line2(l1, l2),
        { success: true, reason: 'collide', points: [ { x: 0, y: 0 } ] },
        "intersection_line2_vs_line2 collide");

    t.deepEqual(Math.intersection_line2_vs_line2(l1, l1),
        { success: false, reason: 'coincident' },
        "intersection_line2_vs_line2 coincident");

    t.deepEqual(Math.intersection_line2_vs_line2(l1, l4),
        { success: false, reason: 'parallel' },
        "intersection_line2_vs_line2 parallel");

    t.end();
});


test("distance_rectangle_vs_rectangle", function(t) {
    var s1 = new Segment2(0, 0, 5, 5)
        s2 = new Segment2(0.5, 0.5, 1.5, 1.5)
        p1 = new Polygon([0,0, 2,0, 2,2, 0,2]);

    t.deepEqual(Math.intersection_segment_vs_polygon(s1, p1),
        { success: true, reason: 'collide', points: [ { x: 0, y: 0 }, { x: 2, y: 2 } ] },
        "intersection_segment_vs_polygon collide");

    t.deepEqual(Math.intersection_segment_vs_polygon(s2, p1),
        { success: false, reason: 'no-intersection'},
        "intersection_segment_vs_polygon no collide");
    t.end();
});


test("intersection_rectangle_vs_rectangle", function(t) {
    var r1 = new Rectangle(0,0, 5,5),
        r2 = new Rectangle(1,1, 6,6),
        r3 = new Rectangle(1,1, 2,2),
        r4 = new Rectangle(6,6, 7,7);

    t.deepEqual(Math.intersection_rectangle_vs_rectangle(r1, r2),
        { success: true, reason: 'collide', points: [], lines: [] },
        "intersection_rectangle_vs_rectangle inside");

    t.deepEqual(Math.intersection_rectangle_vs_rectangle(r1, r3),
        { success: false, reason: 'inside' },
        "intersection_rectangle_vs_rectangle inside");

    t.deepEqual(Math.intersection_rectangle_vs_rectangle(r1, r4),
        { success: false, reason: 'outside' },
        "intersection_rectangle_vs_rectangle outside");

    t.end();
});

test("intersection_segment2_vs_vec2", function(t) {
    var s1 = new Segment2(0,0, 5,5),
        v1 = new Vec2(1,1),
        v2 = new Vec2(6,6),
        v3 = new Vec2(1,5);

    t.deepEqual(Math.intersection_segment2_vs_vec2(s1, v1),
        { success: true, reason: 'collide', points: [ { x: 1, y: 1 } ] },
        "intersection_segment2_vs_vec2 collide");

    t.deepEqual(Math.intersection_segment2_vs_vec2(s1, v2),
        { success: false, reason: 'outside', distance: 1.4142135623730951 },
        "intersection_segment2_vs_vec2 outside");

    t.deepEqual(Math.intersection_segment2_vs_vec2(s1, v3),
        { success: false, reason: 'outside', distance: 2.8284271247461903 },
        "intersection_segment2_vs_vec2 outside");

    t.end();
});


test("intersection_segment2_vs_vec2", function(t) {
    var s1 = new Segment2(0,0, 5,5),
        s2 = new Segment2(-1,-1, 6,6),
        s3 = new Segment2(2,0, -2,2),
        s4 = new Segment2(0,1, 5,6);

    t.deepEqual(Math.intersection_segment2_vs_segment2(s1, s2),
        { success: true, reason: 'coincident', points: [], segments: [{x1:0, y1:0, x2: 5, y2: 5}] },
        "intersection_segment2_vs_vec2 collide");

    t.deepEqual(Math.intersection_segment2_vs_segment2(s1, s3),
        { success: true, reason: 'collide', points: [{x: 0.6666666666666666, y: 0.6666666666666666}] },
        "intersection_segment2_vs_vec2 outside");

    t.deepEqual(Math.intersection_segment2_vs_segment2(s1, s4),
        { success: false, reason: 'parallel'},
        "intersection_segment2_vs_vec2 parallel");

    t.end();
});

/*
        ,
        ,
        ,
        ;


*/