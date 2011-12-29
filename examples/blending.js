require('./../lib/radamn');

//var screen = module.exports.createScreen(640, 480, module.exports.$.INIT.OPENGL);
//segmentation fault on linux xD
/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

//console.log(CRadamn);
//console.log(CRadamn.getVersion());
//console.log(module.exports);

// i leave it here but dont work for me.
win.setIcon("./resources/images/icon.bmp");
win.setCaption("caption!!", "caption!");


var canvas = win.getCanvas();

/**
* @type Image
*/
var image = Radamn.Assets.getImage("./resources/images/rock.png");

/**
* @type Font
*/
var font = Radamn.Assets.getFont("./resources/fonts/Jura-DemiBold.ttf", 12);

Radamn.addEvent("quit", function(e) {
    Radamn.quit();
});

win.setBackgroundColor("#000000");

var node = win.getRootNode();

node.addEvent("click", function(e) {
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
		font.write(canvas, Radamn.$.BLENDING[key], "#00FF00", 128 *(i%4), 128 * Math.floor(i/4));
		
		++i;
	}
	//process.exit();	
	
};

Radamn.listenInput(50);
Radamn.start(50);

/** resize in real time ! wtf! it should be another window... someday :)
var screen2 = module.exports.createScreen(480, 320, module.exports.$.INIT.OPENGL);
screen2.setCaption("caption2!!", "caption2!");
*/