#ifndef RequestSender_cpp
#define RequestSender_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>

extern Config* cfg;

ESP_RequestSender::ESP_RequestSender() {
}

String IPtoStr(const IPAddress& address){
  return String(address[0]) + "." + address[1] + "." + address[2] + "." + address[3];
}

void ESP_RequestSender::init() { // TODO - make work

  HTTPClient http;

  http.begin("http://" + cfg->masterIP + ":5000/init?IP=" + IPtoStr(WiFi.localIP()));
  int httpCode = http.GET();
   
  if (httpCode > 0) {
   
    String payload = http.getString();
    Serial.println(payload);
  }
  http.end();
}

#endif
