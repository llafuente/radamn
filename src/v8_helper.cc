#include "v8_helper.h"

#include "prerequisites.h"

//
// ----------------------------------------------------------------------------------------------------
//

SDL_Rect newSDL_Rect( int xs,int ys, int dx,int dy ) {
        SDL_Rect rc;
                rc.x = xs; rc.y = ys;
                rc.w = dx; rc.h = dy;
        return( rc );
}

//
// ----------------------------------------------------------------------------------------------------
//

SDL_Color newSDL_Color( int r, int g, int b, int a ) {
        SDL_Color clr;
                clr.r = r;
                clr.g = g;
                clr.b = b;
                clr.unused = a;
        return( clr );
}

//
// ----------------------------------------------------------------------------------------------------
//

SDL_Color newSDL_Color( int r, int g, int b ) {
        SDL_Color clr;
                clr.r = r;
                clr.g = g;
                clr.b = b;
                clr.unused = 0;
        return( clr );
}

//
// ----------------------------------------------------------------------------------------------------
//

bool operator==(SDL_Color a, SDL_Color b) {
        return( a.r == b.r && a.g == b.g && a.b == b.b );
}

//
// ----------------------------------------------------------------------------------------------------
//

bool operator!=(SDL_Color a, SDL_Color b) {
        return( ( a.r != b.r || a.g != b.g || a.b != b.b ) );
}

//
// ----------------------------------------------------------------------------------------------------
//

int SDL_MapRGB( SDL_PixelFormat *format, SDL_Color clr ) {
        return( SDL_MapRGB( format, clr.r, clr.g, clr.b ) );
}

//
// ----------------------------------------------------------------------------------------------------
//

int SDL_FillRect( SDL_Surface *dest, SDL_Rect *rc, SDL_Color &clr ) {
        if( dest == NULL ) {  return(-1);  }
        return( SDL_FillRect( dest, rc, SDL_MapRGB( dest->format, clr ) ) );
}

