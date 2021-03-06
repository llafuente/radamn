#ifndef V8_HELPER_H_
#define V8_HELPER_H_

#include <v8.h>
#include <SDL.h>


/*----------------------------------------------------*/

#define V8_POINTER_DECLARE(V8WP_TYPE)                                                              \
    static v8::Persistent<v8::ObjectTemplate> V8WP_TYPE  ## _template_;                            \

/*----------------------------------------------------*/

#define V8_WRAP_POINTER(handle_scope, V8WP_TYPE, POINTER, output_var)                              \
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
    output_var = handle_scope.Close(result);                                                       \

/*----------------------------------------------------*/

#define V8_RETURN_WRAPED_POINTER(handle_scope, V8WP_TYPE, POINTER)                                 \
    v8::Handle<v8::Value> aux;                                                                     \
    V8_WRAP_POINTER(handle_scope, V8WP_TYPE, POINTER, aux)                                         \
    return aux;                                                                                    \

/*----------------------------------------------------*/

// declare it in a block so the vars get cleaned :)
#define V8_UNWRAP_POINTER_ARG(ARG_NUMBER, V8WP_TYPE, POINTER)                                                                         \
{                                                                                                                                     \
    v8::Handle<v8::External> v8_aux_field = v8::Handle<v8::External>::Cast((args[ARG_NUMBER]->ToObject())->GetInternalField(0));      \
    void* v8_aux_ptr = v8_aux_field->Value();                                                                                         \
    POINTER = static_cast<V8WP_TYPE*>(v8_aux_ptr);                                                                                    \
}                                                                                                                                     \

/*----------------------------------------------------*/

//inline void SDL_Color_from_RGB(const char* ccolor);

SDL_Color sdl_color_from(const char* ccolor);

/*----------------------------------------------------*/

#define V8_ARG_TO_SDL_NEWCOLOR(ARG_NUMBER, OUTPUT_NAME)                                                                  \
    SDL_Color OUTPUT_NAME;                                                                                               \
    V8_ARG_TO_SDL_COLOR(ARG_NUMBER, OUTPUT_NAME)

/*----------------------------------------------------*/

/**
 * TODO support: rgb(r,g,b) rgba(r,g,b,a)
 * TODO support: #000 and other variants
 * TODO optimize hex parsing no sscanf
*/
#define V8_ARG_TO_SDL_COLOR(ARG_NUMBER, OUTPUT_NAME)                                                                    \
{                                                                                                                       \
    v8::String::Utf8Value strcolor(args[ ARG_NUMBER ]);                                                                 \
    const char* ccolor = *strcolor;                                                                                     \
    OUTPUT_NAME = sdl_color_from(ccolor);                                                                               \
}                                                                                                                       \

/*----------------------------------------------------*/

#define V8_ARG_TO_UNIT32(ARG_NUMBER, OUTPUT_NAME)                                                                      \
OUTPUT_NAME = args[ ARG_NUMBER ]->Int32Value();                                                                        \

/*----------------------------------------------------*/

#define V8_ARG_TO_DOUBLE(ARG_NUMBER, OUTPUT_NAME)                                                                      \
OUTPUT_NAME = args[ ARG_NUMBER ]->NumberValue();                                                                       \

/*----------------------------------------------------*/

#define V8_ARG_TO_NEWDOUBLE(ARG_NUMBER, OUTPUT_NAME)                                                                   \
double OUTPUT_NAME = args[ ARG_NUMBER ]->NumberValue();                                                                \

/*----------------------------------------------------*/

#define V8_ARG_TO_FLOAT(ARG_NUMBER, OUTPUT_NAME)                                                                       \
OUTPUT_NAME = (float) args[ ARG_NUMBER ]->NumberValue();                                                               \

/*----------------------------------------------------*/

#define V8_ARG_TO_NEWFLOAT(ARG_NUMBER, OUTPUT_NAME)                                                                    \
float OUTPUT_NAME = (float)args[ ARG_NUMBER ]->NumberValue();                                                          \

