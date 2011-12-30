//"use strict"; mootools is not strict :S

var assert = require('assert');

// this move the JS to C realm
// executes Radamn::init and return into CRadamn
var CRadamn = global.CRadamn = require('./radamn.node');
// include mootools to have a proper class design
// also add this hack to keep keyboard compatibility :)
var document;

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

/***
//inspiration
//- http://love2d.org/wiki/Main_Page

R.A.DAMN = render asynchonour damn!


real
awful
day
after
morning
nap
 */

/**
 * @class Radamn
 */
var Radamn = global.Radamn = new Class({
    Implements: [Options, Events],

    intervals : {
        render: null,
        input: null
    },
    /**
     * @member Radamn
     * @type {Array} of Windows
     */
    windows: [],
    /**
     * @type RadamnDefines
     */
    $ : null,
    initialize: function() {
        CRadamn.init();
    },
    /**
     * versions of each component
     * @member Radamn
     * @returns {Object}
     */
    getVersion: function() {
        return {
            Radamn: "X.X",
            SDL: "X.X.X",
            SDL_image: "X.X.X",
            SDL_mixer: "X.X.X",
            libpng: "X.X.X"
        };
    },
    /**
     * TODO get it from c-land
     * @member Radamn
     * @returns {Array} list of valid resolutions
     * @see Radamn.createScreen
     */
    getWindowSizes: function() {
        return [{x: 480, y: 320}];
    },
    /**
     * Create an OpenGL window
     * TODO Think about OpenGL/ES(2)/Software
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
     * @member Radamn
     * @param {String} root
     * @returns {Boolean} true if valid path
     */
    setAppRootPath: function(root) {
        throw new Exception("todo");
    },
    /**
     * starts the render loop
     */
    start: function(delay) {
        this.intervals.render = setInterval(this.renderLoop.bind(this), delay);
    },
    stop: function() {
        clearInterval(this.intervals.render);
        this.intervals.render = null;
    },
    renderLoop: function() {
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
            canvas.flip();
            canvas.restore();
            win.lastRenderDate = now;
            //win.getRootNode().unfreeze();
        }
    },
    listenInput: function(delay) {
        this.intervals.input = setInterval(this.__listenInput.bind(this), delay);
    },
    stopListeningInput: function() {
        clearInterval(this.intervals.input);
        this.intervals.input = null;
    },
    __listenInput: function() {
        var data = null;
        while ((data = CRadamn.pollEvent()) !== false) {
            this.fireEvent(data.type, data);
        }
    },
    quit: function() {
        Radamn.Assets.destroyAllImages();
        this.stop();
        this.stopListeningInput();
        CRadamn.quit();
    },
    /**
     * @type Screen
     */
    Screen: null,
    /**
     * @type Assets
     */
    Assets: null,
    /**
     * @type Resource
     */
    Resource: null,
    /**
     * @type ResourcePlayable
     */
    ResourcePlayable: null,
    /**
     * @type RendereableResource
     */
    RendereableResource: null,
    /**
     * @type Animation
     */
    Animation: null,
    /**
     * @type AnimationSheet
     */
    AnimationSheet: null,
    /**
     * @type Font
     */
    Font: null,
    /**
     * @type Image
     */
    Image: null,
    /**
     * @type Sprite
     */
    Sprite: null,
    /**
     * @type Sound
     */
    Sound: null,
    /**
     * @type Sound
     */
    Node: null
});

//
//*********************************************************************************
// Create Radamn object!

Radamn = global.Radamn = module.exports = new Radamn();

//
//*********************************************************************************
// Override some components that need to be inited after creation.

