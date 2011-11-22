var Radamn = require('../radamn');

/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);
win.setCaption("input test!", "input test!");

// i leave it here but dont work for me.
win.setIcon(process.env.PWD+"/icon.bmp");


var canvas = win.getCanvas();

/**
* @type Font
*/
var font = Radamn.Assets.getFont(process.env.PWD+"/Jura-DemiBold.ttf", 32);


Radamn.addEvent("quit", function(e) {
    Radamn.quit();
});

var text="last key: ";
var last_key="";
Radamn.addEvent("keydown", function(e) {
    if (e.char == "Escape") {
        Radamn.quit();
    } else {
        // type
        last_key = "keydown / " + e.char;
    }
});

Radamn.addEvent("wheel", function(e) {
    console.log(e);
    last_key = "wheel event fired";
});
Radamn.addEvent("wheelchange", function(e) {
    console.log(e);
    last_key = "wheelchange event fired";
});
Radamn.addEvent("mousedown", function(e) {
    last_key = "mousedown event fired \n@("+e.x+","+e.y+")";
});

win.setBackgroundColor("#000000");

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    font.write(canvas, text + last_key, "#00FF00", 50, 200);

    win.render();
};

Radamn.listenInput(50);
Radamn.start(50);