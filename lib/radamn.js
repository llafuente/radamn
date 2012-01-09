//"use strict"; mootools is not strict :S
//"use strict"; mootools is not strict :S

var assert = require('assert');

// Radamn Cland, polute globals dont worry...
var CRadamn = global.CRadamn = require('./radamn.node');

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

require('./mootools-core-1.4.1-server');
require('./mootools-extends');
require('./radamn.math.js');

/**
inspiration
- http://love2d.org/wiki/Main_Page
- http://www.ogre3d.org the big render engine friendly monster

R.A.DAMN = render asynchonour damn!
RADAMN = real awful day after morning nap lol!
*/


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
        CRadamn.init();
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

Radamn = global.Radamn = module.exports = new Radamn();

//
//*********************************************************************************
// Override some components that need to be inited after creation.
/**
 * @exports Radamn.$ as RadamnDefines
 * @class RadamnDefines
 */
Radamn.$ = {
    // SDL
    /**
	 * @exports RadamnDefines.INIT as RadamnInitOptions
     * @class RadamnInitOptions
     */
    INIT : {
        /**
         * @member RadamnInitOptions
         * @type Number
        */
        SRCALPHA    : 0x00010000,
        SRCCOLORKEY : 0x00020000,
        ANYFORMAT   : 0x00100000,
        HWPALETTE   : 0x00200000,
        DOUBLEBUF   : 0x00400000,
        FULLSCREEN  : 0x00800000,
        RESIZABLE   : 0x01000000,
        NOFRAME     : 0x02000000,
        OPENGL      : 0x04000000,
    },
    /**
	 * @exports RadamnDefines.ALIGNS as RadamnAligns
     * @type RadamnAligns
     */
    ALIGNS : {
        /**
         * @member RadamnAligns
         */
        CENTER: 0,
        TOP_LEFT: 2,
        TOP_RIGHT: 4,
        BOTTOM_LEFT: 8,
        BOTTOM_RIGHT: 16,
        LEFT: 32,
        TOP: 64,
        RIGHT: 128,
        BOTTOM: 256
    },
    /**
	 * @exports RadamnDefines.BLENDING as RadamnBlendings
     * @class RadamnBlendings
     */
    BLENDING : {
        /**
		 * destination + source
         * @member RadamnBlendings
		 * @type String
         */
        SOURCE_OVER: "source-over",
        /**
		 * destination & source
         * @member RadamnBlendings
		 * @type String
         */
        SOURCE_IN: "source-in",
        /**
		 * source - destination
         * @member RadamnBlendings
		 * @type String
         */
        SOURCE_OUT: "source-out",
        /**
		 * destination + (source & destination)
         * @member RadamnBlendings
		 * @type String
         */
        SOURCE_ATOP: "source-atop",
        /**
		 * source + destination
         * @member RadamnBlendings
		 * @type String
         */
        DESTINATION_OVER: "destination-over",
        /**
		 * source & destination
         * @member RadamnBlendings
		 * @type String
         */
        DESTINATION_IN: "destination-in",
        /**
		 * destination - source
         * @member RadamnBlendings
		 * @type String
         */
        DESTINATION_OUT: "destination-out",
        /**
		 * source + (destination & source)
         * @member RadamnBlendings
		 * @type String
         */
        DESTINATION_ATOP: "destination-atop",
        //LIGTHER: "lighter",            // destination + source + lighter(source & destination)
        //DARKER: "darker",              // destination + source + darker(source & destination)
        /**
		 * source ^ destination
         * @member RadamnBlendings
		 * @type String
         */
        XOR : "xor",
        /**
		 * source
         * @member RadamnBlendings
		 * @type String
         */
        COPY: "copy"
    }
};

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

Radamn.CanvasGradient = new Class({
    name: "CanvasGradient",

    x0 : 0,
    y0 : 0,
    x1 : 0,
    y1 : 0,
    colors: [],
    /**
     * @member CanvasGradient
	 * @constructor
     */
    initialize: function(x0, y0, x1, y1) {
         this.x0 = x0;
         this.y0 = y0;
         this.x1 = x1;
         this.y1 = y1;
         // just save t
    },
    addColorStop: function(offset, color) {
        colors.push({
            offset : offset,
            color : color
        });
    },
});

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

