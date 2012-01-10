require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "BOX2DWEB TMX");

var canvas = win.getCanvas();

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);

    // line test
    canvas.save();
        canvas.strokeStyle = "rgb(255,0,0)";
		canvas.fillStyle = "rgb(0,255,255)";
        canvas.lineWidth = 2;

		canvas.beginPath();
		canvas.moveTo(150,150);
		//arcTo(0, 0, 10, 10, 5);
		canvas.arc(150, 150, 100, 0, Math.PI2, false);
		canvas.closePath();
		canvas.fill();
		canvas.stroke();		

        canvas.translate( 128, 128);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(50,0);
        canvas.lineTo(0,0);
        canvas.closePath();
		canvas.fill();
        canvas.stroke();
		

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(0,0);
        canvas.closePath();
		canvas.fill();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.closePath();
		canvas.fill();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(50,50);
        canvas.closePath();
        canvas.stroke();
    canvas.restore();
	
};

Radamn.listenInput(50);
Radamn.start(1);
