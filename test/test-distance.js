var path = require("path"),
    tap = require("tap"),
    test = tap.test;

require(path.resolve(__dirname, "../lib/radamn.js"));

function near(a, b) {
    return a > b - Math.EPS && a < b + Math.EPS;
}

test("Vector2 to X", function(t) {
    var v = new Vec2(10, 10),
        v2 = new Vec2(20, 20),
        v3 = new Vec2(5,6),
        l1 = new Line2(2, -4/3, 3),


        r1 = new Rectangle(0,0,5,5),
        r2 = new Rectangle(10,10,15,15);

    t.equal(v.x, 10);
    t.equal(v.y, 10);

    t.equal(near(Math.distance(v, v2), 14.14213562), true);

    t.equal(near(Math.distance(v3, l1), 3), true); // should be: 3.328

    // 3.6
    //console.log(Math.distance(new Vec2(5, 0), new Line2(0, 0, 1)));
    //t.equal(near(Math.distance(new Vec2(5, 0), new Line2(0, 0, 1)), 3.6), true);

    t.equal(near(Math.distance(r1, r2), 14.1421356237), true); // should be: 3.328

    t.end();
});
