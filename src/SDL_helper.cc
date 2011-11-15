#include "SDL_helper.h"
#include "prerequisites.h"

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Rect(SDL_Rect* rect) {
  std::cout <<"x: " << rect->x << " y: " << rect->y << " w: " << rect->w << " h: " << rect->h << std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Surface(SDL_Surface* surface) {
  std::cout <<"w: " << surface->w << " h: " << surface->h << std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

inline SDL_Rect* getFullRectSurface(SDL_Surface* surface) {
    SDL_Rect* output = new SDL_Rect();

    output->x = 0;
    output->y = 0;
    output->w = surface->w;
    output->h = surface->h;

    return output;
}

