require('./../lib/radamn');

var demo = require('./plugins/demo.js');

/**
* @type Window
*/
var win = demo.demoWindow(640, 480, "BOX2DWEB TMX");


require('./../lib/Box2dWeb-2.1.a.3.js');
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

var canvas = win.getCanvas();

var TMX = new Radamn.TMX("./resources/tmx/tmx-orthogonal-scrolled.tmx", {});

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

TMX.on("ready", function(tmxclass) {
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


Radamn.on("mousedown", function(ev) {
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
