/*
 * 09/08/2019
 * Makerspace IoT Project
 * ESP8266Server4.ino
 * 
 * This file runs the main code for the ESP8266 NodeMCU microcontroller
 * in the the Makerspace IoT project.
 * 
 */

#include "ESP8266Main.h"
#include <ESP8266WebServer.h>

extern ESP8266WebServer server;

const char* ssid = "TP-Link_6F62";
const char* password = "78059757";
const char* APssid = "esp_setup";
const char* APpassword = "esp_setup";
int timeoutThreshold = 5;

Plugs* plugs = new Plugs(16,5,4,2);

Config* cfg = new Config();
Network* net = new Network();
ESP_RequestHandler* reqHandle = new ESP_RequestHandler();
ESP_RequestSender* reqSend = new ESP_RequestSender();
Utilities* util = new Utilities();


void setup() {

  Serial.begin(115200);

  if !(cfg->ID) {
    cfg->initialise();
    net->setupAP();
  } else {
    net->setupWiFi();
  }
}
 
void loop() {

  server.handleClient();
}
