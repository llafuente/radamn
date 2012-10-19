{
  "variables": {
    #Specify the module name here
    "module_name": "radamn",
    #These are required variables to make a proper node module build
    "library": "shared_library",
    "target_name": "radamn",
    "configuration": "Release"
  },
  'target_defaults': {
    'default_configuration': 'Release',
    'configurations': {
      'Debug': {
        'defines': [ 'DEBUG', '_DEBUG' ],
        #'cflags': [ '-g', '-O0' ],
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
        #'cflags!': [ '-O3', '-fstrict-aliasing' ],

        #'msvs_settings': {
        #  'VCCLCompilerTool': {
        #    'Optimization': 3, # /Ox, full optimization
        #    'FavorSizeOrSpeed': 1, # /Ot, favour speed over size
        #    'InlineFunctionExpansion': 2, # /Ob2, inline anything eligible
        #    'WholeProgramOptimization': 'true', # /GL, whole program optimization, needed for LTCG
        #    'OmitFramePointers': 'true',
        #    'EnableFunctionLevelLinking': 'true',
        #    'EnableIntrinsicFunctions': 'true',
        #    'RuntimeTypeInfo': 'false',
        #    'ExceptionHandling': '0',
        #    'AdditionalOptions': [
        #      '/MP', # compile across multiple CPUs
        #    ],
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
        #  },
        #  'VCLibrarianTool': {
        #    'AdditionalOptions': [
        #      '/LTCG', # link time code generation
        #    ],
        #  },
        #  'VCLinkerTool': {
        #    'LinkTimeCodeGeneration': 1, # link-time code generation
        #    'OptimizeReferences': 2, # /OPT:REF
        #    'EnableCOMDATFolding': 2, # /OPT:ICF
        #    'LinkIncremental': 1, # disable incremental linking
        #  },
        #},
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
        "src/gl.cc",
        "src/init.cc",


        "src/prerequisites.h",
        "src/radamn_loggin.h",
        "src/radamn.h",
        "src/c_helper.h",
        "src/radamn_font.h",
        "src/radamn_image.h",
        "src/radamn_window.h",
        "src/v8_helper.h",
        "src/gl.h",

        # node.gyp is added to the project by default.
        "common.gypi",
      ],

      "target_name": "<(module_name)",
      "type": "<(library)",
      "product_name":"<(module_name)",
      "product_extension":"node",
      "product_dir":"build\\<(CONFIG)",
      #remove the default lib prefix on each library
      "product_prefix":"",

      "defines": [
        "ARCH='<(target_arch)'",
        "PLATFORM='<(OS)'",
        "_LARGEFILE_SOURCE",
        "_FILE_OFFSET_BITS=64"
      ],
      "dependencies": [
        './deps/libpng/libpng.gyp:libpng15',
        './deps/SDL2/sdl.gyp:SDL2'
      ],
      'export_dependent_settings': [
        './deps/SDL2/sdl.gyp:SDL2',
        './deps/libpng/libpng.gyp:libpng15'
      ],

      "include_dirs": [
        "<(RADAMN_ROOT)/deps/node/src",
        "<(RADAMN_ROOT)/deps/node/deps/v8/include",
        "<(RADAMN_ROOT)/deps/node/deps/uv/include",
        "<(RADAMN_ROOT)/deps/SDL2/include",
        "<(RADAMN_ROOT)/deps",
        "<(RADAMN_ROOT)/deps/libpng",
        "<(RADAMN_ROOT)/deps/SDL_ttf",
        "$(IncludePath)",
        "<(RADAMN_ROOT)/src/",
      ],

      "conditions": [
        [ "OS=='win'", {
          "defines": [
            "uint=unsigned int",
            # we need to use node"s preferred "win32" rather than gyp"s preferred "win"
            "PLATFORM='win32'",
          ],
          "libraries": [
             "-l opengl32.lib" ,
             "-l glu32.lib",
             "-l <(RADAMN_ROOT)/deps/node/<(CONFIG)/node.lib" ,
             "-l <(RADAMN_ROOT)/<(CONFIG)/SDL2.lib",
             "-l <(RADAMN_ROOT)/<(CONFIG)/lib/libpng15.lib",
             "-l <(RADAMN_ROOT)/deps/node/<(CONFIG)/lib/zlib.lib" ,
             "-l <(RADAMN_ROOT)/deps/SDL_ttf/windows_libs/SDL_ttf.lib",
          ],
          "msvs_configuration_attributes": {
              "OutputDirectory": "build\\<(CONFIG)",
              "IntermediateDirectory": "build\\obj",
          },
          "msvs-settings": {
            "VCLinkerTool": {
                "SubSystem": 3, # /subsystem:dll
              },
           },
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

