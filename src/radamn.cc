#include "radamn.h"

#include "prerequisites.h"
#include "v8_helper.h"

#include "radamn_image.h"
#include "radamn_font.h"
#include "radamn_window.h"

#include <SDL_version.h>
#include <SDL_ttf.h>

#include "gl.h"
#include <node.h>
#include <v8.h>
#include <ctime>

using namespace radamn;

unsigned int radamn::input::mouse_buttons = 0;

//
// ----------------------------------------------------------------------------------------------------
//

v8::Handle<v8::Value> radamn::v8_init(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

    if (SDL_Init( SDL_INIT_EVERYTHING ) < 0)  {
        return ThrowException(v8::Exception::Error(
            v8::String::Concat(
                v8::String::New("Error initializing SDL: "),
                v8::String::New(SDL_GetError())
            )
        ));
    }

    //SDL_EnableUNICODE(1);

    if(TTF_Init() == -1) {
        return ThrowException(v8::Exception::Error(v8::String::Concat(
            v8::String::New("TTF_Init:: "),
            v8::String::New(TTF_GetError())
        )));
    }

    VERBOSE << "TTF inited" << ENDL;

    VERBOSE << "end" << ENDL;
    return v8::Undefined();
}

#ifdef _WIN32
    void NODE_EXTERN radamn::Creator::Init(v8::Handle<v8::Object> target)
#else
    void radamn::Creator::Init(v8::Handle<v8::Object> target)
#endif
{
    VERBOSE << "THIS IS NEVER CALL RIGHT!" << ENDL;
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

        NODE_SET_METHOD(target, "init", radamn::v8_init);

        NODE_SET_METHOD(target, "quit", radamn::v8_quit);

        NODE_SET_METHOD(target, "time", radamn::v8_time);

        NODE_SET_METHOD(target, "getVersion", radamn::v8_getVersion);
        NODE_SET_METHOD(target, "createWindow", radamn::v8_createWindow);
        NODE_SET_METHOD(target, "getJoysticks", radamn::v8_getJoysticks);
        NODE_SET_METHOD(target, "pollEvent", radamn::v8_pollEvent);

        v8::Local<v8::Object> Window = v8::Object::New();
        target->Set(v8::String::New("Window"), Window);

        NODE_SET_METHOD(Window, "screenshot",           radamn::window::v8_screenshot);


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

        // this is not a real shim of image... this need to be 100% compat
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

    }

    gl* opengl = gl::singleton();

    NODE_MODULE(cradamn, init);
}



//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> radamn::v8_quit(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

    v8::HandleScope scope;

    if (!(args.Length() == 0)) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected Quit()")));
    }

    TTF_Quit();
    VERBOSE << "TTF_Quit" << ENDL;

    gl::destroy();

    if(radamn::window::context) {
        SDL_GL_DeleteContext(radamn::window::context);
    }
    if(radamn::window::win) {
        SDL_DestroyWindow(radamn::window::win);
    }

    SDL_Quit();
    VERBOSE << "SDL_Quit" << ENDL;

    VERBOSE << "end" << ENDL;

    return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

// XXX opengl version / openglES
static v8::Handle<v8::Value> radamn::v8_getVersion(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

    char buffer[256];

    //const SDL_VideoInfo* VideoInfo = SDL_GetVideoInfo();

    sprintf(buffer, "SDL %d.%d.%d\n%s\n GL %s, %s, %s %s\n GLU \n\n",
        SDL_MAJOR_VERSION, SDL_MINOR_VERSION, SDL_PATCHLEVEL,
        PNG_HEADER_VERSION_STRING,
        glGetString(GL_VENDOR),
        glGetString(GL_RENDERER),
        glGetString(GL_VERSION),
        glGetString(GL_EXTENSIONS)
    );

    VERBOSE << "end" << ENDL;

    return v8::String::New( buffer );
}

//
// ----------------------------------------------------------------------------------------------------
//

// for multiple display support check: http://wiki.libsdl.org/moin.cgi/SDL_CreateRenderer

