## Radamn dependencies

Right now only node is needed.

git clone -b v0.8.12-release git://github.com/joyent/node.git

The rest is included in the GIT because the proyects need small modifications or will be replaced

* libpng use zlib in nodejs
* SDL_ttf is used but will be replaced by FreeType because portability issues
* SDL_image, already removed, now we only accept PNGs
* SDL, I'm using SDL 2 to maximize cross-platform
* GLUT/GL is removed, not needed with SDL 2 anymore and proper platforms SDKs
* GLEW, could be added soon to support full opengl 3.2 that is my target

I left this for my own reference to update deps

## NODEJS
<pre>    any os: git clone git://github.com/joyent/node.git node</pre>

## SDL
<pre>    any os: hg clone http://hg.libsdl.org/SDL SDL</pre>

##
<pre>    any os: hg clone http://hg.libsdl.org/SDL_image</pre>

## SDL_ttf
<pre>    windows: download http://www.libsdl.org/projects/SDL_ttf/release/SDL_ttf-devel-2.0.10-VC.zip and decrompress @deps/SDL_ttf
!windows: hg clone http://hg.libsdl.org/SDL_ttf</pre>
