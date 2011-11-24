#include "SDL_helper.h"
#include "prerequisites.h"

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Rect(SDL_Rect* rect) {
  VERBOSE <<"x: " << rect->x << " y: " << rect->y << " w: " << rect->w << " h: " << rect->h << std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Surface(SDL_Surface* surface) {
  VERBOSE <<"w: " << surface->w << " h: " << surface->h << std::endl;
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

//
// ----------------------------------------------------------------------------------------------------
//

int nextpoweroftwo(int x) {
    double logbase2 = log(x) / log(2);
    return (int) round(pow(2,ceil(logbase2)));
}
