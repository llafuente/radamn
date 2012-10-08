(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

    /**
     * Text class to be attached to a node
     * @TODO stroke
     * @class Text
     * @super Resource
     */
    var Text = new Class("RadamnText",
    /** @lends Text.prototype */{
        fillStyle: "#000000",
        strokeStyle: "#000000",
        textBaseline: "#000000",
        font: "12px arial",
        fill: false,
        stroke: false,
        text: ""
    });
    Text.extends(Radamn.ResourceRendereable);
    Text.implements({
        draw: function (ctx) {
            ctx.save();
            ctx.font = this.font;
            ctx.textBaseline = this.textBaseline;

            if (this.fill) {
                ctx.fillStyle = this.fillStyle;
                ctx.fillText(this.text, 0, 0);
            }
            if (this.stroke) {
                ctx.strokeStyle = this.strokeStyle;
                ctx.strokeText(this.text, 0, 0);
            }

            ctx.restore();
        }
    });


    exports.Text = Text;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));