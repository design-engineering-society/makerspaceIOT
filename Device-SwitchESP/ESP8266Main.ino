/*
 * 07/08/2019
 * Makerspace IoT Project
 * ESP8266Server4.ino
 * 
 * This file runs the main code for the ESP8266 NodeMCU microcontroller
 * in the the Makerspace IoT project. This version uses ESP8266Config4.
 * 
 */

#include "ESP8266Main.h"
//#include "RequestHandler.cpp"

const char* ssid = "TP-Link_6F62";
const char* password = "78059757";

int timeoutThreshold = 5; // seconds

// Network
//ESP8266WebServer server(80); // Server object to handle server functions for ESP8266

//===============================================================
// Setup and Loop
//===============================================================

void setup () {

  Serial.begin(115200);
  
  Plugs* plugs = new Plugs(16,5,4,2);

  setupFS(); // <- ESP8266Config2.ino*/

  // Reset WiFi, server, softAP

  // Setup static IP

  // Connect to WiFi

  // If cant connect, set up AP  

  // Else, serve on new network
}
 
void loop() {

  //server.handleClient();
}
