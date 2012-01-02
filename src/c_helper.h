#ifndef C_HELPER_H_
#define C_HELPER_H_

/*
reference: http://www.iiug.org/software/archive/cfuncts
this is an old repository of very nice functions check it :)
*/

/* ============================================================ */
/* This function removes all of a given character from a string */
/* ============================================================ */

char *strremchar(char *str, int c, char *target);

char *strcpy(const char *str);

#define MAX(A,B) ((A)>(B) ? (A) : (B))

#endif // C_HELPER_H_
