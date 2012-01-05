#include "radamn_font.h"

#include <SDL.h>
#include <SDL_ttf.h>
#include "prerequisites.h"
#include "radamn_image.h"
#include "v8_helper.h"
#include "SDL_helper.h"

using namespace radamn;

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Font::load(const v8::Arguments& args) {
  v8::HandleScope scope;

  VERBOSE << "load font" << ENDL;

  VERBOSE << args.Length() << " - " << args[0]->IsString() << "/" << args[1]->IsNumber() << ENDL;

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

v8::Handle<v8::Value> Radamn::Font::getImage(const v8::Arguments& args) {
    v8::HandleScope scope;

	VERBOSE << "get font image" << ENDL;

    if (!(args.Length() == 3 && args[0]->IsObject() && args[1]->IsString())) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected TTF::RenderTextBlended(Font, String, Number)")));
    }
    TTF_Font* font = 0;
    V8_UNWRAP_POINTER_ARG(0, TTF_Font, font)

    v8::String::Utf8Value text(args[1]);

    V8_ARG_TO_SDL_NEWCOLOR(2, fg_color)

    SDL_Surface *initial;
    SDL_Surface *scaled;

    int w,h;
    GLuint texture;

    /* Use SDL_TTF to render our text */
	VERBOSE << *text << ENDL;
    initial = TTF_RenderText_Blended(font, *text, fg_color);
    //initial = TTF_RenderText_Solid(font, *text, fg_color);
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

	const SDL_VideoInfo *vi = SDL_GetVideoInfo ();

    /* Convert the rendered text to a known format */
    w = nextpoweroftwo((float) initial->w);
    h = nextpoweroftwo((float) initial->h);
	VERBOSE << "Expand texture to: [" << w << "," << h << "]" << ENDL;
    scaled = SDL_CreateRGBSurface(0, w, h, vi->vfmt->BitsPerPixel, vi->vfmt->Rmask, vi->vfmt->Gmask, vi->vfmt->Bmask, vi->vfmt->Amask);
    SDL_BlitSurface(initial, 0, scaled, 0);
	VERBOSE << "Expanded" << ENDL;

	image* img = new image();
	img->load_from_surface(scaled);
	VERBOSE << "pixels" << (long int) scaled->pixels << ENDL;
	
    /* Clean up */
    SDL_FreeSurface(initial);
	SDL_FreeSurface(scaled);

#elif
    image = initial;
#endif

    if (!img) {
        return ThrowException(v8::Exception::Error(v8::String::Concat(
            v8::String::New("TTF::??"), v8::String::New(TTF_GetError())
        )));
    }
	VERBOSE << "got" << ENDL;

    return image::wrap(img);
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Font::destroy(const v8::Arguments& args) {
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

