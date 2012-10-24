#include "radamn_window.h"

#include "prerequisites.h"
#include "v8_helper.h"
#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>
#include <math.h>


SDL_Window* radamn::window::win = 0;
SDL_Renderer * radamn::window::renderer = 0;
SDL_GLContext radamn::window::context;
int radamn::window::width = 0;
int radamn::window::height = 0;

Uint32 radamn::window::rmask = 0;
Uint32 radamn::window::gmask = 0;
Uint32 radamn::window::bmask = 0;
Uint32 radamn::window::amask = 0;
int radamn::window::bpp = 0;

Uint32 radamn::window::mBackgroundColor = 0;

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::window::v8_screenshot(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

    int width = args[0]->ToObject()->Get( v8::String::New("width"))->Int32Value();
    int height = args[0]->ToObject()->Get( v8::String::New("height"))->Int32Value();

    SDL_Surface * image = SDL_CreateRGBSurface(SDL_SWSURFACE, width, height, 24, 0x000000FF, 0x0000FF00, 0x00FF0000, 0);

    VERBOSE <<"screnshot" << height << "x" << width << std::endl;
    //glReadBuffer(GL_FRONT);
    glReadPixels(0, 0, width, height, GL_RGB, GL_UNSIGNED_BYTE, image->pixels);

    SDL_SaveBMP(image, "pic.bmp");

    SDL_FreeSurface(image);

    VERBOSE << "end" << ENDL;

    return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

