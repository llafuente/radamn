#include "prerequisites.h"

#include <v8.h>
#include <node.h>
#include <SDL.h>

#include <iostream>
#include <fstream>

#include <stdio.h>
#include <stdarg.h>

using namespace radamn;

// declare here all needed pointers!

void radamn::THROW(char* CHAR_STRING) {
	ThrowException(v8::Exception::Error(v8::String::New(CHAR_STRING)));
}
void radamn::THROW(char* CHAR_STRING, char* CHAR_STRING2) {
	ThrowException(v8::Exception::Error(
		v8::String::Concat(
			v8::String::New(CHAR_STRING),
			v8::String::New(CHAR_STRING2)
		)
	));
}
void radamn::THROW(char* CHAR_STRING, char* CHAR_STRING2, char* CHAR_STRING3) {
	ThrowException(v8::Exception::Error(
		v8::String::Concat(
			v8::String::Concat(
				v8::String::New(CHAR_STRING),
				v8::String::New(CHAR_STRING2)
			),
			v8::String::New(CHAR_STRING3)
		)
	));
}




inline char* VERBOSEF(const char *fmt, ...) {
    va_list ap;
    int r;
    #ifdef __OPTIMIZE__
      if (inside_main)
        abort();
    #endif
    va_start (ap, fmt);
    //r = vprintf (string, ap);
    r = vsprintf(Radamn::__bigcharbuffer, fmt, ap);
    va_end (ap);
    return Radamn::__bigcharbuffer;
}

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
#include <SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs
#endif

/**
 * @see sdl_color_from
 */
glColor glColor_from(SDL_Color color) {
    glColor output;
    output.r = color.r * 0.003921568627450980392156862745098f;
    output.g = color.g * 0.003921568627450980392156862745098f;
    output.b = color.b * 0.003921568627450980392156862745098f;

    output.a = color.unused * 0.003921568627450980392156862745098f;

    return output;
}

