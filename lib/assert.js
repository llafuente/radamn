(function(exports, browser) {

	if(browser) {
		exports = {
			notEqual: function() {}
		}
	} else {
		exports = require('assert');
	}

})(typeof exports === "undefined" ? this.assert : exports, typeof exports === "undefined");