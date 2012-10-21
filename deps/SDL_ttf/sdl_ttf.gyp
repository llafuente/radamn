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
      'target_name': 'SDL_ttf',
      'type': 'static_library',
      "product_dir": "<(module_root_dir)/<(configuration)",
      'sources': [
        'SDL_ttf.c',
        'glfont.c',
        'showfont.c'
      ],
      'include_dirs': [
        './',
        '../freetype/include/',
        '../SDL2/include/'
      ],
      'defines': [
      ],
      'cflags': [
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          './',  # For ft2build.h
        ],
      },
    },
  ],
}