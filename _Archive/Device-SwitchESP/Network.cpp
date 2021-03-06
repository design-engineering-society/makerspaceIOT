#ifndef Network_cpp
#define Network_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

extern const char* ssid;
extern const char* password;
extern const char* APssid;
extern const char* APpassword;
extern int timeoutThreshold;
extern Config* cfg;
extern ESP_RequestSender* reqSend;

ESP8266WebServer server(80);

Network::Network() {

  resetNetwork();
}

void Network::resetNetwork() {
  server.close();
  WiFi.disconnect();
  WiFi.setAutoConnect(false);
  WiFi.softAPdisconnect(true);
}

void Network::setupAP() {

  resetNetwork();
  WiFi.mode(WIFI_AP_STA);

  server.on("/", HTTP_GET, ESP_RequestHandler::reconfigNetworkAP);
  server.on("/reconfig", HTTP_POST, ESP_RequestHandler::reconfigNetwork);
  server.onNotFound(ESP_RequestHandler::notFound);

  IPAddress ip(192, 168, 0, 1);
  IPAddress gateway(192, 168, 0, 2);
  IPAddress subnet(255, 255, 255, 0);
  IPAddress dns(8, 8, 8, 8);

  Serial.println("Starting AP");

  WiFi.softAPConfig(ip, gateway, subnet);
  WiFi.softAP(APssid, APpassword);
  
  server.begin();
}

void Network::setupServer() {

  Serial.print("Setting up server. Local IP: ");
  Serial.println(WiFi.localIP());
  cfg->IP = Utilities::IPtoStr(WiFi.localIP());
  cfg->save();
  WiFi.setAutoReconnect(true);

  server.on("/onOff", HTTP_GET, ESP_RequestHandler::onOff);
  server.on("/update", HTTP_POST, ESP_RequestHandler::update);
  server.on("/info", HTTP_GET, ESP_RequestHandler::info);
  server.onNotFound(ESP_RequestHandler::notFound);

  server.begin();
  ESP_RequestSender::connect();
}

void Network::setupWiFi() {

  resetNetwork();

  WiFi.begin(ssid, password);
  Serial.println("Connecting");

  int timeoutCounter = 0;
  for(int i = 0; i <= timeoutThreshold; i++) {
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("Connected!");
      setupServer();
      break;
    } else if (i == timeoutThreshold) {
      setupAP(); 
    }
    Serial.print(".");
    delay(1000);
  }
}

#endif
