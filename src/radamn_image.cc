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

    ++Radamn::mImageCount;
    // Radamn::mImages.insert(SDL_SurfacePair(*id, image));
    // std::cout << image << *id << "/" << Radamn::mImages.size() << std::endl;

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL

    std::cout << "opengl load" << std::endl;

    SDL_SetAlpha(image, 0 ,0);

    GLuint texture;
    /* Standard OpenGL texture creation code */
    glPixelStorei(GL_UNPACK_ALIGNMENT,4);

    glGenTextures(1,&texture);
    glBindTexture(GL_TEXTURE_2D,texture);

    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    //glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
     /*
     gluBuild2DMipmaps(
         GL_TEXTURE_2D,
         3, //0
         image->w, image->h,
         GL_BGR_EXT,
         GL_UNSIGNED_BYTE,image->pixels
     );*/

    GLint bpp = image->format->BytesPerPixel;
    GLenum texture_format=0;

    if(bpp == 4 ) {
        texture_format = image->format->Rmask ==0x000000ff ? GL_RGBA : GL_BGRA;
    } else {
        texture_format = image->format->Rmask ==0x000000ff ? GL_RGB : GL_BGR;
    }

    std::cout << "bpp" << bpp << std::endl;

    glTexImage2D(GL_TEXTURE_2D, 0, bpp, image->w, image->h, 0, texture_format, GL_UNSIGNED_BYTE, image->pixels);


    SDL_free(image->pixels); //pixels are not needed so free!

    image->userdata = (OGL_Texture*) new OGL_Texture;
    ((OGL_Texture*) image->userdata)->textureID = texture;

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

  std::cout << "draw: " << args.Length() << std::endl;
  std::cout
    << args[0]->IsObject()
    << args[1]->IsObject()
    << args[2]->IsNumber()
    << args[3]->IsNumber()
    << std::endl;

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

    std::cout << "blit image from: " << src << " to:" << dst << std::endl;

    SDL_Rect* dstrect = 0;
    SDL_Rect* srcrect = 0;

    if(args.Length() == 4) {
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
        SDL_RECT_P(dstrect, args[6]->Int32Value(), args[7]->Int32Value(), args[8]->Int32Value(), args[9]->Int32Value())
    }

    debug_SDL_Rect(srcrect);
    debug_SDL_Rect(dstrect);
    debug_SDL_Surface(src);
    debug_SDL_Surface(dst);

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    if (SDL_gfxBlitRGBA(src, srcrect, dst, dstrect) < 0) { //SDL_BlitSurface
        //return ThrowSDLException(__func__);
    }
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// if alpha!
    glEnable(GL_TEXTURE_2D);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
//endif

//
    OGL_Texture* t = (OGL_Texture*)src->userdata;
    SDL_RECT_TO_QUAD(t->textureID, srcdest, dstrect)

    glDisable(GL_BLEND);
    glDisable(GL_TEXTURE_2D);
std::cout << __LINE__ << std::endl;
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    return ThrowException(v8::Exception::TypeError(v8::String::New("OPENGLES is not supported atm")));
#endif

    return v8::True();
}