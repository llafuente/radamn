#ifndef RADAMN_FONT_H_
#define RADAMN_FONT_H_

#include <v8.h>
#include "prerequisites.h"
#include <SDL_ttf.h>
#include "radamn_loggin.h"

namespace radamn {

	// UTF8 support
	class font {
	protected:
		TTF_Font *mfont;
	public:
		font() : mfont(0) {}
		~font() {
			if(this->mfont)
				TTF_CloseFont(this->mfont);
		}
		// TTF only
		bool load_from_file(char* filename, int ptsize);
		v8::Handle<v8::Value> glyph_size(char* glyph);
		//char* because is UTF-8
		bool has_glyph(char* glyph);
		// TODO multi-line support
		SDL_Rect get_text_size(char* text);
		// TODO multi-line support
		image* get_text_image(const char* text, SDL_Color);
		image* get_text_image(uint16_t* text, SDL_Color);

		static v8::Handle<v8::Value> wrap(font* img);
		static font* unwrap(const v8::Arguments& args, int position);
		static font* unwrap(v8::Local<v8::Value> handle);
	};
	
	static v8::Persistent<v8::ObjectTemplate> font_template_;
	
	font* font_new(char* filename, int ptsize);
	
	void font_free(font* fnt);

    v8::Handle<v8::Value> v8_font_load(const v8::Arguments& args);
    v8::Handle<v8::Value> v8_font_text_to_image(const v8::Arguments& args);
    v8::Handle<v8::Value> v8_font_destroy(const v8::Arguments& args);
	v8::Handle<v8::Value> v8_font_text_size(const v8::Arguments& args);
}

#endif // RADAMN_FONT_H_
