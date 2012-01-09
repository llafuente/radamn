require('./../lib/radamn');

require('./plugins/demo.js');

/**
* @type Window
*/
var win = demoWindow(640, 480, "TMX");

var canvas = win.getCanvas();

var TMX = new Radamn.TMX("./resources/tmx/tmx-orthogonal.tmx", {});

Radamn.addEvent("mousedown", function(e) {
	console.log(e);
	console.log(TMX.getTiles(
		Math.floor(e.x / TMX.getTileWidth()),
		Math.floor(e.y / TMX.getTileHeight())
	));
});

var tmxnode = new Radamn.Node();

tmxnode.appendEntity(TMX);
win.getRootNode().appendChild(tmxnode);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
};

Radamn.listenInput(50);
Radamn.start(50);
