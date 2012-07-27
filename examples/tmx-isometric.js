(function (exports, browser) {
    "use strict";

    if(!browser) {
        require('./../lib/radamn');
    }

    var idemo = browser ? demo : require('./plugins/demo.js');

    /**
    * @type Window
    */
    var win = idemo.demoWindow(640, 480, "TMX");


    var canvas = win.getContext();

    var TMX = new Radamn.TMX({
        tmx_file: "./resources/tmx/tmx-isometric.tmx",
        resource_path: {
            regex: /..\//,
            replace: "../examples/resources/"
        }
    });

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

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));