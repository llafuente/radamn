#include "radamn_window.h"

#include "prerequisites.h"
#include "v8_helper.h"
#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>
#include <math.h>


//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::window::screenshot(const v8::Arguments& args) {
    int width = args[0]->ToObject()->Get( v8::String::New("width"))->Int32Value();
    int height = args[0]->ToObject()->Get( v8::String::New("height"))->Int32Value();

    SDL_Surface * image = SDL_CreateRGBSurface(SDL_SWSURFACE, width, height, 24, 0x000000FF, 0x0000FF00, 0x00FF0000, 0);

    VERBOSE <<"screnshot" << height << "x" << width << std::endl;
    //glReadBuffer(GL_FRONT);
    glReadPixels(0, 0, width, height, GL_RGB, GL_UNSIGNED_BYTE, image->pixels);

    SDL_SaveBMP(image, "pic.bmp");

    SDL_FreeSurface(image);

    return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

