/*
---

name: Prefix

description: Loads MooTools as a CommonJS Module.

license: MIT-style license.

copyright: Copyright (c) 2010 [Christoph Pojer](http://cpojer.net/).

authors: Christoph Pojer

provides: [Prefix]

...
*/

var GLOBAL_ITEMS = function(){
    var items = [];

    for (var key in this)
        items.push(key);

    return items;
}();


/*
---

name: Core

description: The heart of MooTools.

license: MIT-style license.

copyright: Copyright (c) 2006-2010 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

inspiration:
  - Class implementation inspired by [Base.js](http://dean.edwards.name/weblog/2006/03/base/) Copyright (c) 2006 Dean Edwards, [GNU Lesser General Public License](http://opensource.org/licenses/lgpl-license.php)
  - Some functionality inspired by [Prototype.js](http://prototypejs.org) Copyright (c) 2005-2007 Sam Stephenson, [MIT License](http://opensource.org/licenses/mit-license.php)

provides: [Core, MooTools, Type, typeOf, instanceOf, Native]

...
*/

(function(){

this.MooTools = {
    version: '1.3.2dev',
    build: '%build%'
};

// typeOf, instanceOf

var typeOf = this.typeOf = function(item){
    if (item == null) return 'null';
    if (item.$family) return item.$family();

    if (item.nodeName){
        if (item.nodeType == 1) return 'element';
        if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
    } else if (typeof item.length == 'number'){
        if (item.callee) return 'arguments';
        if ('item' in item) return 'collection';
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

// Function overloading

var Function = this.Function;

var enumerables = true;
for (var i in {toString: 1}) enumerables = null;
if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

Function.prototype.overloadSetter = function(usePlural){
    var self = this;
    return function(a, b){
        if (a == null) return this;
        if (usePlural || typeof a != 'string'){
            for (var k in a) self.call(this, k, a[k]);
            if (enumerables) for (var i = enumerables.length; i--;){
                k = enumerables[i];
                if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
            }
        } else {
            self.call(this, a, b);
        }
        return this;
    };
};

Function.prototype.overloadGetter = function(usePlural){
    var self = this;
    return function(a){
        var args, result;
        if (usePlural || typeof a != 'string') args = a;
        else if (arguments.length > 1) args = arguments;
        if (args){
            result = {};
            for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
        } else {
            result = self.call(this, a);
        }
        return result;
    };
};

Function.prototype.extend = function(key, value){
    this[key] = value;
}.overloadSetter();

Function.prototype.implement = function(key, value){
    this.prototype[key] = value;
}.overloadSetter();

// From

var slice = Array.prototype.slice;

Function.from = function(item){
    return (typeOf(item) == 'function') ? item : function(){
        return item;
    };
};

Array.from = function(item){
        if (item == null) return [];
        return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
};


Number.from = function(item){
        var number = parseFloat(item);
    return isFinite(number) ? number : null;
};

String.from = function(item){
    return item + '';
};

// hide, protect

Function.implement({

    hide: function(){
        this.$hidden = true;
        return this;
    },

    protect: function(){
        this.$protected = true;
        return this;
    }

});

// Type

var Type = this.Type = function(name, object){
    if (name){
        var lower = name.toLowerCase();
        var typeCheck = function(item){
            return (typeOf(item) == lower);
        };

        Type['is' + name] = typeCheck;
        if (object != null){
            object.prototype.$family = (function(){
                return lower;
            }).hide();
            //<1.2compat>
            object.type = typeCheck;
            //</1.2compat>
        }
    }

    if (object == null) return null;

    object.extend(this);
    object.$constructor = Type;
    object.prototype.$constructor = object;

    return object;
};

var toString = Object.prototype.toString;

Type.isEnumerable = function(item){
    return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
};

var hooks = {};

var hooksOf = function(object){
    var type = typeOf(object.prototype);
    return hooks[type] || (hooks[type] = []);
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

    implement: implement.overloadSetter(),

    extend: extend.overloadSetter(),

    alias: function(name, existing){
        implement.call(this, name, this.prototype[existing]);
    }.overloadSetter(),

    mirror: function(hook){
        hooksOf(this).push(hook);
        return this;
    }

});

new Type('Type', Type);

// Default Types

var force = function(name, object, methods){
    var isType = (object != Object),
        prototype = object.prototype;

    if (isType) object = new Type(name, object);

    for (var i = 0, l = methods.length; i < l; i++){
        var key = methods[i],
            generic = object[key],
            proto = prototype[key];

        if (generic) generic.protect();

        if (isType && proto){
            delete prototype[key];
            prototype[key] = proto.protect();
        }
    }

    if (isType) object.implement(prototype);

    return force;
};

force('String', String, [
    'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
    'slice', 'split', 'substr', 'substring', 'toLowerCase', 'toUpperCase'
])('Array', Array, [
    'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
    'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
])('Number', Number, [
    'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
])('Function', Function, [
    'apply', 'call', 'bind'
])('RegExp', RegExp, [
    'exec', 'test'
])('Object', Object, [
    'create', 'defineProperty', 'defineProperties', 'keys',
    'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
    'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
])('Date', Date, ['now']);

Object.extend = extend.overloadSetter();

Date.extend('now', function(){
    return +(new Date);
});

new Type('Boolean', Boolean);

// fixes NaN returning as Number

Number.prototype.$family = function(){
    return isFinite(this) ? 'number' : 'null';
}.hide();

// Number.random

Number.extend('random', function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
});

// forEach, each

var hasOwnProperty = Object.prototype.hasOwnProperty;
Object.extend('forEach', function(object, fn, bind){
    for (var key in object){
        if (hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
    }
});

Object.each = Object.forEach;

Array.implement({

    forEach: function(fn, bind){
        for (var i = 0, l = this.length; i < l; i++){
            if (i in this) fn.call(bind, this[i], i, this);
        }
    },

    each: function(fn, bind){
        Array.forEach(this, fn, bind);
        return this;
    }

});

// Array & Object cloning, Object merging and appending

var cloneOf = function(item){
    switch (typeOf(item)){
        case 'array': return item.clone();
        case 'object': return Object.clone(item);
        default: return item;
    }
};

Array.implement('clone', function(){
    var i = this.length, clone = new Array(i);
    while (i--) clone[i] = cloneOf(this[i]);
    return clone;
});

var mergeOne = function(source, key, current){
    switch (typeOf(current)){
        case 'object':
            if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
                        else if (current.cloneable === undefined) source[key] = current;
            else source[key] = Object.clone(current);
        break;
        case 'array': source[key] = current.clone(); break;
        default: source[key] = current;
    }
    return source;
};

Object.extend({

    merge: function(source, k, v){
        if (typeOf(k) == 'string') return mergeOne(source, k, v);
        for (var i = 1, l = arguments.length; i < l; i++){
            var object = arguments[i];
            for (var key in object) mergeOne(source, key, object[key]);
        }
        return source;
    },

    clone: function(object){
        var clone = {};
        for (var key in object) clone[key] = cloneOf(object[key]);
        return clone;
    },

    append: function(original){
        for (var i = 1, l = arguments.length; i < l; i++){
            var extended = arguments[i] || {};
            for (var key in extended) original[key] = extended[key];
        }
        return original;
    }

});

// Object-less types

['Object', 'WhiteSpace', 'TextNode', 'Collection', 'Arguments'].each(function(name){
    new Type(name);
});

// Unique ID

var UID = Date.now();

String.extend('uniqueID', function(){
    return (UID++).toString(36);
});

//<1.2compat>

var Hash = this.Hash = new Type('Hash', function(object){
    if (typeOf(object) == 'hash') object = Object.clone(object.getClean());
    for (var key in object) this[key] = object[key];
    return this;
});

Hash.implement({

    forEach: function(fn, bind){
        Object.forEach(this, fn, bind);
    },

    getClean: function(){
        var clean = {};
        for (var key in this){
            if (this.hasOwnProperty(key)) clean[key] = this[key];
        }
        return clean;
    },

    getLength: function(){
        var length = 0;
        for (var key in this){
            if (this.hasOwnProperty(key)) length++;
        }
        return length;
    }

});

Hash.alias('each', 'forEach');

Object.type = Type.isObject;

var Native = this.Native = function(properties){
    return new Type(properties.name, properties.initialize);
};

Native.type = Type.type;

Native.implement = function(objects, methods){
    for (var i = 0; i < objects.length; i++) objects[i].implement(methods);
    return Native;
};

var arrayType = Array.type;
Array.type = function(item){
    return instanceOf(item, Array) || arrayType(item);
};

this.$A = function(item){
    return Array.from(item).slice();
};

this.$arguments = function(i){
    return function(){
        return arguments[i];
    };
};

this.$chk = function(obj){
    return !!(obj || obj === 0);
};

this.$clear = function(timer){
    clearTimeout(timer);
    clearInterval(timer);
    return null;
};

this.$defined = function(obj){
    return (obj != null);
};

this.$each = function(iterable, fn, bind){
    var type = typeOf(iterable);
    ((type == 'arguments' || type == 'collection' || type == 'array' || type == 'elements') ? Array : Object).each(iterable, fn, bind);
};

this.$empty = function(){};

this.$extend = function(original, extended){
    return Object.append(original, extended);
};

this.$H = function(object){
    return new Hash(object);
};

this.$merge = function(){
    var args = Array.slice(arguments);
    args.unshift({});
    return Object.merge.apply(null, args);
};

this.$lambda = Function.from;
this.$mixin = Object.merge;
this.$random = Number.random;
this.$splat = Array.from;
this.$time = Date.now;

this.$type = function(object){
    var type = typeOf(object);
    if (type == 'elements') return 'array';
    return (type == 'null') ? false : type;
};

this.$unlink = function(object){
    switch (typeOf(object)){
        case 'object': return Object.clone(object);
        case 'array': return Array.clone(object);
        case 'hash': return new Hash(object);
        default: return object;
    }
};

//</1.2compat>

})();


/*
---

name: Array

description: Contains Array Prototypes like each, contains, and erase.

license: MIT-style license.

requires: Type

provides: Array

...
*/

Array.implement({

    /*<!ES5>*/
    every: function(fn, bind){
        for (var i = 0, l = this.length; i < l; i++){
            if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
        }
        return true;
    },

    filter: function(fn, bind){
        var results = [];
        for (var i = 0, l = this.length; i < l; i++){
            if ((i in this) && fn.call(bind, this[i], i, this)) results.push(this[i]);
        }
        return results;
    },

    indexOf: function(item, from){
        var len = this.length;
        for (var i = (from < 0) ? Math.max(0, len + from) : from || 0; i < len; i++){
            if (this[i] === item) return i;
        }
        return -1;
    },

    map: function(fn, bind){
        var results = [];
        for (var i = 0, l = this.length; i < l; i++){
            if (i in this) results[i] = fn.call(bind, this[i], i, this);
        }
        return results;
    },

    some: function(fn, bind){
        for (var i = 0, l = this.length; i < l; i++){
            if ((i in this) && fn.call(bind, this[i], i, this)) return true;
        }
        return false;
    },
    /*</!ES5>*/

    clean: function(){
        return this.filter(function(item){
            return item != null;
        });
    },

    invoke: function(methodName){
        var args = Array.slice(arguments, 1);
        return this.map(function(item){
            return item[methodName].apply(item, args);
        });
    },

    associate: function(keys){
        var obj = {}, length = Math.min(this.length, keys.length);
        for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
        return obj;
    },

    link: function(object){
        var result = {};
        for (var i = 0, l = this.length; i < l; i++){
            for (var key in object){
                if (object[key](this[i])){
                    result[key] = this[i];
                    delete object[key];
                    break;
                }
            }
        }
        return result;
    },

    contains: function(item, from){
        return this.indexOf(item, from) != -1;
    },

    append: function(array){
        this.push.apply(this, array);
        return this;
    },

    getLast: function(){
        return (this.length) ? this[this.length - 1] : null;
    },

    getRandom: function(){
        return (this.length) ? this[Number.random(0, this.length - 1)] : null;
    },

    include: function(item){
        if (!this.contains(item)) this.push(item);
        return this;
    },

    combine: function(array){
        for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
        return this;
    },

    erase: function(item){
        for (var i = this.length; i--;){
            if (this[i] === item) this.splice(i, 1);
        }
        return this;
    },

    empty: function(){
        this.length = 0;
        return this;
    },

    flatten: function(){
        var array = [];
        for (var i = 0, l = this.length; i < l; i++){
            var type = typeOf(this[i]);
            if (type == 'null') continue;
            array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
        }
        return array;
    },

    pick: function(){
        for (var i = 0, l = this.length; i < l; i++){
            if (this[i] != null) return this[i];
        }
        return null;
    },

    hexToRgb: function(array){
        if (this.length != 3) return null;
        var rgb = this.map(function(value){
            if (value.length == 1) value += value;
            return value.toInt(16);
        });
        return (array) ? rgb : 'rgb(' + rgb + ')';
    },

    rgbToHex: function(array){
        if (this.length < 3) return null;
        if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
        var hex = [];
        for (var i = 0; i < 3; i++){
            var bit = (this[i] - 0).toString(16);
            hex.push((bit.length == 1) ? '0' + bit : bit);
        }
        return (array) ? hex : '#' + hex.join('');
    }

});

//<1.2compat>

Array.alias('extend', 'append');

var $pick = function(){
    return Array.from(arguments).pick();
};

//</1.2compat>


/*
---

name: String

description: Contains String Prototypes like camelCase, capitalize, test, and toInt.

license: MIT-style license.

requires: Type

provides: String

...
*/

String.implement({

    test: function(regex, params){
        return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
    },

    contains: function(string, separator){
        return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
    },

    trim: function(){
        return this.replace(/^\s+|\s+$/g, '');
    },

    clean: function(){
        return this.replace(/\s+/g, ' ').trim();
    },

    camelCase: function(){
        return this.replace(/-\D/g, function(match){
            return match.charAt(1).toUpperCase();
        });
    },

    hyphenate: function(){
        return this.replace(/[A-Z]/g, function(match){
            return ('-' + match.charAt(0).toLowerCase());
        });
    },

    capitalize: function(){
        return this.replace(/\b[a-z]/g, function(match){
            return match.toUpperCase();
        });
    },

    escapeRegExp: function(){
        return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
    },

    toInt: function(base){
        return parseInt(this, base || 10);
    },

    toFloat: function(){
        return parseFloat(this);
    },

    hexToRgb: function(array){
        var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
        return (hex) ? hex.slice(1).hexToRgb(array) : null;
    },

    rgbToHex: function(array){
        var rgb = this.match(/\d{1,3}/g);
        return (rgb) ? rgb.rgbToHex(array) : null;
    },

    substitute: function(object, regexp){
        return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
            if (match.charAt(0) == '\\') return match.slice(1);
            return (object[name] != null) ? object[name] : '';
        });
    }

});


