#include "radamn_loggin.h"

#include <stdio.h>
#include <stdarg.h>

namespace radamn {
	loggin* loggin::instance = 0;

	loggin::loggin() {
		// init verbose log
		radamn::loggin::log_file.open("radamn.log");
	};

	loggin* loggin::singleton() {
		if(!loggin::instance) {
			loggin::instance = new loggin();
		}
		return loggin::instance;
	};

	char* VERBOSEF(const char *fmt, ...) {
		va_list ap;
		int r;
		#ifdef __OPTIMIZE__
		  if (inside_main)
			abort();
		#endif
		va_start (ap, fmt);
		//r = vprintf (string, ap);
		r = vsprintf(radamn::loggin::__bigcharbuffer, fmt, ap);
		va_end (ap);
		return radamn::loggin::__bigcharbuffer;
	}
	
}