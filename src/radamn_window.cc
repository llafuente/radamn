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

v8::Handle<v8::Value> Radamn::Window::translate(const v8::Arguments& args) {
	v8::HandleScope scope;

	V8_ARG_TO_NEWFLOAT(0, x)
	V8_ARG_TO_NEWFLOAT(1, y)
	V8_ARG_TO_NEWFLOAT(2, z)

	glTranslatef(x, y, z);

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::rotate(const v8::Arguments& args) {
	V8_ARG_TO_NEWFLOAT(0, angle);

	glRotatef(angle, 0.0f, 0.0f, 1.0f);

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::scale(const v8::Arguments& args) {
	V8_ARG_TO_NEWFLOAT(0, x);
	V8_ARG_TO_NEWFLOAT(1, y);

	glScalef(x, y, 1.0f);

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::save(const v8::Arguments& args) {
	//VERBOSE << "save" << std::endl;
	glPushMatrix();
	//VERBOSE << "saved" << std::endl;
	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::Window::restore(const v8::Arguments& args) {
	//VERBOSE << "restore" << std::endl;
	glPopMatrix();
	//VERBOSE << "restored" << std::endl;
	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

/// TODO composite!
v8::Handle<v8::Value> Radamn::Window::stroke(const v8::Arguments& args) {

	V8_ARG_TO_NEWARRAY(0, coords);
	V8_ARG_TO_NEWFLOAT(1, width);
	V8_ARG_TO_SDL_NEWCOLOR(2, color_src);
	gl_color_t color = gl_color_from(color_src);

	VERBOSE << "stroking"  <<
	" w:" << width <<
	"color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")"
	<< "COORDS" << coords->Length() << std::endl;

	unsigned int i = 0,
		max = coords->Length(),
		pos = 0;

	GLfloat* positions = (GLfloat*) SDL_malloc(sizeof(GLfloat) * (max + 1) *3);
	
	for(;i<max;++i) {
		v8_get_vec2_from_array_idx(coords, i, positions[pos], positions[pos+1]);
		positions[pos+2] = 0;
		pos+=3;
	}
	//close the path
	/*
	positions[pos] = positions[0];
	positions[pos+1] = positions[1];
	positions[pos+2] = 0;
	*/
	opengl_stroke_point(positions, max, width, color);

	SDL_free(positions);

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

/// TODO composite!
v8::Handle<v8::Value> Radamn::Window::fill(const v8::Arguments& args) {
	VERBOSE << "fill" << std::endl;

	V8_ARG_TO_NEWARRAY(0, coords);
	V8_ARG_TO_SDL_NEWCOLOR(1, color_src);
	gl_color_t color = gl_color_from(color_src);

	VERBOSE << "filling with color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")" << std::endl;

	unsigned int i = 0,
		max = coords->Length(),
		pos = 0;

	GLfloat* positions = (GLfloat*) SDL_malloc(sizeof(GLfloat) * (max+1) * 3);
	
	for(;i<max;++i) {
		v8_get_vec2_from_array_idx(coords, i, positions[pos], positions[pos+1]);
		positions[pos+2] = 0;
		pos+=3;
	}

	//close the path
	positions[pos] = positions[0];
	positions[pos+1] = positions[1];
	positions[pos+2] = 0;

	opengl_fill_poly(positions, max+1, color);
	
	SDL_free(positions);
	
	return v8::True();
	
	
	
	

}
