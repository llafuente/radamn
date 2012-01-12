
var $ = this.$ = {};
$.typeOf = function(val) {
	var type = (typeof val).toLowerCase();
	if(val === null) return "null";
	if(val === undefined) return "null";
	if(type == 'number' && isNaN(val)) return "null";
	if(val.$name !== undefined) return val.$name;
	
	return type;
};

$.instanceOf = function(cls, cls_name) {
	return cls.prototype !== undefined && (
		cls.prototype.$name == cls_name ||
			(
			cls.prototype.$extended !== undefined
			  &&
			cls.prototype.$extended.indexOf(cls_name) !== -1
			)
		);
};

$.assertType = function (val, type, position) {
	if($.typeOf(val) != type)
		console.log("argument[",position || "?", "] must be ", type, "and is [", $.typeOf(val),"] -> ", val);
};

(function () {

	var prototyper = function() {};

	// copy options and methods
	function extend(to, from, hidden) {
		hidden = hidden || false;
		
		to.prototype.$extended.push(from.prototype.$name);
		
		var i =0;
			max = from.prototype.$methods,
			name = null;
			
		for(;i<max;++i) {
			name = from.prototype.$methods[i];
			
			to.prototype.$methods.push(name);
			// parent()!
			to.prototype[name] = from.prototype[name];
		}
		
		max = from.prototype.$options;
		for(;i<max;++i) {
			name = from.prototype.$options[i];
			
			to.prototype.$options.push(name);
			to.prototype[name] = from.prototype[name];
		}
		
	}
	// copy just methods
	function implement(to, from, hidden) {
		var i = null;

		var target = to.prototype;
		if(!to.prototype.$prototyping) {
			target = to;
		}
		
		// is a class?
		if($.instanceOf(from, "Class")) {
			for(i in from.prototype) {
				if(i == "$name") continue;
				if(i == "$options") continue;
				if(i == "$methods") continue;
				if(i == "$extended") continue;
				if(from[i] != "function") continue;
				
				if(i == "initialize") {
					target["$initialize"] = from[i];
					continue;
				}
				
				
				if(target.$methods)
					target.$methods.push(i);
				target[i] = from[i];			
			}
		} else {
			// object
			for(i in from) {
				if(i == "initialize") {
					target["$initialize"] = from[i];
					continue;
				}
				
				if(target.$methods)
					target.$methods.push(i);
				target[i] = from[i];			
			}
		}
	}
	prototyper.prototype.$name = "potoryper";
	prototyper.prototype.$extended = [];
	
	prototyper.setOptions = function(options) {
		var key = null;
		for(key in options) {
			this.prototype.$options.push(key);
			this.prototype[key] = options[key];
		}
	};
	prototyper.setMethods = function(methods) {
		var key = null;
		for(key in methods) {
			this.prototype.$methods.push(key);
			this.prototype[key] = methods[key];
		}
	};

	prototyper.Extend = function(cls) {
		extend(this, cls);
		
	};

	prototyper.Implement = function(methods) {
		implement(this, methods);
	};

	prototyper.alias = function() {};

	$.Class = function(name, options, methods) {
		var cls = function(options) {
			options = options || {};
			
			var i = 0,
				max = this.$options.length;
				
			for(;i<max;++i) {
				var opt = this.$options[i];
				if(options[opt] !== undefined) {
					this[opt] = options[opt];
				}
			}
			
			if(this.__construct) {
				this.__construct();
				delete this.initialize;
			}
				

			return this;
		};
		
		cls.__proto = cls.prototype;
		
		cls.prototype.$name = name;
		cls.prototype.$options = [];
		cls.prototype.$methods = [];
		cls.prototype.$extended = ["Class"];
		//? cls.prototype.Implement = prototyper.Implement; // implements in after new

		implement(cls, prototyper);
		cls.setOptions(options);
		
		cls.prototype.$prototyping = true;
		
		cls.prototype.$constructor = methods || {};
		return cls;
	};


})();

$.Iterable = function() {
	var objects = [];
	var values = {};
	
	var cls = function() {};
	cls.$name = "Iterable";
	cls.$extended = ["Class"];

	cls.set = function(key, value) {
		//if(key == "set" || key == "get" || key == "key" || key == "length" || key == "rem" || key == "each") throw new Error("invalid key name");
		if(values[key] !== undefined) {
			++this.length;
			objects.push(key);
		}
		values[key] = value;
	}
	cls.get = function(key) {
		var val = values[key];
		return val === undefined ? null : val;
	}
	cls.rem = function(key) {
		var cut = objects.indexOf(key);

		if(cut !== -1) {
			delete values[key];
			objects.splice(cut, 1);
			--this.length;
		}
	}
	cls.each = function(fn) {
		var i=0,
			max=objects.length;
		
		for(;i<max;++i) {
			fn(objects[i], values[objects[i]]);
		}
	}
	
	return cls;
};

