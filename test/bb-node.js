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

var img = new Radamn.Image();
img.surface = {
    width: 25,
    height: 25
};
/*
node1.appendEntity(img);
node1.position(50, 50);
*/
node2.appendEntity(img);
node2.position(100, 100);

node2.scale(2, 2);

console.log("****************************************");
console.log("root", layer.rootNode.getBoundingBox());
/*
console.log("node1", node1.getBoundingBox(), node1.getPosition());
console.log("node2", node2.getBoundingBox(), node2.getPosition());
*/
process.exit();

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
