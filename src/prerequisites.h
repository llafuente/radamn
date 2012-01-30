#ifndef RADAMN_PREREQUISITES_H_
#define RADAMN_PREREQUISITES_H_

#ifdef _WIN32
	#include <scripts\pnglibconf.h.prebuilt>  
#endif

#include <v8.h>
#include <node.h>
#include <SDL.h>

#define ENDL std::endl

#define RADAMN_RENDERER_SOFTWARE 1
#define RADAMN_RENDERER_OPENGL 2
#define RADAMN_RENDERER_OPENGLES 3
#define RADAMN_RENDERER_OPENGLES2 4

//#define RADAMN_RENDERER RADAMN_RENDERER_SOFTWARE
#define RADAMN_RENDERER RADAMN_RENDERER_OPENGL


#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
#include <SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs
#endif

// declare namespaces!
namespace Radamn {}
namespace radamn {
	class image;
	class font;
	class gl;
	class loggin;

	static v8::Persistent<v8::ObjectTemplate> SDL_Font_template_;
	static v8::Persistent<v8::ObjectTemplate> SDL_Surface_template_;
	static v8::Persistent<v8::ObjectTemplate> OGL_DrawBufferTextured_template_;
	
	// enums
	/// from cairo
	typedef enum gl_operators {
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
	} gl_operators_t;
	
	typedef struct gl_color {
		GLfloat r;
		GLfloat g;
		GLfloat b;
		GLfloat a;

	} gl_color_t;
	/**
	 * @see sdl_color_from
	 */
	gl_color_t gl_color_from(SDL_Color color);
	
}
using namespace radamn;

namespace radamn {
	void THROW(const char* CHAR_STRING);
	void THROW(const char* CHAR_STRING, const char* CHAR_STRING2);
	void THROW(const char* CHAR_STRING, const char* CHAR_STRING2, const char* CHAR_STRING3);
}

typedef struct OGL_DrawBufferTextured {
    GLsizeiptr positionSize;
    GLfloat* positions;
    GLuint* positionBuffer;

    GLuint textureID;
    GLsizeiptr coordsSize;
    GLfloat* coords;
    GLuint* coordsBuffer;
}OGL_DrawBufferTextured;



#endif // RADAMN_PREREQUISITES_H_

