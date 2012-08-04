#include "radamn.h"

#include "prerequisites.h"
#include "SDL_helper.h"
#include "v8_helper.h"

#include "radamn_image.h"
#include "radamn_font.h"
#include "radamn_window.h"

#include <SDL_version.h>
#include <SDL_ttf.h>
#include "radamn_gl.h"
#include <node.h>
#include <v8.h>

using namespace radamn;

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::init(const v8::Arguments& args) {
    VERBOSE << "radamn::init" << ENDL;

    SDL_Init( SDL_INIT_EVERYTHING );
    SDL_EnableUNICODE(1);

    if(TTF_Init() == -1) {
        return ThrowException(v8::Exception::Error(v8::String::Concat(
            v8::String::New("TTF_Init:: "),
            v8::String::New(TTF_GetError())
        )));
    }

    VERBOSE << "TTF inited" << ENDL;

    return v8::Undefined();
}

#ifdef _WIN32
    void NODE_EXTERN radamn::Creator::Init(v8::Handle<v8::Object> target)
#else
    void radamn::Creator::Init(v8::Handle<v8::Object> target)
#endif
{
    VERBOSE << "create" << ENDL;
}

//
// ----------------------------------------------------------------------------------------------------
//

v8::Persistent<v8::FunctionTemplate> radamn::Creator::s_ct;

extern "C" {
#ifdef _WIN32
    void NODE_EXTERN init (v8::Handle<v8::Object> target)
#else
    void init (v8::Handle<v8::Object> target)
#endif
    {
    v8::HandleScope scope;
    /*
    // set the constructor function
    v8::Local<v8::FunctionTemplate> t = v8::FunctionTemplate::New(radamn::Creator::New);

    radamn::Creator::s_ct = v8::Persistent<v8::FunctionTemplate>::New(t);
    radamn::Creator::s_ct->InstanceTemplate()->SetInternalFieldCount(1);
    radamn::Creator::s_ct->SetClassName(v8::String::NewSymbol("adauthftw"));

    v8::Local<v8::Object> target = v8::Object::New();
    */

    NODE_SET_METHOD(target, "init", radamn::init);

    NODE_SET_METHOD(target, "quit", radamn::quit);

    NODE_SET_METHOD(target, "getVersion", radamn::getVersion);
    NODE_SET_METHOD(target, "createWindow", radamn::createWindow);
    NODE_SET_METHOD(target, "getJoysticks", radamn::getJoysticks);
    NODE_SET_METHOD(target, "pollEvent", radamn::pollEvent);
    NODE_SET_METHOD(target, "getVideoModes", radamn::getVideoModes);

    v8::Local<v8::Object> Window = v8::Object::New();
    target->Set(v8::String::New("Window"), Window);
    NODE_SET_METHOD(Window, "setCaption",           radamn::window::setCaption);
    NODE_SET_METHOD(Window, "setIcon",              radamn::window::setIcon);

    NODE_SET_METHOD(Window, "screenshot",           radamn::window::screenshot);


    // new gl Object!
    v8::Local<v8::Object> GL = v8::Object::New();
    target->Set(v8::String::New("GL"), GL);
    NODE_SET_METHOD(GL, "setBackgroundColor",   radamn::v8_gl_set_background_color);
    NODE_SET_METHOD(GL, "clear",                radamn::v8_gl_clear);
    NODE_SET_METHOD(GL, "flipBuffers",          radamn::v8_gl_flip_buffers);
    NODE_SET_METHOD(GL, "transform",            radamn::v8_gl_transform);
    NODE_SET_METHOD(GL, "setTransform",         radamn::v8_gl_set_transform);
    NODE_SET_METHOD(GL, "stroke",               radamn::v8_gl_stroke);
    NODE_SET_METHOD(GL, "fill",                 radamn::v8_gl_fill);

    NODE_SET_METHOD(GL, "translate",            radamn::v8_gl_translate);
    NODE_SET_METHOD(GL, "rotate",               radamn::v8_gl_rotate);
    NODE_SET_METHOD(GL, "scale",                radamn::v8_gl_scale);

    NODE_SET_METHOD(GL, "save",                 radamn::v8_gl_save);
    NODE_SET_METHOD(GL, "restore",              radamn::v8_gl_restore);

    v8::Local<v8::Object> Image = v8::Object::New();
    target->Set(v8::String::New("Image"), Image);
    NODE_SET_METHOD(Image, "load", radamn::v8_image_load);
    NODE_SET_METHOD(Image, "destroy", radamn::v8_image_destroy);
    NODE_SET_METHOD(Image, "draw", radamn::v8_image_draw);
    //NODE_SET_PROTOTYPE_METHOD(Image, "drawImageQuads", radamn::Image::drawImageQuads);

    v8::Local<v8::Object> Font = v8::Object::New();
    target->Set(v8::String::New("Font"), Font);
    NODE_SET_METHOD(Font, "load", radamn::v8_font_load);
    NODE_SET_METHOD(Font, "getImage", radamn::v8_font_text_to_image);
    NODE_SET_METHOD(Font, "destroy", radamn::v8_font_destroy);
    NODE_SET_METHOD(Font, "measureText", radamn::v8_font_text_size);

    //radamn::Creator::s_ct->Set("init", target);

    }

    gl* opengl = gl::singleton();

    NODE_MODULE(Creator, init);
}



