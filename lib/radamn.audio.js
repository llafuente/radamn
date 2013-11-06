(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Audio;

    /**
     * @class Audio
     * @extends ResourceRendereable
     */
    Audio = new Class("RadamnAudio",/** @lends Audio.prototype */{
        /**
         * @member Audio
         * @retuns {String}
         */
        id: '',
        element: null,
        copies: []
    });

    Audio.Extends(Events);

    Audio.Implements({
        /**
         * @member Audio
         * @constructs
         */
        __construct: function (options) {
            this.parent();
            if (options.element) {
                console.log("listen!!!");
                this.element.addEventListener("loadedmetadata", function () {
                    console.log("audio loaded!!!");
                    this.clone(1);
                    this.emit("audio:loaded", [this]);
                }.bind(this));
            }
        },
        load: function (audio_src) {

            this.once("audio:loaded", function () {
                this.__ready = true;
            }.bind(this));

            this.element = Radamn.Assets.__getAudio(audio_src);
            this.element.addEventListener("loadedmetadata", function () {
                this.emit("audio:loaded", [this]);
                this.clone(1);
            }.bind(this));
        },
        clone: function(times) {
            console.log("clone", times);
            var i,
                audio;

            for (i = 0; i < times; ++i) {
                audio = document.createElement("audio");
                audio.src = this.element.src;
                audio.playing = false;

                this.copies.push(audio);

                audio.addEventListener("pause", function() {
                    audio.playing = false;
                }.bind(this));
                audio.addEventListener("ended", function() {
                    audio.playing = false;
                }.bind(this));
                audio.addEventListener("play", function() {
                    audio.playing = true;
                }.bind(this));
            }
            this.element
        },
        play: function () {
            var i;

            for (i = 0; i < this.copies.length; ++i) {
                if (this.copies[i].playing === false) {
                    this.copies[i].play();
                    return true;
                }
            }
            return false;
        },
        /// pause the first one in the list
        pause: function () {
            for (i = 0; i < this.copies.length; ++i) {
                if (this.copies[i].playing === true) {
                    this.copies[i].pause();
                    return true;
                }
            }
            return false;
        }
    });

    exports.Audio = Audio;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));