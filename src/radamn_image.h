#ifndef RADAMN_IMAGE_H_
#define RADAMN_IMAGE_H_

#include "prerequisites.h"

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
#include <SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs
#endif

#include <stdlib.h>
#include <stdio.h>
#include <png.h>
#include <iostream>
#include <iomanip>

#include <v8.h>
#include <node.h>
#include "gl.h"

namespace radamn {
    static unsigned int image_count = 0;

    /// from: http://blog.nobel-joergensen.com/2010/11/07/loading-a-png-as-texture-in-opengl-using-libpng/
    inline bool image_load_from_png(char *name, int &outWidth, int &outHeight, bool &outHasAlpha, GLubyte **outData);

    //declare the global pointer

    class image {
    public:
        static const Uint32 LOADED = 0x000001;
        static const Uint32 OPENGL = 0x000002;
        static const Uint32 ALPHA = 0x000004;

    protected :
        SDL_Surface* from;

        Uint32 flags;

        SDL_PixelFormat *format;

        Uint16 pitch;

        //SDL_Rect clipping;

        bool* mask;

    public:
        GLuint texture_id;
        int width;
        int height;

        //void *pixels;
        GLubyte *pixels;

        void *userdata;

        image() :
            texture_id(0), from(0), flags(0), format(0),
            pitch(0), width(0), height(0), pixels(0), userdata(0), mask(0) {
        }

        /**
         * do not delete userdata!
         */
        ~image() {
            if(this->pixels) {
                free(this->pixels);
                this->pixels = 0;
            }
            if(this->mask) {
                free(this->mask);
                this->mask = 0;
            }
        }

        inline bool is(Uint32 flag) {
            return (this->flags & flag) == flag;
        }

        bool load_from_file(char* name, bool bind=true, bool generate_mask=false);

        bool load_from_surface(SDL_Surface* surface, bool bind=true, bool generate_mask=false);

        static v8::Handle<v8::Value> wrap(image* img);
        static image* unwrap(const v8::Arguments& args, int position);
        static image* unwrap(v8::Local<v8::Value> handle);

        SDL_Rect* getRect();

        image* clone() {}
        /**
         * @return if the image is sent to opengl now or just bind
         */
        bool bind();

        bool unbind();

        GLfloat* uv_from(SDL_Rect* rect);
    };

    static v8::Persistent<v8::ObjectTemplate> v8_image_pointers;

    inline void image_free(image* img);

    inline image* image_new(char* filename, bool generate_mask = false);

    v8::Handle<v8::Value> v8_image_load(const v8::Arguments& args);
    v8::Handle<v8::Value> v8_image_draw(const v8::Arguments& args);
    v8::Handle<v8::Value> v8_image_batch_draw(const v8::Arguments& args);
    v8::Handle<v8::Value> v8_image_destroy(const v8::Arguments& args);

}


#endif