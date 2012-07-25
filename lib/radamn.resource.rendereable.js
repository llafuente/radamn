(function(exports, browser) {
    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

    /**
     * @class ResourceRendereable
     * @extends Resource
     */
    var ResourceRendereable = new Class("RadamnResourceRendereable",
    /** @lends ResourceRendereable.prototype */
    {
        /**
         * @member ResourceRendereable
         * @private
         * @type Node
         */
        parentNode: null,
        /**
         * @member ResourceRendereable
         * @private
         * @type Pointer
         */
        pointer: null,
    });
    ResourceRendereable.extends(Radamn.Resource);

    ResourceRendereable.implements(
    /** @lends ResourceRendereable.prototype */
    {
        /**
         *
         * @member ResourceRendereable
         * @constructs
         * @param Pointer pointer_to_surface
         * @param Object options
         * @returns ResourceRendereable
         */
        __construct: function(pointer_to_surface, options) {
            this.parent(options);
            this.pointer = pointer_to_surface;
            this.__type = "ResourceRendereable";
        },
        /**
         * @member ResourceRendereable
         * @param Blending blend_mode
         * @returns Boolean
         */
        setBlendMode: function(blend_mode) {

        },
        /**
         * @member ResourceRendereable
         * @returns Node
         */
        getParentNode: function() {
            return this.parentNode;
        },
        /**
         * detach from parent node if possible
         * @param Boolean and_remove_parent_node
         * @return Node or null if cannot detach
         */
        detachFromParent: function(and_remove_parent_node) {
            and_remove_parent_node = and_remove_parent_node || false;
            if(this.parentNode !== null) {
                var node = this.parentNode;
                this.parentNode = null;

                if(and_remove_parent_node) {
                    node.removeAllChildren();
                    node.removeAllEntities();
                    node.removeSelf();
                } else {
                    node.removeEntity(this);
                }

                return node;
            }
            return null;
        },
        attachChildNode: function(parent_node) {
            var node = parent_node.createNode();
            node.appendEntity(this);

            return node;
        },
        /**
         * @member ResourceRendereable
         * @private
         * @param CanvasRenderingContext2D ctx
         * @param Number x
         * @param Number y
         * @returns Boolean
         */
        __draw: function(ctx, x, y) {
            if(!this.pointer.__ready) return false;

            if(browser) {
                return ctx.drawImage(this.pointer, x, y);
            }
            return ctx.drawImage(this, x, y);
        },
        /**
         * valid events
         * - moved
         * - rotated
         * - scaled
         * @member ResourceRendereable
        */
        events: ["moved", "rotated", "scaled"]
    });

    exports.ResourceRendereable = ResourceRendereable;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");

