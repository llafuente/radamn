{
  'variables': {
    #Specify the module name here
    'module_name': 'radamn',
	#These are required variables to make a proper node module build
	'library': 'shared_library',
	'target_arch': 'ia32', 
  },
  'targets': [
    {
      'sources': [
		"src/prerequisites.h",
		"src/prerequisites.cc",
		
		"src/radamn.cc",
		"src/radamn.h",

		"src/c_helper.cc",
		"src/c_helper.h",
        
		"src/openGL_helper.cc",
		"src/openGL_helper.h",
		
		"src/radamn_font.cc",
		"src/radamn_font.h",
		"src/radamn_image.cc",
		"src/radamn_image.h",
		"src/radamn_window.cc",
		"src/radamn_window.h",
		"src/SDL_helper.cc",
		"src/SDL_helper.h",
		"src/v8_helper.cc",
		"src/v8_helper.h",
      ],

	  'target_name': '<(module_name)',
      'type': '<(library)',
	  'product_name':'<(module_name)',
	  'product_extension':'node',
	  'product_dir':'build\\Release',
	  #remove the default lib prefix on each library
      'product_prefix':'',
	  
      'defines': [
        'ARCH="<(target_arch)"',
        'PLATFORM="<(OS)"',
		'_LARGEFILE_SOURCE',
		'_FILE_OFFSET_BITS=64'
      ],
	  
      'include_dirs': [
	    '<(RADAMN_ROOT)/deps/node/src',
		'<(RADAMN_ROOT)/deps/node/deps/v8/include',
		'<(RADAMN_ROOT)/deps/node/deps/uv/include',
		'<(RADAMN_ROOT)/deps/SDL/include',
		'<(RADAMN_ROOT)/deps',
		'<(RADAMN_ROOT)/deps/GL',
		'<(RADAMN_ROOT)/deps/libpng',
		'<(RADAMN_ROOT)/deps/SDL_ttf/include',
		'<(RADAMN_ROOT)/deps/SDL_image',
		'$(IncludePath)',
		'<(RADAMN_ROOT)/src/',
      ],

      'conditions': [
        [ 'OS=="win"', {
          'defines': [
            'uint=unsigned int',
            # we need to use node's preferred "win32" rather than gyp's preferred "win"
            'PLATFORM="win32"',
          ],
          'libraries': [ 
			 '-l opengl32.lib' ,
			 '-l glu32.lib',
			 # static linking SDL ? winmm.lib, Version.lib, Imm32.lib
			 #'-l winmm.lib',
			 #'-l Version.lib',
			 #'-l Imm32.lib',
			 '-l <(RADAMN_ROOT)/deps/GL/glut32.lib',
			 '-l <(NODE_ROOT)/<(node_lib_folder)/node.lib' ,
			 '-l <(RADAMN_ROOT)/deps/SDL/VisualC/SDL/Win32/Release/SDL.lib',
			 '-l <(RADAMN_ROOT)/deps/libpng/projects/vstudio/Debug/libpng15.lib',
			 '-l <(RADAMN_ROOT)/deps/SDL_ttf/lib/SDL_ttf.lib',			 
		  ],
		  'msvs_configuration_attributes': {
              'OutputDirectory': 'build\\Release',
			  'IntermediateDirectory': 'build\\obj',
		  },
		  'msvs-settings': {
		    'VCLinkerTool': {
				'SubSystem': 3, # /subsystem:dll
		      },
		   },
        }],
        [ 'OS=="mac"', {
		   #MAC Users don't forget to comment out all line in node/tools/gyp/pylib/gyp/generator/make.py that contain append('-arch i386') (2 instances)
           'libraries': [ #this is a hack to specify this linker option in make              
              '-undefined dynamic_lookup',
		   ],
        }],
        [ 'OS=="linux"', {
          
        }]
      ],
    },
  ] # end targets
}

