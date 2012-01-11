#include "radamn_gl.h"

using namespace radamn;

gl* gl::instance = 0;

//
// ----------------------------------------------------------------------------------------------------
//

gl* gl::singleton() {

	if(!gl::instance) {
		gl::instance = new gl();
	}
	
	return gl::instance;
}

//
// ----------------------------------------------------------------------------------------------------
//

gl_operators gl::operator_from_string(char* str) {
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

void gl::set_operator(gl_operators op) {
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

void gl::clear_operator() {
    glDisable(GL_BLEND);
    //glDisable( GL_DEPTH_TEST );
}


//
// ----------------------------------------------------------------------------------------------------
//


//
// ----------------------------------------------------------------------------------------------------
//