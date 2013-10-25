(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        Rectangle = browser ? window.Rectangle : require("js-2dmath").Rectangle,
        Matrix2D = browser ? window.Matrix2D : require("js-2dmath").Matrix2D,
        Camera,
        chaser_steps,
        Movable = browser ? window.Radamn.Movable : require("./radamn.movable.js").Movable,
        debug = function () {}; //debug;

    /**
     * @class Camera
     */
    Camera = new Class("RadamnCamera",/** @lends Camera.prototype */{
        scene: null,
        frustum: null
    });

    Camera.Extends(Movable);

    Camera.Implements(/** @lends Camera.prototype */{
        __construct: function (options) {
            this.parent();

            this.matrix = Matrix2D.create();
            this.frustum = Rectangle.create(0, 0, this.scene.width, this.scene.height);
            return this;
        },
        getBoundingBox: function() {
            return [0, 0, 0, 0, false];
        },
        tick: function (delta) {
            if (isNaN(delta)) {
                throw new Error("trace me!");
            }

            this.parent(delta);

            var pos = [0, 0];
            Matrix2D.getPosition(pos, this.matrix);

            pos[0] = -(this.frustum[0][0] + pos[0]);
            pos[1] = -(this.frustum[1][1] + pos[1]);

            if (pos[0] !== 0 || pos[1] !== 0) {
                Rectangle.translate(this.frustum, this.frustum, pos);
                this.scene.forEachNode(function (node) {
                    node.visibilityCheck();
                });
                // visibilityCheck for everyone!
            }
        }
    });

    exports.Camera = Camera;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));