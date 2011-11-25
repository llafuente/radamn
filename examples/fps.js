module.exports = new Class({
    Implements: [Options],
    /**
     * @type Font
     */
    font: null,

    options: {
        font: "Jura-DemiBold.ttf",
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
        console.log(arguments);
        var fps = Math.round(1000 / delta,1)+"";
        this.font.write(ctx, fps, this.options.color, this.options.x, this.options.y);
    }
});