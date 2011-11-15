#!/usr/bin/env python

from os import popen

srcdir = '.'
blddir = 'build'
VERSION = '0.0.1'

def set_options(opt):
  opt.tool_options('compiler_cxx')

def configure(conf):
  conf.check_tool('compiler_cxx')
  conf.check_tool('node_addon')

  sdl_config = conf.find_program('sdl-config', var='SDL_CONFIG', mandatory=True)
  sdl_libs = popen("%s --libs" % sdl_config).readline().strip()
  sdl_cflags = popen("%s --cflags" % sdl_config).readline().strip()

  sdl_addpaths = []
  sdl_addlibs = []
  for item in sdl_libs.split(' '):
    # -L items are lib paths, -l are additional libraries
    if item.find("-L") == 0:
      sdl_addpaths.append(item[2:])
    if item.find("-l") == 0:
      sdl_addlibs.append(item[2:])

  conf.env.append_value("LIBPATH_SDL", sdl_addpaths)
  conf.env.append_value("LIB_SDL", sdl_addlibs)

  conf.env.append_value("CPPFLAGS_SDL", sdl_cflags.split(' '))

def build(bld):
  obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
  obj.target = "radamn"
  obj.cxxflags = ["-pthread", "-Wall"]
  obj.linkflags = ["-lSDL_ttf", "-lSDL_image", "-lSDL_gfx", "-lGL", "-lGLU"]
  obj.includes = ["/usr/include/SDL", "./src"]
#  obj.source = ["src/radamn.cc", "src/radamn_image.cc", "src/radamn_window.cc", "src/radamn_font.cc", "src/SDL_helper.cc", "src/v8_helper.cc"]
#  obj.source = [ "src/radamn_font.cc"]
#  obj.source = [ "src/radamn_window.cc"]
#  obj.source = ["src/SDL_helper.cc", "src/v8_helper.cc","src/radamn_image.cc", "src/radamn_window.cc", "src/radamn_font.cc", "src/radamn.cc"]
  obj.source = ["src/radamn.cc"]
  obj.uselib = "SDL"
