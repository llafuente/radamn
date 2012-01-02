#include "radamn.h"

#include <SDL_version.h>
#include <SDL_image.h>
#include <SDL_ttf.h>
#include <png.h> // libpng!

using namespace v8;

Handle<Value> Radamn::init(const Arguments& args) {
	// init verbose log
	Radamn::verbose.open("radamn.log");

	VERBOSE << "Radamn::init" << ENDL;

	SDL_Init( SDL_INIT_EVERYTHING );

	if(TTF_Init() == -1) {
		char * xx;
		sprintf(xx, "TTF_Init: %s\n", TTF_GetError());
		return ThrowException(Exception::TypeError(String::New( xx )));
	}
	VERBOSE << "TTF inited" << ENDL;


	static v8::HandleScope scope;
	Radamn::globalScope = &scope;

	return Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

extern "C" void
init(Handle<Object> target)
{
	NODE_SET_METHOD(target, "init", Radamn::init);
	NODE_SET_METHOD(target, "quit", Radamn::quit);
	NODE_SET_METHOD(target, "getVersion", Radamn::getVersion);
	NODE_SET_METHOD(target, "createWindow", Radamn::createWindow);
	NODE_SET_METHOD(target, "getJoysticks", Radamn::getJoysticks);
	NODE_SET_METHOD(target, "pollEvent", Radamn::pollEvent);



	Local<Object> Window = Object::New();
	target->Set(String::New("Window"), Window);
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

	Local<Object> Image = Object::New();
	target->Set(String::New("Image"), Image);
	NODE_SET_METHOD(Image, "load", Radamn::Image::load);
	NODE_SET_METHOD(Image, "destroy", Radamn::Image::destroy);
	NODE_SET_METHOD(Image, "draw", Radamn::Image::draw);
	//NODE_SET_METHOD(Image, "drawImageQuads", Radamn::Image::drawImageQuads);

	Local<Object> Font = Object::New();
	target->Set(String::New("Font"), Font);
	NODE_SET_METHOD(Font, "load", Radamn::Font::load);
	NODE_SET_METHOD(Font, "getImage", Radamn::Font::getImage);
	NODE_SET_METHOD(Font, "destroy", Radamn::Font::destroy);
}

//
// ----------------------------------------------------------------------------------------------------
//

static Handle<Value> Radamn::quit(const Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 0)) {
		return ThrowException(Exception::TypeError(String::New("Invalid arguments: Expected Quit()")));
	}

	TTF_Quit();
	VERBOSE << "TTF_Quit" << ENDL;
	SDL_Quit();
	VERBOSE << "SDL_Quit" << ENDL;

	Radamn::verbose.close();

	return Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// XXX opengl version / openglES
static Handle<Value> Radamn::getVersion(const Arguments& args) {
	char buffer[256];
	sprintf(buffer, "SDL %d.%d.%d\nSDL_Image %d.%d.%d\n%s\n GL\n GLU\n",
	SDL_MAJOR_VERSION, SDL_MINOR_VERSION, SDL_PATCHLEVEL,
	SDL_IMAGE_MAJOR_VERSION, SDL_IMAGE_MINOR_VERSION, SDL_IMAGE_PATCHLEVEL,
	PNG_HEADER_VERSION_STRING
	);
	return String::New( buffer );
}

//
// ----------------------------------------------------------------------------------------------------
//

static Handle<Value> Radamn::createWindow(const Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 2 && args[0]->IsNumber() && args[1]->IsNumber())) {
		return ThrowException(Exception::TypeError(String::New("Invalid arguments: Expected SetVideoMode(Number, Number, Number, Number)")));
	}

	int width = (args[0]->Int32Value());
	int height = (args[1]->Int32Value());

	++Radamn::mScreenCount;
#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
	Radamn::mCurrentScreen = SDL_SetVideoMode(width, height, 16, SDL_SWSURFACE);
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
	Radamn::mCurrentScreen = SDL_SetVideoMode(width, height, 16, SDL_OPENGL);
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
	return ThrowException(Exception::TypeError(String::New("OPENGLES is not supported atm")));
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

	debug_SDL_Surface(Radamn::mCurrentScreen);


	V8_RETURN_WRAPED_POINTER(scope, SDL_Surface, Radamn::mCurrentScreen)
}

//
// ----------------------------------------------------------------------------------------------------
//

static Handle<Value> Radamn::getVideoModes(const Arguments& args) {
	v8::HandleScope scope;

	return String::New("screen");
}

//
// ----------------------------------------------------------------------------------------------------
//

