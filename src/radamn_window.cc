#include "radamn_window.h"

#include <SDL_stdinc.h>

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setCaption(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!(args.Length() == 2 && args[0]->IsString() && args[1]->IsString())) {
    return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected WM::SetCaption(String, String)")));
  }

  v8::String::Utf8Value title(args[0]);
  v8::String::Utf8Value icon(args[0]);

  SDL_WM_SetCaption(*title, *icon);

  return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::clear(const v8::Arguments& args) {
    v8::HandleScope scope;
#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    SDL_Surface* screen = Radamn::mCurrentScreen;
    SDL_Rect* srcrect = getFullRectSurface(screen);
    SDL_FillRect(screen, srcrect, Radamn::Window::mBackgroundColor);

#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL || RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    //Radamn::Window::mBackgroundColor
    //glClearColor(1.0f, 1.0f, 1.0f, 0.0f);
#endif

  return v8::Undefined();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setIcon(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (!(args.Length() == 1 && args[0]->IsString())) {
    return ThrowException(v8::Exception::TypeError(v8::String::New("Invalid arguments: Expected CRadamn.SetIcon(<String image path .bmp>)")));
  }
/* alpha ?
Uint32          colorkey;
SDL_Surface     *image;
image = SDL_LoadBMP("icon.bmp");
colorkey = SDL_MapRGB(image->format, 255, 0, 255);
SDL_SetColorKey(image, SDL_SRCCOLORKEY, colorkey);
SDL_WM_SetIcon(image,NULL);
*/
v8::String::Utf8Value icon_path(args[0]);

  SDL_WM_SetIcon(SDL_LoadBMP( *icon_path ), NULL);

  return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::flip(const v8::Arguments& args) {
  v8::HandleScope scope;

#if RADAMN_RENDERER == RADAMN_RENDERER_SOFTWARE
    SDL_Flip( Radamn::mCurrentScreen );
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGL || RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
    SDL_GL_SwapBuffers();
#endif


  return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::setBackgroundColor(const v8::Arguments& args) {
    v8::HandleScope scope;

    V8_ARG_TO_UNIT32(0, Radamn::Window::mBackgroundColor);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::translate(const v8::Arguments& args) {
    v8::HandleScope scope;

    V8_ARG_TO_NEWFLOAT(0, x)
    V8_ARG_TO_NEWFLOAT(1, y)
    V8_ARG_TO_NEWFLOAT(2, z)

    glTranslatef(x, y, z);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::rotate(const v8::Arguments& args) {
    V8_ARG_TO_NEWFLOAT(0, angle);

    glRotatef(angle, 0.0f, 0.0f, 1.0f);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::scale(const v8::Arguments& args) {
    V8_ARG_TO_NEWFLOAT(0, x);
    V8_ARG_TO_NEWFLOAT(1, y);

    glScalef(x, y, 1.0f);

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::save(const v8::Arguments& args) {
    glPopMatrix();

    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::restore(const v8::Arguments& args) {
    glPushMatrix();

    return v8::True();
}

