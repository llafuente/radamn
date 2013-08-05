(function (exports, browser) {
    "use strict";

    if (browser) {
        exports.notEqual = function () {};
        exports.equal = function () {};
    } else {
        exports = require('assert');
    }

}(typeof exports === "undefined" ? window.assert = {} : exports, typeof exports === "undefined"));