Array.from = function(item){
    type = $.typeOf(item);
	switch(type) {
		case 'null' :
			return [];
		case 'array' :
			return item;
		case 'object' :
			var out = [];
			var i = null;
			for(i in item) {
				out[i] = item[i];
			}
			return out;
		default :
			return [item];
	}
};

(function() {
	var removeOn = function(string){
		return string.replace(/^on([A-Z])/, function(full, first){
			return first.toLowerCase();
		});
	};

	this.Events = new $.Class("Events", {
		$events: {}
	});

	this.Events.Implement({
		addEvent: function(type, fn, internal){
			type = removeOn(type);

			this.$events[type] = this.$events[type] || [];
			this.$events[type].push(fn);
			
			if (internal) fn.internal = true;
			return this;
		},

		addEvents: function(events){
			var type = null;
			for (type in events) this.addEvent(type, events[type]);
			return this;
		},

		fireEvent: function(type, args, delay){
			type = removeOn(type);
			var events = this.$events[type];
			if (!events) return this;
			
			var i = 0;
				max = events.length;
			for(;i<max;++i) {
			console.log(i);
				if (delay) events[i].delay(delay, this, args); //!!!<--
				else events[i].apply(this, args);
			}
			
			args = Array.from(args);
			return this;
		},

		removeEvent: function(type, fn){
			type = removeOn(type);
			var events = this.$events[type];
			console.log("this.$events", this.$events);
			console.log(events);
			if (events && !fn.internal){
				var index =  events.indexOf(fn);
				if (index != -1) events.splice(index,1);
			}
			return this;
		},

		removeEvents: function(events){
			var type;
			if ($.typeOf(events) == 'object'){
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
	
})();


var ev = new Events();

var log = function() {console.log("!!!!!!!!!!! --- !!!!!!"); };

ev.addEvent("xx", log);
ev.fireEvent("xx", log);
ev.removeEvent("xx", log);
ev.fireEvent("xx", log);

return ;



var Vec2 = $.Class("Vec2", {x:0, y:0});
Vec2.Implement({
	initialize: function() {
	},
	plus:function(v2) {
		$.assertType(v2, "Vec2", 1);
		this.x += v2.x;
		this.y += v2.y;
	}
});

var Vec3 = $.Class("Vec3", {z:0});


new Vec2

console.log(Vec3.prototype);
Vec3.Extend(Vec2);
console.log(Vec3.prototype);

Vec3.Implement({
	plus:function(v3) {
		$.assertType(v2, "Vec3", 1);
		this.x += v2.x;
		this.y += v2.y;
	}
});

var v = new Vec2();
var v2 = new Vec2({x:0,y:1});
var v3 = new Vec2({x:0,y:1, z:3});

console.log("vec3 is Vec2 => ", $.instanceOf(Vec3, "Vec2"));
console.log("vec3 is Vec3 => ", $.instanceOf(Vec3, "Vec3"));
console.log("vec3 is Class => ", $.instanceOf(Vec2, "Class"));


console.log($.instanceOf(v), "Class");

v.plus(v2);
console.log(v);
console.log(v2);


/*, {x:1, y:2}, {
	plus: 
});*/


(function() {
	var types = [null, undefined, 0/0, "hola", {}, [], new Vec2(), new $.Iterable()];
	
	var i =0,
	max = types.length;
	
	for(;i<max;++i) {
		console.log(types[i], $.typeOf(types[i]));
	}

})();


console.log(Vec2.prototype);
var t = new Vec2();
console.log(t.prototype);
console.log(t.x);



var ite = new $.Iterable();
ite.set("ok", "go!");
ite.set("ok2", "go!");
ite.set("ok3", "go!");

ite.each(console.log);

ite.rem("ok3", "go!");
console.log(ite.get("ok3", "go!"));

ite.each(console.log);

return ;


(function(){

var typeOf = this.typeOf = function(item){
    if (item.$class) return item.$class;

    if (item.nodeName){
        if (item.nodeType == 1) return 'element';
        if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
    } else if (typeof item.length == 'number'){
        if (item.callee) return 'arguments';
        if ('item' in item) return 'collection';
    } else if(item === null || item === undefined) {
		return "null";
	} else if(isFinite(item)) {
		return 'number';
	}

    return typeof item;
};

var instanceOf = this.instanceOf = function(item, object){
    if (item == null) return false;
    var constructor = item.$constructor || item.constructor;
    while (constructor){
        if (constructor === object) return true;
        constructor = constructor.parent;
    }
    return item instanceof object;
};


	var Function = this.Function;

	Function.prototype.extend = function(key, value){
		this[key] = value;
	};

	Function.prototype.implement = function(key, value){
		this.prototype[key] = value;
	};



// Type
var Type = this.Type = function(name, object){
    if (name){
        var lower = name.toLowerCase();
        var typeCheck = function(item){
            return (typeOf(item) == lower);
        };

        Type['is' + name] = typeCheck;
        if (object != null){
            object.prototype.$class = lower;
        }
    }

    if (object == null) return null;

    object.extend(this);

    return object;
};


var implement = function(name, method){
    if (method && method.$hidden) return;

    var hooks = hooksOf(this);

    for (var i = 0; i < hooks.length; i++){
        var hook = hooks[i];
        if (typeOf(hook) == 'type') implement.call(hook, name, method);
        else hook.call(this, name, method);
    }

    var previous = this.prototype[name];
    if (previous == null || !previous.$protected) this.prototype[name] = method;

    if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
        return method.apply(item, slice.call(arguments, 1));
    });
};

var extend = function(name, method){
    if (method && method.$hidden) return;
    var previous = this[name];
    if (previous == null || !previous.$protected) this[name] = method;
};

Type.implement({

    implement: implement,

    extend: extend,

    alias: function(name, existing){
        implement.call(this, name, this.prototype[existing]);
    },

    mirror: function(hook){
        hooksOf(this).push(hook);
        return this;
    }

});


new Type('Type', Type);

Object.extend = extend;
Object.append = function(original){
    for (var i = 1, l = arguments.length; i < l; i++){
        var extended = arguments[i] || {};
        for (var key in extended) original[key] = extended[key];
    }
    return original;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;
Object.forEach = function(object, fn, bind){
    for (var key in object){
        if (hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
    }
};

Object.each = Object.forEach;

Function.implement({
    delay: function(delay, bind, args){
        return setTimeout(this.pass((args == null ? [] : args), bind), delay);
    },

    periodical: function(periodical, bind, args){
        return setInterval(this.pass((args == null ? [] : args), bind), periodical);
    }

});

var Class = this.Class = new Type('Class', function(params){
    if (instanceOf(params, Function)) params = {initialize: params};

    var newClass = function(){
        reset(this);
        if (newClass.$prototyping) return this;
        this.$caller = null;
        var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
        this.$caller = this.caller = null;
        return value;
    };
	newClass.extend(this);
	newClass.implement(params);

    newClass.$constructor = Class;
    newClass.prototype.$constructor = newClass;
    newClass.prototype.parent = parent;

    return newClass;
});

var parent = function(){
    if (!this.$caller) throw new Error('The method "parent" cannot be called.');
    var name = this.$caller.$name,
        parent = this.$caller.$owner.parent,
        previous = (parent) ? parent.prototype[name] : null;
    if (!previous) throw new Error('The method "' + name + '" has no parent.');
    return previous.apply(this, arguments);
};

var reset = function(object){
    for (var key in object){
        var value = object[key];
        switch (typeOf(value)){
            case 'object':
                var F = function(){};
                F.prototype = value;
                object[key] = reset(new F);
            break;
            case 'array': object[key] = value.clone(); break;
        }
    }
    return object;
};

var wrap = function(self, key, method){
    if (method.$origin) method = method.$origin;
    var wrapper = function(){
        if (method.$protected && this.$caller == null) throw new Error('The method "' + key + '" cannot be called.');
        var caller = this.caller, current = this.$caller;
        this.caller = current; this.$caller = wrapper;
        var result = method.apply(this, arguments);
        this.$caller = current; this.caller = caller;
        return result;
    }.extend({$owner: self, $origin: method, $name: key});
    return wrapper;
};

var implement = function(key, value, retain){
    if (Class.Mutators.hasOwnProperty(key)){
        value = Class.Mutators[key].call(this, value);
        if (value == null) return this;
    }

    if (typeOf(value) == 'function'){
        if (value.$hidden) return this;
        this.prototype[key] = (retain) ? value : wrap(this, key, value);
    } else {
        Object.merge(this.prototype, key, value);
    }

    return this;
};

var getInstance = function(klass){
    klass.$prototyping = true;
    var proto = new klass;
    delete klass.$prototyping;
    return proto;
};

Class.implement('implement', implement);

Class.Mutators = {

    Extends: function(parent){
        this.parent = parent;
        this.prototype = getInstance(parent);
    },

    Implements: function(items){
		var key = null;
		for(key in items) {
			this.prototype[key] = items[key];
		}
		/*
        Array.from(items).each(function(item){
            var instance = new item;
            for (var key in instance) implement.call(this, key, instance[key], true);
        }, this);
		*/
    }
};

this.Events = new Class({

    $events: {},

    addEvent: function(type, fn, internal){
        type = removeOn(type);



        this.$events[type] = (this.$events[type] || []).include(fn);
        if (internal) fn.internal = true;
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
        args = Array.from(args);
        events.each(function(fn){
            if (delay) fn.delay(delay, this, args);
            else fn.apply(this, args);
        }, this);
        return this;
    },

    removeEvent: function(type, fn){
        type = removeOn(type);
        var events = this.$events[type];
        if (events && !fn.internal){
            var index =  events.indexOf(fn);
            if (index != -1) delete events[index];
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

this.Options = new Class({

    setOptions: function(){
        var options = this.options = Object.merge.apply(null, [{}, this.options].append(arguments));
        if (this.addEvent) for (var option in options){
            if (typeOf(options[option]) != 'function' || !(/^on[A-Z]/).test(option)) continue;
            this.addEvent(option, options[option]);
            delete options[option];
        }
        return this;
    }

});



})();