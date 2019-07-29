/*
 * 19/07/2019
 * Makerspace IoT Project
 * ESP8266Config2.ino
 * 
 * This file runs the main code for the ESP8266 NodeMCU microcontroller
 * in the the Makerspace IoT project. This is an update on ESP8266config.ino,
 * and includes more usable json functionality.
 * 
 */

//===============================================================
// File initialisation
//===============================================================

#include <ArduinoJson.h>
#include <FS.h>

struct Config {
  String initialised;
  String IP;
  String description;
  String routerIP;
  String masterIP;
  String plug1Lbl;
  String plug2Lbl;
  String plug3Lbl;
  String plug4Lbl;
};

Config cfg;

//===============================================================
// Config functions
//===============================================================

void loadConfig() {
  
  File f = SPIFFS.open("/config2.txt", "r");

  StaticJsonDocument<2048> doc;
  DeserializationError error = deserializeJson(doc, f);
  if (error)
    Serial.println(F("Failed to read file, initialising configuration"));

  cfg.initialised = doc["initialised"] | "false";
  cfg.IP = doc["IP"] | "-";
  cfg.description = doc["description"] | "-";
  cfg.routerIP = doc["routerIP"] | "192.168.0.254";
  cfg.masterIP = doc["masterIP"] | "192.168.0.110";
  cfg.plug1Lbl = doc["plug1Lbl"] | "-";
  cfg.plug2Lbl = doc["plug2Lbl"] | "-";
  cfg.plug3Lbl = doc["plug3Lbl"] | "-";
  cfg.plug4Lbl = doc["plug4Lbl"] | "-";

  f.close();
}

void writeConfig() {
  
  SPIFFS.remove("/config2.txt");
  File f = SPIFFS.open("/config2.txt", "w");

  StaticJsonDocument<2048> doc;

  doc["initialised"] = cfg.initialised;
  doc["IP"] = cfg.IP;
  doc["description"] = cfg.description;
  doc["routerIP"] = cfg.routerIP;
  doc["masterIP"] = cfg.masterIP;
  doc["plug1Lbl"] = cfg.plug1Lbl;
  doc["plug2Lbl"] = cfg.plug2Lbl;
  doc["plug3Lbl"] = cfg.plug3Lbl;
  doc["plug4Lbl"] = cfg.plug4Lbl;
  
  if (serializeJson(doc, f) == 0)
    Serial.println(F("Failed to write to file"));

  f.close();
}

// Prints the content of a file to the Serial
void printConfig() {
  Serial.println("------------------");
  Serial.println("Initialised: " + cfg.initialised);
  Serial.println("IP: " + cfg.IP);
  Serial.println("Description: " + cfg.description);
  Serial.println("RouterIP: " + cfg.routerIP);
  Serial.println("MasterIP: " + cfg.masterIP);
  Serial.println("Plug1Lbl: " + cfg.plug1Lbl);
  Serial.println("Plug2Lbl: " + cfg.plug2Lbl);
  Serial.println("Plug3Lbl: " + cfg.plug3Lbl);
  Serial.println("Plug4Lbl: " + cfg.plug4Lbl);
  Serial.println("------------------");  
}

//===============================================================
// Filesystem Setup
//===============================================================

void setupFS() {
 
  bool res = SPIFFS.begin();
  Serial.print("SPIFFS.begin() = ");
  Serial.println(res);

  loadConfig();
  printConfig();
}