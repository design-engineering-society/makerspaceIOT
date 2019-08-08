#ifndef Config_cpp
#define Config_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ArduinoJson.h>
#include <FS.h>

Config::Config() {
  load();  
}

void Config::load() {

  File f = SPIFFS.open("/config.txt", "r");

  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, f);
  if (error)
    Serial.println(F("Failed to read file, initialising configuration"));

  ID = doc["ID"] | "-";
  ssid = doc["ssid"] | "-";
  password = doc["password"] | "-";
  IP = doc["IP"] | "-";
  routerIP = doc["routerIP"] | "-";
  masterIP = doc["masterIP"] | "-";

  f.close();
}

void writeData() {
  
  SPIFFS.remove("/config.txt");
  File f = SPIFFS.open("/configc.txt", "w");

  StaticJsonDocument<2048> doc;

  doc["ID"] = ID;
  doc["ssid"] = ssid;
  doc["password"] = password;
  doc["IP"] = IP;
  doc["routerIP"] = routerIP;
  doc["masterIP"] = masterIP;
  
  if (serializeJson(doc, f) == 0)
    Serial.println(F("Failed to write to file"));

  f.close();
}

String Config::get_ID() { return ID }
String Config::get_ssid() { return ssid }
String Config::get_password() { return password }
String Config::get_IP() { return IP }
String Config::get_routerIP() { return routerIP }
String Config::get_masterIP() { return masterIP }

#endif
