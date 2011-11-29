/**
*	LOAD TMX isometric map
*/
var Radamn = require('../radamn');

/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

// i leave it here but dont work for me.
win.setIcon(process.env.PWD+"/icon.bmp");
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


var TMX = new Radamn.TMX(process.env.PWD+"/tmx-isometric.tmx", {
    offset: {
        x: false
    }
});

var tmxnode = new Radamn.Node();

tmxnode.appendEntity(TMX);
win.getRootNode().appendChild(tmxnode);


var fps = require(process.env.PWD+'/fps');
fps = new fps({
    font : process.env.PWD+"/Jura-DemiBold.ttf"
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
