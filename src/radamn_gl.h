#ifndef RADAMN_GL_H_
#define RADAMN_GL_H_

#include "openGL_helper.h"

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif

#include <SDL.h>
#include "prerequisites.h"


namespace radamn {
	/**
	 * basic class that will be the base of the opengl rendersytyem and opengles 1/2
	 */
	class gl {
		public :
		gl_color_t background;

	
	
		protected:
		static gl* instance;
		
		gl() {
			background.r = 0;
			background.g = 0;
			background.b = 0;
			background.a = 1;
		}
		
		public:
		~gl() { }
		
		static gl* singleton();
		
		static gl_operators operator_from_string(char* str);
		
		/// from cairo
		/// build a unit test: http://forums.inside3d.com/viewtopic.php?t=1419
		static void set_operator(gl_operators op);

		static void clear_operator();
		
		
		static void clear();
	};
	

	// v8 interfaces
	v8::Handle<v8::Value> v8_gl_set_background_color(const v8::Arguments& args);

	v8::Handle<v8::Value> v8_gl_clear(const v8::Arguments& args);
}


#endif
