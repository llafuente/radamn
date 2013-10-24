(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? window.assert : require("assert"),
        Matrix2D = browser ? window.Matrix2D : require("js-2dmath").Matrix2D,
        Rectangle = browser ? window.Rectangle : require("js-2dmath").Rectangle,
        Intersection = browser ? window.Intersection : require("js-2dmath").Intersection,
        Movable = browser ? window.Radamn.Movable : require("radamn.movable.js").Movable,
        nodes = -1,
        Node,
        __debug = function () {}; //console.log;

    /**
     * @class Node
     */
    Node = new Class("Node",/** @lends Node.prototype */{
        // clipping frustum visibility
        __visibility: true,

        //user visible
        visible: true,

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
        __gbody: [],
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
        _afterRender: function (ctx) {
            if (this.center_offset) {
                ctx.translate(this.center_offset[0], this.center_offset[1]);
            }
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
        * @member Node
        * @returns Rectangle
        */
        getBoundingBox: function () {
            var i,
                bb = [0, 0, 0, 0],
                bb2,
                v;

            for (i = 0; i < this.childEntities.length; ++i) {
                if (this.childEntities[i].getBoundingBox) {
                    bb2 = this.childEntities[i].getBoundingBox();

                    bb[0] = Math.min(bb[0], bb2[0]);
                    bb[1] = Math.min(bb[1], bb2[1]);
                    bb[2] = Math.max(bb[2], bb2[2]);
                    bb[3] = Math.max(bb[3], bb2[3]);
                }
            }

            v = this.getScale();

            bb[0] *= v[0];
            bb[1] *= v[1];
            bb[2] *= v[0];
            bb[3] *= v[1];

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
            return Intersection.rectangle_vec2(this.__gbody[0], operand);
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
        tick: function (delta) {
            this.parent(delta);

            var i;

            if (this.matrix[7] && this.__body.length) {
                // this.__gbody[0] = this.__body[0].clone().translate(this.getDerivedPosition());
                // todo

                this.__gbody[0] = Rectangle.clone(this.__body[0]);

                Rectangle.translate(this.__gbody[0], this.__gbody[0], this.getDerivedPosition());

                this.matrix[7] = false;

                // check visible
                this.visibilityCheck();
            }

            this.emit("tick", [delta]);

            for (i = 0; i < this.childNodes.length; ++i) {
                this.childNodes[i].tick();
            }

            for (i = 0; i < this.childEntities.length; ++i) {
                this.childEntities[i].emit("tick");
            }
        },
        visibilityCheck: function (scene) {
            var node;

            if (this.__gbody.length === 0) {
                return this;
            }

            // get scene
            if (!scene) {
                node = this;
                while (!node.isRoot) {
                    node = node.parentNode;
                }
                scene = node.scene;
            }

            this.__visibility = scene.isVisible(this.__gbody[0]);

            return this;
        }
    });

    Node.hide(["__body", "__changed", "__freezed"]);

    exports.Node = Node;


}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));