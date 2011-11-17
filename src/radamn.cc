#include "radamn.h"

#include <SDL/SDL_gfxBlitFunc.h> // blit + resize
#include <SDL_version.h>
#include <SDL_image.h>
#include <SDL_ttf.h>
#include <png.h> // libpng!

using namespace v8;

Handle<Value> Radamn::init(const Arguments& args) {
    std::cout << "Radamn::init" << std::endl;
    SDL_Init( SDL_INIT_EVERYTHING );

    if(TTF_Init() == -1) {
        char * xx;
        sprintf(xx, "TTF_Init: %s\n", TTF_GetError());
        return ThrowException(Exception::TypeError(String::New( xx )));
    }
    std::cout << "TTF inited" << std::endl;


    static v8::HandleScope scope;
    Radamn::globalScope = &scope;

    return Undefined();
}

extern "C" void
init(Handle<Object> target)
{
  NODE_SET_METHOD(target, "init", Radamn::init);
  NODE_SET_METHOD(target, "quit", Radamn::quit);
  NODE_SET_METHOD(target, "getVersion", Radamn::getVersion);
  NODE_SET_METHOD(target, "setVideoMode", Radamn::setVideoMode);
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

  Local<Object> Image = Object::New();
  target->Set(String::New("Image"), Image);
  NODE_SET_METHOD(Image, "load", Radamn::Image::load);
  NODE_SET_METHOD(Image, "destroy", Radamn::Image::destroy);
  NODE_SET_METHOD(Image, "draw", Radamn::Image::draw);

  Local<Object> Font = Object::New();
  target->Set(String::New("Font"), Font);
  NODE_SET_METHOD(Font, "load", Radamn::Font::load);
  NODE_SET_METHOD(Font, "getImage", Radamn::Font::getImage);
  NODE_SET_METHOD(Font, "destroy", Radamn::Font::destroy);

/*
this goes to js directly Radamn.$.Init.TIMER
SDL_INIT_TIMER
SDL_INIT_AUDIO
SDL_INIT_VIDEO
SDL_INIT_CDROM
SDL_INIT_JOYSTICK
SDL_INIT_HAPTIC
SDL_INIT_EVERYTHING
SDL_INIT_NOPARACHUTE
SDL_INIT_EVENTTHREAD
*/

/*
  NODE_SET_METHOD(target, "initSubSystem", Radamn::InitSubSystem);
  NODE_SET_METHOD(target, "quitSubSystem", sdl::QuitSubSystem);
  NODE_SET_METHOD(target, "wasInit", sdl::WasInit);
  NODE_SET_METHOD(target, "clearError", sdl::ClearError);
  NODE_SET_METHOD(target, "getError", sdl::GetError);
  NODE_SET_METHOD(target, "setError", sdl::SetError);
  NODE_SET_METHOD(target, "waitEvent", sdl::WaitEvent);
  NODE_SET_METHOD(target, "pollEvent", sdl::PollEvent);

  NODE_SET_METHOD(target, "videoModeOK", sdl::VideoModeOK);
  NODE_SET_METHOD(target, "numJoysticks", sdl::NumJoysticks);
  NODE_SET_METHOD(target, "joystickOpen", sdl::JoystickOpen);
  NODE_SET_METHOD(target, "joystickOpened", sdl::JoystickOpened);
  NODE_SET_METHOD(target, "joystickName", sdl::JoystickName);
  NODE_SET_METHOD(target, "joystickNumAxes", sdl::JoystickNumAxes);
  NODE_SET_METHOD(target, "joystickNumButtons", sdl::JoystickNumButtons);
  NODE_SET_METHOD(target, "joystickNumBalls", sdl::JoystickNumBalls);
  NODE_SET_METHOD(target, "joystickNumHats", sdl::JoystickNumHats);
  NODE_SET_METHOD(target, "joystickClose", sdl::JoystickClose);
  NODE_SET_METHOD(target, "joystickUpdate", sdl::JoystickUpdate);
  NODE_SET_METHOD(target, "joystickEventState", sdl::JoystickEventState);
  NODE_SET_METHOD(target, "flip", sdl::Flip);
  NODE_SET_METHOD(target, "fillRect", sdl::FillRect);
  NODE_SET_METHOD(target, "updateRect", sdl::UpdateRect);
  NODE_SET_METHOD(target, "createRGBSurface", sdl::CreateRGBSurface);
  NODE_SET_METHOD(target, "blitSurface", sdl::BlitSurface);
  NODE_SET_METHOD(target, "freeSurface", sdl::FreeSurface);
  NODE_SET_METHOD(target, "setColorKey", sdl::SetColorKey);
  NODE_SET_METHOD(target, "displayFormat", sdl::DisplayFormat);
  NODE_SET_METHOD(target, "displayFormatAlpha", sdl::DisplayFormatAlpha);
  NODE_SET_METHOD(target, "setAlpha", sdl::SetAlpha);
  NODE_SET_METHOD(target, "mapRGB", sdl::MapRGB);
  NODE_SET_METHOD(target, "mapRGBA", sdl::MapRGBA);
  NODE_SET_METHOD(target, "getRGB", sdl::GetRGB);
  NODE_SET_METHOD(target, "getRGBA", sdl::GetRGBA);

  Local<Object> INIT = Object::New();
  target->Set(String::New("INIT"), INIT);
  INIT->Set(String::New("TIMER"), Number::New(SDL_INIT_TIMER));
  INIT->Set(String::New("AUDIO"), Number::New(SDL_INIT_AUDIO));
  INIT->Set(String::New("VIDEO"), Number::New(SDL_INIT_VIDEO));
  INIT->Set(String::New("JOYSTICK"), Number::New(SDL_INIT_JOYSTICK));
  INIT->Set(String::New("EVERYTHING"), Number::New(SDL_INIT_EVERYTHING));
  INIT->Set(String::New("NOPARACHUTE"), Number::New(SDL_INIT_NOPARACHUTE));

  Local<Object> SURFACE = Object::New();
  target->Set(String::New("SURFACE"), SURFACE);
  SURFACE->Set(String::New("ANYFORMAT"), Number::New(SDL_ANYFORMAT));
  SURFACE->Set(String::New("ASYNCBLIT"), Number::New(SDL_ASYNCBLIT));
  SURFACE->Set(String::New("DOUBLEBUF"), Number::New(SDL_DOUBLEBUF));
  SURFACE->Set(String::New("HWACCEL"), Number::New(SDL_HWACCEL));
  SURFACE->Set(String::New("HWPALETTE"), Number::New(SDL_HWPALETTE));
  SURFACE->Set(String::New("HWSURFACE"), Number::New(SDL_HWSURFACE));
  SURFACE->Set(String::New("FULLSCREEN"), Number::New(SDL_FULLSCREEN));
  SURFACE->Set(String::New("OPENGL"), Number::New(SDL_OPENGL));
  SURFACE->Set(String::New("RESIZABLE"), Number::New(SDL_RESIZABLE));
  SURFACE->Set(String::New("RLEACCEL"), Number::New(SDL_RLEACCEL));
  SURFACE->Set(String::New("SRCALPHA"), Number::New(SDL_SRCALPHA));
  SURFACE->Set(String::New("SRCCOLORKEY"), Number::New(SDL_SRCCOLORKEY));
  SURFACE->Set(String::New("SWSURFACE"), Number::New(SDL_SWSURFACE));
  SURFACE->Set(String::New("PREALLOC"), Number::New(SDL_PREALLOC));

  Local<Object> TTF = Object::New();
  target->Set(String::New("TTF"), TTF);
  NODE_SET_METHOD(TTF, "init", sdl::TTF::Init);
  NODE_SET_METHOD(TTF, "openFont", sdl::TTF::OpenFont);
  NODE_SET_METHOD(TTF, "renderTextBlended", sdl::TTF::RenderTextBlended);

  Local<Object> IMG = Object::New();
  target->Set(String::New("IMG"), IMG);

  NODE_SET_METHOD(IMG, "load", sdl::IMG::Load);

  Local<Object> WM = Object::New();
  target->Set(String::New("WM"), WM);

  NODE_SET_METHOD(WM, "setCaption", sdl::WM::SetCaption);
  NODE_SET_METHOD(WM, "setIcon", sdl::WM::SetIcon);

  Local<Object> GL = Object::New();
  target->Set(String::New("GL"), GL);


  NODE_SET_METHOD(GL, "setAttribute", sdl::GL::SetAttribute);
  NODE_SET_METHOD(GL, "getAttribute", sdl::GL::GetAttribute);
  NODE_SET_METHOD(GL, "swapBuffers", sdl::GL::SwapBuffers);

  GL->Set(String::New("RED_SIZE"), Number::New(SDL_GL_RED_SIZE));
  GL->Set(String::New("GREEN_SIZE"), Number::New(SDL_GL_GREEN_SIZE));
  GL->Set(String::New("BLUE_SIZE"), Number::New(SDL_GL_BLUE_SIZE));
  GL->Set(String::New("ALPHA_SIZE"), Number::New(SDL_GL_ALPHA_SIZE));
  GL->Set(String::New("DOUBLEBUFFER"), Number::New(SDL_GL_DOUBLEBUFFER));
  GL->Set(String::New("BUFFER_SIZE"), Number::New(SDL_GL_BUFFER_SIZE));
  GL->Set(String::New("DEPTH_SIZE"), Number::New(SDL_GL_DEPTH_SIZE));
  GL->Set(String::New("STENCIL_SIZE"), Number::New(SDL_GL_STENCIL_SIZE));
  GL->Set(String::New("ACCUM_RED_SIZE"), Number::New(SDL_GL_ACCUM_RED_SIZE));
  GL->Set(String::New("ACCUM_GREEN_SIZE"), Number::New(SDL_GL_ACCUM_GREEN_SIZE));
  GL->Set(String::New("ACCUM_BLUE_SIZE"), Number::New(SDL_GL_ACCUM_BLUE_SIZE));
  GL->Set(String::New("ACCUM_ALPHA_SIZE"), Number::New(SDL_GL_ACCUM_ALPHA_SIZE));
*/
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
  SDL_Quit();

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

static Handle<Value> Radamn::setVideoMode(const Arguments& args) {
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
    Radamn::mCurrentScreen = SDL_SetVideoMode(width, height, 16, SDL_HWSURFACE | SDL_GL_DOUBLEBUFFER | SDL_OPENGL);
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

        glMatrixMode (GL_PROJECTION);
        glLoadIdentity ();
        glOrtho (0, width, height, 0, -1, 1); // flip Y

        glMatrixMode (GL_MODELVIEW);
        glLoadIdentity ();

/*
extra
    glShadeModel(GL_SMOOTH);                        // Enable Smooth Shading
    glClearColor(0.0f, 0.0f, 0.0f, 0.5f);                   // Black Background
    glClearDepth(1.0f);                         // Depth Buffer Setup
    glEnable(GL_DEPTH_TEST);                        // Enables Depth Testing
    glDepthFunc(GL_LEQUAL);                         // The Type Of Depth Testing To Do
    glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);
*/

#endif

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
      evt->Set(String::New("gain"), Boolean::New(event.active.gain));
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
