#include "radamn_image.h"

#include <stdlib.h>
#include <stdio.h>
#include <png.h>
#include <iostream>
#include <v8.h>
#include "v8_helper.h"
#include "opengl_helper.h"
#include "prerequisites.h"
#include "radamn_gl.h"

#include <assert.h>

using namespace radamn;


v8::Handle<v8::Value> image::wrap(image* img) {
    if (v8_image_pointers.IsEmpty()) {
        VERBOSE << "create the image pointer template" << ENDL;
        v8::HandleScope handle_scope2;
        v8::Handle<v8::ObjectTemplate> result = v8::ObjectTemplate::New();
        result->SetInternalFieldCount(1);
        v8::Handle<v8::ObjectTemplate> raw_template = handle_scope2.Close(result);
        v8_image_pointers = v8::Persistent<v8::ObjectTemplate>::New(raw_template);
    }

    VERBOSE << "clone image pointer for: " << (long int) img << ENDL;

    v8::Handle<v8::Object> v8_image_ptr = v8_image_pointers->NewInstance();
    v8_image_ptr->SetInternalField(0, v8::External::New(img));

    v8_image_ptr->Set(v8::String::New("width"), v8::Number::New(img->width));
    v8_image_ptr->Set(v8::String::New("height"), v8::Number::New(img->height));
    v8_image_ptr->Set(v8::String::New("alpha"), v8::Boolean::New(img->is(image::ALPHA)));

    if(img->mask != 0 ) {
        int pixel_count = img->width * img->height;
        v8::Local<v8::Array> v8mask = v8::Array::New(pixel_count);

        //VERBOSE << __LINE__ << "pixels" << pixel_count << ENDL;

        for (int i = 0; i < pixel_count; ++i) {
            //VERBOSE << __LINE__ << " - " << i << " = "<< (img->mask[i] ? "true" : "false") << ENDL;
            v8mask->Set(i, v8::Boolean::New(img->mask[i]));
        }

        v8_image_ptr->Set(v8::String::New("mask"), v8mask);
    }


    //test
    v8::Handle<v8::External> v8_aux_field = v8::Handle<v8::External>::Cast(v8_image_ptr->GetInternalField(0));
    void* v8_aux_ptr = v8_aux_field->Value();
    image* img_aux =  static_cast<image*>(v8_aux_ptr);

    VERBOSE << "unwrap: " << (long int) img_aux << " @" << img_aux->width << "," << img_aux->height << ENDL;

    return v8_image_ptr;
}

image* image::unwrap(const v8::Arguments& args, int position) {
    return image::unwrap(args[position]);
}

image* image::unwrap(v8::Local<v8::Value> handle) {
    v8::Handle<v8::External> v8_aux_field = v8::Handle<v8::External>::Cast(handle->ToObject()->GetInternalField(0));
    void* v8_aux_ptr = v8_aux_field->Value();
    image* img =  static_cast<image*>(v8_aux_ptr);

    VERBOSE << "unwrap: " << (long int) img << " @" << img->width << "," << img->height << ENDL;

    return img;
}

GLfloat* image::uv_from(SDL_Rect* rect) {
    GLfloat* uvs = (GLfloat*) malloc(4*sizeof(GLfloat));

    uvs[0] = ((GLfloat)rect->x) / this->width;
    uvs[1] = ((GLfloat)rect->y) / this->height;
    uvs[2] = ((GLfloat)(rect->x + rect->w)) / this->width;
    uvs[3] = ((GLfloat)(rect->y + rect->h)) / this->height;

    using std::setprecision;
    using std::numeric_limits;

    debug_SDL_Rect(rect, "rect");
    VERBOSE
    << this->width << "x" << this->height << "text-coords ["
    << setprecision(6) << uvs[0] << ","
    << setprecision(6) << uvs[1] << ","
    << setprecision(6) << uvs[2] << ","
    << setprecision(6) << uvs[3] << "]"<< ENDL;

    return uvs;
}

