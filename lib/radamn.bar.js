(function(exports, browser) {

/**
 * Text class to be attached to a node
 * @TODO stroke
 * @class Text
 * @super Resource
 */
var Bar = new Class(
/** @lends Text.prototype */{
    Extends: Radamn.ResourceRendereable,
    options : {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        textBaseline: "#000000",
        font: "12px arial",
        fill: false,
        stroke: false,
        display: "percentaje", // amount
        percentaje: false,
        min: 0,
        max: 100,
        value: 50,
        backgroundColorEmpty: "#FFFFFF", // none to remove
        backgroundColorFill: "#CCC", // none to remove
        borderColor: "#000000",
        width: 100,
        height: 20
    },
    initialize: function(options) {
        this.setOptions(options);
    },
    setValue: function(value) {
        this.options.value = value;
    },
    draw: function(ctx) {
        ctx.save();
        
        if(this.options.backgroundColorEmpty != "none") {
            ctx.fillStyle = this.options.backgroundColorEmpty;
            ctx.fillRect (0, 0, this.options.width, this.options.height);
        }
        
        var percentaje = Math.abs(this.options.value / (this.options.max - this.options.min));
        
        if(this.options.backgroundColorFill != "none") {
            ctx.fillStyle = this.options.backgroundColorFill;
            ctx.fillRect (0, 0, this.options.width * percentaje, this.options.height);
        }
        
        ctx.strokeStyle = this.options.borderColor;
        ctx.strokeRect(0, 0, this.options.width, this.options.height);
        
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


exports.Bar = Bar;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");