//enable use of Radamn in a browser and sever mode!

(function (exports, browser) {
    "use strict";

    var __info = browser ? NodeClass.info : require("node-class").info;

    function notimplemented() {
        console.trace();
        //throw new Error("not implemented!!");
    }

    if (browser) {
        exports.CRadamn = {
            init: function () {
            },
            quit: notimplemented,
            getVersion: function () {
                return "browser";
            },
            createWindow: function (width, height) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                document.body.appendChild(canvas);

                return canvas;
            },
            getJoysticks: notimplemented,
            pollEvent: function () {
                return false;
            },
            getVideoModes: notimplemented,
            Window: {
                setCaption : function (caption) {
                    __info("ignore caption", caption);
                },
                setIcon: notimplemented,
                screenshot: notimplemented
            },
            GL: {
                setBackgroundColor: notimplemented,
                clear: notimplemented,
                flipBuffers: notimplemented,
                transform: notimplemented,
                setTransform: notimplemented,
                stroke: notimplemented,
                fill: notimplemented,
                translate: notimplemented,
                rotate: notimplemented,
                scale: notimplemented,
                save: notimplemented,
                restore: notimplemented
            },
            Font: {
                load: notimplemented,
                getImage: notimplemented,
                destroy: notimplemented,
                measureText: notimplemented
            },
            Image: {
                load: function (path) {
                    var img = new Image();
                    img.path = path;
                    img.src = path;

                    img.__ready = false;
                    img.onload = function () {
                        __info("image loaded!");
                        img.__ready = true;
                    };

                    return img;
                },
                destroy: notimplemented,
                draw: notimplemented
            }
        };
    }

}(typeof exports === "undefined" ? this : global, typeof exports === "undefined"));