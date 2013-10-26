(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        __debug = function () {}, //console.log,
        Scene,
        Layer,
        RootNode = browser ? window.Radamn.RootNode : require("./radamn.rootnode.js").RootNode;

    Layer = new Class("RadamnLayer", {
        id: null,
        scene: null,
        rootNode: null, //position/scale, etc.. here
        size: [0, 0],
        visible: true,
        origin: 0
    });

    Layer.CAMERA = 1;
    Layer.WORLD = 2;
    Layer.CANVAS = 3;

    Layer.Implements({
        __construct: function (options) {
            if (!(this.size instanceof Array)) {
                console.log(options);
                throw new Error("size is not an array ?");
            }
            this.rootNode = new RootNode({
                id: this.id + "/RootNode",
                scene: this.scene,
                layer: this
            });
            this.rootNode.isRoot = true;
        },
        getBoundingBox: function() {
            var v = this.rootNode.getPosition();

            return [v[0], v[1], this.size[0] + v[0], this.size[1] + v[1], true];
        },
        render: function (ctx, delta) {
            switch(this.origin) {
            case Layer.CAMERA:
                // it's the current!
                break;
            case Layer.WORLD:
                //who knows!
                break;
            case Layer.CANVAS:
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                break;
            default:
                throw new Error("invalid layer origin!");
            }
            this.rootNode.tick(delta);
            this.renderNode(ctx, delta, this.rootNode);

            return this;
        },
        renderNode: function(ctx, delta, node) {
            var i;

            if (node.visible === true && node.__visibility === true) {

                ctx.save();

                node.transform(ctx);
                node.prerender(ctx);

                for (i = 0; i < node.childEntities.length; ++i) {
                    node.childEntities[i].draw(ctx, delta);
                }

                node.postrender(ctx);

                for (i = 0; i < node.childNodes.length; ++i) {
                    this.renderNode(ctx, delta, node.childNodes[i]);
                }

                ctx.restore();
            }

            return this;
        },
        ray: function(vec2, bnode) {
            var offset,
                out,
                that = this;

            if (bnode === undefined) {
                return this.ray(vec2, this.rootNode);
            }

            out = [];

            if (bnode.hasChildren()) {

                bnode.each(function ray_each_node(node) {
                    var col = node.collide(vec2);
                    if (col.reason < Intersection.OUTSIDE) {
                        out.push(node);
                    }

                    if (node.hasChildren()) {
                        Array.combine(out, that.ray(vec2, node));
                    }
                });
            }

            return out;

        }
    });

    exports.Layer = Layer;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));