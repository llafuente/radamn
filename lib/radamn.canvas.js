/**
 * parsed from: http://www.w3schools.com/html/html_colornames.asp
 * @ignore
 */
var color_name_to_hex = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgrey":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkslategrey":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dimgrey":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","grey":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"","indigo":"","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgray":"#d3d3d3","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightslategrey":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","slategrey":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};


/**
 * @class Canvas
 */
var Canvas = new Class(
/** @lends Canvas.prototype */
{
	/**
	 * Put here all the nice names vs ttf fonts location in your proyect.
	 * Work around the for the Canvas API full compat
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
	 * internal pointer from cland, null until multi screen support
	 * @member Canvas
	 * @private
	 * @type OpenGLContexPtr
	 */
    pointer: null,
    /**
	 * <p>The style must be a string containing a CSS color</p>
	 * @TODO hsl support
	 * @member Canvas
     * @type {Number} color
     */
    strokeStyle: "#000000",
    /**
	 * <p>The style must be a string containing a CSS color</p>
	 * <p>CanvasGradient or CanvasPattern object are not supported and not in the todo list either. Invalid values could lead to segfault.</p>
	 * @TODO hsl support
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
	 * parse fillStyle member and return a proper format to use in cland
	 * @member Canvas
	 * @private
	 * @returns Font
	 */
	__parseFillStyle: function() {
		var fs = this.fillStyle.toLowerCase();
		if(color_name_to_hex[ fs ] !== undefined) {
			return color_name_to_hex[ fs ];
		}
		return fs;
	},
	/**
	 * fill the given text in the given position
	 * due a "opengl/ttf special behaviour" remember it use the direct method in the font.fill
	 * @member Canvas
	 * @see Font#fill
	 */
	fillText: function(text, x, y) { // [, maxWidth ] ignored!
		var font = this.__parseFont();

		font.fill(this,text, this.__parseFillStyle(), x, y);
	},
	/**
	 * fill(no stroke yet) the given text in the given position
	 * due a "opengl/ttf special behaviour" remember it use the direct method in the font.fill
	 * @member Canvas
	 * @see Font.fill
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
	 * Do not create new instances of this class use Window.getCanvas()
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
	 * Draws the given image onto the canvas.
	 * <p>drawImage(image, dx, dy)</p>
	 * <p>drawImage(image, dx, dy, dw, dh)</p>
	 * <p>drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)</p>
	 * <p><img src="http://images.whatwg.org/drawImage.png" /></p>
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
	 * <p>Get the given primitive path that can be stroked/filled</p>
	 * @member Canvas
	 * @param {Primitive}
	 * @returns {Array}
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

		CRadamn.Window.fill(path, options.color || this.__parseFillStyle());

		return this;
	},
	/**
	 * prepare the path
	 * @private
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
	 * @TODO check the first position, I think it must be added!
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
	 * @todo anticlockwise support
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
	 * @todo anticlockwise support
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
		], this.__parseFillStyle());
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
				CRadamn.Window.fill(path[i], this.__parseFillStyle());
			}

            return true;
        }
        return false;
    }

});

module.exports.Canvas = Canvas;
