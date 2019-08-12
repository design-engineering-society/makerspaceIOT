#ifndef Utility_cpp
#define Utility_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ESP8266WiFi.h>

extern Config* cfg;

Utilities::Utilities() {
}

String Utilities::IPtoStr(IPAddress address){
  return String(address[0]) + "." + address[1] + "." + address[2] + "." + address[3];
}
#endif
