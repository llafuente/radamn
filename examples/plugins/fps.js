module.exports = new Class({
    Implements: [Options],
    /**
     * @type Font
     */
    font: null,

    options: {
        font: "./resources/fonts/Jura-DemiBold.ttf",
        size: 32,
        color: "#00FF00",
        x: 0,
        y: 0
    },

    initialize: function(options) {
        this.setOptions(options);
        this.font = Radamn.Assets.getFont(this.options.font, this.options.size);
    },
    draw: function(ctx, delta) {
        var fps = Math.round(1000 / delta,1)+"";
		
		var old = ctx.fillStyle;
		ctx.font = this.options.size+"px "+"Jura";
		ctx.fillStyle = this.options.color;
		ctx.fillText(fps, this.options.x, this.options.y);
		
		ctx.fillStyle = old;
    }
});