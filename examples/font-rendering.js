(function (exports, browser) {
    "use strict";

    if(!browser) {
        require('./../lib/radamn');
    }

    var __debug = browser ? $.debug : require("node-class").debug,
        idemo = browser ? demo : require('./plugins/demo.js'),
        /**
        * @type Window
        */
        win = idemo.demoWindow(640, 480, "Font rendering"),
        canvas = win.getContext();

    // code from http://pigs.sourceforge.jp/blog/200811140144/uupaa-canvas.js/demo/8_5_canvas_fontSize_fillText.html
    // modified the fillStyle-> blue and font ->

    function draw(ctx) {
        var w = 640,
            h = 480,
            // this doesn't work but I dont think is my fault...
            //var fillText ="AWawあ漢字!?@";
            // this either :S
            fillText ="AWaw\u3042\u6f22\u5b57!?@".
            i, v, dim, txt,
            ary = [6,7,8,9,10,11,12,14,16,18,20,24,28,32,36,40,48,58,64,72,84];

        ctx.fillStyle     = "#0000FF";
        ctx.textBaseline  = "top";

        grid(ctx, w, h, 10, 5, "rgb(0,0,125)", "#000099");

        ary.forEach(function(v, i) {
            txt = v + "pt;" + fillText;
            ctx.font = v + "pt Jura";
            var size = ctx.measureText(txt);
            ctx.fillText(size.width+"x"+size.height+"/"+txt, 10, i * 25 + 10);
        });
    }

    function grid(ctx, w, h, size, unit, color, color2) {
        var x, y, i, j;

        for (i = 0, x = size; x < w; ++i, x += size) {
            ctx.beginPath();
            ctx.strokeStyle = (i % unit) ? color : color2;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.closePath();
            ctx.stroke();
        }
        for (j = 0, y = size; y < h; ++j, y += size) {
            ctx.beginPath();
            ctx.strokeStyle = (j % unit) ? color : color2;
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    win.onRequestFrame = function(delta) {
        win.render(delta);
        draw(canvas);
    };

    Radamn.listenInput(50);
    Radamn.start(1000/50);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));