// based on https://github.com/mozilla/pointer.js

(function (exports, browser) {
    "use strict";

    var isScrolling = false,
        timeout = false,
        sDistX = 0,
        sDistY = 0,
        clickable = {},
        id_to_finger = [],
        ramp = 48,
        status = {},
        offset = {x: 0, y: 0};

    // useful for debug purposes
    function emit(obj, events) {
        var i;
        for (i = 0; i < events.length; ++i) {
            //console.log(events[i]);
            obj.emit(events[i].type, events[i]);
        }
    }


    // 'pointerdown' event, triggered by mousedown/touchstart.
    function pointerDown(e) {
        var evt = createEvents('down', e);
        emit(Radamn, evt);
    }

    // 'pointerdown' event, triggered by mouseout/touchleave.
    function pointerLeave(e) {
        var evt = createEvents('leave', e);
        emit(Radamn, evt);
    }

    // 'pointermove' event, triggered by mousemove/touchmove.
    function pointerMove(e) {
        var evt = createEvents('move', e);
        emit(Radamn, evt);
    }

    // 'pointerup' event, triggered by mouseup/touchend.
    function pointerUp(e) {
        //if(e.x !== undefined) {
            var evt = createEvents('up', e);
            emit(Radamn, evt);
        //}
    }

    function createEvents(type, e) {
        var tgt = e.target,
            out = [],
            i,
            touch = e.type.indexOf('touch') === 0,
            finger,
            dx,
            dy,
            swipe,
            id,
            timestamp = +(new Date());;

        //console.log("createEvents" + e.type + "@" + (e.touches ? e.touches.length : 1));

        if (touch) {
            for (i = 0; i < e.changedTouches.length; ++i) {
                //console.log("finger" + i);
                //console.log(e.changedTouches[i]);
                //create an event per finger!
                finger = id_to_finger.indexOf(e.changedTouches[i].identifier);
                if (finger === -1) {
                    finger = id_to_finger.length;
                    id_to_finger.push(e.changedTouches[i].identifier);
                }
                out.push({
                    uid: e.changedTouches[i].identifier,
                    type: "pointer" + type,
                    pointerType: "touch",
                    x: e.changedTouches[i].pageX - offset.x,
                    y: e.changedTouches[i].pageY - offset.y,
                    tiltX: 0,
                    tiltY: 0,
                    finger: finger,
                    force: e.changedTouches[i].force,
                    maskedEvent: e,
                    target: e.target
                });
            }
        } else {
            // explorer change the button number right ?
            out.push({
                uid: e.button,
                type: "pointer" + type,
                pointerType: "mouse",
                x: e.clientX + window.pageXOffset - offset.x,
                y: e.clientY + window.pageYOffset - offset.y,
                tiltX: 0,
                tiltY: 0,
                finger: e.button,
                force: 1,
                maskedEvent: e,
                target: e.target
            });
        }

        //console.log(out[0].pointerType + " @ event count: " + out.length);



        switch (type) {
        case "down":
            id = out[0].pointerType + "-" + out[0].finger;

            clickable[id] = out[0].target;

            status[id] = {
                press: true,
                start: timestamp,
                lastGesture: timestamp,
                target: out[0].target,
                x: out[0].x,
                y: out[0].y,
                gestureX: out[0].x,
                gestureY: out[0].y,
                movement: []
            };

            break;
        case "move":
            // direction, distance, velocity
            for (i = 0; i < out.length; ++i) {
                id = out[i].pointerType + "-" + out[i].finger;

                // only generate pointermove if is presssed ?
                if (status[id] && status[id].press) {
                    //console.log("move - finger" + i);

                    status[id].movement.push({x: out[i].x, y: out[i].y, ts: timestamp});

                    out[i].distX = out[i].x - status[id].x;
                    out[i].distY = out[i].y - status[id].y;

                    out[i].gestureX = out[i].x - status[id].gestureX;
                    out[i].gestureY = out[i].y - status[id].gestureY;


                    // check swipe events
                    dx = Math.abs(out[i].gestureX);
                    dy = Math.abs(out[i].gestureY);
                    swipe = null;
                    if (dx >= ramp && dx * 0.2 > dy) {

                        if (out[i].gestureX > 0) {
                            swipe = "swiperight";
                        } else {
                            swipe = "swipeleft";
                        }

                    } else if (dy >= ramp && dy * 0.2 > dx) {
                        if (out[i].gestureY > 0) {
                            swipe = "swipedown";
                        } else {
                            swipe = "swipeup";
                        }
                    }

                    if (swipe) {
                        status[id].gestureX = out[i].x;
                        status[id].gestureY = out[i].y;
                        status[id].lastGesture = timestamp;
                        status[id].movement = []; // reset movement ?

                        out.push({
                            uid: null,
                            type: swipe,
                            pointerType: "gesture",
                            x: out[i].x,
                            y: out[i].y,
                            tiltX: 0,
                            tiltY: 0,
                            finger: out[i].finger,
                            force: 1,
                            maskedEvent: e,
                            target: e.target
                        });


                    }
                }
            }
            break;
        case "up":
            id = out[0].pointerType + "-" + out[0].finger;

            if (clickable[id] && clickable[id] == e.target) {
                //click!
                out.push({
                    uid: out[0].uid,
                    type: "pointerclick",
                    pointerType: out[0].pointerType,
                    x: out[0].x,
                    y: out[0].y,
                    tiltX: 0,
                    tiltY: 0,
                    finger: out[0].finger,
                    force: 1,
                    maskedEvent: e,
                    target: e.target
                });
            }

            if (touch) {
                id_to_finger.splice(id_to_finger.indexOf(out[0].finger), 1);
            }

            status[id].press = false;
            // process the movement ?

            clickable[id] = null;
            break;
        }

        return out;
    }

    // attach events
    Radamn.on("var:change", function (variable, value) {
        if (variable === "offset") {
            offset = value;
        }
    });

    Radamn.on("ready", function () {
        var listen_to = document,
            w = window;

        w.addEventListener('scroll', function () {
            if (!isScrolling) {
                sDistX = w.pageXOffset;
                sDistY = w.pageYOffset;
            }
            isScrolling = true;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                isScrolling = false;
                sDistX = 0;
                sDistY = 0;
            }, 100);
        });

        listen_to.addEventListener('mousedown', pointerDown);
        listen_to.addEventListener('touchstart', pointerDown);
        listen_to.addEventListener('mouseup', pointerUp);
        listen_to.addEventListener('touchend', pointerUp);
        listen_to.addEventListener('mousemove', pointerMove);
        listen_to.addEventListener('touchmove', pointerMove);
        listen_to.addEventListener('mouseout', pointerLeave);
        listen_to.addEventListener('touchleave', pointerLeave);
    });

}());