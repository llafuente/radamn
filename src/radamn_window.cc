#include "radamn_window.h"

#include <SDL_stdinc.h>
#include <math.h>

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setCaption(const v8::Arguments& args) {
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

static v8::Handle<v8::Value> Radamn::Window::clear(const v8::Arguments& args) {
	v8::HandleScope scope;
#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
	SDL_Surface* screen = Radamn::mCurrentScreen;
	SDL_Rect* srcrect = getFullRectSurface(screen);
	SDL_FillRect(screen, srcrect, Radamn::Window::mBackgroundColor);

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL || RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	//Radamn::Window::mBackgroundColor
	//glClearColor(1.0f, 1.0f, 1.0f, 0.0f);
#endif

	return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setIcon(const v8::Arguments& args) {
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

static v8::Handle<v8::Value> Radamn::Window::flip(const v8::Arguments& args) {
	v8::HandleScope scope;

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
	SDL_Flip( Radamn::mCurrentScreen );
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL || RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
	SDL_GL_SwapBuffers();
#endif


	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setBackgroundColor(const v8::Arguments& args) {
	v8::HandleScope scope;

	V8_ARG_TO_UNIT32(0, Radamn::Window::mBackgroundColor);

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::translate(const v8::Arguments& args) {
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

static v8::Handle<v8::Value> Radamn::Window::rotate(const v8::Arguments& args) {
	V8_ARG_TO_NEWFLOAT(0, angle);

	glRotatef(angle, 0.0f, 0.0f, 1.0f);

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::scale(const v8::Arguments& args) {
	V8_ARG_TO_NEWFLOAT(0, x);
	V8_ARG_TO_NEWFLOAT(1, y);

	glScalef(x, y, 1.0f);

	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::save(const v8::Arguments& args) {
	std::cout << "save" << std::endl;
	VERBOSE << "save" << std::endl;
	glPushMatrix();
	VERBOSE << "saved" << std::endl;
	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::restore(const v8::Arguments& args) {
	std::cout << "restore" << std::endl;
	VERBOSE << "restore" << std::endl;
	glPopMatrix();
	VERBOSE << "restored" << std::endl;
	return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::stroke(const v8::Arguments& args) {

	V8_ARG_TO_NEWARRAY(0, coords);
	V8_ARG_TO_NEWFLOAT(1, width);
	V8_ARG_TO_SDL_NEWCOLOR(2, color_src);
	glColor color = glColor_from(color_src);

	std::cout << "stroking"  <<
	" w:" << width <<
	"color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")"
	<< std::endl;

	//glDisable(GL_LIGHTING);

	glLineWidth (width);
	glEnable (GL_LINE_SMOOTH);
	
	GLfloat before[4];
	glGetFloatv(GL_CURRENT_COLOR, before);

	glBegin (GL_LINE_STRIP);
	glColor4f(color.r, color.g, color.b, color.a);
	
	unsigned int i = 0;
	unsigned int max = coords->Length();
	std::cout << "ncoords: "<< max << std::endl;
	float x,y;
	for(;i<max;++i) {
		// TODO why is i*2, i dont fucking understant it!
		V8_EXTRACT_COORDS_FROM_ARRAY(coords, i, x, y)
		std::cout << i<< "( "<< x << "," << y << ")" << std::endl;
		glVertex3f (x, y, 0);
	}
	glEnd ();
	
	glDisable(GL_LINE_SMOOTH);
	
	glColor4f(before[0], before[1], before[2], before[3]);

	return v8::True();
}



//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::screenshot(const v8::Arguments& args) {
	int width = args[0]->ToObject()->Get( v8::String::New("width"))->Int32Value();
	int height = args[0]->ToObject()->Get( v8::String::New("height"))->Int32Value();

	SDL_Surface * image = SDL_CreateRGBSurface(SDL_SWSURFACE, width, height, 24, 0x000000FF, 0x0000FF00, 0x00FF0000, 0);

	std::cout <<"screnshot" << height << "x" << width << std::endl;
	//glReadBuffer(GL_FRONT);
	glReadPixels(0, 0, width, height, GL_RGB, GL_UNSIGNED_BYTE, image->pixels);

	SDL_SaveBMP(image, "pic.bmp");

	SDL_FreeSurface(image);
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::transform(const v8::Arguments& args) {
	GLfloat m[16] = {
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	};

	VERBOSE << m[0] << "," << m[1] << "," << m[2] <<"," << m[3] << std::endl;
	VERBOSE << m[4] << "," << m[5] << "," << m[6] <<"," << m[7] << std::endl;
	VERBOSE << m[8] << "," << m[9] << "," << m[10] <<"," << m[11] << std::endl;
	VERBOSE << m[12] << "," << m[13] << "," << m[14] <<"," << m[15] << std::endl;

	V8_ARG_TO_FLOAT(0, m[0]); //m11);
	V8_ARG_TO_FLOAT(1, m[1]); //m21);
	V8_ARG_TO_FLOAT(2, m[4]); //m22);
	V8_ARG_TO_FLOAT(3, m[5]); //m12);

	V8_ARG_TO_FLOAT(4, m[12]); //dx);
	V8_ARG_TO_FLOAT(5, m[13]); //dy);


	VERBOSE << m[0] << "," << m[1] << "," << m[2] <<"," << m[3] << std::endl;
	VERBOSE << m[4] << "," << m[5] << "," << m[6] <<"," << m[7] << std::endl;
	VERBOSE << m[8] << "," << m[9] << "," << m[10] <<"," << m[11] << std::endl;
	VERBOSE << m[12] << "," << m[13] << "," << m[14] <<"," << m[15] << std::endl;

	glMultMatrixf(m);
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setTransform(const v8::Arguments& args) {
	GLfloat m[16] = {
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	};

	VERBOSE << m[0] << "," << m[1] << "," << m[2] <<"," << m[3] << std::endl;
	VERBOSE << m[4] << "," << m[5] << "," << m[6] <<"," << m[7] << std::endl;
	VERBOSE << m[8] << "," << m[9] << "," << m[10] <<"," << m[11] << std::endl;
	VERBOSE << m[12] << "," << m[13] << "," << m[14] <<"," << m[15] << std::endl;

	V8_ARG_TO_FLOAT(0, m[0]); //m11);
	V8_ARG_TO_FLOAT(1, m[1]); //m21);
	V8_ARG_TO_FLOAT(2, m[4]); //m22);
	V8_ARG_TO_FLOAT(3, m[5]); //m12);

	V8_ARG_TO_FLOAT(4, m[12]); //dx);
	V8_ARG_TO_FLOAT(5, m[13]); //dy);


	VERBOSE << m[0] << "," << m[1] << "," << m[2] <<"," << m[3] << std::endl;
	VERBOSE << m[4] << "," << m[5] << "," << m[6] <<"," << m[7] << std::endl;
	VERBOSE << m[8] << "," << m[9] << "," << m[10] <<"," << m[11] << std::endl;
	VERBOSE << m[12] << "," << m[13] << "," << m[14] <<"," << m[15] << std::endl;

	glLoadMatrixf(m);
	VERBOSE << "setTransformed" << std::endl;
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::fill(const v8::Arguments& args) {
	VERBOSE << "fill" << std::endl;
	std::cout << "fill" << std::endl;

	V8_ARG_TO_NEWARRAY(0, coords);
	V8_ARG_TO_SDL_NEWCOLOR(1, color_src);
	glColor color = glColor_from(color_src);

	std::cout << "filling with color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")" << std::endl;

	//glDisable(GL_LIGHTING);
	
	GLfloat before[4];
	glGetFloatv(GL_CURRENT_COLOR, before);

	glBegin (GL_POLYGON);
	glColor4f(color.r, color.g, color.b, color.a);
	
	unsigned int i = 0;
	unsigned int max = coords->Length();
	std::cout << "ncoords: "<< max << std::endl;
	float x,y;
	for(;i<max;++i) {
		// TODO why is i*2, i dont fucking understant it!
		V8_EXTRACT_COORDS_FROM_ARRAY(coords, i, x, y)
		std::cout << i<< "( "<< x << "," << y << ")" << std::endl;
		glVertex3f (x, y, 0);
	}
	glEnd ();
	
	glColor4f(before[0], before[1], before[2], before[3]);

	return v8::True();
	
	
	
	

}
