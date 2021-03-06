// wrapper for non-node envs
(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        isax = browser ? sax : require("../lib/sax"),
        __debug = console.log,
        __info = console.log,
        __warning = console.log,
        ISOorientation_oposite = {
            east : "west",
            west : "east",
            south : "north",
            north : "south"
        },
        ISOorientation_cv = {
            east : "north",
            south : "east",
            west : "south",
            north : "west"
        },
        ISOorientation_ccv = {
            east : "south",
            south : "west",
            west : "north",
            north : "east"
        },
        TMXIsometric,
        TMXOrtogonal,
        TMX;

    /**
     * @class TMXIsometric
     */
    TMXIsometric = /** @lends TMXIsometric.prototype */{
        /**
         * @member TMXIsometric
         * @params Number x
         * @params Number y
         * @params Number z
         */
        getScreenPosition: function (tileset, x, y, z) {
            tileset = tileset || this.tilesets[0];

            return {
                x: ((x - y) * tileset.tilewidth * 0.5),
                y: ((y + x) * tileset.tileheight * 0.25),
                // [ 0, 4608]
                z: 0
            };
        },
        /**
         * @params Number x
         * @params Number y
         * @params Number as_float
         */
        getTilePosition: function (tileset, x, y, as_float) {
            as_float = as_float || false;
            tileset = tileset || this.tilesets[0];

            var tilex = (tileset.tilewidth * 0.5),
                tiley = (tileset.tileheight * 0.25),
                ymouse = ((-y / tiley) + (x / tilex)) * 0.5;

            return {
                x: Math.floor(x / tilex - ymouse),
                y: Math.floor(-ymouse)
            };
        },
        /**
         * @params Vector2 tiledest
         * @params Vector2 tile
         * @returns String values: north|south|east|west
         */
        getOrientation: function (tiledest, tile) {
            __debug("getOrientation", tiledest, tile);

            if (tiledest.y > tile.y) {
                return "east";
            }
            if (tiledest.y < tile.y) {
                return "west";
            }
            if (tiledest.x > tile.x) {
                return "south";
            }

            return "north";
        },
        /**
         * @params String orientation
         * @returns String values: north|south|east|west
         */
        getOrientationOpposite: function (orientation) {
            return ISOorientation_oposite[orientation];
        },
        /**
         * @params String orientation
         * @returns String values: north|south|east|west
         */
        getOrientationCV: function (orientation) {
            return ISOorientation_cv[orientation];
        },
        /**
         * @params String orientation
         * @returns String values: north|south|east|west
         */
        getOrientationCCV: function (orientation) {
            return ISOorientation_ccv[orientation];
        }
    };
    /**
     * @class TMXOrtogonal
     */
    TMXOrtogonal = /** @lends TMXOrtogonal.prototype */{
        /**
         * @member TMXOrtogonal
         * @params Number x
         * @params Number y
         * @params Number z
         */
        getScreenPosition: function (tileset, x, y, z) {
            tileset = tileset || this.tilesets[0];
            return {
                x: (x * tileset.tilewidth),
                // [-4608, 4608]
                y: (y * tileset.tileheight),
                // [ 0, 4608]
                z: 0
            };
        },
        /**
         * @params Number x
         * @params Number y
         * @params Number as_float
         */
        getTilePosition: function (x, y, as_float) {
            as_float = as_float || false;
            var tileset = this.tilesets[0], // TODO ????
                tempX = (x / tileset.tilewidth),
                tempY = (y / tileset.tileheight);

            if (!as_float) {
                return {
                    x: Math.floor(tempX + tempY),
                    y: Math.floor(tempY - tempX)
                };
            }
            return {
                x: tempX + tempY,
                y: tempY - tempX
            };
        },
        /**
         * @params Vector2 tiledest
         * @params Vector2 tile
         * @returns String values: north|south|east|west
         */
        getOrientation: function (tiledest, tile) {
            if (tiledest.y > tile.y) {
                return "north";
            }
            if (tiledest.y < tile.y) {
                return "south";
            }
            if (tiledest.x > tile.x) {
                return "east";
            }
            return "west";
        },
        //todo
        getOrientationOpposite: function (orientation) {
        },
        //todo
        getOrientationCV: function (orientation) {
        },
        //todo
        getOrientationCCV: function (orientation) {
        }
    };

    /**
     * @class TMX
     */
    TMX = new Class("RadamnTMX",/** @lends TMX.prototype */{
        /**
         * @member TMX
         * @type String
         */
        name: "TMX",
        /**
         * <pre>
         * contains the folowing structure
         * {
        *     type: "tile|object"
         *     raw: [] // this is an optimizen structure to paint in the canvas
         *    objects: [],
         *     tiles: [] // this is an optimizen structure to paint in the canvas
         * }
         * </pre>
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
        // {
        // /**
        // * @member TilesetProperties
        // * @type Number
        // */
        // width: false, //get from TMX
        // /**
        // * @member TilesetProperties
        // * @type Number
        // */
        // height: false, //get from TMX
        // /**
        // * @member TilesetProperties
        // * @type Number
        // */
        // iheight: false, //get from TMX
        // /**
        // * @member TilesetProperties
        // * @type Number
        // */
        // iwidth: false //get from TMX
        // },
        /**
         * @member TMX
         * @type {TileProperties}
         */
        tiles: {
            /**
             * @member TileProperties
             * @type Number
             */
            width: false,
            // get from TMX
            /**
             * @member TileProperties
             * @type Number
             */
            height: false
            // get from TMX
        },
        /**
         * @member TMX
         * @type MapProperties
         */
        map: {
            /**
             * @member MapProperties
             * @type Number
             */
            x: 0,
            // get from TMX
            /**
             * @member MapProperties
             * @type Number
             */
            y: 0,
            // get from TMX
            /**
             * @member MapProperties
             * @type Number
             */
            width: false,
            // get from TMX
            /**
             * @member MapProperties
             * @type Number
             */
            height: false,
            // get from TMX
            /**
             * @member MapProperties
             * @type String
             */
            orientation: "isometric" // get from TMX
        },
        /**
         * @member TMXProperties
         * @type Boolean
         */
        AABB: null,
        /**
         * @type Number
         */
        gid: 0,
        /**
         * @type Number
         */
        x: 0,
        /**
         * @type Number
         */
        y: 0,
        /**
         * @type Number
         */
        resource_path: {
            /**
             * @type RegEx
             */
            regex: '//',
            /**
             * @type String
             */
            replace : ''
        },

        getScreenPosition: null,
        getTilePosition: null,
        getOrientation: null,
        getOrientationOpposite: null,
        getOrientationCV: null,
        getOrientationCCV: null

    });

    TMX.Extends(Radamn.ResourceRendereable); // +Resource +Events

    TMX.Implements({
        /**
         * @member TMX
         * @constructs
         * @params String tmx_file
         * @params {Object} options
         */
        __construct: function (options) {
            this.parent();
            this.__id = "tmx-" + this.__id;
            this.__loadTMX(options.tmx_file);
        },
        /**
         * returns the AABB with the origin in the parentNode, so this
         * AABB is not globally aligned
         *
         * @returns Rectangle
         */
        getAABB: function () {
            return new Rectangle(0, 0, this.tileset.iwidth * this.map.width, this.tileset.iheight * this.map.height);
        },
        /**
         * @member TMX
         * @private
         * @param String tmx_file
         */
        __loadTMX: function (tmx_file) {
            if (!browser) {
                var fs = require("fs"),
                    path = require("path");

                // XXX browser support conflict!
                fs.readFile(tmx_file, 'ascii', function (err, xmlstr) {
                    if (err) {
                        throw err;
                    }
                    this.parseXMLString(xmlstr);
                }.bind(this));
            } else {
            // ajax!
                var myRequest = new Radamn.Request({
                    url: tmx_file,
                    method: 'get'
                });
                myRequest.on("request", function () {
                    __info("[TMX] loading");
                });
                myRequest.on("success", function (responseText) {
                    __info("[TMX] loaded");
                    this.parseXMLString(responseText);
                }.bind(this));
                myRequest.on("failure", function () {
                    __info("[TMX] fail!");
                    __warning("[TMX] fail!");
                });
                myRequest.send();
            }
        },
        parseXMLString: function (xmlstr) {
            var parser = isax.parser(true),
                layer = false,
                data = false,
                objects = false;

            parser.onclosetag = function (tagName) {
                return;
            };

            parser.onopentag = function (tag) {
                switch (tag.name) {
                case 'map':
                    this.tiles = {
                        width: parseInt(tag.attributes.tilewidth, 10) * 0.5,
                        height: parseInt(tag.attributes.tileheight, 10) * 0.5
                    };

                    this.map = {
                        x: parseInt(tag.attributes.width, 10),
                        y: parseInt(tag.attributes.height, 10),
                        width: parseInt(tag.attributes.width, 10) * this.tiles.width,
                        height: parseInt(tag.attributes.height, 10) * this.tiles.height,
                        orientation: tag.attributes.orientation
                    };

                    if (this.map.orientation === "isometric") {
                        Object.each(TMXIsometric, function (fn, fnname) {
                            this[fnname] = fn;
                        }.bind(this));

                    } else {
                        Object.each(TMXOrtogonal, function (fn, fnname) {
                            this[fnname] = fn;
                        }.bind(this));
                    }
                    break;
                case 'tileset':
                    tag.attributes.firstgid = parseInt(tag.attributes.firstgid, 10) - 1;
                    tag.attributes.tilewidth = parseInt(tag.attributes.tilewidth, 10);
                    tag.attributes.tileheight = parseInt(tag.attributes.tileheight, 10);

                    this.tilesets.push(tag.attributes);
                    break;
                case 'image':
                    var tileset = this.tilesets[this.tilesets.length - 1];

                    // personal hack for now...
                    //tag.attributes.source = tag.attributes.source.replace(/..\//, "./resources/");
                    tag.attributes.source = tag.attributes.source.replace(this.resource_path.regex, this.resource_path.replace);

                    tag.attributes.x = tag.attributes.width / tileset.tilewidth;
                    tag.attributes.y = tag.attributes.height / tileset.tileheight;

                    tag.attributes.width = parseInt(tag.attributes.width, 10);
                    tag.attributes.height = parseInt(tag.attributes.height, 10);

                    this.tilesets[this.tilesets.length - 1] = Object.merge(tileset, tag.attributes);
                    // do not clone it!
                    this.tilesets[this.tilesets.length - 1].image = Radamn.Assets.getImage(tag.attributes.source);

                    break;
                case 'layer':
                    this.__pushLayer("tiles", tag.attributes);
                    layer = true;
                    break;
                case 'objectgroup':
                    this.__pushLayer("objects", tag.attributes);
                    objects = true;
                    break;

                case 'data':
                    data = true;
                    break;

                    /*
                     * object!
                     *
                     *
                     *
                     */
                case 'object':
                    this.parseObject(tag, this.layers.length - 1);
                    break;
                case 'properties': //add properties to the last object!
                    //this.parseObject(tag, this.layers.length - 1);
                    break;
                case 'property': //add properties to the last object!
                    //this.parseObject(tag, this.layers.length - 1);
                    break;

                default:
                    throw new Error("tag [" + tag + "]not supported tag found!");
                }
                return;

                if (tag.name !== "product") { //??? && !product
                    return;
                }

            }.bind(this);

            parser.ontext = function (text) {
                if (layer && data && text.length > 10) {
                    this.parseCSVData(text, this.layers.length - 1);
                    layer = false;
                    data = false;
                }
            }.bind(this);

            parser.onend = function () {
                this.__ready();
            }.bind(this);

            parser.write(xmlstr).end();
        },
        getLayer: function (layer_name) {
            var i,
                max = this.layers.length;

            for (i = 0; i < max; ++i) {
                if (this.layers[i].name === layer_name) {
                    return this.layers[i];
                }
            }

            return null;
        },
        hideLayer: function (layer_name) {
            var i,
                max = this.layers.length;

            for (i = 0; i < max; ++i) {
                if (this.layers[i].name === layer_name) {
                    this.layers[i].show = false;
                }
            }
        },
        showLayer: function (layer_name) {
            var i,
                max = this.layers.length;

            for (i = 0; i < max; ++i) {
                if (this.layers[i].name === layer_name) {
                    this.layers[i].show = true;
                }
            }
        },
        getTileset: function (id) {
            return this.tilesets[id];
        },
        /**
         * @member TMX
         * @private
         * @params String type
         */
        __pushLayer: function (type, attributes) {
            this.layers.push(Object.merge(attributes, {
                type: type,
                tiles: [],
                objects: [],
                raw: [],
                show: true
            }));
        },
        parseObjectProperties: function (nodeEl) {
            var output = {},
                i,
                max = nodeEl.children.length,
                value;
            // parse properties!
            if (nodeEl.children.length > 0) {
                max = nodeEl.children.length;

                for (i = 0; i < max; ++i) {
                    if (nodeEl.children[i].name === undefined) {
                        continue;
                    }
                    nodeEl.children[i].children.each(function (k) {
                        if (k.name === undefined) {
                            return;
                        }
                        value = k.attributes.value;

                        if (value[0] === '{') {
                            value = JSON.decode(value);
                        }
                        output[k.attributes.name] = value;
                    });
                }
            }
            return output;
        },
        /**
         * leave it "public" so it can be hack-able
         *
         * @TODO REGIONs!
         * @member TMX
         * @params {Object} nodeEl
         * @params Number layerid
         */
        parseObject: function (nodeEl, layerid) {
            var gid = parseInt(nodeEl.attributes.gid, 10) - 1,
                tileset = this.get_tileset_from_gid(gid),
                obj;

            // is an Object
            if (gid > -1) {
                obj = {
                    gid: parseInt(nodeEl.attributes.gid, 10) - 1,
                    position: {
                        x: parseInt(nodeEl.attributes.x, 10),
                        y: parseInt(nodeEl.attributes.y, 10)
                    }
                };
                obj.x = obj.gid % tileset.x;
                obj.y = Math.floor(obj.gid / tileset.x);

                // obj.properties = this.parseObjectProperties(nodeEl);
                this.layers[layerid].raw.push(obj);
                return;
            }
            /*
             * // is a Region var region = new Rectangle(
             * parseInt(nodeEl.attributes.x, 10),
             * parseInt(nodeEl.attributes.y, 10),
             * parseInt(nodeEl.attributes.y, 10),
             * parseInt(nodeEl.attributes.y, 10) ); region.properties =
             * this.parseObjectProperties(nodeEl);
             *
             * this.layers[layerid].raw.push(region);
             */
        },
        /**
         * @member TMX
         * @params String data
         * @params Number layerid
         */
        parseCSVData: function (data, layerid) {
            var i,
                max = data.length,
                gid = '',
                x = -1,
                y = 0,
                obj;

            for (i = 0; i < max; ++i) {
                if (data[i] === "\n") {
                    x = -1;
                    ++y;

                    continue;
                } else if (data[i] === ",") {
                    ++x;
                }

                if (data[i] === ",") {
                    if (gid.length === 0) {
                        continue;
                    }

                    gid = parseInt(gid, 10);

                    if (gid !== 0) {
                        obj = {
                            tile: {
                                x: x,
                                y: y,
                                id: gid - 1
                            }
                        };
                        obj.zIndex = (x + y * this.map.x) + layerid * this.map.x * this.map.y;
                        this.layers[layerid].raw.push(obj);
                    }
                    gid = '';
                } else {
                    gid += data[i];
                }
            }
        },
        /**
         * @member TMX
         * @private
         */
        __ready: function () {
            this.__optimizeLayers();
            this.ready = true;
            this.emit("ready", [this]);
        },
        get_tileset_from_gid: function (gid) {
            var i,
                max = this.tilesets.length;

            for (i = 0; i < max; ++i) {
                if (gid < this.tilesets[i].firstgid) {
                    return this.tilesets[i - 1];
                }
            }
            return this.tilesets[this.tilesets.length - 1];
        },
        /**
         * @member TMX
         * @private
         */
        __optimizeLayers: function () {
            __info("[TMX] optimizing layers");

            // per layer!
            var i,
                max = this.layers.length,
                j,
                jmax,
                tile,
                tileset,
                gid,
                obj;

            for (i = 0; i < max; ++i) {
                __info("[TMX] post process layer: " + i);
                switch (this.layers[i].type) {
                case 'tiles':
                    jmax = this.layers[i].raw.length;

                    for (j = 0; j < jmax; ++j) {
                        // TODO merge all structure in one!
                        tile = this.layers[i].raw[j];

                        tileset = this.get_tileset_from_gid(tile.tile.id);

                        gid = tile.tile.id -= tileset.firstgid;
                        tile.image = tileset.image;
                        tile.x = gid % tileset.x;
                        tile.y = Math.floor(gid / tileset.x);
                        tile.position = this.getScreenPosition(tileset, tile.tile.x, tile.tile.y, 0);

                        this.layers[i].tiles.push([
                            tileset.image,
                            tile.x * tileset.tilewidth,
                            tile.y * tileset.tileheight,
                            tileset.tilewidth,
                            tileset.tileheight,
                            tile.position.x,
                            tile.position.y,
                            tileset.tilewidth,
                            tileset.tileheight
                        ]);
                    }
                    break;
                case 'objects':
                    jmax = this.layers[i].raw.length;

                    for (j = 0; j < jmax; ++j) {
                        obj = this.layers[i].raw[j];
                        tileset = this.get_tileset_from_gid(obj.id);

                        this.layers[i].tiles.push([tileset.image, obj.x * tileset.tilewidth, obj.y * tileset.tileheight, tileset.tilewidth, tileset.tileheight, obj.position.x, obj.position.y, tileset.tilewidth, tileset.tileheight]);

                        this.layers[i].objects.push(obj);

                    }
                    break;
                }
            }
            this.emit("complete");
        },
        /**
         * @TODO user layers no layersTiles
         *
         * @member TMX
         * @param Number x in local coords!!
         * @param Number y in local coords!!
         * @param Boolean return_all returns all tiles, false if you want the highest one
         * @private
         */
        getTiles: function (x, y, return_all) {
            return_all = return_all || false;
            var out = [],
                i,
                j = 0,
                jmax = 0,
                raw = 0;

            for (i = this.layers.length - 1; i > -1; --i) {
                jmax = this.layers[i].raw.length;
                raw = this.layers[i].raw;

                for (j = 0; j < jmax; ++j) {
                    if (raw[j].tile.x === x && raw[j].tile.y === y) {
                        if (!return_all) {
                            return [raw[j]];
                        }

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
         * @params Number elapsed_time
         */
        draw: function (ctx, elapsed_time) {
            if (this.ready === false) {
                return;
            }
            //ctx.globalAlpha = 0.25;

            var i,
                max = this.layers.length,
                j,
                jmax,
                tile;

            for (i = 0; i < max; ++i) {

                if (this.layers[i].show === false) {
                    continue;
                }

                jmax = this.layers[i].tiles.length;

                for (j = 0; j < jmax; ++j) {
                    tile = this.layers[i].tiles[j];

                    // if (!win.isQuadVisible(
                    // tile[5] + pos.x, tile[6] + pos.y,
                    // tile[7], tile[8], j)) {
                    // continue;
                    // }
                    if (tile[0].surface.__ready) {
                        ctx.drawImage(tile[0].surface, tile[1], tile[2], tile[3], tile[4], tile[5], tile[6], tile[7], tile[8]);
                    }

                }
            }
            this.emit("afterframe", [this, ctx, elapsed_time]);
            //ctx.globalAlpha = 1;
        }
    });

    exports.TMX = TMX;

}("undefined" === typeof module ? window.Radamn : module.exports, "undefined" === typeof module));