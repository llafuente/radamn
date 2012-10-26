(function (exports, browser) {
    "use strict";

    if(!browser) {
        require('./../lib/radamn');
    }

    var idemo = browser ? demo : require('./plugins/demo.js'),
        /**
        * @type Window
        */
        win = idemo.demoWindow(640, 480, "Line Rendering"),
        canvas = win.getContext(),
        counter = 0;

    win.onRequestFrame = function(delta) {
        ++counter;

        win.render(delta);

        //from: https://developer.mozilla.org/en/Canvas_tutorial/Drawing_shapes

        // line test
        canvas.save();
            canvas.strokeStyle = "rgb(255,0,0)";
            canvas.fillStyle = "rgb(0,255,255)";
            canvas.lineWidth = 5;

            //happy face!
            canvas.beginPath();
            canvas.arc(75,75,50,0,Math.PI*2,true); // Outer circle
            canvas.moveTo(110,75);
            canvas.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
            canvas.moveTo(65,65);
            canvas.arc(60,65,5,0,Math.PI*2,true);  // Left eye
            canvas.moveTo(95,65);
            canvas.arc(90,65,5,0,Math.PI*2,true);  // Right eye
            canvas.stroke();


            canvas.translate( 256, 0);
            //arc test
            for(var i=0;i<4;i++){
              for(var j=0;j<3;j++){
                canvas.beginPath();
                var x              = 25+j*50;                     // x coordinate
                var y              = 25+i*50;                     // y coordinate
                var radius         = 20;                          // Arc radius
                var startAngle     = 0;                           // Starting point on circle
                var endAngle       = Math.PI + (Math.PI * j) / 2; // End point on circle
                var anticlockwise  = i % 2 == 0 ? false : true;   // clockwise or anticlockwise

                canvas.arc(x,y,radius,startAngle,endAngle, anticlockwise);

                if (i>1){
                  canvas.fill();
                } else {
                  canvas.stroke();
                }
              }
            }


            canvas.translate(-256, 192);

            canvas.beginPath();
            canvas.moveTo(188, 130);
            canvas.bezierCurveTo(140, 10, 388, 10, 388, 170);

            canvas.lineWidth = 10;
            canvas.stroke();

            // http://www.html5canvastutorials.com/tutorials/html5-canvas-rounded-corners/
            var rectWidth = 200;
            var rectHeight = 100;
            var rectX = 640 / 2 - rectWidth / 2;
            var rectY = 480 / 2 - rectHeight / 2;

            var cornerRadius = 50;

            canvas.beginPath();
            canvas.moveTo(rectX, rectY);
            canvas.lineTo(rectX + rectWidth - cornerRadius, rectY);
            canvas.arcTo(rectX + rectWidth, rectY, rectX + rectWidth,
                rectY + cornerRadius, cornerRadius);
            canvas.lineTo(rectX + rectWidth, rectY + rectHeight);

            canvas.lineWidth = 5;
            canvas.stroke();



            canvas.translate(256,0);
            // https://developer.mozilla.org/samples/canvas-tutorial/2_3_canvas_lineto.html
            // Filled triangle
            canvas.beginPath();
            canvas.moveTo(25,25);
            canvas.lineTo(105,25);
            canvas.lineTo(25,105);
            canvas.fill();

            // Stroked triangle
            canvas.beginPath();
            canvas.moveTo(125,125);
            canvas.lineTo(125,45);
            canvas.lineTo(45,125);
            canvas.closePath();
            canvas.stroke();

            canvas.translate(-256, 128);
            canvas.beginPath();
            var centerX = 128;
            var centerY = 128;
            var radius = 75;
            var startingAngle = 1.1 * Math.PI;
            var endingAngle = 1.9 * Math.PI;
            var counterclockwise = false;

            canvas.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
            canvas.stroke();


            // box
            canvas.translate(128, 0);
            canvas.beginPath();
            canvas.moveTo(0,0);
            canvas.lineTo(0,50);
            canvas.lineTo(50,50);
            canvas.lineTo(50,0);
            canvas.lineTo(0,0);
            canvas.stroke();


            // inverse C
            canvas.translate(128, 0);
            canvas.beginPath();
            canvas.lineTo(0,50);
            canvas.lineTo(50,50);
            canvas.lineTo(50,0);
            canvas.lineTo(0,0);
            canvas.stroke();


            // triangle
            canvas.translate(128, 0);
            canvas.beginPath();
            canvas.moveTo(0,0);
            canvas.lineTo(0,50);
            canvas.lineTo(50,50);
            canvas.lineTo(0,0);
            canvas.fill();
            canvas.stroke();

            // triangle L
            canvas.translate(128, 0);
            canvas.beginPath();
            canvas.moveTo(0,0);
            canvas.lineTo(0,50);
            canvas.lineTo(50,50);
            canvas.fill();
            canvas.stroke();

            // \
            canvas.translate(128, 0);
            canvas.beginPath();
            canvas.moveTo(0,0);
            canvas.lineTo(50,50);
            canvas.stroke();




            canvas.moveTo(0,250);

            canvas.beginPath();
            canvas.arc(100, 100, 25, 0, Math.HALF_PI);
            canvas.stroke();

            canvas.beginPath();
            canvas.arc(200, 100, 25, Math.HALF_PI, Math.PI);
            canvas.stroke();

            canvas.beginPath();
            canvas.arc(300, 100, 25, Math.PI, Math.PI + Math.HALF_PI);
            canvas.stroke();

            canvas.beginPath();
            canvas.arc(400, 100, 25, Math.PI + Math.HALF_PI, Math.TWO_PI);
            canvas.stroke();

            //anticlockwise
            canvas.beginPath();
            canvas.arc(100, 200, 25, 0, Math.HALF_PI, true);
            canvas.stroke();

            canvas.beginPath();
            canvas.arc(200, 200, 25, Math.HALF_PI, Math.PI, true);
            canvas.stroke();

            canvas.beginPath();
            canvas.arc(300, 200, 25, Math.PI, Math.PI + Math.HALF_PI, true);
            canvas.stroke();

            canvas.beginPath();
            canvas.arc(400, 200, 25, Math.PI + Math.HALF_PI, Math.TWO_PI, true);
            canvas.stroke();

        canvas.restore();

    };

    Radamn.start(1);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));