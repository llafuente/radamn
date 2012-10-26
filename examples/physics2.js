(function (exports, browser) {
    "use strict";

    /**
    from: http://blog.sethladd.com/search/label/box2d
    replace:
    aqua -> rgb(0,255,255)
    black -> rgb(0,0,0)
    yellow -> rgb(255,255,0)
    red -> rgb(255,0,0)
    */
    //declare BOX2D

    if(!browser) {
        require('./../lib/Box2dWeb-2.1.a.3.js');
        require('./../lib/radamn');
        require('./physics2-btestlib.js');
    }

    var idemo = browser ? demo : require('./plugins/demo.js');

    //segmentation fault on linux xD
    /**
    * @type Window
    */
    var win = idemo.demoWindow(640,480,"BOX2DWEB demo 2");


    var initExample = null;
    var canvas = win.getContext();

    //-------------------------
        var SCALE = 30;
        var NULL_CENTER = {x:null, y:null};

        function Entity(id, x, y, angle, center, color, strength) {
          this.id = id;
          this.x = x;
          this.y = y;
          this.angle = angle || 0;
          this.center = center;
          this.color = color || "rgb(255,0,0)";
          this.isHit = false;
          this.strength = strength;
          this.dead = false;
        }

        Entity.prototype.hit = function(impulse, source) {
          this.isHit = true;
          if (this.strength) {
            this.strength -= impulse;
            if (this.strength <= 0) {
              this.dead = true
            }
          }
        }

        Entity.prototype.getColor = function() {
          if (this.isHit) {
            return 'rgb(0,0,0)';
          } else {
            return this.color;
          }
        }

        Entity.prototype.update = function(state) {
          this.x = state.x;
          this.y = state.y;
          this.center = state.c;
          this.angle = state.a;
        }

        Entity.prototype.draw = function(ctx) {
          ctx.fillStyle = 'rgb(0,0,0)';
          ctx.beginPath();
          ctx.arc(this.x * SCALE, this.y * SCALE, 4, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = 'rgb(255,255,0)';
          ctx.beginPath();
          ctx.arc(this.center.x * SCALE, this.center.y * SCALE, 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();

          // clear
          this.isHit = false;
        }

        Entity.build = function(def) {
          if (def.radius) {
            return new CircleEntity(def.id, def.x, def.y, def.angle, NULL_CENTER, def.color, def.strength, def.radius);
          } else if (def.polys) {
            return new PolygonEntity(def.id, def.x, def.y, def.angle, NULL_CENTER, def.color, def.strength, def.polys);
          } else {
            return new RectangleEntity(def.id, def.x, def.y, def.angle, NULL_CENTER, def.color, def.strength, def.halfWidth, def.halfHeight);
          }
        }

        function CircleEntity(id, x, y, angle, center, color, strength, radius) {
          color = color || 'rgb(0,255,255)';
          Entity.call(this, id, x, y, angle, center, color, strength);
          this.radius = radius;
        }
        CircleEntity.prototype = new Entity();
        CircleEntity.prototype.constructor = CircleEntity;

        CircleEntity.prototype.draw = function(ctx) {
          ctx.save();
          ctx.translate(this.x * SCALE, this.y * SCALE);
          ctx.rotate(this.angle);
          ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);

          ctx.fillStyle = this.getColor();
          ctx.strokeStyle = 'rgb(0,0,0)';
          ctx.beginPath();
          ctx.arc(this.x * SCALE, this.y * SCALE, this.radius * SCALE, 0, Math.PI * 2, true);
          ctx.moveTo(this.x * SCALE, this.y * SCALE);
          ctx.lineTo((this.x) * SCALE, (this.y + this.radius) * SCALE);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();

          Entity.prototype.draw.call(this, ctx);
        }

        function RectangleEntity(id, x, y, angle, center, color, strength, halfWidth, halfHeight) {
          Entity.call(this, id, x, y, angle, center, color, strength);
          this.halfWidth = halfWidth;
          this.halfHeight = halfHeight;
        }
        RectangleEntity.prototype = new Entity();
        RectangleEntity.prototype.constructor = RectangleEntity;

        RectangleEntity.prototype.draw = function(ctx) {
          ctx.save();
          ctx.translate(this.x * SCALE, this.y * SCALE);
          ctx.rotate(this.angle);
          ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
          ctx.fillStyle = this.getColor();
          ctx.fillRect((this.x-this.halfWidth) * SCALE,
                       (this.y-this.halfHeight) * SCALE,
                       (this.halfWidth*2) * SCALE,
                       (this.halfHeight*2) * SCALE);
          ctx.restore();

          Entity.prototype.draw.call(this, ctx);
        }

        function PolygonEntity(id, x, y, angle, center, color, strength, polys) {
          Entity.call(this, id, x, y, angle, center, color, strength);
          this.polys = polys;
        }
        PolygonEntity.prototype = new Entity();
        PolygonEntity.prototype.constructor = PolygonEntity;

        PolygonEntity.prototype.draw = function(ctx) {
          ctx.save();
          ctx.translate(this.x * SCALE, this.y * SCALE);
          ctx.rotate(this.angle);
          ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
          ctx.fillStyle = this.getColor();

          for (var i = 0; i < this.polys.length; i++) {
            var points = this.polys[i];
            ctx.beginPath();
            ctx.moveTo((this.x + points[0].x) * SCALE, (this.y + points[0].y) * SCALE);
            for (var j = 1; j < points.length; j++) {
               ctx.lineTo((points[j].x + this.x) * SCALE, (points[j].y + this.y) * SCALE);
            }
            ctx.lineTo((this.x + points[0].x) * SCALE, (this.y + points[0].y) * SCALE);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          ctx.restore();

          Entity.prototype.draw.call(this, ctx);
        }

        var world = {};
        var bodiesState = null;
        var box = null;
        var graveyard = [];

        function update(animStart) {
          box.update();
          bodiesState = box.getState();



          for (var id in bodiesState) {
            var entity = world[id];

            if (entity && world[id].dead) {
              box.removeBody(id);
              graveyard.push(id);
            } else if (entity) {
              entity.update(bodiesState[id]);
            }
          }

          for (var i = 0; i < graveyard.length; i++) {
            delete world[graveyard[i]];
          }
        }

        var ctx = canvas;
        var canvasWidth = ctx.canvas.width;
        var canvasHeight = ctx.canvas.height;

        function draw() {
          //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          for (var id in world) {
            var entity = world[id];
            entity.draw(ctx);
          }
        }

        var initialState = [
          {id: "ground", x: canvasWidth / 2 / SCALE, y: canvasHeight / SCALE, halfHeight: 0.5, halfWidth: canvasWidth / SCALE, color: 'rgb(255,255,0)'},
          {id: "ball", x: 2, y: canvasHeight / SCALE - 2, radius: 0.5},
          {id: "b1", x:17, y: canvasHeight / SCALE - 1, halfHeight: 2, halfWidth: 0.10, strength: 25},
          {id: "b2", x:17, y: canvasHeight / SCALE - 5, halfHeight: 0.25, halfWidth: 2, strength: 30}
        ];

        var running = true;

        function init() {
          for (var i = 0; i < initialState.length; i++) {
            world[initialState[i].id] = Entity.build(initialState[i]);
          }

          box = new bTest(60, false, canvasWidth, canvasHeight, SCALE);
          box.setBodies(world);

          box.addContactListener({
            BeginContact: function(idA, idB) {
            },

            PostSolve: function(idA, idB, impulse) {
              if (impulse < 0.1) return;
              var entityA = world[idA];
              var entityB = world[idB];
              if(entityB && entityA) {
                entityA.hit(impulse, entityB);
                entityB.hit(impulse, entityA);
              }
            }
          });

          setTimeout(function() {
            box.applyImpulse("ball", 70, 35);
          }, 1000);

          initExample = setTimeout(function() {
            init();
          }, 10000);
        }

        //document.addEventListener("DOMContentLoaded", function() {
          init();
        //}, false);


    //-------------------------


    win.setBackgroundColor("rgb(200,200,200)");

    win.onRequestFrame = function(delta) {
        // update function
        update();

        win.render(delta, function() {
          // draw function
          draw();
        });
    };

    var canvas = win.getContext();

    Radamn.start(50);


}(typeof module == "undefined" ? window : module.exports, typeof module == "undefined"));