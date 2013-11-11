(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Image;

    /**
     * @class Image
     * @extends ResourceRendereable
     */
    Image = new Class("RadamnImage",/** @lends Image.prototype */{
        /**
         * @member Image
         * @retuns {String}
         */
        id: '',
        /**
         * @member Image
         * @retuns {Number}
         */
        width: 0,
        /**
         * @member Image
         * @retuns {Number}
         */
        height: 0,
        /**
         * @member Image
         * @retuns {String}
         */
        fotmat: '',
        /**
         * @member Image
         * @retuns {String}
         */
        clipping: false
    });

    Image.Extends(Radamn.ResourceRendereable);

    Image.Implements({
        /**
         * @member Image
         * @constructs
         */
        __construct: function (options) {
            this.parent(options || {});
        },
        remClipping: function () {
            this.clipping = false;
        },
        setClipping: function (x, y, w, h, ow, oh) {
            this.clipping = [x,
                y,
                w > this.width ? this.width : w,
                h > this.height ? this.height : h
                ];

            this.clipping[4] = ow || this.clipping[2];
            this.clipping[5] = oh || this.clipping[3];
        },
        load: function (image_src) {

            this.once("image:loaded", function () {
                this.width = this.surface.width;
                this.height = this.surface.height;
            }.bind(this));

            this.surface = Radamn.Assets.__getImage(image_src);

            if (this.surface.__ready === true) {
                this.emit("image:loaded", [this], 0);
            } else {
                this.surface.addEventListener("load", function () {
                    this.emit("image:loaded", [this]);
                }.bind(this));
            }

        },
        draw: function (ctx, delta) {
            if (this.surface === null || this.surface.__ready === false || this.visible === false) {
                return false;
            }

            this.emit("draw:before", [ctx, delta]);

            if (browser) {
                if (this.clipping === false) {
                    ctx.drawImage(this.surface, 0, 0);
                } else {

                    ctx.drawImage(this.surface,
                        this.clipping[0], this.clipping[1], this.clipping[2], this.clipping[3],
                        0, 0, this.clipping[4], this.clipping[5]
                        );
                }
            } else {
                ctx.drawImage(this.surface, 0, 0);
            }

            this.emit("draw:after", [ctx, delta]);

            return ctx;
        },
        getBoundingBox: function () {
            if (this.clipping === false) {
                return [0, 0, this.surface.width, this.surface.height];
            }

            return [0, 0, this.clipping[4], this.clipping[5]];
        }
    });

    exports.Image = Image;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));