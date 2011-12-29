#include "SDL_helper.h"
#include "prerequisites.h"

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Rect(const SDL_Rect* rect, const char* id) {
  VERBOSE << id << "[ x: " << rect->x << " y: " << rect->y << " w: " << rect->w << " h: " << rect->h << "]" << std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Surface(const SDL_Surface* surface, const char* id) {
  VERBOSE << id << "[ w: " << surface->w << " h: " << surface->h << "]" << std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

void debug_SDL_Color(const SDL_Color* color) {
  VERBOSE <<"SDL_Color rgb( " << color->r << " , " << color->g << " , " << color->b << ")" <<std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

inline SDL_Rect* getFullRectSurface(SDL_Surface* surface) {
	SDL_Rect* output = (SDL_Rect *) SDL_malloc(sizeof(SDL_Rect));

    output->x = 0;
    output->y = 0;
    output->w = surface->w;
    output->h = surface->h;

    return output;
}

//
// ----------------------------------------------------------------------------------------------------
//

int nextpoweroftwo(float x) {
    double logbase2 = log(x) / log(2.0f);
	return (int) floor(pow(2,ceil(logbase2))  + 0.5 );
}
