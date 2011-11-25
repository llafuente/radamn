#ifndef RADAMN_IMAGE_H_
#define RADAMN_IMAGE_H_

#include <v8.h>
#include "radamn.h"

namespace Radamn {
    namespace Image {
        static v8::Handle<v8::Value> load(const v8::Arguments& args);
        static v8::Handle<v8::Value> draw(const v8::Arguments& args);
        static v8::Handle<v8::Value> drawImageQuads(const v8::Arguments& args);
        static v8::Handle<v8::Value> destroy(const v8::Arguments& args);
    }
}

#endif // RADAMN_IMAGE_H_

