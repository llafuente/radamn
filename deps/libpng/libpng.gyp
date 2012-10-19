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
      "product_dir": "../../<(configuration)",
      'defines': [
        'PNG_USER_CONFIG',
      ],
      "libraries": [
        '<(node_root_dir)/deps/zlib/<(configuration)/zlib.lib'
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
            #'defines': ['OS_LINUX'],
          },
        },],
        ['OS=="win"', {
          'target_defaults': {
            #'defines': ['OS_WIN', 'WIN32', 'NOMINMAX', 'UNICODE', '_UNICODE', 'WIN32_LEAN_AND_MEAN', '_WIN32_WINNT=0x0501'],
            'msvs_settings': {
              'VCLinkerTool': {'GenerateDebugInformation': 'true',},
              'VCCLCompilerTool': {'DebugInformationFormat': '3',},
            },
          },
        },],
      ],
    },
  ],
}
