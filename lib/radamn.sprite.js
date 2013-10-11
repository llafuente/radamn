(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Sprite;

    /**
     * @class Sprite
     * @extends Image
     */
    Sprite = new Class("RadamnSprite",/** @lends Sprite.prototype */{
        properties: null,
        ready: false
    });

    Sprite.Extends(Radamn.Image);

    Sprite.Implements({
        /**
         * <pre>Constructor<br />
         * use: new Radamn.Sprite(image_ptr, {...})
         * </pre>
         * @member Sprite
         * @param Pointer image_ptr
         * @param SpriteOptions options
         * @constructor
         */
        __construct: function (image_src, options) {

            this.parent({});
            this.properties = options;

            this.image = new Radamn.Image();

            this.image.on("image:loaded", function () {
                this.emit("sprite:loaded", []);
                this.ready = true;
            }.bind(this));

            this.image.load(image_src);

            return this;
        },
        get_image: function (id) {
            if (this.image.surface.__ready === false) {
                throw new Error("sprite not ready");
            }

            if (!this.properties[id]) {
                throw new Error("id not found");
            }


            var p = this.properties[id],
                img = new Radamn.Image({
                    width: p.w,
                    height: p.h,
                    clipping: [p.x, p.y, p.w, p.h]
                });

            img.surface = this.image.surface;

            return img;
        },
        set_image: function (img, id, set_size) {
            if (this.image.surface.__ready === false) {
                throw new Error("sprite not ready");
            }

            if (!this.properties[id]) {
                throw new Error("id not found");
            }

            set_size = set_size || false;

            var p = this.properties[id];

            if (set_size) {
                img.width = p.w;
                img.height = p.h;
            }
            img.clipping = [p.x, p.y, p.w, p.h];

            img.surface = this.image.surface;
        }
    });

    Sprite.disable_autoset();

    exports.Sprite = Sprite;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));