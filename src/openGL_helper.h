
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

// macros and functions


#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

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


	inline void opengl_draw_textured_quad(OGL_Texture* texture, GLfloat* uvs, SDL_Rect* dst) {
		glEnable(GL_TEXTURE_2D);
		  glBindTexture( GL_TEXTURE_2D, texture->textureID );
		    glBegin(GL_QUADS);
			    VERBOSE << "texture: ID:" << texture->textureID << ENDL;
			    GLfloat
					width = dst->x + dst->w,
					height = dst->y + dst->h;

				VERBOSE << "quad [";                                                                                                               \
				glTexCoord2f(uvs[0], uvs[1]); glVertex3f(dst->x, dst->y, 0);                                                                         \
				VERBOSEC << dst->x << "(" << uvs[0] << ")," << dst->y << "(" << uvs[1]<< ")] [";                                                     \
				glTexCoord2f(uvs[2], uvs[1]); glVertex3f(width, dst->y, 0);                                                                 \
				VERBOSEC << width << "(" << uvs[2] << ")," << dst->y << "("<< uvs[1]<< "] [";                                               \
				glTexCoord2f(uvs[2], uvs[3]); glVertex3f(width, height, 0);                                                         \
				VERBOSEC << width << "(" << uvs[2] << ")," << height << "(" << uvs[3] << ")] [";                                    \
				glTexCoord2f(uvs[0], uvs[3]); glVertex3f(dst->x, height, 0);                                                                 \
				VERBOSEC << dst->x << "(" << uvs[0] <<")," << height << "(" << uvs[3] <<")]" << ENDL;

		    glEnd();
		glDisable(GL_TEXTURE_2D);
	}

	inline GLfloat* opengl_uv_from(SDL_Surface* surface, SDL_Rect* rect) {
		GLfloat* uvs = (GLfloat*) malloc(4*sizeof(GLfloat));

		uvs[0] = rect->x / surface->w;
		uvs[1] = rect->y / surface->h;
		uvs[2] = rect->x + rect->w / surface->w;
		uvs[3] = rect->y + rect->h / surface->h;
		
		VERBOSE "text-coords [" << uvs[0] << "," << uvs[1] << "," << uvs[2] << "," << uvs[3] << ENDL;

		return uvs;
	}

	// remeber this is only OPENGL, OPENGLES2 it's different
	inline void opengl_draw_textured_SDL_Rect(SDL_Surface* surface, SDL_Rect* from, SDL_Rect* to) {
		GLfloat* uvs = opengl_uv_from(surface, from);
		opengl_draw_textured_quad(
		    ((OGL_Texture*)surface->userdata),
			uvs,
			to);
		free(uvs);
	}


#endif


#define OGL_BUFFER_OFFSET(i) ((char *)NULL + (i))



