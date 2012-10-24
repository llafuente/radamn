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
      'target_name': 'glew',
      'type': 'static_library',
      "product_dir": "<(module_root_dir)/<(configuration)",
      'defines': [
        'GLEW_STATIC',
      ],
      "libraries": [
        "-l <(module_root_dir)/<(configuration)/glew.lib",
      ],
      'sources': [
        'include/GL/visualinfo.h',
        'include/GL/glewinfo.h',
        'include/GL/glew.h',
        'src/visualinfo.c',
        'src/glewinfo.c',
        'src/glew.c',

      ],
      'include_dirs': [
        './src',
        './include',
      ],
    },
  ],
}
