#ifndef RADAMN_PREREQUISITES_H_
#define RADAMN_PREREQUISITES_H_

#ifdef _WIN32
	#include <scripts\pnglibconf.h.prebuilt>  
#endif

#include <v8.h>
#include <node.h>
#include <SDL.h>

// declare namespaces!
namespace Radamn {}
namespace radamn {
	class image;
	static v8::Persistent<v8::ObjectTemplate> SDL_Font_template_;
	static v8::Persistent<v8::ObjectTemplate> SDL_Surface_template_;
	static v8::Persistent<v8::ObjectTemplate> OGL_DrawBufferTextured_template_;
}
using namespace radamn;



#include <iostream>
#include <fstream>

#include <stdio.h>
#include <stdarg.h>

namespace Radamn {
    static char __bigcharbuffer[1024];
    static std::ofstream verbose;
}

namespace radamn {
	void THROW(const char* CHAR_STRING);
	void THROW(const char* CHAR_STRING, const char* CHAR_STRING2);
	void THROW(const char* CHAR_STRING, const char* CHAR_STRING2, const char* CHAR_STRING3);
}



#define VERBOSE Radamn::verbose << __FILE__ << "@" << __LINE__ << ":" << __FUNCTION__ << " "
#define VERBOSEC Radamn::verbose

inline char* VERBOSEF(const char *fmt, ...);

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

typedef struct OGL_DrawBufferTextured {
    GLsizeiptr positionSize;
    GLfloat* positions;
    GLuint* positionBuffer;

    GLuint textureID;
    GLsizeiptr coordsSize;
    GLfloat* coords;
    GLuint* coordsBuffer;
}OGL_DrawBufferTextured;

typedef struct glColor {
    GLfloat r;
    GLfloat g;
    GLfloat b;
    GLfloat a;

}glColor;
/**
 * @see sdl_color_from
 */
glColor glColor_from(SDL_Color color);

#endif // RADAMN_PREREQUISITES_H_
