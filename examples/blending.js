(function (exports, browser) {
    "use strict";

    if(!browser) {
        require('./../lib/radamn');
    }

    var __debug = browser ? NodeClass.debug : require("node-class").debug,
        idemo = browser ? demo : require('./plugins/demo.js'),
        /**
        * @type Window
        */
        win = idemo.demoWindow(640, 480, "Blending Composite operations"),
        canvas = win.getContext(),
        /**
        * @type Image
        */
        image = Radamn.Assets.getImage("./resources/images/rock.png"),
        /**
        * @type Font
        */
        font = Radamn.Assets.getFont("./resources/fonts/Jura-DemiBold.ttf", 12),
        counter = 0,
        node = win.getRootNode();

    win.setBackgroundColor("#000000");

    node.on("click", function(e) {
        __debug(e);
    });

    win.onRequestFrame = function(delta) {
        ++counter;

        win.render(delta);

        var key = null,
            i = 0;

        for(key in Radamn.$.BLENDING) {
            canvas.save();

            canvas.globalCompositeOperation = Radamn.$.BLENDING.SOURCE_OVER;
            canvas.translate(128 *(i%4), 128 * Math.floor(i/4));
            canvas.drawImage(image.surface, 0, 0);
            canvas.translate(32, 32);
            canvas.globalCompositeOperation = Radamn.$.BLENDING[key];
            canvas.drawImage(image.surface, 0, 0);
            canvas.translate(-32, -32);

            canvas.globalCompositeOperation = Radamn.$.BLENDING.SOURCE_OVER;
            canvas.restore();
            font.fill(canvas, Radamn.$.BLENDING[key], "#00FF00", 128 *(i%4), 128 * Math.floor(i/4));

            ++i;
        }

    };

    Radamn.start(50);

    setInterval(function() {}, 500);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));