bool image::load_from_surface(SDL_Surface* surface, bool bind, bool generate_mask) {
    bool hasAlpha = true;

    unsigned int memory_allocated;

    this->width = surface->w;
    this->height = surface->h;

    if(surface->format->BytesPerPixel == 4) {
        this->flags = (this->flags | image::ALPHA);
        memory_allocated = 4 * this->width * this->height;

    } else {
        memory_allocated = 3 * this->width * this->height;
    }
    this->pixels = (GLubyte*) malloc(memory_allocated);
    // need to copy the memory another time (3x in case of ttf) because SDL_malloc cannot be free'd -> SDL_free
    memcpy(this->pixels, surface->pixels, memory_allocated);

    //for(int i=0;i < memory_allocated;++i) {
    //    VERBOSE << (int) this->pixels[i] << " ";
    //}

    glGenTextures(1, &this->texture_id);

    this->flags = (this->flags | image::LOADED);

    if(bind)
        this->bind();

    return true;
}

bool image::load_from_file(char* name, bool bind, bool generate_mask) {
    bool hasAlpha = true;
    if(!image_load_from_png(name, this->width, this->height, hasAlpha,  &this->pixels)) {
        THROW("error: invalid image", name);
    }

    //for(int i=0;i<this->width*this->height*4;++i) {
    //    VERBOSE << (int) this->pixels[i] << " ";
    //}

    // Check that the image's width is a power of 2
    if ( (this->width & (this->width - 1)) != 0 ) {
        THROW("warning: ", name, " width is not a power of 2");
    }

    if(hasAlpha) {
        this->flags = (this->flags | image::ALPHA);
    }
    if(generate_mask && hasAlpha) {
        VERBOSE << "generate mask!!";
        int pixel_count = this->width * this->height;
        int i = 0;

        //v8::Local<v8::Array>
        this->mask = (bool*) malloc(sizeof(bool) * this->width * this->height);

        for(;i<pixel_count; ++i) {
            this->mask[i] = this->pixels[i+4];
        }
    }

    glGenTextures(1, &this->texture_id);

    this->flags = (this->flags | image::LOADED);

    if(bind)
        this->bind();

    return true;
}

bool image::unbind() {
    if(!this->is(image::OPENGL)) {
        return false;
    }

    this->flags = (this->flags | ~image::OPENGL);
    return true;
}

bool image::bind() {
    if(this->is(image::OPENGL)) {
        glBindTexture( GL_TEXTURE_2D, this->texture_id );
        return false;
    }

    glBindTexture(GL_TEXTURE_2D, this->texture_id);
    glTexImage2D(GL_TEXTURE_2D,
        0,
        this->is(image::ALPHA) ? GL_RGBA : GL_RGB,
        this->width,
        this->height,
        0,
        this->is(image::ALPHA) ? GL_RGBA : GL_RGB,
        GL_UNSIGNED_BYTE,
        this->pixels
    );

    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);

    this->flags = (this->flags | image::OPENGL);
    return true;
}

SDL_Rect* image::getRect() {
    SDL_Rect* output = (SDL_Rect *) SDL_malloc(sizeof(SDL_Rect));

    output->x = 0;
    output->y = 0;
    output->w = this->width;
    output->h = this->height;

    return output;
}



void radamn::image_free(image* img) {
    --image_count;
    delete img;
}

image* radamn::image_new(char* filename, bool generate_mask) {
    ++image_count;

    image* img = new radamn::image();
    img->load_from_file(filename, true, generate_mask);
    return img;
}

