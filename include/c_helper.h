#ifndef C_HELPER_H_
#define C_HELPER_H_

#include <iomanip>
#include <limits>

/*
reference: http://www.iiug.org/software/archive/cfuncts
this is an old repository of very nice functions check it :)
*/

/* ============================================================ */
/* This function removes all of a given character from a string */
/* ============================================================ */

char *strremchar(char *str, int c, char *target);

void strcpy(const char *from, char* to);

#define MAX(A,B) ((A)>(B) ? (A) : (B))

//
// ----------------------------------------------------------------------------------------------------
//

int nextpoweroftwo(float x);


#endif // C_HELPER_H_
