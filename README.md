# RADAMN (Render asynchronous Damn, good!)
2D Rendering (game) engine. Cross-platform, currently: linux & windows & browsers (firefox, chrome, IE soon).
Based on some HTML concepts like Canvas or Input management(DomEvents) with toon of sugar on top!.
Powered by nodejs, v8 and Mootools. Rendering: OpenGL (2+) current, OpenglES(1+) in plan to support mobile.

## 0. Installation


Compilation (wikis)

[linux](/llafuente/radamn/wiki/Compile-in-Linux)
[windows](/llafuente/radamn/wiki/Compile-in-Windows)
[Android Experimental (just compile)](/llafuente/radamn/wiki/Compile-in-Android)


After this, some packages are needed

``` bash
npm install node-class
npm install express #needed to run the webexamples
npm install sax #needed for TMX files
```

### my test enviroment

#### linux

``` bash
# gcc --version
gcc (GCC) 4.1.2 20080704 (Red Hat 4.1.2-51)
Copyright (C) 2006 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

# node --version
v0.8.12

```

#### windows xp/7

## 1. API

The proyect is not mature enough to start documenting.

## 2. Todo list

Priority

* Port to SDL 2, OpenGL 3.2 (this make master unstable right now!!!)

* Sprites (batch rendering) canvas extension to render multiple images into rectangles in one opengl call
* drag&drop @Radamn.Node
* better mouse events
* Radamn should be the center of all event handling, keyboard, joystick, mouse and window events.

Someday/sometime

* platforms: IOS, Android, MacOS (should work)
* Search a proper audio library. SDL_mixer is not enough. OpenAl could be good IOS/Android support ?

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

* C/C++ [CRadamn / CLand]: SDL, OpenGL, Font, *Audio*, nodejs
* Javascript Framework [JRadamn]: Provide a proper API on top of CRadamn. This will deal with browser/nodejs compatibility.
* Javascript User land, where you will write your code, platform/browser independent all in Javascript!

Radamn will provide a 2D game engine/rendering layer OPENGL based (currently OPENGL, OPENGLES-2 planned)

Plaforms:

* Linux (fully supported)
* MacOS (not tested)
* Windows (fully supported, in some systems there are input problems, keyboard only)
* Browser (fully compatible Firefox, Chrome, need to test ie9/10). I will focus on this after frozen the API.

The full API will be public soon.


## 4. Collaboration

Collaboration is always wellcome! share your thoughs!

Pull a request!

Wellcome help today.

* Audio
* IOS
* Android