v8::Handle<v8::Value> radamn::v8_image_load(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!(args.Length() == 2 && args[0]->IsString() && args[1]->IsBoolean())) {
        THROW("Invalid arguments: v8_image_load(String, Boolean)");
    }

    v8::String::Utf8Value file(args[0]);
    bool generate_mask = args[1]->BooleanValue();

    VERBOSE << (generate_mask ? "generate mask!" : "ignore mask") << ENDL;

    image* img = image_new(*file, generate_mask);
    if(!img) {
      THROW("v8_image_load cannot load the given image");
    }

    return scope.Close(image::wrap(img));
}
v8::Handle<v8::Value> radamn::v8_image_draw(const v8::Arguments& args) {
    v8::HandleScope scope;

    VERBOSE << "v8_image_draw(" << args.Length() << "@"
        << args[0]->IsObject() << ","
        << args[1]->IsString() << ","
        << args[2]->IsNumber() << ","
        << args[3]->IsNumber() << ","
    << ")" << ENDL;

    // 3 args! <image>,<image>,<number>,<number>

    bool error = false;

    V8_CHECK_ARGS(0, Object)
    V8_CHECK_ARGS(1, String)
    V8_CHECK_ARGS(1, Number)
    V8_CHECK_ARGS(1, Number)

    if(!(
        args.Length() == 4
        || args.Length() == 6
        || args.Length() == 10
        )) {
        THROW("Invalid argument count [4,6,10]");
    }

    image* img = image::unwrap(args, 0);

    v8::String::Utf8Value mode(args[1]);
    VERBOSE << "mode: " << *mode << ENDL;
    gl_operators emode = gl::operator_from_string(*mode);

    SDL_Rect* dstrect = 0;
    SDL_Rect* srcrect = 0;

    if(args.Length() == 4) {
        dstrect = (SDL_Rect*) SDL_malloc(sizeof(SDL_Rect));
        dstrect->x = args[2]->Int32Value();
        dstrect->y = args[3]->Int32Value();
        dstrect->w = img->width;
        dstrect->h = img->height;

        srcrect = img->getRect();
    }

    if(args.Length() == 6) {
        dstrect = (SDL_Rect*) SDL_malloc(sizeof(SDL_Rect));
        dstrect->x = args[2]->Int32Value();
        dstrect->y = args[3]->Int32Value();
        dstrect->w = args[4]->Int32Value();
        dstrect->h = args[5]->Int32Value();

        SDL_RECT_P(srcrect, 0, 0, args[4]->Int32Value(), args[5]->Int32Value())
    }

    if(args.Length() == 10) {
        SDL_RECT_P(srcrect, args[2]->Int32Value(), args[3]->Int32Value(), args[4]->Int32Value(), args[5]->Int32Value())
        //SDL_RECT_P(dstrect, args[6]->Int32Value(), args[7]->Int32Value(), args[6]->Int32Value() + args[8]->Int32Value(), args[7]->Int32Value() + args[9]->Int32Value())
        SDL_RECT_P(dstrect, args[6]->Int32Value(), args[7]->Int32Value(), args[8]->Int32Value(), args[9]->Int32Value())
    }

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

    debug_SDL_Rect(srcrect, "srcrect");
    debug_SDL_Rect(dstrect, "dstrect");

    opengl_draw_textured_SDL_Rect(img, srcrect, dstrect, emode);

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    THROW("OPENGLES is not supported atm");
#endif

    VERBOSE << "free: srcrect"  << ENDL;
    if(srcrect) {
        SDL_free(srcrect);
    }
    VERBOSE << "free: dstrect"  << ENDL;
    if(dstrect)
        SDL_free(dstrect);

    VERBOSE << "drawed" << ENDL;

    return v8::True();
}

v8::Handle<v8::Value> radamn::v8_image_batch_draw(const v8::Arguments& args) {
    THROW("not supported atm!");
    return v8::Undefined();
}

v8::Handle<v8::Value> radamn::v8_image_destroy(const v8::Arguments& args) {
    v8::HandleScope scope;
    VERBOSE << "destroy" << ENDL;
    if (!(args.Length() == 1 && args[0]->IsObject())) {
        THROW("Invalid arguments: v8_image_destroy(image*)");
    }

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES || RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
    image* img = image::unwrap(args, 0);

    if(!img) return v8::False();

    image_free(img);
#endif

    VERBOSE << "destroyed" << ENDL;

    return v8::True();
}


