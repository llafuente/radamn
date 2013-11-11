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
        copies: [],
        current: 0
    });

    Audio.Extends(Events);

    Audio.Implements({
        /**
         * @member Audio
         * @constructs
         */
        __construct: function (options) {
            this.parent();

            options = options || {};

            if (options.element) {
                this.element.addEventListener("loadedmetadata", function () {
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
        clone: function (times) {
            var i,
                audio;

            for (i = 0; i < times; ++i) {
                audio = document.createElement("audio");
                audio.src = this.element.src;
                audio.playing = false;

                this.copies.push(audio);

                audio.addEventListener("pause", function () {
                    audio.playing = false;
                }.bind(this));

                audio.addEventListener("ended", function () {
                    audio.playing = false;
                }.bind(this));

                audio.addEventListener("play", function () {
                    audio.playing = true;
                }.bind(this));
            }
        },
        play: function () {
            var i = this.current,
                played = false;
            console.log("start width", i, this.copies);
            do {
                if (this.copies[i].playing === false) {
                    console.log("playing", i);
                    this.copies[i].play();
                    played = true;
                }
                ++i;
                if (this.copies.length === i) {
                    i = 0;
                }
            } while (i !== this.current && !played);
            console.log("end width", i);
            this.current = i;

            return false;
        },
        /// pause the first one in the list
        pause: function () {
            var i;
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