/*
 * 19/07/2019
 * Makerspace IoT Project
 * ESP8266Config.ino
 * 
 * This file handles the code for setting up and accessing the
 * ESP8266 filesystem. It is used in ESP8266Server_test01.ino.
 * This code could be improved upon by incorporating JSON to encode
 * the config data.
 * 
 */

//===============================================================
// File initialisation
//===============================================================

#include <FS.h>

String configData;

String initialised;
String IP;
String description;
String masterIP;
String plug1;
String plug2;
String plug3;
String plug4;

//===============================================================
// Utility functions
//===============================================================

String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void initConfig();

void readConfig() {

  configData = "";
  File f = SPIFFS.open("/config.txt", "r");
  if (!f) {
    Serial.println("File '/config.txt' doesnt exist. Initialising config");
    initConfig();
  }
  else {
    while (f.available())
      configData += char(f.read());
    f.close();
  }

  String temp = getValue(configData, ',', 0);
  initialised = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 1);
  IP = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 2);
  description = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 3);
  masterIP = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 4);
  plug1 = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 5);
  plug2 = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 6);
  plug3 = getValue(temp, ':', 1);
  temp = getValue(configData, ',', 7);
  plug4 = getValue(temp, ':', 1);
}

void initConfig() {

  File f = SPIFFS.open("/config.txt", "w");
  if (!f)
    Serial.println("File '/config.txt' open failed.");
  else {
    f.print("Initialised:false,");
    f.print("IP:192.168.0.42,");
    f.print("Description:3D Printer Rack 1,");
    f.print("Master_IP:192.168.0.252,");
    f.print("Plug1:3D Printer 1,");
    f.print("Plug2:3D Printer 2,");
    f.print("Plug3:3D Printer 3,");
    f.print("Plug4:3D Printer 4");
    f.close();
  }
  readConfig();
}

void writeConfig() { // Write config is not changing the file

  File f = SPIFFS.open("/config.txt", "w");
  if (!f)
    Serial.println("File '/config.txt' open failed.");
  else {
    f.print("Initialised:" + initialised + ",");
    f.print("IP:" + IP + ",");
    f.print("Description:" + description + ",");
    f.print("Master_IP:" + masterIP + ",");
    f.print("Plug1:" + plug1 + ",");
    f.print("Plug2:" + plug2 + ",");
    f.print("Plug3:" + plug3 + ",");
    f.print("Plug4:" + plug4);
    f.close();  // It could be that there is an internal error in closing, which makes it revert back to the original file
  }
}

void printConfig() {

  Serial.println("-----");
  Serial.println("Initialised: " + initialised);
  Serial.println("IP: " + IP);
  Serial.println("Description: " + description);
  Serial.println("MasterIP: " + masterIP);
  Serial.println("Plug1: " + plug1);
  Serial.println("Plug2: " + plug2);
  Serial.println("Plug3: " + plug3);
  Serial.println("Plug4: " + plug4);
  Serial.println("-----");
}

void setupFS() {

  bool res = SPIFFS.begin();
  Serial.print("SPIFFS.begin() = ");
  Serial.println(res);
}