# RADAMN (Render asynchronous Damn, good!)
2D Rendering (game) engine. Cross-platform, currently: linux & windows. Based on some HTML concepts like Canvas or Input management(DomEvents) with toon of sugar on top!. Powered by node.js, v8 and Mootools. Rendering: OpenGL (+2) current, OpenglES(+2) in plan.

## 0. Installation

See the wiki!

### my test enviroment

#### linux

<pre># gcc --version
gcc (GCC) 4.1.2 20080704 (Red Hat 4.1.2-51)
Copyright (C) 2006 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

# node --version
v0.5.10
# node-waf --version
waf 1.5.16 (7610:7647M)</pre>

#### windows xp/7

## 1. API

The proyect is not mature enough t start documenting.

## 2. Todo list

Priority

* Sprites (batch rendering) canvas extension to render multiple images into rectangles in one opengl call
* arcTo
* memoryleak.log (like the old Ogre3d has 1.2?)
* drag&drop ¿using mootools?

Someday/sometime

* platforms: IOS, Android, MACOS, Browser
* Search a proper audio library. SDL_mixer is not enough. OpenAl could be good IOS/Android support ?
* Multiple window support (I must deal with some problems like where OPENGL will paint...)

Demo/Examples

* line rendering
* font rendering
* input management
* physics (some) usgin BOX2DWeb
* Tween, animation path will be soon included
* TMX isometric and orthogonal, orthogonal+scroll, orthogonal+scroll+physics and TMX objects
* math unit test, colissions (a bit buggy)


## 3. About

The proyect has three layers, two for me, one for you :)

* C land. SDL, OpenGL, Audio
* JS land. Provide a proper API on top of the basic C land API. This way we can move to a browser and like another libs.
* User (JS) land, where you will write your code, platform independent.

Radam will provide a 2D game engine/rendering layer OPENGL based (OPENGLES/ES2 maybe)

Plaforms:

* Linux (fully supported today)
* MacOS (not tested)
* Windows (fully supported today, in some system problems with the input management, keyboard only)
* Browser, for now should be almost compatible. I will focus on this after frozen the API. The rendering part will be a clone of HTML5 Canvas Tag

Also take in mind the proyect will be using Mootools (1.4.1 core). This will provide a nice API (extensible) and also inteligensse (if you use a nice IDE).
For now I dont plan to stop using it... even the performance drop

The full API will be public soon, my plan is to realease a useable version February/March 2012.


## 4. Collaboration

Collaboration is always wellcome! share your thoughs!

Pull a request!

Wellcome help today.

* Audio
* IOS
* Android