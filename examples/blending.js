require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "Blending Composite operations");

var canvas = win.getCanvas();

/**
* @type Image
*/
var image = Radamn.Assets.getImage("./resources/images/rock.png");

/**
* @type Font
*/
var font = Radamn.Assets.getFont("./resources/fonts/Jura-DemiBold.ttf", 12);

win.setBackgroundColor("#000000");

var node = win.getRootNode();

node.on("click", function(e) {
    console.log(e);
});


var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta);
	
	var key = null,
		i = 0;
	
	for(key in Radamn.$.BLENDING) {

		canvas.save();

		canvas.globalCompositeOperation = Radamn.$.BLENDING.SOURCE_OVER;
		canvas.translate(128 *(i%4), 128 * Math.floor(i/4));
		canvas.drawImage(image, 0, 0);
		canvas.translate(32, 32);
		canvas.globalCompositeOperation = Radamn.$.BLENDING[key];
		canvas.drawImage(image, 0, 0);
		canvas.translate(-32, -32);

		canvas.globalCompositeOperation = Radamn.$.BLENDING.SOURCE_OVER;
		canvas.restore();
		font.fill(canvas, Radamn.$.BLENDING[key], "#00FF00", 128 *(i%4), 128 * Math.floor(i/4));
		
		++i;
	}
	//process.exit();	
	
};

Radamn.listenInput(50);
Radamn.start(50);
