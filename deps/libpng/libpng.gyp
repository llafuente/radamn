# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

{
  'variables': {
    "configuration": "Release"
  },
  "target_defaults": {
      "configurations": {
          "Debug": {
          },
          "Release": {
          }
      }
  },
  'targets': [
    {
      'target_name': 'libpng15',
      'type': 'static_library',
      "product_dir": "<(module_root_dir)/<(configuration)",
      'defines': [
        'PNG_USER_CONFIG',
      ],
      "libraries": [
        "-l <(module_root_dir)/deps/zlib.lib",
      ],
      'sources': [
        'png.c',
        'png.h',
        'pngconf.h',
        'pngerror.c',
        #'pnggccrd.c',
        'pngget.c',
        'pngmem.c',
        'pngpread.c',
        'pngread.c',
        'pngrio.c',
        'pngrtran.c',
        'pngrutil.c',
        'pngset.c',
        'pngtrans.c',
        './contrib/pngminim/decoder/pngusr.h',
        #'pngvcrd.c',
        'pngwio.c',
        'pngwrite.c',
        'pngwtran.c',
        'pngwutil.c',
      ],
      'include_dirs': [
        './',
        '<(node_root_dir)/deps/zlib/',
        './contrib/pngminim/decoder'
      ],
      'conditions': [
        ['OS=="android"', {
          'toolsets': ['target', 'host'],
        }],
        ['OS=="linux"', {
          'target_defaults': {
            'cflags': ['-fPIC', '-g', '-O3',],
            'defines': ['OS_LINUX'],
          },
        },],
        ['OS=="win"', {
          'target_defaults': {
            'defines': ['OS_WIN', 'NOMINMAX', 'UNICODE', '_UNICODE'],
          },
        }]
      ],
    },
  ],
}
