(function(exports, browser) {
    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof;

    module.exports = new Class("ParalaxBackground", {
        Extends: ,

        referenceNode: null,
        config: [],
    });

    module.exports.Extends(Radamn.RendereableResource);

    module.exports.Implements({
        __construct: function(reference_node) {
            this.referenceNode = reference_node;
        },
        push: function(url, move_factor) {
            this.config.push({
                image: Radamn.Assets.getImage(url),
                factor: move_factor,
            });
        },
        draw: function(ctx, delta) {
            var pos = this.referenceNode.getDerivedPosition();
            pos.x = - pos.x;
            pos.y = - pos.y;


            var i =0,
                max = this.config.length;
            for(;i<max;++i) {
                var w = this.config[i].image.width;
                w = 640;

                var offset = (pos.x * this.config[i].factor) % w,
                    j = Math.floor(pos.x / w),
                    jmax = j + 3;

                for(;j<jmax;++j) {
                    // ctx.drawImage(this.images[i], (start) + (j * w), 0);
                    // this.config[i].image.factor * j * w
                    ctx.drawImage(this.config[i].image, (j * w) - offset, 0);
                }
            }
        }
    });

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");