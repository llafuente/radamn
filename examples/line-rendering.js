require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "Line Rendering");

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
		
		/*
		canvas.beginPath();
		canvas.arc(64, 64, 32, 0, Math.PI2, true);
		canvas.lineWidth = 1;
		canvas.strokeStyle = "#00FF00"; // line color
		canvas.stroke();
		
		canvas.beginPath();
		canvas.arc(64, 64, 48, 0, Math.PI2, true);
		canvas.lineWidth = 1;
		canvas.strokeStyle = "#00FF00"; // line color
		canvas.stroke();
		
		*/
		
		// http://www.html5canvastutorials.com/tutorials/html5-canvas-rounded-corners/
		var rectWidth = 200;
		var rectHeight = 100;
		var rectX = 640 / 2 - rectWidth / 2;
		var rectY = 480 / 2 - rectHeight / 2;
	 
		var cornerRadius = 50;
	 
		canvas.beginPath();
		canvas.moveTo(rectX, rectY);
		canvas.lineTo(rectX + rectWidth - cornerRadius, rectY);
		canvas.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, 
			rectY + cornerRadius, cornerRadius);
		canvas.lineTo(rectX + rectWidth, rectY + rectHeight);
	 
		canvas.lineWidth = 5;
		canvas.stroke();
		
		/*
		
		// https://developer.mozilla.org/samples/canvas-tutorial/2_3_canvas_lineto.html
		// Filled triangle
		canvas.beginPath();
		canvas.moveTo(25,25);
		canvas.lineTo(105,25);
		canvas.lineTo(25,105);
		canvas.fill();

		// Stroked triangle
		canvas.beginPath();
		canvas.moveTo(125,125);
		canvas.lineTo(125,45);
		canvas.lineTo(45,125);
		canvas.closePath();
		canvas.stroke();

		
		canvas.translate( 256, 0);
		canvas.beginPath();
		var centerX = 128;
		var centerY = 128;
		var radius = 75;
		var startingAngle = 1.1 * Math.PI;
		var endingAngle = 1.9 * Math.PI;
		var counterclockwise = false;
	 
		canvas.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
		canvas.lineWidth = 1;
		canvas.strokeStyle = "#00FF00"; // line color
		canvas.stroke();
		
        canvas.translate(-128, 64);
        canvas.beginPath();
		canvas.moveTo(0,0);
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(50,0);
        canvas.lineTo(0,0);
        canvas.stroke();
		
        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(50,0);
        canvas.lineTo(0,0);
        canvas.stroke();
		
		canvas.beginPath();
		canvas.moveTo(150,150);
		//arcTo(0, 0, 10, 10, 5);
		canvas.arc(150, 150, 100, 0, Math.PI2, false);
		canvas.closePath();
		canvas.fill();
		canvas.stroke();
		
		
        canvas.translate( 64, 0);
        canvas.beginPath();
		canvas.moveTo(0,0);
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(0,0);

		canvas.fill();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
		canvas.moveTo(0,0);
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
		canvas.fill();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
		canvas.moveTo(0,0);
        canvas.lineTo(50,50);
        canvas.stroke();
		*/
    canvas.restore();
	
};

Radamn.listenInput(50);
Radamn.start(1);
