#include "v8_helper.h"

#include <SDL.h>
#include <v8.h>
#include "prerequisites.h"
#include "c_helper.h"
#include "opengl_helper.h"
#include <SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>

//
// ----------------------------------------------------------------------------------------------------
//

SDL_Color sdl_color_from(const char* ccolor) {
	SDL_Color OUTPUT_NAME = {0,0,0,255};

	VERBOSE << " -> " << ccolor << std::endl;
	if(strncmp ( ccolor, "#", 1) == 0) {
		int r,g,b;
		sscanf(ccolor, "#%02x%02x%02x", &r,&g,&b);
		OUTPUT_NAME.r = (int)r;
		OUTPUT_NAME.g = (int)g;
		OUTPUT_NAME.b = (int)b;
	} else if(strncmp ( ccolor, "rgba", 4) == 0) {
		  char* aux = (char *)malloc(strlen(ccolor)+1); /* strtok so +1!! */
		  strcpy(ccolor, aux);
		  VERBOSE << aux << std::endl;
		  strremchar(aux, ' ', aux);

		  char * ptr = strtok (aux, "(");

		  ptr = strtok (NULL, ",)");
		  OUTPUT_NAME.r = (int) atoi(ptr);
		  VERBOSE << ptr << " R " << (int) OUTPUT_NAME.r << std::endl;

		  ptr = strtok (NULL, ",)");
		  OUTPUT_NAME.g = (int) atoi(ptr);
		  VERBOSE << ptr << " G " << (int) OUTPUT_NAME.g << std::endl;

		  ptr = strtok (NULL, ",)");
		  OUTPUT_NAME.b = (int) atoi(ptr);
		  VERBOSE << ptr << " B " << (int) OUTPUT_NAME.b << std::endl;
		  
		  ptr = strtok (NULL, ",)");
		  OUTPUT_NAME.unused = (int) (atof(ptr) * 255.0f);
		  VERBOSE << ptr << " A " << (int) OUTPUT_NAME.unused << std::endl;

		  free(aux); /* free the initial pointer!! */
		  ptr = 0;
	} else if(strncmp ( ccolor, "rgb", 3) == 0) {
		  char* aux = (char *)malloc(strlen(ccolor)+1); /* strtok so +1!! */
		  strcpy(ccolor, aux);
		  VERBOSE << aux << std::endl;
		  strremchar(aux, ' ', aux);

		  char * ptr = strtok (aux, "(");

		  ptr = strtok (NULL, ",");
		  OUTPUT_NAME.r = (int) atoi(ptr);
		  VERBOSE << ptr << " R " << (int) OUTPUT_NAME.r << std::endl;

		  ptr = strtok (NULL, ",");
		  OUTPUT_NAME.g = (int) atoi(ptr);
		  VERBOSE << ptr << " G " << (int) OUTPUT_NAME.g << std::endl;

		  ptr = strtok (NULL, ")");
		  OUTPUT_NAME.b = (int) atoi(ptr);
		  VERBOSE << ptr << " B " << (int) OUTPUT_NAME.b << std::endl;
		  ptr = strtok (NULL, "?");

		  free(aux); /* free the initial pointer!! */
		  ptr = 0;
	} else {
		ThrowException(v8::Exception::TypeError(v8::String::New("Color not supported")));
	}
	VERBOSE << "parsed rgba(" << (int) OUTPUT_NAME.r << "," << (int) OUTPUT_NAME.g << "," << (int) OUTPUT_NAME.b << "," << (int) OUTPUT_NAME.unused << ")" << ENDL;

	return OUTPUT_NAME;
}

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

//
// ----------------------------------------------------------------------------------------------------
//
