/**
inspiration
- http://love2d.org/wiki/Main_Page
- http://www.ogre3d.org the big render engine friendly monster

R.A.DAMN = render async damn!
RADAMN = real awful day after morning nap lol!
*/


(function(exports, browser) {
//"use strict"; mootools is not strict :S
var CRadamn = {}; // this allow us to not touch much code... for browsers

if(!browser) {
	// Radamn Cland, polute globals dont worry...
	CRadamn = global.CRadamn = require('./radamn.node');

	/**
	 * include mootools to have a proper class design
	 * also add this hack to keep keyboard compatibility :)
	 * @ignore
	 */
	var document;
	/**
	 * @ignore
	 */
	global.document = this.document = document = (function() {
		var events = null;
		return {
			addEvents: function(events) {

			},
			getEvents: function() {
				return events;
			},
			html : {
				style : {}
			},
			id: function(arg) { return arg; }
		}
	})();
	
	require('./mootools-core-1.4.3-server.js');
	require('./mootools-hash.js');
	require('./mootools-extensions.js');
	require('./mootools-extends-server.js');	
	require('./radamn.math.js');
}

/**
 * @class Radamn
 */
var Radamn = new Class(
/** @lends Radamn.prototype */
{
    Implements: [Options, Events],

    intervals : {
        render: null,
        input: null
    },
    /**
     * @field
     * @member Radamn
     * @type Array of Windows
     * @private
     */
    windows: [],
    /**
     * @field
     * @member Radamn
     * @type RadamnDefines
     * @public
     */
    $ : null,
    /**
     * @member Radamn
     * @constructs
     */
    initialize: function() {
    },
    /**
     * versions of each component
     * @member Radamn
     * @returns {Object}
     */
    getVersion: CRadamn.getVersion,
    /**
     * @member Radamn
     * @returns {Array} list of valid resolutions
     * @see Radamn.createScreen
     */
    getVideoModes: CRadamn.getVideoModes,
    /**
     * Create an OpenGL window and set and internal resolution (game) and external(window)
     * This only affects everything rendered inside the main loop
     * @TODO Think about OpenGL/ES(2)</p>
     * @member Radamn
     * @param {Number} internal_width
     * @param {Number} internal_height
     * @param {Number} width
     * @param {Number} height
     * @param {Number} options
     * @returns {Window}
     */
    createWindow: function(internal_width, internal_height, width, height) {
        width = width || internal_width;
        height = height || internal_height;

        var surface = CRadamn.createWindow(width, height);
        var window = new Radamn.Window(surface, width, height);

        this.windows.push(window);
        // this is how you hack the restriction of scaling the root node
        // this is done this way so YOU KNOW WHAT YOU ARE DOING!
        window.getRootNode().matrix = Matrix2D.scalingMatrix(width / internal_width, height / internal_height);

        //this.Input.addEvent("quit");
        return window;
    },
    /**
     * starts the render loop with a given delay in milisenconds
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    start: function(delay) {
        this.intervals.render = setInterval(this.__renderLoop.bind(this), delay);
    },
    /**
     * stops the render loop
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    stop: function() {
        clearInterval(this.intervals.render);
        this.intervals.render = null;
    },
    /**
     * stops the render loop
     * @member Radamn
     * @param {Number} delay miliseconds
     * @private
     */
    __renderLoop: function() {
        var i=0,max=this.windows.length;
        for(i=0; i<max; ++i) {
            var win = this.windows[i];
            //win.getRootNode().freeze();
            var canvas = win.getCanvas();
            var now = Date.now();
            canvas.save();
            //@native
            canvas.clear();

            //@browser
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(win.onRequestFrame)
                win.onRequestFrame(now - win.lastRenderDate);

            canvas.__flip();
            canvas.restore();
            win.lastRenderDate = now;
            //win.getRootNode().unfreeze();
        }
    },
    /**
     * starts listening the input with the given delay in milisenconds
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    listenInput: function(delay) {
        this.intervals.input = setInterval(this.__listenInputLoop.bind(this), delay);
    },
    /**
     * stop listening the input
     * @member Radamn
     * @param {Number} delay miliseconds
     */
    stopListeningInput: function() {
        clearInterval(this.intervals.input);
        this.intervals.input = null;
    },
    /**
     * listen loop
     * @member Radamn
     * @private
     */
    __listenInputLoop: function() {
        var data = null;
        while ((data = CRadamn.pollEvent()) !== false) {
            this.fireEvent(data.type, data);
        }
    },
    /**
     * destroy everything
     * - images
     * - fonts
     * - stop render loop
     * - stop listening input
     * - and send the quit to the cland
     * @member Radamn
     */
    quit: function() {
        Radamn.Assets.destroyAllImages();
        Radamn.Assets.destroyAllFonts();
        this.stop();
        this.stopListeningInput();
        CRadamn.quit();
    }
});

//
//*********************************************************************************
// Create Radamn object! polute globals dont worry...

if(browser) {
	exports.Radamn = new Radamn();
} else {

	CRadamn.init();
	Radamn = global.Radamn = exports = new Radamn();
	//
	//*********************************************************************************
	// Override some components that need to be inited after creation.	
	Radamn.$ = require("./radamn.$.js").$; //manually in the browser...
}

//
//*********************************************************************************
// Screen Object

/**
 * @member Radamn
 * @param {Function} render_function, it will take to params ctx, delta
 */
Radamn.createRenderable = function(render_function) {
    var rendereable = new Radamn.ResourceRendereable();
    rendereable.draw = render_function;
    return rendereable;
}

//
//*********************************************************************************
//

if(!browser) {

	/**
	 * @type Window
	 */
	Radamn.Window = require("./radamn.window.js").Window;
	/**
	 * @type Assets
	 */
	Radamn.Assets = require("./radamn.assets.js").Assets;
	/**
	 * @type Resource
	 */
	Radamn.Resource = require("./radamn.resource.js").Resource;
	/**
	 * @type ResourceRendereable
	 */
	Radamn.ResourceRendereable = require("./radamn.resource.rendereable.js").ResourceRendereable;
	/**
	 * @type Image
	 */
	Radamn.Image = require("./radamn.image.js").Image;
	/**
	 * @type Animation
	 */
	Radamn.Animation = require("./radamn.animation.js").Animation;
	/**
	 * @type Font
	 */
	Radamn.Font = require("./radamn.font.js").Font;
	/**
	 * @type Canvas
	 */
	Radamn.Canvas = require("./radamn.canvas.js").Canvas;
	/**
	 * @type node
	 */
	Radamn.Node = require("./radamn.node.js").Node;
	/**
	 * @type TMX
	 */
	Radamn.TMX = require("./radamn.tmx.js").TMX;
	/**
	 * @type Sound
	 */
	Radamn.Sound = require("./radamn.sound.js").Sound;
}


})(typeof exports === "undefined" ? this : exports, typeof exports === "undefined");