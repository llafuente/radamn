/**
 * @class Canvas
 */
var Canvas = new Class(
/** @lends Canvas.prototype */
{
	/**
	 * put here all the nice names vs ttf fonts location in your proyect
	 * considered as an extension of canvas API :)
	 * @member Canvas
	 * @private
	 */
	__fonts: {
		"Jura" : "./resources/fonts/Jura-DemiBold.ttf",
		"Arial" : "./resources/fonts/arial.ttf",
	},
	/**
	 * @member Canvas
	 * @private
	 */
    __window : null,
	/**
	 * internal pointer (cland)
	 * @member Canvas
	 * @private
	 */
    pointer: null,
    /**
	 * @member Canvas
     * @type {Number} color
     */
    strokeStyle: "#000000",
    /**
	 * @member Canvas
     * @type {Number} color
     */
    fillStyle: "#000000",
    /**
	 * not supported
	 * @member Canvas
	 * @deprecated
     * @type {Number} X offset
     */
    shadowOffsetX: 0,
    /**
	 * not supported
	 * @member Canvas
	 * @deprecated
     * @type {Number} Y offset
     */
    shadowOffsetY: 0,
    /**
	 * not supported
	 * @member Canvas
	 * @deprecated
     * @type {Number} Blur amount
     */
    shadowBlur: 0,
    /**
	 * not supported
	 * @member Canvas
	 * @deprecated
     * @type {String} ?
     */
    shadowColor: 'transparent black',
    /**
	 * Line width
	 * @member Canvas
     * @type {Number}
     */
    lineWidth: 1,
    /**
	 * Set the composite operation
	 * @see RadamnDefines
	 * @see RadamnBlendings
	 * @member Canvas
	 * @deprecated
     * @type {String}
     */
	globalCompositeOperation: "source-over",
	/**
	 * @member Canvas
	 * @type {String} example: "12pt Arial"
	 */
	font: null,
	// 
	// 
	/**
	 * not supported, maybe never.
	 * @member Canvas
	 * @type {String} valid: start, end, left, right, and center
	 */
	textAlign: 'start',
	/**
	 * not supported, maybe never.
	 * @member Canvas
	 * @type {String} valid: start, end, left, right, and center
	 */
	textBaseline: 'alphabetic',
	/**
	 * parse font member and return a Font
	 * @member Canvas
	 * @private
	 * @returns Font
	 */
	__parseFont: function() {
		if(this.font === null ) throw new Exception("set a font before!");
		if(typeOf(this.font) == "string") {

			var cut = this.font.indexOf(" ");
			if(cut === -1)  throw new Exception("font is not well defined, examples: 12px Jura");

			var size = parseInt(this.font.substring(0, cut));
			var font_name = this.font.substring(cut+1);

			return Radamn.Assets.getFont(this.__fonts[font_name], size);
		}
		return this.font;
	},
	/**
	 * fill the given text in the given position
	 * due a "opengl/ttf special behaviour" remember it use the direct method in the font.write
	 * @member Canvas
	 * @see Font.write
	 */
	fillText: function(text, x, y) { // [, maxWidth ] ignored!
		var font = this.__parseFont();

		font.write(this,text, this.fillStyle, x, y);
	},
	/**
	 * fill(no stroke yet) the given text in the given position
	 * due a "opengl/ttf special behaviour" remember it use the direct method in the font.write
	 * @member Canvas
	 * @see Font.write
	 */
	strokeText: function(text, x, y) { // [, maxWidth ] ignored!
		this.fillText(text, x, y);
	},
	/**
	 *  
	 */
	/**
	 * get the text measure, differs from the Canvas official because it add height
	 * @member Canvas
	 * @returns Object {width: X, height: Y}
	 */
	measureText: function(text) {
		var font = this.__parseFont();

		return font.measureText(text);
	},
	/**
	 * @member Canvas
	 * @private
	 */
    __paths: [],
    /**
     * references:
     * http://dminator.blogspot.com/2007/11/line-cap-calculation.html
	 * @member Canvas
     * @type {String} [butt, round, square]
     */
    lineCap: 'butt', /* not supported yet */
    /**
	 * @member Canvas
     * @type {String} [miter, bevel, round]
     */
    lineJoin: 'miter', /* not supported yet */
    /**
	 * @member Canvas
     * @type {Number}
     */
    miterLimit: 10, /* not supported yet */
    /**
	 * Do not new this class use Window.getCanvas()
	 * @member Canvas
     * @constructs
	 * @private
     */
    initialize: function(pointer, window) {
        this.pointer = pointer;
        this.__window = window;
    },
    /**
	 * get attached window
	 * @member Canvas
	 * @returns Window
     */
    getWindow: function() {
        return this.__window;
    },
    /**
	 * not supported atm!
	 * this will batch and image to the specified quads optimizing the painting process!
	 * @todo do it!
	 * @member Canvas
	 * @returns Window
     */
    drawImages: function(image, quads) {
        CRadamn.Image.drawImageQuads(image.pointer, this.pointer, quads);
    },
    /**
	 * Canvas compatible API
	 * @member Canvas
	 * @returns {Boolean}
     */
    drawImage: function() {
        switch(arguments.length) {
        case 3:
            // Object image, float dx, float dy,
            return CRadamn.Image.draw(arguments[0].pointer, this.globalCompositeOperation, arguments[1], arguments[2]);
            break;
        case 5:
            // <image>, <number>, <number>, <number>, <number>
            // Object image, float dx, float dy, float dw, float dh
            return CRadamn.Image.draw(arguments[0].pointer, this.globalCompositeOperation, arguments[1], arguments[2], arguments[3], arguments[4]);
            break;
        case 9:
            // <image>, <number>, <number>, <number>, <number>
            // Object image, float sx, float sy, float sw, float sh, float dx, float dy, float dw, float dh
			// console.log(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
            return CRadamn.Image.draw(arguments[0].pointer, this.globalCompositeOperation
                    , arguments[1], arguments[2], arguments[3], arguments[4]
                    , arguments[5], arguments[6], arguments[7], arguments[8]);
            break;
        }
    },
	/**
	 * @member Canvas
	 * @private
	 */
	__getPrimitivePath: function(prim) {
		var path = [];
		switch(typeOf(prim)) {
			case 'rectangle' :
				path.push([prim.v1.x, prim.v1.y]);
				path.push([prim.v2.x, prim.v1.y]);
				path.push([prim.v2.x, prim.v2.y]);
				path.push([prim.v1.x, prim.v2.y]);
				path.push([prim.v1.x, prim.v1.y]);
				break;
			case 'circle' :
					i=0,
					max = Math.PI * 2;
				for (; i < max; i+=0.2) {
					path.push([prim.c.x + Math.sin(i) * prim.r, prim.c.y + Math.cos(i) * prim.r]);
				}
				path.push([prim.c.x + Math.sin(max) * prim.r, prim.c.y + Math.cos(max) * prim.r]);
				break;
			case 'line2' :
				break;
			case 'segment2' :
				path.push([prim.x1, prim.y1]);
				path.push([prim.x2, prim.y2]);
				break;
			case 'vec2' :
				break;
			case 'polygon' :
				return prim.points;
				break;
		}

		return path;
	},
	/**
	 * stroke a primitive with the given options that override the canvas properties
	 * @member Canvas
	 * @param {Primitive} Circle, Rectangle, Vec2, Polygon, Line2
	 */
	strokePrimitive: function(prim, options) {
		options = options || {};
		var path = this.__getPrimitivePath(prim);

		CRadamn.Window.stroke(path, options.lineWidth || this.lineWidth, options.color || this.strokeStyle);

		return this;
	},
	/**
	 * fill a primitive with the given options that override the canvas properties
	 * @member Canvas
	 * @param {Primitive} Circle, Rectangle, Vec2, Polygon, Line2
	 */
	fillPrimitive: function(prim, options) {
		options = options || {};
		var path = this.__getPrimitivePath(prim);

		CRadamn.Window.fill(path, options.color || this.fillStyle);

		return this;
	},
	/**
	 * prepare the path
     * @member Canvas
     */
	__initPath: function() {
		if(this.__paths.length === 0)
			//this.moveTo(0,0);
			this.__paths.push([]);
	},
	/**
	 * move the pointer to
	 * @member Canvas
	 */
	moveTo: function(x,y) {
		this.__paths.push([]);
		//this.__paths[ this.__paths.length -1 ].push([x,y]);
	},
    /**
	 * do a line from the actual point to x,y
	 * TODO check the first position, I think it must be added!
     * @member Canvas
     * @param {Number} x
     * @param {Number} y
     */
    lineTo: function(x, y) {
		this.__initPath();

        this.__paths[ this.__paths.length -1 ].push([x,y]);
    },
	/**
	 * @member Canvas
	 * @todo optimize
	 * @todo anticlockwise
	 * @param {Number} x position
	 * @param {Number} y position
	 * @param {Number} radius 
	 * @param {Number} startAngle in radians
	 * @param {Number} endAngle in radians
	 * @param {Number} anticlockwise not supported atm!
	 */
    arcd: function(x, y, radius, startAngle, endAngle, anticlockwise ) {
		this.__initPath();

        for (; startAngle < endAngle; startAngle+=0.2) {
            this.__paths[ this.__paths.length -1 ].push([x + Math.sin(startAngle) * radius, y + Math.cos(startAngle) * radius]);
        }
        return true;
    },
	/**
	 * @todo optimize
	 * @todo anticlockwise
	 * @member Canvas
	 * @param {Number} x position
	 * @param {Number} y position
	 * @param {Number} radius 
	 * @param {Number} startAngle in radians
	 * @param {Number} endAngle in radians
	 * @param {Number} anticlockwise not supported atm!
	 */
    arc: function(x, y, radius, startAngle, endAngle, anticlockwise ) {
		this.__initPath();

        for (; startAngle < endAngle; startAngle+=0.2) {
            this.__paths[ this.__paths.length -1 ].push([x + Math.sin(startAngle) * radius, y + Math.cos(startAngle ) * radius]);
        }
        return true;
    },
	/**
	 * not supported atm!
	 * @member Canvas
	 */
    arcTo: function(x1, y2, x2, y2, radius) {
		throw new Error("not supported atm!");
    },
	/**
	 * start the path
	 * @member Canvas
	 */
    beginPath: function() {
        return this.__paths.length === 0;
    },
	/**
	 * close the path
	 * @member Canvas
	 */
    closePath: function() {
        this.__closedPaths = this.__paths;
        this.__paths = [];
        return true;
    },
	/**
	 * translate the canvas
	 * @member Canvas
	 */
    translate: function(x,y, z) {
        z = z || 0;
        y = y || 0;
        x = x || 0;

        CRadamn.Window.translate(x, y, z)
    },
	/**
	 * rotate the canvas
	 * @member Canvas
	 */
    rotate: function(angle) {
        CRadamn.Window.rotate(angle);
    },
	/**
	 * scale the canvas
	 * @member Canvas
	 */
    scale: function(x, y) {
        CRadamn.Window.scale(x, y);
    },
	/**
	 * multiply the current Tansformation Matrix with the given
	 * @member Canvas
	 */
    transform: function() {
        CRadamn.Window.transform.apply(null,arguments);
    },
	/**
	 * set the current transformation matrix with the given
	 * @member Canvas
	 */
    setTransform: function() {
        CRadamn.Window.setTransform.apply(null,arguments);
    },
	/**
	 * save the current state
	 * @member Canvas
	 */
    save: function() {
        CRadamn.Window.save();
    },
	/**
	 * restore the last saved state
	 * @member Canvas
	 */
    restore: function() {
        CRadamn.Window.restore();
    },
	/**
	 * clear the canvas
	 * @member Canvas
	 */
    clear: function() {
        CRadamn.Window.clear();
    },
	/**
	 * flip the buffers, used internally
	 * @private
	 * @member Canvas
	 */
    __flip: function() {
        CRadamn.Window.flip();
    },
	/**
	 * check if the path to be stroked/filled is visible
	 * @todo also check the transformation matrix
	 * @private
	 * @member Canvas
	 */
	__isClosedPathVisible: function(selected_path) {
			var i=0,
			win = this.getWindow(),
			path = this.__closedPaths[selected_path];
			max = path.length;

		//if everything is not visible, dont render!
		for(;i<max;++i) {
			if(win.isPointVisible(path[i][0], path[i][1]) )  {
				return true;
			}
		}
		return false;
	},
	/**
	 * stroke the CLOSED path!, repeat, CLOSE Before stroke
	 * @member Canvas
	 * @returns {Boolean} with the result
	 */
    stroke: function() {
        if(this.__closedPaths.length > 0) {
			var i=0,
				max = this.__closedPaths.length,
				path = this.__closedPaths;

			for(;i<max;++i) {
				if(!this.__isClosedPathVisible(i)) continue;
				CRadamn.Window.stroke(path[i], this.lineWidth, this.strokeStyle);
			}

            return true;
        }
        return false;
    },
	/**
	 * fill the given rectangle
	 * @member Canvas
	 * @returns {Boolean} allways true
	 */
    fillRect: function(x,y,w,h) {
        CRadamn.Window.fill([
			[x, y],
			[x+w, y],
			[x+w, y+h],
			[x, y+h]
		], this.fillStyle);
        return true;
    },
	/**
	 * fill the CLOSED path!, repeat, CLOSE Before fill
	 * @member Canvas
	 * @returns {Boolean} with the result
	 */
    fill: function() {
        if(this.__closedPaths.length > 0) {
			var i=0,
				max = this.__closedPaths.length,
				path = this.__closedPaths;

			for(;i<max;++i) {
				if(!this.__isClosedPathVisible(i)) continue;
				CRadamn.Window.fill(path[i], this.fillStyle);
			}

            return true;
        }
        return false;
    }

});

module.exports.Canvas = Canvas;