/*----------------------------------------------------*/

#define V8_ARG_TO_NEWARRAY(ARG_NUMBER, OUTPUT_NAME)                                                                    \
v8::Local<v8::Array> OUTPUT_NAME = v8::Local<v8::Array>::Cast( args[ ARG_NUMBER ] );                                   \

/*----------------------------------------------------*/

#define V8_EXTRACT_COORDS_FROM_ARRAY(ARRAY, IDX, X_OUTPUT_NAME, Y_OUTPUT_NAME)                                         \
{                                                                                                                      \
    v8::Local<v8::Array> aux = v8::Local<v8::Array>::Cast( ARRAY->Get(IDX) );                                          \
    X_OUTPUT_NAME = (float) aux->Get(0)->NumberValue();                                                                \
    Y_OUTPUT_NAME = (float) aux->Get(1)->NumberValue();                                                                \
}                                                                                                                      \

/*----------------------------------------------------*/

inline void v8_get_vec2_from_array_idx(v8::Local<v8::Array> arr, int idx, float &x, float &y) {
    v8::Local<v8::Array> aux = v8::Local<v8::Array>::Cast( arr->Get(idx) );                               
    x = (float) aux->Get(0)->NumberValue();                                                               
    y = (float) aux->Get(1)->NumberValue();                                                               
}

/*----------------------------------------------------*/

#define V8_EXTRACT_FROM_ARRAY(ARRAY, IDX, TYPE, OUTPUT_NAME, COUNT)                                                    \
TYPE OUTPUT_NAME[COUNT];                                                                                               \
{                                                                                                                      \
    int ___I = 0;                                                                                                      \
    v8::Local<v8::Array> aux = v8::Local<v8::Array>::Cast( ARRAY->Get(IDX) );                                          \
    for(;___I<COUNT; ++___I) {                                                                                         \
        OUTPUT_NAME[___I] = aux->Get(___I)->NumberValue();                                                             \
    }                                                                                                                  \
}                                                                                                                      \

/*----------------------------------------------------*/

#define V8_CHECK_ARGS(POS, ARG_TYPE)           \
if(args[ POS ]->Is ## ARG_TYPE()) {            \
  error = true;                                \
}                                              \

/*----------------------------------------------------*/

#define SDL_RECT_P(POINTER, X,Y,W,H)                \
POINTER = (SDL_Rect*) SDL_malloc(sizeof(SDL_Rect)); \
POINTER->x = X;                                     \
POINTER->y = Y;                                     \
POINTER->w = W;                                     \
POINTER->h = H;                                     \

/*----------------------------------------------------*/

#define RETURN_WRAP_IMAGE(POINTER)                                                                 \
    if (SDL_Surface_template_.IsEmpty()) {                                                      \
        v8::HandleScope handle_scope2;                                                             \
        v8::Handle<v8::ObjectTemplate> result = v8::ObjectTemplate::New();                         \
        result->SetInternalFieldCount(1);                                                          \
        v8::Handle<v8::ObjectTemplate> raw_template = handle_scope2.Close(result);                 \
        SDL_Surface_template_ = v8::Persistent<v8::ObjectTemplate>::New(raw_template);          \
    }                                                                                              \
                                                                                                   \
    v8::Handle<v8::ObjectTemplate> templ = SDL_Surface_template_;                               \
    v8::Handle<v8::Object> result = templ->NewInstance();                                          \
    v8::Handle<v8::External> request_ptr = v8::External::New(POINTER);                             \
    result->SetInternalField(0, request_ptr);                                                      \
    result->Set(v8::String::New("width"), v8::Number::New(POINTER->w));                                                      \
    result->Set(v8::String::New("height"), v8::Number::New(POINTER->h));                                                      \
    return result;                                                                                    \

/*----------------------------------------------------*/

#define UNWRAP_IMAGE(ARG_NUMBER, POINTER) V8_UNWRAP_POINTER_ARG(0, target)

/*----------------------------------------------------*/
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

/*----------------------------------------------------*/

#endif // V8_HELPER_H_
