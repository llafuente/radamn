#ifndef RADAMN_WINDOW_H_
#define RADAMN_WINDOW_H_

#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>

namespace radamn {
    namespace window {

        extern SDL_Window * win;
        extern SDL_Renderer * renderer;
        extern SDL_GLContext context;
        extern int width;
        extern int height;

        extern Uint32 rmask;
        extern Uint32 gmask;
        extern Uint32 bmask;
        extern Uint32 amask;
        extern int bpp;

        extern Uint32 mBackgroundColor;


        // someday...
        //v8::Handle<v8::Value> getRootNode(const v8::Arguments& args);
        //
        //v8::Handle<v8::Value> grabInput(const v8::Arguments& args);
        //v8::Handle<v8::Value> releaseInput(const v8::Arguments& args);
        //
        //v8::Handle<v8::Value> isFullscreen(const v8::Arguments& args);
        //v8::Handle<v8::Value> isVisible(const v8::Arguments& args);
        //v8::Handle<v8::Value> getPosition(const v8::Arguments& args);
        //
        //v8::Handle<v8::Value> show(const v8::Arguments& args);
        //v8::Handle<v8::Value> hide(const v8::Arguments& args);
        //v8::Handle<v8::Value> maximize(const v8::Arguments& args);
        //v8::Handle<v8::Value> minimize(const v8::Arguments& args);
        //v8::Handle<v8::Value> fullscreen(const v8::Arguments& args);
        //v8::Handle<v8::Value> windowed(const v8::Arguments& args);

        // radamn specific
        v8::Handle<v8::Value> v8_screenshot(const v8::Arguments& args);
    }
}

#endif // RADAMN_WINDOW_H_
