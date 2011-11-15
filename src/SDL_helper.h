#ifndef SDL_HELPER_H_
#define SDL_HELPER_H_

#include <SDL.h>
#include <v8.h>
#include <iostream>

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
// and "X", in my case gnome
#include <SDL/SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs
#endif

void debug_SDL_Rect(SDL_Rect* rect);

void debug_SDL_Surface(SDL_Surface* surface);

inline SDL_Rect* getFullRectSurface(SDL_Surface* surface);

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
    // remeber this is only OPENGL, OPENGLES2 it's different
    // glBindTexture (GL_TEXTURE_2D, texture_id);
    #define SDL_RECT_TO_QUAD(TEXTURE_ID, FROM, TO)                                                                    \
        glBegin(GL_QUADS);                                                                                            \
        std::cout << "texture" << TEXTURE_ID << std::endl;                                                            \
        glBindTexture( GL_TEXTURE_2D, TEXTURE_ID );                                                                   \
        std::cout << "quad [";                                                                 \
        glColor3f(1, 1, 1);                                                                                           \
            glTexCoord2i( 0, 0 ); glVertex3f(TO->x, TO->y, 0);                                          \
            std::cout << TO->x << "," << TO->y << "] [";                                          \
            glTexCoord2i( 1, 0 ); glVertex3f(TO->w, TO->y, 0);                                          \
            std::cout << TO->w << "," << TO->y << "] [";                                          \
            glTexCoord2i( 1, 1 ); glVertex3f(TO->w, TO->h, 0);                                \
            std::cout << TO->w << "," << TO->h << "] [";                                          \
            glTexCoord2i( 0, 1 ); glVertex3f(TO->x, TO->h, 0);                                \
            std::cout << TO->x << "," << TO->h << "]" << std::endl;                                          \
        glEnd();                                                                                                      \
    glLoadIdentity();

#endif

#define PLINE std::cout << __LINE__ << std::endl;


#endif // SDL_HELPER_H_

