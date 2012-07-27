(function(exports, browser) {
    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

    /**
     * @class ResourceRendereable
     * @event moved
     * @event rotated
     * @event scaled
     * @extends Resource
     */
    var ResourceRendereable = new Class("RadamnResourceRendereable",
    /** @lends ResourceRendereable.prototype */
    {
        /**
         * @member ResourceRendereable
         * @private
         * @type {Node}
         */
        parentNode: null,
        /**
         * @member ResourceRendereable
         * @private
         * @type {Pointer}
         */
        surface: null,
        /**
         * @member ResourceRendereable
         * @private
         * @type {Boolean}
         */
        ready: false
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
        __construct: function(options) {
            this.parent(options);
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
            if(!this.surface.__ready) return false;

            if(browser) {
                return ctx.drawImage(this.surface, x, y);
            }
            return ctx.drawImage(this, x, y);
        }
    });

    exports.ResourceRendereable = ResourceRendereable;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");

