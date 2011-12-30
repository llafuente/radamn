/**
* This is the default example of BOX2DWEB fully that's make me support more Canvas API...
*/
require('./../lib/Box2dWeb-2.1.a.3.js');
require('./../lib/radamn');

//var screen = module.exports.createScreen(640, 480, module.exports.$.INIT.OPENGL);
//segmentation fault on linux xD
/**
* @type Window
*/
var win = Radamn.createWindow(20,13.3333333333, 600, 400);

// i leave it here but dont work for me.
win.setIcon("./resources/images/icon.bmp");
win.setCaption("caption!!", "caption!");

// do not attach! because we are using a resized canvas...
var fps = require('./fps');
fps = new fps({
    font : "./resources/fonts/Jura-DemiBold.ttf"
    ,x: 400
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

var canvas = win.getCanvas();

var world = null,
	mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;


function handleMouseMove(e) {
   mouseX = (e.clientX) / 30;
   mouseY = (e.clientY) / 30;
   
   console.log(mouseX, mouseY);
};

function getBodyAtMouse() {
   mousePVec = new Box2D.Common.Math.b2Vec2(mouseX, mouseY);
   var aabb = new Box2D.Collision.b2AABB();
   aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
   aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
   
   // Query the world for overlapping shapes.

   selectedBody = null;
   world.QueryAABB(getBodyCB, aabb);
   return selectedBody;
}

function getBodyCB(fixture) {
   if(fixture.GetBody().GetType() != Box2D.Dynamics.b2Body.b2_staticBody) {
      if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
         selectedBody = fixture.GetBody();
         return false;
      }
   }
   return true;
}

Radamn.addEvent("mousedown", function(e) {
   isMouseDown = true;
   handleMouseMove(e);
   Radamn.addEvent("mousemove", handleMouseMove);
}, true);

Radamn.addEvent("mouseup", function() {
   Radamn.removeEvent("mousemove", handleMouseMove);
   isMouseDown = false;
   mouseX = undefined;
   mouseY = undefined;
}, true);




(function () {
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
    	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    	,	b2Body = Box2D.Dynamics.b2Body
    	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    	,	b2Fixture = Box2D.Dynamics.b2Fixture
    	,	b2World = Box2D.Dynamics.b2World
    	,	b2MassData = Box2D.Collision.Shapes.b2MassData
    	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
       ;
    
    world = new b2World(
          new b2Vec2(0, 10)    //gravity
       ,  true                 //allow sleep
    );
    
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    
    var bodyDef = new b2BodyDef;
    
    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(20, 2);
    bodyDef.position.Set(10, 400 / 30 + 1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(10, -1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    fixDef.shape.SetAsBox(2, 14);
    bodyDef.position.Set(-1.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(21.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    
    //create some objects
    bodyDef.type = b2Body.b2_dynamicBody;
    for(var i = 0; i < 10; ++i) {
       if(Math.random() > 0.5) {
          fixDef.shape = new b2PolygonShape;
          fixDef.shape.SetAsBox(
                Math.random() + 0.1 //half width
             ,  Math.random() + 0.1 //half height
          );
       } else {
          fixDef.shape = new b2CircleShape(
             Math.random() + 0.1 //radius
          );
       }
       bodyDef.position.x = Math.random() * 10;
       bodyDef.position.y = Math.random() * 10;
       world.CreateBody(bodyDef).CreateFixture(fixDef);
    }
		 
    //setup debug draw
    var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(canvas);
	//debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);
    
    //window.setInterval(update, 1000 / 60);
})();

win.setBackgroundColor("rgb(80,80,80)");

win.onRequestFrame = function(delta) {
	fps.draw(canvas, delta);
	
	win.render(delta, function() {
	
        if(isMouseDown && (!mouseJoint)) {
           var body = getBodyAtMouse();
           if(body) {
              var md = new Box2D.Dynamics.Joints.b2MouseJointDef();
              md.bodyA = world.GetGroundBody();
              md.bodyB = body;
              md.target.Set(mouseX, mouseY);
              md.collideConnected = true;
              md.maxForce = 300.0 * body.GetMass();
              mouseJoint = world.CreateJoint(md);
              body.SetAwake(true);
           }
        }
        
        if(mouseJoint) {
           if(isMouseDown) {
              mouseJoint.SetTarget(new Box2D.Common.Math.b2Vec2(mouseX, mouseY));
           } else {
              world.DestroyJoint(mouseJoint);
              mouseJoint = null;
           }
        }
	
		world.Step(
				1 / 60   //frame-rate
			,   10       //velocity iterations
			,   10       //position iterations
		);
		world.DrawDebugData();
		world.ClearForces();
	});
};


var canvas = win.getCanvas();


Radamn.listenInput(50);
Radamn.start(0);