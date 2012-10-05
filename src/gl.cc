#include "gl.h"
#include "v8_helper.h"

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

GLuint gl::gen_texture_id() {
    GLuint aux;
    glGenTextures(1, &aux);

    VERBOSE << aux << ENDL;

    return aux;
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

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_COLOR, GL_ONE_MINUS_SRC_ALPHA);
    glDepthFunc( GL_LEQUAL );

    return ;

    //this code is buggy!


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

    //glEnable(GL_BLEND);
    //glBlendFunc (src_factor, dst_factor);
    glEnable( GL_DEPTH_TEST );
    glDepthFunc( GL_LEQUAL );
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

void gl::clear() {
    gl_color_t* color= &(gl::singleton()->background);
    glClearColor(color->r, color->g, color->b, color->a);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

//
// ----------------------------------------------------------------------------------------------------
//


void gl::flip_buffers() {
    SDL_GL_SwapBuffers();
}

//
// ----------------------------------------------------------------------------------------------------
//


void gl::matrix_mult(GLfloat* matrix) {
    glMultMatrixf(matrix);
}

//
// ----------------------------------------------------------------------------------------------------
//

void gl::matrix_set(GLfloat* matrix) {
    glLoadMatrixf(matrix);
}

//
// ----------------------------------------------------------------------------------------------------
//

void gl::stroke_poly(GLfloat* points, int cpoints, int width, gl_color_t color) {
    glLineWidth (width);

    if(color.a != 1) {
        glEnable(GL_BLEND); //enable the blending
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    }

    glEnable (GL_LINE_SMOOTH);

    GLfloat before[4];
    glGetFloatv(GL_CURRENT_COLOR, before);

    glColor4f(color.r, color.g, color.b, color.a);

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

    glBegin (GL_LINE_STRIP);
    int i = 0, pos = 0;
    for(;i<cpoints;++i) {
        VERBOSE << i << "/"<< cpoints << "( "<< points[pos] << "," << points[pos+1] << ")" << ENDL;
        glVertex3f(points[pos], points[pos+1], points[pos+2]);
        pos+=3;
    }
    glEnd();

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif

    glDisable(GL_LINE_SMOOTH);
    if(color.a != 1) {
        glDisable(GL_BLEND);
    }

    glColor4f(before[0], before[1], before[2], before[3]);
}


//
// ----------------------------------------------------------------------------------------------------
//


void gl::fill_rect(SDL_Rect rect, gl_color_t color) {
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

void gl::fill_poly(GLfloat* points, int cpoints, gl_color_t color) {

    if(color.a != 1) {
        glEnable(GL_BLEND); //enable the blending
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    }

    glEnable (GL_LINE_SMOOTH);

    GLfloat before[4];
    glGetFloatv(GL_CURRENT_COLOR, before);

    glColor4f(color.r, color.g, color.b, color.a);

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

    glBegin (GL_POLYGON);
    int i = 0, pos = 0;
    for(;i<cpoints;++i) {
        VERBOSE << i << "( "<< points[pos] << "," << points[pos+1] << ")" << std::endl;
        glVertex3f (points[pos], points[pos+1], points[pos+2]);
        pos+=3;
    }
    glEnd ();

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif



    glDisable(GL_LINE_SMOOTH);
    if(color.a != 1) {
        glDisable(GL_BLEND);
    }

    glColor4f(before[0], before[1], before[2], before[3]);
}

//
// ----------------------------------------------------------------------------------------------------
//

void gl::draw_image(image* img, SDL_Rect* from, SDL_Rect* to, gl_operators composite) {
    GLfloat* uvs = img->uv_from(from);
    gl::draw_quad(img->texture_id, uvs, to, composite);
    free(uvs);
}

//
// ----------------------------------------------------------------------------------------------------
//

void gl::draw_quad(GLuint texture_id, GLfloat* uvs, SDL_Rect* dst, gl_operators_t composite) {

    gl::set_operator(composite);

    glBindTexture( GL_TEXTURE_2D, texture_id );
    glEnable(GL_TEXTURE_2D);

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


// ---------------------------------- V8 --------------------------------------------------------------\\


v8::Handle<v8::Value> radamn::v8_gl_set_background_color(const v8::Arguments& args) {
    v8::HandleScope scope;

    V8_ARG_TO_SDL_NEWCOLOR(0, color_src);

    gl::singleton()->background = gl_color_from(color_src);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_clear(const v8::Arguments& args) {
    gl::clear();

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_flip_buffers(const v8::Arguments& args) {
    v8::HandleScope scope;

    gl::flip_buffers();

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_transform(const v8::Arguments& args) {
    GLfloat m[16] = {
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    };

    V8_ARG_TO_FLOAT(0, m[0]); //m11);
    V8_ARG_TO_FLOAT(1, m[1]); //m21);
    V8_ARG_TO_FLOAT(2, m[4]); //m22);
    V8_ARG_TO_FLOAT(3, m[5]); //m12);

    V8_ARG_TO_FLOAT(4, m[12]); //dx);
    V8_ARG_TO_FLOAT(5, m[13]); //dy);

    //if(isnan(m[0])) {
    //    return v8::ThrowException(v8::Exception::Error(v8::String::New("NaN!")));
    //}

    VERBOSE << m[0] << "," << m[1] << "," << m[2] <<"," << m[3] << std::endl;
    VERBOSE << m[4] << "," << m[5] << "," << m[6] <<"," << m[7] << std::endl;
    VERBOSE << m[8] << "," << m[9] << "," << m[10] <<"," << m[11] << std::endl;
    VERBOSE << m[12] << "," << m[13] << "," << m[14] <<"," << m[15] << std::endl;

    gl::matrix_mult(m);

    return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_set_transform(const v8::Arguments& args) {
    GLfloat m[16] = {
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    };

    V8_ARG_TO_FLOAT(0, m[0]); //m11);
    V8_ARG_TO_FLOAT(1, m[1]); //m21);
    V8_ARG_TO_FLOAT(2, m[4]); //m22);
    V8_ARG_TO_FLOAT(3, m[5]); //m12);

    V8_ARG_TO_FLOAT(4, m[12]); //dx);
    V8_ARG_TO_FLOAT(5, m[13]); //dy);


    VERBOSE << m[0] << "," << m[1] << "," << m[2] <<"," << m[3] << std::endl;
    VERBOSE << m[4] << "," << m[5] << "," << m[6] <<"," << m[7] << std::endl;
    VERBOSE << m[8] << "," << m[9] << "," << m[10] <<"," << m[11] << std::endl;
    VERBOSE << m[12] << "," << m[13] << "," << m[14] <<"," << m[15] << std::endl;

    gl::matrix_set(m);

    return v8::Undefined();
}

/// TODO composite!
v8::Handle<v8::Value> radamn::v8_gl_fill(const v8::Arguments& args) {
    VERBOSE << "fill" << std::endl;

    V8_ARG_TO_NEWARRAY(0, coords);
    V8_ARG_TO_SDL_NEWCOLOR(1, color_src);
    gl_color_t color = gl_color_from(color_src);

    VERBOSE << "filling with color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")" << std::endl;

    unsigned int i = 0,
        max = coords->Length(),
        pos = 0;

    GLfloat* positions = (GLfloat*) malloc(sizeof(GLfloat) * (max+1) * 3);

    for(;i<max;++i) {
        v8_get_vec2_from_array_idx(coords, i, positions[pos], positions[pos+1]);
        positions[pos+2] = 0;
        pos+=3;
    }

    //close the path
    positions[pos] = positions[0];
    positions[pos+1] = positions[1];
    positions[pos+2] = 0;

    gl::fill_poly(positions, max+1, color);

    free(positions);

    return v8::True();
}


//
// ----------------------------------------------------------------------------------------------------
//

/// TODO composite!
v8::Handle<v8::Value> radamn::v8_gl_stroke(const v8::Arguments& args) {

    V8_ARG_TO_NEWARRAY(0, coords);
    V8_ARG_TO_NEWFLOAT(1, width);
    V8_ARG_TO_SDL_NEWCOLOR(2, color_src);
    gl_color_t color = gl_color_from(color_src);

    VERBOSE << "stroking"  <<
    " w:" << width <<
    "color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")"
    << "COORDS" << coords->Length() << std::endl;

    unsigned int i = 0,
        max = coords->Length(),
        pos = 0;

    GLfloat* positions = (GLfloat*) malloc(sizeof(GLfloat) * (max + 1) *3);

    for(;i<max;++i) {
        v8_get_vec2_from_array_idx(coords, i, positions[pos], positions[pos+1]);
        positions[pos+2] = 0;
        pos+=3;
    }
    //close the path
    /*
    positions[pos] = positions[0];
    positions[pos+1] = positions[1];
    positions[pos+2] = 0;
    */
    gl::stroke_poly(positions, max, width, color);

    free(positions);

    return v8::True();
}


//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_save(const v8::Arguments& args) {
    glPushMatrix();
    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_restore(const v8::Arguments& args) {
    glPopMatrix();
    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_translate(const v8::Arguments& args) {
    v8::HandleScope scope;

    V8_ARG_TO_NEWFLOAT(0, x)
    V8_ARG_TO_NEWFLOAT(1, y)
    V8_ARG_TO_NEWFLOAT(2, z)

    glTranslatef(x, y, z);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_rotate(const v8::Arguments& args) {
    V8_ARG_TO_NEWFLOAT(0, angle);

    glRotatef(angle, 0.0f, 0.0f, 1.0f);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_gl_scale(const v8::Arguments& args) {
    V8_ARG_TO_NEWFLOAT(0, x);
    V8_ARG_TO_NEWFLOAT(1, y);

    glScalef(x, y, 1.0f);

    return v8::True();
}