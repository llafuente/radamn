#ifndef SDL_HELPER_H_
#define SDL_HELPER_H_

#include <SDL.h>
#include <v8.h>
#include <iostream>

void debug_SDL_Rect(SDL_Rect* rect);

void debug_SDL_Surface(SDL_Surface* surface);

inline SDL_Rect* getFullRectSurface(SDL_Surface* surface);

#define PLINE std::cout << __LINE__ << std::endl;


#endif // SDL_HELPER_H_


int nextpoweroftwo(int x);
