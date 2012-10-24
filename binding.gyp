{
  "variables": {
    "target_name": "cradamn",
    "configuration": "Release"
  },
  'target_defaults': {
    'default_configuration': 'Release',
    'configurations': {
      'Debug': {
        'defines': [ 'DEBUG', '_DEBUG' ],
        'conditions': [
          ['target_arch=="x64"', {
            'msvs_configuration_platform': 'x64',
          }]
        ]
      },
      'Release': {
        'conditions': [
          ['target_arch=="x64"', {
            'msvs_configuration_platform': 'x64',
          }]
        ],
        'msvs_settings': {
            'AdditionalOptions': [
              '/MP', # compile across multiple CPUs
            ],
          'VCLibrarianTool': {
            'AdditionalOptions': [
              '/LTCG', # link time code generation
            ],
          }
        }
      }
    },
  },
  "targets": [
    {
      "sources": [
        "src/prerequisites.cc",
        "src/radamn_loggin.cc",
        "src/radamn.cc",
        "src/c_helper.cc",
        "src/radamn_font.cc",
        "src/radamn_image.cc",
        "src/radamn_window.cc",
        "src/v8_helper.cc",
        "src/gl.cc"

        #"include/prerequisites.h",
        #"include/radamn_loggin.h",
        #"include/radamn.h",
        #"include/c_helper.h",
        #"include/radamn_font.h",
        #"include/radamn_image.h",
        #"include/radamn_window.h",
        #"include/v8_helper.h",
        #"include/gl.h",
      ],

      "target_name": "<(target_name)",
      "type": "shared_library",
      "product_name":"<(target_name)",
      "product_extension":"node",
      "product_dir": "<(module_root_dir)/lib/",
      #remove the default lib prefix on each library
      "product_prefix":"",

      "defines": [
        "ARCH='<(target_arch)'",
        "PLATFORM='<(OS)'",
        "_LARGEFILE_SOURCE",
        "_FILE_OFFSET_BITS=64"
      ],
      "dependencies": [
        './deps/zlib/zlib.gyp:zlib',
        './deps/libpng/libpng.gyp:libpng15',
        './deps/SDL2/sdl.gyp:SDL2',
        './deps/freetype/freetype.gyp:ft2',
        './deps/SDL_ttf/sdl_ttf.gyp:SDL_ttf'
      ],
      'export_dependent_settings': [
        './deps/zlib/zlib.gyp:zlib',
        './deps/libpng/libpng.gyp:libpng15',
        './deps/SDL2/sdl.gyp:SDL2',
        './deps/freetype/freetype.gyp:ft2',
        './deps/SDL_ttf/sdl_ttf.gyp:SDL_ttf'
      ],

      "include_dirs": [
        "<(module_root_dir)/deps/node/src",
        "<(module_root_dir)/deps/node/deps/v8/include",
        "<(module_root_dir)/deps/node/deps/uv/include",
        "<(module_root_dir)/deps/SDL2/include",
        #"<(module_root_dir)/deps/glew/src",
        #"<(module_root_dir)/deps/glew/include",
        "<(module_root_dir)/deps/libpng",
        "<(module_root_dir)/deps/SDL_ttf",
        "<(module_root_dir)/src",
        "<(module_root_dir)/include",
        "$(IncludePath)"
      ],

      "conditions": [
        [ "OS=='win'", {
          "defines": [
            "uint=unsigned int",
            # we need to use node"s preferred "win32" rather than gyp"s preferred "win"
            "PLATFORM='win32'",
            "_WINDOWS",
            "HAVE_LIBC",
            "M_PI=3.14159265358979323846264338327950288"
          ],
          "libraries": [
             "-l opengl32.lib" ,
          ],
          #"dependencies": [
          #  './deps/glew/glew.gyp:glew'
          #],
          #'export_dependent_settings': [
          #  './deps/glew/glew.gyp:glew'
          #],
        }],
        [ "OS=='mac'", {
           #MAC Users don"t forget to comment out all line in node/tools/gyp/pylib/gyp/generator/make.py that contain append("-arch i386") (2 instances)
           "libraries": [ #this is a hack to specify this linker option in make
              "-undefined dynamic_lookup",
           ],
        }],
        [ "OS=='linux'", {

        }]
      ],
    },
  ] # end targets
}

