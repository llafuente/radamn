(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        __debug = function () {}, //console.log,
        Scene,
        RootNode;

    // just a clone, i have future plans
    RootNode = new Class("RootNode", {
        scene: null,
        layer: null
    });
    RootNode.Extends(Radamn.Node);
    RootNode.Implements({
    });

    //copy Animate properties!
    RootNode.prototype.$__animation = Radamn.Node.prototype.$__animation;

    exports.RootNode = RootNode;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));