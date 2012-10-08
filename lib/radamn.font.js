(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        /**
         * Font class. Has all functionality Canvas use all this methods directly.
         * @TODO stroke
         * @class Font
         * @super Resource
         */
        Font = new Class("RadamnFont",
        /** @lends Font.prototype */
        {
        });

    Font.extends(Radamn.ResourceRendereable);

    Font.implements({
        /**
         * @member Font
         * @constructs
         */
        __construct: function (options) {
            this.parent(options);
        },
        /**
         * @TODO: manage quit event -> destroy all images created if possible!
         * @member Font
         * @param {String} text
         * @returns {Image}
         */
        getImage: function (text, color) {
            var surface = CRadamn.Font.getImage(this.surface, text, color);
            return new Radamn.Image({surface: surface});
        },
        /**
         * @member Font
         * @param {String} text
         * @param {Number} x
         * @param {Number} y
         * @returns {Boolean}
         */
        fill: function (ctx, text, color, x, y) {

            if (browser) {
                ctx.fillStyle = color;
                ctx.fillText(text, x, y);
                return this;
            }

            ctx.globalCompositeOperation = Radamn.$.BLENDING.COPY;

            var old = ctx.globalCompositeOperation,
                surface = CRadamn.Font.getImage(this.surface, text, color),
                image = new Radamn.Image({surface: surface});

            image.__draw(ctx, x, y);
            image.destroy();

            ctx.globalCompositeOperation = old;
            return this;
        },
        /**
         * @member Font
         * @param {String} text
         * @returns {Object} {width: X, height: Y}
         */
        measureText: function (text) {
            return CRadamn.Font.measureText(this.surface, text);
        }
    });


    exports.Font = Font;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));