#include "D:\Documents\Makerspace Internship\Programming\Arduino\setupConfig\setupConfig.ino"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>   // Include the WebServer library
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>

const char* ssid = "TP-Link_6F62";
const char* password = "78059757";

// Server
ESP8266WebServer server(80);

void switchPlug(String plug) {

  switch (plug.toInt()) {
    case 1: digitalWrite(16,!digitalRead(16)); break;
    case 2: digitalWrite(5,!digitalRead(5)); break;
    case 3: digitalWrite(4,!digitalRead(4)); break;
    case 4: digitalWrite(2,!digitalRead(2)); break;
    default: Serial.println("Invalid plug id"); break;
  }
}

bool readPlug(String plug) {

  switch (plug.toInt()) {
    case 1: return digitalRead(16); break;
    case 2: return digitalRead(5); break;
    case 3: return digitalRead(4); break;
    case 4: return digitalRead(2); break;
    default: return 0; break;
  }
}

void handleOnOff() {
  IPAddress IP = server.client().remoteIP();
  char buff [4];
  String IPTest = String(itoa(IP[0],buff,10)) + "." + itoa(IP[1],buff,10) + "." + itoa(IP[2],buff,10) + "." + itoa(IP[3],buff,10);
  String plug = server.arg("plug");
  switchPlug(plug);
  Serial.println("A device with the IP " + IPTest + " sent a request to switch plug " + plug);

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["plugSwitched"] = plug;
  doc["plugStatus"] = readPlug(plug) == 0? "OFF" : "ON";
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void handleNotFound(){
  server.send(404, "text/plain", "404: Not found");
}

void handleUpdate() {
 
  DynamicJsonDocument json(2048);
  DeserializationError error = deserializeJson(json, server.arg("plain"));
  if (error) {
    Serial.println("Not working hmmmmmm");
    return;
  }
  initialised = "true";
  IP = json["IP"].as<String>();
  description = json["description"].as<String>();
  masterIP = json["masterIP"].as<String>();
  plug1 = json["plug1"].as<String>();
  plug2 = json["plug2"].as<String>();
  plug3 = json["plug3"].as<String>();
  plug4 = json["plug4"].as<String>();
  writeConfig();
  Serial.println("Updated config");
  printConfig();
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "UPDATED ESP: " + IP);
}

void handleConfigInfo() {

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["initialised"] = "true";
  doc["IP"] = IP;
  doc["description"] = description;
  doc["masterIP"] = masterIP;
  doc["plug1"] = plug1;
  doc["plug2"] = plug2;
  doc["plug3"] = plug3;
  doc["plug4"] = plug4;
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void handlePlugInfo() {

  char jsonData[2048];
  DynamicJsonDocument doc(1024);
  doc["plug1"] = digitalRead(16) == 0? "OFF": "ON";
  doc["plug2"] = digitalRead(5) == 0? "OFF": "ON";
  doc["plug3"] = digitalRead(4) == 0? "OFF": "ON";
  doc["plug4"] = digitalRead(2) == 0? "OFF": "ON";
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", jsonString);
}

void setup () {

  pinMode(16, OUTPUT); // Plug 1
  pinMode(5, OUTPUT);  // Plug 2
  pinMode(4, OUTPUT);  // Plug 3
  pinMode(2, OUTPUT);  // Plug 4

  Serial.begin(115200);

  // Set up File System (setupConfig.ino)
  setupFS();
  // Read config: transfer data in file to variables in code
  readConfig();
  printConfig();

  // Client
  WiFi.begin(ssid, password);
   
  while (WiFi.status() != WL_CONNECTED) {
   
    delay(1000);
    Serial.println("Connecting..");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP());

  server.on("/onOff", HTTP_GET, handleOnOff);
  server.on("/update", HTTP_POST, handleUpdate);
  server.on("/configInfo", HTTP_GET, handleConfigInfo);
  server.on("/plugInfo", HTTP_GET, handlePlugInfo);
  server.onNotFound(handleNotFound);

  server.begin();
}
 
void loop() {

  server.handleClient();
}