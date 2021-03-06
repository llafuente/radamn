require('./../lib/radamn');

require('./plugins/demo.js');

/**
* @type Window
*/
var win = demoWindow(640, 480, "BOX2DWEB TMX", {});

var canvas = win.getContext();

/**
* @type Image
*/
var image = Radamn.Assets.getImage("./resources/images/rock.png");


//animation 80x80 - star-green.png 25,25,21
var animation_cfg = [];
for(var j = 0; j < 3; ++j) {
    for(var i = 0; i < 25; ++i) {
        if(j == 2 && i > 20) continue; // remove the last empty part
        //animation_cfg.push([i*80,j*80, (i+1)*80,(j+1)*80]);
        animation_cfg.push([i*80,j*80, 80, 80]);
    }
}
Radamn.on("wheel", function(e) {
    console.log(e);
});
Radamn.on("wheelchange", function(e) {
    console.log(e);
});
Radamn.on("mousedown", function(e) {
    var nodes = win.ray(e.x, e.y);
    var i=0,
        max=nodes.length;
    for(; i<max; ++i) {
        nodes[i].emit("click", [e]);
    }
});

win.setBackgroundColor("#000000");

var node = win.getRootNode();

node.on("click", function(e) {
    console.log(e);
});


var childnode1 = new Radamn.Node();
var childnode2 = new Radamn.Node();

node.appendEntity(gridResource);
childnode1.appendEntity(image);
childnode2.appendEntity(image);


childnode1.gTranslate(32, 0);
childnode2.translate(32, 32);

node.appendChild(childnode1);
node.appendChild(childnode2);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    childnode2.translate(1, 1);

    win.render(delta);

    // line test, grid mode :)

    /*
    // animation test
    canvas.save();
        canvas.translate(256, 256);
        animation.draw(canvas, delta, 0, 0);
    canvas.restore();
    */

    // some draw test
    canvas.save();
        canvas.drawImage(image, 0, 0);

        canvas.translate( 128, 0);
        canvas.scale(2,2);
        canvas.drawImage(image, 0, 0);

        canvas.translate( 256 +128, 0);
        canvas.rotate(90);
        canvas.scale(1.5, 1.5);
        canvas.drawImage(image, 0, 0);

    canvas.restore();

    // diferent sizes and clippings
    canvas.save();
        canvas.translate( 0, 256);
        canvas.drawImage(image, 0, 0);
        canvas.translate( 64, 0);
        canvas.drawImage(image, 0, 0, 32, 32);
        canvas.translate( 64, 0);
        canvas.drawImage(image, 0, 0, 25, 25, 50, 50, 100, 100);
    canvas.restore();


    // line test
    canvas.save();
        canvas.strokeStyle = "rgb(255,0,0)";
        canvas.lineWidth = 2;

        canvas.translate( 128, 128);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(50,0);
        canvas.lineTo(0,0);
        canvas.closePath();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.lineTo(0,0);
        canvas.closePath();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(0,50);
        canvas.lineTo(50,50);
        canvas.closePath();
        canvas.stroke();

        canvas.translate( 64, 0);
        canvas.beginPath();
        canvas.lineTo(50,50);
        canvas.closePath();
        canvas.stroke();
    canvas.restore();
};

Radamn.start(50);
