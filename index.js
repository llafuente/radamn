(function (exports, browser) {
    "use strict";


    var enviroment = "node";

    if("undefined" === typeof module) {
        // brower!
        enviroment = "browser";
    }

    if("undefined" !== typeof Ejecta) {
        // brower!
        enviroment = "ejecta";
    }


    switch(enviroment) {
    case "node":
        require('./lib/radamn.js');
        break;
    case "browser":
        [
            "/node_modules/js-2dmath/lib/math.js",
            "/node_modules/js-2dmath/lib/vec2.js",
            "/node_modules/js-2dmath/lib/line2.js",
            "/node_modules/js-2dmath/lib/segment2.js",
            "/node_modules/js-2dmath/lib/circle.js",
            "/node_modules/js-2dmath/lib/rectangle.js",
            "/node_modules/js-2dmath/lib/polygon.js",
            "/node_modules/js-2dmath/lib/matrix2d.js",
            "/node_modules/js-2dmath/lib/beizer.js",
            "/node_modules/js-2dmath/lib/distance.js",
            "/node_modules/js-2dmath/lib/intersection.js",
            "/node_modules/js-2dmath/lib/boundingbox2.js",

            "/node_modules/function-enhancements/lib/functions.js",
            "/node_modules/object-enhancements/lib/objects.js",
            "/node_modules/array-enhancements/lib/arrays.js",

            "/node_modules/node-class/index.js",
            "/node_modules/node-class/lib/sugar.js",
            "/node_modules/node-class/lib/class.js",
            "/node_modules/node-class/lib/eventmachine.js",
            "/node_modules/node-class/lib/eventize.js",
            "/node_modules/node-class/lib/events.js",
            "/node_modules/node-class/lib/sequence.js",
            "/node_modules/node-class/lib/animate.js",
            "/node_modules/node-class/lib/iterable.js",

            "/lib/sax.js",
            "/lib/assert.js",
            "/lib/shim.cradamn.js",
            "/lib/radamn.math.js",
            "/lib/radamn.js",
            "/lib/radamn.$.js",
            "/lib/radamn.movable.js",
            "/lib/radamn.node.js",
            "/lib/radamn.rootnode.js",
            "/lib/radamn.layer.js",
            "/lib/radamn.camera.js",
            "/lib/radamn.scene.js",
            "/lib/radamn.assets.js",
            "/lib/radamn.request.js",
            "/lib/radamn.resource.js",
            "/lib/radamn.resource.rendereable.js",
            "/lib/radamn.image.js",
            "/lib/radamn.font.js",
            "/lib/radamn.animation.js",
            "/lib/radamn.tmx.js"
        ].forEach(function (f, k) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            script.src = f;
            document.head.appendChild(script);
        });
        break;
    }

    if (!browser) {
    } else {

    }

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));