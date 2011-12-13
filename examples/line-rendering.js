/**
*	Line rendering test
*/
var Radamn = require('../radamn');

/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

// i leave it here but dont work for me.
win.setIcon(process.env.PWD+"/icon.bmp");
win.setCaption("caption!!", "caption!");


var canvas = win.getCanvas();

Radamn.addEvent("quit", function(e) {
    Radamn.quit();
});

Radamn.addEvent("keydown", function(e) {
    if (e.char == "F5") {
        win.screenshot();
    } else if (e.char == "Escape") {
        Radamn.quit();
    }
});

var fps = require(process.env.PWD+'/fps');
fps = new fps({
    font : process.env.PWD+"/Jura-DemiBold.ttf"
    ,x: 400
});

var fpsnode = new Radamn.Node();
fpsnode.appendEntity(fps);

win.getRootNode().appendChild(fpsnode);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
    // line test
    canvas.save();
        canvas.strokeStyle = "rgb(255,0,0)";
        canvas.lineWidth = 2;

		canvas.beginPath();
		//arcTo(0, 0, 10, 10, 5);
		canvas.arc(150, 150, 100, 0, 180, false);
		canvas.closePath();
		canvas.stroke();
		
        canvas.translate( 128, 128);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(50,0);
        canvas.lineTo(0,0);
        canvas.closePath();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(0,0);
        canvas.closePath();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.closePath();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(50,50);
        canvas.closePath();
        canvas.stroke();
    canvas.restore();
	
};

Radamn.listenInput(50);
Radamn.start(50);
