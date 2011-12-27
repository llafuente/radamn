/**
*	LOAD TMX isometric map
*/
require('./../lib/radamn');

/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

// i leave it here but dont work for me.
win.setIcon("./resources/images/icon.bmp");
win.setCaption("caption!!", "caption!");


var canvas = win.getCanvas();

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


var TMX = new Radamn.TMX("./resources/tmx/tmx-object-test.tmx", {
});

var tmxnode = new Radamn.Node();

tmxnode.appendEntity(TMX);
win.getRootNode().appendChild(tmxnode);
tmxnode.matrix.translate(-120, 0);

var fps = require('./fps');
fps = new fps({
    font : "./resources/fonts/Jura-DemiBold.ttf"
    ,x: 400
});

var fpsnode = new Radamn.Node();
fpsnode.appendEntity(fps);

win.getRootNode().appendChild(fpsnode);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
};

Radamn.listenInput(50);
Radamn.start(50);
