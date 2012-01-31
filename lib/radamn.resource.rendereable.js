(function(exports, browser) {

/**
 * @class ResourceRendereable
 * @extends Resource
 */
var ResourceRendereable = new Class(
/** @lends ResourceRendereable.prototype */{
    Extends: Radamn.Resource,
    /**
     * @member ResourceRendereable
     * @private
     * @type {Node}
     */
    parentNode: null,
    /**
     * @member ResourceRendereable
     * @private
     * @type {PointerToSurface}
     */
    pointer: null,
    /**
     * 
     * @member ResourceRendereable
     * @constructs
     * @param {Pointer} pointer_to_surface
     * @param {Object} options
     * @returns {ResourceRendereable}
     */
    initialize: function(pointer_to_surface, options) {
        this.parent(options);
        this.pointer = pointer_to_surface;
        this.__type = "ResourceRendereable";
    },
    /**
     * @member ResourceRendereable
     * @param {Blending} blendmode
     * @returns {Boolean}
     */
    setBlendMode: function(blendmode) {

    },
    /**
     * @member ResourceRendereable
     * @param {Blending} blendmode
     * @returns {Node}
     */
    getParentNode: function() {
        return this.parentNode;
    },
    /**
     * @member ResourceRendereable
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
     * @member ResourceRendereable
     * @private
     * @param {TransformationMatrix} tmatrix
     * @returns {Boolean}
     */
    __draw: function(ctx, x, y) {
		if(browser) {
			console.log(this.pointer);
		    if(this.pointer.__ready)
				ctx.drawImage(this.pointer, x, y);
		} else {
		    ctx.drawImage(this, x, y);
		}
    },
    /**
     * @member ResourceRendereable
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
     * @member ResourceRendereable
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
	/**
	 * valid events
	 * - moved
	 * - rotated
	 * - scaled
	 * @member ResourceRendereable
	*/
    events: ["moved", "rotated", "scaled"]
});

exports.ResourceRendereable = ResourceRendereable;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");
