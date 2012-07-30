(function(exports, browser) {
    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

    module.exports = new Class("PluginGrid", {
        size: 16,
        color: "#FF0000",
        width: 0.25
    });

    module.exports.implements({
        __construct: function(options) {
        },
        draw: function(ctx, delta) {
            var win = ctx.getWindow(),
                x = Math.floor(win.width / this.size),
                y = Math.floor(win.height / this.size);

            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;

            for(i=0;i<x; ++i) {
                ctx.translate(this.size, 0);
                ctx.beginPath();
                ctx.lineTo(0, win.height);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.translate( -x*this.size, 0);
            for(i=0;i<y; ++i) {
                ctx.translate(0, this.size);
                ctx.beginPath();
                ctx.lineTo(win.width, 0);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.translate(0, -y*this.size);
        }
    });

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");