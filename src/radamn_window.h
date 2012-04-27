#ifndef RADAMN_WINDOW_H_
#define RADAMN_WINDOW_H_

#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>

namespace radamn {
    namespace window {
        static Uint32 mBackgroundColor = 0;

        v8::Handle<v8::Value> setCaption(const v8::Arguments& args);
        v8::Handle<v8::Value> setIcon(const v8::Arguments& args);
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
