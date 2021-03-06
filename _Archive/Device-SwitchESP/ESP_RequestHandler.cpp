#ifndef RequestHandler_cpp
#define RequestHandler_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ArduinoJson.h>
#include <FS.h>
#include <ESP8266WebServer.h>

extern ESP8266WebServer server;
extern Plugs* plugs;
extern Config* cfg;
extern Network* net;

ESP_RequestHandler::ESP_RequestHandler() {
}

String getPlugInfo() {

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["1"] = digitalRead(plugs->plug1) == 0? "OFF": "ON";
  doc["2"] = digitalRead(plugs->plug2) == 0? "OFF": "ON";
  doc["3"] = digitalRead(plugs->plug3) == 0? "OFF": "ON";
  doc["4"] = digitalRead(plugs->plug4) == 0? "OFF": "ON";
  serializeJson(doc, jsonData);
  return String(jsonData);
}

String getConfigInfo() {

  char jsonData[1024];
  DynamicJsonDocument doc(1024);
  doc["ID"] = cfg->ID;
  doc["ssid"] = cfg->ssid;
  doc["password"] = cfg->password;
  doc["IP"] = cfg->IP;
  doc["routerIP"] = cfg->routerIP;
  doc["masterIP"] = cfg->masterIP;
  serializeJson(doc, jsonData);
  
  return String(jsonData);
}

void ESP_RequestHandler::reconfigNetworkAP() {

  Serial.println("Recieved handleReconfigure request");

  String htmlCode = "";
  htmlCode += "<!DOCTYPE html><html lang=\"en\">";
  htmlCode += "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\"><title>Connect ESP</title></head>";
  htmlCode += "<body><h2>Connect ESP</h2>ESP ID: "+cfg->ID+"<br><br><form action=\"\\reconfig\" method=\"post\" enctype=\"application/json\">SSID:<br><input type=\"text\" name=\"ssid\" value=\"\"><br>Password:<br><input type=\"text\" name=\"password\" value=\"\"><br>Router IP:<br><input type=\"text\" name=\"routerIP\" value=\"192.168.0.254\"><br>Master IP:<br><input type=\"text\" name=\"masterIP\" value=\"192.168.0.158\"><br><br><input type=\"submit\" value=\"Connect\"></form></body></html>";

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", htmlCode);
}



void ESP_RequestHandler::reconfigNetwork() {

  Serial.println("SoftAPIP: " + Utilities::IPtoStr(WiFi.softAPIP()));
  Serial.println("LocalIP: " + Utilities::IPtoStr(WiFi.localIP()));
  
  cfg->ssid = server.arg("ssid");
  cfg->password = server.arg("password");
  cfg->IP = Utilities::IPtoStr(WiFi.softAPIP());
  cfg->routerIP = server.arg("routerIP");
  cfg->masterIP = server.arg("masterIP");
  cfg->save();
  Serial.println("Updated config");

  net->setupWiFi();
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "reconfigured network");
  
}

void ESP_RequestHandler::onOff() {
  int plug = atoi(server.arg("plug").c_str());
  plugs->switchPlug(plug);
  Serial.println(String("Plug ") + plug + " switched");
  
  char jsonData[1024];
  DynamicJsonDocument doc(1024);
  doc["plugSwitched"] = plug;
  doc["plugStatus"] = plugs->readPlug(plug) == 0? "OFF" : "ON";
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void ESP_RequestHandler::update() {

  DynamicJsonDocument json(1024);
  DeserializationError error = deserializeJson(json, server.arg("plain"));
  if (error) {
    Serial.println("Not working hmmmmmm");
    return;
  }

  cfg->ssid = json["ssid"].as<String>();
  cfg->password = json["password"].as<String>();
  cfg->IP = json["IP"].as<String>();
  cfg->routerIP = json["routerIP"].as<String>();
  cfg->masterIP = json["masterIP"].as<String>();
  cfg->save();
  Serial.println("Updated config");
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", getConfigInfo());
}

void ESP_RequestHandler::info() {

  String mode = server.arg("mode");

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  DynamicJsonDocument docConfig(1024);
  DynamicJsonDocument docPlugs(1024);
  DeserializationError errorConfig = deserializeJson(docConfig, getConfigInfo());
  DeserializationError errorPlugs = deserializeJson(docPlugs, getPlugInfo());

  if (mode == "all") {
    doc["config"] = docConfig;
    doc["plugs"] = docPlugs;
  } else if (mode == "config") {
    doc["config"] = docConfig;
  } else if (mode == "plugs") {
    doc["plugs"] = docPlugs;
  } else {
    doc["message"] = "error: invalid mode";
  }
  
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void ESP_RequestHandler::notFound(){
  server.send(404, "text/plain", "404: Not found");
}

#endif
