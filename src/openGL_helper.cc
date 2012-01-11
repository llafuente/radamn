#include "openGL_helper.h"

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif

#include <SDL.h>
#include "prerequisites.h"
#include "radamn_gl.h"


using namespace radamn;

//
// ----------------------------------------------------------------------------------------------------
//

void opengl_draw_colored_poly(gl_color_t color, SDL_Rect rect) {
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

void opengl_draw_textured_quad(GLuint texture_id, GLfloat* uvs, SDL_Rect* dst, gl_operators_t composite) {
	gl::set_operator(composite);

	glEnable(GL_TEXTURE_2D);
	glBindTexture( GL_TEXTURE_2D, texture_id );
	
	GLfloat
	width =  (float)dst->x + dst->w,
	height = (float)dst->y + dst->h;

	VERBOSE << "texture: ID:" << texture_id << ENDL;
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

	gl::clear_operator();
	VERBOSE << "done" << ENDL;
}

//
// ----------------------------------------------------------------------------------------------------
//

GLfloat* opengl_uv_from(SDL_Surface* surface, SDL_Rect* rect) {
	GLfloat* uvs = (GLfloat*) malloc(4*sizeof(GLfloat));

	debug_SDL_Surface(surface, "surface from");
	debug_SDL_Rect(rect, "rectangle from");

	uvs[0] = ((GLfloat)rect->x) / surface->w;
	uvs[1] = ((GLfloat)rect->y) / surface->h;
	uvs[2] = ((GLfloat)(rect->x + rect->w)) / surface->w;
	uvs[3] = ((GLfloat)(rect->y + rect->h)) / surface->h;

	using std::setprecision;
	using std::numeric_limits;

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

void opengl_draw_textured_SDL_Rect(image* img, SDL_Rect* from, SDL_Rect* to, gl_operators_t composite) {
	GLfloat* uvs = img->uv_from(from);
	opengl_draw_textured_quad(img->texture_id, uvs, to, composite);
	free(uvs);
}

//
// ----------------------------------------------------------------------------------------------------
//
