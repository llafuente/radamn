#ifndef RADAMN_GL_H_
#define RADAMN_GL_H_

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif

#include <SDL.h>
#include "prerequisites.h"
#include "radamn_loggin.h"
#include "radamn_image.h"


namespace radamn {
    /**
     * basic class that will be the base of the opengl rendersytyem and opengles 1/2
     */
    class gl {
        public :
        gl_color_t background;



        protected:
        static gl* instance;

        gl() {
            background.r = 0;
            background.g = 0;
            background.b = 0;
            background.a = 1;
        }

        public:
        ~gl() { }

        static gl* singleton();

        static GLuint gen_texture_id();

        static gl_operators operator_from_string(char* str);

        /// from cairo
        /// build a unit test: http://forums.inside3d.com/viewtopic.php?t=1419
        static void set_operator(gl_operators op);

        static void clear_operator();

        static void flip_buffers();

        static void clear();

        static void matrix_mult(GLfloat* matrix);

        static void matrix_set(GLfloat* matrix);

        static void stroke_poly(GLfloat* points, int cpoints, int width, gl_color_t color);

        static void fill_poly(GLfloat* points, int cpoints, gl_color_t color);

        static void fill_rect(SDL_Rect rect, gl_color_t color);

        static void draw_image(image* img, SDL_Rect* from, SDL_Rect* to, gl_operators composite);

        static void draw_quad(GLuint texture_id, GLfloat* uvs, SDL_Rect* dst, gl_operators_t composite);
    };

    /*
    //extra canvas
    v8::Handle<v8::Value> alpha(const v8::Arguments& args);
    glAlphaFunc(GL_GREATER, 0.5);
    glEnable(GL_ALPHA_TEST);
    */

    // v8 interfaces
    v8::Handle<v8::Value> v8_gl_set_background_color(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_clear(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_flip_buffers(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_transform(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_set_transform(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_stroke(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_fill(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_save(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_restore(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_scale(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_rotate(const v8::Arguments& args);

    v8::Handle<v8::Value> v8_gl_translate(const v8::Arguments& args);

}


#endif
