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
      'target_name': 'ft2',
      'type': 'static_library',
      "product_dir": "../../<(configuration)",
      'sources': [
        'include/ft2build.h',
        'include/freetype/config/ftconfig.h',
        'include/freetype/config/ftheader.h',
        'include/freetype/config/ftmodule.h',
        'include/freetype/config/ftoption.h',
        'include/freetype/config/ftstdlib.h',

        'src/base/ftbbox.c',
        'src/base/ftbitmap.c',
        'src/base/ftglyph.c',
        'src/base/ftlcdfil.c',
        'src/base/ftstroke.c',
        'src/base/ftxf86.c',
        'src/base/ftbase.c',
        'src/base/ftsystem.c',
        'src/base/ftinit.c',
        'src/base/ftgasp.c',
        'src/base/ftfstype.c',
        'src/raster/raster.c',
        'src/sfnt/sfnt.c',
        'src/smooth/smooth.c',
        'src/autofit/autofit.c',
        'src/truetype/truetype.c',
        'src/cff/cff.c',
        'src/psnames/psnames.c',
        'src/pshinter/pshinter.c',

        # added for linker
        'src/lzw/ftlzw.c',
        'src/gzip/ftgzip.c',
        'src/cid/type1cid.c',
        'src/bdf/bdf.c',
        'src/psaux/psaux.c',
        'src/pcf/pcf.c',
        'src/pfr/pfr.c',
        'src/type1/type1.c',
        'src/type42/type42.c',
        'src/winfonts/winfnt.c',
      ],
      'include_dirs': [
        './builds',
        './include'
      ],
      'defines': [
        "FT2_BUILD_LIBRARY",
        "DARWIN_NO_CARBON"
      ],
      'cflags': [
        '-W',
        '-Wall',
        '-fPIC',
        '-DPIC',
      ],
      'direct_dependent_settings': {
        'include_dirs': [
          './include',  # For ft2build.h
        ],
      },
    },
  ],
}