static v8::Handle<v8::Value> radamn::v8_createWindow(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

    v8::HandleScope scope;

    if (!(args.Length() == 2 && args[0]->IsNumber() && args[1]->IsNumber())) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("invalid arguments: Expected SetVideoMode(Number, Number, Number, Number)")));
    }

    int width = (args[0]->Int32Value());
    int height = (args[1]->Int32Value());

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    return ThrowException(v8::Exception::TypeError(v8::String::New("cannot create the window")));
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL



    VERBOSE << "SDL_GL_RED_SIZE     " << SDL_GL_SetAttribute(SDL_GL_RED_SIZE,           8) << ENDL;
    VERBOSE << "SDL_GL_GREEN_SIZE   " << SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE,         8) << ENDL;
    VERBOSE << "SDL_GL_BLUE_SIZE    " << SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE,          8) << ENDL;
    VERBOSE << "SDL_GL_ALPHA_SIZE   " << SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE,         8) << ENDL;
    //VERBOSE << "SDL_GL_BUFFER_SIZE  " << SDL_GL_SetAttribute(SDL_GL_BUFFER_SIZE,        16) << ENDL;
    VERBOSE << "SDL_GL_DOUBLEBUFFER " << SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER,       1) << ENDL;
    VERBOSE << "SDL_GL_DEPTH_SIZE   " << SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE,         32) << ENDL;

    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 2);

/*
    SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE,       0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_RED_SIZE,     0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_GREEN_SIZE,   0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_BLUE_SIZE,    0);
    SDL_GL_SetAttribute(SDL_GL_ACCUM_ALPHA_SIZE,   0);
    SDL_GL_SetAttribute(SDL_GL_STEREO,             0);
    SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS, 0); // 1
    SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES, 0); // 2
    //deprecated: SDL_GL_SetAttribute(SDL_GL_RETAINED_BACKING,   1);
*/

    VERBOSE << "SDL_GL_ACCELERATED_VISUAL " << SDL_GL_SetAttribute(SDL_GL_ACCELERATED_VISUAL, 1) << ENDL;


    int n, video_driver_id=0;
    n = SDL_GetNumVideoDrivers();
    for (int i = 0; i < n; ++i) {
        VERBOSE << "VideoDriver [" << SDL_GetVideoDriver(i) << "]" << ENDL;
        if(SDL_strcasecmp(SDL_GetVideoDriver(i), "windows") == 0) { //this must be editted!
            video_driver_id = i;
        }
    }

    VERBOSE << "Creating VideoDriver [" << video_driver_id << "]" << ENDL;
    if( SDL_VideoInit( SDL_GetVideoDriver(video_driver_id) ) != 0) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("SDL_VideoInit error")));
    }

    // SDL_WINDOW_FULLSCREEN;
    // SDL_WINDOW_BORDERLESS
    // SDL_WINDOW_RESIZABLE
    // SDL_WINDOW_MINIMIZED
    // SDL_WINDOW_MAXIMIZED
    // SDL_WINDOW_INPUT_GRABBED
    radamn::window::win = SDL_CreateWindow("radamn", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, width, height, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);

    if(radamn::window::win == NULL) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("SDL_CreateWindow error")));
    }

#ifdef ANDROID || IOS
    SDL_SetWindowFullscreen(mainwindow, SDL_TRUE);
