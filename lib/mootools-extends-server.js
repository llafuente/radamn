// this will export everything into global, a bit of pollution
(function(exports) {

var document = exports.document;

(function(){
    var __programStarts = new Date();
    var __delta = new Date().getTime();

    /**
     * Create a compatibility layer between browsers.
     * Create complex cross-browser HTML like buttoms,tabs, sifr etc.
     *
     * @class Logger
     * @author Luis <bls> Lafuente
     * @version 1
     */
    var LoggerPrototype = {
        /**
        * @member Logger
        * @public
        * @type Function
        */
        logFunction : console.log,
        /**
        * @member Logger
        * @public
        * @type String
        */
        name: 'Core',
        /**
        * @member Logger
        * @public
        * @type String
        */
        namespace: 'Core',
        /**
        * @member Logger
        * @public
        * @type Number
        */
        debugging: true,
        /**
        * @member Logger
        * @public
        * @type Number
        */
        logLevel: 5,
        /**
        * @member Logger
        * @public
        * @type Array
        */
        profile: [],

        /**
        * @member Logger
        * @param String value
        * @private
        */
        __format: function(value) {
            if(value < 0 ) value = 0;

            var options = {
                "s": Math.floor(value % 60),
                "m": Math.floor(value / 60) % 60,
                "h": Math.floor(value / 3600) % 24,
                "d": Math.floor(value / 86400)
            };

            options['s'] = options['s'] < 10 ? '0'+options['s'] : options['s'];
            options['m'] = options['m'] < 10 ? '0'+options['m'] : options['m'];
            options['h'] = options['h'] < 10 ? '0'+options['h'] : options['h'];

            if(options['d'] > 0) return options['d']+' '+options['h']+':'+options['m']+':'+options['s'];
            return options['h']+':'+options['m']+':'+options['s'];
        },

        /**
        * log text to console
        * @member Logger
        * @private
        */
        log: function() {

            var arr = new Error().stack.split("\n");
            var caller = arguments.callee.caller;
            var i=1;
            var max=arr.length;
            var where;
            for(;i<max; ++i) {
                if(caller.$name !== undefined) {
                    var cut = arr[i].lastIndexOf("/");
                    where = arr[i].substring(cut+1);
                    cut = where.lastIndexOf(":");
                    where = where.substring(0, cut).replace(/.js/, '');
                    where = caller.$name+'@'+where;
                }
                if(caller.caller !== null)
                    caller = caller.caller;
                else {
                    caller = {$name: "unkown"};
                }
            }

            var to_console = [];
            var d = new Date();
            var ms = d.getTime();
            var date = d.format("%d %b %H:%M:%S");
            var seconds_from_start = this.__format( (ms - __programStarts.getTime()) /1000 );

            var common = String.sprintf("%s[d%'06f][%s][p%s]%20s - %20s|", date, ms - __delta, seconds_from_start, process.pid, this.name, where);

            to_console.push(common);
            to_console.append(arguments);
            this.logFunction.apply(this, to_console);
            __delta = ms;
        },
        /**
        * @member Logger
        * @public
        */
        debug: function() {
            var args = [];
            args.push('(DBG)');
            args  = Array.fromIndexedObject(arguments, args);
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @public
        */
        verbose: function() {
            var args = [];
            args.push("\033[36m(VRB)");
            args.push(JSON.stringifyf(Array.fromIndexedObject(arguments)));
            args.push("\033[0m");
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @public
        */
        warning: function() {
            var args = [];
            args.push("\033[35m(WRN)");
            args = Array.fromIndexedObject(arguments, args);
            args.push("\033[0m");
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @public
        * @param {error} warning
        */
        error: function(error) {
            var args = [];
            args.push("\033[36m(ERR)");
            args = Array.fromIndexedObject(arguments, args);
            args.push("\033[0m");
            this.log.apply(this, args);
        },
        /**
        * @member Logger
        * @constructor
        */
        profile: function(context, update) {
            if(this.profile[context] === undefined) {
                this.profile[context] = new Date().getTime();
            } else {
                var time = new Date().getTime() - this.profile[context];
                try {
                    console.log("["+time+"]"+context);
                }catch(e) {
                }
                if(update !== undefined) {
                    this.profile[context] = new Date().getTime();
                } else {
                    this.profile[context] = undefined;
                }
            }
        }
    };

    exports.Logger = new Class(LoggerPrototype);
})();


(function() {
    /**
     * @class DelayedChain
     */
    exports.DelayedChain = new Class({

        $chain: [],

        executing: false,

        /**
         * @member DelayedChain
         * @param Function fn
         * @param Number delay
         */
        chain: function(){
            var args = Array.flatten(arguments);
            var i=0, max=args.length;
            for(;i<max;i+=2) {
                this.$chain.push({delay: args[i+1], fn: args[i]});
            }
            return this;
        },
        /**
         * dispatch the chain, prevents from being called twice
         * @member DelayedChain
         */
        callChain: function(){
            if (this.$chain.length === 0 || this.executing === null) {
                this.executing = false;
                return false;
            }

            this.executing = true;
            var exec = this.$chain.shift();
            exec.fn.apply(this, arguments);
            this.callChain.delay(exec.delay, this);

            return true;
        },
        stopChain: function() {
            this.executing = null;
        },
        /**
         * remove all function in the chain
         * @member DelayedChain
         */
        clearChain: function(){
            this.$chain.empty();
            return this;
        }

    });
})();

var Element = {};
Element.ShortStyles = {};
Element.Styles = {
    position: '@ @',     x: '@',             y: '@',
    rotate: '@',
    scale: '@ @',        scaleX: '@',        scaleY: '@',
    skew: '@ @',         skewX: '@',         skewY: '@'
};

/*
---

name: Fx

description: Contains the basic animation logic to be extended by all other Fx Classes.

license: MIT-style license.

requires: [Chain, Events, Options]

provides: Fx

...
*/

(function(){

var Fx = exports.Fx = new Class({

    Implements: [Chain, Events, Options],

    options: {
        /*
        onStart: nil,
        onCancel: nil,
        onComplete: nil,
        */
        fps: 60,
        unit: false,
        duration: 500,
        frames: null,
        frameSkip: true,
        link: 'ignore'
    },

    initialize: function(options){
        this.subject = this.subject || this;
        this.setOptions(options);
    },

    getTransition: function(){
        return function(p){
            return -(Math.cos(Math.PI * p) - 1) / 2;
        };
    },

    step: function(now){
        if (this.options.frameSkip){
            var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
            this.time = now;
            this.frame += frames;
        } else {
            this.frame++;
        }

        if (this.frame < this.frames){
            var delta = this.transition(this.frame / this.frames);
            this.set(this.compute(this.from, this.to, delta));
        } else {
            this.frame = this.frames;
            this.set(this.compute(this.from, this.to, 1));
            this.stop();
        }
    },

    set: function(now){
        return now;
    },

    compute: function(from, to, delta){
        return Fx.compute(from, to, delta);
    },

    check: function(){
        if (!this.isRunning()) return true;
        switch (this.options.link){
            case 'cancel': this.cancel(); return true;
            case 'chain': this.chain(this.caller.pass(arguments, this)); return false;
        }
        return false;
    },

    //<radamn>
    start: function(from, to, autolistener){
        autolistener = autolistener || true;
        if (!this.check(from, to)) return this;
        this.from = from;
        this.to = to;
        this.frame = (this.options.frameSkip) ? 0 : -1;
        this.time = null;
        this.transition = this.getTransition();
        var frames = this.options.frames, fps = this.options.fps, duration = this.options.duration;
        this.duration = Fx.Durations[duration] || duration.toInt();
        this.frameInterval = 1000 / fps;
        this.frames = frames || Math.round(this.duration / this.frameInterval);
        this.fireEvent('start', this.subject);

        if(autolistener)
            pushInstance.call(this, fps);
        return this;
    },
    //</radamn>

    stop: function(){
        if (this.isRunning()){
            this.time = null;
            pullInstance.call(this, this.options.fps);
            if (this.frames == this.frame){
                this.fireEvent('complete', this.subject);
                if (!this.callChain()) this.fireEvent('chainComplete', this.subject);
            } else {
                this.fireEvent('stop', this.subject);
            }
        }
        return this;
    },

    cancel: function(){
        if (this.isRunning()){
            this.time = null;
            pullInstance.call(this, this.options.fps);
            this.frame = this.frames;
            this.fireEvent('cancel', this.subject).clearChain();
        }
        return this;
    },

    pause: function(){
        if (this.isRunning()){
            this.time = null;
            pullInstance.call(this, this.options.fps);
        }
        return this;
    },

    resume: function(){
        if ((this.frame < this.frames) && !this.isRunning()) pushInstance.call(this, this.options.fps);
        return this;
    },

    isRunning: function(){
        var list = instances[this.options.fps];
        return list && list.contains(this);
    }

});

Fx.compute = function(from, to, delta){
    return (to - from) * delta + from;
};

Fx.Durations = {'short': 250, 'normal': 500, 'long': 1000};

// global timers

var instances = {}, timers = {};

var loop = function(){
    var now = Date.now();
    for (var i = this.length; i--;){
        var instance = this[i];
        if (instance) instance.step(now);
    }
};

var pushInstance = function(fps){
    var list = instances[fps] || (instances[fps] = []);
    list.push(this);
    if (!timers[fps]) timers[fps] = loop.periodical(Math.round(1000 / fps), list);
};

var pullInstance = function(fps){
    var list = instances[fps];
    if (list){
        list.erase(this);
        if (!list.length && timers[fps]){
            delete instances[fps];
            timers[fps] = clearInterval(timers[fps]);
        }
    }
};

})(exports);

/*
---

name: Fx.Transitions

description: Contains a set of advanced transitions to be used with any of the Fx Classes.

license: MIT-style license.

credits:
  - Easing Equations by Robert Penner, <http://www.robertpenner.com/easing/>, modified and optimized to be used with MooTools.

requires: Fx

provides: Fx.Transitions

...
*/

Fx.implement({

    getTransition: function(){
        var trans = this.options.transition || Fx.Transitions.Sine.easeInOut;
        if (typeof trans == 'string'){
            var data = trans.split(':');
            trans = Fx.Transitions;
            trans = trans[data[0]] || trans[data[0].capitalize()];
            if (data[1]) trans = trans['ease' + data[1].capitalize() + (data[2] ? data[2].capitalize() : '')];
        }
        return trans;
    }

});

Fx.Transition = function(transition, params){
    params = Array.from(params);
    var easeIn = function(pos){
        return transition(pos, params);
    };
    return Object.append(easeIn, {
        easeIn: easeIn,
        easeOut: function(pos){
            return 1 - transition(1 - pos, params);
        },
        easeInOut: function(pos){
            return (pos <= 0.5 ? transition(2 * pos, params) : (2 - transition(2 * (1 - pos), params))) / 2;
        }
    });
};

Fx.Transitions = {

    linear: function(zero){
        return zero;
    }

};



Fx.Transitions.extend = function(transitions){
    for (var transition in transitions) Fx.Transitions[transition] = new Fx.Transition(transitions[transition]);
};

Fx.Transitions.extend({

    Pow: function(p, x){
        return Math.pow(p, x && x[0] || 6);
    },

    Expo: function(p){
        return Math.pow(2, 8 * (p - 1));
    },

    Circ: function(p){
        return 1 - Math.sin(Math.acos(p));
    },

    Sine: function(p){
        return 1 - Math.cos(p * Math.PI / 2);
    },

    Back: function(p, x){
        x = x && x[0] || 1.618;
        return Math.pow(p, 2) * ((x + 1) * p - x);
    },

    Bounce: function(p){
        var value;
        for (var a = 0, b = 1; 1; a += b, b /= 2){
            if (p >= (7 - 4 * a) / 11){
                value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
                break;
            }
        }
        return value;
    },

    Elastic: function(p, x){
        return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x && x[0] || 1) / 3);
    }

});

['Quad', 'Cubic', 'Quart', 'Quint'].each(function(transition, i){
    Fx.Transitions[transition] = new Fx.Transition(function(p){
        return Math.pow(p, i + 2);
    });
});



(function() {

var ChainControl = new Class({
	cont: true,
	current: 0,
	initialize: function(chain) {
		this.chain = chain;
	},
	stop: function() {
		this.cont = 0;
		return this;
	},
	isStop: function() {
		return !this.cont;
	},
	isEnd: function() {
		return this.current >= this.chain.$chain.length;
	},
	set: function(i) {
		this.current = true;
	},
	execute: function(i, moreargs) {
		this.current = i;
		var args = [this.chain.$lastResult, this],
			j=0,
			jmax=moreargs.length | 0;
		for(;j<jmax;++j) args.push(moreargs[j]);
		
		if(i >= this.chain.$chain.length ) {
			console.log("the end!");
			return false;
		}
		
		this.chain.$lastResult = this.chain.$chain[i].apply(this, args);
		this.chain.$results.push(this.chain.$lastResult);
	
		return this;
	},
	next: function() {
		this.execute(++this.current, arguments);
	},
	continue: function() {
		this.cont = true;
		return this;
	},
	set: function(i) {
		this.actual = i;
		return this;
	},
	continueNext: function() {
		this.cont = true;
		return this;
	},
});
/**
 * Special implementation of chain pattern
 * - has notion of the previous result
 * - any function can stop the chain and resume
 * - 
 */
this.AsyncChain = new Class({
    $chain: [],
	$results: [],
	$lastResult: null,
	$control : null,

    chain: function(){
		if (this.$control == null)  {
			this.$control = new ChainControl(this);
		}
		
		var i=0,
			max=arguments.length;
		for(;i<max;++i) this.$chain.push(arguments[i]);
		
        return this;
    },
/**
 * exec and remove!
 */
    next: function() {
		if(this.$control.execute(this.$chain.length === 1)) {
			var args = [this.$lastResult, this.$control];
			var i=0,
				max=arguments.length;
			for(;i<max;++i) args.push(arguments[i]);
			
			this.$lastResult = (this.$chain.length) ? this.$chain.shift().apply(this, args) : false;
			this.$results.push(this.$lastResult);
			return true;
		}
		return false;
    },
/**
 * remove!
 */
    clear: function() {
        this.$chain.empty();
		this.$lastResult.empty();
		this.$results = null;

        return this;
    },
/**
 * exec all
 */
	executeAll: function() {
		var i = 0,
			max = this.$chain.length;
		
		this.$lastResult = null;
		this.$results = [];
		this.$control.continue();

		for(;i<max;++i) {
			if(this.$control.isStop()) continue;
			this.$control.execute(i, arguments);
		}
		return this.$results;
	},
	
	remove: function(fn) {
        var index =  this.$chain.indexOf(fn);
        if (index != -1) this.$chain.splice(index, 1);
	},

});


var removeOn = function(string){
    return string.replace(/^on([A-Z])/, function(full, first){
        return first.toLowerCase();
    });
};



this.AsyncEventChain = new Class({

    $events: {},

    addEvent: function(type, fn, internal, execute_allways){
        type = removeOn(type);



        this.$events[type] = (this.$events[type] || new AsyncChain()).chain(fn);
        if (internal) fn.internal = true;
		if (execute_allways) fn.force = true; // support ??
		
        return this;
    },

    addEvents: function(events){
        for (var type in events) this.addEvent(type, events[type]);
        return this;
    },

    fireEvent: function(type, args, delay){
        type = removeOn(type);
        var events = this.$events[type];
        if (!events) return this;

		if (delay) {
			events.executeAll.delay(delay, this, args);
		} else {
			events.executeAll(args);
		}

        return this;
    },

    removeEvent: function(type, fn){
        type = removeOn(type);
        var events = this.$events[type];
        if (events && !fn.internal){
			events.remove(fn);
        }
        return this;
    },

    removeEvents: function(events){
        var type;
        if (typeOf(events) == 'object'){
            for (type in events) this.removeEvent(type, events[type]);
            return this;
        }
        if (events) events = removeOn(events);
        for (type in this.$events){
            if (events && events != type) continue;
            var fns = this.$events[type];
            for (var i = fns.length; i--;) if (i in fns){
                this.removeEvent(type, fns[i]);
            }
        }
        return this;
    }

});

var f1 = function(previous, control) { console.log("1", arguments); return "first"; };
var f2 = function(previous, control) { console.log("2", arguments); control.stop(); control.continue(); return "second"; };
var f3 = function(previous, control) { console.log("3", arguments); control.stop(); 
	setTimeout(function() {
		console.log("3! delayed!!!");
		control.continue();
		control.next();
	}, 2000);
	return "delayed"; };
var f4 = function(previous, control) { console.log("this is delayed too!!!"); return "fourth"; };

var f5 = function() { console.log("last!!1"); process.exit(); };

var ev = new AsyncEventChain();
ev.addEvent("click", f1);
ev.addEvent("click", f2);
ev.addEvent("click", f3);
ev.addEvent("click", f4);
ev.addEvent("click", f5);
ev.fireEvent("click");

})/*(exports) do not exec yet*/;

})(typeof exports === "undefined" ? this : global);