/**
 * @ignore
 */
var path = require('path');
/**
 * @ignore
 */
var __pathlist = [];
/**
 * @ignore
 */
function resolve(file, callback) {
    var i = 0,
        max = __pathlist.length;
    for(;i<max; ++i) {
        path.exits(__pathlist[i] + file, function(exists) {
            if (exists) callback();
        });
    }
}




/**
  * @class Assets
 */
var Assets = new Class(
/** @lends Assets.prototype */
{
    /**
     * @member Assets
     */
    __images : null,
    /**
     * @member Assets
     */
    __fonts : null,
    /**
     * <p>Do not instance this class, use it directly</p>
     * <p><strong>Example</strong></p>
     * <blockquote>Radamn.Assets.getImage("./myimage.png");</blockquote>
     * @private
     * @member Assets
     */
    initialize: function() {
        this.__images = new Hash();
        this.__fonts = new Hash();
    },
    /**
     * @member Assets
     */
    pushPath: function(path) {
        this.__pathlist.push(path);
    },
    /**
     * @member Assets
     * @param {String} path
     * @param {String} zipfile (optional)
     * @returns {Sprite}
     */
    getSprite: function(path, zipfile) {

    },
    /**
     * @member Assets
     * @param {String} path
     * @param {String} zipfile (optional)
     * @returns {AnimationSheet}
     */
    getAnimationSheet: function(path, zipfile) {

    },
    /**
     * Internal function to get the image from cland, this one dont have cache.
     * @TODO zipfile
     * @member Assets
     * @private
     * @param {String} path
     * @param {String} zipfile (optional)
     * @returns {Image}
     */
    __getImage: function(path, zipfile, generate_mask) {
        zipfile = zipfile || null;
        generate_mask = generate_mask || false;

        var image_pointer = null;

        if((image_pointer = this.__images.get(path)) !== null) {
            return image_pointer;
        }

        image_pointer = CRadamn.Image.load(path, generate_mask);
        image_pointer.path = path;
        this.__images.set(path, image_pointer);


        return image_pointer;
    },
    /**
     * <p>Only PNG images are supported atm.</p>
     * <p>Image are cached by path and destroy, delete the cache</p>
     * @TODO zipfile
     * @member Assets
     * @param {String} path
     * @param {String} zipfile (optional)
     * @returns {Image}
     */
    getImage: function(path, zipfile, generate_mask) {
        zipfile = zipfile || null;
        generate_mask = generate_mask || false;

        var image_pointer = this.__getImage(path, zipfile, generate_mask);

        return new Radamn.Image(image_pointer);
    },
    /**
     * Experimental, Api not frozen...
     * @member Assets
     * @TODO zipfile
     * @param {String} path
     * @param {String} zipfile (optional)
     * @returns {Image}
     */
    getAnimation: function(path, path_to_cfg_or_object, zipfile) {
        zipfile = zipfile || null;

        var options = {};
        if(typeOf(path_to_cfg_or_object) == "string") {
            // TODO: get the file! and parse the JSON
        } else {
            options = path_to_cfg_or_object;
        }

        var image_pointer = this.__getImage(path, zipfile);

        return new Radamn.Animation(image_pointer, path_to_cfg_or_object);
    },
    /**
     *
     * @TODO do it!
     * @member Assets
     * @param {String} path
     * @param {String} zipfile (optional)
     * @returns {Sound}
     */
    getSound: function(path, zipfile) {

    },
    /**
     * <p>Internal method to get the font from cland</p>
     * @member Assets
     * @private
     * @param {String} path
     * @param {Number} path
     * @param {String} zipfile (optional)
     * @returns {Font}
     */
    __getFont: function(path, size, zipfile) {
        var font_pointer = null;
        var key = path+":"+size;

        if((font_pointer = this.__fonts.get(key)) !== null) {
            return font_pointer;
        }

        var font_pointer = CRadamn.Font.load(path, size);
        font_pointer.path = path;
        font_pointer.size = size;
        return font_pointer;
    },
    /**
     * <p>Only TTF fonts are supported atm.</p>
     * <p>Fonts are cached by path and destroy, delete the cache</p>
     * @member Assets
     * @param {String} path
     * @param {Number} path
     * @param {String} zipfile (optional)
     * @returns {Font}
     */
    getFont: function(path, size, zipfile) {
        zipfile = zipfile || null;

        var font_pointer = this.__getFont(path, size, zipfile);

        return new Radamn.Font(font_pointer);
    },
    /**
     * @TODO do it!
     * @member Assets
     * @param {String} path
     * @returns {Zip}
     */
    getZip: function(path) {

    },
    /**
     * Destroy Image, Font (everything that this class create)
     * @TODO do it!
     * @member Assets
     * @param {String} path
     * @returns {Zip}
     */
    destroy: function(resource) {
        switch(resource.__type) {
        case 'Image' :
            CRadamn.Image.destroy(resource.pointer);
            this.__images.erase(resource.pointer.path);
        break;
        case 'Font' :
            CRadamn.Font.destroy(resource.pointer);
            this.__fonts.erase(resource.pointer.path + ":" + resource.pointer.size);
        break;
        }
    },
    /**
     * Destroy all images from cland, be aware, this dont remove the images in jsland.
     * @member Assets
     */
    destroyAllImages: function() {
        this.__images.forEach(function(v,k) {
            CRadamn.Image.destroy(v);
        });
        this.__images.empty();
    },
    /**
     * Destroy all fonts from cland, be aware, this dont remove the images in jsland.
     * @member Assets
     */
    destroyAllFonts: function() {
        this.__fonts.forEach(function(v,k) {
            CRadamn.Font.destroy(v);
        });
        this.__fonts.empty();
    }
});

module.exports.Assets = new Assets();