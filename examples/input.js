require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "BOX2DWEB TMX");

var canvas = win.getCanvas();

/**
* @type Font
*/
var font = Radamn.Assets.getFont("./resources/fonts/Jura-DemiBold.ttf", 32);

var text="last key: ";
var last_key="";
Radamn.on("keydown", function(e) {
    if (e.char != "Escape") {
        // type
        last_key = "keydown / " + e.char + "("+ e.keyCode +")";
    }
});

Radamn.on("wheel", function(e) {
    console.log(e);
    last_key = "wheel event fired";
});
Radamn.on("wheelchange", function(e) {
    console.log(e);
    last_key = "wheelchange event fired";
});
Radamn.on("mousedown", function(e) {
    last_key = "mousedown event fired \n@("+e.x+","+e.y+")";
});

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    font.write(canvas, text + last_key, "rgb(0,255,0)", 50, 200);

    win.render();
};

Radamn.listenInput(50);
Radamn.start(50);