#endif

    radamn::window::context = SDL_GL_CreateContext(radamn::window::win);

    if(radamn::window::context == NULL) {
        VERBOSE << "SDL_GL_CreateContext: " << SDL_GetError() << ENDL;
        return ThrowException(v8::Exception::TypeError(v8::String::New("cannot create gl context")));
    }

    //vsync ?
    SDL_GL_SetSwapInterval(1);

    SDL_GetWindowSize(radamn::window::win, &radamn::window::width, &radamn::window::height);

    VERBOSE << "WIN ADDR = " << (long int) radamn::window::win << ENDL;

    glClearDepth(1.0f);
    glViewport(0, 0, radamn::window::width, radamn::window::height);

    glMatrixMode(GL_TEXTURE);
    glLoadIdentity();

    // 2d projection matrix
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho (0, width, height, 0, -1, 1); // flip Y

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    glDisable(GL_DEPTH_TEST);
    glShadeModel(GL_FLAT); // GL_SMOOTH

    glClearColor(1, 1, 1, 1);
    glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
    SDL_GL_SwapWindow(radamn::window::win);

    VERBOSE << "window width: " << radamn::window::width << "px"<< ENDL;
    VERBOSE << "window height: " << radamn::window::height << "px" << ENDL;

    SDL_DisplayMode mode;
    SDL_GetCurrentDisplayMode(0, &mode);
    SDL_PixelFormatEnumToMasks(mode.format, &radamn::window::bpp, &radamn::window::rmask, &radamn::window::gmask, &radamn::window::bmask, &radamn::window::amask);
    VERBOSE << "BPP: " << radamn::window::bpp << ENDL;
    VERBOSE << "RMASK: " << radamn::window::rmask << ENDL;
    VERBOSE << "GMASK: " << radamn::window::gmask << ENDL;
    VERBOSE << "BMASK: " << radamn::window::bmask << ENDL;
    VERBOSE << "AMASK: " << radamn::window::amask << ENDL;

    VERBOSE << "Swap Interval : " << SDL_GL_GetSwapInterval() << ENDL;
    VERBOSE << "Vendor        : " << glGetString(GL_VENDOR)   << ENDL;
    VERBOSE << "Renderer      : " << glGetString(GL_RENDERER) << ENDL;
    VERBOSE << "Version       : " << glGetString(GL_VERSION)  << ENDL;


    int status,
        value;

    status = SDL_GL_GetAttribute(SDL_GL_RED_SIZE, &value);
    if (!status) {
        VERBOSE << "SDL_GL_RED_SIZE: requested 5, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_RED_SIZE: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_GREEN_SIZE, &value);
    if (!status) {
        VERBOSE << "SDL_GL_GREEN_SIZE: requested 5, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_GREEN_SIZE: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_BLUE_SIZE, &value);
    if (!status) {
        VERBOSE << "SDL_GL_BLUE_SIZE: requested 5, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_BLUE_SIZE: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_ALPHA_SIZE, &value);
    if (!status) {
        VERBOSE << "SDL_GL_ALPHA_SIZE: requested 5, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_ALPHA_SIZE: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_DEPTH_SIZE, &value);
    if (!status) {
        VERBOSE << "SDL_GL_DEPTH_SIZE: requested 16, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_DEPTH_SIZE: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_MULTISAMPLEBUFFERS, &value);
    if (!status) {
        VERBOSE << "SDL_GL_MULTISAMPLEBUFFERS: requested 1, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_MULTISAMPLEBUFFERS: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_MULTISAMPLESAMPLES, &value);
    if (!status) {
        VERBOSE << "SDL_GL_MULTISAMPLESAMPLES: requested 1, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_MULTISAMPLESAMPLES: " << SDL_GetError() << ENDL;
    }
    status = SDL_GL_GetAttribute(SDL_GL_ACCELERATED_VISUAL, &value);
    if (!status) {
        VERBOSE << "SDL_GL_ACCELERATED_VISUAL: requested 1, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_ACCELERATED_VISUAL: " << SDL_GetError() << ENDL;
    }

    status = SDL_GL_GetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, &value);
    if (!status) {
        VERBOSE << "SDL_GL_CONTEXT_MAJOR_VERSION: requested 3, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_CONTEXT_MAJOR_VERSION: " << SDL_GetError() << ENDL;
    }

    status = SDL_GL_GetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, &value);
    if (!status) {
        VERBOSE << "SDL_GL_CONTEXT_MINOR_VERSION: requested 2, got " << value << ENDL;
    } else {
        VERBOSE << "Failed to get SDL_GL_CONTEXT_MINOR_VERSION: " << SDL_GetError() << ENDL;
    }





    if(!gl::setup()) {
        return ThrowException(v8::Exception::TypeError(v8::String::New("gl::setup failed")));
    }

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    return ThrowException(v8::Exception::TypeError(v8::String::New("OPENGLES is not supported atm")));
#endif

    VERBOSE << "end" << ENDL;

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

// return a proper structure with all data needed!
v8::Handle<v8::Value> radamn::v8_getJoysticks(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

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

    VERBOSE << "end" << ENDL;

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
v8::Handle<v8::Value> radamn::v8_pollEvent(const v8::Arguments& args) {
    VERBOSE << "start" << ENDL;

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



    evt->Set(v8::String::New("CAPTURING_PHASE"),  v8::Number::New(1), v8::ReadOnly);
    evt->Set(v8::String::New("AT_TARGET"),        v8::Number::New(2), v8::ReadOnly);
    evt->Set(v8::String::New("BUBBLING_PHASE"),   v8::Number::New(3), v8::ReadOnly);

    evt->Set(v8::String::New("target"),           v8::Null(), v8::ReadOnly);
    evt->Set(v8::String::New("currentTarget"),    v8::Null(), v8::ReadOnly);
    //evt->Set(v8::String::New("eventPhase"),       3, v8::ReadOnly);
    evt->Set(v8::String::New("bubbles"),          v8::Boolean::New(true), v8::ReadOnly);
    evt->Set(v8::String::New("timeStamp"),        v8::Number::New(time(0)), v8::ReadOnly);

    switch (event.type) {
    case SDL_WINDOWEVENT:
        return v8::False();
    //case SDL_ACTIVEEVENT:
    //    evt->Set(v8::String::New("type"),  v8::String::New("ACTIVEEVENT"));
    //    evt->Set(v8::String::New("gain"),  v8::Number::New(event.active.gain));
    //    evt->Set(v8::String::New("state"), v8::Number::New(event.active.state));
        break;
    case SDL_KEYDOWN:
    case SDL_KEYUP:
        // PrintKeyInfo(&event.key);
        // TODO: support keypress ?
        evt->Set(v8::String::New("type"), v8::String::New(event.type == SDL_KEYDOWN ? "keydown" : "keyup"), v8::ReadOnly);
        evt->Set(v8::String::New("cancelable"),       v8::Boolean::New(true), v8::ReadOnly);

        // do ui have to mach every key from-sdl-to-w3c... :***
        evt->Set(v8::String::New("key"),     v8::Number::New(event.key.keysym.sym), v8::ReadOnly);

        {
            const char* key_char = SDL_GetKeyName(event.key.keysym.sym);
            char* key_char_cpy;
            key_char_cpy = (char*) malloc(strlen(key_char) +1);
            int i;
            for(i = 0; key_char[ i ]; ++i) {
                key_char_cpy[i] = tolower(key_char[ i ]);
            }
            key_char_cpy[i] = '\0';
            evt->Set(v8::String::New("char"),    v8::String::New(key_char_cpy), v8::ReadOnly);
            free(key_char_cpy);
        } // this is needed, I know... funny!

        evt->Set(v8::String::New("keyCode"), v8::Number::New((int)event.key.keysym.sym));

        evt->Set(v8::String::New("locale"), v8::String::New(""));

        evt->Set(v8::String::New("repeat"), v8::Number::New(0));

        evt->Set(v8::String::New("metaKey"),  v8::Boolean::New( false ), v8::ReadOnly);
        evt->Set(v8::String::New("altKey"),   v8::Boolean::New( KMOD_ALT == (KMOD_ALT & event.key.keysym.mod) ), v8::ReadOnly);
        evt->Set(v8::String::New("ctrlKey"),  v8::Boolean::New( KMOD_CTRL == (KMOD_CTRL & event.key.keysym.mod) ), v8::ReadOnly);
        evt->Set(v8::String::New("shiftKey"), v8::Boolean::New( KMOD_SHIFT == (KMOD_SHIFT & event.key.keysym.mod) ), v8::ReadOnly);

        break;
    case SDL_MOUSEMOTION:
    case SDL_MOUSEBUTTONDOWN:
    case SDL_MOUSEBUTTONUP:
    case SDL_MOUSEWHEEL:
        // TODO: detail, click count
        evt->Set(v8::String::New("cancelable"),       v8::Boolean::New(true), v8::ReadOnly);

        evt->Set(v8::String::New("screenX"), v8::Number::New(event.motion.xrel));
        evt->Set(v8::String::New("screenY"), v8::Number::New(event.motion.yrel));

        evt->Set(v8::String::New("clientX"), v8::Number::New(event.motion.x), v8::ReadOnly);
        evt->Set(v8::String::New("clientY"), v8::Number::New(event.motion.y), v8::ReadOnly);

        evt->Set(v8::String::New("metaKey"),  v8::Boolean::New( false ), v8::ReadOnly);
        evt->Set(v8::String::New("altKey"),   v8::Boolean::New( KMOD_ALT == (KMOD_ALT & event.key.keysym.mod) ), v8::ReadOnly);
        evt->Set(v8::String::New("ctrlKey"),  v8::Boolean::New( KMOD_CTRL == (KMOD_CTRL & event.key.keysym.mod) ), v8::ReadOnly);
        evt->Set(v8::String::New("shiftKey"), v8::Boolean::New( KMOD_SHIFT == (KMOD_SHIFT & event.key.keysym.mod) ), v8::ReadOnly);

        //evt->Set(String::New("which"), Number::New(event.motion.which));
        evt->Set(v8::String::New("state"),   v8::Number::New(event.motion.state), v8::ReadOnly);

        evt->Set(v8::String::New("x"),       v8::Number::New(event.motion.x), v8::ReadOnly);
        evt->Set(v8::String::New("y"),       v8::Number::New(event.motion.y), v8::ReadOnly);

        // 0 must indicates no button is currently active.
        // 1 must indicate the primary button of the device (in general, the left button or the only button on single-button devices, used to activate a user interface control or select text).
        // 2 must indicate the secondary button (in general, the right button, often used to display a context menu), if present.
        // 4 must indicate the auxiliary button (in general, the middle button, often combined with a mouse wheel).


        switch(event.type) {
        case SDL_MOUSEWHEEL :
            evt->Set(v8::String::New("type"),   v8::String::New("wheel"), v8::ReadOnly);
            evt->Set(v8::String::New("deltaX"), v8::Number::New(event.wheel.x), v8::ReadOnly);
            evt->Set(v8::String::New("deltaY"), v8::Number::New(event.wheel.y), v8::ReadOnly);
            //evt->Set(v8::String::New("deltaZ"), v8::Number::New(event.wheel.z * 50), v8::ReadOnly);
            evt->Set(v8::String::New("deltaMode"), v8::String::New("pixels"), v8::ReadOnly);
            break;
        case SDL_MOUSEMOTION :
            evt->Set(v8::String::New("type"),    v8::String::New("mousemove"), v8::ReadOnly);
            evt->Set(v8::String::New("button"),  v8::Number::New(event.button.button));
            break;
        case SDL_MOUSEBUTTONDOWN :
            evt->Set(v8::String::New("type"),   v8::String::New("mousedown"), v8::ReadOnly);
            evt->Set(v8::String::New("button"), v8::Number::New(event.button.button));

            switch(event.button.button) {
                case 1 : //middle
                    radamn::input::mouse_buttons = radamn::input::mouse_buttons | 4;
                    break;
                case 2 : //left
                    radamn::input::mouse_buttons = radamn::input::mouse_buttons | 1;
                    break;
                case 3 : //right
                    radamn::input::mouse_buttons = radamn::input::mouse_buttons | 2;
                    break;
            }

            break;
        case SDL_MOUSEBUTTONUP :
            evt->Set(v8::String::New("type"),   v8::String::New("mouseup"), v8::ReadOnly);
            evt->Set(v8::String::New("button"), v8::Number::New(event.button.button));

            switch(event.button.button) {
                case 1 : //middle
                    radamn::input::mouse_buttons = radamn::input::mouse_buttons & ~4;
                    break;
                case 2 : //left
                    radamn::input::mouse_buttons = radamn::input::mouse_buttons & ~1;
                    break;
                case 3 : //right
                    radamn::input::mouse_buttons = radamn::input::mouse_buttons & ~2;
                    break;
            }

            break;
        }

        evt->Set(v8::String::New("buttons"),       v8::Number::New(radamn::input::mouse_buttons), v8::ReadOnly);

    break;

    // my own DOMJoystickEvent based on mozilla: MozJoyAxisMove, MozJoyButtonUp, MozJoyButtonDown
    case SDL_JOYAXISMOTION:
        evt->Set(v8::String::New("type"),  v8::String::New("joyaxismove"), v8::ReadOnly);
        evt->Set(v8::String::New("cancelable"),       v8::Boolean::New(true), v8::ReadOnly);

        evt->Set(v8::String::New("which"), v8::Number::New(event.jaxis.which));
        evt->Set(v8::String::New("axis"),  v8::Number::New(event.jaxis.axis));
        evt->Set(v8::String::New("value"), v8::Number::New(event.jaxis.value));
        break;
    case SDL_JOYBALLMOTION:
        evt->Set(v8::String::New("type"),   v8::String::New("joyballmove"), v8::ReadOnly);
        evt->Set(v8::String::New("cancelable"),       v8::Boolean::New(true), v8::ReadOnly);

        evt->Set(v8::String::New("button"), v8::Number::New(event.jball.which));
        evt->Set(v8::String::New("ball"),   v8::Number::New(event.jball.ball));
        evt->Set(v8::String::New("deltaX"), v8::Number::New(event.jball.xrel));
        evt->Set(v8::String::New("deltaY"), v8::Number::New(event.jball.yrel));
        break;
    case SDL_JOYHATMOTION:
        evt->Set(v8::String::New("type"),   v8::String::New("joyhatmove"), v8::ReadOnly);
        evt->Set(v8::String::New("cancelable"),       v8::Boolean::New(true), v8::ReadOnly);

        evt->Set(v8::String::New("button"), v8::Number::New(event.jhat.which));
        evt->Set(v8::String::New("hat"),    v8::Number::New(event.jhat.hat));
        evt->Set(v8::String::New("value"),  v8::Number::New(event.jhat.value));
        break;
    case SDL_JOYBUTTONDOWN:
    case SDL_JOYBUTTONUP:
        evt->Set(v8::String::New("type"),   v8::String::New(event.type == SDL_JOYBUTTONDOWN ? "joybuttondown" : "joybuttonup"), v8::ReadOnly);
        evt->Set(v8::String::New("cancelable"),       v8::Boolean::New(true), v8::ReadOnly);

        //evt->Set(String::New("which"), Number::New(event.jbutton.which));
        evt->Set(v8::String::New("button"), v8::Number::New(event.jbutton.button));
        break;
    case SDL_QUIT:
        evt->Set(v8::String::New("type"),      v8::String::New("quit"), v8::ReadOnly);
        evt->Set(v8::String::New("cancelable"),v8::Boolean::New(false), v8::ReadOnly);
        break;
    default:
        evt->Set(v8::String::New("type"),      v8::String::New("not-supported"), v8::ReadOnly);
        evt->Set(v8::String::New("typeCode"),  v8::Number::New(event.type));
        evt->Set(v8::String::New("cancelable"),v8::Boolean::New(false), v8::ReadOnly);
        break;
    }

    VERBOSE << "end" << ENDL;

    return scope.Close(evt);
}

//
// ----------------------------------------------------------------------------------------------------
//


v8::Handle<v8::Value> radamn::v8_time(const v8::Arguments& args) {

    v8::HandleScope scope;

    return scope.Close(v8::Number::New(SDL_GetTicks()));
}

//
// ----------------------------------------------------------------------------------------------------
//
