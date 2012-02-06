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
     * @type Node
     */
    parentNode: null,
    /**
     * @member ResourceRendereable
     * @private
     * @type Pointer
     */
    pointer: null,
    /**
     *
     * @member ResourceRendereable
     * @constructs
     * @param Pointer pointer_to_surface
     * @param Object options
     * @returns ResourceRendereable
     */
    initialize: function(pointer_to_surface, options) {
        this.parent(options);
        this.pointer = pointer_to_surface;
        this.__type = "ResourceRendereable";
    },
    /**
     * @member ResourceRendereable
     * @param Blending blend_mode
     * @returns Boolean
     */
    setBlendMode: function(blend_mode) {

    },
    /**
     * @member ResourceRendereable
     * @returns Node
     */
    getParentNode: function() {
        return this.parentNode;
    },
	detachFromParent: function() {
		if(this.parentNode !== null) {
			if(this.parentNode.getEntities().length == 1) {
				this.parentNode.dispose();
			}
			this.parentNode.detachEntity(this);
		}
	},
	attachChildNode: function(parent_node) {
		var node = parent_node.createNode();
		node.appendEntity(this);
		
		return node;
	},
    /**
     * @member ResourceRendereable
     * @private
     * @param CanvasRenderingContext2D ctx
     * @param Number x
     * @param Number y
     * @returns Boolean
     */
    __draw: function(ctx, x, y) {
        if(!this.pointer.__ready) return false;

        if(browser) {
            return ctx.drawImage(this.pointer, x, y);
        }
        return ctx.drawImage(this, x, y);
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
