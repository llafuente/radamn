// this move the JS to C realm
// executes Radamn::init and return into CRadamn
var CRadamn = require(process.env.PWD+ '/../build/Release/radamn.node');
// include mootools to have a proper class design
// also add this hack to keep keyboard compatibility :)

this.document = document = (function() {
    var events = null;
    return {
        addEvents: function(events) {

        },
        getEvents: function() {
            return events;
        }
    }
})();

require(process.env.PWD + '/mootools');

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
var Radamn = new Class({
    Implements: [Options, Events],

    __fakeIntervalToKeepAppRunning : null,
    intervals : {
        render: null,
        input: null
    },
    /**
     * @member Window
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
     * @member Radamn
     * @param {String} root
     * @returns {Boolean} true if valid path
     */
    setAppRootPath: function(root) {
        return "<boolean>";
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
     * @member Radamn
     * @returns {String} full path where it's saved!
     */
    screenShot: function() {
        return "/xxx.png";
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
    createWindow: function(width, height) {
        // XXX why? onRequestFrame should be enough
        this.__fakeIntervalToKeepAppRunning = setInterval(function() {}, 99999);

        var surface = CRadamn.setVideoMode(width, height);
        var window = new Radamn.Window(surface, width, height);

        this.windows.push(window);

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
     * @member Radamn
     * @returns {String} full path where it's saved!
     */
    screenShot: function() {
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
            var canvas = win.getCanvas();
            var now = Date.now();
            canvas.save();
            canvas.clear();
            if(win.onRequestFrame)
                win.onRequestFrame(now - win.lastRenderDate);
            canvas.flip();
            canvas.restore();
            win.lastRenderDate = now;
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
    Sound: null
});

//
//*********************************************************************************
// Create Radamn object!

Radamn = module.exports = new Radamn();

//
//*********************************************************************************
// Override some components that need to be inited after creation.

module.exports.$ = {
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
     * @type Number
     */
    DEGREE_TO_RADIANS: (Math.PI / 180),
    RADIANS_TO_DEGREE: (180 / Math.PI),

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
        SRC_OVER: "source-over",       // destination + source
        DST_OVER: "destination-over",  // source + destination
        SRC_IN: "source-in",           // destination & source
        DST_IN: "destination-in",      // source & destination
        SRC_OUT: "source-out",         // source - destination
        DST_OUT: "destination-out",    // destination - source
        SRC_ATOP: "source-atop",       // destination + (source & destination)
        DST_ATOP: "destination-atop",  // source + (destination & source)
        LIGTHER: "lighter",            // destination + source + lighter(source & destination)
        DARKER: "darker",              // destination + source + darker(source & destination)
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
     * @type {Canvas}
     */
    onRequestFrame: null, // buffer flip
    canvas: null,
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
    render: null,
    /**
     * @member Window
     * @type {Function}
     */
    leaveFrame: null,
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
     * @param {Number} id
     * @param {Canvas} canvas
     */
    initialize: function(SDL_Surface, width, height) {
        this.surface = SDL_Surface;
        this.width = width;
        this.height = height;
        this.lastRenderDate = Date.now();
        return this;
    },
    /**
     * @member Window
     * @param {String} caption
     */
    setCaption: CRadamn.Window.setCaption,
    /**
     * @member Window
     * @return Canvas
     */
    getCanvas: function() {
        return new Radamn.Canvas(this.surface);
    },
    /**
     * @member Window
     * @param {String} caption
     * @returns {Boolean}
     */
    setCaption: function(caption) {},
    /**
     * @member Window
     * @params {Image} image
     * @returns {Boolean}
     */
    setIcon: function(image) {},
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
    getRootNode: function() {},
    /**
     * change the origin!
     *
     * @member Window
     * @params {Number} x
     * @params {Number} y
     * @returns {Screen}
     */
    translate: function(x,y) {},
    /**
     * clear to transparent
     */
    empty: function() {},
    /**
     * clear to transparent
     */
    screenshot: function() {
        CRadamn.Window.screenshot(this);
    },
    /**
     * clear to bg color
     */
    clear:function() {},
    /**
     * @private
     * @param {Node} node
     * @returns {Boolean}
     */
    renderNode: function(node) {},
    addEvents: {}
    // all canvas operations!
});
//
//*********************************************************************************
//

/**
 * @class Assets
 */
Radamn.Assets = new Class({
    __pathlist : [],
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
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Image}
     */
    getImage: function(path, zipfile) {
        zipfile = zipfile | null;

        var image_pointer = CRadamn.Image.load(path);
        return new Radamn.Image(image_pointer);

    },
    /**
     * @member Assets
     * @params {String} path
     * @params {String} zipfile (optional)
     * @returns {Image}
     */
    getAnimation: function(path, path_to_cfg_or_object, zipfile) {
        zipfile = zipfile | null;

        var options = {};
        if(typeOf(path_to_cfg_or_object) == "string") {
            // TODO: get the file! and parse the JSON
        } else {
            options = path_to_cfg_or_object;
        }

        var image_pointer = CRadamn.Image.load(path);
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
     * @params {String} path
     * @params {Number} path
     * @params {String} zipfile (optional)
     * @returns Font
     */
    getFont: function(path, size, zipfile) {
        zipfile = zipfile | null;

        var font_pointer = CRadamn.Font.load(path, size);
        return new Radamn.Font(font_pointer);
    },
    /**
     * @member Assets
     * @params {String} path
     * @returns Zip
     */
    getZip: function(path) {

    },
    /**
     * @member Assets
     * @params {String} path
     * @returns Zip
     */
    destroy: function(resource) {
        switch(resource.__type) {
        case 'Image' :
            CRadamn.Image.destroy(resource.pointer);
        break;
        case 'Font' :
            CRadamn.Font.destroy(resource.pointer);
        break;
        }
    }
    /**
     * @member Assets
     */
    // remove!

});

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
    __draw: function(screen, x, y, tmatrix) {
        return CRadamn.Image.draw(this.pointer, screen, x, y);
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
        this.__type = "Image";
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
        console.log(delta);

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
     * @member Font
     * @param {String} text
     * @returns {Image}
     */
    getImage: function(text, color) {
        var surface = CRadamn.Font.getImage(this.pointer, text, color)
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
        var surface = CRadamn.Font.getImage(this.pointer, text, color)
        var image = new Radamn.Image(surface);
        image.__draw(canvas, x, y);
        image.destroy();

        return this;
    }
});

//
//*********************************************************************************
//

Radamn.Canvas = new Class({
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
    __path: [],
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
    initialize: function(pointer) {
        this.pointer = pointer;
    },
    drawImage: function() {
        console.log("drawImage[", arguments.length,"]");

        switch(arguments.length) {
        case 3:
            console.log(this.pointer, arguments[0].pointer, arguments[1], arguments[2]);
            // <image>, <number>, <number>
            // Object image, float dx, float dy,
            return CRadamn.Image.draw(arguments[0].pointer, this.pointer, arguments[1], arguments[2]);
            break;
        case 5:
            // <image>, <number>, <number>, <number>, <number>
            // Object image, float dx, float dy, float dw, float dh
            return CRadamn.Image.draw(arguments[0].pointer, this.pointer, arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
        case 9:
            // <image>, <number>, <number>, <number>, <number>
            // Object image, float sx, float sy, float sw, float sh, float dx, float dy, float dw, float dh
            return CRadamn.Image.draw(arguments[0].pointer, this.pointer
                    , arguments[1], arguments[2], arguments[3], arguments[4]
                    , arguments[5], arguments[6], arguments[7], arguments[8]);
            break;
        }
    },
    /**
     * @class Canvas
     * @param {Number} x
     * @param {Number} y
     */
    lineTo: function(x, y) {
        this.__path.push([x,y]);
    },
    stroke: function() {
        if(this.__closedPath.length > 0) {
            console.log(this.__closedPath);
            CRadamn.Window.stroke(this.__closedPath, this.lineWidth, this.strokeStyle);
            return true;
        }
        return false;

    },
    beginPath: function() {
        return this.__path.length === 0;
    },
    closePath: function() {
        this.__closedPath = this.__path;
        this.__path = [];
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
    fill: function() {
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

