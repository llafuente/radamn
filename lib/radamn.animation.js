/**
 * @class Animation
 * @extends Image
 */
var Animation = new Class(
/** @lends Animation.prototype */
{
    Extends: Radamn.Image,
    /**
     * @member Animation
     * @type Number
     */
    frame: 0,
    /**
     * @member Animation
     * @type Boolean
     */
    stopped: true,
    /**
     * @member Animation
     * @type Boolean
     */
    remaining_times: false,
    changeImageEvery: 0,
    actumulatedTime: 0,
    options: {
        animation: [],
        loop: false,
        fps: 12
    },
    /**
     * @member Animation
	 * @constructs
     */
    initialize: function(pointer_to_surface, options) {
        this.parent(pointer_to_surface, options);
        this.changeImageEvery = (1 / this.options.fps) * 1000;
    },
    /**
     * @member Animation
     * @param {Boolean/Number} loop_or_times Boolean: true forever loop, false no loop. Number: loop n times
     */
    play: function(loop_or_times) {
        if(loop_or_times === true) { this.remaining_times = false; this.options.loop = true;}
        else if(loop_or_times === false) { this.remaining_times = false; this.options.loop = false;}
        else if(loop_or_times !== undefined) {
            this.options.loop = true;
            this.remaining_times = parseInt(loop_or_times, 10);
        }
        this.stopped = false;
    },
    /**
     * @member Animation
	 */
    stop:function() {
        this.stopped = true;
    },
    /**
     * @member Animation
	 */
    draw: function(ctx, delta) {
        this.actumulatedTime +=delta;
        /* this is for nodes
        switch(this.options.origin) {
            case $D.ORIGIN_CENTER:
                ctx.translate(-this.options.width * 0.5, -this.options.height* 0.5);
                ctx.drawImage(this.imgEl, this.options.animation[this.frame].x, this.options.animation[this.frame].y, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height);
                break;
            case ORIGIN_TOP_LEFT:
                ctx.drawImage(this.imgEl, this.options.animation[this.frame].x, this.options.animation[this.frame].y, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height);
                break;
        }
        */

        ctx.drawImage(this,
            this.options.animation[this.frame][0],
            this.options.animation[this.frame][1],
            this.options.animation[this.frame][2],
            this.options.animation[this.frame][3],
            0,
            0,
            this.options.animation[this.frame][2],
            this.options.animation[this.frame][3]
        );

        if(this.stopped) return ;
        if(this.actumulatedTime > this.changeImageEvery) {
            this.frame += Math.floor(this.actumulatedTime / this.changeImageEvery);
            this.actumulatedTime = this.actumulatedTime % this.changeImageEvery;

            if(this.frame >= this.options.animation.length) {
                this.frame = 0;
                if(this.options.loop === false) this.stopped = true;
                if(this.remaining_times !== false) {
                    --this.remaining_times;
                    if(this.remaining_times == 0) {
                        this.stopped = true;
                    }
                }
            }
        }
    }
});

module.exports.Animation = Animation;
