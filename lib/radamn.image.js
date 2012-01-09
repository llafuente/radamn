/**
 * @class Image
 * @extends ResourceRendereable
 */
var Image = new Class(
/** @lends Image.prototype */{
    Extends: Radamn.ResourceRendereable,
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
    /**
     * @member Image
	 * @constructs
     */
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

module.exports.Image = Image;
