(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        Animate = browser ? NodeClass.Animate : require("node-class").Animate,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        assert = browser ? window.assert : require("assert"),
        nodes = 0,
        Node;

    /**
     * @class Node
     */
    Node = new Class("Node",/** @lends Node.prototype */{
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
        isRoot: false
    });

    Node.Extends(Matrix2D);
    Node.Extends(Events);

    Node.Extends(Animate, true, true);

    Node.topLeft = 1;
    Node.topMiddle = 2;
    Node.topRight = 3;
    Node.centerLeft = 4;
    Node.center = 5;
    Node.centerRight = 6;
    Node.bottomLeft = 7;
    Node.bottomMiddle = 8;
    Node.bottomRight = 9;

    Node.Implements({
        /**
         * Initialize the CanvasNode and merge an optional config hash.
         * @member Node
         * @constructor
         * @param {Node} root
         */
        __construct: function (options) {
            this.parent();

            this.childNodes = [];
        },
        /**
         * apply (overwrite) the transformation to the canvas
         * @returns Matrix2D this for chaining
         */
        setToCanvas: function (ctx) {
            __debug("setToCanvas", this.matrix);
            var p = this.matrix;
            ctx.setTransform(p[0], p[1], p[2], p[3], p[4], p[5]);

            return this;
        },
        //
        applyTransform: function (ctx) {
            var p = this.matrix;

            if (this.center_offset !== null) {
                ctx.transform(p[0], p[1], p[2], p[3], p[4] - this.center_offset.x, p[5] - this.center_offset.y);
            } else {
                ctx.transform(p[0], p[1], p[2], p[3], p[4], p[5]);
            }

            return this;
        },
        _afterRender: function (ctx) {
            if (this.center_offset) {
                ctx.translate(this.center_offset.x, this.center_offset.y);
            }
        },
        setCenter: function (c) {
            var bb;

            this.center = c;

            switch (c) {
            case Node.topLeft:
                // do nothing!
                this.center_offset = false;
                break;
            case Node.topMiddle:
                bb = this.getBoundingBox();
                this.center_offset = {x: (bb[2] * 0.5), y: 0};
                break;
            case Node.topRight:
                bb = this.getBoundingBox();
                this.center_offset = {x: bb[2], y: 0};
                break;

            case Node.centerLeft:
                bb = this.getBoundingBox();
                this.center_offset = {x: 0, y: (bb[2] * 0.5)};
                break;
            case Node.center:
                bb = this.getBoundingBox();
                this.center_offset = {x: (bb[2] * 0.5), y: (bb[2] * 0.5)};
                break;
            case Node.centerRight:
                bb = this.getBoundingBox();
                this.center_offset = {x: bb[2], y: (bb[2] * 0.5)};
                break;

            case Node.bottomLeft:
                bb = this.getBoundingBox();
                this.center_offset = {x: 0, y: bb[2]};
                break;
            case Node.bottomMiddle:
                bb = this.getBoundingBox();
                this.center_offset = {x: (bb[2] * 0.5), y: bb[2]};
                break;
            case Node.bottomRight:
                bb = this.getBoundingBox();
                this.center_offset = {x: bb[2], y: bb[2]};
                break;

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
                out = new Vec2(0, 0);

            if (node.isRoot) {
                return include_root ? this.getPosition() : out;
            }

            do {
                out.add(node.getPosition());
                node = node.parentNode;
            } while (!node.isRoot);

            if (include_root) {
                out.add(node.getPosition());
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
            this.touch();

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

            this.touch();

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
                bb2;

            for (i = 0; i < this.childEntities.length; ++i) {
                if (this.childEntities[i].getBoundingBox) {
                    bb2 = this.childEntities[i].getBoundingBox();


                    bb[0] = Math.min(bb[0], bb2[0]);
                    bb[1] = Math.min(bb[1], bb2[1]);
                    bb[2] = Math.max(bb[2], bb2[2]);
                    bb[3] = Math.max(bb[3], bb2[3]);
                }
            }

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
            this.touch();

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

            this.touch();

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
         * @deprecated
         * @member Node
         * @returns Node this for chaining
         */
        touch: function () {
            return;
            this.__changed = true;
            if (!this.isRoot) {
                var rootNode = this;
                while (rootNode.isRoot === false) {
                    rootNode = this.parentNode;
                }
                rootNode.touch();
            }

            return this;
        },
        /**
         * @member Node
         * @param Primitive
         * @returns Node this for chaining
         */
        addToBody: function (primitive) {
            assert.notEqual(["Polygon", "Rectangle", "Circle", "Segment2"].indexOf(__typeof(primitive)) !== -1, false, "Node::addToBody(" + __typeof(primitive) + ") is not a valid type ['polygon', 'rectangle', 'circle', 'segment2']");

            this.__body.push(primitive);

            // little hack to force the update of bodies
            this.mdirty = true;

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

            return Math.intersection(this.__gbody[0], operand);
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
            var i,
                scene;

            if (this.mdirty && this.__body.length) {
                this.__gbody[0] = this.__body[0].clone().translate(this.getDerivedPosition());
                this.mdirty = false;

                // check visible

                scene = Radamn.getScene()
                this.visible = scene.isVisible(this.__gbody[0]);
            }

            this.emit("tick", [delta]);

            for (i = 0; i < this.childNodes.length; ++i) {
                this.childNodes[i].tick();
            }

            for (i = 0; i < this.childEntities.length; ++i) {
                this.childEntities[i].emit("tick");
            }
        }
    });

    Node.hide(["__body", "__changed", "__freezed"]);

    /**
     * renders the change to an element
     * @param Node element
     * @param String property
     * @param Mixed value
     * @param Mixed unit
     */
    function renderer(element, property, value, unit) {
        var aux;
        //throw new Error("??");
        //element.setStyle(property, this.serve(value, unit));
        switch (property) {
        case 'x':
            element.setPosition(value, false);
            break;
        case 'y':
            element.setPosition(false, value);
            break;
        case 'position':
            aux = value.split(" ");
            element.setPosition(aux[0], aux[1]);
            break;
        case 'rotate':
            element.setRotation(value);
            break;
        case 'scale':
            aux = value.split(" ");
            element.setScale(aux[0], aux[1]);
            break;
        case 'scalex':
            element.setScale(value, false);
            break;
        case 'scaley':
            element.setScale(false, value);
            break;
        case 'skew':
            aux = value.split(" ");
            element.setSkew(aux[0], aux[1]);
            break;
        case 'skewx':
            aux = value.split(" ");
            element.setSkew(aux[0], false);
            break;
        case 'skewy':
            aux = value.split(" ");
            element.setSkew(false, aux[0]);
            break;
        }
    }

    Object.each({
        position: '@d @d',
        x: '@d',
        y: '@d',

        rotate: '@d',

        scale: '@d @d',
        scalex: '@d',
        scaley: '@d',

        skew: '@d @d',
        skewx: '@d',
        skewy: '@d'
    }, function (v, k) {
        Node.setAnimationProterties(k, {
            mask: v,
            type: "number",
            render: renderer
        });
    });


    exports.Node = Node;


}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));