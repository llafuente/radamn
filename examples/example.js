var Radamn = require('../radamn');


//var screen = module.exports.createScreen(640, 480, module.exports.$.INIT.OPENGL);
//segmentation fault on linux xD
/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

//console.log(CRadamn);
//console.log(CRadamn.getVersion());
//console.log(module.exports);

win.setCaption("caption!!", "caption!");

var canvas = win.getCanvas();

/**
* @type Image
*/
var image = Radamn.Assets.getImage(process.env.PWD+"/rock.png");
/**
* @type Font
*/
var font = Radamn.Assets.getFont(process.env.PWD+"/Jura-DemiBold.ttf", 32);

/*
font_image.destroy();
delete this.font_image;
font.destroy();
delete this.font;
*/

function grid(win, size) {
    var x = Math.floor(win.width / size);
    var y = Math.floor(win.height / size);

    canvas.strokeStyle = "#FFFFFF";
    canvas.lineWidth = 1;

    for(i=0;i<x; ++i) {
        canvas.translate( size, 0);
        canvas.lineTo(0, win.height);
        canvas.stroke();
    }
    canvas.translate( -x*size, 0);
    for(i=0;i<y; ++i) {
        canvas.translate(0, size);
        canvas.lineTo(win.width, 0);
        canvas.stroke();
    }
    canvas.translate(0, -y*size);
}

win.setBackgroundColor("#000000");

var counter = 0;
win.onRequestFrame = function() {
    ++counter;

    grid(win, 32);

    // some draw test
    canvas.drawImage(image, 0, 0);
    /*
    canvas.translate( 128, 128);
    canvas.rotate(90);
    canvas.drawImage(image, 0, 0);

    canvas.translate( 256, 256);
    canvas.rotate(-90);
    canvas.scale(2,2);
    canvas.drawImage(image, 0, 0);
    */

    canvas.translate( 256, 256);
    canvas.strokeStyle = "#FF0000";
    canvas.lineWidth = counter;
    canvas.lineTo(150,-150);
    canvas.stroke();


    /*
    canvas.drawImage(image, 128, 128);
    canvas.rotate(45);
    canvas.drawImage(image, 128, 128, 32, 32);
    canvas.drawImage(image, 0, 0, 25, 25, 50, 50, 100, 100);
    canvas.rotate(-45);
    */

    /*
    image.__draw(win.getCanvas().getSurface(), 50, 50);

    var font_image = font.getImage("saved and then rendered", 0x8ae234);
    font_image.__draw(win.getCanvas().getSurface(), 0, 0);

    font.write(win.getCanvas().getSurface(), "direct text and free", 0x8ae234, 100, 50);
    */
};

Radamn.listenInput(50);
Radamn.start(1000);

/** resize in real time ! wtf! it should be another window... someday :)
var screen2 = module.exports.createScreen(480, 320, module.exports.$.INIT.OPENGL);
screen2.setCaption("caption2!!", "caption2!");
*/