//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> radamn::quit(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!(args.Length() == 0)) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected Quit()")));
    }

    TTF_Quit();
    VERBOSE << "TTF_Quit" << ENDL;
    SDL_Quit();
    VERBOSE << "SDL_Quit" << ENDL;

    return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// XXX opengl version / openglES
static v8::Handle<v8::Value> radamn::getVersion(const v8::Arguments& args) {
    char buffer[256];

    const SDL_VideoInfo* VideoInfo = SDL_GetVideoInfo();

    sprintf(buffer, "SDL %d.%d.%d\n%s\n GL %s, %s, %s %s\n GLU \n\n",
        SDL_MAJOR_VERSION, SDL_MINOR_VERSION, SDL_PATCHLEVEL,
        PNG_HEADER_VERSION_STRING,
        glGetString(GL_VENDOR),
        glGetString(GL_RENDERER),
        glGetString(GL_VERSION),
        glGetString(GL_EXTENSIONS)
    );
/*

    VideoInfo->hw_available,
    VideoInfo->wm_available,
    VideoInfo->blit_hw,
    VideoInfo->blit_hw_CC,
    VideoInfo->blit_hw_A,
    VideoInfo->blit_sw,
    VideoInfo->blit_sw_CC,
    VideoInfo->blit_sw_A,
    VideoInfo->blit_fill,
    VideoInfo->video_mem,

VideoInfo->vfmt->BitsPerPixel;
VideoInfo->vfmt->BytesPerPixel;
VideoInfo->vfmt->Rloss,
VideoInfo->vfmt->Gloss,
VideoInfo->vfmt->Bloss,
VideoInfo->vfmt->Aloss;
VideoInfo->vfmt->Rshift,
VideoInfo->vfmt->Gshift,
VideoInfo->vfmt->Bshift,
VideoInfo->vfmt->Ashift;
VideoInfo->vfmt->Rmask,
VideoInfo->vfmt->Gmask,
VideoInfo->vfmt->Bmask,
VideoInfo->vfmt->Amask;
VideoInfo->vfmt->colorkey;
VideoInfo->vfmt->alpha;

    VideoInfo->current_w,
    VideoInfo->current_h,
*/

    return v8::String::New( buffer );
}

//
// ----------------------------------------------------------------------------------------------------
//

// for multiple display support check: http://wiki.libsdl.org/moin.cgi/SDL_CreateRenderer

static v8::Handle<v8::Value> radamn::createWindow(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (!(args.Length() == 2 && args[0]->IsNumber() && args[1]->IsNumber())) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected SetVideoMode(Number, Number, Number, Number)")));
    }

    int width = (args[0]->Int32Value());
    int height = (args[1]->Int32Value());

    SDL_Surface* screen = 0;
#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    screen = SDL_SetVideoMode(width, height, 16, SDL_SWSURFACE);
    if (!screen) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Cannot create the window!")));
    }
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
    screen = SDL_SetVideoMode(width, height, 16, SDL_OPENGL | SDL_HWSURFACE);

    if (!screen) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Cannot create the window!")));
    }

    SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER,    1);
    SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE,    0);

    SDL_GL_SetAttribute(SDL_GL_RED_SIZE,        8);
    SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE,      8);
    SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE,       8);
    SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE,      8);

    SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE,      32);
    SDL_GL_SetAttribute(SDL_GL_BUFFER_SIZE,     32);

    SDL_GL_SetAttribute(SDL_GL_ACCUM_RED_SIZE,    0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_GREEN_SIZE,  0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_BLUE_SIZE,   0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_ALPHA_SIZE,  0);

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
    glShadeModel(GL_FLAT);

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    return ThrowException(v8::Exception::TypeError(v8::String::New("OPENGLES is not supported atm")));
#endif

    VERBOSE << "window created" << ENDL;

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

