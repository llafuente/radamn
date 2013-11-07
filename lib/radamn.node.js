(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? window.assert : require("assert"),
        Matrix2D = browser ? window.Matrix2D : require("js-2dmath").Matrix2D,
        BB2 = browser ? window.BB2 : require("js-2dmath").BB2,
        Vec2 = browser ? window.Vec2 : require("js-2dmath").Vec2,
        Rectangle = browser ? window.Rectangle : require("js-2dmath").Rectangle,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        OUTSIDE = Intersection.OUTSIDE,
        Movable = browser ? window.Radamn.Movable : require("./radamn.movable.js").Movable,
        nodes = -1,
        Node,
        min = Math.min,
        max = Math.max,
        __debug = function () {}; //console.log;

    /**
     * @class Node
     */
    Node = new Class("Node",/** @lends Node.prototype */{
        // clipping frustum visibility
        __visibility: true,

        //user visible
        visible: true,
        alpha: 1,

        /**
         * @member Node
         * @type String
         */
        id: "Node",
        /**
         * list of bodies in local position
         * @member Node
         * @type Array
         * @private
         */
        __body: [],
        /**
         * list of bodies in world position cache for ray performance!
         * @member Node
         * @type Array
         * @private
         */
        __wbody: [],
        /**
         * @member Node
         * @type Array
         */
        childNodes: [],
        /**
         * @member Node
         * @type Array
         */
        childEntities: [],
        /**
         * @member Node
         * @type Node
         */
        parentNode: null,
        /**
         * @member Node
         * @private
         * @type Boolean
         */
        __changed: false,
        /**
         * @member Node
         * @type Boolean
         */
        __freezed: false,
        /**
         * @member Node
         * @type Number
         */
        center: 1,
        center_offset: null,
        isRoot: false,
        matrix: null
    });

    Node.Extends(Movable);

    Node.prototype.$__animation = Movable.prototype.$__animation;
    Node.setAnimationProterties = Movable.setAnimationProterties;

    Node.Implements({
        /**
         * Initialize the CanvasNode and merge an optional config hash.
         * @member Node
         * @constructor
         * @param {Node} root
         */
        __construct: function (options) {
            this.parent();

            this.matrix = Matrix2D.create();

            this.childNodes = [];
        },
        /**
         * @member Node
         * @returns Node this for chaining
         */
        freeze: function () {
            this.__freezed = true;
            this.readonly = true;

            return this;
        },
        /**
         * @member Node
         * @returns Node this for chaining
         */
        unfreeze: function () {
            this.__freezed = false;
            this.readonly = false;

            return this;
        },
        /**
         * Initialize the CanvasNode and merge an optional config hash.
         *
         * @member Node
         * @returns Vector2
         */
        getWorldPosition: function () {
            var node = this,
                out = [-this.offset[0], -this.offset[1]],
                pos;

            while (node !== null) {
                pos = node.getPosition();

                out[0] += pos[0];
                out[1] += pos[1];

                node = node.isRoot ? null : node.parentNode;
            }

            return out;
        },
        getDerivedPosition: function (include_root) {
            include_root = include_root === true;

            var node = this,
                out = [0, 0],
                pos;

            if (node.isRoot) {
                return include_root ? this.getPosition() : out;
            }

            do {
                pos = node.getPosition();

                out[0] += pos[0];
                out[1] += pos[1];

                node = node.parentNode;
            } while (!node.isRoot);

            if (include_root) {
                pos = node.getPosition();

                out[0] += pos[0];
                out[1] += pos[1];
            }

            return out;
        },
        /**
         * @member Node
         * @returns Node null if cannot be found
         */
        getNextSibling: function () {
            if (this.parentNode) {
                return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
            }
            return null;
        },
        /**
         * @member Node
         * @returns Node null if cannot be found
         */
        getPreviousSibling: function () {
            if (this.parentNode) {
                return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1];
            }
            return null;
        },
        /**
         * Create a new Node, append it and return it
         * @member Node
         * @returns Node
         */
        createNode: function (id) {
            var node = new Radamn.Node({
                id: id || ("node-" + (++nodes))
            });

            this.appendChild(node);

            return node;
        },
        hasChildren: function () {
            return this.childNodes.length > 0;
        },
        /**
         * Appends arguments as childNodes to the node.
         *
         * Adding a child sets child.parentNode to be the node and calls
         * child.setRoot(node.root)
         *
         * @member Node
         * @param Array obj list of nodes or a single node
         * @returns Node this for chaining
         */
        appendChild: function (obj) {
            var a = Array.ize(arguments),
                i;

            for (i = 0; i < a.length; ++i) {
                if (a[i].parentNode) {
                    a[i].removeSelf();
                }
                this.childNodes.push(a[i]);
                a[i].parentNode = this;
            }

            return this;
        },
        /**
         * Removes all childNodes from the node.
         * @member Node
         * @returns Node this for chaining
         */
        removeAllChildren: function () {
            this.removeChild.apply(this, this.childNodes);

            return this;
        },
        /**
         * Removes arguments from the node's childNodes.
         *
         * Removing a child sets its parent to null and calls child.setRoot(null)
         *
         * @member Node
         * @param Array list of nodes or a single node
         * @returns Node this for chaining
         */
        removeChild: function (obj) {
            var i,
                idx;

            for (i = 0; i < arguments.length; ++i) {
                obj = arguments[i];

                idx = this.childNodes.indexOf(obj);
                if (idx !== -1) {
                    this.childNodes.splice(idx, 1);
                    obj.parentNode = null;
                }
            }

            return this;
        },
        /**
         * Calls this.parent.removeChild(this) if this.parent is set.
         * @member Node
         * @returns Node this for chaining
         */
        removeSelf: function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }

            return this;
        },
        /**
        * TODO compute BB/AABB with current node matrix
        * @member Node
        * @returns Rectangle
        */
        getBoundingBox: function () {
            var bb = [0, 0, 0, 0],
                i,
                pos,
                scl,
                node;

            for (i = 0; i < this.childEntities.length; ++i) {
                if (this.childEntities[i].getBoundingBox) {
                    BB2.merge(bb, bb, this.childEntities[i].getBoundingBox());
                }
            }

            for (i = 0; i < this.childNodes.length; ++i) {
                node = this.childNodes[i];
                pos = node.getPosition();

                BB2.offsetMerge(bb, bb, node.getBoundingBox(), pos);
            }

            scl = this.getScale();

            bb[0] *= scl[0];
            bb[1] *= scl[1];
            bb[2] *= scl[0];
            bb[3] *= scl[1];

            return bb;
        },
        /**
         * Appends arguments as childNodes to the node.
         *
         * Adding a child sets child.parentNode to be the node and calls
         * child.setRoot(node.root)
         *
         * @member Node
         * @param Array list of nodes or a single node
         * @returns Node this for chaining
         */
        appendEntity: function (obj) {
            var a = Array.ize(arguments),
                i;
            for (i = 0; i < a.length; ++i) {
                this.childEntities.push(a[i]);
                a[i].parentNode = this;
            }
            //var aabb = new AABB();
            //aabb.ComputeAABBFromPoly(/*??*/);

            return this;
        },
        /**
         * Removes all childNodes from the node.
         *
         * @member Node
         * @returns Node this for chaining
         */
        removeAllEntities: function () {
            this.removeEntity.apply(this, this.childEntities);

            return this;
        },
        /**
         * Removes arguments from the node's childNodes.
         *
         * Removing a child sets its parent to null and calls child.setRoot(null)
         *
         * @member Node
         * @param Array list of nodes or a single node
         * @returns Node this for chaining
         */
        removeEntity: function (obj) {
            var i,
                idx;

            for (i = 0; i < arguments.length; ++i) {
                obj = arguments[i];
                idx = this.childEntities.indexOf(obj);

                if (idx !== -1) {
                    this.childEntities.splice(idx, 1);
                    obj.parentNode = null;
                }
            }

            return this;
        },
        /**
         * Get all entities recursive from this node and his children
         *
         * @member Node
         * @returns Array list of Resources
         */
        getAllSubEntites: function () {
            var output = this.childEntities.clean(),
                i;
            for (i = 0; i < this.childNodes.length; ++i) {
                output = output.combine(this.childNodes[i].getAllSubEntites());
            }
            return output;
        },
        getEntity: function (i) {
            return this.childEntities[i];
        },
        /**
         * @member Node
         * @param Primitive
         * @returns Node this for chaining
         */
        addToBody: function (primitive) {
            this.__body.push(primitive);
            this.__wbody.push(Array.clone(primitive, true));

            // little hack to force the update of bodies
            this.matrix[7] = true;

            return this;
        },
        /**
         * @member Array with primitives
         */
        getBodyList: function () {
            return this.__body;
        },
        /**
         * check collision between operand and all Node bodies
         * @member Node
         * @returns Intersection
         */
        collide: function (operand) {
            if (this.__body.length === 0) {
                return {success: false, reason: "nobody"}; //no-body ?
            }

            if (this.__body.length > 1) {
                throw new Error("multiple body collision is not supported atm!");
            }

            // todo support more operands!
            return Intersection.rectangle_vec2(this.__wbody[0], operand);
        },
        /**
         * Get all entities recursive from this node and his children
         *
         * @member Node
         * @returns Array list of Resources
         */
        each: function (fn) {
            var i;
            for (i = 0; i < this.childNodes.length; ++i) {
                fn(this.childNodes[i]);
            }
        },
        /**
         * Get all entities recursive from this node and his children
         *
         * @member Node
         * @returns Array list of Resources
         */
        eachEntity: function (fn) {
            var i;
            for (i = 0; i < this.childEntities.length; ++i) {
                fn(this.childEntities[i]);
            }
        },
        debug: function () {
            var nodes = [];

            if (this.childNodes.length) {
                this.each(function (node) {
                    var d = node.debug();
                    if (d.length) {
                        nodes.push(node.id + "\n  " + d.join("\n  "));
                    } else {
                        nodes.push(node.id);
                    }
                });
            }

            if (this.childEntities.length) {
                this.eachEntity(function (e) {
                    if (e.id !== undefined) {
                        nodes.push("* " + e.id);
                    } else {
                        nodes.push("* unnamed");
                    }
                });
            }

            return nodes;
        },
        tick: function (delta, force_update) {
            this.parent(delta);

            force_update = force_update === true;

            var i;

            if (force_update || this.matrix[7]) {
                if (this.__body.length) {
                    Rectangle.translate(this.__wbody[0], this.__body[0], this.getWorldPosition());

                    this.matrix[7] = false;

                    // check visible
                    this.visibilityCheck();
                }

                force_update = true;
            }

            this.emit("tick", [delta]);

            for (i = 0; i < this.childNodes.length; ++i) {
                this.childNodes[i].tick(delta, force_update);
            }

            for (i = 0; i < this.childEntities.length; ++i) {
                this.childEntities[i].emit("tick");
            }
        },
        getScene: function () {
            var node = this,
                scene;

            while (!node.isRoot) {
                node = node.parentNode;
            }
            return node.scene;
        },
        visibilityCheck: function (scene) {
            var node;

            if (this.__wbody.length) {
                // get scene
                scene = scene || this.getScene();

                this.__visibility = scene.isVisible(this.__wbody[0]);
            }

            return this.__visibility;
        },
        prerender: function (ctx) {
            if (this.alpha !== 1) {
                // this maybe need to be multiplied!
                ctx.globalAlpha = this.alpha;
            }
            if (this.__debug === true) {
                var bb = this.getBoundingBox();

                ctx.font="12px Consolas";
                ctx.fillText(this.id, 0, 0);

                ctx.strokeStyle = "red";
                ctx.strokeRect(bb[0],bb[1],bb[2],bb[3]);
            }

        },
        // this maybe need to be in movable...
        postrender: function (ctx) {
            var off = this.offset;
            if (off[0] !== 0 || off[1] !== 0) {
                ctx.translate(off[0], off[1]);
            }
        },
        ray: function (x, y) {
            if (this.visible === false) {
                return {success: false, reason: 99}; // hidden
            }

            var i,
                offset = this.getScene().getCamera().getPosition(),
                vec2 = [x + offset[0], y + offset[1]];

            return this.collide(vec2);
        },
        behavior: function (type, options) {
            options = options || {};

            switch (type) {
            case "clickable":
                Radamn.on("pointerclick", function (event) {
                    var collision = this.ray(event.x, event.y);
                    if (collision.reason < OUTSIDE) {
                        this.emit("click");
                    }
                }.bind(this));
                break;
            }

            return this;
        }
    });
/*
    Node.setAnimationProterties("alpha", {
        mask: '@d',
        type: "number",
        render: function renderer(element, property, value, unit) {
            element.alpha = value;
        }
    });
*/
    Node.hide(["__body", "__changed", "__freezed"]);

    exports.Node = Node;


}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));