/*
---

name: Function

description: Contains Function Prototypes like create, bind, pass, and delay.

license: MIT-style license.

requires: Type

provides: Function

...
*/

Function.extend({

    attempt: function(){
        for (var i = 0, l = arguments.length; i < l; i++){
            try {
                return arguments[i]();
            } catch (e){}
        }
        return null;
    }

});

Function.implement({

    attempt: function(args, bind){
        try {
            return this.apply(bind, Array.from(args));
        } catch (e){}

        return null;
    },

    /*<!ES5>*/
    bind: function(bind){
        var self = this,
            args = (arguments.length > 1) ? Array.slice(arguments, 1) : null;

        return function(){
            if (!args && !arguments.length) return self.call(bind);
            if (args && arguments.length) return self.apply(bind, args.concat(Array.from(arguments)));
            return self.apply(bind, args || arguments);
        };
    },
    /*</!ES5>*/

    pass: function(args, bind){
        var self = this;
        if (args != null) args = Array.from(args);
        return function(){
            return self.apply(bind, args || arguments);
        };
    },

    delay: function(delay, bind, args){
        return setTimeout(this.pass((args == null ? [] : args), bind), delay);
    },

    periodical: function(periodical, bind, args){
        return setInterval(this.pass((args == null ? [] : args), bind), periodical);
    }

});

