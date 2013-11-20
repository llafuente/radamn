(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Animation;

    /**
     * @class Animation
     * @extends Image
     */
    Animation = new Class("RadamnAnimation",/** @lends Animation.prototype */{
        /**
         * @member Animation
         * @private
         * @type Number
         */
        __frame: 0,
        /**
         * @member Animation
         * @private
         * @type Number
         */
        __rotation_delay: 0,
        /**
         * @member Animation
         * @private
         * @type Boolean
         */
        __remaining_times: false,
        /**
         * @member Animation
         * @private
         * @type Number
         */
        __actumulated_time: 0,
        /**
         * @member AnimationOptions
         * @type Boolean
         */
        __loop: false,
        /**
         * Read only
         * @member Animation
         * @type Boolean
         */
        isStop: true,
        /**
         * @member AnimationOptions
         * @type Array
         */
        images: [],
        /**
         * @member AnimationOptions
         * @type RadamnSprite
         */
        sprite: null,
        /**
         * @member AnimationOptions
         * @type Number
         */
        fps: 12
    });

    Animation.Extends(Radamn.Image);

    Animation.Implements({
        /**
         * <pre>Constructor<br />
         * use: new Radamn.Animation(image_ptr, {...})
         * </pre>
         * @member Animation
         * @constructor
         */
        __construct: function (sprite, images, fps) {
            this.sprite = sprite;
            this.images = images;
            this.fps = fps;

            this.parent({});

            this.__rotation_delay = (1 / this.fps) * 1000;

            this.sprite.set_image(this, this.images[this.__frame]);

            return this;
        },
        /**
         * @member Animation
         * @param Mixed Boolean: true forever loop, false no loop. Number: loop n times
         * @returns Animation this for chaining
         */
        play: function () {
            this.isStop = false;

            return this;
        },
        loop: function(times) {
            if (times === undefined) {
                this.__remaining_times = false;
            } else {
                this.__remaining_times = parseInt(times, 10);
            }
            this.__loop = true;

            return this;
        },
        /**
         * @member Animation
         * @returns Animation this for chaining
         */
        stop: function () {
            this.isStop = true;

            return this;
        },
        /**
         * @member Animation
         * @param Canvas
         * @param Number miliseconds since last frame
         */
        draw: function (ctx, delta) {
            this.__actumulated_time += delta;
            /* this is for nodes
            switch(this.origin) {
                case $D.ORIGIN_CENTER:
                    ctx.translate(-this.width * 0.5, -this.height* 0.5);
                    ctx.drawImage(this.imgEl, this.animation[this.__frame].x, this.animation[this.__frame].y, this.width, this.height, 0, 0, this.width, this.height);
                    break;
                case ORIGIN_TOP_LEFT:
                    ctx.drawImage(this.imgEl, this.animation[this.__frame].x, this.animation[this.__frame].y, this.width, this.height, 0, 0, this.width, this.height);
                    break;
            }
            */

            this.sprite.set_image(this, this.images[this.__frame]);

            this.parent(ctx, delta);

            if (this.isStop) {
                return;
            }

            if (this.__actumulated_time > this.__rotation_delay) {
                this.__frame += Math.floor(this.__actumulated_time / this.__rotation_delay);
                this.__actumulated_time = this.__actumulated_time % this.__rotation_delay;

                if (this.__frame >= this.images.length) {
                    this.__frame = 0;
                    if (this.__loop === false) {
                        this.isStop = true;
                    }

                    if (this.__remaining_times !== false) {
                        --this.__remaining_times;
                        if (this.__remaining_times === 0) {
                            this.isStop = true;
                        }
                    }
                }
            }
        }
    });

    Animation.disable_autoset();

    exports.Animation = Animation;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));