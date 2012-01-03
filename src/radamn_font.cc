#include "radamn_font.h"

#include <SDL_ttf.h>


//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Font::load(const v8::Arguments& args) {
  v8::HandleScope scope;

  VERBOSE << args.Length() << " - " << args[0]->IsString() << "/" << args[1]->IsNumber() << std::endl;

  if (!(args.Length() == 2 && args[0]->IsString() && args[1]->IsNumber())) {
    return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected TTF::OpenFont(String, Number)")));
  }

  v8::String::Utf8Value file(args[0]);
  int ptsize = (args[1]->Int32Value());

  TTF_Font* font = TTF_OpenFont(*file, ptsize);
  if (font == NULL) {
    return ThrowException(v8::Exception::Error(v8::String::Concat(
      v8::String::New("TTF::OpenFont: "),
      v8::String::New(TTF_GetError())
    )));
  }

  V8_RETURN_WRAPED_POINTER(scope, SDL_Font, font)
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Font::getImage(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!(args.Length() == 3 && args[0]->IsObject() && args[1]->IsString())) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected TTF::RenderTextBlended(Font, String, Number)")));
    }
    TTF_Font* font = 0;
    V8_UNWRAP_POINTER_ARG(0, TTF_Font, font)

    v8::String::Utf8Value text(args[1]);

    V8_ARG_TO_SDL_NEWCOLOR(2, fg_color)

    SDL_Surface *initial;
    SDL_Surface *image;

    int w,h;
    GLuint texture;

    /* Use SDL_TTF to render our text */
	VERBOSE << *text << ENDL;
    //initial = TTF_RenderText_Blended(font, *text, fg_color);
    initial = TTF_RenderText_Solid(font, *text, fg_color);
	//initial = TTF_RenderUTF8_Blended(font, *text, fg_color);


/*
initial =
#if RENDER_MODE==0
                TTF_RenderText_Solid(font, *text, fg_color);
#elif RENDER_MODE==1
                int bgCode = args[3]->Int32Value();
                SDL_Color bgcolor;
                SDL_GetRGB(bgCode, vfmt, &bgcolor.r, &bgcolor.g, &bgcolor.b);
                TTF_RenderText_Shaded(font, *text, fg_color, bgcolor);
#elif RENDER_MODE==2
                TTF_RenderText_Blended(font, *text, fg_color);
#endif
*/


#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
    //upload to opengl and return this is not efficiency so i maybe need to think another method...

    /* Convert the rendered text to a known format */
    w = nextpoweroftwo((float) initial->w);
    h = nextpoweroftwo((float) initial->h);
	VERBOSE << "Expand texture to: [" << w << "," << h << "]" << ENDL;
    image = SDL_CreateRGBSurface(0, w, h, 32, 0x00ff0000, 0x0000ff00, 0x000000ff, 0xff000000);
    SDL_BlitSurface(initial, 0, image, 0);
	VERBOSE << "Expanded" << ENDL;

    /* Tell GL about our new texture */
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);

    GLint bpp = image->format->BytesPerPixel;
    GLenum texture_format=0;

    if(bpp == 4 ) {
        texture_format = image->format->Rmask ==0x000000ff ? GL_RGBA : GL_BGRA;
    } else {
        texture_format = image->format->Rmask ==0x000000ff ? GL_RGB : GL_BGR;
    }

    VERBOSE << "bpp" << bpp << ENDL;

    glTexImage2D(GL_TEXTURE_2D, 0, bpp, image->w, image->h, 0, texture_format, GL_UNSIGNED_BYTE, image->pixels);


    /* GL_NEAREST looks horrible, if scaled... */
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);


    /* Clean up */
    SDL_FreeSurface(initial);

    SDL_free(image->pixels); //pixels are not needed so free!
	image->pixels = 0;
	VERBOSE << "allocate OGL_Texture" << ENDL;
    image->userdata = (OGL_Texture*) SDL_malloc(sizeof(OGL_Texture));
    ((OGL_Texture*) image->userdata)->textureID = texture;
#elif
    image = initial;
#endif

    if (!image) {
        return ThrowException(v8::Exception::Error(v8::String::Concat(
            v8::String::New("TTF::??"), v8::String::New(TTF_GetError())
        )));
    }
	VERBOSE << "got" << ENDL;

    RETURN_WRAP_IMAGE(image)
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Font::destroy(const v8::Arguments& args) {
  v8::HandleScope scope;

  TTF_Font* font = 0;
  V8_UNWRAP_POINTER_ARG(0, TTF_Font, font)

  if(font) {
    TTF_CloseFont(font);
  }

  return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//
