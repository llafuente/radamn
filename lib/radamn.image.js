(function(exports, browser) {
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
     * @retuns {String}
     */
	clipping: false,
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
	remClipping: function() {
		this.clipping = false;
	},
	setClipping: function(x,y,w,h) {
		this.clipping = [x,y,w,h];
	},
    draw: function(ctx) {
        if(!this.pointer.__ready) return false;

        if(browser) {
			if(this.clipping === false) {
				return ctx.drawImage(this.pointer, 0, 0);
			}
			
			return ctx.drawImage(this.pointer, 
				this.clipping[0], this.clipping[1], this.clipping[2], this.clipping[3],
				0, 0, this.clipping[2], this.clipping[3]
			);
        }
        return ctx.drawImage(this, 0, 0);
    }
});

exports.Image = Image;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");