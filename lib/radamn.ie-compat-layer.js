// compat layer with internet explorer!
// define all function missing in ie!

if ( !Array.prototype.reduce ) {  
Array.prototype.reduce = function reduce(accumulator){  
    var i, l = this.length, curr;  
      
    if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."  
      throw new TypeError("First argument is not callable");  

    if((l == 0 || l === null) && (arguments.length <= 1))// == on purpose to test 0 and false.  
      throw new TypeError("Array length is 0 and no second argument");  
      
    if(arguments.length <= 1){  
      curr = this[0]; // Increase i to start searching the secondly defined element in the array  
      i = 1; // start accumulating at the second element  
    }  
    else{  
      curr = arguments[1];  
    }  
      
    for(i = i || 0 ; i < l ; ++i){  
      if(i in this)  
        curr = accumulator.call(undefined, curr, this[i], i, this);  
    }  
      
    return curr;  
  };  
}  
      
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";

    if (this == null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}

if(!this.console) {
    this.console = {
        log: function() {},
        debug: function() {},
        warning: function() {},
        error: function() {},
        assert: function() {},
        info: function() {}
    };
}
