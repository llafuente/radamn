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
         * Read only
         * @member Animation
         * @type Boolean
         */
        isStop: true,
        /**
         * @member AnimationOptions
         * @type Array
         */
        animation: [],
        /**
         * @member AnimationOptions
         * @type Boolean
         */
        loop: false,
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
         * @param Pointer image_ptr
         * @param AnimationOptions options
         * @constructor
         */
        __construct: function (options) {
            this.parent(options);
            this.__rotation_delay = (1 / this.fps) * 1000;

            return this;
        },
        /**
         * @member Animation
         * @param Mixed Boolean: true forever loop, false no loop. Number: loop n times
         * @returns Animation this for chaining
         */
        play: function (loop_or_times) {
            if (loop_or_times === true) {
                this.__remaining_times = false;
                this.loop = true;
            } else if (loop_or_times === false) {
                this.__remaining_times = false;
                this.loop = false;
            } else if (loop_or_times !== undefined) {
                this.loop = true;
                this.__remaining_times = parseInt(loop_or_times, 10);
            }
            this.isStop = false;

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

            ctx.drawImage(this,
                this.animation[this.__frame][0],
                this.animation[this.__frame][1],
                this.animation[this.__frame][2],
                this.animation[this.__frame][3],
                0,
                0,
                this.animation[this.__frame][2],
                this.animation[this.__frame][3]
                );

            if (this.isStop) {
                return;
            }

            if (this.__actumulated_time > this.__rotation_delay) {
                this.__frame += Math.floor(this.__actumulated_time / this.__rotation_delay);
                this.__actumulated_time = this.__actumulated_time % this.__rotation_delay;

                if (this.__frame >= this.animation.length) {
                    this.__frame = 0;
                    if (this.loop === false) {
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

    exports.Animation = Animation;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));