//<1.2compat>

delete Function.prototype.bind;

Function.implement({

    create: function(options){
        var self = this;
        options = options || {};
        return function(event){
            var args = options.arguments;
            args = (args != null) ? Array.from(args) : Array.slice(arguments, (options.event) ? 1 : 0);
            if (options.event) args = [event || window.event].extend(args);
            var returns = function(){
                return self.apply(options.bind || null, args);
            };
            if (options.delay) return setTimeout(returns, options.delay);
            if (options.periodical) return setInterval(returns, options.periodical);
            if (options.attempt) return Function.attempt(returns);
            return returns();
        };
    },

    bind: function(bind, args){
        var self = this;
        if (args != null) args = Array.from(args);
        return function(){
            return self.apply(bind, args || arguments);
        };
    },

    bindWithEvent: function(bind, args){
        var self = this;
        if (args != null) args = Array.from(args);
        return function(event){
            return self.apply(bind, (args == null) ? arguments : [event].concat(args));
        };
    },

    run: function(args, bind){
        return this.apply(bind, Array.from(args));
    }

});

var $try = Function.attempt;

//</1.2compat>


/*
---

name: Number

description: Contains Number Prototypes like limit, round, times, and ceil.

license: MIT-style license.

requires: Type

provides: Number

...
*/

Number.implement({

    limit: function(min, max){
        return Math.min(max, Math.max(min, this));
    },

    round: function(precision){
        precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
        return Math.round(this * precision) / precision;
    },

    times: function(fn, bind){
        for (var i = 0; i < this; i++) fn.call(bind, i, this);
    },

    toFloat: function(){
        return parseFloat(this);
    },

    toInt: function(base){
        return parseInt(this, base || 10);
    }

});

Number.alias('each', 'times');

(function(math){
    var methods = {};
    math.each(function(name){
        if (!Number[name]) methods[name] = function(){
            return Math[name].apply(null, [this].concat(Array.from(arguments)));
        };
    });
    Number.implement(methods);
})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);


/*
---

name: Class

description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.

license: MIT-style license.

requires: [Array, String, Function, Number]

provides: Class

...
*/

