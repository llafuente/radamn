#ifndef RADAMN_LOG_H_
#define RADAMN_LOG_H_

#include <iostream>
#include <fstream>

namespace radamn {
	class loggin {
		protected:
			static loggin *instance;
			std::ofstream log_file;
			loggin();
		public:
		static char __bigcharbuffer[1024];
		
		~loggin() {
			loggin::instance = 0;
			loggin::log_file.close();
		};
		static loggin* singleton();
		void debug() {};
		void verbose() {};
		void error() {};
		
		std::ofstream& get_log() {
			return loggin::log_file;
		};
	};
	
	#define VERBOSE radamn::loggin::singleton()->get_log() << __FILE__ << "@" << __LINE__ << ":" << __FUNCTION__ << " "
	#define VERBOSEC radamn::loggin::singleton()->get_log()
	
	inline char* VERBOSEF(const char *fmt, ...);	
}


#endif

