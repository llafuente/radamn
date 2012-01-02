#ifndef OPENGL_HELPER_H_
#define OPENGL_HELPER_H_

#include "SDL_helper.h"
#include <iostream>
#include <iomanip>
#include <limits>
//include proper headers

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
// and "X", in my case gnome
#include <SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs

#endif

	//not used... need refactoring
	inline void opengl_draw_colored_poly(glColor color, SDL_Rect rect);

     /// from cairo
    typedef enum opengl_operators {
        OPERATOR_CLEAR = 0,
        OPERATOR_SOURCE,
        OPERATOR_OVER,
        OPERATOR_IN,
        OPERATOR_OUT,
        OPERATOR_ATOP,
        OPERATOR_DEST,
        OPERATOR_DEST_OVER,
        OPERATOR_DEST_IN,
        OPERATOR_DEST_OUT,
        OPERATOR_DEST_ATOP,
        OPERATOR_XOR,
        OPERATOR_ADD
/*,
        OPERATOR_SATURATE,

        CAIRO_OPERATOR_MULTIPLY,
        CAIRO_OPERATOR_SCREEN,
        CAIRO_OPERATOR_OVERLAY,
        CAIRO_OPERATOR_DARKEN,
        CAIRO_OPERATOR_LIGHTEN,
        CAIRO_OPERATOR_COLOR_DODGE,
        CAIRO_OPERATOR_COLOR_BURN,
        CAIRO_OPERATOR_HARD_LIGHT,
        CAIRO_OPERATOR_SOFT_LIGHT,
        CAIRO_OPERATOR_DIFFERENCE,
        CAIRO_OPERATOR_EXCLUSION,
        CAIRO_OPERATOR_HSL_HUE,
        CAIRO_OPERATOR_HSL_SATURATION,
        CAIRO_OPERATOR_HSL_COLOR,
        CAIRO_OPERATOR_HSL_LUMINOSITY
*/
    } opengl_operators_t;


	opengl_operators_t opengl_operator_from_string(char* str);

    /// from cairo
    /// build a unit test: http://forums.inside3d.com/viewtopic.php?t=1419
    inline void opengl_set_operator(opengl_operators_t op);

    inline void opengl_clear_operator();

	inline void opengl_draw_textured_quad(OGL_Texture* texture, GLfloat* uvs, SDL_Rect* dst, opengl_operators_t composite = OPERATOR_OVER);

	inline GLfloat* opengl_uv_from(SDL_Surface* surface, SDL_Rect* rect);

	// remeber this is only OPENGL, OPENGLES2 it's different
	inline void opengl_draw_textured_SDL_Rect(SDL_Surface* surface, SDL_Rect* from, SDL_Rect* to, opengl_operators_t composite);

#define OGL_BUFFER_OFFSET(i) ((char *)NULL + (i))



#endif // OPENGL_HELPER_H_
