(function (exports, browser) {
    "use strict";

    if (!browser) {
        require('./lib/radamn.js');
    } else {
        [
            "/lib/sax.js",
            "/lib/assert.js",
            "/function-enhancements/lib/function-enhancements.js",
            "/node-class/index.js",
            "/node-class/lib/sugar.js",
            "/node-class/lib/class.js",
            "/node-class/lib/events.js",
            "/node-class/lib/eventize.js",
            "/node-class/lib/sequence.js",
            "/node-class/lib/iterable.js",
            "/node-class/lib/eventmachine.js",
            "/node-class/lib/animate.js",
            "/lib/shim.cradamn.js",
            "/lib/radamn.math.js",
            "/lib/math/vec2.js",
            "/lib/math/line2.js",
            "/lib/math/segment2.js",
            "/lib/math/circle.js",
            "/lib/math/rectangle.js",
            "/lib/math/polygon.js",
            "/lib/math/matrix2d.js",
            "/lib/math/beizer.js",
            "/lib/radamn.js",
            "/lib/radamn.$.js",
            "/lib/radamn.node.js",
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
    }

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));