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
     * @type Object
     */
    options: {},
    /**
     * put here all info
     * @type Object
     */
    userdata: {},
    /**
     * @member Resource
     * @param Object
     * @constructs
     */
    initialize: function(options) {
        this.setOptions(options);
    },
    /**
     * @returns Resource
     */
    destroy: function() {
        this.fireEvent("beforedestroy", [this]);
        Radamn.Assets.destroy(this);

        return this;
    },
    /**
     * @returns Object
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
     * @type Array
     */
    events: ["beforedestroy"]
});

exports.Resource = Resource;

})(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined");