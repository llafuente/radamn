#ifndef V8_HELPER_H_
#define V8_HELPER_H_

#include <SDL.h>
#include <v8.h>

#if RADAMN_RENDERER == RADAMN_RENDERER_OPENGL
// on centos: yum install mesa-libGL mesa-libGL-devel mesa-libGLU mesa-libGLU-devel
#include <SDL/SDL_opengl.h>
#include <GL/gl.h>
#include <GL/glu.h>
//#include <GL/glaux.h>
#elif RADAMN_RENDERER == RADAMN_RENDERER_OPENGLES
// include the proper libs
#endif

#define V8_POINTER_DECLARE(V8WP_TYPE)                                                              \
    static v8::Persistent<v8::ObjectTemplate> V8WP_TYPE  ## _template_;                            \


#define V8_WRAP_POINTER(handle_scope, V8WP_TYPE, POINTER, output_var)                              \
    std::cout << "open";                                                                           \
    if (V8WP_TYPE  ## _template_.IsEmpty()) {                                                      \
        v8::HandleScope handle_scope2;                                                             \
        v8::Handle<v8::ObjectTemplate> result = v8::ObjectTemplate::New();                         \
        result->SetInternalFieldCount(1);                                                          \
        v8::Handle<v8::ObjectTemplate> raw_template = handle_scope2.Close(result);                 \
        V8WP_TYPE  ## _template_ = v8::Persistent<v8::ObjectTemplate>::New(raw_template);          \
    }                                                                                              \
                                                                                                   \
    v8::Handle<v8::ObjectTemplate> templ = V8WP_TYPE  ## _template_;                               \
    v8::Handle<v8::Object> result = templ->NewInstance();                                          \
    v8::Handle<v8::External> request_ptr = v8::External::New(POINTER);                             \
    result->SetInternalField(0, request_ptr);                                                      \
    std::cout << "close";                                                                          \
    output_var = handle_scope.Close(result);                                                       \


#define V8_RETURN_WRAPED_POINTER(handle_scope, V8WP_TYPE, POINTER)                                 \
    v8::Handle<v8::Value> aux;                                                                     \
    V8_WRAP_POINTER(handle_scope, V8WP_TYPE, POINTER, aux)                                         \
    return aux;                                                                                    \

// declare it in a block so the vars get cleaned :)
#define V8_UNWRAP_POINTER_ARG(ARG_NUMBER, V8WP_TYPE, POINTER)                                                         \
{                                                                                                                     \
    v8::Handle<v8::External> v8_aux_field = v8::Handle<v8::External>::Cast((args[ARG_NUMBER]->ToObject())->GetInternalField(0));      \
    void* v8_aux_ptr = v8_aux_field->Value();                                                                         \
    POINTER = static_cast<V8WP_TYPE*>(v8_aux_ptr);                                                                    \
}


#define V8_ARG_TO_SDL_NEWCOLOR(ARG_NUMBER, OUTPUT_NAME)                                                                  \
    SDL_Color OUTPUT_NAME;                                                                                               \
    V8_ARG_TO_SDL_COLOR(ARG_NUMBER, OUTPUT_NAME)
/**
 * TODO support: rgb(r,g,b) rgba(r,g,b,a)
 * TODO support: #000 and other variants
 * TODO optimize hex parsing no sscanf
*/
#define V8_ARG_TO_SDL_COLOR(ARG_NUMBER, OUTPUT_NAME)                                                                    \
{                                                                                                                       \
    v8::String::Utf8Value strcolor(args[ ARG_NUMBER ]);                                                                 \
    const char* ccolor = *strcolor;                                                                                     \
    std::cout << "color: " << *strcolor << std::endl;                                                                   \
    if(strncmp ( ccolor, "#", 1) == 0) {                                                                                \
        int r,g,b;                                                                                                      \
        sscanf(ccolor, "#%02x%02x%02x", &r,&g,&b);                                                                      \
        std::cout << (int)r << (int)g << (int)b << std::endl;                                                           \
        OUTPUT_NAME.r = (int)r;                                                                                         \
        OUTPUT_NAME.g = (int)g;                                                                                         \
        OUTPUT_NAME.b = (int)b;                                                                                         \
    } else if(strncmp ( ccolor, "rgb", 3) == 0) {                                                                       \
          std::cout << ccolor << "RGB!!!!! --> " << strlen(ccolor) << std::endl;                                        \
          char* aux = (char *)malloc(strlen(ccolor)+1); /* strtok so +1!! */                                            \
          strcpy(ccolor, aux);                                                                                          \
          std::cout << aux << std::endl;                                                                                \
          strremchar(aux, ' ', aux);                                                                                    \
                                                                                                                        \
          char * ptr = strtok (aux, "(");                                                                               \
                                                                                                                        \
          ptr = strtok (NULL, ",");                                                                                     \
          OUTPUT_NAME.r = atoi(ptr);                                                                                    \
          std::cout << ptr << (int) OUTPUT_NAME.r << std::endl;                                                         \
                                                                                                                        \
          ptr = strtok (NULL, ",");                                                                                     \
          OUTPUT_NAME.g = atoi(ptr);                                                                                    \
          std::cout << ptr << (int) OUTPUT_NAME.g << std::endl;                                                         \
                                                                                                                        \
          ptr = strtok (NULL, ")");                                                                                     \
          OUTPUT_NAME.b = atoi(ptr);                                                                                    \
          std::cout << ptr << (int) OUTPUT_NAME.b << std::endl;                                                         \
          ptr = strtok (NULL, "?");                                                                                     \
                                                                                                                        \
          free(aux); /* free the initial pointer!! */                                                                   \
          ptr = 0;                                                                                                      \
    } else if(strncmp ( ccolor, "rgba", 4) == 0) {                                                                      \
    }                                                                                                                   \
}                                                                                                                       \


