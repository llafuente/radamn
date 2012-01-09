var assert = require('assert');

/**
 * @class Node
 */
var Node = new Class(
/** @lends Node.prototype */
{
    Implements : [ Options, Events ],
    /**
     * @member Node
     * @type {String}
     */
    name : "Node",
    /**
     * @member Node
     * @type {Array}
	 * @private
     */
    __body : [],
    /**
     * @member Node
     * @type {Array}
     */
    childNodes : [],
    /**
     * @member Node
     * @type {Array}
     */
    childEntities : [],
    /**
     * @member Node
     * @type {Node}
     */
    parentNode : null,
    /**
     * @member Node
	 * @private
     * @type {Boolean}
     */
    __changed: false,
    /**
     * @member Node
     * @type {Matrix2D}
     */
    matrix : null,
    /**
     * @member Node
     * @type {Boolean}
     */
    freezed: false,
    /**
     * @member Node
     * @type {NodeOptions}
     */
    options : {

    },
    /**
     * Initialize the CanvasNode and merge an optional config hash.
     * @member Node
	 * @constructs
     * @params {NodeOptions} options
     */
    initialize : function(root, options) {
        this.setOptions(options);

        this.root = root;
        this.childNodes = [];
        this.matrix = new Matrix2D();
    },
	/**
	 * @member Node
	 */
    freeze: function() {
        this.freezed = true;
        this.matrix.readonly = true;
    },
	/**
	 * @member Node
	 */
    unfreeze: function() {
        this.freezed = false;
        this.matrix.readonly = false;
    },
    /**
     * Initialize the CanvasNode and merge an optional config hash.
     *
     * @member Node
     * @returns {Vector2}
     */
    getDerivedPosition: function() {
        var node = this;
        if(node.isRoot()) return this.matrix.getPosition();

        var out = new Vec2(0, 0);
        do {
            out = out.plus(node.matrix.getPosition());
            node = node.parentNode;
        } while (!node.isRoot());

        return out;
    },
    /**
     * @member Node
     * @returns {Boolean}
     */
    isRoot : function() {
        return false;
    },
    /**
     * @member Node
     * @returns {Node}
     */
    getNextSibling : function() {
        if (this.parentNode)
            return this.parentNode.childNodes[this.parentNode.childNodes
                    .indexOf(this) + 1];
        return null;
    },
    /**
     * @member Node
     * @returns {Node}
     */
    getPreviousSibling : function() {
        if (this.parentNode)
            return this.parentNode.childNodes[this.parentNode.childNodes
                    .indexOf(this) - 1];
        return null;
    },
	/**
	 * Create a new Node, appended and returned
	 * @member Node
	 * @returns {Node}
	 */
	createNode: function() {
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
     * @param {Array} obj list of nodes or a single node
     */
    appendChild : function(obj) {
        var a = Array.from(arguments);
        for ( var i = 0; i < a.length; i++) {
            if (a[i].parentNode)
                a[i].removeSelf();
            this.childNodes.push(a[i]);
            a[i].parentNode = this;
        }
        this.touch();

        return this;
    },
    /**
     * Removes all childNodes from the node.
     * @member Node
     */
    removeAllChildren : function() {
        this.removeChild.apply(this, this.childNodes);

        return this;
    },
    /**
     * Removes arguments from the node's childNodes.
     *
     * Removing a child sets its parent to null and calls child.setRoot(null)
     *
     * @member Node
     * @param {Array} list of nodes or a single node
     */
    removeChild : function(obj) {
        var a = arguments;
        for ( var i = 0; i < a.length; i++) {
            this.childNodes.deleteFirst(a[i]);
            delete a[i].parentNode;
        }
        this.touch();

        return this;
    },
    /**
     * Calls this.parent.removeChild(this) if this.parent is set.
     * @member Node
     */
    removeSelf : function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }

        return this;
    },
    /**
    * @member Node
    * @returns Rectangle
    */
    getBoundingBox : function() {
        return [ this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1 ];
    },
    /**
     * Appends arguments as childNodes to the node.
     *
     * Adding a child sets child.parentNode to be the node and calls
     * child.setRoot(node.root)
     *
     * @member Node
     * @param {Array} list of nodes or a single node
     */
    appendEntity : function(obj) {
        var a = Array.from(arguments);
        for ( var i = 0; i < a.length; i++) {
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
     */
    removeAllEntities : function() {
        this.removeEntity.apply(this, this.childEntities);

        return this;
    },
    /**
     * Removes arguments from the node's childNodes.
     *
     * Removing a child sets its parent to null and calls child.setRoot(null)
     *
     * @member Node
     * @param {Array} list of nodes or a single node
     */
    removeEntity : function(obj) {
        var a = arguments;
        for ( var i = 0; i < a.length; i++) {
            this.childEntities.deleteFirst(a[i]);
            delete a[i].parentNode;
        }
        this.touch();
    },
    /**
     * Get all entities recursive from this node and his children
     *
     * @member Node
     * @returns {Array} list of nodes
     */
    getAllSubEntites : function() {
        var output = this.childEntities.clean();
        for ( var i = 0; i < this.childNodes.length; i++) {
            output = output.combine(this.childNodes[i].getAllSubEntites());
        }
        return output;
    },
    /**
	 * @member Node
     * @deprecated
     */
    touch: function() {
        return ;
        this.__changed = true;
        if(!this.isRoot()) {
            var rootNode = this;
            while (rootNode.isRoot() === false) {
                rootNode = this.parentNode;
            }
            rootNode.touch();
        }
    },
	/**
	 * @member Node
	 * @param {Primitive}
	 */
	addToBody: function(primitive) {
		assert.notEqual(["polygon", "rectangle", "circle", "segment2"].contains(typeOf(primitive)), false, "Node::addToBody("+typeOf(primitive)+") is not a valid type ['polygon', 'rectangle', 'circle', 'segment2']");

		this.__body.push(primitive);
	},
	/**
	 * @member Node
	 */
	getBodyList: function() {
		return this.__body;
	},
	/**
	 * check collision between operand and all Node bodies
	 * @member Node
	 */
	collide: function(operand) {
		if(this.__body.length == 0) {
			return {success: false, reason: "nobody"}; //no-body ?
		}
		if(this.__body.length > 1) {
			throw new Exception("multiple body collision is not supported atm!");
		}

		var xx = this.__body[0].clone().translate(this.getDerivedPosition());

		return Math.intersection(xx, operand);
	}
});


module.exports.Node = Node;
