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
/*
Example 1:

   command                 result

glLoadMatrixf(A)       stack = [A]
glPushMatrix()         stack = [A, A]
glLoadMatrixf(B)       stack = [B, A]
glPopMatrix()          stack = [A]


Example 2:

   command                 result

glLoadMatrixf(A)       stack = [A]
glPushMatrix()         stack = [A, A]
glMultMatrixf(B)       stack = [AB, A]
glPopMatrix()          stack = [A]
*/
static v8::Handle<v8::Value> Radamn::Window::save(const v8::Arguments& args) {
    std::cout << "save" << std::endl;
    glPushMatrix();
    std::cout << "saved" << std::endl;
    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::restore(const v8::Arguments& args) {
    std::cout << "restore" << std::endl;
    glPopMatrix();
    std::cout << "restored" << std::endl;
    return v8::True();
}

//
// ----------------------------------------------------------------------------------------------------
//

static v8::Handle<v8::Value> Radamn::Window::line(const v8::Arguments& args) {

    V8_ARG_TO_NEWFLOAT(0, x);
    V8_ARG_TO_NEWFLOAT(1, y);
    V8_ARG_TO_NEWFLOAT(2, width);
    V8_ARG_TO_SDL_NEWCOLOR(3, color);

    std::cout << "line" << x << "," << y <<
        " w:" << width <<
        "color rgb(" << (int)color.r << "," << (int)color.g << "," << (int)color.b << ")"
        << std::endl;

    //glDisable(GL_LIGHTING);
    //glEnable (GL_LINE_SMOOTH);

    glLineWidth (width);

    glBegin (GL_LINES);
      glColor3f (color.r == 0 ? 0 : color.r/255, color.g == 0 ? 0 : color.g /255, color.b == 0 ? 0 : color.b/255);
      glVertex3f (0, 0, 0);
      glVertex3f (x, y, 0);
    glEnd ();

    return v8::True();

    // pattern
    // glEnable (GL_LINE_STIPPLE);
    // glPushAttrib (GL_LINE_BIT);
    // glLineStipple (3, 0xAAAA);
    // glPopAttrib ();

// gradient
/*
glBegin(GL_QUADS);
//red color
glColor3f(1.0,0.0,0.0);
glVertex2f(-1.0,-1.0);
glVertex2f(1.0,-1.0);
//blue color
glColor3f(0.0,0.0,1.0);
glVertex2f(1.0, 1.0);
glVertex2f(-1.0, 1.0);
glEnd();

*/

}

/* in 1st row, 3 lines, each with a different stipple
glEnable (GL_LINE_STIPPLE);
glLineStipple (1, 0x0101); /* dotted
drawOneLine (50.0, 125.0, 150.0, 125.0);
glLineStipple (1, 0x00FF); /* dashed
drawOneLine (150.0, 125.0, 250.0, 125.0);
glLineStipple (1, 0x1C47); /* dash/dot/dash
drawOneLine (250.0, 125.0, 350.0, 125.0);
/* in 2nd row, 3 wide lines, each with different stipple
glLineWidth (5.0);
glLineStipple (1, 0x0101);
drawOneLine (50.0, 100.0, 150.0, 100.0);

glLineStipple (1, 0x00FF);
drawOneLine (150.0, 100.0, 250.0, 100.0);
glLineStipple (1, 0x1C47);
drawOneLine (250.0, 100.0, 350.0, 100.0);
glLineWidth (1.0);
/* in 3rd row, 6 lines, with dash/dot/dash stipple,
/* as part of a single connected line strip
glLineStipple (1, 0x1C47);
glBegin (GL_LINE_STRIP);
for (i = 0; i < 7; i++)
glVertex2f (50.0 + ((GLfloat) i * 50.0), 75.0);
glEnd ();
/* in 4th row, 6 independent lines,
/* with dash/dot/dash stipple
for (i = 0; i < 6; i++) {
drawOneLine (50.0 + ((GLfloat) i * 50.0),
50.0, 50.0 + ((GLfloat)(i+1) * 50.0), 50.0);
}
/* in 5th row, 1 line, with dash/dot/dash stipple
/* and repeat factor of 5
glLineStipple (5, 0x1C47);
drawOneLine (50.0, 25.0, 350.0, 25.0);
glFlush ();
}

*/