#ifndef OPENGL_HELPER_H_
#define OPENGL_HELPER_H_

#include "SDL_helper.h"
#include <iostream>
#include <iomanip>
#include <limits>

//include proper headers

#include "prerequisites.h"
#include "radamn_image.h"

#include <SDL.h>
#include <SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>

#include "radamn_gl.h"

// include the proper libs

using namespace radamn;

	//not used... need refactoring
	void opengl_draw_colored_poly(gl_color_t color, SDL_Rect rect);

	void opengl_draw_textured_SDL_Rect(image* img, SDL_Rect* from, SDL_Rect* to, gl_operators_t composite);

	GLfloat* opengl_uv_from(SDL_Surface* surface, SDL_Rect* rect);

	// remeber this is only OPENGL, OPENGLES2 it's different
	void opengl_draw_textured_SDL_Rect(SDL_Surface* surface, SDL_Rect* from, SDL_Rect* to, gl_operators_t composite);
	
	void opengl_stroke_point(GLfloat* points, int cpoints, int width, gl_color_t color, gl_operators_t composite = OPERATOR_OVER);
	
	void opengl_fill_poly(GLfloat* points, int cpoints, gl_color_t color, gl_operators_t composite = OPERATOR_OVER);

#define OGL_BUFFER_OFFSET(i) ((char *)NULL + (i))



#endif // OPENGL_HELPER_H_