//true any
//throw if error
//array with the list

static v8::Handle<v8::Value> radamn::getVideoModes(const v8::Arguments& args) {
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
static v8::Handle<v8::Value> radamn::getWindow(const v8::Arguments& args) {
    return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// return a proper structure with all data needed!
v8::Handle<v8::Value> radamn::getJoysticks(const v8::Arguments& args) {
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

    void PrintKeyInfo( SDL_KeyboardEvent *key );

    /* Print modifier info */
    void PrintModifiers( Uint16 mod ){
        printf( "Modifers: " );

        /* If there are none then say so and return */
        if( mod == KMOD_NONE ){
            printf( "None\n" );
            return;
        }

        /* Check for the presence of each SDLMod value */
        /* This looks messy, but there really isn't    */
        /* a clearer way.                              */
        if( mod & KMOD_NUM ) printf( "NUMLOCK " );
        if( mod & KMOD_CAPS ) printf( "CAPSLOCK " );
        if( mod & KMOD_LCTRL ) printf( "LCTRL " );
        if( mod & KMOD_RCTRL ) printf( "RCTRL " );
        if( mod & KMOD_RSHIFT ) printf( "RSHIFT " );
        if( mod & KMOD_LSHIFT ) printf( "LSHIFT " );
        if( mod & KMOD_RALT ) printf( "RALT " );
        if( mod & KMOD_LALT ) printf( "LALT " );
        if( mod & KMOD_CTRL ) printf( "CTRL " );
        if( mod & KMOD_SHIFT ) printf( "SHIFT " );
        if( mod & KMOD_ALT ) printf( "ALT " );
        printf( "\n" );
    }


    /* Print all information about a key event */
    void PrintKeyInfo( SDL_KeyboardEvent *key ){
        /* Is it a release or a press? */
        if( key->type == SDL_KEYUP )
            printf( "Release:- " );
        else
            printf( "Press:- " );

        /* Print the hardware scancode first */
        printf( "Scancode: 0x%02X", key->keysym.scancode );
        /* Print the name of the key */
        printf( ", Name: %s", SDL_GetKeyName( key->keysym.sym ) );
        /* We want to print the unicode info, but we need to make */
        /* sure its a press event first (remember, release events */
        /* don't have unicode info                                */
        if( key->type == SDL_KEYDOWN ){
            /* If the Unicode value is less than 0x80 then the    */
            /* unicode value can be used to get a printable       */
            /* representation of the key, using (char)unicode.    */
            printf(", Unicode: " );
            if( key->keysym.unicode < 0x80 && key->keysym.unicode > 0 ){
                printf( "%c (0x%04X)", (char)key->keysym.unicode,
                        key->keysym.unicode );
            }
            else{
                printf( "? (0x%04X)", key->keysym.unicode );
            }
        }
        printf( "\n" );
        /* Print modifier info */
        PrintModifiers( key->keysym.mod );
    }


// i will follow mozilla docs
// https://developer.mozilla.org/en/DOM/KeyboardEvent
// http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent
// touch events: https://dvcs.w3.org/hg/webevents/raw-file/tip/touchevents.html
v8::Handle<v8::Value> radamn::pollEvent(const v8::Arguments& args) {
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
        PrintKeyInfo(&event.key);
        // TODO: support keypress ?
        evt->Set(v8::String::New("type"), v8::String::New(event.type == SDL_KEYDOWN ? "keydown" : "keyup"));

        std::cout << (int) event.key.keysym.sym << ENDL;
        // do ui have to mach every key from-sdl-to-w3c... :***
        evt->Set(v8::String::New("key"),     v8::Number::New(event.key.keysym.sym));

        // it works at home, dont work at work... nice dilema
        evt->Set(v8::String::New("char"),    v8::String::New(SDL_GetKeyName(event.key.keysym.sym)));

        evt->Set(v8::String::New("keyCode"), v8::Number::New((int)event.key.keysym.sym));

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
