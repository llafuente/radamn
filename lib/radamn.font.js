/**
 * Font class. Has all functionality Canvas use all this methods directly.
 * @TODO stroke
 * @class Font
 * @super Resource
 */
var Font = new Class(
/** @lends Font.prototype */{
    Extends: Radamn.Resource,
    pointer: null,
    /**
     * @member Font
	 * @constructs
     */
    initialize: function(font_pointer, options) {
        this.parent(options);
        this.pointer = font_pointer;
        this.__type = "Font";
    },
    /**
     * @TODO: manage quit event -> destroy all images created if possible!
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
    fill: function(ctx, text, color, x, y) {
		var old = ctx.globalCompositeOperation;
		ctx.globalCompositeOperation = Radamn.$.BLENDING.COPY;

        var surface = CRadamn.Font.getImage(this.pointer, text, color);
        var image = new Radamn.Image(surface);
        image.__draw(ctx, x, y);
        image.destroy();

		ctx.globalCompositeOperation = old;
        return this;
    },
    /**
     * @member Font
     * @param {String} text
     * @returns {Object} {width: X, height: Y}
     */
	measureText: function(text) {
		return CRadamn.Font.measureText(this.pointer, text);
	}
});


module.exports.Font = Font;
