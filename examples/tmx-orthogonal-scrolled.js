/**
*    LOAD TMX isometric map
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


var TMX = new Radamn.TMX("./resources/tmx/tmx-orthogonal-scrolled.tmx", {});

var tmxnode = new Radamn.Node();

var ParalaxBackground = require("./plugins/ParalaxBackground.js");
ParalaxBackground = new ParalaxBackground(tmxnode);

ParalaxBackground.push("./resources/images/sky_po2.png", 0.01);
ParalaxBackground.push("./resources/images/vegetation_po2.png", 1.25);



tmxnode.appendEntity(ParalaxBackground);

tmxnode.appendEntity(TMX);
win.getRootNode().appendChild(tmxnode);


var fps = require(process.env.PWD+'/fps');
fps = new fps({
    font : "./resources/fonts/Jura-DemiBold.ttf"
    ,x: 400
});

var fpsnode = new Radamn.Node();
fpsnode.appendEntity(fps);

win.getRootNode().appendChild(fpsnode);

//tmxnode.matrix.translate(-256, false);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
    tmxnode.matrix.translate(-(delta / 1000) * 100, false);
};

Radamn.listenInput(50);
Radamn.start(50);
