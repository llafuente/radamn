(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? $.Class : require("node-class").Class;

    var HImage = global.HTMLImageElement = new Class("HTMLImageElement", {
        alt: '',
        __src: '',
        __pointer: '',
        srcset: '',
        crossOrigin: '',
        useMap: '',
        isMap: false,
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0,
        complete: false,
        onLoad: null,
        onError: null
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
            console.log("__load!", this);
            this.__pointer = CRadamn.Image.load(this.src, false);
            this.width = this.__pointer.width;
            this.height = this.__pointer.height;
            if(this.onLoad) {
                this.onLoad.bind(this)();
            }
        }
    });

    HImage.hide(["__src", "__pointer", "__load"]);


    global.Image = function(width, heigth) {
        return new HImage(width, heigth);
    };

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));