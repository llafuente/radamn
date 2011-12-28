#include "radamn_image.h"

#include "SDL_image.h"
#include "SDL_helper.h"

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Image::load(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!(args.Length() == 1 && args[0]->IsString())) {
      return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected Radamn::Image::Load(String, String)")));
    }
    v8::String::Utf8Value id(args[0]);
    v8::String::Utf8Value file(args[0]);

    SDL_Surface *image = IMG_Load(*file);
    if(!image) {
      return ThrowException(v8::Exception::Error(v8::String::Concat(
        v8::String::New("IMG::Load: "),
        v8::String::New(IMG_GetError())
      )));
    }

    // needed for pngs ?
    //SDL_Surface* optimizedImage = SDL_DisplayFormatAlpha( image );

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

    VERBOSE << "load image(opengl)" << *file << ENDL;

    SDL_SetAlpha(image, 0 ,0);

    GLuint texture;
    /* Standard OpenGL texture creation code */
    glPixelStorei(GL_UNPACK_ALIGNMENT,4);

    glGenTextures(1,&texture);
    glBindTexture(GL_TEXTURE_2D,texture);

    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE); GL_REPEAT, GL_CLAMP
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    // Check that the image's width is a power of 2
    if ( (image->w & (image->w - 1)) != 0 ) {
        return ThrowException(v8::Exception::Error(
        v8::String::Concat(
            v8::String::Concat(
                v8::String::New("warning: "),
                v8::String::New(*file)
            ),
            v8::String::New("width is not a power of 2")
        )
        ));
    }

    GLint bpp = image->format->BytesPerPixel;
    GLenum texture_format=0;

    if(bpp == 4) {
        texture_format = image->format->Rmask ==0x000000ff ? GL_RGBA : GL_BGRA;
    } else {
        texture_format = image->format->Rmask ==0x000000ff ? GL_RGB : GL_BGR;
    }

    VERBOSE << "size(" << image->w << "," << image->h << ")" << ENDL;
    VERBOSE << "bpp(" << bpp << ")" << ENDL;

    glTexImage2D(GL_TEXTURE_2D, 0, bpp, image->w, image->h, 0, texture_format, GL_UNSIGNED_BYTE, image->pixels);


    VERBOSE << "free image pixels memory" << ENDL;
    SDL_free(image->pixels); //pixels are not needed so free!

    image->userdata = (OGL_Texture*) new OGL_Texture;
    ((OGL_Texture*) image->userdata)->textureID = texture;
    VERBOSE << "loaded" << ENDL;

#endif
    RETURN_WRAP_IMAGE(image)
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Image::destroy(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!(args.Length() == 1 && args[0]->IsObject())) {
      return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected Radamn::Image::destroy(PointerToSurface)")));
    }

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    SDL_Surface* target=0;
    UNWRAP_IMAGE(0, target);

    if(target != 0)
        SDL_FreeSurface(target);
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    GLuint texture;
    UNWRAP_IMAGE(0, texture);
    glDeleteTextures(1, &texture);
