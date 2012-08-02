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

bool radamn::font::load_from_file(char* filename, int ptsize) {
    this->mfont = TTF_OpenFont(filename, ptsize);
    if (this->mfont == NULL) {
        THROW("TTF::OpenFont: ", TTF_GetError());
        return false;
    }
    return true;

}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> font::wrap(font* fnt) {
    if (font_template_.IsEmpty()) {
        v8::HandleScope handle_scope2;
        v8::Handle<v8::ObjectTemplate> result = v8::ObjectTemplate::New();
        result->SetInternalFieldCount(1);
        v8::Handle<v8::ObjectTemplate> raw_template = handle_scope2.Close(result);
        font_template_ = v8::Persistent<v8::ObjectTemplate>::New(raw_template);
    }

    v8::Handle<v8::ObjectTemplate> templ = font_template_;
    v8::Handle<v8::Object> result = templ->NewInstance();
    v8::Handle<v8::External> request_ptr = v8::External::New(fnt);
    result->SetInternalField(0, request_ptr);
    result->Set(v8::String::New("monospaced"), v8::Boolean::New( TTF_FontFaceIsFixedWidth(fnt->mfont) > 0 ));
    return result;
}

//
// ----------------------------------------------------------------------------------------------------
//

font* font::unwrap(const v8::Arguments& args, int position) {
    return font::unwrap(args[position]);
}

//
// ----------------------------------------------------------------------------------------------------
//

font* font::unwrap(v8::Local<v8::Value> handle) {
    v8::Handle<v8::External> v8_aux_field = v8::Handle<v8::External>::Cast((handle->ToObject())->GetInternalField(0));
    void* v8_aux_ptr = v8_aux_field->Value();
    return static_cast<font*>(v8_aux_ptr);
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_font_load(const v8::Arguments& args) {
    v8::HandleScope scope;

    VERBOSE << "v8_font_load(" << args.Length() << "@ " << args[0]->IsString() << "," << args[1]->IsNumber() << ")" << ENDL;

    if (!(args.Length() == 2 && args[0]->IsString() && args[1]->IsNumber())) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected TTF::OpenFont(String, Number)")));
    }

    v8::String::Utf8Value file(args[0]);
    int ptsize = (args[1]->Int32Value());

    font* fnt = font_new(*file, ptsize);
    return font::wrap(fnt);
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_font_text_to_image(const v8::Arguments& args) {
    v8::HandleScope scope;

    VERBOSE << "v8_font_text_to_image(" << args.Length() << "@ " << args[0]->IsObject() << "," << args[1]->IsString() << ")" << ENDL;

    if (!(args.Length() == 3 && args[0]->IsObject() && args[1]->IsString())) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected TTF::RenderTextBlended(Font, String, Number)")));
    }

    font* fnt = font::unwrap(args, 0);

    v8::String::Utf8Value text(args[1]);

    VERBOSE << "rendering text: " << *text << ENDL;

    //int x;
    //uint16_t* uni = (uint16_t*) malloc(sizeof(uint16_t) * text.length);
    //UTF8_to_UNICODE(uni, *text, strlen(*text));

    V8_ARG_TO_SDL_NEWCOLOR(2, fg_color)

    image* img = fnt->get_text_image(*text, fg_color);
    //free(uni);

    return image::wrap(img);
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_font_destroy(const v8::Arguments& args) {
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

v8::Handle<v8::Value> radamn::v8_font_text_size(const v8::Arguments& args) {
    v8::HandleScope scope;

    font* fnt = font::unwrap(args, 0);
    v8::String::Utf8Value text(args[1]);

    SDL_Rect rect = fnt->get_text_size(*text);

    std::cout << "measuring: " << *text << ENDL;
    std::cout << "width" << rect.w << ENDL;
    std::cout << "height" << rect.h << ENDL;

    v8::Local<v8::Object> result = v8::Object::New();
    result->Set(v8::String::New("width"), v8::Number::New(rect.w));
    result->Set(v8::String::New("height"), v8::Number::New(rect.h));

    return result;
}

//
// ----------------------------------------------------------------------------------------------------
//

bool font::has_glyph(char* glyph) {
    return true;
}


//
// ----------------------------------------------------------------------------------------------------
//

SDL_Rect font::get_text_size(char* text) {
    SDL_Rect rect = {0,0,0,0};

    TTF_SizeUTF8(this->mfont, text, &rect.w,&rect.h);

    return rect;
}

//
// ----------------------------------------------------------------------------------------------------
//

image* font::get_text_image(const char* text, SDL_Color fg_color) {
    SDL_Surface *initial;
    SDL_Surface *scaled;

    std::cout << text << ENDL;

    int w,h;
    GLuint texture;

    /* Use SDL_TTF to render our text */
    VERBOSE << *text << ENDL;
    initial = TTF_RenderUTF8_Blended(this->mfont, text, fg_color);
    //TODO SDL_DisplayFormatAlpha ?? instead of hack GL_ONE,GL_ONE
    //initial = TTF_RenderText_Solid(font, *text, fg_color);

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
        THROW("TTF error: ", TTF_GetError());
    }
    VERBOSE << "got" << ENDL;
    return img;
}

//
// ----------------------------------------------------------------------------------------------------
//

image* font::get_text_image(uint16_t* text, SDL_Color fg_color) {
    SDL_Surface *initial;
    SDL_Surface *scaled;

    std::cout << text << ENDL;

    int w,h;
    GLuint texture;

    /* Use SDL_TTF to render our text */
    VERBOSE << *text << ENDL;
    initial = TTF_RenderUNICODE_Blended(this->mfont, text, fg_color);
    //TODO SDL_DisplayFormatAlpha ?? instead of hack GL_ONE,GL_ONE
    //initial = TTF_RenderText_Solid(font, *text, fg_color);

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
        THROW("TTF error: ", TTF_GetError());
    }
    VERBOSE << "got" << ENDL;
    return img;
}

//
// ----------------------------------------------------------------------------------------------------
//

font* radamn::font_new(char* filename, int ptsize) {
    font* fnt = new font();
    fnt->load_from_file(filename, ptsize);
    return fnt;
}

//
// ----------------------------------------------------------------------------------------------------
//

void radamn::font_free(font* fnt) {
    delete fnt;
}
