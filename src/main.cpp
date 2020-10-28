#include <Arduino.h>

#ifdef CONTROLLER
#include "controller.cpp"
#endif

#ifdef REMOTE
#include "remote.cpp"
#endif

#ifdef MATRIX
#include "matrix.cpp"
#endif
