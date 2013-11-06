var path = require("path"),
    tap = require("tap"),
    test = tap.test,
    Rectangle = require("js-2dmath").Rectangle,
    scene,
    layer,
    node1,
    node2;

require("../lib/radamn.js");

function near(a, b) {
    return a > b - Math.EPS && a < b + Math.EPS;
}


console.log(Radamn.createScene);

scene = Radamn.createScene(480, 480);
layer = scene.createLayer("background", Radamn.Layer.CAMERA);
node1 = layer.rootNode.createNode("objec1");
node2 = layer.rootNode.createNode("objec2");

node1.addToBody(Rectangle.create(0,0,64,64));
node2.addToBody(Rectangle.create(0,0,64,64));

node1.position(0, 64);
node2.position(64, 64);

console.log("*******************************************");
Radamn.render();

console.log(node1.__wbody);
console.log(node2.__wbody);

console.log("*******************************************");
console.log("update root position");
layer.rootNode.position(0 , -64);

Radamn.render();

console.log("*******************************************");
console.log(node1.__wbody);
console.log(node2.__wbody);

console.log(scene.ray(32, 32));

process.exit();
test("distance_4points", function(t) {

    t.equal(near(Math.distance_4points(0, 0, 2, 2), 2.8284271247461903), true, "4 points distance");
    t.end();
});
