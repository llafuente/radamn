//enable use of Radamn in a browser and sever mode!

(function(exports, browser) {
    function notimplemented() {
        throw new Error("not implemented!!");
    }
    var CRadamn = null;

    if(browser) {
        CRadamn = {
            init: function () {
            },
            quit: notimplemented,
            getVersion: function () {
                return "browser";
            },
            createWindow: function(width, height) {
            console.log("--------------------->>>>>>>>>", width, height);
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                canvas.inject(document.body);
                return canvas;
            },
            getJoysticks: notimplemented,
            pollEvent: function() {
                return false;
            },
            getVideoModes: notimplemented,
            Window: {
                setCaption : function(caption) {
                    console.log("ignore caption", caption);
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
                load: function(path) {
                },
                destroy: notimplemented,
                draw: notimplemented
            }
        };
    } else {
        CRadamn = {
            init: function () {
            },
            quit: function () {
            },
            getVersion: notimplemented,
            createWindow: notimplemented,
            getJoysticks: notimplemented,
            pollEvent: notimplemented,
            getVideoModes: notimplemented,
            Window: {
                setCaption : notimplemented,
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
                load: function() { console.log("ignore font.load"); return {__ready: true}},
                getImage: notimplemented,
                destroy: notimplemented,
                measureText: notimplemented
            },
            Image: {
                load: function() { console.log("ignore image.load"); return {__ready: true}},
                destroy: notimplemented,
                draw: notimplemented
            }
        };
    }

    exports.CRadamn = CRadamn;

})(typeof exports === "undefined" ? this : global, typeof exports === "undefined");