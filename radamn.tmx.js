//"use strict"; mootools is not strict :S

// this move the JS to C realm
// executes Radamn::init and return into CRadamn
var CRadamn = require(process.env.PWD+ '/../build/Release/radamn.node');
var Radam = global.Radamn;

module.exports.TMX = new Class({
    Implements: [Options, Events],
    name : "EntityTMX",

    layerTiles: [],
    layerEls: null,
    objects: [],
    objectEls: null,

    imgContext: null,
    imgcanvas: null,

    tilesets: [],
    tileset: {
        width: false, //get from TMX
        height: false //get from TMX
    },
    tiles: {
        width: false, //get from TMX
        height: false //get from TMX
    },
    map: {
        width: false, //get from TMX
        height: false //get from TMX
    },

    options: {
        AABB: null,
        offset : {
            x: 500, // false means centered
            y: 0
        },
        gid: 0,
        x:0,
        y:0
    },
    ready: false,
    initialize: function(tmx_file, options) {
        this.setOptions(options);

        this.loadTMX(tmx_file);
    },
    loadTMX: function(tmx_file) {

        var util = require('util');
        var DomJS = require("dom-js").DomJS;

        var domjs = new DomJS();

        var fs = require('fs');


        fs.readFile(tmx_file, 'ascii', function (err, data) {
              if (err) throw err;
              var xml = domjs.parse(data, function(err, xml) {
                  this.setXML(xml);

              }.bind(this));
        }.bind(this));
    },
    setXML: function(xml) {
        function getElements (name, xml, elements) {
            var output = {children: [], attributes: []};
            if(xml.children !== undefined) {
                xml.children.each(function(k) {
                    if(k.name == name) output.children.push(k);
                });
            }
            return output;
        };

        this.tiles = {
            width: parseInt(xml.attributes.tilewidth,10) * 0.5,
            height: parseInt(xml.attributes.tileheight, 10) * 0.5
        };

        this.map = {
            x: parseInt(xml.attributes.width, 10),
            y: parseInt(xml.attributes.height, 10),
            width : parseInt(xml.attributes.width, 10) * this.tiles.width,
            height : parseInt(xml.attributes.height, 10) * this.tiles.height
        };

        var xml_tilesets = xml.children[1]; // tileset should be better match

        var image_URL = null;
        xml_tilesets.children.each(function(tile, key){
            if(tile.name == "image") {
                image_URL = tile.attributes.source;
                this.tileset = {
                    width: parseInt(xml_tilesets.attributes.tilewidth, 10),
                    height: parseInt(xml_tilesets.attributes.tileheight, 10)
                };
                this.tileset.x = parseInt(tile.attributes.width, 10) / this.tileset.width;
                this.tileset.y = parseInt(tile.attributes.height, 10) / this.tileset.height;
            }
        }.bind(this));

        this.options.clickMap = false;

        console.log(image_URL);
        this.tilesets.push(Radamn.Assets.getImage(process.env.PWD+"/"+image_URL));

        var xml_layers = getElements("layer", xml);

        var objectEls = {children: []};
        xml_layers.children.each(function(v, k) {
            var aux = getElements("data", v);

            aux.children.each(function(vv) {
                vv.attributes = v.attributes;
                vv.attributes.gid = parseInt(k, 10);

                objectEls.children.push(vv);
            });

        });

        objectEls.children.each(function(layer){
            this.layerTiles.push([]);

            var name = layer.attributes.name;

            var data = layer.children[0].text;
            var i=0, max = data.length;
            var gid = '';
            var x=-1, y=0;
            for(;i<max;++i) {
                if(data[i] === "\n") {
                    x=-1;
                    ++y;
                    continue;
                } else if(data[i] === ","){
                    ++x;
                }

                if(data[i] === ",") {
                    if(gid.length == 0) continue;

                    gid = parseInt(gid, 10);

                    if(gid !== 0) {
                        var obj = {
                            position: {
                                x: x,
                                y: y
                            },
                            tile: {
                                id: gid-1
                            }
                        };
                        obj.zIndex = (obj.position.x + obj.position.y * this.map.x) + layer.attributes.gid * this.map.x * this.map.y;
                        this.layerTiles[layer.attributes.gid].push(obj);
                    }
                    gid = '';
                } else {
                    gid+=data[i];
                }
            }
        }.bind(this));

        this.__ready();
    },
    __ready: function() {
        var tileset_x = this.tileset.x;
        var tileset_w = this.tileset.width;
        var tileset_h = this.tileset.height;

        if(this.options.offset.x === false) {
            this.options.offset.x = this.map.width * 0.5;
        }

        var i=0, max=this.layerTiles.length;
        var img = this.tilesets[0];
        for(;i<max; ++i) {
            var j=0, jmax=this.layerTiles[i].length;
            for(;j<jmax; ++j) {
                var tile = this.layerTiles[i][j];
                tile.tile.x = tile.tile.id % tileset_x;
                tile.tile.y = Math.floor(tile.tile.id / tileset_x);
                tile.$position = this.getScreenPosition(tile.position.x, tile.position.y, 0);


                //tile.$draw = [img,
                //    tile.tile.x * tileset_w, tile.tile.y * tileset_h, tileset_w, tileset_h,
                //    tile.$position.x, tile.$position.y, tileset_w, tileset_h
                //    ];
                this.layerTiles[i][j] = [
                    tile.tile.x * tileset_w, tile.tile.y * tileset_h, tileset_w, tileset_h,
                    tile.$position.x, tile.$position.y, tileset_w, tileset_h
                    ];
            }
        }
        i=0;
        max=this.objects.length;
        for(;i<max; ++i) {
            var obj = this.objects[i];
            obj.x = obj.id % tileset_x;
            obj.y = Math.floor(obj.id / tileset_x);

            obj.$draw = [img,
                obj.x * tileset_w, obj.y * tileset_h, tileset_w, tileset_h,
                //this.options.offset.x + obj.position.x, this.options.offset.y + obj.position.y, tileset_w, tileset_h
                obj.position.x, obj.position.y, tileset_w, tileset_h
                ];
        }


        var json = {
            type: "tileset",
            properties: [
            {
                id: 0,
                left: true,
                right: true,
                top: true,
                bottom: true,
                level: 0
            },
            {
                id: 35,
                left: true,
                right: true,
                top: true,
                bottom: true,
                level: 1
            },
            {
                id: 61,
                left: true,
                right: true,
                top: true,
                bottom: true,
                level: 1
            },
            {
                id: 32,
                left: true,
                right: true,
                top: false,
                bottom: false,
                level: 0,
                ramp: "left-to-right"
            }
            ]
        };

        function getProp(id) {
            var i=0, max=json.properties.length;
            for(;i<max; ++i) {
                if(json.properties[i].id == id) return json.properties[i];
            }
            return null;
        }

        var i=0, max=this.map.x;
        var $path = [];

        for(;i<max; ++i) {
            var j=0, jmax=this.map.y;
            $path.push([]);
            for(;j<jmax; ++j) {
                $path[i].push(0);
            }
        }
        /*
        //console.log(JSON.stringify($path));
        //console.log($path.length);
        //console.log($path[0].length);


        var tiles_ids = [];
        i=0, max=this.layerTiles.length;
        for(;i<max; ++i) {
            var j=0, jmax=this.layerTiles[i].length;
            for(;j<jmax; ++j) {

                var tile = this.layerTiles[i][j];
                //$path[tile.position.x][tile.position.y] = getProp(tile.tile.id);
                if($path[tile.position.x] == undefined) {
                    //console.log(tile);
                }
                $path[tile.position.x][tile.position.y] = tile.tile.id === 60 ? 1 : 0;
                if(tile.tile.id !== 0) {
                    //console.log(tile.tile.id);
                }
                tiles_ids.push(tile.tile.id);
            }
        }
        */

        this.ready = true;
        //console.log(JSON.stringify($path));
        //console.log(JSON.stringify(tiles_ids));

        /*
        var graph = new Graph($path);
        this.graph = graph;
        var start = graph.nodes[21][40];
        var end = graph.nodes[10][14];
        var result = astar.search(graph.nodes, start, end);
        //console.log(result);
        //console.log(result.length);
        this.highlightPath(Eli.canvas[0].context, result, 50);
        */


        // result is an array containing the shortest path

        /*
        var request = new Request.JSON({
            url: "/images/iso-64x64-outside.js",
            onError: function() {
                //console.log(arguments);
            },
            onFailure: function() {
                //console.log(arguments);
            },
            onComplete: function(json) {
                //console.log("WTF!!!!!!!!!!!!!!!!!!!!!!!");
                //console.log(json);





            }.bind(this)
        }).get();
        */
    },
    /**
     *
     */
    getTiles: function(x, y, return_all) {
        return_all = return_all | false;
        var found = false;
        var out = [];
        var i=this.layerTiles.length-1;
        for(;i>-1; --i) {
            var j=0, jmax=this.layerTiles[i].length;
            for(;j<jmax; ++j) {
                if(this.layerTiles[i][j].position.x == x && this.layerTiles[i][j].position.y == y) {
                    if(!return_all)
                        return [this.layerTiles[i][j]];
                    out.push(this.layerTiles[i][j]);
                }
            }
        }
        return out.length === 0 ? null : out;
    },
    ray: function(x, y) {
        var mouse = {x:x, y:y};
        // get Global position!
        if(this.parentNode !== null) {
            var translation = this.parentNode.getDerivedPosition();
            mouse = v2Sub(mouse, translation);
        }

        var tilepos = this.getTilePosition(mouse.x, mouse.y);

        //XXX optimize the offsets :) with tilepos as floats... someday :)
        var offsets = [[0,0]];
        for(var i=-2;i<3; ++i) {
            for(var j=-2;j<3; ++j) {
                offsets.push([i,j]);
            }
        }

        //cache
        var tileset_w = this.tileset.width,
        tileset_h = this.tileset.height,
        ok_tiles = [];

        var i=0, max=offsets.length;
        for(;i<max;++i) {
            var test_x = tilepos.x + offsets[i][0];
            var test_y = tilepos.y + offsets[i][1];
            var pixelOK = false;
            //console.log("testing: ", test_x, test_y);
            var tiles = this.getTiles(test_x, test_y, true);
            //console.log(x,y);
            //console.log(tile_top_left);

            if(tiles !== null) {
                var tile_top_left = this.getScreenPosition(test_x, test_y);

                var j=0, jmax=tiles.length;
                for(;j<jmax;++j) {
                    var tile = tiles[j];

                    var offset = {
                            x: ( mouse.x - tile_top_left.x ),
                            y: ( mouse.y - tile_top_left.y )
                    };
                    //console.log("offset", offset);
                    if(offset.x < 0 || offset.x >= tileset_w || offset.y < 0 || offset.y >= tileset_h) {
                        continue;
                    }

                    var pixel = {
                        x: parseInt(offset.x + tile.tile.x * tileset_w, 10),
                        y: parseInt(offset.y + tile.tile.y * tileset_h, 10)
                    };
                    //console.log("pixel", pixel);

                    if(this.tilesets[0].ray(pixel.x, pixel.y)) {
                        ok_tiles.push(tile);
                    }
                }
            }
        }

        if(ok_tiles.length === 1) {
            return ok_tiles[0];
        } else if(ok_tiles.length > 1){
            function sortfunction(a, b) {
                //Compare "a" and "b" in some fashion, and return -1, 0, or 1
                return a.zIndex == b.zIndex ? 0 : (a.zIndex > b.zIndex ? -1 : 1);
            }
            ok_tiles.sort(sortfunction);
            return ok_tiles[0];
        }

        return null;
    },
    getTilePosition : function(x,y, as_float) {
        as_float = as_float | false;
        x-=this.options.offset.x;
        y-=this.options.offset.y;

        tempX = (x / 64);// = (mapPoint.X + mapPoint.Y);
        tempY = (y / 32);// = (mapPoint.X - mapPoint.Y);

        if(!as_float) {
            return {
                x:  Math.floor(tempX + tempY),
                y:  Math.floor(tempY - tempX)
            };
        }
        return {
            x:tempX + tempY,
            y:tempY - tempX
        };
    },
    getScreenPosition : function(x,y,z) {
        return {x: ((x - y) * 32) + this.options.offset.x, // [-4608, 4608]
            y: ((y + x) * 16) + this.options.offset.y,  // [    0, 4608]
            z: 0
        };
    },
    draw: function(ctx, elapsed_time) {
        if(this.ready === false) return;
        var i=0, max=this.layerTiles.length;
        max = 1;
        console.log("tiles: " + max);
        for(;i<max; ++i) {
            var j=0, jmax=this.layerTiles[i].length;

            // one batch process per layer!

            ctx.drawImages(this.tilesets[0], this.layerTiles[i]);
        }

        return ;

        i=0;
        max=this.objects.length;
        max = 10;
        console.log("objects: " + max);
        for(;i<max; ++i) {
            ctx.drawImage.apply(ctx, this.objects[i].$draw);
        }

        //this.debugIso(ctx);
    },
    highlightPath: function(ctx, path, timeout) {
        var result_idx = 0;

        var interval = null;
        var paint_result = function() {
            //console.log(result_idx);
            if(result_idx == path.length) {
                clearInterval(interval);
                return ;
            }
            var tile = this.getTiles(path[result_idx].x, path[result_idx].y);
            this.highlightTile(ctx, tile[0]);
            ++result_idx;
        }.bind(this);

        interval = setInterval(paint_result, timeout);
    },
    highlightTile: function(ctx, tile) {
        if(this.parentNode === null) return;
        var offset = this.parentNode.getDerivedPosition();
        ctx.save();
        ctx.globalCompositeOperation = $D.BMODE.LIGTHER;
        var $draw = tile.$draw.clone();

        $draw[5]+= offset.x;
        $draw[6]+= offset.y;

        ctx.drawImage.apply(ctx, $draw);
        ctx.restore();
    },
    debugIso: function(ctx) {
        var i=0, max=this.layerTiles.length;
        for(;i<max; ++i) {
            var j=0, jmax=this.layerTiles[i].length;
            for(;j<jmax; ++j) {
                ctx.strokeStyle = "rgb(255,0,0)";
                ctx.lineWidth  = 0.5;
                ctx.strokeRect(this.layerTiles[i][j].$draw[5], this.layerTiles[i][j].$draw[6], this.layerTiles[i][j].$draw[7], this.layerTiles[i][j].$draw[8]);
                ctx.stroke();
                //ctx.fillText(this.layerTiles[i][j].position.x+","+this.layerTiles[i][j].position.y,this.layerTiles[i][j].$draw[5]+3, this.layerTiles[i][j].$draw[6]+10);
                if(i==0)
                ctx.fillText(this.layerTiles[i][j].zIndex,this.layerTiles[i][j].$draw[5]+3, this.layerTiles[i][j].$draw[6]+10);
            }
        }
    }
});
