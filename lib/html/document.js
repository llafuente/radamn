(function (exports, browser) {
    "use strict";
    // to keep max compat with the browsers, all to globals!
    var Class = browser ? NodeClass.Class : require("node-class").Class,
        debug = false,
        Document = new Class("Document", {
            body: null
        }),
        keys = {};

    Document.Extends(Element);

    ["keypress", "keydown", "keyup", "mousedown", "mouseup", "mousemove", "mouseout", "click", "dblclick", "focus", "blur"].forEach(function(v,k){
        Document.property("on"+v, function() {
            return (this._listeners && this._listeners[v] && this._listeners[v][true]) || null;
        }, function(fn) {
            this.addEventListener(v, fn, true);
        }, false);
    });

    Document.Implements({
        __construct: function() {
            this.body = new Element();
        },
        getElementById: function() {
            if(debug) {
                console.trace();
            }
            return new Element();
        },
        getElementsByTagName: function() {
            return [new Element()];
        },
        createElement: function(type) {
            switch(type) {
                case "div":
                    //fake for mariokart demo, but it should raise!
                    return {
                        style: {},
                        appendChild: function() {},
                        setAttribute: function(attr, val) {
                            this[attr] = val;
                        }
                    };
                break;
                case "canvas":
                    return new HTMLCanvasElement();
                break;
                case "image":
                    return new Image();
                break;
                default:
                    throw new Exception("createElement("+type+") not supported");
            }
        }
    });

    global.document = new Document();

    function input_listener() {
        var events = [],
            event,
            i,
            nev;
        while ((event = CRadamn.pollEvent()) !== false) {
            events.push(event);
        }
        for(i=0; i < events.length; ++i) {
            event = events[i];

            Radamn.verbose("event", event);

            switch(event.type) {
                //do not double keydown!!
                case "keydown" :
                    if(keys[event.char] !== undefined) continue;
                break;
            }


            if(!document.dispatchEvent(event)) {
                Radamn.emit(event.type, event);
                switch(event.type) {
                    case "mouseup" :
                        //click!!
                        nev = Object.merge({}, event);
                        nev.type = "click";
                        events.push(nev);
                    break;
                }
            }
            switch(event.type) {
                //keydown -> keypress
                case "keydown" :
                    (function() {
                        var new_event = Object.merge({}, event);
                        new_event.type = "keypress";
                        keys[event.char] = setInterval(function() {
                            ++new_event.repeat;
                            if(!document.dispatchEvent(new_event)) {
                                Radamn.emit(new_event.type, new_event);
                            }
                        }, 500);
                    }());
                break;
                case "keyup" :
                    clearInterval(keys[event.char]);
                    delete keys[event.char];
                break;
            }
        }
    };

    input_listener.bind(global.document).periodical(50);


}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));