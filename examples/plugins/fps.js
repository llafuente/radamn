(function(exports, browser) {
    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events;

    module.exports = new Class("PluginFPS", {
        /**
         * @type Font
         */
        font: null,

        font: "./resources/fonts/Jura-DemiBold.ttf",
        size: 32,
        color: "#00FF00",
        x: 0,
        y: 0
    });

    module.exports.Implements({
        __construct: function(options) {
            this.font = Radamn.Assets.getFont(this.font, this.size);
        },
        draw: function(ctx, delta) {
            var fps = Math.round(1000 / delta,1)+"";

            var old = ctx.fillStyle;
            ctx.font = this.size+"px "+"Jura";
            ctx.fillStyle = this.color;
            ctx.fillText(fps, this.x, this.y);

            ctx.fillStyle = old;
        }
    });

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");