Radamn.$ = {
    // SDL
    /**
     * @member RadamnDefines
     * @type RadamnInitOptions
     */
    INIT : {
        /**
         * @member RadamnInitOptions
         * @type {Number}
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
     * @member RadamnDefines
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
     * @member RadamnDefines
     * @type RadamnBlendings
     */
    BLENDING : {
        /**
         * @member RadamnBlendings
         */
        SOURCE_OVER: "source-over",       // destination + source
        SOURCE_IN: "source-in",           // destination & source
        SOURCE_OUT: "source-out",         // source - destination
        SOURCE_ATOP: "source-atop",       // destination + (source & destination)
        DESTINATION_OVER: "destination-over",  // source + destination
        DESTINATION_IN: "destination-in",      // source & destination
        DESTINATION_OUT: "destination-out",    // destination - source
        DESTINATION_ATOP: "destination-atop",  // source + (destination & source)
        //LIGTHER: "lighter",            // destination + source + lighter(source & destination)
        //DARKER: "darker",              // destination + source + darker(source & destination)
        XOR : "xor",                   // source ^ destination
        COPY: "copy"                   //    source
    }
};

//
//*********************************************************************************
// Screen Object

/**
 * @class Window
 */
Radamn.Window = new Class({
    /**
     * @member Window
     * @type {Number}
     */
    id: null,
    /**
     * @member Window
     * @type {Number}
     */
    width: null,
    /**
     * @member Window
     * @type {Number}
     */
    height: null,
    /**
     * @member Window
     * @type {Canvas}
     */
	__canvas: null,
    /**
     * @member Window
     * @type {Function}
     */
    onRequestFrame: null, // buffer flip
    /**
     * @member Window
     * @type {Function}
     */
    enterFrame: null,
    /**
     * @member Window
     * @type {Function}
     */
    leaveFrame: null,
    /**
     * this call render but no now in 1ms
     * @param {Number} fps false means: as fast as possible!!!
     */
    start: function(fps) {
        this.running = true;

        window.requestAnimationFrame(this.bound.renderLoop);
    },
	/**
	 * is quad viewable, give the coords in screen position!
	 */
    isQuadVisible: function(x,y,w,h, id) {
		//console.log(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
		return x + w > 0 && x < this.width && y < this.height && y + h > 0;
    },
    /**
	 * @see Window.render
     * @private
     */
    __renderNode: function(ctx, node, delta, fnbefore, fnafter) {
        ctx.save();
        node.matrix.applyToCanvas(ctx);
		
		if(fnbefore) {
			fnbefore(ctx, delta);
		}
		
        var i =0;
        for(;i<node.childEntities.length; ++i) {
            node.childEntities[i].draw(ctx, delta);
        }
        i =0;
        for(;i<node.childNodes.length; ++i) {
            this.__renderNode(ctx, node.childNodes[i], delta, null, null);
        }
		
		if(fnafter) {
			fnafter(ctx, delta);
		}
		
        ctx.restore();
    },
    /**
     * @member Window
     * @param {Number} delta
     * @param {Function} fnbefore exec before render any node
     * @param {Function} fnafter exec before render any node
     * @type {Function}
     */
    render: function(delta, fnbefore, fnafter) {
        this.__renderNode(this.getCanvas(), this.rootNode, delta, fnbefore || null, fnafter || null);
		//console.log("-------");
    },
    ray: function(x,y) {
        return [this.rootNode];
    },
    /**
     * @member Window
     * @param {Number} id
     * @param {Canvas} canvas
     */
    initialize: function(SDL_Surface, width, height) {
        this.surface = SDL_Surface;
        this.width = width;
        this.height = height;
        this.lastRenderDate = Date.now();

        this.rootNode = new Radamn.Node();
        this.rootNode.isRoot = function() {
            return true;
        };
        this.rootNode.scale = function() {
            throw new Error("scaling root node is not allowed!");
        };
        this.rootNode.setScale = function() {
            throw new Error("scaling root node is not allowed!");
        };

        return this;
    },
    /**
     * @member Window
     * @param {String} caption
     * @returns {Boolean}
     */
    setCaption: CRadamn.Window.setCaption,
    /**
     * @member Window
     * @return Canvas
     */
    getCanvas: function() {
		if(this.__canvas === null) {
			this.__canvas = new Radamn.Canvas(this.surface, this);
		}
        return this.__canvas;
    },
    /**
     * @member Window
     * @params {Image} image
     * @returns {Boolean}
     */
    setIcon: CRadamn.Window.setIcon,
    /**
     * @member Window
     * @params {Number} color Uint32 Color
     * @returns {Screen}
     */
    setBackgroundColor: function(color) {
        CRadamn.Window.setBackgroundColor(color);
    },
    /**
     * @member Window
     * @params {Image} image
     * @returns {Screen}
     */
    setBackgroundImage: function(image) {},
    /**
     * @member Window
     * @params {Image} image
     * @returns {Screen}
     */
    isFullscreen: function() {},
    /**
     * @member Window
     * @params {Boolean} full
     * @returns {Boolean}
     */
    setFullscreen: function(full) {},
    /**
     * @member Window
     * @params {Boolean} win
     * @returns {Boolean}
     */
    setWindowed: function(win) {},
    /**
     * @member Window
     * @returns {Boolean}
     */
    toggleFullscreen: function() {},
    /**
     * @member Window
     * @returns {Node}
     */
    getRootNode: function() {
        return this.rootNode;
    },
    /**
     * clear to transparent
     */
    screenshot: function() {
        CRadamn.Window.screenshot(this);
    },
    addEvents: {}
    // all canvas operations!
});
//
//*********************************************************************************
//
(function() {
	var path = require('path');
	var __pathlist = [];
	
	function resolve(file, callback) {
		var i = 0,
			max = __pathlist.length;
		for(;i<max; ++i) {
			path.exits(__pathlist[i] + file, function(exists) {
				if (exists) callback();
			});
		}
	}
	

/**
 * @class Assets
 */
Radamn.Assets = new Class({
	__imagePaths : null,
    __images : null,
    __fonts : null,
    initialize: function() {
        this.__images = new Hash();
        this.__fonts = new Hash();
    },
    /**
     * @member Assets
     */
    pushPath: function(path) {
        this.__pathlist.push(path);
    },
    /**
     * @member Assets
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Sprite}
     */
    getSprite: function(path, zipfile) {

    },
    /**
     * @member Assets
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {AnimationSheet}
     */
    getAnimationSheet: function(path, zipfile) {

    },
    /**
     * @member Assets
     * @private
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Image}
     */
    __getImage: function(path, zipfile) {
        zipfile = zipfile || null;

        var image_pointer = null;

        if((image_pointer = this.__images.get(path)) !== null) {
            return image_pointer;
        }

        image_pointer = CRadamn.Image.load(path);
        image_pointer.path = path;
        this.__images.set(path, image_pointer);


        return image_pointer;

    },
    /**
     * @member Assets
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Image}
     */
    getImage: function(path, zipfile) {
        zipfile = zipfile || null;

        var image_pointer = this.__getImage(path, zipfile);

        return new Radamn.Image(image_pointer);
    },
    /**
     * @member Assets
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Image}
     */
    getAnimation: function(path, path_to_cfg_or_object, zipfile) {
        zipfile = zipfile || null;

        var options = {};
        if(typeOf(path_to_cfg_or_object) == "string") {
            // TODO: get the file! and parse the JSON
        } else {
            options = path_to_cfg_or_object;
        }

        var image_pointer = this.__getImage(path, zipfile);

        return new Radamn.Animation(image_pointer, path_to_cfg_or_object);
    },
    /**
     * @member Assets
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Sound}
     */
    getSound: function(path, zipfile) {

    },
    /**
     * @member Assets
     * @private
     * @params {String} path
     * @params {Number} path
     * @params {String} zipfile (optional)
     * @returns {Font}
     */
    __getFont: function(path, size, zipfile) {
        var font_pointer = null;
        var key = path+":"+size;

        if((font_pointer = this.__fonts.get(key)) !== null) {
            return font_pointer;
        }

        var font_pointer = CRadamn.Font.load(path, size);
        font_pointer.path = path;
        font_pointer.size = size;
        return font_pointer;
    },
    /**
     * @member Assets
     * @params {String} path
     * @params {Number} path
     * @params {String} zipfile (optional)
     * @returns {Font}
     */
    getFont: function(path, size, zipfile) {
        zipfile = zipfile || null;

        var font_pointer = this.__getFont(path, size, zipfile);

        return new Radamn.Font(font_pointer);
    },
    /**
     * @member Assets
     * @params {String} path
     * @returns {Zip}
     */
    getZip: function(path) {

    },
    /**
     * @member Assets
     * @params {String} path
     * @returns {Zip}
     */
    destroy: function(resource) {
        switch(resource.__type) {
        case 'Image' :
            CRadamn.Image.destroy(resource.pointer);
            this.__images.erase(resource.pointer.path);
        break;
        case 'Font' :
            CRadamn.Font.destroy(resource.pointer);
            this.__fonts.erase(resource.pointer.path + ":" + resource.pointer.size);
        break;
        }
    },
    destroyAllImages: function() {
        this.__images.forEach(function(v,k) {
            CRadamn.Image.destroy(v);
        });
        this.__images.empty();
    },
    destroyAllFont: function() {
        this.__fonts.forEach(function(v,k) {
            CRadamn.Font.destroy(v);
        });
        this.__fonts.empty();
    }
    /**
     * @member Assets
     */
    // remove!

});

})();

Radamn.Assets = new Radamn.Assets();

//
//*********************************************************************************
//

/**
 * @class Resource
 */
Radamn.Resource  = new Class({
    Implements: [Options, Events],

    /**
     * @private
     */
    __id: '',
    /**
     * @public
     * @type {String}
     */
    __type: '',

    options: {

    },
    /**
     * @member Resource
     */
    initialize: function(options) {
        this.setOptions(options);
    },
    /**
     *
     */
    destroy: function() {
        this.fireEvent("beforedestroy", [this]);
        Radamn.Assets.destroy(this);
    },
    /**
     *
     */
    serialize: function() {
        return {
            id: this.__id,
            type: this.__type,
            options: this.options
        };
    }, //export

    events: ["beforedestroy"]
});

/**
 * @class RendereableResource
 * @super Resource
 */
Radamn.RendereableResource = new Class({
    Extends: Radamn.Resource,
    /**
     * @member RendereableResource
     * @private
     * @type {Node}
     */
    parentNode: null,
    /**
     * @member RendereableResource
     * @private
     * @type {PointerToSurface}
     */
    pointer: null,

    /**
     * @member RendereableResource
     * @param {Blending} blendmode
     * @returns {Boolean}
     */
    setBlendMode: function(blendmode) {

    },
    /**
     * @member RendereableResource
     * @param {Blending} blendmode
     * @returns {Node}
     */
    getParentNode: function() {
        return this.parentNode;
    },
    /**
     * @member RendereableResource
     * @param {Number} r
     * @param {Number} g
     * @param {Number} b
     * @param {Number} a
     * @returns {Boolean}
     */
    setAlphaColor: function(r,g,b,a) {
        return "<boolean>";
    },

    /**
     * @member RendereableResource
     * @private
     * @param {TransformationMatrix} tmatrix
     * @returns {Boolean}
     */
    __draw: function(screen, x, y) {
        return CRadamn.Image.draw(this.pointer, screen.globalCompositeOperation, x, y);
    },
    /**
     * @member RendereableResource
     * @private
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    __drawAt: function(x,y) {
        return "<boolean>";
    },
    /**
     * draw resized
     * @member RendereableResource
     * @private
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {Boolean}
     */
    __drawIn: function(x,y, width, height) {
        return "<boolean>";
    },

    initialize: function(pointer_to_surface, options) {
        this.parent(options);
        this.pointer = pointer_to_surface;
        this.__type = "RendereableResource";
    },

    events: ["moved", "rotated", "scaled"]
});

Radamn.createRenderable = function(render_function) {
    var rendereable = new Radamn.RendereableResource();
    rendereable.draw = render_function;
    return rendereable;
}

/**
 * @class Image
 * @super RendereableResource
 */
Radamn.Image = new Class({
    Extends: Radamn.RendereableResource,
    /**
     * @member Image
     * @retuns {String}
     */
    id: '',
    /**
     * @member Image
     * @retuns {Number}
     */
    width: 0,
    /**
     * @member Image
     * @retuns {Number}
     */
    height: 0,
    /**
     * @member Image
     * @retuns {String}
     */
    fotmat: '',

    initialize: function(pointer_to_surface, options) {
        this.parent(pointer_to_surface, options);
		this.width = pointer_to_surface.width;
		this.height = pointer_to_surface.height;
        this.__type = "Image";
    },
    draw: function(ctx) {
        this.__draw(ctx, 0, 0);
    }
});
/***
 * @class Animation
 * @super Image
 */
Radamn.Animation = new Class({
    Extends: Radamn.Image,
    /**
     * @member Animation
     * @type Number
     */
    frame: 0,
    /**
     * @member Animation
     * @type Boolean
     */
    stopped: true,
    /**
     * @member Animation
     * @type Boolean
     */
    remaining_times: false,
    changeImageEvery: 0,
    actumulatedTime: 0,
    options: {
        animation: [],
        loop: false,
        fps: 12
    },
    initialize: function(pointer_to_surface, options) {
        this.parent(pointer_to_surface, options);
        this.changeImageEvery = (1 / this.options.fps) * 1000;
    },
    /**
     *
     * @param {boolean} loop_or_times
     * * true loop
     * * false no loop
     * * {Number} loop x times
     */
    play: function(loop_or_times) {
        if(loop_or_times === true) { this.remaining_times = false; this.options.loop = true;}
        else if(loop_or_times === false) { this.remaining_times = false; this.options.loop = false;}
        else if(loop_or_times !== undefined) {
            this.options.loop = true;
            this.remaining_times = parseInt(loop_or_times, 10);
        }
        this.stopped = false;
    },
    stop:function() {
        this.stopped = true;
    },
    draw: function(ctx, delta) {
        this.actumulatedTime +=delta;
        /* this is for nodes
        switch(this.options.origin) {
            case $D.ORIGIN_CENTER:
                ctx.translate(-this.options.width * 0.5, -this.options.height* 0.5);
                ctx.drawImage(this.imgEl, this.options.animation[this.frame].x, this.options.animation[this.frame].y, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height);
                break;
            case ORIGIN_TOP_LEFT:
                ctx.drawImage(this.imgEl, this.options.animation[this.frame].x, this.options.animation[this.frame].y, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height);
                break;
        }
        */

        ctx.drawImage(this,
            this.options.animation[this.frame][0],
            this.options.animation[this.frame][1],
            this.options.animation[this.frame][2],
            this.options.animation[this.frame][3],
            0,
            0,
            this.options.animation[this.frame][2],
            this.options.animation[this.frame][3]
        );

        if(this.stopped) return ;
        if(this.actumulatedTime > this.changeImageEvery) {
            this.frame += Math.floor(this.actumulatedTime / this.changeImageEvery);
            this.actumulatedTime = this.actumulatedTime % this.changeImageEvery;

            if(this.frame >= this.options.animation.length) {
                this.frame = 0;
                if(this.options.loop === false) this.stopped = true;
                if(this.remaining_times !== false) {
                    --this.remaining_times;
                    if(this.remaining_times == 0) {
                        this.stopped = true;
                    }
                }
            }
        }
    }
});

/**
 * @class Font
 */
Radamn.Font = new Class({
    Extends: Radamn.Resource,
    pointer: null,
    initialize: function(font_pointer, options) {
        this.parent(options);
        this.pointer = font_pointer;
        this.__type = "Font";
    },
    /**
     * TODO: manage quit event -> destroy all images created if possible!
     * @member Font
     * @param {String} text
     * @returns {Image}
     */
    getImage: function(text, color) {
        var surface = CRadamn.Font.getImage(this.pointer, text, color);
        return new Radamn.Image(surface);
    },
    /**
     * @member Font
     * @param {String} text
     * @param {Number} x
     * @param {Number} y
     * @returns {Boolean}
     */
    write: function(canvas, text, color, x, y) {
        var surface = CRadamn.Font.getImage(this.pointer, text, color);
        var image = new Radamn.Image(surface);
        image.__draw(canvas, x, y);
        image.destroy();
        return this;
    }
});

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
Radamn.Canvas = new Class({
    __window : null,
    pointer: null,
    /**
     * @type {Number} color
     */
    strokeStyle: "#000000",
    fillStyle: "#000000",
    shadowOffsetX: 0,/* not supported yet */
    shadowOffsetY: 0,/* not supported yet */
    shadowBlur: 0,/* not supported yet */
    shadowColor: 'transparent black', /* not supported yet */
    lineWidth: 1,
	globalCompositeOperation: "source-over",
    __paths: [],
    /**
     * references:
     * http://dminator.blogspot.com/2007/11/line-cap-calculation.html
     * round
     * square
     */
    lineCap: 'butt', /* not supported yet */
    /**
     * round
     * bevel
     *
     */
    lineJoin: 'miter', /* not supported yet */
    miterLimit: 10, /* not supported yet */

    /**
     * @deprecated
     */
    getSurface: function() {
        return this.pointer;
    },
    initialize: function(pointer, window) {
        this.pointer = pointer;
        this.__window = window;
    },
    getWindow: function() {
        return this.__window;
    },
    drawImages: function(image, quads) {
        CRadamn.Image.drawImageQuads(image.pointer, this.pointer, quads);
    },
    drawImage: function() {
        switch(arguments.length) {
        case 3:
            // Object image, float dx, float dy,
            return CRadamn.Image.draw(arguments[0].pointer, this.globalCompositeOperation, arguments[1], arguments[2]);
            break;
        case 5:
            // <image>, <number>, <number>, <number>, <number>
            // Object image, float dx, float dy, float dw, float dh
            return CRadamn.Image.draw(arguments[0].pointer, this.globalCompositeOperation, arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
        case 9:
            // <image>, <number>, <number>, <number>, <number>
            // Object image, float sx, float sy, float sw, float sh, float dx, float dy, float dw, float dh
			// console.log(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
            return CRadamn.Image.draw(arguments[0].pointer, this.globalCompositeOperation
                    , arguments[1], arguments[2], arguments[3], arguments[4]
                    , arguments[5], arguments[6], arguments[7], arguments[8]);
            break;
        }
    },
	__getPrimitivePath: function(prim) {
		var path = [];
		switch(typeOf(prim)) {
			case 'rectangle' :
				path.push([prim.v1.x, prim.v1.y]);
				path.push([prim.v2.x, prim.v1.y]);
				path.push([prim.v2.x, prim.v2.y]);
				path.push([prim.v1.x, prim.v2.y]);
				path.push([prim.v1.x, prim.v1.y]);
				break;
			case 'circle' :
					i=0,
					max = Math.PI * 2;
				for (; i < max; i+=0.2) {
					path.push([prim.c.x + Math.sin(i) * prim.r, prim.c.y + Math.cos(i) * prim.r]);
				}
				path.push([prim.c.x + Math.sin(max) * prim.r, prim.c.y + Math.cos(max) * prim.r]);
				break;
			case 'line2' :
				break;
			case 'segment2' :
				path.push([prim.x1, prim.y1]);
				path.push([prim.x2, prim.y2]);
				break;
			case 'vec2' :
				break;
			case 'polygon' :
				return prim.points;
				break;
		}
		
		return path;
	},
	strokePrimitive: function(prim, options) {
		options = options || {};
		var path = this.__getPrimitivePath(prim);
		
		CRadamn.Window.stroke(path, options.lineWidth || this.lineWidth, options.color || this.strokeStyle);
		
		return this;
	},
	fillPrimitive: function(prim, options) {
		options = options || {};
		var path = this.__getPrimitivePath(prim);
		
		CRadamn.Window.fill(path, options.color || this.fillStyle);
		
		return this;
	},
	__initPath: function() {
		if(this.__paths.length === 0)
			//this.moveTo(0,0);
			this.__paths.push([]);
	},
	moveTo: function(x,y) {
		this.__paths.push([]);
		//this.__paths[ this.__paths.length -1 ].push([x,y]);
	},
    /**
     * @class Canvas
     * @param {Number} x
     * @param {Number} y
     */
    lineTo: function(x, y) {
		this.__initPath();

        this.__paths[ this.__paths.length -1 ].push([x,y]);
    },
	/**
	 * @todo optimize
	 */
    arcd: function(x1, y1, radius, startAngle, endAngle, anticlockwise ) {
		this.__initPath();

        for (; startAngle < endAngle; startAngle+=2) {
            this.__paths[ this.__paths.length -1 ].push([x1 + Math.sin(startAngle * Math.DEG_TO_RAD) * radius, y1 + Math.cos(startAngle * Math.DEG_TO_RAD) * radius]);
        }
        return true;
    },
	/**
	 * @todo optimize
	 */
    arc: function(x1, y1, radius, startAngle, endAngle, anticlockwise ) {
		this.__initPath();

        for (; startAngle < endAngle; startAngle+=0.2) {
            this.__paths[ this.__paths.length -1 ].push([x1 + Math.sin(startAngle) * radius, y1 + Math.cos(startAngle ) * radius]);
        }
        return true;
    },
    arcTo: function(x1, y2, x2, y2, radius) {
		this.__initPath();
	
        CRadamn.Window.fillRect(x, y, w, h, this.fillStyle);
        return true;
    },
    beginPath: function() {
        return this.__paths.length === 0;
    },
    closePath: function() {
        this.__closedPaths = this.__paths;
        this.__paths = [];
        return true;
    },
    translate: function(x,y, z) {
        z = z || 0;
        y = y || 0;
        x = x || 0;

        CRadamn.Window.translate(x, y, z)
    },
    rotate: function(angle) {
        CRadamn.Window.rotate(angle);
    },
    scale: function(x, y) {
        CRadamn.Window.scale(x, y);
    },
    transform: function() {
        CRadamn.Window.transform.apply(null,arguments);
    },
    setTransform: function() {
        CRadamn.Window.setTransform.apply(null,arguments);
    },
    save: function() {
        CRadamn.Window.save();
    },
    restore: function() {
        CRadamn.Window.restore();
    },
    clear: function() {
        CRadamn.Window.clear();
    },
    flip: function() {
        CRadamn.Window.flip();
    },
    stroke: function() {
        if(this.__closedPaths.length > 0) {
			var i=0,
				max = this.__closedPaths.length;

			for(;i<max;++i) {
				CRadamn.Window.stroke(this.__closedPaths[i], this.lineWidth, this.strokeStyle);
			}

            return true;
        }
        return false;
    },
    fillRect: function(x,y,w,h) {
        CRadamn.Window.fill([
			[x, y],
			[x+w, y],
			[x+w, y+h],
			[x, y+h]
		], this.fillStyle);
        return true;
    },
    fill: function() {
        if(this.__closedPaths.length > 0) {
			var i=0,
				max = this.__closedPaths.length;

			for(;i<max;++i) {
				CRadamn.Window.fill(this.__closedPaths[i], this.fillStyle);
			}

            return true;
        }
        return false;
		
        /**
         * gradient!
glBegin(GL_QUADS);
//red color
glColor3f(1.0,0.0,0.0);
glVertex2f(-1.0,-1.0);
glVertex2f(1.0,-1.0);
//blue color
glColor3f(0.0,0.0,1.0);
glVertex2f(1.0, 1.0);
glVertex2f(-1.0, 1.0);
glEnd();
         */
    }

});


//
//*********************************************************************************
//

/**
 * @class Node
 */
Radamn.Node = new Class({
    Implements : [ Options, Events ],
    /**
     * @member Node
     * @type {String}
     */
    name : "Node",
    /**
     * @member Node
     * @type {Array}
     */
    __body : [],
    /**
     * @member Node
     * @type {Array}
     */
    childNodes : [],
    /**
     * @member Node
     * @type {Array}
     */
    childEntities : [],
    /**
     * @member Node
     * @type {Node}
     */
    parentNode : null,
    /**
     * @member Node
     * @type {Boolean}
     */
    changed: false,
    /**
     * @member Node
     * @type {Matrix2D}
     */
    matrix : null,
    /**
     * @member Node
     * @type {Boolean}
     */
    freeze: false,
    /**
     * @member Node
     * @type {NodeOptions}
     */
    options : {

    },
    /**
     * Initialize the CanvasNode and merge an optional config hash.
     * @member Node
     * @params {NodeOptions} options
     */
    initialize : function(root, options) {
        this.setOptions(options);

        this.root = root;
        this.childNodes = [];
        this.matrix = new Matrix2D();
    },
    freeze: function() {
        this.freeze = true;
        this.matrix.readonly = true;
    },
    unfreeze: function() {
        this.freeze = false;
        this.matrix.readonly = false;
    },
    /**
     * Initialize the CanvasNode and merge an optional config hash.
     *
     * @todo v2Plus is missing!
     *
     * @member Node
     * @returns {Vector2}
     */
    getDerivedPosition: function() {
        var node = this;
        if(node.isRoot()) return this.matrix.getPosition();

        var out = new Vec2(0, 0);
        do {
            out = out.plus(node.matrix.getPosition());
            node = node.parentNode;
        } while (!node.isRoot());

        return out;
    },
    /**
     * @member Node
     * @returns {Boolean}
     */
    isRoot : function() {
        return false;
    },
    /**
     * @member Node
     * @returns {Node}
     */
    getNextSibling : function() {
        if (this.parentNode)
            return this.parentNode.childNodes[this.parentNode.childNodes
                    .indexOf(this) + 1];
        return null;
    },
    /**
     * @member Node
     * @returns {Node}
     */
    getPreviousSibling : function() {
        if (this.parentNode)
            return this.parentNode.childNodes[this.parentNode.childNodes
                    .indexOf(this) - 1];
        return null;
    },
	/**
	 * Create a new Node, appended and returned
	 * @returns {Node}
	 */
	createNode: function() {
		var node = new Radamn.Node();
		this.appendChild(node);
		return node;
	},
    /**
     * Appends arguments as childNodes to the node.
     *
     * Adding a child sets child.parentNode to be the node and calls
     * child.setRoot(node.root)
     *
     * @member Node
     * @param {Array} obj list of nodes or a single node
     */
    appendChild : function(obj) {
        var a = Array.from(arguments);
        for ( var i = 0; i < a.length; i++) {
            if (a[i].parentNode)
                a[i].removeSelf();
            this.childNodes.push(a[i]);
            a[i].parentNode = this;
        }
        this.touch();

        return this;
    },
    /**
     * Removes all childNodes from the node.
     * @member Node
     */
    removeAllChildren : function() {
        this.removeChild.apply(this, this.childNodes);

        return this;
    },
    /**
     * Removes arguments from the node's childNodes.
     *
     * Removing a child sets its parent to null and calls child.setRoot(null)
     *
     * @member Node
     * @param {Array} list of nodes or a single node
     */
    removeChild : function(obj) {
        var a = arguments;
        for ( var i = 0; i < a.length; i++) {
            this.childNodes.deleteFirst(a[i]);
            delete a[i].parentNode;
        }
        this.touch();

        return this;
    },
    /**
     * Calls this.parent.removeChild(this) if this.parent is set.
     * @member Node
     */
    removeSelf : function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }

        return this;
    },
    /**
    * @member Node
    * return AABB
    */
    getBoundingBox : function() {
        return [ this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1 ]
    },
    /**
     * Appends arguments as childNodes to the node.
     *
     * Adding a child sets child.parentNode to be the node and calls
     * child.setRoot(node.root)
     *
     * @member Node
     * @param {Array} list of nodes or a single node
     */
    appendEntity : function(obj) {
        var a = Array.from(arguments);
        for ( var i = 0; i < a.length; i++) {
            this.childEntities.push(a[i]);
            a[i].parentNode = this;
        }
        //var aabb = new AABB();
        //aabb.ComputeAABBFromPoly(/*??*/);
        this.touch();

        return this;
    },
    /**
     * Removes all childNodes from the node.
     *
     * @member Node
     */
    removeAllEntities : function() {
        this.removeEntity.apply(this, this.childEntities);

        return this;
    },
    /**
     * Removes arguments from the node's childNodes.
     *
     * Removing a child sets its parent to null and calls child.setRoot(null)
     *
     * @member Node
     * @param {Array} list of nodes or a single node
     */
    removeEntity : function(obj) {
        var a = arguments;
        for ( var i = 0; i < a.length; i++) {
            this.childEntities.deleteFirst(a[i]);
            delete a[i].parentNode;
        }
        this.touch();
    },
    /**
     * Get all entities recursive from this node and his children
     *
     * @member Node
     * @returns {Array} list of nodes
     */
    getAllSubEntites : function() {
        var output = this.childEntities.clean();
        for ( var i = 0; i < this.childNodes.length; i++) {
            output = output.combine(this.childNodes[i].getAllSubEntites());
        }
        return output;
    },
    /**
     * @deprecated
     */
    touch: function() {
        return ;
        this.changed = true;
        if(!this.isRoot()) {
            var rootNode = this;
            while (rootNode.isRoot() === false) {
                rootNode = this.parentNode;
            }
            rootNode.touch();
        }
    },
	addToBody: function(primitive) {
		assert.notEqual(["polygon", "rectangle", "circle", "segment2"].contains(typeOf(primitive)), false, "Node::addToBody("+typeOf(primitive)+") is not a valid type ['polygon', 'rectangle', 'circle', 'segment2']");
		
		this.__body.push(primitive);
	},
	getBodyList: function() {
		return this.__body;
	},
	collide: function(operand) {
		if(this.__body.length == 0) {
			return {success: false, reason: "nobody"}; //no-body ?
		}
		if(this.__body.length > 1) {
			throw new Exception("multiple body collision is not supported atm!");
		}
		
		var xx = this.__body[0].clone().translate(this.getDerivedPosition());
		
		return Math.intersection(xx, operand);
	}
});

Radamn.TMX = require("./radamn.tmx.js").TMX;

