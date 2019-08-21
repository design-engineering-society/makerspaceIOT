#ifndef RequestSender_cpp
#define RequestSender_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>

extern Config* cfg;
extern GPIO* gpio;

ESP_RequestSender::ESP_RequestSender() {
}

void ESP_RequestSender::connect() {

  HTTPClient http;
  http.begin("http://" + cfg->masterIP + ":5000/connect");

  char jsonData[1024];
  DynamicJsonDocument doc(1024);
  doc["ID"] = cfg->ID;
  serializeJson(doc, jsonData);
  String jsonString = String(jsonData);

  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(jsonString);
   
  if (httpCode > 0) {
   
    String payload = http.getString();
    Serial.println(payload);
    gpio->blink(6,0.2);
  }
  http.end();
}
#endif
