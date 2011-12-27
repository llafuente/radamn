//"use strict"; mootools is not strict :S

// this move the JS to C realm
// executes Radamn::init and return into CRadamn
var CRadamn = require(process.env.PWD+ '/../build/Release/radamn.node');
var Radam = global.Radamn;

/**
 * @class TMXIsometric
 */

var TMXIsometric = {
    /**
     * @member TMXIsometric
     * @params {Number} x
     * @params {Number} y
     * @params {Number} z
     */
    getScreenPosition : function(x,y,z) {
        return {x: ((x - y) * this.tileset.iwidth) + this.options.offset.x, // [-4608, 4608]
            y: ((y + x) * this.tileset.iheight) + this.options.offset.y,  // [    0, 4608]
            z: 0
        };
    },
    /**
     * @member TMXIsometric
     * @params {Number} x
     * @params {Number} y
     * @params {Number} as_float
     */
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
    /**
     * @member TMXIsometric
     * @params {Object} nodeEL
     */
    setTileset: function(nodeEL) {
        this.tileset = {
                width: parseInt(nodeEL.attributes.tilewidth, 10),
                height: parseInt(nodeEL.attributes.tileheight, 10)
        };
        this.tileset.iheight = this.tileset.width / 4;
        this.tileset.iwidth = this.tileset.width / 2;
    }
};
/**
 * @class TMXOrtogonal
 */
