(function(exports, browser) {
    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

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
        clipping: false,
    });

    Image.extends(Radamn.ResourceRendereable);

    Image.implements({
        /**
         * @member Image
         * @constructs
         */
        __construct: function(options) {
            this.parent(options);
            this.width = this.surface.width;
            this.height = this.surface.height;
        },
        remClipping: function() {
            this.clipping = false;
        },
        setClipping: function(x,y,w,h) {
            this.clipping = [x,y,w,h];
        },
        draw: function(ctx) {
            if(!this.surface.__ready) return false;

            if(browser) {
                if(this.clipping === false) {
                    return ctx.drawImage(this.surface, 0, 0);
                }

                return ctx.drawImage(this.surface,
                    this.clipping[0], this.clipping[1], this.clipping[2], this.clipping[3],
                    0, 0, this.clipping[2], this.clipping[3]
                );
            }
            return ctx.drawImage(this.surface, 0, 0);
        }
    });

    exports.Image = Image;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");