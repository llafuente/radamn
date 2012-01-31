(function(exports, browser) {

/**
 * @class Resource
 */
var Resource  = new Class(
/** @lends Resource.prototype */
{
    Implements: [Options, Events],
    /**
	 * @member Resource
     * @private
     */
    __id: '',
    /**
	 * @member Resource
     * @type {String}
     */
    __type: '',
    /**
	 * @member Resource
     * @type {Object}
     */
    options: {},
    /**
     * @member Resource
	 * @param {Object}
	 * @constructs
     */
    initialize: function(options) {
        this.setOptions(options);
    },
    /**
     * @member Resource
     */
    destroy: function() {
        this.fireEvent("beforedestroy", [this]);
        Radamn.Assets.destroy(this);
    },
    /**
     * @member Resource
     */
    serialize: function() {
        return {
            id: this.__id,
            type: this.__type,
            options: this.options
        };
    }, //export
	/**
	 * valid events
	 * - beforedestroy
	 * @member Resource
	 */
    events: ["beforedestroy"]
});

exports.Resource = Resource;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");