(function(){

var Class = this.Class = new Type('Class', function(params){
    if (instanceOf(params, Function)) params = {initialize: params};

    var newClass = function(){
        reset(this);
        if (newClass.$prototyping) return this;
        this.$caller = null;
        var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
        this.$caller = this.caller = null;
        return value;
    }.extend(this).implement(params);

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

Class.implement('implement', implement.overloadSetter());

Class.Mutators = {

    Extends: function(parent){
        this.parent = parent;
        this.prototype = getInstance(parent);
    },

    Implements: function(items){
        Array.from(items).each(function(item){
            var instance = new item;
            for (var key in instance) implement.call(this, key, instance[key], true);
        }, this);
    }
};

})();


/*
---

script: More.js

name: More

description: MooTools More

license: MIT-style license

authors:
  - Guillermo Rauch
  - Thomas Aylott
  - Scott Kyle
  - Arian Stolwijk
  - Tim Wienk
  - Christoph Pojer
  - Aaron Newton
  - Jacob Thornton

requires:
  - Core/MooTools

provides: [MooTools.More]

...
*/

MooTools.More = {
    'version': '1.3.2.2dev',
    'build': '%build%'
};


/*
---

name: Class.Extras

description: Contains Utility Classes that can be implemented into your own Classes to ease the execution of many common tasks.

license: MIT-style license.

requires: Class

provides: [Class.Extras, Chain, Events, Options]

...
*/

(function(){

this.Chain = new Class({

    $chain: [],

    chain: function(){
        this.$chain.append(Array.flatten(arguments));
        return this;
    },

    callChain: function(){
        return (this.$chain.length) ? this.$chain.shift().apply(this, arguments) : false;
    },

    clearChain: function(){
        this.$chain.empty();
        return this;
    }

});

var removeOn = function(string){
    return string.replace(/^on([A-Z])/, function(full, first){
        return first.toLowerCase();
    });
};

this.Events = new Class({

    $events: {},

    addEvent: function(type, fn, internal){
        type = removeOn(type);

        /*<1.2compat>*/
        if (fn == $empty) return this;
        /*</1.2compat>*/

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


/*
---

name: Object

description: Object generic methods

license: MIT-style license.

requires: Type

provides: [Object, Hash]

...
*/

(function(){

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

    subset: function(object, keys){
        var results = {};
        for (var i = 0, l = keys.length; i < l; i++){
            var k = keys[i];
            if (k in object) results[k] = object[k];
        }
        return results;
    },

    map: function(object, fn, bind){
        var results = {};
        for (var key in object){
            if (hasOwnProperty.call(object, key)) results[key] = fn.call(bind, object[key], key, object);
        }
        return results;
    },

    filter: function(object, fn, bind){
        var results = {};
        for (var key in object){
            var value = object[key];
            if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) results[key] = value;
        }
        return results;
    },

    every: function(object, fn, bind){
        for (var key in object){
            if (hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key)) return false;
        }
        return true;
    },

    some: function(object, fn, bind){
        for (var key in object){
            if (hasOwnProperty.call(object, key) && fn.call(bind, object[key], key)) return true;
        }
        return false;
    },

    keys: function(object){
        var keys = [];
        for (var key in object){
            if (hasOwnProperty.call(object, key)) keys.push(key);
        }
        return keys;
    },

    values: function(object){
        var values = [];
        for (var key in object){
            if (hasOwnProperty.call(object, key)) values.push(object[key]);
        }
        return values;
    },

    getLength: function(object){
        return Object.keys(object).length;
    },

    keyOf: function(object, value){
        for (var key in object){
            if (hasOwnProperty.call(object, key) && object[key] === value) return key;
        }
        return null;
    },

    contains: function(object, value){
        return Object.keyOf(object, value) != null;
    },

    toQueryString: function(object, base){
        var queryString = [];

        Object.each(object, function(value, key){
            if (base) key = base + '[' + key + ']';
            var result;
            switch (typeOf(value)){
                case 'object': result = Object.toQueryString(value, key); break;
                case 'array':
                    var qs = {};
                    value.each(function(val, i){
                        qs[i] = val;
                    });
                    result = Object.toQueryString(qs, key);
                break;
                default: result = key + '=' + encodeURIComponent(value);
            }
            if (value != null) queryString.push(result);
        });

        return queryString.join('&');
    }

});

})();

//<1.2compat>

Hash.implement({

    has: Object.prototype.hasOwnProperty,

    keyOf: function(value){
        return Object.keyOf(this, value);
    },

    hasValue: function(value){
        return Object.contains(this, value);
    },

    extend: function(properties){
        Hash.each(properties || {}, function(value, key){
            Hash.set(this, key, value);
        }, this);
        return this;
    },

    combine: function(properties){
        Hash.each(properties || {}, function(value, key){
            Hash.include(this, key, value);
        }, this);
        return this;
    },

    erase: function(key){
        if (this.hasOwnProperty(key)) delete this[key];
        return this;
    },

    get: function(key){
        return (this.hasOwnProperty(key)) ? this[key] : null;
    },

    set: function(key, value){
        if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
        return this;
    },

    empty: function(){
        Hash.each(this, function(value, key){
            delete this[key];
        }, this);
        return this;
    },

    include: function(key, value){
        if (this[key] == null) this[key] = value;
        return this;
    },

    map: function(fn, bind){
        return new Hash(Object.map(this, fn, bind));
    },

    filter: function(fn, bind){
        return new Hash(Object.filter(this, fn, bind));
    },

    every: function(fn, bind){
        return Object.every(this, fn, bind);
    },

    some: function(fn, bind){
        return Object.some(this, fn, bind);
    },

    getKeys: function(){
        return Object.keys(this);
    },

    getValues: function(){
        return Object.values(this);
    },

    toQueryString: function(base){
        return Object.toQueryString(this, base);
    }

});

Hash.extend = Object.append;

Hash.alias({indexOf: 'keyOf', contains: 'hasValue'});

//</1.2compat>


/*
---

script: Object.Extras.js

name: Object.Extras

description: Extra Object generics, like getFromPath which allows a path notation to child elements.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - Core/Object
  - /MooTools.More

provides: [Object.Extras]

...
*/

(function(){

var defined = function(value){
    return value != null;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

Object.extend({

    getFromPath: function(source, parts){
        if (typeof parts == 'string') parts = parts.split('.');
        for (var i = 0, l = parts.length; i < l; i++){
            if (hasOwnProperty.call(source, parts[i])) source = source[parts[i]];
            else return null;
        }
        return source;
    },

    cleanValues: function(object, method){
        method = method || defined;
        for (var key in object) if (!method(object[key])){
            delete object[key];
        }
        return object;
    },

    erase: function(object, key){
        if (hasOwnProperty.call(object, key)) delete object[key];
        return object;
    },

    run: function(object){
        var args = Array.slice(arguments, 1);
        for (var key in object) if (object[key].apply){
            object[key].apply(object, args);
        }
        return object;
    }

});

})();


/*
---

script: Locale.js

name: Locale

description: Provides methods for localization.

license: MIT-style license

authors:
  - Aaron Newton
  - Arian Stolwijk

requires:
  - Core/Events
  - /Object.Extras
  - /MooTools.More

provides: [Locale, Lang]

...
*/

(function(){

var current = null,
    locales = {},
    inherits = {};

var getSet = function(set){
    if (instanceOf(set, Locale.Set)) return set;
    else return locales[set];
};

var Locale = this.Locale = {

    define: function(locale, set, key, value){
        var name;
        if (instanceOf(locale, Locale.Set)){
            name = locale.name;
            if (name) locales[name] = locale;
        } else {
            name = locale;
            if (!locales[name]) locales[name] = new Locale.Set(name);
            locale = locales[name];
        }

        if (set) locale.define(set, key, value);

        /*<1.2compat>*/
        if (set == 'cascade') return Locale.inherit(name, key);
        /*</1.2compat>*/

        if (!current) current = locale;

        return locale;
    },

    use: function(locale){
        locale = getSet(locale);

        if (locale){
            current = locale;

            this.fireEvent('change', locale);

            /*<1.2compat>*/
            this.fireEvent('langChange', locale.name);
            /*</1.2compat>*/
        }

        return this;
    },

    getCurrent: function(){
        return current;
    },

    get: function(key, args){
        return (current) ? current.get(key, args) : '';
    },

    inherit: function(locale, inherits, set){
        locale = getSet(locale);

        if (locale) locale.inherit(inherits, set);
        return this;
    },

    list: function(){
        return Object.keys(locales);
    }

};

Object.append(Locale, new Events);

Locale.Set = new Class({

    sets: {},

    inherits: {
        locales: [],
        sets: {}
    },

    initialize: function(name){
        this.name = name || '';
    },

    define: function(set, key, value){
        var defineData = this.sets[set];
        if (!defineData) defineData = {};

        if (key){
            if (typeOf(key) == 'object') defineData = Object.merge(defineData, key);
            else defineData[key] = value;
        }
        this.sets[set] = defineData;

        return this;
    },

    get: function(key, args, _base){
        var value = Object.getFromPath(this.sets, key);
        if (value != null){
            var type = typeOf(value);
            if (type == 'function') value = value.apply(null, Array.from(args));
            else if (type == 'object') value = Object.clone(value);
            return value;
        }

        // get value of inherited locales
        var index = key.indexOf('.'),
            set = index < 0 ? key : key.substr(0, index),
            names = (this.inherits.sets[set] || []).combine(this.inherits.locales).include('en-US');
        if (!_base) _base = [];

        for (var i = 0, l = names.length; i < l; i++){
            if (_base.contains(names[i])) continue;
            _base.include(names[i]);

            var locale = locales[names[i]];
            if (!locale) continue;

            value = locale.get(key, args, _base);
            if (value != null) return value;
        }

        return '';
    },

    inherit: function(names, set){
        names = Array.from(names);

        if (set && !this.inherits.sets[set]) this.inherits.sets[set] = [];

        var l = names.length;
        while (l--) (set ? this.inherits.sets[set] : this.inherits.locales).unshift(names[l]);

        return this;
    }

});

/*<1.2compat>*/
var lang = MooTools.lang = {};

Object.append(lang, Locale, {
    setLanguage: Locale.use,
    getCurrentLanguage: function(){
        var current = Locale.getCurrent();
        return (current) ? current.name : null;
    },
    set: function(){
        Locale.define.apply(this, arguments);
        return this;
    },
    get: function(set, key, args){
        if (key) set += '.' + key;
        return Locale.get(set, args);
    }
});
/*</1.2compat>*/

})();


/*
---

name: Locale.en-US.Date

description: Date messages for US English.

license: MIT-style license

authors:
  - Aaron Newton

requires:
  - /Locale

provides: [Locale.en-US.Date]

...
*/

Locale.define('en-US', 'Date', {

    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    months_abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    days_abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    // Culture's date order: MM/DD/YYYY
    dateOrder: ['month', 'date', 'year'],
    shortDate: '%m/%d/%Y',
    shortTime: '%I:%M%p',
    AM: 'AM',
    PM: 'PM',
    firstDayOfWeek: 0,

    // Date.Extras
    ordinal: function(dayOfMonth){
        // 1st, 2nd, 3rd, etc.
        return (dayOfMonth > 3 && dayOfMonth < 21) ? 'th' : ['th', 'st', 'nd', 'rd', 'th'][Math.min(dayOfMonth % 10, 4)];
    },

    lessThanMinuteAgo: 'less than a minute ago',
    minuteAgo: 'about a minute ago',
    minutesAgo: '{delta} minutes ago',
    hourAgo: 'about an hour ago',
    hoursAgo: 'about {delta} hours ago',
    dayAgo: '1 day ago',
    daysAgo: '{delta} days ago',
    weekAgo: '1 week ago',
    weeksAgo: '{delta} weeks ago',
    monthAgo: '1 month ago',
    monthsAgo: '{delta} months ago',
    yearAgo: '1 year ago',
    yearsAgo: '{delta} years ago',

    lessThanMinuteUntil: 'less than a minute from now',
    minuteUntil: 'about a minute from now',
    minutesUntil: '{delta} minutes from now',
    hourUntil: 'about an hour from now',
    hoursUntil: 'about {delta} hours from now',
    dayUntil: '1 day from now',
    daysUntil: '{delta} days from now',
    weekUntil: '1 week from now',
    weeksUntil: '{delta} weeks from now',
    monthUntil: '1 month from now',
    monthsUntil: '{delta} months from now',
    yearUntil: '1 year from now',
    yearsUntil: '{delta} years from now'

});


/*
---

script: Date.js

name: Date

description: Extends the Date native object to include methods useful in managing dates.

license: MIT-style license

authors:
  - Aaron Newton
  - Nicholas Barthelemy - https://svn.nbarthelemy.com/date-js/
  - Harald Kirshner - mail [at] digitarald.de; http://digitarald.de
  - Scott Kyle - scott [at] appden.com; http://appden.com

requires:
  - Core/Array
  - Core/String
  - Core/Number
  - MooTools.More
  - Locale
  - Locale.en-US.Date

provides: [Date]

...
*/

(function(){

var Date = this.Date;

var DateMethods = Date.Methods = {
    ms: 'Milliseconds',
    year: 'FullYear',
    min: 'Minutes',
    mo: 'Month',
    sec: 'Seconds',
    hr: 'Hours'
};

['Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month', 'Seconds', 'Time', 'TimezoneOffset',
    'Week', 'Timezone', 'GMTOffset', 'DayOfYear', 'LastMonth', 'LastDayOfMonth', 'UTCDate', 'UTCDay', 'UTCFullYear',
    'AMPM', 'Ordinal', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes', 'UTCMonth', 'UTCSeconds', 'UTCMilliseconds'].each(function(method){
    Date.Methods[method.toLowerCase()] = method;
});

var pad = function(n, digits, string){
    if (digits == 1) return n;
    return n < Math.pow(10, digits - 1) ? (string || '0') + pad(n, digits - 1, string) : n;
};

Date.implement({

    set: function(prop, value){
        prop = prop.toLowerCase();
        var method = DateMethods[prop] && 'set' + DateMethods[prop];
        if (method && this[method]) this[method](value);
        return this;
    }.overloadSetter(),

    get: function(prop){
        prop = prop.toLowerCase();
        var method = DateMethods[prop] && 'get' + DateMethods[prop];
        if (method && this[method]) return this[method]();
        return null;
    }.overloadGetter(),

    clone: function(){
        return new Date(this.get('time'));
    },

    increment: function(interval, times){
        interval = interval || 'day';
        times = times != null ? times : 1;

        switch (interval){
            case 'year':
                return this.increment('month', times * 12);
            case 'month':
                var d = this.get('date');
                this.set('date', 1).set('mo', this.get('mo') + times);
                return this.set('date', d.min(this.get('lastdayofmonth')));
            case 'week':
                return this.increment('day', times * 7);
            case 'day':
                return this.set('date', this.get('date') + times);
        }

        if (!Date.units[interval]) throw new Error(interval + ' is not a supported interval');

        return this.set('time', this.get('time') + times * Date.units[interval]());
    },

    decrement: function(interval, times){
        return this.increment(interval, -1 * (times != null ? times : 1));
    },

    isLeapYear: function(){
        return Date.isLeapYear(this.get('year'));
    },

    clearTime: function(){
        return this.set({hr: 0, min: 0, sec: 0, ms: 0});
    },

    diff: function(date, resolution){
        if (typeOf(date) == 'string') date = Date.parse(date);

        return ((date - this) / Date.units[resolution || 'day'](3, 3)).round(); // non-leap year, 30-day month
    },

    getLastDayOfMonth: function(){
        return Date.daysInMonth(this.get('mo'), this.get('year'));
    },

    getDayOfYear: function(){
        return (Date.UTC(this.get('year'), this.get('mo'), this.get('date') + 1)
            - Date.UTC(this.get('year'), 0, 1)) / Date.units.day();
    },

    setDay: function(day, firstDayOfWeek){
        if (firstDayOfWeek == null){
            firstDayOfWeek = Date.getMsg('firstDayOfWeek');
            if (firstDayOfWeek === '') firstDayOfWeek = 1;
        }

        day = (7 + Date.parseDay(day, true) - firstDayOfWeek) % 7;
        var currentDay = (7 + this.get('day') - firstDayOfWeek) % 7;

        return this.increment('day', day - currentDay);
    },

    getWeek: function(firstDayOfWeek){
        if (firstDayOfWeek == null){
            firstDayOfWeek = Date.getMsg('firstDayOfWeek');
            if (firstDayOfWeek === '') firstDayOfWeek = 1;
        }

        var date = this,
            dayOfWeek = (7 + date.get('day') - firstDayOfWeek) % 7,
            dividend = 0,
            firstDayOfYear;

        if (firstDayOfWeek == 1){
            // ISO-8601, week belongs to year that has the most days of the week (i.e. has the thursday of the week)
            var month = date.get('month'),
                startOfWeek = date.get('date') - dayOfWeek;

            if (month == 11 && startOfWeek > 28) return 1; // Week 1 of next year

            if (month == 0 && startOfWeek < -2){
                // Use a date from last year to determine the week
                date = new Date(date).decrement('day', dayOfWeek);
                dayOfWeek = 0;
            }

            firstDayOfYear = new Date(date.get('year'), 0, 1).get('day') || 7;
            if (firstDayOfYear > 4) dividend = -7; // First week of the year is not week 1
        } else {
            // In other cultures the first week of the year is always week 1 and the last week always 53 or 54.
            // Days in the same week can have a different weeknumber if the week spreads across two years.
            firstDayOfYear = new Date(date.get('year'), 0, 1).get('day');
        }

        dividend += date.get('dayofyear');
        dividend += 6 - dayOfWeek; // Add days so we calculate the current date's week as a full week
        dividend += (7 + firstDayOfYear - firstDayOfWeek) % 7; // Make up for first week of the year not being a full week

        return (dividend / 7);
    },

    getOrdinal: function(day){
        return Date.getMsg('ordinal', day || this.get('date'));
    },

    getTimezone: function(){
        return this.toString()
            .replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, '$1')
            .replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, '$1$2$3');
    },

    getGMTOffset: function(){
        var off = this.get('timezoneOffset');
        return ((off > 0) ? '-' : '+') + pad((off.abs() / 60).floor(), 2) + pad(off % 60, 2);
    },

    setAMPM: function(ampm){
        ampm = ampm.toUpperCase();
        var hr = this.get('hr');
        if (hr > 11 && ampm == 'AM') return this.decrement('hour', 12);
        else if (hr < 12 && ampm == 'PM') return this.increment('hour', 12);
        return this;
    },

    getAMPM: function(){
        return (this.get('hr') < 12) ? 'AM' : 'PM';
    },

    parse: function(str){
        this.set('time', Date.parse(str));
        return this;
    },

    isValid: function(date){
        return !isNaN((date || this).valueOf());
    },

    format: function(f){
        if (!this.isValid()) return 'invalid date';
        if (!f) f = '%x %X';

        var formatLower = f.toLowerCase();
        if (formatters[formatLower]) return formatters[formatLower](this); // it's a formatter!
        f = formats[formatLower] || f; // replace short-hand with actual format

        var d = this;
        return f.replace(/%([a-z%])/gi,
            function($0, $1){
                switch ($1){
                    case 'a': return Date.getMsg('days_abbr')[d.get('day')];
                    case 'A': return Date.getMsg('days')[d.get('day')];
                    case 'b': return Date.getMsg('months_abbr')[d.get('month')];
                    case 'B': return Date.getMsg('months')[d.get('month')];
                    case 'c': return d.format('%a %b %d %H:%M:%S %Y');
                    case 'd': return pad(d.get('date'), 2);
                    case 'e': return pad(d.get('date'), 2, ' ');
                    case 'H': return pad(d.get('hr'), 2);
                    case 'I': return pad((d.get('hr') % 12) || 12, 2);
                    case 'j': return pad(d.get('dayofyear'), 3);
                    case 'k': return pad(d.get('hr'), 2, ' ');
                    case 'l': return pad((d.get('hr') % 12) || 12, 2, ' ');
                    case 'L': return pad(d.get('ms'), 3);
                    case 'm': return pad((d.get('mo') + 1), 2);
                    case 'M': return pad(d.get('min'), 2);
                    case 'o': return d.get('ordinal');
                    case 'p': return Date.getMsg(d.get('ampm'));
                    case 's': return Math.round(d / 1000);
                    case 'S': return pad(d.get('seconds'), 2);
                    case 'T': return d.format('%H:%M:%S');
                    case 'U': return pad(d.get('week'), 2);
                    case 'w': return d.get('day');
                    case 'x': return d.format(Date.getMsg('shortDate'));
                    case 'X': return d.format(Date.getMsg('shortTime'));
                    case 'y': return d.get('year').toString().substr(2);
                    case 'Y': return d.get('year');
                    case 'z': return d.get('GMTOffset');
                    case 'Z': return d.get('Timezone');
                }
                return $1;
            }
        );
    },

    toISOString: function(){
        return this.format('iso8601');
    }

}).alias({
    toJSON: 'toISOString',
    compare: 'diff',
    strftime: 'format'
});

var formats = {
    db: '%Y-%m-%d %H:%M:%S',
    compact: '%Y%m%dT%H%M%S',
    'short': '%d %b %H:%M',
    'long': '%B %d, %Y %H:%M'
};

// The day and month abbreviations are standardized, so we cannot use simply %a and %b because they will get localized
var rfcDayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    rfcMonthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var formatters = {
    rfc822: function(date){
        return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %Z');
    },
    rfc2822: function(date){
        return rfcDayAbbr[date.get('day')] + date.format(', %d ') + rfcMonthAbbr[date.get('month')] + date.format(' %Y %H:%M:%S %z');
    },
    iso8601: function(date){
        return (
            date.getUTCFullYear() + '-' +
            pad(date.getUTCMonth() + 1, 2) + '-' +
            pad(date.getUTCDate(), 2) + 'T' +
            pad(date.getUTCHours(), 2) + ':' +
            pad(date.getUTCMinutes(), 2) + ':' +
            pad(date.getUTCSeconds(), 2) + '.' +
            pad(date.getUTCMilliseconds(), 3) + 'Z'
        );
    }
};


var parsePatterns = [],
    nativeParse = Date.parse;

var parseWord = function(type, word, num){
    var ret = -1,
        translated = Date.getMsg(type + 's');
    switch (typeOf(word)){
        case 'object':
            ret = translated[word.get(type)];
            break;
        case 'number':
            ret = translated[word];
            if (!ret) throw new Error('Invalid ' + type + ' index: ' + word);
            break;
        case 'string':
            var match = translated.filter(function(name){
                return this.test(name);
            }, new RegExp('^' + word, 'i'));
            if (!match.length) throw new Error('Invalid ' + type + ' string');
            if (match.length > 1) throw new Error('Ambiguous ' + type);
            ret = match[0];
    }

    return (num) ? translated.indexOf(ret) : ret;
};

var startCentury = 1900,
    startYear = 70;

Date.extend({

    getMsg: function(key, args){
        return Locale.get('Date.' + key, args);
    },

    units: {
        ms: Function.from(1),
        second: Function.from(1000),
        minute: Function.from(60000),
        hour: Function.from(3600000),
        day: Function.from(86400000),
        week: Function.from(608400000),
        month: function(month, year){
            var d = new Date;
            return Date.daysInMonth(month != null ? month : d.get('mo'), year != null ? year : d.get('year')) * 86400000;
        },
        year: function(year){
            year = year || new Date().get('year');
            return Date.isLeapYear(year) ? 31622400000 : 31536000000;
        }
    },

    daysInMonth: function(month, year){
        return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    isLeapYear: function(year){
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    },

    parse: function(from){
        var t = typeOf(from);
        if (t == 'number') return new Date(from);
        if (t != 'string') return from;
        from = from.clean();
        if (!from.length) return null;

        var parsed;
        parsePatterns.some(function(pattern){
            var bits = pattern.re.exec(from);
            return (bits) ? (parsed = pattern.handler(bits)) : false;
        });

        if (!(parsed && parsed.isValid())){
            parsed = new Date(nativeParse(from));
            if (!(parsed && parsed.isValid())) parsed = new Date(from.toInt());
        }
        return parsed;
    },

    parseDay: function(day, num){
        return parseWord('day', day, num);
    },

    parseMonth: function(month, num){
        return parseWord('month', month, num);
    },

    parseUTC: function(value){
        var localDate = new Date(value);
        var utcSeconds = Date.UTC(
            localDate.get('year'),
            localDate.get('mo'),
            localDate.get('date'),
            localDate.get('hr'),
            localDate.get('min'),
            localDate.get('sec'),
            localDate.get('ms')
        );
        return new Date(utcSeconds);
    },

    orderIndex: function(unit){
        return Date.getMsg('dateOrder').indexOf(unit) + 1;
    },

    defineFormat: function(name, format){
        formats[name] = format;
        return this;
    },

    defineFormats: function(formats){
        for (var name in formats) Date.defineFormat(name, formats[name]);
        return this;
    },

    //<1.2compat>
    parsePatterns: parsePatterns,
    //</1.2compat>

    defineParser: function(pattern){
        parsePatterns.push((pattern.re && pattern.handler) ? pattern : build(pattern));
        return this;
    },

    defineParsers: function(){
        Array.flatten(arguments).each(Date.defineParser);
        return this;
    },

    define2DigitYearStart: function(year){
        startYear = year % 100;
        startCentury = year - startYear;
        return this;
    }

});

var regexOf = function(type){
    return new RegExp('(?:' + Date.getMsg(type).map(function(name){
        return name.substr(0, 3);
    }).join('|') + ')[a-z]*');
};

var replacers = function(key){
    switch (key){
        case 'T':
            return '%H:%M:%S';
        case 'x': // iso8601 covers yyyy-mm-dd, so just check if month is first
            return ((Date.orderIndex('month') == 1) ? '%m[-./]%d' : '%d[-./]%m') + '([-./]%y)?';
        case 'X':
            return '%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?';
    }
    return null;
};

var keys = {
    d: /[0-2]?[0-9]|3[01]/,
    H: /[01]?[0-9]|2[0-3]/,
    I: /0?[1-9]|1[0-2]/,
    M: /[0-5]?\d/,
    s: /\d+/,
    o: /[a-z]*/,
    p: /[ap]\.?m\.?/,
    y: /\d{2}|\d{4}/,
    Y: /\d{4}/,
    z: /Z|[+-]\d{2}(?::?\d{2})?/
};

keys.m = keys.I;
keys.S = keys.M;

var currentLanguage;

var recompile = function(language){
    currentLanguage = language;

    keys.a = keys.A = regexOf('days');
    keys.b = keys.B = regexOf('months');

    parsePatterns.each(function(pattern, i){
        if (pattern.format) parsePatterns[i] = build(pattern.format);
    });
};

var build = function(format){
    if (!currentLanguage) return {format: format};

    var parsed = [];
    var re = (format.source || format) // allow format to be regex
    .replace(/%([a-z])/gi,
        function($0, $1){
            return replacers($1) || $0;
        }
    ).replace(/\((?!\?)/g, '(?:') // make all groups non-capturing
    .replace(/ (?!\?|\*)/g, ',? ') // be forgiving with spaces and commas
    .replace(/%([a-z%])/gi,
        function($0, $1){
            var p = keys[$1];
            if (!p) return $1;
            parsed.push($1);
            return '(' + p.source + ')';
        }
    ).replace(/\[a-z\]/gi, '[a-z\\u00c0-\\uffff;\&]'); // handle unicode words

    return {
        format: format,
        re: new RegExp('^' + re + '$', 'i'),
        handler: function(bits){
            bits = bits.slice(1).associate(parsed);
            var date = new Date().clearTime(),
                year = bits.y || bits.Y;

            if (year != null) handle.call(date, 'y', year); // need to start in the right year
            if ('d' in bits) handle.call(date, 'd', 1);
            if ('m' in bits || bits.b || bits.B) handle.call(date, 'm', 1);

            for (var key in bits) handle.call(date, key, bits[key]);
            return date;
        }
    };
};

var handle = function(key, value){
    if (!value) return this;

    switch (key){
        case 'a': case 'A': return this.set('day', Date.parseDay(value, true));
        case 'b': case 'B': return this.set('mo', Date.parseMonth(value, true));
        case 'd': return this.set('date', value);
        case 'H': case 'I': return this.set('hr', value);
        case 'm': return this.set('mo', value - 1);
        case 'M': return this.set('min', value);
        case 'p': return this.set('ampm', value.replace(/\./g, ''));
        case 'S': return this.set('sec', value);
        case 's': return this.set('ms', ('0.' + value) * 1000);
        case 'w': return this.set('day', value);
        case 'Y': return this.set('year', value);
        case 'y':
            value = +value;
            if (value < 100) value += startCentury + (value < startYear ? 100 : 0);
            return this.set('year', value);
        case 'z':
            if (value == 'Z') value = '+00';
            var offset = value.match(/([+-])(\d{2}):?(\d{2})?/);
            offset = (offset[1] + '1') * (offset[2] * 60 + (+offset[3] || 0)) + this.getTimezoneOffset();
            return this.set('time', this - offset * 60000);
    }

    return this;
};

Date.defineParsers(
    '%Y([-./]%m([-./]%d((T| )%X)?)?)?', // "1999-12-31", "1999-12-31 11:59pm", "1999-12-31 23:59:59", ISO8601
    '%Y%m%d(T%H(%M%S?)?)?', // "19991231", "19991231T1159", compact
    '%x( %X)?', // "12/31", "12.31.99", "12-31-1999", "12/31/2008 11:59 PM"
    '%d%o( %b( %Y)?)?( %X)?', // "31st", "31st December", "31 Dec 1999", "31 Dec 1999 11:59pm"
    '%b( %d%o)?( %Y)?( %X)?', // Same as above with month and day switched
    '%Y %b( %d%o( %X)?)?', // Same as above with year coming first
    '%o %b %d %X %z %Y', // "Thu Oct 22 08:11:23 +0000 2009"
    '%T', // %H:%M:%S
    '%H:%M( ?%p)?' // "11:05pm", "11:05 am" and "11:05"
);

Locale.addEvent('change', function(language){
    if (Locale.get('Date')) recompile(language);
}).fireEvent('change', Locale.getCurrent());

})();


/*
---

script: Date.Extras.js

name: Date.Extras

description: Extends the Date native object to include extra methods (on top of those in Date.js).

license: MIT-style license

authors:
  - Aaron Newton
  - Scott Kyle

requires:
  - /Date

provides: [Date.Extras]

...
*/

Date.implement({

    timeDiffInWords: function(to){
        return Date.distanceOfTimeInWords(this, to || new Date);
    },

    timeDiff: function(to, separator){
        if (to == null) to = new Date;
        var delta = ((to - this) / 1000).floor().abs();

        var vals = [],
            durations = [60, 60, 24, 365, 0],
            names = ['s', 'm', 'h', 'd', 'y'],
            value, duration;

        for (var item = 0; item < durations.length; item++){
            if (item && !delta) break;
            value = delta;
            if ((duration = durations[item])){
                value = (delta % duration);
                delta = (delta / duration).floor();
            }
            vals.unshift(value + (names[item] || ''));
        }

        return vals.join(separator || ':');
    }

}).extend({

    distanceOfTimeInWords: function(from, to){
        return Date.getTimePhrase(((to - from) / 1000).toInt());
    },

    getTimePhrase: function(delta){
        var suffix = (delta < 0) ? 'Until' : 'Ago';
        if (delta < 0) delta *= -1;

        var units = {
            minute: 60,
            hour: 60,
            day: 24,
            week: 7,
            month: 52 / 12,
            year: 12,
            eon: Infinity
        };

        var msg = 'lessThanMinute';

        for (var unit in units){
            var interval = units[unit];
            if (delta < 1.5 * interval){
                if (delta > 0.75 * interval) msg = unit;
                break;
            }
            delta /= interval;
            msg = unit + 's';
        }

        delta = delta.round();
        return Date.getMsg(msg + suffix, delta).substitute({delta: delta});
    }

}).defineParsers(

    {
        // "today", "tomorrow", "yesterday"
        re: /^(?:tod|tom|yes)/i,
        handler: function(bits){
            var d = new Date().clearTime();
            switch (bits[0]){
                case 'tom': return d.increment();
                case 'yes': return d.decrement();
                default: return d;
            }
        }
    },

    {
        // "next Wednesday", "last Thursday"
        re: /^(next|last) ([a-z]+)$/i,
        handler: function(bits){
            var d = new Date().clearTime();
            var day = d.getDay();
            var newDay = Date.parseDay(bits[2], true);
            var addDays = newDay - day;
            if (newDay <= day) addDays += 7;
            if (bits[1] == 'last') addDays -= 7;
            return d.set('date', d.getDate() + addDays);
        }
    }

).alias('timeAgoInWords', 'timeDiffInWords');

/*
---

script: Keyboard.js

name: Keyboard

description: KeyboardEvents used to intercept events on a class for keyboard and format modifiers in a specific order so as to make alt+shift+c the same as shift+alt+c.

license: MIT-style license

authors:
  - Perrin Westrich
  - Aaron Newton
  - Scott Kyle

requires:
  - Core/Events
  - Core/Options
  - Core/Element.Event
  - Element.Event.Pseudos.Keys

provides: [Keyboard]

...
*/

(function(){

    var Keyboard = this.Keyboard = new Class({

        Extends: Events,

        Implements: [Options],

        options: {/*
            onActivate: function(){},
            onDeactivate: function(){},*/
            defaultEventType: 'keydown',
            active: false,
            manager: null,
            events: {},
            nonParsedEvents: ['activate', 'deactivate', 'onactivate', 'ondeactivate', 'changed', 'onchanged']
        },

        initialize: function(options){
            if (options && options.manager){
                this._manager = options.manager;
                delete options.manager;
            }
            this.setOptions(options);
            this._setup();
        },

        addEvent: function(type, fn, internal){
            return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn, internal);
        },

        removeEvent: function(type, fn){
            return this.parent(Keyboard.parse(type, this.options.defaultEventType, this.options.nonParsedEvents), fn);
        },

        toggleActive: function(){
            return this[this.isActive() ? 'deactivate' : 'activate']();
        },

        activate: function(instance){
            if (instance){
                if (instance.isActive()) return this;
                //if we're stealing focus, store the last keyboard to have it so the relinquish command works
                if (this._activeKB && instance != this._activeKB){
                    this.previous = this._activeKB;
                    this.previous.fireEvent('deactivate');
                }
                //if we're enabling a child, assign it so that events are now passed to it
                this._activeKB = instance.fireEvent('activate');
                Keyboard.manager.fireEvent('changed');
            } else if (this._manager){
                //else we're enabling ourselves, we must ask our parent to do it for us
                this._manager.activate(this);
            }
            return this;
        },

        isActive: function(){
            return this._manager ? (this._manager._activeKB == this) : (Keyboard.manager == this);
        },

        deactivate: function(instance){
            if (instance){
                if (instance === this._activeKB){
                    this._activeKB = null;
                    instance.fireEvent('deactivate');
                    Keyboard.manager.fireEvent('changed');
                }
            } else if (this._manager){
                this._manager.deactivate(this);
            }
            return this;
        },

        relinquish: function(){
            if (this.isActive() && this._manager && this._manager.previous) this._manager.activate(this._manager.previous);
            else this.deactivate();
            return this;
        },

        //management logic
        manage: function(instance){
            if (instance._manager) instance._manager.drop(instance);
            this._instances.push(instance);
            instance._manager = this;
            if (!this._activeKB) this.activate(instance);
            return this;
        },

        drop: function(instance){
            instance.relinquish();
            this._instances.erase(instance);
            if (this._activeKB == instance){
                if (this.previous && this._instances.contains(this.previous)) this.activate(this.previous);
                else this._activeKB = this._instances[0];
            }
            return this;
        },

        trace: function(){
            Keyboard.trace(this);
        },

        each: function(fn){
            Keyboard.each(this, fn);
        },

        /*
            PRIVATE METHODS
        */

        _instances: [],

        _disable: function(instance){
            if (this._activeKB == instance) this._activeKB = null;
        },

        _setup: function(){
            this.addEvents(this.options.events);
            //if this is the root manager, nothing manages it
            if (Keyboard.manager && !this._manager) Keyboard.manager.manage(this);
            if (this.options.active) this.activate();
            else this.relinquish();
        },

        _handle: function(event, type){
            //Keyboard.stop(event) prevents key propagation
            if (event.preventKeyboardPropagation) return;

            var bubbles = !!this._manager;
            if (bubbles && this._activeKB){
                this._activeKB._handle(event, type);
                if (event.preventKeyboardPropagation) return;
            }
            this.fireEvent(type, event);

            if (!bubbles && this._activeKB) this._activeKB._handle(event, type);
        }

    });

    var parsed = {};
    var modifiers = ['shift', 'control', 'alt', 'meta'];
    var regex = /^(?:shift|control|ctrl|alt|meta)$/;

    Keyboard.parse = function(type, eventType, ignore){
        if (ignore && ignore.contains(type.toLowerCase())) return type;

        type = type.toLowerCase().replace(/^(keyup|keydown):/, function($0, $1){
            eventType = $1;
            return '';
        });

        if (!parsed[type]){
            var key, mods = {};
            type.split('+').each(function(part){
                if (regex.test(part)) mods[part] = true;
                else key = part;
            });

            mods.control = mods.control || mods.ctrl; // allow both control and ctrl

            var keys = [];
            modifiers.each(function(mod){
                if (mods[mod]) keys.push(mod);
            });

            if (key) keys.push(key);
            parsed[type] = keys.join('+');
        }

        return eventType + ':keys(' + parsed[type] + ')';
    };

    Keyboard.each = function(keyboard, fn){
        var current = keyboard || Keyboard.manager;
        while (current){
            fn.run(current);
            current = current._activeKB;
        }
    };

    Keyboard.stop = function(event){
        event.preventKeyboardPropagation = true;
    };

    Keyboard.manager = new Keyboard({
        active: true
    });

    Keyboard.trace = function(keyboard){
        keyboard = keyboard || Keyboard.manager;
        var hasConsole = window.console && console.log;
        if (hasConsole) console.log('the following items have focus: ');
        Keyboard.each(keyboard, function(current){
            if (hasConsole) console.log(document.id(current.widget) || current.wiget || current);
        });
    };

    var handler = function(event){
        var keys = [];
        modifiers.each(function(mod){
            if (event[mod]) keys.push(mod);
        });

        if (!regex.test(event.key)) keys.push(event.key);
        Keyboard.manager._handle(event, event.type + ':keys(' + keys.join('+') + ')');
    };

    document.addEvents({
        'keyup': handler,
        'keydown': handler
    });

})();


/*
---

script: Keyboard.Extras.js

name: Keyboard.Extras

description: Enhances Keyboard by adding the ability to name and describe keyboard shortcuts, and the ability to grab shortcuts by name and bind the shortcut to different keys.

license: MIT-style license

authors:
  - Perrin Westrich

requires:
  - /Keyboard
  - /MooTools.More

provides: [Keyboard.Extras]

...
*/
Keyboard.prototype.options.nonParsedEvents.combine(['rebound', 'onrebound']);

Keyboard.implement({

    /*
        shortcut should be in the format of:
        {
            'keys': 'shift+s', // the default to add as an event.
            'description': 'blah blah blah', // a brief description of the functionality.
            'handler': function(){} // the event handler to run when keys are pressed.
        }
    */
    addShortcut: function(name, shortcut){
        this._shortcuts = this._shortcuts || [];
        this._shortcutIndex = this._shortcutIndex || {};

        shortcut.getKeyboard = Function.from(this);
        shortcut.name = name;
        this._shortcutIndex[name] = shortcut;
        this._shortcuts.push(shortcut);
        if (shortcut.keys) this.addEvent(shortcut.keys, shortcut.handler);
        return this;
    },

    addShortcuts: function(obj){
        for (var name in obj) this.addShortcut(name, obj[name]);
        return this;
    },

    removeShortcut: function(name){
        var shortcut = this.getShortcut(name);
        if (shortcut && shortcut.keys){
            this.removeEvent(shortcut.keys, shortcut.handler);
            delete this._shortcutIndex[name];
            this._shortcuts.erase(shortcut);
        }
        return this;
    },

    removeShortcuts: function(names){
        names.each(this.removeShortcut, this);
        return this;
    },

    getShortcuts: function(){
        return this._shortcuts || [];
    },

    getShortcut: function(name){
        return (this._shortcutIndex || {})[name];
    }

});

Keyboard.rebind = function(newKeys, shortcuts){
    Array.from(shortcuts).each(function(shortcut){
        shortcut.getKeyboard().removeEvent(shortcut.keys, shortcut.handler);
        shortcut.getKeyboard().addEvent(newKeys, shortcut.handler);
        shortcut.keys = newKeys;
        shortcut.getKeyboard().fireEvent('rebound');
    });
};


Keyboard.getActiveShortcuts = function(keyboard){
    var activeKBS = [], activeSCS = [];
    Keyboard.each(keyboard, [].push.bind(activeKBS));
    activeKBS.each(function(kb){ activeSCS.extend(kb.getShortcuts()); });
    return activeSCS;
};

Keyboard.getShortcut = function(name, keyboard, opts){
    opts = opts || {};
    var shortcuts = opts.many ? [] : null,
        set = opts.many ? function(kb){
                var shortcut = kb.getShortcut(name);
                if (shortcut) shortcuts.push(shortcut);
            } : function(kb){
                if (!shortcuts) shortcuts = kb.getShortcut(name);
            };
    Keyboard.each(keyboard, set);
    return shortcuts;
};

Keyboard.getShortcuts = function(name, keyboard){
    return Keyboard.getShortcut(name, keyboard, { many: true });
};



var ExtraMojo = require('./mootools-extends');

/*
---

name: Loader

description: Loads MooTools as a CommonJS Module.

license: MIT-style license.

copyright: Copyright (c) 2010 [Christoph Pojer](http://cpojer.net/).

authors: Christoph Pojer

requires: [Core/Core, Core/Object]

provides: [Loader]

...
*/

if (typeof exports != 'undefined') (function(){

for (var key in this) if (!GLOBAL_ITEMS.contains(key)){
    exports[key] = this[key];
}

exports.apply = function(object){
    Object.append(object, exports);
};

})();

