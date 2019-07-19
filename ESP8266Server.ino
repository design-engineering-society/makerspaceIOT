/*
 * 19/07/2019
 * Makerspace IoT Project
 * ESP8266Server.ino
 * 
 * This file runs the main code for the ESP8266 NodeMCU microcontroller
 * in the the Makerspace IoT project. It also includes code from
 * ESP8266Config.ino
 * 
 */

//===============================================================
// File initialisation
//===============================================================

#include "D:\Documents\Makerspace Internship\Programming\Arduino\ESP8266Config2\ESP8266Config2.ino"
#include "D:\Documents\Makerspace Internship\Programming\Arduino\ESP8266Utility\ESP8266Utility.ino"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>

const char* ssid = "TP-Link_6F62";
const char* password = "78059757";

int pinForPlug[5] = {0 , 16 , 5 , 4 , 2}; // Mapping from plugs to pin numners. E.g. pinForPlug[1] = 16

// Server
ESP8266WebServer server(80); // Server object to handle server functions for ESP8266

//===============================================================
// Utility functions
//===============================================================

void switchPlug(String plugToSwitch) { // Switches the state of pinForPlug[i]: ON <-> OFF

  int i = plugToSwitch.toInt();
  digitalWrite(pinForPlug[i],!digitalRead(pinForPlug[i]));
}

bool readPlug(String plugToRead) { // Returns 0 if pinForPlug[i] is OFF and 1 if pinForPlug[i] is ON

  int i = plugToRead.toInt();
  return digitalRead(pinForPlug[i]);
}

//===============================================================
// Request Handling
//===============================================================

void handleOnOff() {
  String plug = server.arg("plug");
  switchPlug(plug);
  Serial.println("Plug " + plug + " switched");
  
  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["plugSwitched"] = plug;
  doc["plugStatus"] = readPlug(plug) == 0? "OFF" : "ON";
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void handleUpdate() {
 
  DynamicJsonDocument json(2048);
  DeserializationError error = deserializeJson(json, server.arg("plain"));
  if (error) {
    Serial.println("Not working hmmmmmm");
    return;
  }
  
  cfg.initialised = "true";
  cfg.IP = json["IP"].as<String>();
  cfg.description = json["description"].as<String>();
  cfg.routerIP = json["routerIP"].as<String>();
  cfg.masterIP = json["masterIP"].as<String>();
  cfg.plug1Lbl = json["plug1Lbl"].as<String>();
  cfg.plug2Lbl = json["plug2Lbl"].as<String>();
  cfg.plug3Lbl = json["plug3Lbl"].as<String>();
  cfg.plug4Lbl = json["plug4Lbl"].as<String>();
  writeConfig();
  Serial.println("Updated config");
  printConfig();

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["initialised"] = "true";
  doc["IP"] = cfg.IP;
  doc["description"] = cfg.description;
  doc["routerIP"] = cfg.routerIP;
  doc["masterIP"] = cfg.masterIP;
  doc["plug1Lbl"] = cfg.plug1Lbl;
  doc["plug2Lbl"] = cfg.plug2Lbl;
  doc["plug3Lbl"] = cfg.plug3Lbl;
  doc["plug4Lbl"] = cfg.plug4Lbl;
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void handleConfigInfo() {

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["initialised"] = "true";
  doc["IP"] = cfg.IP;
  doc["description"] = cfg.description;
  doc["routerIP"] = cfg.routerIP;
  doc["masterIP"] = cfg.masterIP;
  doc["plug1Lbl"] = cfg.plug1Lbl;
  doc["plug2Lbl"] = cfg.plug2Lbl;
  doc["plug3Lbl"] = cfg.plug3Lbl;
  doc["plug4Lbl"] = cfg.plug4Lbl;
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void handlePlugInfo() {

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["plug1"] = digitalRead(pinForPlug[1]) == 0? "OFF": "ON";
  doc["plug2"] = digitalRead(pinForPlug[2]) == 0? "OFF": "ON";
  doc["plug3"] = digitalRead(pinForPlug[3]) == 0? "OFF": "ON";
  doc["plug4"] = digitalRead(pinForPlug[4]) == 0? "OFF": "ON";
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void handleCheck() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "ESP " + cfg.IP + " Available");
}

void handleNotFound(){
  server.send(404, "text/plain", "404: Not found");
}

//===============================================================
// Request Sending
//===============================================================

void sendInit() {

  HTTPClient http;

  Serial.println("http://" + cfg.masterIP + ":5000/init"); // ("http://" + cfg.masterIP + ":5000/init")
  http.begin("http://192.168.0.110:5000/init");
  int httpCode = http.GET();
   
  if (httpCode > 0) {
   
    String payload = http.getString();
    Serial.println(payload);
    
    cfg.initialised = "true";
    writeConfig();
  }
  http.end();
}

//===============================================================
// Setup and Loop
//===============================================================

void setup () {

  // Setup pins for plugs
  pinMode(pinForPlug[1], OUTPUT); // Plug 1
  pinMode(pinForPlug[2], OUTPUT); // Plug 2
  pinMode(pinForPlug[3], OUTPUT); // Plug 3
  pinMode(pinForPlug[4], OUTPUT); // Plug 4

  Serial.begin(115200);

  //File System (setupConfig2.ino)
  setupFS();

  WiFi.disconnect(); //Prevent connecting to wifi based on previous configuration
  
  if (cfg.initialised == "true") { //Static IP address configuration
    Serial.println("Initialised! Setting up WiFi config");
    IPAddress staticIP(octet(cfg.IP, 1), octet(cfg.IP, 2), octet(cfg.IP, 3), octet(cfg.IP, 4));
    IPAddress gateway(octet(cfg.routerIP, 1), octet(cfg.routerIP, 2), octet(cfg.routerIP, 3), octet(cfg.routerIP, 4));
    IPAddress subnet(255, 255, 255, 0);
    IPAddress dns(8, 8, 8, 8);
    WiFi.config(staticIP, subnet, gateway, dns);
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting..");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP());

  // Server routing
  server.on("/onOff", HTTP_GET, handleOnOff);
  server.on("/update", HTTP_POST, handleUpdate);
  server.on("/configInfo", HTTP_GET, handleConfigInfo);
  server.on("/plugInfo", HTTP_GET, handlePlugInfo);
  server.on("/check", HTTP_GET, handleCheck);
  server.onNotFound(handleNotFound);

  server.begin();

  sendInit();
}
 
void loop() {

  server.handleClient();
}