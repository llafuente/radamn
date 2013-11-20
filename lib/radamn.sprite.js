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
        ready: false,
        _scale: [1, 1],
        animations: null
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
        __construct: function (image_src, images, animations) {
            this.parent({});

            this.properties = images;
            this.animations = animations || {};

            this.image = new Radamn.Image();

            this.image.on("image:loaded", function () {
                this.emit("sprite:loaded", []);
                this.ready = true;
            }.bind(this));

            this.image.load(image_src);

            return this;
        },
        scale: function (x, y) {
            this._scale[0] = x;
            this._scale[1] = y;
        },
        exists: function (id) {
            return !!this.properties[id];
        },
        get_size: function (id) {
            if (this.image.surface.__ready === false) {
                throw new Error("sprite not ready");
            }

            if (!this.properties[id]) {
                throw new Error("id not found: " + id);
            }

            return this.properties[id];
        },
        get_image: function (id) {
            var p = this.get_size(id),
                img = new Radamn.Image({
                    width: p.w,
                    height: p.h,
                    clipping: [p.x, p.y, p.w, p.h, p.w * this._scale[0], p.h * this._scale[1]]
                });

            img.surface = this.image.surface;

            return img;
        },
        set_image: function (img, id) {
            if (this.image.surface.__ready === false) {
                throw new Error("sprite not ready");
            }

            if (!this.properties[id]) {
                throw new Error("[" + id + "] id not found");
            }

            var p = this.properties[id];

            img.width = p.w;
            img.height = p.h;

            img.setClipping(p.x, p.y, p.w, p.h, p.w * this._scale[0], p.h * this._scale[1]);

            img.surface = this.image.surface;
        },
        _get_animation: function(options) {
            return new Radamn.Animation(this, options.images, options.fps);
        },
        get_animation: function(id) {
            if (this.image.surface.__ready === false) {
                throw new Error("sprite not ready");
            }

            if (!this.animations[id]) {
                throw new Error("[" + id + "] id not found");
            }

            return this._get_animation(this.animations[id]);
        },
    });

    Sprite.disable_autoset();

    exports.Sprite = Sprite;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));