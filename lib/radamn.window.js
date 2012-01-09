/**
 * @class Window
 */
var Window = new Class(
/** @lends Window.prototype */
{
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
	 * @member Window
     * @param {Number} fps false means: as fast as possible!!!
     */
    start: function(fps) {
        this.running = true;

        window.requestAnimationFrame(this.bound.__renderLoop);
    },
	/**
	 * is quad viewable, give the coords in screen position!
	 * @member Window
	 */
    isPointVisible: function(x,y) {
		return true;
		//console.log(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
		return x > 0 && x < this.width && y < this.height && y > 0;
    },
	/**
	 * is quad viewable, give the coords in screen position!
	 * @member Window
	 */
    isQuadVisible: function(x,y,w,h) {
		//console.log(x, this.width, id, x + w > 0 && x < this.width && y < this.height && y + h > 0);
		return x + w > 0 && x < this.width && y < this.height && y + h > 0;
    },
    /**
	 * @see Window.render
	 * @member Window
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
	/**
	 * @member Window
	 */
    ray: function(x,y) {
        return [this.rootNode];
    },
    /**
     * @member Window
	 * @constructs
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
     * @returns {Canvas}
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
     * take a screenshot
	 * @member Window
     */
    screenshot: function() {
        CRadamn.Window.screenshot(this);
    }
});

module.exports.Window = Window;