
//include proper headers

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
// and "X", in my case gnome
#include <SDL_opengl.h>
#include <gl.h>
#include <glu.h>
//#include <GL/glaux.h>

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs

#endif

// macros and functions

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

    #define GL_DRAW_TEXTURED_QUAD(uv_x_lleft, uv_y_lleft, uv_x_uright, uv_y_uright, x, y, x_plus_w, y_plus_h)                   \
        VERBOSE << "quad [";                                                                                           \
        glTexCoord2f(uv_x_lleft, uv_y_lleft); glVertex3f(x, y, 0);                                                     \
        VERBOSEC << x << "," << y << "] [";                                                                    \
        glTexCoord2f(uv_x_uright, uv_y_lleft); glVertex3f(x_plus_w, y, 0);                                             \
        VERBOSEC << x_plus_w << "," << y << "] [";                                                                    \
        glTexCoord2f(uv_x_uright, uv_y_uright); glVertex3f(x_plus_w, y_plus_h, 0);                                     \
        VERBOSEC << x_plus_w << "," << y_plus_h << "] [";                                                                    \
        glTexCoord2f(uv_x_lleft, uv_y_uright); glVertex3f(x, y_plus_h, 0);                                             \
        VERBOSEC << x << "," << y_plus_h << "]" << ENDL;                                                              \

    #define GL_DRAW_COLORED_QUAD(color_x_lleft, color_y_lleft, color_x_uright, color_y_uright, x, y, x_plus_w, y_plus_h)                   \
    {                                                                                                                                      \
        VERBOSE << "quad [";                                                                                                               \
        glColor4f(color_x_lleft.r, color_x_lleft.g, color_x_lleft.b, color_x_lleft.a); glVertex3f(x, y, 0);                                \
        VERBOSEC << x << "," << y << "] [";                                                                                                \
        glColor4f(color_x_uright.r, color_x_uright.g, color_y_lleft.b, color_y_lleft.a); glVertex3f(x_plus_w, y, 0);                       \
        VERBOSEC << x_plus_w << "," << y << "] [";                                                                                         \
        glColor4f(color_y_uright.r, color_y_uright.g, color_y_lleft.b, color_y_lleft.a); glVertex3f(x_plus_w, y_plus_h, 0);                \
        VERBOSEC << x_plus_w << "," << y_plus_h << "] [";                                                                                  \
        glColor4f(color_y_lleft.r, color_y_lleft.g, color_y_lleft.b, color_y_lleft.a); glVertex3f(x, y_plus_h, 0);                         \
        VERBOSEC << x << "," << y_plus_h << "]" << ENDL;                                                                                   \
                                                                                                                                           \
     }                                                                                                                                     \


    #define GL_UV_FROM_SDL(SURFACE, __X, __Y, __W, __H, OUTPUT_NAME)                                                                 \
        GLfloat OUTPUT_NAME[4]  = {((float) __X) / SURFACE->w,                                                     \
            ((float) __Y) / SURFACE->h,                                                                            \
            ((float) (__X + __W)) / SURFACE->w,                                                                \
            ((float) (__Y + __W)) / SURFACE->h,                                                                \
         };                                                                                                            \

    // remeber this is only OPENGL, OPENGLES2 it's different
    #define SDL_RECT_TO_QUAD(TEXTURE, FROM, TO)                                                                        \
    {                                                                                                                  \
        GL_UV_FROM_SDL(TEXTURE, FROM->x, FROM->y, FROM->w, FROM->h, UV)                                                                              \
        VERBOSEF("text-coords [%f,%f,%f,%f]\n", UV[0], UV[1], UV[2], UV[3]);                                           \
                                                                                                                       \
        glEnable(GL_TEXTURE_2D);                                                                                       \
            OGL_Texture* t = (OGL_Texture*)TEXTURE->userdata;                                                          \
            glBindTexture( GL_TEXTURE_2D, t->textureID );                                                              \
            glBegin(GL_QUADS);                                                                                         \
                VERBOSE << "texture: ID:" << t->textureID << " [" << TEXTURE->w << "," << TEXTURE->h << "]"<< ENDL;    \
                GL_DRAW_TEXTURED_QUAD(                                                                                          \
                    UV[0], UV[1], UV[2], UV[3],                                                                         \
                    TO->x, TO->y, TO->w, TO->h                                                                         \
                )                                                                                                      \
            glEnd();                                                                                                   \
        glDisable(GL_TEXTURE_2D);                                                                                      \
    }                                                                                                                  \

#endif


#define OGL_BUFFER_OFFSET(i) ((char *)NULL + (i))