/// from: http://blog.nobel-joergensen.com/2010/11/07/loading-a-png-as-texture-in-opengl-using-libpng/
inline bool radamn::image_load_from_png(char *name, int &outWidth, int &outHeight, bool &outHasAlpha, GLubyte **outData) {
    png_structp png_ptr;
    png_infop info_ptr;
    unsigned int sig_read = 0;
    int color_type, interlace_type;
    FILE *fp;

    if ((fp = fopen(name, "rb")) == NULL)
        return false;

    /* Create and initialize the png_struct
     * with the desired error handler
     * functions.  If you want to use the
     * default stderr and longjump method,
     * you can supply NULL for the last
     * three parameters.  We also supply the
     * the compiler header file version, so
     * that we know if the application
     * was compiled with a compatible version
     * of the library.  REQUIRED
     */
    png_ptr = png_create_read_struct(PNG_LIBPNG_VER_STRING,
            NULL, NULL, NULL);

    if (png_ptr == NULL) {
        fclose(fp);
        return false;
    }

    /* Allocate/initialize the memory
     * for image information.  REQUIRED. */
    info_ptr = png_create_info_struct(png_ptr);
    if (info_ptr == NULL) {
        fclose(fp);
        png_destroy_read_struct(&png_ptr, &info_ptr, 0);
        return false;
    }

    /* Set error handling if you are
     * using the setjmp/longjmp method
     * (this is the normal method of
     * doing things with libpng).
     * REQUIRED unless you  set up
     * your own error handlers in
     * the png_create_read_struct()
     * earlier.
     */
    if (setjmp(png_jmpbuf(png_ptr))) {
        /* Free all of the memory associated
         * with the png_ptr and info_ptr */
        png_destroy_read_struct(&png_ptr, &info_ptr, 0);
        fclose(fp);
        /* If we get here, we had a
         * problem reading the file */
        return false;
    }

    /* Set up the output control if
     * you are using standard C streams */
    png_init_io(png_ptr, fp);

    /* If we have already
     * read some of the signature */
    png_set_sig_bytes(png_ptr, sig_read);

    /*
     * If you have enough memory to read
     * in the entire image at once, and
     * you need to specify only
     * transforms that can be controlled
     * with one of the PNG_TRANSFORM_*
     * bits (this presently excludes
     * dithering, filling, setting
     * background, and doing gamma
     * adjustment), then you can read the
     * entire image (including pixels)
     * into the info structure with this
     * call
     *
     * PNG_TRANSFORM_STRIP_16 |
     * PNG_TRANSFORM_PACKING  forces 8 bit
     * PNG_TRANSFORM_EXPAND forces to
     *  expand a palette into RGB
     */
    png_read_png(png_ptr, info_ptr, PNG_TRANSFORM_STRIP_16 | PNG_TRANSFORM_PACKING | PNG_TRANSFORM_EXPAND, 0);

    outWidth = png_get_image_width(png_ptr, info_ptr);
    outHeight = png_get_image_height(png_ptr, info_ptr);
    switch (png_get_color_type(png_ptr, info_ptr)) {
        case PNG_COLOR_TYPE_RGBA:
            outHasAlpha = true;
            break;
        case PNG_COLOR_TYPE_RGB:
            outHasAlpha = false;
            break;
        default:
            VERBOSE << "Color type " << png_get_color_type(png_ptr, info_ptr) << " not supported" << ENDL;
            png_destroy_read_struct(&png_ptr, &info_ptr, NULL);
            fclose(fp);
            return false;
    }
    unsigned int row_bytes = png_get_rowbytes(png_ptr, info_ptr);
    *outData = (unsigned char*) malloc(row_bytes * outHeight);

    png_bytepp row_pointers = png_get_rows(png_ptr, info_ptr);

    for (int i = 0; i < outHeight; i++) {
        // note that png is ordered top to
        // bottom, but OpenGL expect it bottom to top
        // so the order or swapped
        //memcpy(*outData+(row_bytes * (outHeight-1-i)), row_pointers[i], row_bytes);
        memcpy(*outData+(row_bytes * i), row_pointers[i], row_bytes);
    }

    /* Clean up after the read,
     * and free any memory allocated */
    png_destroy_read_struct(&png_ptr, &info_ptr, 0);

    /* Close the file */
    fclose(fp);

    /* That's it */
    return true;
}