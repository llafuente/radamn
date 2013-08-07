(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? NodeClass.Class : require("node-class").Class,
        path = require("path"),
        basepath = path.dirname(process.mainModule.filename),

        Image;

    function load_image(image) {

        image.__pointer = CRadamn.Image.load(path.join(basepath, image.__src), false);
        image.width = image.__pointer.width;
        image.height = image.__pointer.height;
        if(image.onload) {
            image.onload.bind(image)();
        }

    }

    Image = global.HTMLImageElement = new Class("HTMLImageElement", {
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
    });

    Image.Extends(Element);

    Image.property("src",
    /*get*/function() {
        return this.__src;
    },
    /*set*/function(src) {
        this.__src = src;
        // load in the future! this is needed because CRadamn do not use lib_uv yet.
        load_image.delay(0, this, [src])
    });

    Image.hide(["__src", "__pointer"]);


    global.Image = function(width, heigth) {
        return new Image(width, heigth);
    };

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));