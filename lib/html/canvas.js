(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? NodeClass.Class : require("node-class").Class,
        first_window_created = false,
        ctx = null,
        HCanvas = global.HTMLCanvasElement = new Class("HTMLCanvasElement", {
            __window_height: 0,
            __window_width: 0,
            __created: false,
            width: 0,
            height: 0,
        });

    HCanvas.Extends(Element);


    HCanvas.property("height",
    /*get*/function() {
        return this.__window_height;
    },
    /*set*/function(src) { // TODO -> resize
        this.__window_height = src;
    });

    HCanvas.property("width",
    /*get*/function() {
        return this.__window_width;
    },
    /*set*/function(src) { // TODO -> resize
        this.__window_width = src;
    });

    HCanvas.Implements({
        getContext: function(context) {
            switch(context) {
                case '2d' :
                    if(!first_window_created) {
                        ctx = new CanvasRenderingContext2D();
                        var win = Radamn.createScene(this.__window_width, this.__window_height);
                        //win.setContext(ctx);

                        ctx.__win = win;

                        first_window_created = true;
                    }
                    return ctx;
                break;
            }
            throw new Error("getContext("+context+")not supported");
        }
    });

    HCanvas.hide(["__window_height", "__window_width", "__created"]);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));