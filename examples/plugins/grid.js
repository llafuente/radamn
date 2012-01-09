module.exports = new Class({
    Implements: [Options],
    options: {
        size: 16,
        color: "#FF0000",
		width: 0.25
    },

    initialize: function(options) {
        this.setOptions(options);
    },
    draw: function(ctx, delta) {
		var win = ctx.getWindow(),
			x = Math.floor(win.width / this.options.size),
			y = Math.floor(win.height / this.options.size);

		ctx.strokeStyle = this.options.color;
		ctx.lineWidth = this.options.width;

		for(i=0;i<x; ++i) {
			ctx.translate(this.options.size, 0);
			ctx.beginPath();
			ctx.lineTo(0, win.height);
			ctx.closePath();
			ctx.stroke();
		}
		ctx.translate( -x*this.options.size, 0);
		for(i=0;i<y; ++i) {
			ctx.translate(0, this.options.size);
			ctx.beginPath();
			ctx.lineTo(win.width, 0);
			ctx.closePath();
			ctx.stroke();
		}
		ctx.translate(0, -y*this.options.size);
    }
});