#define V8_ARG_TO_UNIT32(ARG_NUMBER, OUTPUT_NAME)                                                                      \
OUTPUT_NAME = args[ ARG_NUMBER ]->Int32Value();                                                                        \

#define V8_ARG_TO_DOUBLE(ARG_NUMBER, OUTPUT_NAME)                                                                      \
OUTPUT_NAME = args[ ARG_NUMBER ]->NumberValue();                                                                       \

#define V8_ARG_TO_NEWDOUBLE(ARG_NUMBER, OUTPUT_NAME)                                                                   \
double OUTPUT_NAME = args[ ARG_NUMBER ]->NumberValue();                                                                \

#define V8_ARG_TO_FLOAT(ARG_NUMBER, OUTPUT_NAME)                                                                       \
OUTPUT_NAME = args[ ARG_NUMBER ]->NumberValue();                                                                       \

#define V8_ARG_TO_NEWFLOAT(ARG_NUMBER, OUTPUT_NAME)                                                                    \
float OUTPUT_NAME = args[ ARG_NUMBER ]->NumberValue();                                                                 \

#define V8_ARG_TO_NEWARRAY(ARG_NUMBER, OUTPUT_NAME)                                                                    \
v8::Local<v8::Array> OUTPUT_NAME = v8::Local<v8::Array>::Cast( args[ ARG_NUMBER ] );                                   \

#define V8_EXTRACT_COORDS_FROM_ARRAY(ARRAY, IDX, X_OUTPUT_NAME, Y_OUTPUT_NAME)                                         \
{                                                                                                                      \
    v8::Local<v8::Array> aux = v8::Local<v8::Array>::Cast( ARRAY->Get(IDX) );                                          \
    X_OUTPUT_NAME = aux->Get(0)->NumberValue();                                                                        \
    Y_OUTPUT_NAME = aux->Get(1)->NumberValue();                                                                        \
}                                                                                                                      \


#define V8_CHECK_ARGS(POS, ARG_TYPE)           \
if(args[ POS ]->Is ## ARG_TYPE()) {            \
  error = true;                                \
}                                              \



#define SDL_RECT_P(POINTER, X,Y,W,H)            \
POINTER = new SDL_Rect();                       \
POINTER->x = X;                                 \
POINTER->y = Y;                                 \
POINTER->w = W;                                 \
POINTER->h = H;                                 \

// declare here all needed pointers!
V8_POINTER_DECLARE(SDL_Font)
V8_POINTER_DECLARE(SDL_Surface)

#define RETURN_WRAP_IMAGE(POINTER) V8_RETURN_WRAPED_POINTER(scope, SDL_Surface, POINTER)
#define UNWRAP_IMAGE(ARG_NUMBER, POINTER) V8_UNWRAP_POINTER_ARG(0, target)




/* reference move to macros */
/* Make an SDL_Rect without manually setting each value one at a time */
SDL_Rect newSDL_Rect( int xs,int ys, int dx,int dy );
/* Make a new SDL_Color */
SDL_Color newSDL_Color( int r, int g, int b, int a );
/* Who needs alpha anyway? */
SDL_Color newSDL_Color( int r, int g, int b );
/* operators are fun */
bool operator==(SDL_Color a, SDL_Color b);
bool operator!=(SDL_Color a, SDL_Color b);
/* It's faster to type this way */
int SDL_MapRGB( SDL_PixelFormat *format, SDL_Color clr );
/* Same here */
int SDL_FillRect( SDL_Surface *dest, SDL_Rect *rc, SDL_Color &clr );

#endif // V8_HELPER_H_

