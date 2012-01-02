#include "radamn.h"

#include <SDL_version.h>
#include <SDL_image.h>
#include <SDL_ttf.h>
#include <png.h> // libpng!
#include <node.h>
#include <v8.h>

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> Radamn::init(const v8::Arguments& args) {
	// init verbose log
	Radamn::verbose.open("radamn.log");

	VERBOSE << "Radamn::init" << ENDL;

	SDL_Init( SDL_INIT_EVERYTHING );

	if(TTF_Init() == -1) {
		char * xx;
		sprintf(xx, "TTF_Init: %s\n", TTF_GetError());
		return ThrowException(v8::Exception::TypeError(v8::String::New( xx )));
	}
	VERBOSE << "TTF inited" << ENDL;

	return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

//Persistent<FunctionTemplate> Radamn::Creator::s_ct;

//
// ----------------------------------------------------------------------------------------------------
//

//
// ----------------------------------------------------------------------------------------------------
//

#ifdef _WIN32
	void node::NODE_EXTERN Radamn::Creator::Init(v8::Handle<v8::Object> target)
#else
	void Radamn::Creator::Init(v8::Handle<v8::Object> target)
#endif
{
}

//
// ----------------------------------------------------------------------------------------------------
//

extern "C" {
#ifdef _WIN32
    void NODE_EXTERN init (v8::Handle<v8::Object> target)
#else
	void init (v8::Handle<v8::Object> target)
#endif
	{
	/*
    // set the constructor function
    v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(Radamn::Creator::New);

    Radamn::Creator::s_ct = v8::Persistent<v8::FunctionTemplate>::New(t);
    Radamn::Creator::s_ct->InstanceTemplate()->SetInternalFieldCount(1);
    Radamn::Creator::s_ct->SetClassName(v8::String::NewSymbol("adauthftw"));

	v8::Local<v8::Object> target = v8::Object::New();
	*/
	NODE_SET_METHOD(target, "init", Radamn::init);
	NODE_SET_METHOD(target, "quit", Radamn::quit);
	NODE_SET_METHOD(target, "getVersion", Radamn::getVersion);
	NODE_SET_METHOD(target, "createWindow", Radamn::createWindow);
	NODE_SET_METHOD(target, "getJoysticks", Radamn::getJoysticks);
	NODE_SET_METHOD(target, "pollEvent", Radamn::pollEvent);
	NODE_SET_METHOD(target, "getVideoModes", Radamn::getVideoModes);

	v8::Local<v8::Object> Window = v8::Object::New();
	target->Set(v8::String::New("Window"), Window);
	NODE_SET_METHOD(Window, "setCaption",           Radamn::Window::setCaption);
	NODE_SET_METHOD(Window, "setIcon",              Radamn::Window::setIcon);
	NODE_SET_METHOD(Window, "clear",                Radamn::Window::clear);
	NODE_SET_METHOD(Window, "flip",                 Radamn::Window::flip);
	NODE_SET_METHOD(Window, "setBackgroundColor",   Radamn::Window::setBackgroundColor);
	NODE_SET_METHOD(Window, "save",                 Radamn::Window::save);
	NODE_SET_METHOD(Window, "restore",              Radamn::Window::restore);
	NODE_SET_METHOD(Window, "translate",            Radamn::Window::translate);
	NODE_SET_METHOD(Window, "rotate",               Radamn::Window::rotate);
	NODE_SET_METHOD(Window, "scale",                Radamn::Window::scale);
	NODE_SET_METHOD(Window, "stroke",               Radamn::Window::stroke);
	NODE_SET_METHOD(Window, "screenshot",           Radamn::Window::screenshot);
	NODE_SET_METHOD(Window, "transform",            Radamn::Window::transform);
	NODE_SET_METHOD(Window, "setTransform",         Radamn::Window::setTransform);
	NODE_SET_METHOD(Window, "fill",                 Radamn::Window::fill);

	v8::Local<v8::Object> Image = v8::Object::New();
	target->Set(v8::String::New("Image"), Image);
	NODE_SET_METHOD(Image, "load", Radamn::Image::load);
	NODE_SET_METHOD(Image, "destroy", Radamn::Image::destroy);
	NODE_SET_METHOD(Image, "draw", Radamn::Image::draw);
	//NODE_SET_PROTOTYPE_METHOD(Image, "drawImageQuads", Radamn::Image::drawImageQuads);

	v8::Local<v8::Object> Font = v8::Object::New();
	target->Set(v8::String::New("Font"), Font);
	NODE_SET_METHOD(Font, "load", Radamn::Font::load);
	NODE_SET_METHOD(Font, "getImage", Radamn::Font::getImage);
	NODE_SET_METHOD(Font, "destroy", Radamn::Font::destroy);

	//Radamn::Creator::s_ct->Set("init", target);


    }
    NODE_MODULE(Creator, init);
}



//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::quit(const v8::Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 0)) {
		return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected Quit()")));
	}

	TTF_Quit();
	VERBOSE << "TTF_Quit" << ENDL;
	SDL_Quit();
	VERBOSE << "SDL_Quit" << ENDL;

	Radamn::verbose.close();

	return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// XXX opengl version / openglES
