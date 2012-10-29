(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? $.Class : require("node-class").Class,
        element = global.HTMLCanvasElement = new Class("Element", {
            style: {},
            firstChild: null
        });


    element.implements({
        __construct: function() {
        },
        setAttribute: function(attr, val) {
            this[attr] = val;
        },
        appendChild: function() {
            return new element();
        },
        addEventListener: function(type, listener, useCapture) {
            useCapture = useCapture || false;

            this["on"+type] = listener;
        },
        removeEventListener: function(type, listener, useCapture) {
            useCapture = useCapture || false;

            this["on"+type] = null;
        },
    });

    global.Element = element;
    exports.Element = element;

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));