(function (exports, browser) {
    "use strict";

    if(!browser) {
        require('./../lib/radamn');
    }

    var __debug = browser ? $.debug : require("node-class").debug,
        demo = require("./plugins/demo.js"),
        /**
        * @type Window
        */
        win = demo.demoWindow(640, 480, "BOX2DWEB TMX"),
        canvas = win.getContext(),
        /**
        * @type Font
        */
        font = Radamn.Assets.getFont("./resources/fonts/Jura-DemiBold.ttf", 32),
        text="last key: ",
        last_key="",
        counter = 0;

    Radamn.on("keydown", function(e) {
        if (e.char != "Escape") {
            // type
            last_key = "keydown / " + e.char + "("+ e.keyCode +")";
        }
    });

    Radamn.on("wheel", function(e) {
        __debug(e);
        last_key = "wheel event fired";
    });

    Radamn.on("wheelchange", function(e) {
        __debug(e);
        last_key = "wheelchange event fired";
    });

    Radamn.on("mousedown", function(e) {
        last_key = "mousedown event fired \n@("+e.x+","+e.y+")";
    });

    win.onRequestFrame = function(delta) {
        ++counter;

        font.write(canvas, text + last_key, "rgb(0,255,0)", 50, 200);

        win.render();
    };

    Radamn.start(50);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));