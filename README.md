# RADAMN (Render asynchronous Damn, good!)
2D Rendering (game) engine. Cross-platform, currently: linux & windows & browsers (firefox, chrome, IE soon).
Based on some HTML concepts like Canvas or Input management(DomEvents) with toon of sugar on top!. Powered by nodejs, v8 and Mootools. Rendering: OpenGL (2+) current, OpenglES(1+) in plan.

## 0. Installation

See the wiki!

[linux](/llafuente/radamn/wiki/Compile-in-Linux)
[windows](/llafuente/radamn/wiki/Compile-in-Windows)
[Android Experimental (just compile)](/llafuente/radamn/wiki/Compile-in-Android)


### my test enviroment

#### linux

<pre># gcc --version
gcc (GCC) 4.1.2 20080704 (Red Hat 4.1.2-51)
Copyright (C) 2006 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

# node --version
v0.6.12
# node-waf --version
waf 1.5.16 (7610:7647M)</pre>

#### windows xp/7

## 1. API

The proyect is not mature enough to start documenting.

## 2. Todo list

Priority

* minor glyh in some cases using closePath, can be avoided not using it...
* fillText should be multiline
* Sprites (batch rendering) canvas extension to render multiple images into rectangles in one opengl call
* arcTo (buggy)
* memoryleak.log (like the old Ogre3d has in old versions?) useful ?
* drag&drop ¿using mootools?
* better mouse events
* Radamn should be the center of all event handling, keyboard, joystick, mouse and window events.

Someday/sometime

* platforms: IOS, Android, MacOS (should work)
* Search a proper audio library. SDL_mixer is not enough. OpenAl could be good IOS/Android support ?
* Layering, could be done with Radamn.Nodes/Radamn.Window but maybe a proper Layer support help in browsers performance

Demo/Examples

* Line rendering
* Font rendering
* Input management
* Physics (some) using BOX2DWeb
* Tween, animation path will be soon included
* TMX isometric and orthogonal, orthogonal+scroll, orthogonal+scroll+physics and TMX objects
* Math unit test, colissions (a bit buggy)


## 3. About

The proyect has three layers, two for me, one for you :)

* C/C++: SDL, OpenGL, Audio, nodejs
* Javascript Framework (Radamn). Provide a proper API on top of the basic C++ land API. This will deal with browser/nodejs(client) compatibility.
* User (Javascript) land, where you will write your code, platform independent all in Javascript!

Radam will provide a 2D game engine/rendering layer OPENGL based (currently OPENGL, OPENGLES-1/OPENGLES-2 maybe someday)

Plaforms:

* Linux (fully supported today)
* MacOS (not tested)
* Windows (fully supported today, in some system problems with the input management, keyboard only)
* Browser, (fully compatible Firefox, Chrome, need to test ie9/10). I will focus on this after frozen the API. The rendering part will be a clone of HTML5 Canvas Tag

Also take in mind the proyect will be using Mootools (1.4.1 core).
* This will provide a nice API (extensible) and also inteligensse (if you use a nice IDE like Zend Studio).
* For now I dont plan to stop using it... even the performance drop

The full API will be public soon.


## 4. Collaboration

Collaboration is always wellcome! share your thoughs!

Pull a request!

Wellcome help today.

* Audio
* IOS
* Android