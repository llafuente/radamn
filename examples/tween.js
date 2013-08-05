(function (exports, browser) {
    "use strict";

    if(!browser) {
        require("./../lib/radamn");
    }

    var idemo = browser ? demo : require("./plugins/demo.js"),
        __debug = browser ? NodeClass.debug : require("node-class").debug,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        /**
        * @type Window
        */
        win = idemo.demoWindow(640, 480, "math"),
        canvas = win.getContext(),
        /**
        * @type Image
        */
        image = Radamn.Assets.getImage("./resources/images/rock.png"),
        node = win.getRootNode(),
        childnode1 = new Radamn.Node(),
        counter = 0,
        animation_properties = {
            transition: Animate.Transitions.Linear,
            time: 2000,
            fps: 60
        };

    node.on("click", function (e) {
        __debug(e);
    });


    childnode1.appendEntity(image);

    node.appendChild(childnode1);

    animation_properties.property = "x";
    childnode1.animate(animation_properties, [0, 250]);

    // chain! and morph!
    childnode1.once("animation:end", function () {

        animation_properties.property = "y";
        childnode1.animate(animation_properties, [0, 250]);
        childnode1.once("animation:end", function () {

            animation_properties.property = "scale";
            childnode1.animate(animation_properties, ["1 1", "2 2"]);
            childnode1.once("animation:end", function () {

                animation_properties.property = "rotate";
                childnode1.animate(animation_properties, [0, 90]);
                childnode1.once("animation:end", function () {

                    animation_properties.property = "skew";
                    childnode1.animate(animation_properties, ["0 0", "30 30"]);
                });
            });
        });
    });

    win.onRequestFrame = function (delta) {
        ++counter;

        win.render(delta);
    };

    Radamn.start(1000 / 50);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));