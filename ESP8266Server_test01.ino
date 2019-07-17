#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>   // Include the WebServer library
#include <ESP8266mDNS.h>
 
const char* ssid = "TP-Link_6F62";
const char* password = "78059757";

// Server
ESP8266WebServer server(80);

void handleOnOff() {
  IPAddress IP = server.client().remoteIP();
  char buff [4];
  String IPTest = String(itoa(IP[0],buff,10)) + "." + itoa(IP[1],buff,10) + "." + itoa(IP[2],buff,10) + "." + itoa(IP[3],buff,10);
  String plug = server.arg("plug");
  switchPlug(plug);
  Serial.println("A device with the IP " + IPTest + " sent a request to switch plug " + plug);
  server.send(200, "text/plain", "Plug " + plug + " switched");
}

void switchPlug(String plug) {

  switch (plug.toInt()) {
    case 1: digitalWrite(16,!digitalRead(16)); break;
    case 2: digitalWrite(5,!digitalRead(5)); break;
    case 3: digitalWrite(4,!digitalRead(4)); break;
    //case 4: digitalWrite(2,!digitalRead(2)); break;
    default: Serial.println("Invalid plug id"); break;
  }
}

void handleNotFound(){
  server.send(404, "text/plain", "404: Not found");
}

void setup () {

  pinMode(16, OUTPUT); // Plug 1
  pinMode(5, OUTPUT);  // Plug 2
  pinMode(4, OUTPUT);  // Plug 3

  Serial.begin(115200);

  // Client
  WiFi.begin(ssid, password);
   
  while (WiFi.status() != WL_CONNECTED) {
   
    delay(1000);
    Serial.println("Connecting..");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP());

  server.on("/onOff", handleOnOff);               // Call the 'handleRoot' function when a client requests URI "/"
  server.onNotFound(handleNotFound);        // When a client requests an unknown URI (i.e. something other than "/"), call function "handleNotFound"

  server.begin(); 
}
 
void loop() {

  server.handleClient();
  
  /*if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status

    HTTPClient http;  //Declare an object of class HTTPClient
     
    http.begin("http://192.168.0.110:5000/test");  //Specify request destination
    int httpCode = http.GET();       //Send the request
     
    if (httpCode > 0) { //Check the returning code
     
      String payload = http.getString();   //Get the request response payload
      Serial.println(payload);                     //Print the response payload
      digitalWrite(led,!digitalRead(led));
    } else {
      Serial.println("No payload");
    }
    http.end();   //Close connection
  } else {
    Serial.println("Not connected");
  }
  delay(3000);    //Send a request every 30 seconds*/
}