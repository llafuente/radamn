(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        typeOf = browser ? NodeClass.typeof : require("node-class").typeof;

    /**
     * @class Image
     * @extends ResourceRendereable
     */
    var Image = new Class("RadamnImage",
    /** @lends Image.prototype */
    {
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
            options = options || false;
            if(options) {
                this.parent(options);
            }
        },
        remClipping: function () {
            this.clipping = false;
        },
        setClipping: function (x, y, w, h) {
            this.clipping = [x, y, w, h];
        },
        load: function(image_src) {

            this.once("image:loaded", function() {
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
            if (!this.surface.__ready) {
                return false;
            }

            this.emit("draw:before", [ctx, delta]);

            if (browser) {
                if (this.clipping === false) {
                    ctx.drawImage(this.surface, 0, 0);
                } else {

                    ctx.drawImage(this.surface,
                        this.clipping[0], this.clipping[1], this.clipping[2], this.clipping[3],
                        0, 0, this.clipping[2], this.clipping[3]
                        );
                }
            } else {
                ctx.drawImage(this.surface, 0, 0);
            }

            this.emit("draw:after", [ctx, delta]);

            return ctx;
        }
    });

    exports.Image = Image;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));