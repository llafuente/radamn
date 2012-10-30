#ifndef RADAMN_H_
#define RADAMN_H_

#pragma comment(lib, "node")

/*
   Copyright (C) 2011 by Luis Lafuente <llafuente@noboxout.com>
   Part of the Radamn Project

   See the LICENSE file for more details.
*/


/*
info: http://v8.googlecode.com/svn/trunk/test/cctest/test-accessors.cc
inspiration: node-sdl
docs: http://bespin.cz/~ondras/html/classv8_1_1ObjectTemplate.html#a944ce96b6b65d571f8d682407b70d484
docs: http://sdl.beuc.net/sdl.wiki/SDL_BlitSurface
docs: http://www.ferzkopp.net/Software/SDL_gfx-2.0/Docs/html/_s_d_l__gfx_blit_func_8c.html#ac51ff40d39f3dd0bd08116e8953960f8
docs: http://osdl.sourceforge.net/main/documentation/rendering/SDL-openGL.html

info: http://www.webkinesia.com/games/sdl-api.php
opengl es2 2d: http://gamedev.stackexchange.com/questions/4309/opengl-es-2-0-setting-up-2d-projection
opengl es: http://doc.trolltech.com/4.4/opengl-hellogl-es.html#porting-opengl-to-opengl-es
opengl 2s vs opengl 1.5: http://doc.trolltech.com/4.4/opengl-hellogl-es.html#porting-opengl-to-opengl-es
*/

#include "prerequisites.h"

#include "radamn_window.h"
#include "radamn_image.h"
#include "radamn_font.h"

#include <iostream>
#include <map>
#include <node.h>
#include <v8.h>

namespace radamn {
    namespace input {
        extern unsigned int mouse_buttons;
    }


    class Creator : node::ObjectWrap {
    public:
        static v8::Persistent<v8::FunctionTemplate> s_ct;
#ifdef _WIN32
        static void NODE_EXTERN Init(v8::Handle<v8::Object> target);
#else
    static void Init(v8::Handle<v8::Object> target);
#endif
        Creator() { }
        ~Creator() { }
        static v8::Handle<v8::Value> New(const v8::Arguments& args) {
            v8::HandleScope scope;
            Creator* pm = new Creator();
            pm->Wrap(args.This());
            return args.This();
        }
    };

    static bool isOpenGL = false;

    static v8::Handle<v8::Value> v8_init(const v8::Arguments& args);
    static v8::Handle<v8::Value> v8_quit(const v8::Arguments& args);

    // high resolution timer
    static v8::Handle<v8::Value> v8_time(const v8::Arguments& args);

    static v8::Handle<v8::Value> v8_getVersion(const v8::Arguments& args);

    static v8::Handle<v8::Value> v8_getVideoModes(const v8::Arguments& args);
    static v8::Handle<v8::Value> v8_createWindow(const v8::Arguments& args);

    static v8::Handle<v8::Value> v8_pollEvent(const v8::Arguments& args);
    static v8::Handle<v8::Value> v8_getJoysticks(const v8::Arguments& args);
}

#endif
