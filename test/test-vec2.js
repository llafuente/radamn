var path = require("path"),
    tap = require("tap"),
    test = tap.test;

require(path.resolve(__dirname, "../lib/radamn.js"));

test("Vector2", function(t) {
    var v = new Vec2();

    t.equal(v.x, 0);
    t.equal(v.y, 0);

    t.end();
});


test("Vector2.additions&zero", function(t) {
    var v = new Vec2();

    v.add(10, 10);
    t.equal(v.x, 10);
    t.equal(v.y, 10);

    v.add(10, 15);
    t.equal(v.x, 20);
    t.equal(v.y, 25);

    v.add(new Vec2(5,5));
    t.equal(v.x, 25);
    t.equal(v.y, 30);

    v.zero();
    t.equal(v.x, 0);
    t.equal(v.y, 0);
    t.end();
});


test("Vector2.subtractions", function(t) {
    var v = new Vec2();

    v.subtract(10, 10);
    t.equal(v.x, -10);
    t.equal(v.y, -10);

    v.subtract(10, 15);
    t.equal(v.x, -20);
    t.equal(v.y, -25);

    v.subtract(new Vec2(5,5));
    t.equal(v.x, -25);
    t.equal(v.y, -30);

    t.end();
});

test("Vector2.rotations", function(t) {
    var v = new Vec2(1, 0);
    v.rotate(Math.HALF_PI2); v.x = Math.round(v.x); v.y = Math.round(v.y);
    t.equal(v.x, 0);
    t.equal(v.y, 1);
    v.rotate(Math.HALF_PI2); v.x = Math.round(v.x); v.y = Math.round(v.y);
    t.equal(v.x, -1);
    t.equal(v.y, 0);
    v.rotate(Math.HALF_PI2); v.x = Math.round(v.x); v.y = Math.round(v.y);
    t.equal(v.x, 0);
    t.equal(v.y, -1);
    v.rotate(Math.HALF_PI2); v.x = Math.round(v.x); v.y = Math.round(v.y);
    t.equal(v.x, 1);
    t.equal(v.y, 0);


    t.end();
});
