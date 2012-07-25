(function(exports, browser) {

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof;

    /**
     * @class Resource
     */
    var Resource  = new Class("RadamnResource",
    /** @lends Resource.prototype */
    {
        /**
         * @member Resource
         * @type Number (maybe string in the future...)
         * @private
         */
        __id: '',
        /**
         * @member Resource
         * @type String
         */
        __type: '',
        /**
         * put here all info
         * @type Object
         */
        userdata: {},
    });

    Resource.extends(Events);

    Resource.implements({
        /**
         * @member Resource
         * @param Object
         * @constructs
         */
        __construct: function() {
            this.parent();
        },
        /**
         * @returns Resource
         */
        destroy: function() {
            this.emit("beforedestroy", [this]);
            Radamn.Assets.destroy(this);

            return this;
        },
        /**
         * valid events
         * - beforedestroy
         * @type Array
         */
        events: ["beforedestroy"]
    });

    exports.Resource = Resource;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");