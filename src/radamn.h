#ifndef RADAMN_H_
#define RADAMN_H_

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

#include <iostream>
#include <map>

namespace Radamn {
    v8::HandleScope* globalScope;

    static SDL_Surface* mCurrentScreen = 0;
    static int mScreenCount = 0;

    static bool isOpenGL = false;

    static int mImageCount = 0;
    static int mImageMemory = 0;

    static v8::Handle<v8::Value> init(const v8::Arguments& args);
    static v8::Handle<v8::Value> quit(const v8::Arguments& args);

    static v8::Handle<v8::Value> getVersion(const v8::Arguments& args);

    static v8::Handle<v8::Value> getVideoModes(const v8::Arguments& args);
    static v8::Handle<v8::Value> createWindow(const v8::Arguments& args);

    static v8::Handle<v8::Value> getWindow(const v8::Arguments& args);

    static v8::Handle<v8::Value> pollEvent(const v8::Arguments& args);
    static v8::Handle<v8::Value> getJoysticks(const v8::Arguments& args);
}

#include "radamn_window.cc"
#include "radamn_image.cc"
#include "radamn_font.cc"

#endif
