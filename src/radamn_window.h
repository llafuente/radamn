#ifndef RADAMN_WINDOW_H_
#define RADAMN_WINDOW_H_

#include <node.h>
#include <v8.h>
#include <SDL.h>
#include <SDL_stdinc.h>


namespace Radamn {
    namespace Window {
        static Uint32 mBackgroundColor = 0;

        static v8::Handle<v8::Value> setCaption(const v8::Arguments& args);
        static v8::Handle<v8::Value> setIcon(const v8::Arguments& args);
        static v8::Handle<v8::Value> setBackgroundColor(const v8::Arguments& args);
        static v8::Handle<v8::Value> setBackgroundImage(const v8::Arguments& args);
        static v8::Handle<v8::Value> getRootNode(const v8::Arguments& args);

        static v8::Handle<v8::Value> empty(const v8::Arguments& args);
        static v8::Handle<v8::Value> clear(const v8::Arguments& args);
        static v8::Handle<v8::Value> flip(const v8::Arguments& args);

        static v8::Handle<v8::Value> grabInput(const v8::Arguments& args);
        static v8::Handle<v8::Value> releaseInput(const v8::Arguments& args);

        static v8::Handle<v8::Value> isFullscreen(const v8::Arguments& args);
        static v8::Handle<v8::Value> isVisible(const v8::Arguments& args);
        static v8::Handle<v8::Value> getPosition(const v8::Arguments& args);

        static v8::Handle<v8::Value> show(const v8::Arguments& args);
        static v8::Handle<v8::Value> hide(const v8::Arguments& args);
        static v8::Handle<v8::Value> maximize(const v8::Arguments& args);
        static v8::Handle<v8::Value> minimize(const v8::Arguments& args);
        static v8::Handle<v8::Value> fullscreen(const v8::Arguments& args);
        static v8::Handle<v8::Value> windowed(const v8::Arguments& args);

        //canvas
        static v8::Handle<v8::Value> translate(const v8::Arguments& args);
        static v8::Handle<v8::Value> rotate(const v8::Arguments& args);
        static v8::Handle<v8::Value> scale(const v8::Arguments& args);
        static v8::Handle<v8::Value> save(const v8::Arguments& args);
        static v8::Handle<v8::Value> restore(const v8::Arguments& args);
        static v8::Handle<v8::Value> stroke(const v8::Arguments& args);
        static v8::Handle<v8::Value> transform(const v8::Arguments& args);
        static v8::Handle<v8::Value> setTransform(const v8::Arguments& args);

        // radamn specific
        static v8::Handle<v8::Value> screenshot(const v8::Arguments& args);
    }
}

#endif // RADAMN_WINDOW_H_
