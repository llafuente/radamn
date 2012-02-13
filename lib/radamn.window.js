(function(exports, browser) {

/**
 * @class Window
 */
var Win = new Class(
/** @lends Window.prototype */
{
    /**
     * @member Window
     * @type {Number}
     */
    id: null,
    /**
     * @type {Number}
     */
    width: null,
    /**
     * @type {Number}
     */
    height: null,
    /**
     * @type {Canvas}
     */
	__canvas: null,
    /**
     * @type {Function}
     */
    onRequestFrame: null, // buffer flip
    /**
     * @type {Function}
     */
    enterFrame: null,
    /**
     * @type {Function}
     */
    leaveFrame: null,
    /**
	 * @constructs
     * @param {Number} id
     * @param {Canvas} canvas
     */
    initialize: function(canvas_el, width, height) {
        this.surface = canvas_el;
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
        
        this.__camera = new Radamn.Camera(this);

        return this;
    },    
    /**
     * this call render but no now in 1ms
     * @param {Number} fps false means: as fast as possible!!!
     */
    start: function(fps) {
        this.running = true;

        window.requestAnimationFrame(this.bound.__renderLoop);
    },
	/**
	 * is quad viewable, give the coords in screen position!
	 */
    isPointVisible: function(x,y) {
		return true;
		//console.log(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
		return x > 0 && x < this.width && y < this.height && y > 0;
    },
	/**
	 * is quad viewable, give the coords in screen position!
	 */
    isQuadVisible: function(x,y,w,h) {
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
     * @param {Number} delta
     * @param {Function} fnbefore exec before render any node
     * @param {Function} fnafter exec before render any node
     * @type {Function}
     */
    render: function(delta, fnbefore, fnafter) {
        this.__camera.update();
        this.__renderNode(this.getCanvas().getContext("2d"), this.rootNode, delta, fnbefore || null, fnafter || null);
    },
	/**
	 * @TODO do it!
	 * @param Number x
	 * @param Number y
	 */
    ray: function(x,y) {
        return [this.rootNode];
    },
    getCamera: function() {
        return this.__camera;
    },
    /**
     * @param {String} caption
     * @returns {Boolean}
     */
    setCaption: CRadamn.Window.setCaption,
    /**
     * @returns {Canvas}
     */
    getCanvas: function() {
		if(this.__canvas === null) {
			if(browser) {
				this.__canvas = this.surface;
			} else {
				this.__canvas = new Radamn.Canvas(this.surface, this);
			}
			
		}
        return this.__canvas;
    },
    /**
     * @params {Image} image
     * @returns {Boolean}
     */
    setIcon: CRadamn.Window.setIcon,
    /**
     * @params {Number} color Uint32 Color
     * @returns {Screen}
     */
    setBackgroundColor: function(color) {
        CRadamn.GL.setBackgroundColor(color);
    },
    /**
     * @params {Image} image
     * @returns {Screen}
     */
    setBackgroundImage: function(image) {},
    /**
     * @params {Image} image
     * @returns {Screen}
     */
    isFullscreen: function() {},
    /**
     * @params {Boolean} full
     * @returns {Boolean}
     */
    setFullscreen: function(full) {},
    /**
     * @params {Boolean} win
     * @returns {Boolean}
     */
    setWindowed: function(win) {},
    /**
     * @returns {Boolean}
     */
    toggleFullscreen: function() {},
    /**
     * @returns {Node}
     */
    getRootNode: function() {
        return this.rootNode;
    },
    /**
     * take a screenshot
     */
    screenshot: function() {
        CRadamn.Window.screenshot(this);
    }
});

	exports.Window = Win;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");

