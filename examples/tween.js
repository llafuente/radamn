var Radamn = require('../radamn');

//var screen = module.exports.createScreen(640, 480, module.exports.$.INIT.OPENGL);
//segmentation fault on linux xD
/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

//console.log(CRadamn);
//console.log(CRadamn.getVersion());
//console.log(module.exports);

// i leave it here but dont work for me.
win.setIcon(process.env.PWD+"/icon.bmp");
win.setCaption("caption!!", "caption!");


var canvas = win.getCanvas();

/**
* @type Image
*/
var image = Radamn.Assets.getImage(process.env.PWD+"/rock.png");

Radamn.addEvent("quit", function(e) {
    Radamn.quit();
});

Radamn.addEvent("keydown", function(e) {
    if (e.char == "F5") {
        win.screenshot();
    } else if (e.char == "Escape") {
        Radamn.quit();
    }
});

Radamn.addEvent("mousedown", function(e) {
    // move to: e.x, e.y
});

var node = win.getRootNode();

node.addEvent("click", function(e) {
    console.log(e);
});


var childnode1 = new Radamn.Node();
console.log(childnode1);

childnode1.appendEntity(image);

node.appendChild(childnode1);

var childnode1_tween = new Fx.Tween(childnode1, {
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

    win.render();
};

Radamn.listenInput(50);
Radamn.start(250);
