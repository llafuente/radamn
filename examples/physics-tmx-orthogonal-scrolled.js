/**
*    LOAD TMX isometric map
*/
require('./../lib/Box2dWeb-2.1.a.3.js');
require('./../lib/radamn');

    var   b2Vec2 = Box2D.Common.Math.b2Vec2
    	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    	,	b2Body = Box2D.Dynamics.b2Body
    	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    	,	b2Fixture = Box2D.Dynamics.b2Fixture
    	,	b2World = Box2D.Dynamics.b2World
    	,	b2MassData = Box2D.Collision.Shapes.b2MassData
    	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    


/**
* @type Window
*/
var win = Radamn.createWindow(640, 480);

// i leave it here but dont work for me.
win.setIcon("./resources/images/icon.bmp");
win.setCaption("caption!!", "caption!");


var canvas = win.getCanvas();

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


var TMX = new Radamn.TMX("./resources/tmx/tmx-orthogonal-scrolled.tmx", {});
/*
var ParalaxBackground = require("./plugins/ParalaxBackground.js");
ParalaxBackground = new ParalaxBackground(tmxnode);

ParalaxBackground.push("./resources/images/sky_po2.png", 0.01);
ParalaxBackground.push("./resources/images/vegetation_po2.png", 1.25);
tmxnode.appendEntity(ParalaxBackground);
*/


var fps = require(process.env.PWD+'/fps');
fps = new fps({
    font : "./resources/fonts/Jura-DemiBold.ttf"
    ,x: 400
});

var fpsnode = new Radamn.Node();
fpsnode.appendEntity(fps);

win.getRootNode().appendChild(fpsnode);

//tmxnode.matrix.translate(-256, false);


var world = new b2World(
      new b2Vec2(0, 10)    //gravity
   ,  true                 //allow sleep
);

//setup debug draw
var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(canvas);
//debugDraw.SetDrawScale(30.0);
debugDraw.SetFillAlpha(0.33);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

function createBox(tile) {
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(
          tile[6] *0.5, //half width
		  tile[7] * 0.5 //half height
    );
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x =  tile[4];
    bodyDef.position.y = tile[5];
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function createCircle(mouseEvent) {
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2CircleShape(
       32 //radius
    );
	
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = mouseEvent.x;
    bodyDef.position.y = mouseEvent.y;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
}

TMX.addEvent("ready", function(tmxclass) {
	// turn off render,
	tmxclass.ready = false;

	var i = 0, max = tmxclass.layers.length;
	for(;i<max; ++i) {
		var j=0,
			jmax=tmxclass.layers[i].tiles.length;

		for(;j<jmax; ++j) {
			var tile = tmxclass.layers[i].tiles[j];
			createBox(tile);
		}
	}
	//process.exit();
});

var renderWorld = Radamn.createRenderable(function() {
	world.DrawDebugData();
	world.ClearForces();
});


var appRootNode = new Radamn.Node(),
	tmxnode = new Radamn.Node(),
	worldnode = new Radamn.Node();

tmxnode.appendEntity(TMX);
worldnode.appendEntity(renderWorld);
appRootNode.appendChild(tmxnode).appendChild(worldnode);

win.getRootNode().appendChild(appRootNode);


Radamn.addEvent("mousedown", function(ev) {
	createCircle(ev);
});

var counter = 0;
win.onRequestFrame = function(delta) {
    ++counter;

    win.render(delta, function() {
		world.Step(
					1000 / delta  //frame-rate
				,   10       //velocity iterations
				,   10       //position iterations
			);
	}, function() {	
	});
    appRootNode.matrix.translate(-(delta / 1000) * 10, false);
};

Radamn.listenInput(50);
Radamn.start(50);
