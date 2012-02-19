(function(exports, browser) {

/**
 * Text class to be attached to a node
 * @TODO stroke
 * @class Text
 * @super Resource
 */
var Text = new Class(
/** @lends Text.prototype */{
    Extends: Radamn.ResourceRendereable,
    options : {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        textBaseline: "#000000",
        font: "12px arial",
        fill: false,
        stroke: false,
        text: ""
    },
    initialize: function(options) {
        this.setOptions(options);
    },
    
    draw: function(ctx) {
        ctx.save();
        ctx.font = this.options.font;
        ctx.textBaseline = this.options.textBaseline;
        
        if(this.options.fill) {
            ctx.fillStyle = this.options.fillStyle;
            ctx.fillText(this.options.text, 0, 0);
        }
        if(this.options.stroke) {
            ctx.strokeStyle = this.options.strokeStyle;
            ctx.strokeText(this.options.text, 0, 0);
        }

        ctx.restore();
    }
});


exports.Text = Text;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");