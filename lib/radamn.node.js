(function(exports, browser) {

if(!browser) {
    var assert = require('assert');
}

/**
 * @class Node
 */
var Node = new Class(
/** @lends Node.prototype */
{
    Implements : [ Options, Events ],
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
    freezed: false,
    /**
     * @member Node
     * @type NodeOptions
     */
    options : {

    },
    /**
     * Initialize the CanvasNode and merge an optional config hash.
     * @member Node
     * @constructor
     * @param Node root
     * @param NodeOptions options
     */
    initialize : function(root, options) {
        this.setOptions(options);

        this.root = root;
        this.childNodes = [];
        this.matrix = new Matrix2D();
    },
    /**
     * @member Node
     * @returns Node this for chaining
     */
    freeze: function() {
        this.freezed = true;
        this.matrix.readonly = true;

        return this;
    },
    /**
     * @member Node
     * @returns Node this for chaining
     */
    unfreeze: function() {
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
    getDerivedPosition: function(include_root) {
        if(include_root === undefined) {
            include_root = true;
        }
        
        var node = this;
        if(node.isRoot()) return include_root ? this.matrix.getPosition() : {x:0,y:0};

        var out = new Vec2(0, 0);
        do {
            out = out.plus(node.matrix.getPosition());
            node = node.parentNode;
        } while (!node.isRoot());
        
        if(include_root) {
            out = out.plus(node.matrix.getPosition());
        }

        return out;
    },
    /**
     * @member Node
     * @returns Boolean
     */
    isRoot : function() {
        return false;
    },
    /**
     * @member Node
     * @returns Node null if cannot be found
     */
    getNextSibling : function() {
        if (this.parentNode)
            return this.parentNode.childNodes[this.parentNode.childNodes
                    .indexOf(this) + 1];
        return null;
    },
    /**
     * @member Node
     * @returns Node null if cannot be found
     */
    getPreviousSibling : function() {
        if (this.parentNode)
            return this.parentNode.childNodes[this.parentNode.childNodes
                    .indexOf(this) - 1];
        return null;
    },
    /**
     * Create a new Node, append it and return it
     * @member Node
     * @returns Node
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
     * @param Array obj list of nodes or a single node
     * @returns Node this for chaining
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
     * @returns Node this for chaining
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
     * @param Array list of nodes or a single node
     * @returns Node this for chaining
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
     * @returns Node this for chaining
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
     * @param Array list of nodes or a single node
     * @returns Node this for chaining
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
     * @returns Node this for chaining
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
     * @param Array list of nodes or a single node
     * @returns Node this for chaining
     */
    removeEntity : function(obj) {
        var a = arguments;
        for ( var i = 0; i < a.length; i++) {
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
    getAllSubEntites : function() {
        var output = this.childEntities.clean();
        for ( var i = 0; i < this.childNodes.length; i++) {
            output = output.combine(this.childNodes[i].getAllSubEntites());
        }
        return output;
    },
    /**
     * @deprecated
     * @member Node
     * @returns Node this for chaining
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

        return this;
    },
    /**
     * @member Node
     * @param Primitive
     * @returns Node this for chaining
     */
    addToBody: function(primitive) {
        assert.notEqual(["polygon", "rectangle", "circle", "segment2"].contains(typeOf(primitive)), false, "Node::addToBody("+typeOf(primitive)+") is not a valid type ['polygon', 'rectangle', 'circle', 'segment2']");

        this.__body.push(primitive);

        return this;
    },
    /**
     * @member Array with primitives
     */
    getBodyList: function() {
        return this.__body;
    },
    /**
     * check collision between operand and all Node bodies
     * @member Node
     * @returns Intersection
     */
    collide: function(operand) {
        if(this.__body.length == 0) {
            return {success: false, reason: "nobody"}; //no-body ?
        }
        if(this.__body.length > 1) {
            throw new Error("multiple body collision is not supported atm!");
        }

        var xx = this.__body[0].clone().translate(this.getDerivedPosition());

        return Math.intersection(xx, operand);
    }
});

exports.Node = Node;

var Styles = {
    position: '@ @',     x: '@',             y: '@',
    rotate: '@',
    scale: '@ @',        scaleX: '@',        scaleY: '@',
    skew: '@ @',         skewX: '@',         skewY: '@'
};

if(browser) {
    Element.Styles = Object.merge(Element.Styles, Styles);
} else {
    global.Element.Styles = Object.merge(Element.Styles, Styles);
}




/**
 * base on mootools
 * @class FxNode
 */
Fx.Node = new Class({
    Extends: Fx,
    Implements : [ Events ], // reimplement for browser compatibility!!
    /**
     * prepares the base from/to object
     * @member FxNode
     * @param Node element
     * @param String property
     * @param Mixed values
     */
    prepare: function(element, property, values){
        values = Array.from(values);
        if (values[1] == null){
            values[1] = values[0];
            values[0] = element.getStyle(property);
        }
        var parsed = values.map(this.parse);
        return {from: parsed[0], to: parsed[1]};
    },
    /**
     * parses a value into an array
     * @param Mixed value
     */
    parse: function(value){
        value = Function.from(value)();
        value = (typeof value == 'string') ? value.split(' ') : Array.from(value);
        return value.map(function(val){
            val = String(val);
            var found = false;
            Object.each(Fx.Node.Parsers, function(parser, key){
                if (found) return;
                var parsed = parser.parse(val);
                if (parsed || parsed === 0) found = {value: parsed, parser: parser};
            });
            found = found || {value: val, parser: Fx.Node.Parsers.String};
            return found;
        });
    },
    /**
     * computes by a from and to prepared objects, using their parsers.
     * @param Mixed from
     * @param Mixed to
     * @param Number delta
     * @returns Array
     */
    compute: function(from, to, delta){
        var computed = [];
        (Math.min(from.length, to.length)).times(function(i){
            computed.push({value: from[i].parser.compute(from[i].value, to[i].value, delta), parser: from[i].parser});
        });
        computed.$family = Function.from('fx:css:value');
        return computed;
    },
    /**
     * serves the value as settable
     * @param Mixed value
     * @param Mixed unit
     */
    serve: function(value, unit){
        if (typeOf(value) != 'fx:css:value') value = this.parse(value);
        var returned = [];
        value.each(function(bit){
            returned = returned.concat(bit.parser.serve(bit.value, unit));
        });
        return returned;
    },
    /**
     * renders the change to an element
     * @param Node element
     * @param String property
     * @param Mixed value
     * @param Mixed unit
     */
    render: function(element, property, value, unit){
        //throw new Error("??");
        //element.setStyle(property, this.serve(value, unit));
        switch(property) {
            case 'x' :
                element.matrix.setPosition(this.serve(value, '')[0], false);
            break;
            case 'y' :
                element.matrix.setPosition(false, this.serve(value, '')[0]);
                break;
            case 'position' :
                var aux = this.serve(value, '');
                element.matrix.setPosition(aux[0], aux[1]);
                break;
            case 'rotate' :
                element.matrix.setRotation(this.serve(value, '')[0]);
                break;
            case 'scale' :
                var aux = this.serve(value, '');
                element.matrix.setScale(aux[0], aux[1]);
                break;
            case 'skew' :
                var aux = this.serve(value, '');
                element.matrix.setSkew(aux[0], aux[1]);
                break;
            case 'skewx' :
                var aux = this.serve(value, '');
                element.matrix.setSkew(aux[0], false);
                break;
            case 'skewy' :
                var aux = this.serve(value, '');
                element.matrix.setSkew(false, aux[0]);
                break;
        }
    },
    /**
     * searches inside the page css to find the values for a selector
     * @param String selector
     * @returns Mixed
     */
    search: function(selector){
        if (Fx.Node.Cache[selector]) return Fx.Node.Cache[selector];
        var to = {}, selectorTest = new RegExp('^' + selector.escapeRegExp() + '$');
        Array.each(document.styleSheets, function(sheet, j){
            var href = sheet.href;
            if (href && href.contains('://') && !href.contains(document.domain)) return;
            var rules = sheet.rules || sheet.cssRules;
            Array.each(rules, function(rule, i){
                if (!rule.style) return;
                var selectorText = (rule.selectorText) ? rule.selectorText.replace(/^\w+/, function(m){
                    return m.toLowerCase();
                }) : null;
                if (!selectorText || !selectorTest.test(selectorText)) return;
                Object.each(Element.Styles, function(value, style){
                    if (!rule.style[style] || Element.ShortStyles[style]) return;
                    value = String(rule.style[style]);
                    to[style] = ((/^rgb/).test(value)) ? value.rgbToHex() : value;
                });
            });
        });
        return Fx.Node.Cache[selector] = to;
    }

});

Fx.Node.Cache = {};

Fx.Node.Parsers = {

    Color: {
        parse: function(value){
            if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
            return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
        },
        compute: function(from, to, delta){
            return from.map(function(value, i){
                return Math.round(Fx.compute(from[i], to[i], delta));
            });
        },
        serve: function(value){
            return value.map(Number);
        }
    },

    Number: {
        parse: parseFloat,
        compute: Fx.compute,
        serve: function(value, unit){
            return (unit) ? value + unit : value;
        }
    },

    String: {
        parse: Function.from(false),
        compute: function(zero, one){
            return one;
        },
        serve: function(zero){
            return zero;
        }
    }

};
/**
 * @class NodeTween
 */
Fx.NodeTween = new Class({

    Extends: Fx.Node,
    /**
     * @member NodeTween
     * @constructor
     * @param Node element
     * @param Object options
     */
    initialize: function(element, options){
        this.element = this.subject = element;
        this.parent(options);
    },
    /**
     *
     * @param String property
     * @param Number now
     * @returns NodeTween this for chaining
     */
    set: function(property, now){
        if (arguments.length == 1){
            now = property;
            property = this.property || this.options.property;
        }
        this.render(this.element, property, now, this.options.unit);

        return this;
    },
    /**
     *
     * @param String property
     * @param Mixed from
     * @param Mixed to
     * @param Unkown autolistener
     * @returns
     */
    start: function(property, from, to, autolistener){
        autolistener = autolistener || true;
        if (!this.check(property, from, to)) return this;
        var args = Array.flatten(arguments);
        this.property = this.options.property || args.shift();
        var parsed = this.prepare(this.element, this.property, args);
        return this.parent(parsed.from, parsed.to, autolistener);
    }
});



})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");
