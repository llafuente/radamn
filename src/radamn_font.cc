#include "radamn_font.h"

#include <SDL_ttf.h>


//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Font::load(const v8::Arguments& args) {
  v8::HandleScope scope;

  std::cout << args.Length() << " - " << args[0]->IsString() << "/" << args[1]->IsNumber() << std::endl;

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

  if (!(args.Length() == 3 && args[0]->IsObject() && args[1]->IsString() && args[2]->IsNumber())) {
    return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected TTF::RenderTextBlended(Font, String, Number)")));
  }

  TTF_Font* font = 0;
  V8_UNWRAP_POINTER_ARG(0, TTF_Font, font)

  v8::String::Utf8Value text(args[1]);

  V8_ARG_TO_SDL_NEWCOLOR(2, fg_color)

  SDL_Surface *resulting_text;
  resulting_text = // TTF_RenderText_Blended(font, *text, fg_color);
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


  if (!resulting_text) {
    return ThrowException(v8::Exception::Error(v8::String::Concat(
      v8::String::New("TTF::"), v8::String::New(TTF_GetError())
    )));
  }

  V8_RETURN_WRAPED_POINTER(scope, SDL_Surface, resulting_text)
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
