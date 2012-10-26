(function(exports, browser) {

    var fps,
        grid,
        __info = browser ? $.debug : require("node-class").debug;

    //var fps = require('./fps');
    //var grid = require('./grid');

exports.attachFPSCounter = function(window, xpos, ypos) {
    __info("[demo] display FPS");

    xpos = xpos || 0;
    ypos = ypos || 0;
    fps = new fps({
        font : "./resources/fonts/Jura-DemiBold.ttf"
        ,x: xpos
        ,y: ypos
    });

    var fpsnode = new Radamn.Node();
    fpsnode.appendEntity(fps);

    window.getRootNode().appendChild(fpsnode);
}


exports.attachGrid = function(window, options) {
    grid = new grid({});

    var gridnode = new Radamn.Node().appendEntity(grid);

    window.getRootNode().appendChild(gridnode);
}


exports.attachEscapeInputs = function(window) {

    Radamn.on("quit", function(e) {
        Radamn.quit();
    });

    Radamn.on("keydown", function(e) {
        if (e.char == "F5") {
            window.screenshot();
        } else if (e.char == "Escape") {
            Radamn.quit();
        }
    });
}

exports.demoWindow = function(width, height, caption, grid) {
    grid = grid || false;
    // visual test
    __info("[demo] create window");
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");

    __info("[demo] attaching ESC/F5/Close window:");
    exports.attachEscapeInputs(ctx.__win);

    if(grid) {
        __info("[demo] display grid");
        exports.attachGrid(ctx.__win, grid);
    }

    if(fps) {
        exports.attachFPSCounter(ctx.__win, 480, 0);
    }

    return ctx.__win;
}

})(typeof exports === "undefined" ? (this.demo = {}) : exports, typeof exports === "undefined");

