#ifndef Config_cpp
#define Config_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ArduinoJson.h>
#include <FS.h>
#include <ESP8266TrueRandom.h>

Config::Config() {

  bool res = SPIFFS.begin();
  Serial.print("SPIFFS.begin() = ");
  Serial.println(res);
  
  load();
  printCFG("first loaded config");
}

Config::Config(char* ssid, char* password, char* routerIP, char* masterIP) {

  bool res = SPIFFS.begin();
  Serial.print("SPIFFS.begin() = ");
  Serial.println(res);
  
  load();

  this->ssid = ssid;
  this->password = password;
  this->routerIP = routerIP;
  this->masterIP = masterIP;

  save();
  printCFG("just saved config");
}

void Config::load() {

  File f = SPIFFS.open("/config.txt", "r");

  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, f);
  if (error)
    Serial.println("Error occurred when trying to open /config.txt");

  ID = doc["ID"].as<String>();  
  ssid = doc["ssid"].as<String>();
  password = doc["password"].as<String>();
  IP = doc["IP"].as<String>();
  routerIP = doc["routerIP"].as<String>();
  masterIP = doc["masterIP"].as<String>();

  f.close();
}

void Config::save() {
  
  SPIFFS.remove("/config.txt");
  File f = SPIFFS.open("/config.txt", "w");

  StaticJsonDocument<2048> doc;

  doc["ID"] = ID;
  doc["ssid"] = ssid;
  doc["password"] = password;
  doc["IP"] = IP;
  doc["routerIP"] = routerIP;
  doc["masterIP"] = masterIP;
  
  if (serializeJson(doc, f) == 0)
    Serial.println("Failed to write to file");

  f.close();
}

void Config::initialise() {
  
  byte uuidNumber[16];
  ESP8266TrueRandom.uuid(uuidNumber);
  String uuidStr = ESP8266TrueRandom.uuidToString(uuidNumber);

  ID = uuidStr;
  save();
  printCFG("just initialised config");
}

void Config::printCFG(String message) {
  Serial.println(String("----- ") + message + " -----");
  Serial.println("ID: " + ID);
  Serial.println("ssid: " + ssid);
  Serial.println("password: " + password);
  Serial.println("IP: " + IP);
  Serial.println("routerIP: " + routerIP);
  Serial.println("masterIP: " + masterIP);
  Serial.println("------------------");
}

#endif
