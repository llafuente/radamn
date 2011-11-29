//"use strict"; mootools is not strict :S

// this move the JS to C realm
// executes Radamn::init and return into CRadamn
var CRadamn = require(process.env.PWD+ '/../build/Release/radamn.node');
var Radam = global.Radamn;

var TMXIsometric = {
    getScreenPosition : function(x,y,z) {
        return {x: ((x - y) * this.tileset.iwidth) + this.options.offset.x, // [-4608, 4608]
            y: ((y + x) * this.tileset.iheight) + this.options.offset.y,  // [    0, 4608]
            z: 0
        };
    },
    getTilePosition : function(x,y, as_float) {
        as_float = as_float | false;
        x-=this.options.offset.x;
        y-=this.options.offset.y;

        tempX = (x / this.tileset.width);// = (mapPoint.X + mapPoint.Y);
        tempY = (y / this.tileset.height * 0.5);// = (mapPoint.X - mapPoint.Y);

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
    setTileset: function(nodeEL) {
        this.tileset = {
                width: parseInt(nodeEL.attributes.tilewidth, 10),
                height: parseInt(nodeEL.attributes.tileheight, 10)
        };
        this.tileset.iheight = this.tileset.width / 4;
        this.tileset.iwidth = this.tileset.width / 2;
    }
};

var TMXOrtogonal = {
    getScreenPosition: function(x,y,z) {
        return {
            x: (x * this.tileset.iwidth) + this.options.offset.x, // [-4608, 4608]
            y: (y * this.tileset.iheight) + this.options.offset.y,  // [    0, 4608]
            z: 0
        };
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
    setTileset: function(nodeEL) {
        this.tileset = {
                width: parseInt(nodeEL.attributes.tilewidth, 10),
                height: parseInt(nodeEL.attributes.tileheight, 10)
        };
        this.tileset.iheight = this.tileset.width;
        this.tileset.iwidth = this.tileset.width;
    }
};

/**
 * @class TMX
 */
module.exports.TMX = new Class({
    Implements: [Options, Events],
    /**
     * @member TMX
     * @type String
     */
    name : "TMX",
    /**
     * contains the folowing structure
     * {
     *     tile_data: []
     *     tiles: [] // this is an optimizen structure to paint in the canvas
     * }
     *
     * @member TMX
     * @type Array
     */
    layers: [],
    /**
     * @member TMX
     * @type Array
     */
    layerTiles: [],
    /**
     * @member TMX
     * @type Array
     */
    objects: [],
    /**
     * @member TMX
     * @type Array
     */
    tilesets: [],
    /**
     * @member TMX
     * @type Array
     */
    tileset: {
        width: false, //get from TMX
        height: false, //get from TMX
        iheight: false, //get from TMX
        iwidth: false //get from TMX
    },
    tiles: {
        width: false, //get from TMX
        height: false //get from TMX
    },
    map: {
        x: 0, //get from TMX
        y: 0, //get from TMX
        width: false, //get from TMX
        height: false, //get from TMX
        orientation: "isometric" //get from TMX
    },

    options: {
        AABB: null,
        offset : {
            x: 0,
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

        //XXX browser support conflict!
        fs.readFile(tmx_file, 'ascii', function (err, data) {
              if (err) throw err;

              //XXX browser support conflict!
              var xml = domjs.parse(data, function(err, xml) {
                  this.setXML(xml);
              }.bind(this));
        }.bind(this));
    },
    pushLayer: function(type) {
        this.layers.push({
            type: type,

            tile_data: [],
            tiles: [],

            objects: [],

            raw: []
        });
    },
    setXML: function(xml) {
        this.tiles = {
            width: parseInt(xml.attributes.tilewidth,10) * 0.5,
            height: parseInt(xml.attributes.tileheight, 10) * 0.5
        };

        this.map = {
            x: parseInt(xml.attributes.width, 10),
            y: parseInt(xml.attributes.height, 10),
            width : parseInt(xml.attributes.width, 10) * this.tiles.width,
            height : parseInt(xml.attributes.height, 10) * this.tiles.height,
            orientation: xml.attributes.orientation
        };

        if(this.map.orientation == "isometric") {
            Object.each(TMXIsometric, function(fn, fnname) {
                this[fnname] = fn;
            }.bind(this));
        } else {
            Object.each(TMXOrtogonal, function(fn, fnname) {
                this[fnname] = fn;
            }.bind(this));
        }

        xml.children.each(function(nodeEL) {
            if(nodeEL.name === undefined) return;

            switch(nodeEL.name) {
            case "layer" :
                this.pushLayer("tiles");

                nodeEL.children.each(function(data) {
                    if(data.name === undefined) return;
                    this.parseCSVData(data.children[0].text,
                            this.layers.length -1
                    );
                }.bind(this));

                break;
            case "objectgroup" :
                this.pushLayer("objects");

                nodeEL.children.each(function(nodeOBJ){
                    this.parseObject(nodeOBJ,
                            this.layers.length -1
                    );
                }.bind(this));
                break;
            case "tileset" :
                var image_URL = null;
                nodeEL.children.each(function(image){
                    if(image.name === undefined) return;

                    image_URL = image.attributes.source;

                    this.setTileset(nodeEL);

                    this.tileset.x = parseInt(image.attributes.width, 10) / this.tileset.width;
                    this.tileset.y = parseInt(image.attributes.height, 10) / this.tileset.height;
                }.bind(this));

                this.tilesets.push(Radamn.Assets.getImage(process.env.PWD+"/"+image_URL));

                break;
            }
        }.bind(this));

        this.__ready();
    },
    parseObject: function(nodeEl, layerid) {

    },
    parseCSVData: function(data, layerid) {
        console.log(arguments);
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
                    obj.zIndex = (obj.position.x + obj.position.y * this.map.x) + layerid * this.map.x * this.map.y;
                    this.layers[layerid].raw.push(obj);
                }
                gid = '';
            } else {
                gid+=data[i];
            }
        }
    },
    __ready: function() {
        this.__optimizeLayers();
        this.ready = true;
    },
    __optimizeLayers: function() {
        var tileset_x = this.tileset.x;
        var tileset_w = this.tileset.width;
        var tileset_h = this.tileset.height;

        if(this.options.offset.x === false) {
            this.options.offset.x = this.map.width * 0.5;
        }

        // per layer!
        var i=0, max=this.layers.length;
        for(;i<max; ++i) {
            console.log("post process layer: "+i);
            switch(this.layers[i].type) {
            case 'tiles' :
                var j=0, jmax=this.layers[i].raw.length;
                for(;j<jmax; ++j) {
                    console.log(1);
                    var tile = this.layers[i].raw[j];
                    var tile_data = {
                        x: tile.tile.id % tileset_x,
                        y: Math.floor(tile.tile.id / tileset_x),
                        position: this.getScreenPosition(tile.position.x, tile.position.y, 0),
                    };

                    this.layers[i].tile_data.push(tile_data);
                    this.layers[i].tiles.push([
                        tile_data.x * tileset_w, tile_data.y * tileset_h, tileset_w, tileset_h,
                        tile_data.position.x, tile_data.position.y, tileset_w, tileset_h
                    ]);
                }
                break;
            case 'objects' :
                var j=0, jmax=this.layers[i].raw.length;
                for(;j<jmax; ++j) {
                    var obj = this.layers[i].raw[j];

                    this.layers[i].tiles.push([
                        obj.x * tileset_w, obj.y * tileset_h, tileset_w, tileset_h,
                        //this.options.offset.x + obj.position.x, this.options.offset.y + obj.position.y, tileset_w, tileset_h
                        obj.position.x, obj.position.y, tileset_w, tileset_h
                    ]);

                    obj.x = obj.id % tileset_x;
                    obj.y = Math.floor(obj.id / tileset_x);

                    this.layers[i].objects.push(obj);

                }
                break;
            }
        }
    },
    /**
     * @TODO user layers no layersTiles
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


    draw: function(ctx, elapsed_time) {

        var win = ctx.getWindow();

        var pos = this.parentNode.getDerivedPosition();

        if(this.ready === false) return;

        var i=0, max=this.layers.length;
        max = 1;
        console.log("tiles: " + max);
        for(;i<max; ++i) {
            var j=0, jmax=this.layers[i].tiles.length;
            for(;j<jmax; ++j) {
                var tile = this.layers[i].tiles[j];

                if(!win.viewableQuad(
                        tile[4] + pos.x, tile[5] + pos.y,
                        tile[6],         tile[7])) {
                    continue;
                }
                ctx.drawImage(this.tilesets[0],
                        tile[0],
                        tile[1],
                        tile[2],
                        tile[3],
                        tile[4],
                        tile[5],
                        tile[6],
                        tile[7]
                );
            }
        }
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
