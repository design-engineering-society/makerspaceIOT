#ifndef Main_cpp
#define Main_cpp

#include "Arduino.h"
#include <ESP8266WiFi.h>

class ESP_RequestHandler {
   public:
    ESP_RequestHandler();
    static void reconfigNetworkAP();
    static void reconfigNetwork();
    static void joinNetwork();
    static void onOff();
    static void update();
    static void info();
    static void notFound();
};

class ESP_RequestSender {
   public:
    ESP_RequestSender();
    static void connect();
};

class Network {
   public:
    Network();
    void resetNetwork();
    void setupServer();
    void setupAP();
    void setupWiFi();
};

class Plugs {
   public:
    Plugs(int plug1, int plug2, int plug3, int plug4);
    void switchPlug(int plugToSwitch);
    bool readPlug(int plugToRead);
    int plug1;
    int plug2;
    int plug3;
    int plug4;

};

class Config {
   public:
    Config();
    Config(char* ssid, char* password, char* routerIP, char* masterIP);
    void load();
    void save();
    void initialise();
    void printCFG(String message);
    
    String ID;
    String ssid;
    String password;
    String IP;
    String routerIP;
    String masterIP;
};

class Utilities {
   public:
    Utilities();
    static String IPtoStr(IPAddress);
};

#endif
