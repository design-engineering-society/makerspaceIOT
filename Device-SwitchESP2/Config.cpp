#ifndef Config_cpp
#define Config_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ArduinoJson.h>
#include <ESP8266TrueRandom.h>
#include <EEPROM.h>

extern const char* init_ssid;
extern const char* init_password;
extern const char* init_masterIP;

Config::Config() {

  Serial.println("Config constructor");

  this->ADDR_ID = 0;
  this->ADDR_ssid = 50;
  this->ADDR_pass = 100;
  this->ADDR_mIP = 150;

  load();
}

void Config::erase_all() {

  EEPROM.begin(200);
  
  for(int i = 0; i < 200; i++) {
    EEPROM.write(i,0xFF);
  }
  EEPROM.commit();
}

void Config::save() {

  saveEEPROM(ADDR_ID, ID);
  saveEEPROM(ADDR_ssid, ssid);
  saveEEPROM(ADDR_pass, password);
  saveEEPROM(ADDR_mIP, masterIP);
  load();
}

void Config::save(String tID, String tssid, String tpassword, String tmasterIP) {

  saveEEPROM(ADDR_ID, tID);
  saveEEPROM(ADDR_ssid, tssid);
  saveEEPROM(ADDR_pass, tpassword);
  saveEEPROM(ADDR_mIP, tmasterIP);
  load();
}

void Config::save(String tssid, String tpassword, String tmasterIP) { // Not saving ID, or overriding ID with ""

  saveEEPROM(ADDR_ssid, tssid);
  saveEEPROM(ADDR_pass, tpassword);
  saveEEPROM(ADDR_mIP, tmasterIP);
  load();
}

void Config::load() {

  ID = loadEEPROM(ADDR_ID);
  ssid = loadEEPROM(ADDR_ssid);
  password = loadEEPROM(ADDR_pass);
  masterIP = loadEEPROM(ADDR_mIP);

  printCFG("Loaded config");
}

void Config::saveEEPROM(int address, String str) {

  EEPROM.begin(200);
  
  for(int i = 0; i < str.length(); i++) {
    EEPROM.write(i+address,str[i]);
  }
  EEPROM.write(address+str.length(),0xFF);
  EEPROM.commit();
}

String Config::loadEEPROM(int address) {

  String str;
  EEPROM.begin(200);
  int i = address;
  
  while(EEPROM.read(i) != 0xFF) {
    if (i - address >= 50) {
      break;
    }
    str += char(EEPROM.read(i));
    i++;
  }

  return str;
}

void Config::initialise() {
  
  byte uuidNumber[16];
  ESP8266TrueRandom.uuid(uuidNumber);
  String uuidStr = ESP8266TrueRandom.uuidToString(uuidNumber);
  
  ID = uuidStr;
  ssid = init_ssid;
  password = init_password;
  masterIP = init_masterIP;
  
  save();
  printCFG("Initialised config");
}

void Config::printCFG(String message) {
  Serial.println(String("----- ") + message + " -----");
  Serial.println("ID: " + ID);
  Serial.println("ssid: " + ssid);
  Serial.println("password: " + password);
  Serial.println("masterIP: " + masterIP);
  Serial.println("------------------");
}

#endif