static v8::Handle<v8::Value> Radamn::getVersion(const v8::Arguments& args) {
	char buffer[256];
	sprintf(buffer, "SDL %d.%d.%d\nSDL_Image %d.%d.%d\n%s\n GL\n GLU\n",
		SDL_MAJOR_VERSION, SDL_MINOR_VERSION, SDL_PATCHLEVEL,
		SDL_IMAGE_MAJOR_VERSION, SDL_IMAGE_MINOR_VERSION, SDL_IMAGE_PATCHLEVEL,
		PNG_HEADER_VERSION_STRING
	);
	return v8::String::New( buffer );
}

//
// ----------------------------------------------------------------------------------------------------
//

// for multiple display support check: http://wiki.libsdl.org/moin.cgi/SDL_CreateRenderer

static v8::Handle<v8::Value> Radamn::createWindow(const v8::Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 2 && args[0]->IsNumber() && args[1]->IsNumber())) {
		return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected SetVideoMode(Number, Number, Number, Number)")));
	}

	int width = (args[0]->Int32Value());
	int height = (args[1]->Int32Value());

	SDL_Surface* screen = 0;

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
	screen = SDL_SetVideoMode(width, height, 16, SDL_SWSURFACE);
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
	screen = SDL_SetVideoMode(width, height, 16, SDL_OPENGL);
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
	return ThrowException(v8::Exception::TypeError(v8::String::New("OPENGLES is not supported atm")));
#endif
	//if (screen == NULL) return ThrowSDLException(__func__);

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
	SDL_GL_SetAttribute(SDL_GL_RED_SIZE,        8);
	SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE,      8);
	SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE,       8);
	SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE,      8);

	SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE,      16);
	SDL_GL_SetAttribute(SDL_GL_BUFFER_SIZE,        32);

	SDL_GL_SetAttribute(SDL_GL_ACCUM_RED_SIZE,    8);
	SDL_GL_SetAttribute(SDL_GL_ACCUM_GREEN_SIZE,    8);
	SDL_GL_SetAttribute(SDL_GL_ACCUM_BLUE_SIZE,    8);
	SDL_GL_SetAttribute(SDL_GL_ACCUM_ALPHA_SIZE,    8);

	SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS,  1);
	SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES,  2);

	glClearColor(0, 0, 0, 0);
	glClearDepth(1.0f);
	glViewport(0, 0, width, height);

	glMatrixMode(GL_TEXTURE);
	glLoadIdentity ();

	// 2d projection matrix
	glMatrixMode (GL_PROJECTION);
	glLoadIdentity ();
	glOrtho (0, width, height, 0, -1, 1); // flip Y

	glMatrixMode (GL_MODELVIEW);
	glLoadIdentity ();

	glDisable(GL_DEPTH_TEST);

#endif

	debug_SDL_Surface(screen);


	V8_RETURN_WRAPED_POINTER(scope, SDL_Surface, screen)
}

//
// ----------------------------------------------------------------------------------------------------
//

//true any
//throw if error
//array with the list

