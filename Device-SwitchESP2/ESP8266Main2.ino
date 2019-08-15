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

const char* init_ssid = "TP-Link_6F62";
const char* init_password = "78059757";
const char* init_masterIP = "192.168.0.110";

const char* APssid = "esp_switch";
const char* APpassword = "esp_switch";

int builtin_LED_pin = 13;
int timeoutThreshold = 30;

Plugs* plugs;
Config2* cfg;
Network* net;
ESP_RequestHandler* reqHandle;
ESP_RequestSender* reqSend;
Utilities* util;

void setup() {

  Serial.begin(115200);

  plugs = new Plugs(12,5,4,2);
  cfg = new Config2();
  net = new Network();
  reqHandle = new ESP_RequestHandler();
  reqSend = new ESP_RequestSender();
  util = new Utilities();

  plugs->blink(1,1000);

  if (!cfg->ID || cfg->ID == "") {
    cfg->initialise();
    net->setupWiFi();
  } else {
    net->setupWiFi();
  }
}
 
void loop() {

  server.handleClient();
}
