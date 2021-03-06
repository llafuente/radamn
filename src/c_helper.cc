#include "c_helper.h"

//
// ----------------------------------------------------------------------------------------------------
//

char *strremchar(char *str, int c, char *target)
{
    char *ptr;

    for (ptr = str; *ptr != '\0'; ptr++) {
        if (*ptr != c) {
            *target = *ptr;
            ++target;
        }
    }
    *target = '\0';

    return(target);
}

//
// ----------------------------------------------------------------------------------------------------
//

void strcpy(const char *from, char* to)
{
    const char *ptr;

    for (ptr = from; *ptr != '\0'; ptr++) {
        *to = *ptr;
        ++to;
    }
    *to = '\0';
}

//
// ----------------------------------------------------------------------------------------------------
//

int nextpoweroftwo(float x) {
    double logbase2 = log(x) / log(2.0f);
    return (int) floor(pow(2,ceil(logbase2))  + 0.5 );
}