#ifndef RADAMN_WINDOW_H_
#define RADAMN_WINDOW_H_

#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>

namespace radamn {
    namespace window {
        static SDL_Window * win;
        static SDL_Renderer * renderer;
        static int width = 0;
        static int height = 0;

        static Uint32 rmask = 0;
        static Uint32 gmask = 0;
        static Uint32 bmask = 0;
        static Uint32 amask = 0;
        static int bpp =0;

        static Uint32 mBackgroundColor = 0;

        v8::Handle<v8::Value> getRootNode(const v8::Arguments& args);

        v8::Handle<v8::Value> grabInput(const v8::Arguments& args);
        v8::Handle<v8::Value> releaseInput(const v8::Arguments& args);

        v8::Handle<v8::Value> isFullscreen(const v8::Arguments& args);
        v8::Handle<v8::Value> isVisible(const v8::Arguments& args);
        v8::Handle<v8::Value> getPosition(const v8::Arguments& args);

        v8::Handle<v8::Value> show(const v8::Arguments& args);
        v8::Handle<v8::Value> hide(const v8::Arguments& args);
        v8::Handle<v8::Value> maximize(const v8::Arguments& args);
        v8::Handle<v8::Value> minimize(const v8::Arguments& args);
        v8::Handle<v8::Value> fullscreen(const v8::Arguments& args);
        v8::Handle<v8::Value> windowed(const v8::Arguments& args);

        // radamn specific
        v8::Handle<v8::Value> screenshot(const v8::Arguments& args);
    }
}

#endif // RADAMN_WINDOW_H_
