(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? $.Class : require("node-class").Class,
        path = require("path"),
        basepath = path.dirname(process.mainModule.filename),

        HImage = global.HTMLImageElement = new Class("HTMLImageElement", {
            alt: '',
            __src: '',
            __pointer: '', // this is where we save the GL Image
            srcset: '',
            crossOrigin: '',
            useMap: '',
            isMap: false,
            width: 0,
            height: 0,
            naturalWidth: 0,
            naturalHeight: 0,
            complete: false,
            onload: null,
            onerror: null,
            style: {},
        });

    HImage.property("src",
    /*get*/function() {
        return this.__src;
    },
    /*set*/function(src) {
        this.__src = src;
        // load in the future! this is needed because CRadamn do not use lib_uv yet.
        this.__load.pass([src], this).delay(0);
    });

    HImage.implements({
        __load: function() {

            console.log("loading image: ", this.__src);
            this.__pointer = CRadamn.Image.load(path.join(basepath, this.__src), false);
            console.log("image loaded: ", this.__src);
            this.width = this.__pointer.width;
            this.height = this.__pointer.height;
            console.log(this.onload);
            if(this.onload) {
                this.onload.bind(this)();
            }
        }
    });

    HImage.hide(["__src", "__pointer", "__load"]);


    global.Image = function(width, heigth) {
        return new HImage(width, heigth);
    };

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));