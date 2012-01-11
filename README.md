# RADAMN (Render asynchronous Damn, good!)
2D Rendering (game) engine. Cross-platform, currently: linux & windows. Based on some HTML concepts like Canvas or Input management(DomEvents) with toon of sugar on top!. Powered by node.js, v8 and Mootools. Rendering: OpenGL (+2) current, OpenglES(+2) in plan.

## 0. Installation

Required libraries:



### my test enviroment

<pre># gcc --version
gcc (GCC) 4.1.2 20080704 (Red Hat 4.1.2-51)
Copyright (C) 2006 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

# node --version
v0.5.10
# node-waf --version
waf 1.5.16 (7610:7647M)</pre>

## 1. API

The proyect is not mature enough t start documenting.

## 2. Todo list

Priority

* Sprites
* memoryleak.log (like the old Ogre3d has 1.2?)
* drag&drop ¿using mootools?

Done

* canvas blending modes (a bit buggy)
* Paralax mapping (http://en.wikipedia.org/wiki/Parallax_scrolling) basic support.
* Animation (done based on a single image)
* Compatible events beetween radamn and a browser (almost done: Keyboard, Mouse and Joystick ready)
* Nodes, with z-index sorting functions (Node ready z-index sorting not done)
* manage quit the APP, destroy everything. No memory is left behind soldier! (event ready but no memory free)
* Physic layer BOX2DWEB outside Radamn for now...
* platforms: Linux, Windows

Someday/sometime

* platforms: IOS, Android, MACOS, Browser
* Search a proper audio library. SDL_mixer is not enough. OpenAl could be good IOS/Android support ?
* Multiple window support (I must deal with some problems like where OPENGL will paint...)


## 3. About

This proyect could be considered as an evolution of another github proyect (https://github.com/creationix/node-sdl), but with a proper API, no just a SDL Port.

The proyect has three layers.

* C land. SDL, OpenGL, Audio
* JS land. Provide a proper API on top of the basic C land API. This way we can move to a browser and like another libs.
* User (JS) land, where you will write your code, platform independent.

Radam will provide a 2D game engine OPENGL based (OPENGLES/ES2 and software if possible). I'm studing android/ios posibilities.
Software renderer has some problems that i don'r really want to deal, I prefer OPENGL, so maybe will be deprecated soon.

Plaforms:

* Linux (fully supported today)
* MacOS (not tested)
* Windows (when nodejs has a proper way to deal with modules)
* Browser, for now should be almost compatible. I will focus on this after frozen the API. The rendering part will be a clone of HTML5 Canvas Tag

Also take in mind the proyect will be using Mootools (1.4.1 core). This will provide a nice API (extensible) and also inteligensse (if you use a nice IDE).

The full API will be public soon, my plan is to realease a useable version 1 January 2012.


## 4. Collaboration

Collaboration is always wellcome! share your thoughs!

Pull a request!

Wellcome help today.

* Audio
* IOS
* Android