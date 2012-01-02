#include "openGL_helper.h"

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif

//
// ----------------------------------------------------------------------------------------------------
//

opengl_operators_t opengl_operator_from_string(char* str) {
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

//
// ----------------------------------------------------------------------------------------------------
//

inline void opengl_draw_colored_poly(glColor color, SDL_Rect rect) {
	GLfloat y_plus_h = (GLfloat) rect.y + rect.h,
	x_plus_w = (GLfloat) rect.x + rect.w;
	VERBOSE << "quad [";
	glColor4f(color.r, color.g, color.b, color.a); glVertex3f((float)rect.x,   (float)rect.y, 0);
	VERBOSEC << rect.x << "," << rect.y << "] [";
	glColor4f(color.r, color.g, color.b, color.a); glVertex3f((float)x_plus_w, (float)rect.y, 0);
	VERBOSEC << x_plus_w << "," << rect.y << "] [";
	glColor4f(color.r, color.g, color.b, color.a); glVertex3f((float)x_plus_w, (float)y_plus_h, 0);
	VERBOSEC << x_plus_w << "," << y_plus_h << "] [";
	glColor4f(color.r, color.g, color.b, color.a); glVertex3f((float)rect.x,   (float)y_plus_h, 0);
	VERBOSEC << rect.x << "," << y_plus_h << "]" << ENDL;
}

//
// ----------------------------------------------------------------------------------------------------
//

inline void opengl_draw_textured_quad(OGL_Texture* texture, GLfloat* uvs, SDL_Rect* dst, opengl_operators_t composite) {
	opengl_set_operator(composite);

	glEnable(GL_TEXTURE_2D);
	glBindTexture( GL_TEXTURE_2D, texture->textureID );
	
	GLfloat
	width =  (float)dst->x + dst->w,
	height = (float)dst->y + dst->h;

	VERBOSE << "texture: ID:" << texture->textureID << ENDL;
	VERBOSE << "quad [";
	VERBOSEC << dst->x << "(" << uvs[0] << ")," << dst->y << "(" << uvs[1]<< ")] [";
	VERBOSEC << width << "(" << uvs[2] << ")," << dst->y << "("<< uvs[1]<< "] [";
	VERBOSEC << width << "(" << uvs[2] << ")," << height << "(" << uvs[3] << ")] [";
	VERBOSEC << dst->x << "(" << uvs[0] <<")," << height << "(" << uvs[3] <<")]" << ENDL;


	
#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
	glBegin(GL_QUADS);
	glTexCoord2f(uvs[0], uvs[1]); glVertex3f((float)dst->x, (float)dst->y, 0);
	glTexCoord2f(uvs[2], uvs[1]); glVertex3f((float)width,  (float)dst->y, 0);
	glTexCoord2f(uvs[2], uvs[3]); glVertex3f((float)width,  (float)height, 0);
	glTexCoord2f(uvs[0], uvs[3]); glVertex3f((float)dst->x, (float)height, 0);
	glEnd();
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
	GLfloat vertices[] = {
		dst->x, dst->y, 0,
		width,  dst->y, 0,
		width,  height, 0,
		dst->x, height, 0,
	};
	/* GL_TRIANGLE ?
	GLubyte indices[] = {
		0,1,2,
		0,2,3
	};
	*/
	
	glEnableClientState(GL_VERTEX_ARRAY);
	
	glVertexPointer(3, GL_FLOAT, 0, vertices);
	glTexCoordPointer(2, GL_FLOAT, 0, uvs);
	glEnableClientState(GL_VERTEX_ARRAY);
	glEnableClientState(GL_TEXTURE_COORD_ARRAY);

	// draw a cube
	// better GL_TRIANGLE_STRIP ?
	glDrawArrays(GL_QUADS, 0, 4);
	//glDrawElements(GL_QUADS, 4, GL_UNSIGNED_BYTE, indices);
	
	glDisableClientState(GL_VERTEX_ARRAY);
	glDisableClientState(GL_TEXTURE_COORD_ARRAY);

	// deactivate vertex arrays after drawing
	glDisableClientState(GL_VERTEX_ARRAY);
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES2

#endif


	
	glDisable(GL_TEXTURE_2D);

	opengl_clear_operator();
}

//
// ----------------------------------------------------------------------------------------------------
//

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

//
// ----------------------------------------------------------------------------------------------------
//

inline void opengl_draw_textured_SDL_Rect(SDL_Surface* surface, SDL_Rect* from, SDL_Rect* to, opengl_operators_t composite) {
	GLfloat* uvs = opengl_uv_from(surface, from);
	opengl_draw_textured_quad( ((OGL_Texture*)surface->userdata), uvs, to, composite);
	free(uvs);
}

//
// ----------------------------------------------------------------------------------------------------
//

inline void opengl_set_operator(opengl_operators_t op) {
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

//
// ----------------------------------------------------------------------------------------------------
//

inline void opengl_clear_operator() {
    glDisable(GL_BLEND);
    //glDisable( GL_DEPTH_TEST );
}

//
// ----------------------------------------------------------------------------------------------------
//