var TMXOrtogonal = {
    /**
     * @member TMXOrtogonal
     * @params {Number} x
     * @params {Number} y
     * @params {Number} z
     */
    getScreenPosition: function(x,y,z) {
        return {
            x: (x * this.tileset.iwidth) + this.options.offset.x, // [-4608, 4608]
            y: (y * this.tileset.iheight) + this.options.offset.y,  // [    0, 4608]
            z: 0
        };
    },
    /**
     * @member TMXOrtogonal
     * @params {Number} x
     * @params {Number} y
     * @params {Number} as_float
     */
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
    /**
     * @member TMXOrtogonal
     * @params {Object} nodeEL
     */
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
     * @type TilesetProperties
     */
    tileset: {
        /**
         * @member TilesetProperties
         * @type {Number}
         */
        width: false, //get from TMX
        /**
         * @member TilesetProperties
         * @type {Number}
         */
        height: false, //get from TMX
        /**
         * @member TilesetProperties
         * @type {Number}
         */
        iheight: false, //get from TMX
        /**
         * @member TilesetProperties
         * @type {Number}
         */
        iwidth: false //get from TMX
    },
    /**
     * @member TMX
     * @type {TileProperties}
     */
    tiles: {
        /**
         * @member TileProperties
         * @type {Number}
         */
        width: false, //get from TMX
        /**
         * @member TileProperties
         * @type {Number}
         */
        height: false //get from TMX
    },
    /**
     * @member TMX
     * @type {MapProperties}
     */
    map: {
        /**
         * @member MapProperties
         * @type {Number}
         */
        x: 0, //get from TMX
        /**
         * @member MapProperties
         * @type {Number}
         */
        y: 0, //get from TMX
        /**
         * @member MapProperties
         * @type {Number}
         */
        width: false, //get from TMX
        /**
         * @member MapProperties
         * @type {Number}
         */
        height: false, //get from TMX
        /**
         * @member MapProperties
         * @type {String}
         */
        orientation: "isometric" //get from TMX
    },
    /**
     * @member TMX
     * @type {TMXProperties}
     */
    options: {
        /**
         * @member TMXProperties
         * @type {Boolean}
         */
        AABB: null,
        /**
         * @member TMXProperties
         * @type {Vector2D}
         */
        offset : {
            x: 0,
            y: 0
        },
        /**
         * @member TMXProperties
         * @type {Number}
         */
        gid: 0,
        /**
         * @member TMXProperties
         * @type {Number}
         */
        x:0,
        /**
         * @member TMXProperties
         * @type {Number}
         */
        y:0
    },
    /**
     * @member TMX
     * @type {Boolean}
     */
    ready: false,

    /**
     * @member TMX
     * @constructor
     * @params {String} tmx_file
     * @params {TMXProperties} options
     */
    initialize: function(tmx_file, options) {
        this.setOptions(options);

        this.__loadTMX(tmx_file);
    },
    /**
     * @member TMX
     * @private
     * @params {String} tmx_file
     */ 
	getTileWidth: function() {
		return this.tileset.iwidth;
	 },
	 /**
     * @member TMX
     * @private
     * @params {String} tmx_file
     */ 
	getTileHeight: function() {
		return this.tileset.iheight;
	},
	/**
	 * returns the AABB with the origin in the parentNode, so this AABB is not globally aligned
	 * @returns Rectangle
	 */
	getAABB: function() {
		return new Rectangle(0, 0,  this.tileset.iwidth * this.map.width, this.tileset.iheight * this.map.height);
	},
	 /**
     * @member TMX
     * @private
     * @params {String} tmx_file
     */
    __loadTMX: function(tmx_file) {
        var util = require('util');
        var DomJS = require("dom-js").DomJS;

        var domjs = new DomJS();

        var fs = require('fs');

        //XXX browser support conflict!
        fs.readFile(tmx_file, 'ascii', function (err, data) {
              if (err) throw err;

              //XXX browser support conflict!
              var xml = domjs.parse(data, function(err, xml) {
                  this.__setXML(xml);
              }.bind(this));
        }.bind(this));
    },
    /**
     * @member TMX
     * @private
     * @params {String} type
     */
    __pushLayer: function(type) {
        this.layers.push({
            type: type,

            tile_data: [],
            tiles: [],

            objects: [],

            raw: []
        });
    },
    /**
     * @member TMX
     * @private
     * @params {Object} xml
     */
    __setXML: function(xml) {
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
                this.__pushLayer("tiles");

                nodeEL.children.each(function(data) {
                    if(data.name === undefined) return;
                    this.parseCSVData(data.children[0].text,
                            this.layers.length -1
                    );
                }.bind(this));

                break;
            case "objectgroup" :
                this.__pushLayer("objects");
				
                nodeEL.children.each(function(nodeOBJ){
                    if(nodeOBJ.name === undefined) return;
					
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
	parseObjectProperties: function(nodeEl) {
		//parse properties!
		if(nodeEl.children.length > 0) {
			var i=0,
				max = nodeEl.children.length;
			for(;i<max; ++i) {
				if(nodeEl.children[i].name === undefined) continue;
				nodeEl.children[i].children.each(function(k) {
					if(k.name === undefined) return;
					var value = k.attributes.value;
					if(value[0] == '{') {
						value = JSON.decode(value);
					}
					obj.properties[k.attributes.name] = value;
				});
			}
			
		}
	},
    /**
     * leave it "public" so it can be hack-able
	 * @TODO REGIONs!
     * @member TMX
     * @params {Object} nodeEl
     * @params {Number} layerid
     */
    parseObject: function(nodeEl, layerid) {
		var gid = parseInt(nodeEl.attributes.gid, 10) -1;

		// is an Object
		if(gid > -1) {
			var obj = {
				gid: parseInt(nodeEl.attributes.gid, 10) -1,
				position: {
					x: parseInt(nodeEl.attributes.x, 10),
					y: parseInt(nodeEl.attributes.y, 10)
				}
			};
			obj.x = obj.gid % this.tileset.x;
			obj.y = Math.floor(obj.gid / this.tileset.x);
			
			obj.properties = this.parseObjectProperties(nodeEl);

			this.layers[layerid].raw.push(obj);
			return ;
		}
		/* 
		// is a Region
		var region = new Rectangle(
			parseInt(nodeEl.attributes.x, 10),
			parseInt(nodeEl.attributes.y, 10),
			parseInt(nodeEl.attributes.y, 10),
			parseInt(nodeEl.attributes.y, 10)
		);
		region.properties = this.parseObjectProperties(nodeEl);
		
		this.layers[layerid].raw.push(region);
		*/
    },
    /**
     * leave it "public" so it can be hack-able
     * @member TMX
     * @params {String} data
     * @params {Number} layerid
     */
    parseCSVData: function(data, layerid) {
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
    /**
     * @member TMX
     * @private
     */
    __ready: function() {
        this.__optimizeLayers();
        this.ready = true;
    },
    /**
     * @member TMX
     * @private
     */
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
            console.log("[TMX] post process layer: "+i);
            switch(this.layers[i].type) {
            case 'tiles' :
                var j=0, jmax=this.layers[i].raw.length;
                for(;j<jmax; ++j) {
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
                var j = 0,
					jmax = this.layers[i].raw.length;
                for(;j<jmax; ++j) {
                    var obj = this.layers[i].raw[j];

                    this.layers[i].tiles.push([
                        obj.x * tileset_w, obj.y * tileset_h, tileset_w, tileset_h,
                        //this.options.offset.x + obj.position.x, this.options.offset.y + obj.position.y, tileset_w, tileset_h
                        obj.position.x, obj.position.y, tileset_w, tileset_h
                    ]);

                    this.layers[i].objects.push(obj);

                }
                break;
            }
        }
    },
    /**
     * @TODO user layers no layersTiles
     *
     * @member TMX
     * @private
     */
    getTiles: function(x, y, return_all) {
		console.log(arguments);
        return_all = return_all | false;
        var found = false,
			out = [];
			i = this.layers.length-1;

        for(;i>-1; --i) {
            var j=0, jmax=this.layers[i].raw.length,
				raw = this.layers[i].raw;

            for(;j<jmax; ++j) {
			console.log("tile test", raw[j]);
                if(raw[j].position.x == x && raw[j].position.y == y) {
                    if(!return_all)
                        return [raw[j]];
                    out.push(raw[j]);
                }
            }
        }
        return out.length === 0 ? null : out;
    },
    /**
     * draw rutine
     *
     * @member TMX
     * @params {Canvas} ctx
     * @params {Number} elapsed_time
     */
    draw: function(ctx, elapsed_time) {
		if(this.ready === false) return;
	
        var win = ctx.getWindow(),
			pos = this.parentNode.getDerivedPosition(),
			i=0,
			max=this.layers.length;
        for(;i<max; ++i) {
            var j=0,
				jmax=this.layers[i].tiles.length;

            for(;j<jmax; ++j) {
                var tile = this.layers[i].tiles[j];

                if(!win.isQuadVisible(
                        tile[4] + pos.x, tile[5] + pos.y,
                        tile[6], tile[7])) {
                    continue;
                }
                ctx.drawImage(this.tilesets[0],
                        tile[0],
                        tile[1],
                        tile[2],
                        tile[3],
                        tile[4] + pos.x,
                        tile[5] + pos.y,
                        tile[6],
                        tile[7]
                );
            }
        }
    },
    /**
     * old code, maybe delete
     */
    highlightPath: function(ctx, path, timeout) {
        var result_idx = 0,
			interval = null,
			paint_result = function() {
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
    /**
     * old code, maybe delete
     */
    highlightTile: function(ctx, tile) {
        if(this.parentNode === null) return;

        var offset = this.parentNode.getDerivedPosition(),
			$draw = tile.$draw.clone();

        ctx.save();
        ctx.globalCompositeOperation = $D.BMODE.LIGTHER;

        $draw[5]+= offset.x;
        $draw[6]+= offset.y;

        ctx.drawImage.apply(ctx, $draw);
        ctx.restore();
    }
});
