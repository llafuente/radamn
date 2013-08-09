(function (exports, browser) {
    "use strict";

    var Class = browser ? NodeClass.Class : require("node-class").Class,
        Events = browser ? NodeClass.Events : require("node-class").Events,
        __typeof = browser ? NodeClass.Typeof : require("node-class").Typeof,
        Iterable = browser ? NodeClass.Iterable : require("node-class").Iterable,
        Assets;

    /**
      * @class Assets
     */
    Assets = new Class("RadamnAssets",
    /** @lends Assets.prototype */
    {
        /**
         * @member Assets
         * @type Hash
         */
        __images: null,
        /**
         * @member Assets
         * @type Hash
         */
        __fonts: null
    });

    Assets.Implements({
        /**
         * <p>Do not instance this class, use it directly</p>
         * <p><strong>Example</strong></p>
         * <blockquote>Radamn.Assets.getImage("./myimage.png");</blockquote>
         * @private
         * @member Assets
         * @constructor
         */
        __construct: function () {
            this.__images = new Iterable();
            this.__fonts = new Iterable();
        },
        /**
         * @member Assets
         */
        pushPath: function (path) {
            this.__pathlist.push(path);
        },
        /**
         * @member Assets
         * @param String path
         * @param Zip zip_file default:null
         * @returns Sprite
         */
        getSprite: function (path, zip_file) {

        },
        /**
         * @member Assets
         * @param String path
         * @param Zip zip_file default:null
         * @returns AnimationSheet
         */
        getAnimationSheet: function (path, zip_file) {

        },
        /**
         * Internal function to get the image from cland, this one dont have cache.
         * @TODO zip_file
         * @member Assets
         * @private
         * @param String path
         * @param Zip zip_file default:null
         * @param Boolean generate_mask default: false
         * @returns Image
         */
        __getImage: function (path, zip_file, generate_mask) {
            Radamn.debug("load:image - from file: ", arguments);

            zip_file = zip_file || null;
            generate_mask = generate_mask || false;

            var img = null;

            if ((img = this.__images.get(path)) !== null) {
                return img;
            }

            img = new Image();
            img.__ready = false;
            img.addEventListener("load", function () {
                img.__ready = true;
            }.bind(this));
            img.src = path;

            this.__images.set(path, img);

            return img;
        },
        /**
         * <p>Only PNG images are supported atm (@client).</p>
         * <p>Image are cached by path and destroy deletes the cache</p>
         * @TODO zip_file
         * @member Assets
         * @param String path
         * @param Zip zip_file default:null
         * @param Boolean generate_mask default: false
         * @returns Image
         */
        getImage: function (path, zip_file, generate_mask) {
            zip_file = zip_file || null;
            generate_mask = generate_mask || false;

            var image_pointer = this.__getImage(path, zip_file, generate_mask),
                image = new Radamn.Image({surface: image_pointer});

            if (image_pointer.__ready === true) {
                image.emit("complete", [image], 0);
            } else {
                image_pointer.onload = function () {
                    image_pointer.__ready = true;
                    image.emit("complete", [image]);
                };
            }

            return image;
        },
        /**
         * Experimental, Api not frozen...
         * @member Assets
         * @TODO zip_file
         * @param String path
         * @param String|Object path_to_cfg_or_object
         * @param Zip zip_file default:null
         * @returns Animation
         */
        getAnimation: function (path, path_to_cfg_or_object, zip_file) {
            zip_file = zip_file || null;

            var options = {};
            if (__typeof(path_to_cfg_or_object) == "string") {
                // TODO: get the file! and parse the JSON
            } else {
                options = path_to_cfg_or_object;
            }

            options.surface = this.__getImage(path, zip_file);

            return new Radamn.Animation(options.surface);
        },
        /**
         *
         * @TODO do it!
         * @member Assets
         * @param String path
         * @param Zip zip_file default:null
         * @returns Sound
         */
        getSound: function (path, zip_file) {

        },
        /**
         * <p>Internal method to get the font from cland</p>
         * @member Assets
         * @private
         * @param String path
         * @param Number path
         * @param Zip zip_file default:null
         * @returns Font
         */
        __getFont: function (path, size, zip_file) {
            Radamn.debug("load:font - from file: ", arguments);

            var font_pointer = null,
                key = path + ":" + size;

            if ((font_pointer = this.__fonts.get(key)) !== null) {
                return font_pointer;
            }

            font_pointer = CRadamn.Font.load(path, size);
            font_pointer.path = path;
            font_pointer.size = size;
            return font_pointer;
        },
        /**
         * <p>Only TTF fonts are supported atm.</p>
         * <p>Fonts are cached by path and destroy, delete the cache</p>
         * @member Assets
         * @param String path
         * @param Number path
         * @param Zip zip_file default:null
         * @returns Font
         */
        getFont: function (path, size, zip_file) {
            zip_file = zip_file || null;

            if (browser) {
                return new Radamn.Font({ surface: null });
            }

            return new Radamn.Font({
                surface : this.__getFont(path, size, zip_file)
            });

        },
        /**
         * @TODO do it!
         * @member Assets
         * @param String path
         * @returns Zip
         */
        getZip: function (path) {

        },
        /**
         * Destroy Image, Font (everything that this class create)
         * @TODO do it!
         * @member Assets
         * @param String path
         */
        destroy: function (resource) {
            switch (__typeof(resource)) {
            case 'Image':
                CRadamn.Image.destroy(resource.__pointer);
                if (resource.src) {
                    this.__images.erase(resource.src);
                }
                break;
            case 'RadamnImage':
                CRadamn.Image.destroy(resource.surface);
                this.__images.erase(resource.surface.path);
                break;
            case 'RadamnFont':
                CRadamn.Font.destroy(resource.surface);
                this.__fonts.erase(resource.surface.path + ":" + resource.surface.size);
                break;
            }
        },
        /**
         * Destroy all images from cland, be aware, this don't remove the images in jsland.
         * @member Assets
         */
        destroyAllImages: function () {
            this.__images.forEach(function (v, k) {
                CRadamn.Image.destroy(v);
            });
            this.__images.empty();
        },
        /**
         * Destroy all fonts from cland, be aware, this dont remove the images in jsland.
         * @member Assets
         */
        destroyAllFonts: function () {
            this.__fonts.forEach(function (v, k) {
                CRadamn.Font.destroy(v);
            });
            this.__fonts.empty();
        }
    });

    exports.Assets = new Assets();

}(typeof exports === "undefined" ? Radamn : exports, typeof exports === "undefined"));
