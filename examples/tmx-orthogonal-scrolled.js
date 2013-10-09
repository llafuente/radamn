require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "TMX");

var canvas = win.getContext();

var TMX = new Radamn.TMX("./resources/tmx/tmx-orthogonal-scrolled.tmx", {
    resource_path: {
        regex: /..\//,
        replace: "../examples/resources/"
    }
});

var tmxnode = new Radamn.Node();

var ParalaxBackground = require("./plugins/ParalaxBackground.js");
ParalaxBackground = new ParalaxBackground(tmxnode);

ParalaxBackground.push("./resources/images/sky_po2.png", 0.01);
ParalaxBackground.push("./resources/images/vegetation_po2.png", 1.25);

tmxnode.appendEntity(ParalaxBackground);

tmxnode.appendEntity(TMX);
win.getRootNode().appendChild(tmxnode);

//tmxnode.translate(-256, false);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
    tmxnode.translate(-(delta / 1000) * 100, false);
};

Radamn.start(50);
