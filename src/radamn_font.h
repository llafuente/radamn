#ifndef RADAMN_FONT_H_
#define RADAMN_FONT_H_

#include <v8.h>
#include "prerequisites.h"

namespace Radamn {
    namespace Font {
        v8::Handle<v8::Value> load(const v8::Arguments& args);
        v8::Handle<v8::Value> getImage(const v8::Arguments& args);
        v8::Handle<v8::Value> destroy(const v8::Arguments& args);
    }
}

#endif // RADAMN_FONT_H_
