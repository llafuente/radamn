# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

{
  'variables': {
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
      'dependencies': [
        '../node/deps/zlib/zlib.gyp:zlib'
      ],
      'defines': [
        'PNG_USER_CONFIG',
      ],
      "libraries": [
        '../node/deps/zlib/<(CONFIG)/zlib.lib'
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
        '../node/deps/zlib/',
        './contrib/pngminim/decoder'
      ],
      'direct_dependent_settings': {
        'defines': [
          'CHROME_PNG_WRITE_SUPPORT',
          'PNG_USER_CONFIG',
        ],
      },
      'export_dependent_settings': [
        '../node/deps/zlib/zlib.gyp:zlib',
      ],
      'conditions': [
        ['OS=="android"', {
          'toolsets': ['target', 'host'],
        }],
      ],
    },
  ],
}
