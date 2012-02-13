(function(exports, browser) {

var Camera = new Class({
    options: {
    },
    __window: null,
    __root : null,
    __followOffset : null,
    __followNode : null,
    initialize: function(window) {
        this.__window = window;
        this.__root = this.__window.getRootNode();
        
        return this;
    },
    centerNode: function(node, offset, follow) {
        var pos = node.getDerivedPosition(false);
        offset = offset || {x:0,y:0};
        this.__root.matrix.setPosition(pos.x - this.__window.width * 0.5 + offset.x, pos.y - this.__window.height * 0.5 + offset.y);

        if(follow) {
            this.__followNode = node;
            this.__followOffset = offset;
        }
        
        return this;
    },
    stopFollowing: function() {
        this.__followNode = null;
        this.__followOffset = null;
        
        return this;
    },
    update: function() {
        if(this.__followNode !== null) {
            this.centerNode(this.__followNode, this.__followOffset);
        }
        
        return this;
    },
    
});

exports.Camera = Camera;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");
