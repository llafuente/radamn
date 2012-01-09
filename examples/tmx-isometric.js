require('./../lib/radamn');

require('./plugins/demo.js');

/**
* @type Window
*/
var win = demoWindow(640, 480, "TMX");


var canvas = win.getCanvas();

var TMX = new Radamn.TMX("./resources/tmx/tmx-isometric.tmx", {});

var tmxnode = new Radamn.Node();

tmxnode.appendEntity(TMX);
tmxnode.matrix.translate(250, 0);
win.getRootNode().appendChild(tmxnode);

/*
var fps = require('./fps');
fps = new fps({
    font : "./resources/fonts/Jura-DemiBold.ttf"
    ,x: 400
});

var fpsnode = new Radamn.Node();
fpsnode.appendEntity(fps);

win.getRootNode().appendChild(fpsnode);
*/
var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
};

Radamn.listenInput(50);
Radamn.start(50);
