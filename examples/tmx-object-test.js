require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "TMX");

var canvas = win.getContext();

var TMX = new Radamn.TMX("./resources/tmx/tmx-object-test.tmx", {
    resource_path: {
        regex: /..\//,
        replace: "../examples/resources/"
    }
});

var tmxnode = new Radamn.Node();

tmxnode.appendEntity(TMX);
win.getRootNode().appendChild(tmxnode);
tmxnode.translate(-120, 0);

win.getRootNode().appendChild(fpsnode);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
};

Radamn.start(50);
