#ifndef Utility_cpp
#define Utility_cpp

#include "ESP8266Main.h"
#include "Arduino.h"

Plugs::Plugs(int plug1, int plug2, int plug3, int plug4) {
  
  this->plug1 = plug1;
  this->plug2 = plug2;
  this->plug3 = plug3;
  this->plug4 = plug4;
  pinMode(plug1, OUTPUT);
  pinMode(plug2, OUTPUT);
  pinMode(plug3, OUTPUT);
  pinMode(plug4, OUTPUT);
}

#endif
