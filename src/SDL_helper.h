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
    #define SDL_RECT_TO_QUAD(TEXTURE, FROM, TO)                                                                   \
    {                                                                                                             \
    debug_SDL_Surface(TEXTURE);                                                                                   \
    debug_SDL_Rect(FROM);                                                                                         \
    debug_SDL_Rect(TO);                                                                                           \
                                                                                                                  \
    glEnable(GL_TEXTURE_2D);                                                                                      \
        OGL_Texture* t = (OGL_Texture*)src->userdata;                                                             \
        glBegin(GL_QUADS);                                                                                        \
            std::cout << "texture" << t->textureID << std::endl;                                                  \
            glBindTexture( GL_TEXTURE_2D, t->textureID );                                                         \
            float xl = FROM->x / TEXTURE->w;                                                                      \
            float xr = (FROM->x + FROM->w) / TEXTURE->w;                                                          \
            float yl = FROM->y / TEXTURE->h;                                                                      \
            float yr = FROM->y + FROM->w / TEXTURE->h;                                                            \
            std::cout << "texture-size [" << TEXTURE->w << "," << TEXTURE->h << "]" << std::endl;                 \
            printf("texture [%f,%f,%f,%f]\n", xl, yl, xr, yr);                                                    \
            std::cout << "quad [";                                                                                \
            glTexCoord2f(xl, yl); glVertex3f(TO->x, TO->y, 0);                                                    \
            std::cout << TO->x << "," << TO->y << "] [";                                                          \
            glTexCoord2f(xr, yl); glVertex3f(TO->w, TO->y, 0);                                                    \
            std::cout << TO->w << "," << TO->y << "] [";                                                          \
            glTexCoord2f(xr, yr); glVertex3f(TO->w, TO->h, 0);                                                    \
            std::cout << TO->w << "," << TO->h << "] [";                                                          \
            glTexCoord2f(xl, yr); glVertex3f(TO->x, TO->h, 0);                                                    \
            std::cout << TO->x << "," << TO->h << "]" << std::endl;                                               \
        glEnd();                                                                                                  \
        glDisable(GL_TEXTURE_2D);                                                                                 \
    }                                                                                                             \

#endif

#define PLINE std::cout << __LINE__ << std::endl;


#endif // SDL_HELPER_H_


int nextpoweroftwo(int x);
