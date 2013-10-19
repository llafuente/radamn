(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        counter = 0,
        Resource;

    /**
     * @class Resource
     * @event beforedestroy
     */
    Resource  = new Class("RadamnResource",/** @lends Resource.prototype */{
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
        visible: true,
    });

    Resource.Extends(Events);

    Resource.Implements({
        /**
         * @member Resource
         * @param Object
         * @constructs
         */
        __construct: function (options) {
            this.parent();

            this.__id = ++counter;
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

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));