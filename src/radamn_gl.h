#ifndef RADAMN_GL_H_
#define RADAMN_GL_H_

#include "openGL_helper.h"

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
#endif

#include <SDL.h>


namespace radamn {
	/**
	 * basic class that will be the base of the opengl rendersytyem and opengles 1/2
	 */
	class gl {	

	
	
		protected:
		static gl* instance;
		
		gl() { }
		
		public:
		~gl() { }
		
		static gl* singleton();
		
		static gl_operators operator_from_string(char* str);
		
		/// from cairo
		/// build a unit test: http://forums.inside3d.com/viewtopic.php?t=1419
		static void set_operator(gl_operators op);

		static void clear_operator();
		
		
		
		
		
	
	};

}


#endif
