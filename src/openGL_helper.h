#include <SDL_helper.h>
#include <iostream>
#include <iomanip>
#include <limits>
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
    }                                                                                                                                      \

     /// from cairo
    typedef enum opengl_operators {
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
    } opengl_operators;
	
	
	opengl_operators opengl_operator_from_string(char* str) {
		if(0 == strcmp(str, "clear")) return OPERATOR_CLEAR;
		if(0 == strcmp(str, "source-atop")) return OPERATOR_ATOP;
		if(0 == strcmp(str, "source-in")) return OPERATOR_IN;
		if(0 == strcmp(str, "source-out")) return OPERATOR_OUT;
		if(0 == strcmp(str, "source-over")) return OPERATOR_OVER;
		if(0 == strcmp(str, "destination-atop")) return OPERATOR_DEST_ATOP;
		if(0 == strcmp(str, "destination-in")) return OPERATOR_DEST_IN;
		if(0 == strcmp(str, "destination-out")) return OPERATOR_DEST_OUT;
		if(0 == strcmp(str, "destination-over")) return OPERATOR_DEST_OVER;
		if(0 == strcmp(str, "xor")) return OPERATOR_XOR;
		if(0 == strcmp(str, "copy")) return OPERATOR_ADD;

		ThrowException(v8::Exception::TypeError(v8::String::New("Invalid argument opengl_operator_from_string()")));
		return OPERATOR_CLEAR;
	}
	
	
     /// from cairo
     /// build a unit test: http://forums.inside3d.com/viewtopic.php?t=1419
     inline void opengl_set_operator(opengl_operators op) {
        struct {
        GLenum src;
        GLenum dst;
        } blend_factors[] = {
        { GL_ZERO, GL_ZERO }, /* Clear */
        { GL_ONE, GL_ZERO }, /* Source */
        { GL_ONE, GL_ONE_MINUS_SRC_ALPHA }, /* Over */
        { GL_DST_ALPHA, GL_ZERO }, /* In */
        { GL_ONE_MINUS_DST_ALPHA, GL_ZERO }, /* Out */
        { GL_DST_ALPHA, GL_ONE_MINUS_SRC_ALPHA }, /* Atop */

        { GL_ZERO, GL_ONE }, /* Dest */
        { GL_ONE_MINUS_DST_ALPHA, GL_ONE }, /* DestOver */
        { GL_ZERO, GL_SRC_ALPHA }, /* DestIn */
        { GL_ZERO, GL_ONE_MINUS_SRC_ALPHA }, /* DestOut */
        { GL_ONE_MINUS_DST_ALPHA, GL_SRC_ALPHA }, /* DestAtop */

        { GL_ONE_MINUS_DST_ALPHA, GL_ONE_MINUS_SRC_ALPHA }, /* Xor */
        { GL_ONE, GL_ONE }, /* Add */
        };
        GLenum src_factor, dst_factor;

        /* different dst and component_alpha changes cause flushes elsewhere
        if (ctx->current_operator != op)
            _cairo_gl_composite_flush (ctx);
        ctx->current_operator = op;
		*/

        src_factor = blend_factors[op].src;
        dst_factor = blend_factors[op].dst;

        /* Even when the user requests CAIRO_CONTENT_COLOR, we use GL_RGBA
         * due to texture filtering of GL_CLAMP_TO_BORDER.  So fix those
         * bits in that case.
         
        if (ctx->current_target->base.content == CAIRO_CONTENT_COLOR) {
        if (src_factor == GL_ONE_MINUS_DST_ALPHA)
            src_factor = GL_ZERO;
        if (src_factor == GL_DST_ALPHA)
            src_factor = GL_ONE;
        }
        */
		
		// image has alpha and source-top
		if(true) {
			if(dst_factor == GL_ONE_MINUS_SRC_ALPHA && src_factor == GL_ONE) {
				src_factor = GL_SRC_ALPHA;
			} else if (dst_factor == GL_ONE_MINUS_SRC_ALPHA) {
				dst_factor = GL_ONE_MINUS_SRC_COLOR;
			} else if (dst_factor == GL_SRC_ALPHA) {
				dst_factor = GL_SRC_COLOR;
			}
		}
		
/*
        if (component_alpha) {
        if (dst_factor == GL_ONE_MINUS_SRC_ALPHA)
            dst_factor = GL_ONE_MINUS_SRC_COLOR;
        if (dst_factor == GL_SRC_ALPHA)
            dst_factor = GL_SRC_COLOR;
        }

        //mask
        if (ctx->current_target->base.content == CAIRO_CONTENT_ALPHA) {
            glBlendFuncSeparate (GL_ZERO, GL_ZERO, src_factor, dst_factor);
        //color
        } else if (ctx->current_target->base.content == CAIRO_CONTENT_COLOR) {
            glBlendFuncSeparate (src_factor, dst_factor, GL_ONE, GL_ONE);
        } else {
            // image
            glBlendFunc (src_factor, dst_factor);
        }
        */
        
		glEnable(GL_BLEND);
        glBlendFunc (src_factor, dst_factor);
		//glEnable( GL_DEPTH_TEST );
		//glDepthFunc( GL_LEQUAL );
     }
     
     inline void opengl_clear_operator() {
		glDisable(GL_BLEND);
		//glDisable( GL_DEPTH_TEST );
     }
	
	inline void opengl_draw_textured_quad(OGL_Texture* texture, GLfloat* uvs, SDL_Rect* dst, opengl_operators composite = OPERATOR_OVER) {
		opengl_set_operator(composite);

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
		
		opengl_clear_operator();
	}

	inline GLfloat* opengl_uv_from(SDL_Surface* surface, SDL_Rect* rect) {
		GLfloat* uvs = (GLfloat*) malloc(4*sizeof(GLfloat));
		
		debug_SDL_Surface(surface, "surface from");
		debug_SDL_Rect(rect, "rectangle from");

		uvs[0] = ((GLfloat)rect->x) / surface->w;
		uvs[1] = ((GLfloat)rect->y) / surface->h;
		uvs[2] = ((GLfloat)(rect->x + rect->w)) / surface->w;
		uvs[3] = ((GLfloat)(rect->y + rect->h)) / surface->h;
		
		using std::setprecision;
		using std::numeric_limits;
		
		VERBOSE << VERBOSEF("text-coords [%d,%d,%d,%d]", uvs[0], uvs[1], uvs[2], uvs[3]);
		
		VERBOSE 
     	<< "text-coords ["
		<< setprecision(6) << uvs[0] << ","
		<< setprecision(6) << uvs[1] << "," 
		<< setprecision(6) << uvs[2] << ","
		<< setprecision(6) << uvs[3] << "]"<< ENDL;

		return uvs;
	}

	// remeber this is only OPENGL, OPENGLES2 it's different
	inline void opengl_draw_textured_SDL_Rect(SDL_Surface* surface, SDL_Rect* from, SDL_Rect* to, opengl_operators composite) {
		GLfloat* uvs = opengl_uv_from(surface, from);
		opengl_draw_textured_quad( ((OGL_Texture*)surface->userdata), uvs, to, composite);
		free(uvs);
	}


#endif


#define OGL_BUFFER_OFFSET(i) ((char *)NULL + (i))



