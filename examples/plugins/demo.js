(function(exports, browser) {

    if(!browser) {
        var fps = require('./fps');
        var grid = require('./grid');
    }

    var __info = browser ? $.debug : require("node-class").debug;


exports.attachFPSCounter = function(window, xpos, ypos) {
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
    var win = Radamn.createWindow(width, height);

    if(!browser) {
        __info("[demo] display FPS");
        exports.attachFPSCounter(win, 480, 0);
    }

    __info("[demo] attaching ESC/F5/Close window:");
    exports.attachEscapeInputs(win);

    __info("[demo] set caption to: "+caption);
    win.setCaption(caption, caption);

    if(grid) {
        __info("[demo] display grid");
        exports.attachGrid(win, grid);
    }

    return win;
}

})(typeof exports === "undefined" ? (this.demo = {}) : exports, typeof exports === "undefined");