#endif

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Image::draw(const v8::Arguments& args) {
  v8::HandleScope scope;

  VERBOSE << "draw[" << args.Length() << "] expected[1111] recieved["
    << args[0]->IsObject()
    << args[1]->IsObject()
    << args[2]->IsNumber()
    << args[3]->IsNumber()
    << "]"
    << ENDL;

  // 3 args! <image>,<image>,<number>,<number>

  bool error = false;

  V8_CHECK_ARGS(0, Object)
  V8_CHECK_ARGS(1, Object)
  V8_CHECK_ARGS(1, Number)
  V8_CHECK_ARGS(1, Number)

  if(!(
    args.Length() == 4
    || args.Length() == 6
    || args.Length() == 10
  )) {
      return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid argument count [4,6,10]")));
  }

    SDL_Surface* src = 0;
    SDL_Surface* dst = 0;

    V8_UNWRAP_POINTER_ARG(0, SDL_Surface, src)
    V8_UNWRAP_POINTER_ARG(1, SDL_Surface, dst)

    VERBOSE << "blit image from: " << src << " to:" << dst << ENDL;
    VERBOSE << "blit image from: " << src << " to:" << dst << ENDL;

    SDL_Rect* dstrect = 0;
    SDL_Rect* srcrect = 0;

    if(args.Length() == 4) {
	VERBOSE << "WTF!" << args[2]->Int32Value();
        dstrect = new SDL_Rect();
        dstrect->x = args[2]->Int32Value();
        dstrect->y = args[3]->Int32Value();
        dstrect->w = dstrect->x + src->w;
        dstrect->h = dstrect->y + src->h;

        srcrect = getFullRectSurface(src);
    }

    if(args.Length() == 6) {
        dstrect = new SDL_Rect();
        dstrect->x = args[2]->Int32Value();
        dstrect->y = args[3]->Int32Value();
        dstrect->w = dstrect->x + args[4]->Int32Value();
        dstrect->h = dstrect->y + args[5]->Int32Value();

        SDL_RECT_P(srcrect, 0, 0, args[4]->Int32Value(), args[5]->Int32Value())
    }

    if(args.Length() == 10) {
        SDL_RECT_P(srcrect, args[2]->Int32Value(), args[3]->Int32Value(), args[4]->Int32Value(), args[5]->Int32Value())
        SDL_RECT_P(dstrect, args[6]->Int32Value(), args[7]->Int32Value(), args[6]->Int32Value() + args[8]->Int32Value(), args[7]->Int32Value() + args[9]->Int32Value())
    }

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    if (SDL_gfxBlitRGBA(src, srcrect, dst, dstrect) < 0) { //SDL_BlitSurface
        //return ThrowSDLException(__func__);
    }
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// if alpha!
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    //glBlendFunc(GL_SRC_ALPHA, GL_ONE); transparent ??!
//endif

    debug_SDL_Surface(src);
    debug_SDL_Rect(srcrect);
    debug_SDL_Rect(dstrect);

    SDL_RECT_TO_QUAD(src, srcrect, dstrect)

/*
    GLfloat xLowerLeft  = ((float) srcrect->x) / src->w;
    GLfloat yLowerLeft  = ((float) srcrect->y) / src->h;
    GLfloat xUpperRight = ((float) (srcrect->x + srcrect->w)) / src->w;
    GLfloat yUpperRight = ((float) (srcrect->y + srcrect->h)) / src->h;

    VERBOSEF("text-coords [%f,%f,%f,%f]\n", xLowerLeft, yLowerLeft, xUpperRight, yUpperRight);

    glEnable(GL_TEXTURE_2D);
        OGL_Texture* t = (OGL_Texture*)src->userdata;
        glBindTexture( GL_TEXTURE_2D, t->textureID );
        glBegin(GL_QUADS);
            VERBOSE << "texture: ID:" << t->textureID << " [" << src->w << "," << src->h << "]"<< ENDL;
            VERBOSE << "quad [";
            glTexCoord2f(xLowerLeft, yLowerLeft); glVertex3f(dstrect->x, dstrect->y, 0);
            VERBOSEC << dstrect->x << "," << dstrect->y << "] [";
            glTexCoord2f(xUpperRight, yLowerLeft); glVertex3f(dstrect->w, dstrect->y, 0);
            VERBOSEC << dstrect->w << "," << dstrect->y << "] [";
            glTexCoord2f(xUpperRight, yUpperRight); glVertex3f(dstrect->w, dstrect->h, 0);
            VERBOSEC << dstrect->w << "," << dstrect->h << "] [";
            glTexCoord2f(xLowerLeft, yUpperRight); glVertex3f(dstrect->x, dstrect->h, 0);
            VERBOSEC << dstrect->x << "," << dstrect->h << "]" << ENDL;
        glEnd();
    glDisable(GL_TEXTURE_2D);
*/
    glDisable(GL_BLEND);

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    return ThrowException(v8::Exception::TypeError(v8::String::New("OPENGLES is not supported atm")));
#endif

    return v8::True();
}


