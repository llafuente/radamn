# RADAMN
## Render asynchronous Damn (good!).

It's a node.js module (right now is pure V8 but I plan to use some async I/O from nodejs someday) that allow you to develop graphical APPs/Grames with OpenGL.

## 0. Installation

Required libraries:
### SDL 1.3
<pre>    hg clone http://hg.libsdl.org/SDL
    cd SDL
    ./autogen.sh
    ./configure --prefix=/usr --bindir=/usr/bin/ --libdir=/usr/lib/
    make; make install
    cd ..</pre>

### SDL_Image (png, jpg and zlib)
<pre>    #JPEG SUPPORT
    wget http://www.ijg.org/files/jpegsrc.v8c.tar.gz
    tar xsfv jpegsrc.v8c.tar.gz
    cd jpeg-8c
    ./configure --prefix=/usr --bindir=/usr/bin/ --libdir=/usr/lib/
    make; make install
    cd ..


    #PNG SUPPORT
    yum install zlib zlib-devel
    #outdated version check http://zlib.net/
    wget http://prdownloads.sourceforge.net/libpng/libpng-1.5.5.tar.gz?download
    tar xsfv libpng-1.5.5.tar.gz
    cd libpng-1.5.5
    ./configure  --prefix=/usr --bindir=/usr/bin/ --libdir=/usr/lib/
    make; make install
    cd ..


    #TIFF SUPPORT ? http://www.remotesensing.org/libtiff/
    # do it yourself if needed and send the problem cmd lines :)

    hg clone http://hg.libsdl.org/SDL_image
    cd SDL_image
    ./autogen.sh
    # vi configure & replace
    # png_lib=`find_lib "libpng.so.[0-9]"`
    # png_lib="libpng15.so.15"
    # some should fix it, sry i cant find the proper 'sed'
    ./configure --prefix=/usr --bindir=/usr/bin/ --libdir=/usr/lib/
    make
    make install
    cd ..</pre>

### SDL_Font (ttf)
<pre>    hg clone http://hg.libsdl.org/SDL_ttf
    cd SDL_ttf
    ./autogen.sh;
    ./configure  --prefix=/usr --bindir=/usr/bin/ --libdir=/usr/lib/
    make; make install
    cd ..</pre>

<pre>    cd radamn
    node-waf configure build</pre>


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

* Compatible events beetween radamn and a browser (almost done: Keyboard, Mouse and Joystick ready)
* Nodes, with z-index sorting functions (Node ready z-index sorting not done)
* Sprites
* Animation (done based on a single image)
* manage quit the APP, destroy everything. No memory is left behind soldier! (event ready but no memory free)

Someday/sometime

* Physic layer (with chipmunk, mostly for collision rays/point query)
* compile V8/node.js on IOS
* Compile V8/node.js on Android
* Search a proper audio library. SDL_mixer is not enough. OpenAl could be good.
* Multiple window suppor (I must deal with some problems like where OPENGL will paint...)
* Multiple process/threads. (really needed ?)
* Port to a browser. This is almost done. Radamn.js should work in a browser with minor modifications.


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