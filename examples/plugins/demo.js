var fps = require('./fps');
var grid = require('./grid');



module.exports.attachFPSCounter = function(window, xpos, ypos) {
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


module.exports.attachGrid = function(window, options) {
	grid = new grid({});

	var gridnode = new Radamn.Node().appendEntity(grid);

	window.getRootNode().appendChild(gridnode);
}


module.exports.attachEscapeInputs = function(window) {

	Radamn.addEvent("quit", function(e) {
		Radamn.quit();
	});
	
	Radamn.addEvent("keydown", function(e) {
		if (e.char == "F5") {
			window.screenshot();
		} else if (e.char == "Escape") {
			Radamn.quit();
		}
	});
}

module.exports.demoWindow = function(width, height, caption, grid) {
	grid = grid || false;
	// visual test
	console.log("demo/ create window");
	var win = Radamn.createWindow(640, 480);

	console.log("demo/ display FPS");
	module.exports.attachFPSCounter(win, 480, 0);

	console.log("demo/ attaching ESC/F5/Close window:");
	module.exports.attachEscapeInputs(win);
	
	console.log("demo/ set caption to: "+caption);
	win.setCaption(caption, caption);
	
	if(grid) {
		console.log("demo/ display grid");
		module.exports.attachGrid(win, grid);
	}
	
	return win;
}