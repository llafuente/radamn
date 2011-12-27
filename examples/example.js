require('./../lib/radamn');

//var screen = module.exports.createScreen(640, 480, module.exports.$.INIT.OPENGL);
//segmentation fault on linux xD
/**
* @type Window
*/
var win = Radamn.createWindow(320,240, 640, 480);

//console.log(CRadamn);
//console.log(CRadamn.getVersion());
//console.log(module.exports);

// i leave it here but dont work for me.
win.setIcon("./resources/images/icon.bmp");
win.setCaption("caption!!", "caption!");


var canvas = win.getCanvas();

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
/*
var animation = Radamn.Assets.getAnimation("./resources/images/star-green.png", {
    animation: animation_cfg,
    loop: true,
    fps: 12
});
animation.play();
*/


var gridResource = Radamn.createRenderable(function (canvas) {
    var size = 32;
    var x = Math.floor(win.width / size);
    var y = Math.floor(win.height / size);

    canvas.strokeStyle = "#FFFFFF";
    canvas.lineWidth = 1;

    for(i=0;i<x; ++i) {
        canvas.translate( size, 0);
        canvas.beginPath();
        canvas.lineTo(0, win.height);
        canvas.closePath();
        canvas.stroke();
    }
    canvas.translate( -x*size, 0);
    for(i=0;i<y; ++i) {
        canvas.translate(0, size);
        canvas.beginPath();
        canvas.lineTo(win.width, 0);
        canvas.closePath();
        canvas.stroke();
    }
    canvas.translate(0, -y*size);
});

Radamn.addEvent("quit", function(e) {
    Radamn.quit();
});

Radamn.addEvent("keydown", function(e) {
    if (e.char == "F5") {
        win.screenshot();
    } else if (e.char == "Escape") {
        Radamn.quit();
    }
});

Radamn.addEvent("wheel", function(e) {
    console.log(e);
});
Radamn.addEvent("wheelchange", function(e) {
    console.log(e);
});
Radamn.addEvent("mousedown", function(e) {
    var nodes = win.ray(e.x, e.y);
    var i=0,
        max=nodes.length;
    for(; i<max; ++i) {
        nodes[i].fireEvent("click", [e]);
    }
});

win.setBackgroundColor("#000000");

var node = win.getRootNode();

node.addEvent("click", function(e) {
    console.log(e);
});


var childnode1 = new Radamn.Node();
var childnode2 = new Radamn.Node();

node.appendEntity(gridResource);
childnode1.appendEntity(image);
childnode2.appendEntity(image);


childnode1.matrix.gTranslate(32, 0);
childnode2.matrix.translate(32, 32);

node.appendChild(childnode1);
node.appendChild(childnode2);

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    childnode2.matrix.translate(1, 1);

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


    /*
    image.__draw(win.getCanvas().getSurface(), 50, 50);

    var font_image = font.getImage("saved and then rendered", 0x8ae234);
    font_image.__draw(win.getCanvas().getSurface(), 0, 0);

    font.write(win.getCanvas().getSurface(), "direct text and free", 0x8ae234, 100, 50);
    */
};

Radamn.listenInput(50);
Radamn.start(50);

/** resize in real time ! wtf! it should be another window... someday :)
var screen2 = module.exports.createScreen(480, 320, module.exports.$.INIT.OPENGL);
screen2.setCaption("caption2!!", "caption2!");
*/