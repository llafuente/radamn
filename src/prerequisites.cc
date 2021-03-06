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

void radamn::THROW(const char* CHAR_STRING) {
    ThrowException(v8::Exception::Error(v8::String::New(CHAR_STRING)));
}
void radamn::THROW(const char* CHAR_STRING, const char* CHAR_STRING2) {
    ThrowException(v8::Exception::Error(
        v8::String::Concat(
            v8::String::New(CHAR_STRING),
            v8::String::New(CHAR_STRING2)
        )
    ));
}
void radamn::THROW(const char* CHAR_STRING, const char* CHAR_STRING2, const char* CHAR_STRING3) {
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

void radamn::TO_CONSOLE(const char* CHAR_STRING, v8::Local<v8::Value> hndl) {
    v8::Handle<v8::String> console = v8::String::New("console");
    v8::Handle<v8::String> log = v8::String::New("log");
    v8::Handle<v8::Function> console_log = v8::Handle<v8::Function>::Cast( v8::Context::GetCurrent()->Global()->Get(console)->ToObject()->Get(log) );

    const unsigned argc = 2;
    v8::Local<v8::Value> argv[argc] = {v8::String::New(CHAR_STRING), hndl};
    console_log->Call(v8::Context::GetCurrent()->Global(), argc, argv);
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
gl_color_t radamn::gl_color_from(SDL_Color color) {
    gl_color_t output;
    output.r = color.r * 0.003921568627450980392156862745098f;
    output.g = color.g * 0.003921568627450980392156862745098f;
    output.b = color.b * 0.003921568627450980392156862745098f;

    output.a = color.unused * 0.003921568627450980392156862745098f;

    return output;
}

