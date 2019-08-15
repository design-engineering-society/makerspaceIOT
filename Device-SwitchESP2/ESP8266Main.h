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
    static void blink();
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
    void blink(int repeat, int millis);
    void switchPlug(int plugToSwitch);
    bool readPlug(int plugToRead);
    int plug1;
    int plug2;
    int plug3;
    int plug4;

};

class Config2 {
   public:
    Config2();
    void erase_all();
    void load();
    void save();
    void save(String ID, String ssid, String password, String masterIP);
    void save(String ssid, String password, String masterIP);
    void initialise();
    void printCFG(String message);
    void saveEEPROM(int address, String str);
    String loadEEPROM(int address);

    String ID;
    String ssid;
    String password;
    String masterIP;
   private:
    int ADDR_ID;
    int ADDR_ssid;
    int ADDR_pass;
    int ADDR_mIP;
};

class Utilities {
   public:
    Utilities();
    static String IPtoStr(IPAddress);
};

#endif