// XXX TODO!
static Handle<Value> Radamn::getWindow(const Arguments& args) {
	return Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// return a proper structure with all data needed!
Handle<Value> Radamn::getJoysticks(const Arguments& args) {
	v8::HandleScope scope;
	if (!(args.Length() == 0)) {
		return ThrowException(Exception::TypeError(String::New("Invalid arguments: Expected getJoystricks()")));
	}
	int i,max;
	max = SDL_NumJoysticks();

	SDL_JoystickEventState(SDL_ENABLE);
	SDL_Joystick *joystick;
	for( i=0; i < max; i++ ) {
		joystick = SDL_JoystickOpen(0);
	}

	return False(); //atm!
}

//
// ----------------------------------------------------------------------------------------------------
//

// i will follow mozilla docs
// https://developer.mozilla.org/en/DOM/KeyboardEvent
// http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent
// touch events: https://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
Handle<Value> Radamn::pollEvent(const Arguments& args) {
	v8::HandleScope scope;

	if (!(args.Length() == 0)) {
		return ThrowException(Exception::TypeError(String::New("Invalid arguments: Expected pollEvent()")));
	}

	SDL_Event event;
	if (!SDL_PollEvent(&event)) {
		return False();
	}

	Local<Object> evt = Object::New();

	// in common!

	// modifiers
	// TODO: what to di with [Numlock, Capslock]
	// windows - command key ?!
	evt->Set(String::New("metaKey"),  Boolean::New( false ));
	evt->Set(String::New("altKey"),   Boolean::New( KMOD_ALT == (KMOD_ALT & event.key.keysym.mod) ));
	evt->Set(String::New("ctrlKey"),  Boolean::New( KMOD_CTRL == (KMOD_CTRL & event.key.keysym.mod) ));
	evt->Set(String::New("shiftKey"), Boolean::New( KMOD_SHIFT == (KMOD_SHIFT & event.key.keysym.mod) ));

	switch (event.type) {
	case SDL_ACTIVEEVENT:
		evt->Set(String::New("type"), String::New("ACTIVEEVENT"));
		evt->Set(String::New("gain"), Number::New(event.active.gain));
		evt->Set(String::New("state"), Number::New(event.active.state));
		break;
	case SDL_KEYDOWN:
	case SDL_KEYUP:
		// TODO: support keypress ?
		evt->Set(String::New("type"), String::New(event.type == SDL_KEYDOWN ? "keydown" : "keyup"));

		// do ui have to mach every key from-sdl-to-w3c... :***
		evt->Set(String::New("key"), Number::New(event.key.keysym.sym));
		evt->Set(String::New("char"), v8::String::New(SDL_GetKeyName(event.key.keysym.sym)));
		evt->Set(String::New("keyCode"), Number::New(event.key.keysym.sym));

		// has anyone use this ever ?!
		//evt->Set(String::New("locale"), null);
		//evt->Set(String::New("location"), null);
		//evt->Set(String::New("repeat"), False());

		break;
	case SDL_MOUSEMOTION:
	case SDL_MOUSEBUTTONDOWN:
	case SDL_MOUSEBUTTONUP:
		//evt->Set(String::New("which"), Number::New(event.motion.which));
		evt->Set(String::New("state"), Number::New(event.motion.state));

		evt->Set(String::New("x"), Number::New(event.motion.x));
		evt->Set(String::New("y"), Number::New(event.motion.y));

		evt->Set(String::New("clientX"), Number::New(event.motion.x));
		evt->Set(String::New("clientY"), Number::New(event.motion.y));

		evt->Set(String::New("screenX"), Number::New(event.motion.xrel));
		evt->Set(String::New("screenY"), Number::New(event.motion.yrel));

		switch(event.type) {
		case SDL_MOUSEMOTION :
			evt->Set(String::New("type"), String::New("mousemove"));
			evt->Set(String::New("button"), Number::New(event.button.button));
			break;
		case SDL_MOUSEBUTTONDOWN :
			if(event.button.button == SDL_BUTTON_WHEELDOWN) {
				evt->Set(String::New("type"), String::New("wheel"));
				evt->Set(String::New("deltaX"), Number::New(event.wheel.x));
				evt->Set(String::New("deltaY"), Number::New(event.wheel.y));
			} else {
				evt->Set(String::New("type"), String::New("mousedown"));
				evt->Set(String::New("button"), Number::New(event.button.button));
			}

			break;
		case SDL_MOUSEBUTTONUP :
			if(event.button.button == SDL_BUTTON_WHEELUP) {
				evt->Set(String::New("type"), String::New("wheel"));
				evt->Set(String::New("deltaX"), Number::New(event.wheel.x));
				evt->Set(String::New("deltaY"), Number::New(event.wheel.y));
			} else {
				evt->Set(String::New("type"), String::New("mouseup"));
				evt->Set(String::New("button"), Number::New(event.button.button));
			}

			break;
		}

		// what to do with click ?
		//evt->Set(String::New("type"), String::New("click"));

		break;

		// my own DOMJoystickEvent based on mozilla: MozJoyAxisMove, MozJoyButtonUp, MozJoyButtonDown
	case SDL_JOYAXISMOTION:
		evt->Set(String::New("type"), String::New("joyaxismove"));

		evt->Set(String::New("which"), Number::New(event.jaxis.which));
		evt->Set(String::New("axis"), Number::New(event.jaxis.axis));
		evt->Set(String::New("value"), Number::New(event.jaxis.value));
		break;
	case SDL_JOYBALLMOTION:
		evt->Set(String::New("type"), String::New("joyballmove"));
		evt->Set(String::New("button"), Number::New(event.jball.which));
		evt->Set(String::New("ball"), Number::New(event.jball.ball));
		evt->Set(String::New("deltaX"), Number::New(event.jball.xrel));
		evt->Set(String::New("deltaY"), Number::New(event.jball.yrel));
		break;
	case SDL_JOYHATMOTION:
		evt->Set(String::New("type"), String::New("joyhatmove"));
		evt->Set(String::New("button"), Number::New(event.jhat.which));
		evt->Set(String::New("hat"), Number::New(event.jhat.hat));
		evt->Set(String::New("value"), Number::New(event.jhat.value));
		break;
	case SDL_JOYBUTTONDOWN:
	case SDL_JOYBUTTONUP:
		evt->Set(String::New("type"), String::New(event.type == SDL_JOYBUTTONDOWN ? "joybuttondown" : "joybuttonup"));
		//evt->Set(String::New("which"), Number::New(event.jbutton.which));
		evt->Set(String::New("button"), Number::New(event.jbutton.button));
		break;
	case SDL_QUIT:
		evt->Set(String::New("type"), String::New("quit"));
		break;
	default:
		evt->Set(String::New("type"), String::New("not-supported"));
		evt->Set(String::New("typeCode"), Number::New(event.type));
		break;
	}

	return scope.Close(evt);
}

//
// ----------------------------------------------------------------------------------------------------
//
