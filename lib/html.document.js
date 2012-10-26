(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? $.Class : require("node-class").Class;

    var Document = new Class("Document", {
        onkeypress: null,
        onkeydown: null,
        onkeyup: null,
        onmousedown: null,
        onmouseup: null,
        onmousemove: null,
        onmouseout: null,
        onclick: null,
        ondblclick: null,
        onfocus: null,
        onblur: null,
    });

    Document.implements({
        __construct: function() {
            this.__input_listener.bind(this).periodical(50);
        },
        __input_listener: function() {
            var data = null;
            while ((data = CRadamn.pollEvent()) !== false) {
                Radamn.emit(data.type,data);
                if(this["on" + data.type]) {
                    this["on" + data.type](data);
                }
            }
        },
        getElementById: function() {
            console.trace();
            return {
                style: {},
                appendChild: function() {}
            };
        },

        createElement: function(type) {
            switch(type) {
                case "div":
                    //fake for mariokart demo, but it should raise!
                    return {
                        style: {},
                        appendChild: function() {}
                    };
                break;
                case "canvas":
                    return new HTMLCanvasElement();
                break;
                case "image":
                    return new Image();
                break;
                default:
                    throw new Exception("createElement("+type+") not supported");
            }
            console.trace();
        }
    });

    global.document = new Document();

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));