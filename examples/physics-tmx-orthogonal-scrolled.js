(function (exports, browser) {
    "use strict";

    if (!browser) {
        require('./../lib/Box2dWeb-2.1.a.3.js');
        require('./../lib/radamn');
    }

    var __debug = browser ? $.debug : require("node-class").debug,
        idemo = browser ? demo : require('./plugins/demo.js'),
        /**
        * @type Window
        */
        win = idemo.demoWindow(640, 480, "BOX2DWEB TMX"),

        b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,

        canvas = win.getContext(),

        TMX = new Radamn.TMX({
            tmx_file: "./resources/tmx/tmx-orthogonal-scrolled.tmx"
        }),

        world = new b2World(
            new b2Vec2(0, 10),    //gravity
            true                 //allow sleep
        ),
        debugDraw = new b2DebugDraw(),

        counter = 0;

    //setup debug draw
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
            tile[6] * 0.5, //half width
            tile[7] * 0.5 //half height
        );

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x =  tile[4];
        bodyDef.position.y = tile[5];
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    function createCircle(mouseEvent) {
        var fixDef = new b2FixtureDef,
            bodyDef = new b2BodyDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2CircleShape(
            32 //radius
        );

        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = mouseEvent.x;
        bodyDef.position.y = mouseEvent.y;
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    TMX.on("ready", function (tmxclass) {
        // turn off render,
        //tmxclass.ready = false;

        var i,
            j,
            jmax,
            tile,
            max = tmxclass.layers.length,
            appRootNode = new Radamn.Node(),
            tmxnode = new Radamn.Node(),
            worldnode = new Radamn.Node(),
            renderWorld = Radamn.createRenderable(function () {
                world.DrawDebugData();
                world.ClearForces();
            });
        for (i = 0; i < max; ++i) {
            jmax = tmxclass.layers[i].tiles.length;

            for (j = 0; j < jmax; ++j) {
                tile = tmxclass.layers[i].tiles[j];
                createBox(tile);
            }
        }

        tmxnode.appendEntity(TMX);
        worldnode.appendEntity(renderWorld);
        appRootNode.appendChild(tmxnode).appendChild(worldnode);

        win.getRootNode().appendChild(appRootNode);

        __debug("root node!", win.getRootNode());
    });

    Radamn.on("mousedown", function (ev) {
        createCircle(ev);
    });

    win.onRequestFrame = function (delta) {
        ++counter;

        win.render(delta, function () {
            world.Step(
                1000 / delta,  //frame-rate
                10,            //velocity iterations
                10             //position iterations
            );
        }, function () {
        });
        win.getRootNode().matrix.translate(-(delta / 1000) * 10, false);
    };

    Radamn.listenInput(50);
    Radamn.start(50);

}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));