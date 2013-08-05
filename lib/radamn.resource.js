(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        typeOf = browser ? NodeClass.typeof : require("node-class").typeof,
        counter = 0;

    /**
     * @class Resource
     * @event beforedestroy
     */
    var Resource  = new Class("RadamnResource",
    /** @lends Resource.prototype */
    {
        /**
         * @member Resource
         * @type Number (maybe string in the future...)
         * @private
         */
        __id: 0,
        /**
         * put here all info
         * @type Object
         */
        userdata: null,
    });

    Resource.Extends(Events);

    Resource.Implements({
        /**
         * @member Resource
         * @param Object
         * @constructs
         */
        __construct: function (options) {
            this.__id = ++counter;
            this.parent();
        },
        /**
         * @returns Resource
         */
        destroy: function () {
            this.emit("beforedestroy", [this]);
            Radamn.Assets.destroy(this);

            return this;
        }
    });

    exports.Resource = Resource;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));