/*
//
// ----------------------------------------------------------------------------------------------------
//
// study! http://www.songho.ca/opengl/gl_vertexarray.html
static v8::Handle<v8::Value> Radamn::Image::genBufferDraws(const v8::Arguments& args) {

 dont have VBO in my virtual machine... This is so unfortunate
    OGL_DrawBufferTextured* buffer = new OGL_DrawBufferTextured;

    SDL_Surface* image = 0;

    V8_UNWRAP_POINTER_ARG(0, SDL_Surface, image)

    buffer->textureID = ((OGL_Texture*)image->userdata)->textureID;

    V8_ARG_TO_NEWARRAY(1, quads)
    std::cout << "rendering["<< quads->Length() <<"] quads!!" << ENDL;

    unsigned int pi = sizeof(GLfloat) * 8;
    unsigned int ci = sizeof(GLfloat) * 4;

    buffer->positionSize = pi * quads->Length();
    buffer->coordsSize = ci * quads->Length();

    //malloc ?
    buffer->positions = new GLfloat[quads->Length() * 8];
    buffer->coords = new GLfloat[quads->Length() * 4];

    for(int i=0,max=MAX(5, quads->Length()); i<max; ++i) {

        V8_EXTRACT_FROM_ARRAY(quads, i, GLfloat, quad, 8);
        std::cout
            << quad[0] << ","
            << quad[1] << ","
            << quad[2] << ","
            << quad[3] << ","
            << quad[4] << ","
            << quad[5] << ","
            << quad[6] << ","
            << quad[7] << ENDL;

        GL_UV_FROM_SDL(image, buffer->positions[0], buffer->positions[1], buffer->positions[2], buffer->positions[3], UV)
        std::cout
            << UV[0] << ","
            << UV[1] << ","
            << UV[2] << ","
            << UV[3] << ","
            << ENDL;

         GL_DRAW_QUAD(
             UV[0], UV[1], UV[2], UV[3],
             quad[4], quad[5], quad[6], quad[7]
         )

         buffer->positions[0] = quad[4]; //x
         buffer->positions[1] = quad[5]; //y
         buffer->positions[2] = quad[4] + quad[6]; //w
         buffer->positions[3] = quad[5] + quad[7]; //h

         buffer->positions += pi;
         buffer->coords += ci;
    }

    //position
    glGenBuffers(1, &buffer->positionBuffer);
    glBindBuffer(GL_ARRAY_BUFFER, buffer->positionBuffer);
    glBufferData(GL_ARRAY_BUFFER, buffer->positionSize, buffer->positions, GL_STATIC_DRAW);


    //coords
    glGenBuffers(1, &buffer->coordsBuffer);
    glBindBuffer(GL_TEXTURE_COORD_ARRAY, buffer->coordsBuffer);
    glBufferData(GL_TEXTURE_COORD_ARRAY, buffer->coordsSize, buffer->coords, GL_STREAM_DRAW);

    //free positions and coords ?

}
//
// ----------------------------------------------------------------------------------------------------
//
// study! http://www.songho.ca/opengl/gl_vertexarray.html
static v8::Handle<v8::Value> Radamn::Image::drawBuffer(const v8::Arguments& args) {

    OGL_DrawBufferTextured* buffer = new OGL_DrawBufferTextured;

    V8_UNWRAP_POINTER_ARG(0, OGL_DrawBufferTextured, buffer)

    glBindTexture(GL_TEXTURE_2D, buffer->textureID);


    glBindBuffer(GL_ARRAY_BUFFER, buffer->positionBuffer);
    glVertexPointer(2, GL_FLOAT, 0, 0);

    glBindBuffer(GL_ARRAY_BUFFER, buffer->coordsBuffer);
    glTexCoordPointer(2, GL_FLOAT, 0, 0);

    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_TEXTURE_COORD_ARRAY);

    glDrawArrays(GL_TRIANGLE_STRIP, 0, buffer->positionBuffer);


    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindBuffer(GL_TEXTURE_COORD_ARRAY, 0);

    glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glDisableClientState(GL_VERTEX_ARRAY);
}
*/

