(function (exports, browser) {
    "use strict";

    //well this is unforgettable I know...
    global.window = global;

    var requests = [],
        debug = false,
        last_frame = CRadamn.time();

    global.requestAnimationFrame = function(fn) {
        requests.push(fn);

        return requests.length - 1;
    }

    global.cancelAnimationFrame = function(idx) {
        if(requests.length > idx) {
            requests.splice(idx, 1);
        }
    }

    // vsync is: 1/60 -> 17ms, as allways we need more time resolution!!!
    function step() {
        if(debug) {
            console.log("start frame");
        }

        //this is used to send to requestAnimationFrame callbacks
        var current_frame = CRadamn.time(),
            elapsed = current_frame - last_frame,
            i,
            rr = requests;

        requests = [];
        for(i = 0; i < rr.length; ++i) {
            rr[i](elapsed);
        }

        // this is used for the next frame, because the callback consume quite some time could mess the timers!
        current_frame = CRadamn.time(),
        elapsed = (current_frame - last_frame) % 17;

        if(debug) {
            console.log("endframe");
        }

        // support no window mode
        if(CRadamn) {
            CRadamn.GL.flipBuffers();
        }

        setTimeout(step, 17 - elapsed);
        last_frame = current_frame;
    }

    setTimeout(step, 17);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));