static v8::Handle<v8::Value> Radamn::getVideoModes(const v8::Arguments& args) {
	v8::HandleScope scope;

	SDL_Rect** modes;

	/* Get available fullscreen/hardware modes */
	modes = SDL_ListModes(NULL, SDL_FULLSCREEN|SDL_HWSURFACE);

	/* Check if there are any modes available */
	if (modes == (SDL_Rect**)0) {
		//throw!
		ThrowException(v8::Exception::TypeError(v8::String::New("No modes available!")));
	}

	/* Check if our resolution is restricted */
	if (modes == (SDL_Rect**)-1) {
		return v8::True();
	}

	v8::Local<v8::Object> output = v8::Object::New();
	VERBOSE << "Available Modes";

	int i;
	for (i=0; modes[i]; ++i) {
		VERBOSE << modes[i]->w << "x"<< modes[i]->h;

		v8::Local<v8::Object> target = v8::Object::New();

		target->Set(v8::String::New("x"), v8::Number::New(modes[i]->w));
		target->Set(v8::String::New("h"), v8::Number::New(modes[i]->h));

		output->Set(v8::Number::New(i), target);
	}

	return output;
}

//
// ----------------------------------------------------------------------------------------------------
//

// XXX TODO!
static v8::Handle<v8::Value> Radamn::getWindow(const v8::Arguments& args) {
	return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// return a proper structure with all data needed!
v8::Handle<v8::Value> Radamn::getJoysticks(const v8::Arguments& args) {
	v8::HandleScope scope;
	if (!(args.Length() == 0)) {
		return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected getJoystricks()")));
	}
	int i,max;
	max = SDL_NumJoysticks();

	SDL_JoystickEventState(SDL_ENABLE);
	SDL_Joystick *joystick;
	for( i=0; i < max; i++ ) {
		joystick = SDL_JoystickOpen(0);
	}

	return v8::False(); //atm!
}

//
// ----------------------------------------------------------------------------------------------------
//

// i will follow mozilla docs
// https://developer.mozilla.org/en/DOM/KeyboardEvent
// http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent
// touch events: https://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
v8::Handle<v8::Value> Radamn::pollEvent(const v8::Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 0)) {
		return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected pollEvent()")));
	}

	SDL_Event event;
	if (!SDL_PollEvent(&event)) {
		return v8::False();
	}

	v8::Local<v8::Object> evt = v8::Object::New();

	// in common!

	// modifiers
	// TODO: what to di with [Numlock, Capslock]
	// windows - command key ?!
	evt->Set(v8::String::New("metaKey"),  v8::Boolean::New( false ));
	evt->Set(v8::String::New("altKey"),   v8::Boolean::New( KMOD_ALT == (KMOD_ALT & event.key.keysym.mod) ));
	evt->Set(v8::String::New("ctrlKey"),  v8::Boolean::New( KMOD_CTRL == (KMOD_CTRL & event.key.keysym.mod) ));
	evt->Set(v8::String::New("shiftKey"), v8::Boolean::New( KMOD_SHIFT == (KMOD_SHIFT & event.key.keysym.mod) ));

	switch (event.type) {
	case SDL_ACTIVEEVENT:
		evt->Set(v8::String::New("type"),  v8::String::New("ACTIVEEVENT"));
		evt->Set(v8::String::New("gain"),  v8::Number::New(event.active.gain));
		evt->Set(v8::String::New("state"), v8::Number::New(event.active.state));
		break;
	case SDL_KEYDOWN:
	case SDL_KEYUP:
		// TODO: support keypress ?
		evt->Set(v8::String::New("type"), v8::String::New(event.type == SDL_KEYDOWN ? "keydown" : "keyup"));

		// do ui have to mach every key from-sdl-to-w3c... :***
		evt->Set(v8::String::New("key"),     v8::Number::New(event.key.keysym.sym));
		evt->Set(v8::String::New("char"),    v8::String::New(SDL_GetKeyName(event.key.keysym.sym)));
		evt->Set(v8::String::New("keyCode"), v8::Number::New(event.key.keysym.sym));

		// has anyone use this ever ?!
		//evt->Set(String::New("locale"), null);
		//evt->Set(String::New("location"), null);
		//evt->Set(String::New("repeat"), False());

		break;
	case SDL_MOUSEMOTION:
	case SDL_MOUSEBUTTONDOWN:
	case SDL_MOUSEBUTTONUP:
		//evt->Set(String::New("which"), Number::New(event.motion.which));
		evt->Set(v8::String::New("state"),   v8::Number::New(event.motion.state));

		evt->Set(v8::String::New("x"),       v8::Number::New(event.motion.x));
		evt->Set(v8::String::New("y"),       v8::Number::New(event.motion.y));

		evt->Set(v8::String::New("clientX"), v8::Number::New(event.motion.x));
		evt->Set(v8::String::New("clientY"), v8::Number::New(event.motion.y));

		evt->Set(v8::String::New("screenX"), v8::Number::New(event.motion.xrel));
		evt->Set(v8::String::New("screenY"), v8::Number::New(event.motion.yrel));

		switch(event.type) {
		case SDL_MOUSEMOTION :
			evt->Set(v8::String::New("type"),    v8::String::New("mousemove"));
			evt->Set(v8::String::New("button"),  v8::Number::New(event.button.button));
			break;
		case SDL_MOUSEBUTTONDOWN :
			if(event.button.button == SDL_BUTTON_WHEELDOWN) {
				evt->Set(v8::String::New("type"),   v8::String::New("wheel"));
				evt->Set(v8::String::New("deltaX"), v8::Number::New(event.wheel.x));
				evt->Set(v8::String::New("deltaY"), v8::Number::New(event.wheel.y));
			} else {
				evt->Set(v8::String::New("type"),   v8::String::New("mousedown"));
				evt->Set(v8::String::New("button"), v8::Number::New(event.button.button));
			}

			break;
		case SDL_MOUSEBUTTONUP :
			if(event.button.button == SDL_BUTTON_WHEELUP) {
				evt->Set(v8::String::New("type"),   v8::String::New("wheel"));
				evt->Set(v8::String::New("deltaX"), v8::Number::New(event.wheel.x));
				evt->Set(v8::String::New("deltaY"), v8::Number::New(event.wheel.y));
			} else {
				evt->Set(v8::String::New("type"),   v8::String::New("mouseup"));
				evt->Set(v8::String::New("button"), v8::Number::New(event.button.button));
			}

			break;
		}

		// what to do with click ?
		//evt->Set(String::New("type"), String::New("click"));

		break;

		// my own DOMJoystickEvent based on mozilla: MozJoyAxisMove, MozJoyButtonUp, MozJoyButtonDown
	case SDL_JOYAXISMOTION:
		evt->Set(v8::String::New("type"),  v8::String::New("joyaxismove"));

		evt->Set(v8::String::New("which"), v8::Number::New(event.jaxis.which));
		evt->Set(v8::String::New("axis"),  v8::Number::New(event.jaxis.axis));
		evt->Set(v8::String::New("value"), v8::Number::New(event.jaxis.value));
		break;
	case SDL_JOYBALLMOTION:
		evt->Set(v8::String::New("type"),   v8::String::New("joyballmove"));
		evt->Set(v8::String::New("button"), v8::Number::New(event.jball.which));
		evt->Set(v8::String::New("ball"),   v8::Number::New(event.jball.ball));
		evt->Set(v8::String::New("deltaX"), v8::Number::New(event.jball.xrel));
		evt->Set(v8::String::New("deltaY"), v8::Number::New(event.jball.yrel));
		break;
	case SDL_JOYHATMOTION:
		evt->Set(v8::String::New("type"),   v8::String::New("joyhatmove"));
		evt->Set(v8::String::New("button"), v8::Number::New(event.jhat.which));
		evt->Set(v8::String::New("hat"),    v8::Number::New(event.jhat.hat));
		evt->Set(v8::String::New("value"),  v8::Number::New(event.jhat.value));
		break;
	case SDL_JOYBUTTONDOWN:
	case SDL_JOYBUTTONUP:
		evt->Set(v8::String::New("type"),   v8::String::New(event.type == SDL_JOYBUTTONDOWN ? "joybuttondown" : "joybuttonup"));
		//evt->Set(String::New("which"), Number::New(event.jbutton.which));
		evt->Set(v8::String::New("button"), v8::Number::New(event.jbutton.button));
		break;
	case SDL_QUIT:
		evt->Set(v8::String::New("type"),      v8::String::New("quit"));
		break;
	default:
		evt->Set(v8::String::New("type"),      v8::String::New("not-supported"));
		evt->Set(v8::String::New("typeCode"),  v8::Number::New(event.type));
		break;
	}

	return scope.Close(evt);
}

//
// ----------------------------------------------------------------------------------------------------
//
