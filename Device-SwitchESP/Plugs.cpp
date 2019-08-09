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

void Plugs::switchPlug(int plugToSwitch) {

  switch(plugToSwitch) {
      case 1 : digitalWrite(plug1,!digitalRead(plug1)); break;
      case 2 : digitalWrite(plug2,!digitalRead(plug2)); break;
      case 3 : digitalWrite(plug3,!digitalRead(plug3)); break;
      case 4 : digitalWrite(plug4,!digitalRead(plug4)); break;
      default : Serial.println("Invalid plug");
   }
}

bool Plugs::readPlug(int plugToRead) {

  switch(plugToRead) {
      case 1 : return digitalRead(plug1); break;
      case 2 : return digitalRead(plug2); break;
      case 3 : return digitalRead(plug3); break;
      case 4 : return digitalRead(plug4); break;
      default : Serial.println("Invalid plug"); return false;
   }
}

#endif
