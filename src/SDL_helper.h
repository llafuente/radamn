#ifndef SDL_HELPER_H_
#define SDL_HELPER_H_

#include <SDL.h>
#include <v8.h>
#include <iostream>

void debug_SDL_Rect(const SDL_Rect* rect, const char* id=" ");

void debug_SDL_Surface(const SDL_Surface* surface, const char* id=" ");

inline SDL_Rect* getFullRectSurface(SDL_Surface* surface);

#define PLINE std::cout << __LINE__ << std::endl;


#endif // SDL_HELPER_H_


int nextpoweroftwo(float x);
