(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? $.Class : require("node-class").Class,
        EventException,
        Element;

    Element = new Class("Element", {
        _listeners: null,
        style: {},
        options: {},
        firstChild: null
    });

    Element.implements({
        __construct: function() {
        },
        setAttribute: function(attr, val) {
            this[attr] = val;
        },
        appendChild: function() {
            return new Element();
        },
        /*
        addEventListener: function(type, listener, useCapture) {
            useCapture = useCapture || false;
            _listeners[type] = _listeners[type] || [];
            useCapture = useCapture === true;

            this["on"+type] = listener;
        },
        removeEventListener: function(type, listener, useCapture) {
            useCapture = useCapture || false;

            this["on"+type] = null;
        },
        dispatchEvent: function(event) {

        },
        */

        // based on: jsdom
        addEventListener: function(type, listener, capturing) {
            this._listeners = this._listeners || {};
            var listeners = this._listeners[type] || {};
            capturing = (capturing === true);
            var capturingListeners = listeners[capturing] || [];
            for (var i=0; i < capturingListeners.length; i++) {
                if (capturingListeners[i] === listener) {
                    return;
                }
            }
            capturingListeners.push(listener);
            listeners[capturing] = capturingListeners;
            this._listeners[type] = listeners;
        },
        // based on: jsdom
        removeEventListener: function(type, listener, capturing) {
            var listeners  = this._listeners && this._listeners[type];
            if (!listeners) return;
            var capturingListeners = listeners[(capturing === true)];
            if (!capturingListeners) return;
            for (var i=0; i < capturingListeners.length; i++) {
                if (capturingListeners[i] === listener) {
                    capturingListeners.splice(i, 1);
                    return;
                }
            }
        },
        // based on: jsdom
        dispatchEvent: function(event) {


            if (event == null) {
                throw new EventException(0, "Null event");
            }
            if (event.type == null || event.type == "") {
                throw new EventException(0, "Uninitialized event");
            }

            var capturing = (this._listeners && this._listeners[event.type] && this._listeners[event.type][true]) || [],
                not_capturing = (this._listeners && this._listeners[event.type] && this._listeners[event.type][false]) || [],
                stop = false,
                prevented = false;

            event.preventDefault = function() {
                prevented = true;
            };

            event.stopPropagation = function() {
                stop = true;
            }

            event.eventPhase = event.CAPTURING_PHASE;
            var i;
            for(i = 0; i< capturing.length; i++) {
                capturing[i](event);
            }

            event.eventPhase = event.AT_TARGET;
            for(i = 0; i< not_capturing.length; i++) {
                not_capturing[i](event);
            }

            // no bubble phase
            // event._eventPhase = event.BUBBLING_PHASE;

            return prevented;
        }
    });


    // credits to jsdom
    EventException = function() {
        if (arguments.length > 0) {
            this._code = arguments[0];
        } else {
            this._code = 0;
        }
        if (arguments.length > 1) {
            this._message = arguments[1];
        } else {
            this._message = "Unspecified event type";
        }
        Error.call(this, this._message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EventException);
        }
    };

    EventException.prototype = {
        UNSPECIFIED_EVENT_TYPE_ERR : 0,
        get code() {
            return this._code;
        },
    };
    EventException.prototype.__proto__ = Error.prototype;

    global.Element = Element;
    exports.Element = Element;

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));