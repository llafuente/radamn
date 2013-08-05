(function(exports, browser) {

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        typeOf = browser ? NodeClass.typeof : require("node-class").typeof;

    /**
     * Text class to be attached to a node
     * @TODO stroke
     * @class Text
     * @super Resource
     */
    var Bar = new Class("RadamnBar",
    /** @lends Text.prototype */{
        fillStyle: "#000000",
        strokeStyle: "#000000",
        textBaseline: "#000000",
        font: "14px arial",
        fill: false,
        stroke: false,
        display: "percentaje", // amount
        decimals: 0,
        percentaje: false,
        min: 0,
        max: 100,
        value: 50,
        backgroundColorEmpty: "#FFFFFF", // none to remove
        backgroundColorFill: "#CCC", // none to remove
        borderColor: "#000000",
        width: 100,
        height: 20
    });

    Bar.Extends(Events);

    Bar.Implements({
        setValue: function(value) {
            this.value = value;
        },
        draw: function(ctx) {
            ctx.save();

            if(this.backgroundColorEmpty != "none") {
                ctx.fillStyle = this.backgroundColorEmpty;
                ctx.fillRect (0, 0, this.width, this.height);
            }

            var percentaje = Math.abs(this.value / (this.max - this.min));

            if(this.backgroundColorFill != "none") {
                ctx.fillStyle = this.backgroundColorFill;
                ctx.fillRect (0, 0, this.width * percentaje, this.height);
            }

            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(0, 0, this.width, this.height);

            if(this.display) {
                ctx.font = this.font;
                ctx.textBaseline = this.textBaseline;
                ctx.fillStyle = this.fillStyle;
                var text = null;
                switch(this.display) {
                    case "percentaje":
                        text = Math.round(percentaje, this.decimals)+"%";
                    break;
                    case "value":
                        text = this.value;
                    break;
                    case "value/max":
                        text = this.value+"/"+this.max;
                    break;
                }

                ctx.fillText(text, (this.width - ctx.measureText(text).width) *0.5, this.height);
            }

            ctx.restore();
        }
    });


    exports.Bar = Bar;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");