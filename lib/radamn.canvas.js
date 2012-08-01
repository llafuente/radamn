(function (exports, browser) {
    if (browser) {
        return ;
    }

    var Class = browser ? $.Class : require("node-class").Class,
        Events = browser ? $.Events : require("node-class").Events,
        typeOf = browser ? $.typeof : require("node-class").typeof,
        __debug = browser ? $.debug : require("node-class").debug,
        __verbose = browser ? $.verbose : require("node-class").verbose,
        /**
         * parsed from: http://www.w3schools.com/html/html_colornames.asp
         * @ignore
         */
        color_name_to_hex = {"aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff", "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgrey": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkslategrey": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dimgrey": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "grey": "#808080", "green": "#008000", "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred": "", "indigo": "", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgray": "#d3d3d3", "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightslategrey": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "slategrey": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4", "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"},
        CanvasRenderingContext2D,
        Canvas;

    /**
     * @class CanvasRenderingContext2D
     */
    CanvasRenderingContext2D = new Class("CanvasRenderingContext2D", /** @lends Canvas.prototype */ {
        /**
         * Put here all the nice names vs ttf fonts location in your proyect.
         * Work around the for the Canvas API full compat
         * @member CanvasRenderingContext2D
         * @private
         */
        __fonts: {
            "Jura" : "./resources/fonts/Jura-DemiBold.ttf",
            "Arial" : "./resources/fonts/arial.ttf"
        },
        /**
         * @member CanvasRenderingContext2D
         * @private
         */
        __window : null,
        /**
         * @member CanvasRenderingContext2D
         * @private
         */
        __paths: [],
        /**
         * @member CanvasRenderingContext2D
         * @private
         */
        __path: [],
        /**
         * @member CanvasRenderingContext2D
         * @private
         */
        __current_position: null,
        /**
         * internal pointer from cland, null until multi screen support
         * @member CanvasRenderingContext2D
         * @private
         * @type OpenGLContexPtr
         */
        pointer: null,
        /**
         * <p>The style must be a string containing a CSS color</p>
         * @TODO hsl support
         * @member CanvasRenderingContext2D
         * @type Number color
         */
        strokeStyle: "#000000",
        /**
         * <p>The style must be a string containing a CSS color</p>
         * <p>CanvasGradient or CanvasPattern object are not supported and not in the todo list either. Invalid values could lead to segfault.</p>
         * @TODO hsl support
         * @member CanvasRenderingContext2D
         * @type Number color
         */
        fillStyle: "#000000",
        /**
         * not supported
         * @member CanvasRenderingContext2D
         * @deprecated
         * @type Number X offset
         */
        shadowOffsetX: 0,
        /**
         * not supported
         * @member CanvasRenderingContext2D
         * @deprecated
         * @type Number Y offset
         */
        shadowOffsetY: 0,
        /**
         * not supported
         * @member CanvasRenderingContext2D
         * @deprecated
         * @type Number Blur amount
         */
        shadowBlur: 0,
        /**
         * not supported
         * @member CanvasRenderingContext2D
         * @deprecated
         * @type {String} ?
         */
        shadowColor: 'transparent black',
        /**
         * Line width
         * @member CanvasRenderingContext2D
         * @type Number
         */
        lineWidth: 1,
        /**
         * Set the composite operation
         * @see RadamnDefines
         * @see RadamnBlendings
         * @member CanvasRenderingContext2D
         * @deprecated
         * @type {String}
         */
        globalCompositeOperation: "source-over",
        /**
         * @member CanvasRenderingContext2D
         * @type {String} example: "12pt Arial"
         */
        font: null,
        //
        //
        /**
         * not supported, maybe never.
         * @member CanvasRenderingContext2D
         * @type {String} valid: start, end, left, right, and center
         */
        textAlign: 'start',
        /**
         * not supported, maybe never.
         * @member CanvasRenderingContext2D
         * @type {String} valid: start, end, left, right, and center
         */
        textBaseline: 'alphabetic',
        /**
         * references:
         * http://dminator.blogspot.com/2007/11/line-cap-calculation.html
         * @member CanvasRenderingContext2D
         * @type {String} [butt, round, square]
         */
        lineCap: 'butt', /* not supported yet */
        /**
         * @member CanvasRenderingContext2D
         * @type {String} [miter, bevel, round]
         */
        lineJoin: 'miter', /* not supported yet */
        /**
         * @member CanvasRenderingContext2D
         * @type Number
         */
        miterLimit: 10 /* not supported yet */
    });

    CanvasRenderingContext2D.implements({
        /**
         * parse font member and return a Font
         * @member CanvasRenderingContext2D
         * @private
         * @returns Font
         */
        __parseFont: function () {
            var cut,
                size,
                font_name;
            if (this.font === null) {
                throw new Error("set a font before!");
            }

            if (typeOf(this.font) == "string") {
                cut = this.font.indexOf(" ");
                if (cut === -1) {
                    throw new Error("font is not well defined, examples: 12px Jura");
                }

                size = parseInt(this.font.substring(0, cut), 10);
                font_name = this.font.substring(cut + 1);

                return Radamn.Assets.getFont(this.__fonts[font_name], size);
            }
            return this.font;
        },
        /**
         * parse fillStyle member and return a proper format to use in cland
         * @member CanvasRenderingContext2D
         * @private
         * @returns Font
         */
        __parseFillStyle: function () {
            var fs = this.fillStyle.toLowerCase();
            if (color_name_to_hex[fs] !== undefined) {
                return color_name_to_hex[fs];
            }
            return fs;
        },
        /**
         * fill the given text in the given position
         * due a "opengl/ttf special behaviour" remember it use the direct method in the font.fill
         * @member CanvasRenderingContext2D
         * @see Font#fill
         */
        fillText: function (text, x, y) { // [, maxWidth ] ignored!
            var font = this.__parseFont();

            font.fill(this, text, this.__parseFillStyle(), x, y);
        },
        /**
         * fill(no stroke yet) the given text in the given position
         * due a "opengl/ttf special behaviour" remember it use the direct method in the font.fill
         * @member CanvasRenderingContext2D
         * @see Font.fill
         */
        strokeText: function (text, x, y) { // [, maxWidth ] ignored!
            this.fillText(text, x, y);
        },
        /**
         *
         */
        /**
         * get the text measure, differs from the Canvas official because it add height
         * @member CanvasRenderingContext2D
         * @returns Object {width: X, height: Y}
         */
        measureText: function (text) {
            var font = this.__parseFont();

            return font.measureText(text);
        },
        /**
         * Do not create new instances of this class use Window.getContext()
         * @member CanvasRenderingContext2D
         * @constructs
         * @private
         */
        __construct: function (pointer, window) {
            this.pointer = pointer;
            this.__window = window;
        },
        /**
         * get attached window
         * @member CanvasRenderingContext2D
         * @returns Window
         */
        getWindow: function () {
            return this.__window;
        },
        /**
         * not supported atm!
         * this will batch and image to the specified quads optimizing the painting process!
         * @todo do it!
         * @member CanvasRenderingContext2D
         * @returns Window
         */
        drawImages: function (image, quads) {
            CRadamn.Image.drawImageQuads(image.surface, this.pointer, quads);
        },
        /**
         * Draws the given image onto the canvas.
         * <p>drawImage(image, dx, dy)</p>
         * <p>drawImage(image, dx, dy, dw, dh)</p>
         * <p>drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)</p>
         * <p><img src="http://images.whatwg.org/drawImage.png" /></p>
         * @member CanvasRenderingContext2D
         * @returns Boolean
         */
        drawImage: function () {
            switch (arguments.length) {
            case 3:
                // Object image, float dx, float dy,
                return CRadamn.Image.draw(arguments[0], this.globalCompositeOperation, arguments[1], arguments[2]);
            case 5:
                // <image>, <number>, <number>, <number>, <number>
                // Object image, float dx, float dy, float dw, float dh
                return CRadamn.Image.draw(arguments[0], this.globalCompositeOperation, arguments[1], arguments[2], arguments[3], arguments[4]);
            case 9:
                // <image>, <number>, <number>, <number>, <number>
                // Object image, float sx, float sy, float sw, float sh, float dx, float dy, float dw, float dh
               // __debug(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                return CRadamn.Image.draw(arguments[0], this.globalCompositeOperation,
                    arguments[1], arguments[2], arguments[3], arguments[4],
                    arguments[5], arguments[6], arguments[7], arguments[8]);
            }
        },
        /**
         * <p>Get the given primitive path that can be stroked/filled</p>
         * @member CanvasRenderingContext2D
         * @param Primitive
         * @returns Array
         * @private
         */
        __getPrimitivePath: function (prim) {
            var path = [],
                i,
                max;

            switch (typeOf(prim)) {
            case 'rectangle':
                path.push([prim.v1.x, prim.v1.y]);
                path.push([prim.v2.x, prim.v1.y]);
                path.push([prim.v2.x, prim.v2.y]);
                path.push([prim.v1.x, prim.v2.y]);
                path.push([prim.v1.x, prim.v1.y]);
                break;
            case 'circle':
                max = Math.PI * 2;

                for (i = 0; i < max; i += 0.2) {
                    path.push([prim.c.x + Math.sin(i) * prim.r, prim.c.y + Math.cos(i) * prim.r]);
                }
                path.push([prim.c.x + Math.sin(max) * prim.r, prim.c.y + Math.cos(max) * prim.r]);
                break;
            case 'line2':
                break;
            case 'segment2':
                path.push([prim.x1, prim.y1]);
                path.push([prim.x2, prim.y2]);
                break;
            case 'vec2':
                break;
            case 'polygon':
                return prim.points;
            }

            return path;
        },
        /**
         * stroke a primitive with the given options that override the canvas properties
         * @member CanvasRenderingContext2D
         * @param Primitive Circle, Rectangle, Vec2, Polygon, Line2
         */
        strokePrimitive: function (prim, options) {
            options = options || {};
            var path = this.__getPrimitivePath(prim);

            CRadamn.GL.stroke(path, options.lineWidth || this.lineWidth, options.color || this.strokeStyle);

            return this;
        },
        /**
         * fill a primitive with the given options that override the canvas properties
         * @member CanvasRenderingContext2D
         * @param Primitive Circle, Rectangle, Vec2, Polygon, Line2
         */
        fillPrimitive: function (prim, options) {
            options = options || {};
            var path = this.__getPrimitivePath(prim);

            CRadamn.GL.fill(path, options.color || this.__parseFillStyle());

            return this;
        },
        /**
         * move the pointer to
         * @member CanvasRenderingContext2D
         */
        moveTo: function (x, y) {
            // queue the current path
            if (this.__path.length > 0) {
                this.__paths.push(this.__path);
                this.__path = [];
            }
            // this is the current position
            this.__current_position = new Vec2(x, y);
        },
        __push_current_position: function () {
            if (this.__current_position !== null) {
                this.__path.push(this.__current_position);
                this.__current_position = null;
            }
        },
        __get_current_position: function (if_not_set) {
            return this.__current_position === null ? if_not_set || new Vec2(0, 0) : this.__current_position;
        },
        /**
         * do a line from the actual point to x,y
         * @TODO check the first position, I think it must be added!
         * @member CanvasRenderingContext2D
         * @param Number x
         * @param Number y
         */
        lineTo: function (x, y) {
            this.__push_current_position();
            this.__path.push([x, y]);
        },
        /**
         * @todo optimize
         * @todo anticlockwise support
         * @member CanvasRenderingContext2D
         * @param Number x position
         * @param Number y position
         * @param Number radius
         * @param Number startAngle in radians
         * @param Number endAngle in radians
         * @param Number anticlockwise not supported atm!
         */
        arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
            anticlockwise = anticlockwise || false;

            // normalize radian angle
            //startAngle = Math.PI2 % startAngle;
            //endAngle = Math.PI2 % endAngle;

            startAngle -= Math.PIDIV2;
            endAngle -= Math.PIDIV2;

            var point_resolution = Math.min(Math.PI / 180, 5 / radius),
                tmp;
            if (anticlockwise) {
                point_resolution = -point_resolution;
                //startAngle+=Math.PI2;
                tmp = startAngle;
                startAngle = endAngle;
                endAngle = tmp;

                for (startAngle; startAngle > endAngle; startAngle += point_resolution) {
                    this.__path.push([x + Math.sin(startAngle) * radius, y + Math.cos(startAngle) * radius]);
                }
                if (startAngle !== endAngle) {
                    this.__path.push([x + Math.sin(endAngle) * radius, y + Math.cos(endAngle) * radius]);
                }
            } else {
                for (startAngle; startAngle < endAngle; startAngle += point_resolution) {
                    this.__path.push([x + Math.sin(startAngle) * radius, y + Math.cos(startAngle) * radius]);
                }
                if (startAngle !== endAngle) {
                    this.__path.push([x + Math.sin(endAngle) * radius, y + Math.cos(endAngle) * radius]);
                }
            }

            return true;
        },
        // Implementation courtesy of Lennart Kudling
        /**
         * Adds an arcTo point (x0,y0) to (x1,y1) with the given radius.

         * @member CanvasRenderingContext2D
         */
        arcTo: function (x1, y1, x2, y2, radius) {
            // Current path point

            var p0 = this.__get_current_position(false),
                p1 = new Vec2(x1, y1),
                p2 = new Vec2(x2, y2),

                p1p0,
                p1p2,
                p1p0_length,
                p1p2_length,
                cos_phi,

                max_length = 65535,
                factor_max,
                ep,

                tangent,
                factor_p1p0,
                t_p1p0,
                orth_p1p0,
                orth_p1p0_length,
                factor_ra,
                cos_alpha,
                p,
                t_p1p2,
                sa,
                factor_p1p2,
                orth_p1p2,
                orth_p1p2_length,
                ea,
                anticlockwise = false;

            if (p0 === false) {
                p0 = new Vec2(x1, y1);
            }

            if (
                (p1.x === p0.x && p1.y === p0.y)
                    || (p1.x === p2.x && p1.y === p2.y)
                    || radius === 0.0
            ) {
                this.lineTo(p1.x, p1.y);

                return undefined;
            }

            p1p0 = new Vec2((p0.x - p1.x), (p0.y - p1.y));
            p1p2 = new Vec2((p2.x - p1.x), (p2.y - p1.y));
            p1p0_length = Math.sqrt(p1p0.x * p1p0.x + p1p0.y * p1p0.y);
            p1p2_length = Math.sqrt(p1p2.x * p1p2.x + p1p2.y * p1p2.y);

            cos_phi = (p1p0.x * p1p2.x + p1p0.y * p1p2.y) / (p1p0_length * p1p2_length);
            // all points on a line logic
            if (-1 === cos_phi) {
                this.lineTo(p1.x, p1.y);

                return undefined;
            }

            if (1 === cos_phi) {
                // add infinite far away point
                factor_max = max_length / p1p0_length;
                ep = new Vec2((p0.x + factor_max * p1p0.x), (p0.y + factor_max * p1p0.y));
                this.lineTo(ep.x, ep.y);

                return undefined;
            }

            tangent = radius / Math.tan(Math.acos(cos_phi) / 2);
            factor_p1p0 = tangent / p1p0_length;
            t_p1p0 = new Vec2((p1.x + factor_p1p0 * p1p0.x), (p1.y + factor_p1p0 * p1p0.y));

            orth_p1p0 = new Vec2(p1p0.y, -p1p0.x);
            orth_p1p0_length = Math.sqrt(orth_p1p0.x * orth_p1p0.x + orth_p1p0.y * orth_p1p0.y);
            factor_ra = radius / orth_p1p0_length;

            cos_alpha = (orth_p1p0.x * p1p2.x + orth_p1p0.y * p1p2.y) / (orth_p1p0_length * p1p2_length);
            if (cos_alpha < 0.0) {
                orth_p1p0 = new Vec2(-orth_p1p0.x, -orth_p1p0.y);
            }

            p = new Vec2((t_p1p0.x + factor_ra * orth_p1p0.x), (t_p1p0.y + factor_ra * orth_p1p0.y));

            orth_p1p0 = new Vec2(-orth_p1p0.x, -orth_p1p0.y);
            sa = Math.acos(orth_p1p0.x / orth_p1p0_length);
            if (orth_p1p0.y < 0.0) {
                sa = 2 * Math.PI - sa;
            }

            factor_p1p2 = tangent / p1p2_length;
            t_p1p2 = new Vec2((p1.x + factor_p1p2 * p1p2.x), (p1.y + factor_p1p2 * p1p2.y));
            orth_p1p2 = new Vec2((t_p1p2.x - p.x), (t_p1p2.y - p.y));
            orth_p1p2_length = Math.sqrt(orth_p1p2.x * orth_p1p2.x + orth_p1p2.y * orth_p1p2.y);
            ea = Math.acos(orth_p1p2.x / orth_p1p2_length);

            if (orth_p1p2.y < 0) {
                ea = 2 * Math.PI - ea;
            }
            if ((sa > ea) && ((sa - ea) < Math.PI)) {
                anticlockwise = true;
            }
            if ((sa < ea) && ((ea - sa) > Math.PI)) {
                anticlockwise = true;
            }

            this.lineTo(t_p1p0.x, t_p1p0.y);

            this.arcTo(p.x, p.y, radius, sa, ea, !(anticlockwise && Math.PI * 2 !== radius));

            return undefined;
        },
        bezierCurveTo: function (cp1x, cp1y, cp2x, cp2y, x, y) {
            __debug("bezierCurveTo", arguments);
            var b = new Beizer(),
                k = 0.05,
                t,
                max = 1 + k,
                point;

            if (this.__current_position === null) {
                b.setCubic(cp1x, cp1y, cp1x, cp1y, cp2x, cp2y, x, y);
            } else {
                b.setCubic(this.__current_position.x, this.__current_position.y, cp1x, cp1y, cp2x, cp2y, x, y);
            }

            for (t = k; t <= max; t += k) {
                point = b.get(t);
                this.lineTo(point.x, point.y);
            }
        },
        /**
         * start the path
         * @member CanvasRenderingContext2D
         */
        beginPath: function () {
            this.__current_position = null;
            this.__path = [];
            this.__paths = [];

            return this;
        },
        /**
         * close the path
         * @member CanvasRenderingContext2D
         */
        closePath: function () {
            this.__path.push(this.__paths.length > 0 ? this.__paths[0][0] : this.__path[0]);
            return true;
        },
        /**
         * translate the canvas
         * @member CanvasRenderingContext2D
         */
        translate: function (x, y, z) {
            z = z || 0;
            y = y || 0;
            x = x || 0;

            CRadamn.GL.translate(x, y, z);
        },
        /**
         * rotate the canvas
         * @member CanvasRenderingContext2D
         */
        rotate: function (angle) {
            CRadamn.GL.rotate(angle);
        },
        /**
         * scale the canvas
         * @member CanvasRenderingContext2D
         */
        scale: function (x, y) {
            CRadamn.GL.scale(x, y);
        },
        /**
         * multiply the current Tansformation Matrix with the given
         * @member CanvasRenderingContext2D
         */
        transform: CRadamn.GL.transform,
        /**
         * set the current transformation matrix with the given
         * @member CanvasRenderingContext2D
         */
        setTransform: CRadamn.GL.setTransform,
        /**
         * save the current state
         * @member CanvasRenderingContext2D
         */
        save: CRadamn.GL.save,
        /**
         * restore the last saved state
         * @member CanvasRenderingContext2D
         */
        restore: CRadamn.GL.restore,
        /**
         * clear the canvas to background color
         * @member CanvasRenderingContext2D
         */
        clear: CRadamn.GL.clear,
        /**
         * flip the buffers, used internally
         * @private
         * @member CanvasRenderingContext2D
         */
        __flip: CRadamn.GL.flipBuffers,
        /**
         * check if the path to be stroked/filled is visible
         * @todo also check the transformation matrix
         * @private
         * @member CanvasRenderingContext2D
         */
        __isClosedPathVisible: function (selected_path) {
            return true;
            var i,
                win = this.getWindow(),
                path = this.__closedPaths[selected_path],
                max = path.length;

            //if everything is not visible, dont render!
            for (i = 0; i < max; ++i) {
                if (win.isPointVisible(path[i][0], path[i][1])) {
                    return true;
                }
            }
            return false;
        },
        /**
         * stroke the path
         * @member CanvasRenderingContext2D
         * @returns Boolean with the result
         */
        stroke: function () {
            if (this.__paths.length > 0) {
                var i,
                    max = this.__paths.length;
                for (i = 0; i < max; ++i) {
                    CRadamn.GL.stroke(this.__paths[i], this.lineWidth, this.strokeStyle);
                }
            }

            if (this.__isClosedPathVisible()) {
                CRadamn.GL.stroke(this.__path, this.lineWidth, this.strokeStyle);
            }
            return undefined;
        },
        /**
         * fill the given rectangle
         * @member CanvasRenderingContext2D
         * @returns Boolean allways true
         */
        fillRect: function (x, y, w, h) {
            CRadamn.GL.fill([
                [x, y],
                [x + w, y],
                [x + w, y + h],
                [x, y + h]
            ], this.__parseFillStyle());
            return true;
        },
        /**
         * fill the CLOSED path!, repeat, CLOSE Before fill
         * @member CanvasRenderingContext2D
         * @returns Boolean with the result
         */
        fill: function () {
            if (this.__paths.length > 0) {
                var i,
                    max = this.__paths.length;
                for (i = 0; i < max; ++i) {
                    CRadamn.GL.fill(this.__paths[i], this.__parseFillStyle());
                }
            }

            if (this.__isClosedPathVisible()) {
                CRadamn.GL.fill(this.__path, this.__parseFillStyle());
            }
            return undefined;
        }
    });

    /**
     * @class Canvas
     */
    Canvas = new Class("DomCanvas", /** @lends Canvas.prototype */ {
        __ctx : null
    });

    Canvas.implements({
        /**
         * @member Canvas
         * @constructor
         */
        __construct: function (pointer, window) {
            this.__ctx = new CanvasRenderingContext2D(pointer, window);
        },
        getContext: function (ignore) {
            return this.__ctx;
        }
    });

    exports.CanvasRenderingContext2D = CanvasRenderingContext2D;
    exports.Canvas = Canvas;

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));