#ifndef RADAMN_PREREQUISITES_H_
#define RADAMN_PREREQUISITES_H_


#include <v8.h>
#include <node.h>
#include <SDL.h>

#include <iostream>

#define RADAMN_RENDERER_SOFTWARE 1
#define RADAMN_RENDERER_OPENGL 2
#define RADAMN_RENDERER_OPENGLES 3
#define RADAMN_RENDERER_OPENGLES2 4

//#define RADAMN_RENDERER RADAMN_RENDERER_SOFTWARE
#define RADAMN_RENDERER RADAMN_RENDERER_OPENGL


#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
#include <SDL/SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs
#endif


typedef struct OGL_Texture {
    GLuint textureID;
};

#include "c_helper.cc"
#include "SDL_helper.cc"
#include "v8_helper.cc"

#endif // RADAMN_PREREQUISITES_H_
