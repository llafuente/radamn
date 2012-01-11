#include "radamn_window.h"

#include "prerequisites.h"
#include "v8_helper.h"
#include "opengl_helper.h"
#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>
#include <math.h>


//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::setCaption(const v8::Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 2 && args[0]->IsString() && args[1]->IsString())) {
		return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected WM::SetCaption(String, String)")));
	}

	v8::String::Utf8Value title(args[0]);
	v8::String::Utf8Value icon(args[0]);

	SDL_WM_SetCaption(*title, *icon);

	return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::setIcon(const v8::Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 1 && args[0]->IsString())) {
		return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected CRadamn.SetIcon(<String image path .bmp>)")));
	}
	v8::String::Utf8Value icon_path(args[0]);

	/* dont work either :S
	Uint32          colorkey;
	SDL_Surface     *image;
	image = SDL_LoadBMP( *icon_path );
	colorkey = SDL_MapRGB(image->format, 255, 0, 255);
	SDL_SetColorKey(image, SDL_SRCCOLORKEY, colorkey);
	SDL_WM_SetIcon(image,NULL);
*/


	SDL_WM_SetIcon(SDL_LoadBMP( *icon_path ), NULL);

	VERBOSE << "setted icon("<< *icon_path << ")";

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::screenshot(const v8::Arguments& args) {
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

