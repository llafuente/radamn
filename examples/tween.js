require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "math");


var canvas = win.getCanvas();

/**
* @type Image
*/
var image = Radamn.Assets.getImage("./resources/images/rock.png");

var node = win.getRootNode();

node.addEvent("click", function(e) {
    console.log(e);
});


var childnode1 = new Radamn.Node();

childnode1.appendEntity(image);

node.appendChild(childnode1);

var childnode1_tween = new Fx.NodeTween(childnode1, {
    link: 'cancel',
    transition: 'bounce:out',
    duration: 1500,
    fps: 12
});

// chain! and morph!
childnode1_tween.start("x", 0, 250, false);
childnode1_tween.addEventOnce("complete", function() {
    childnode1_tween.start("y", 0, 200, false);
    childnode1_tween.addEventOnce("complete", function() {
        childnode1_tween.start("scale", "1 1", "2 2", false);
        childnode1_tween.addEventOnce("complete", function() {
            childnode1_tween.start("rotate", 0, 90, false);
            childnode1_tween.addEventOnce("complete", function() {
                childnode1_tween.start("skew", "0 0", "30 30", false);
            });
        });
    });
});

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
};

Radamn.listenInput(50);
Radamn.start(1000/50);
