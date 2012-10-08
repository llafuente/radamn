(function (exports, browser) {
    "use strict";

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        Animate = browser ? $.Animate : require("node-class").Animate,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        assert = browser ? assert : require("assert");

    /**
     * @class Node
     */
    var Node = new Class("Node",
    /** @lends Node.prototype */
    {
        /**
         * @member Node
         * @type String
         */
        name : "Node",
        /**
         * @member Node
         * @type Array
         * @private
         */
        __body : [],
        /**
         * @member Node
         * @type Array
         */
        childNodes : [],
        /**
         * @member Node
         * @type Array
         */
        childEntities : [],
        /**
         * @member Node
         * @type Node
         */
        parentNode : null,
        /**
         * @member Node
         * @private
         * @type Boolean
         */
        __changed: false,
        /**
         * @member Node
         * @type Matrix2D
         */
        matrix : null,
        /**
         * @member Node
         * @type Boolean
         */
        freezed: false
    });

    Node.extends(Events);

    Node.extends(Animate, true, true);

    Node.implements({
        /**
         * Initialize the CanvasNode and merge an optional config hash.
         * @member Node
         * @constructor
         * @param {Node} root
         */
        __construct: function (root) {
            this.parent();

            this.root = root;
            this.childNodes = [];
            this.matrix = new Matrix2D();
        },
        /**
         * @member Node
         * @returns Node this for chaining
         */
        freeze: function () {
            this.freezed = true;
            this.matrix.readonly = true;

            return this;
        },
        /**
         * @member Node
         * @returns Node this for chaining
         */
        unfreeze: function () {
            this.freezed = false;
            this.matrix.readonly = false;

            return this;
        },
        /**
         * Initialize the CanvasNode and merge an optional config hash.
         *
         * @member Node
         * @returns Vector2
         */
        getDerivedPosition: function (include_root) {
            if (include_root === undefined) {
                include_root = true;
            }

            var node = this,
                out;

            if (node.isRoot()) {
                return include_root ? this.matrix.getPosition() : {x: 0, y: 0};
            }

            out = new Vec2(0, 0);
            do {
                out = out.plus(node.matrix.getPosition());
                node = node.parentNode;
            } while (!node.isRoot());

            if (include_root) {
                out = out.plus(node.matrix.getPosition());
            }

            return out;
        },
        /**
         * @member Node
         * @returns Boolean
         */
        isRoot : function () {
            return false;
        },
        /**
         * @member Node
         * @returns Node null if cannot be found
         */
        getNextSibling : function () {
            if (this.parentNode) {
                return this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1];
            }
            return null;
        },
        /**
         * @member Node
         * @returns Node null if cannot be found
         */
        getPreviousSibling : function () {
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
        createNode: function () {
            var node = new Radamn.Node();
            this.appendChild(node);
            return node;
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
        appendChild : function (obj) {
            var a = Array.ize(arguments),
                i;
            for (i = 0; i < a.length; i++) {
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
        removeAllChildren : function () {
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
        removeChild : function (obj) {
            var a = arguments,
                i;
            for (i = 0; i < a.length; i++) {
                this.childNodes.deleteFirst(a[i]);
                delete a[i].parentNode;
            }
            this.touch();

            return this;
        },
        /**
         * Calls this.parent.removeChild(this) if this.parent is set.
         * @member Node
         * @returns Node this for chaining
         */
        removeSelf : function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }

            return this;
        },
        /**
        * @member Node
        * @returns Rectangle
        */
        getBoundingBox : function () {
            return [ this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1 ];
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
        appendEntity : function (obj) {
            var a = Array.ize(arguments),
                i;
            for (i = 0; i < a.length; i++) {
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
        removeAllEntities : function () {
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
        removeEntity : function (obj) {
            var a = arguments,
                i;
            for (i = 0; i < a.length; i++) {
                this.childEntities.deleteFirst(a[i]);
                delete a[i].parentNode;
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
        getAllSubEntites : function () {
            var output = this.childEntities.clean(),
                i;
            for (i = 0; i < this.childNodes.length; i++) {
                output = output.combine(this.childNodes[i].getAllSubEntites());
            }
            return output;
        },
        /**
         * @deprecated
         * @member Node
         * @returns Node this for chaining
         */
        touch: function () {
            return;
            this.__changed = true;
            if (!this.isRoot()) {
                var rootNode = this;
                while (rootNode.isRoot() === false) {
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
            assert.notEqual(["polygon", "rectangle", "circle", "segment2"].contains(typeOf(primitive)), false, "Node::addToBody(" + typeOf(primitive) + ") is not a valid type ['polygon', 'rectangle', 'circle', 'segment2']");

            this.__body.push(primitive);

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

            var xx = this.__body[0].clone().translate(this.getDerivedPosition());

            return Math.intersection(xx, operand);
        }
    });

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
            element.matrix.setPosition(value, false);
        break;
        case 'y':
            element.matrix.setPosition(false, value);
        break;
        case 'position':
            aux = value.split(" ");
            element.matrix.setPosition(aux[0], aux[1]);
        break;
        case 'rotate':
            element.matrix.setRotation(value);
        break;
        case 'scale':
            aux = value.split(" ");
            element.matrix.setScale(aux[0], aux[1]);
        break;
        case 'skew':
            aux = value.split(" ");
            element.matrix.setSkew(aux[0], aux[1]);
        break;
        case 'skewx':
            aux = value.split(" ");
            element.matrix.setSkew(aux[0], false);
        break;
        case 'skewy':
            aux = value.split(" ");
            element.matrix.setSkew(false, aux[0]);
        break;
        }
    }

    Object.each({
        position: '@d @d',
        x: '@d',
        y: '@d',

        rotate: '@d',

        scale: '@d @d',
        scaleX: '@d',
        scaleY: '@d',

        skew: '@d @d',
        skewX: '@d',
        skewY: '@d'
    }, function (v, k) {
        Node.setAnimationProterties(k, {
            mask: v,
            type: "number",
            render: renderer
        });
    });


    exports.Node = Node;


}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));
