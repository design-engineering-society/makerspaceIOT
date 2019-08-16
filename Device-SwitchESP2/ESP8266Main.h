#ifndef Main_cpp
#define Main_cpp

#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <Ticker.h>

class ESP_RequestHandler {
   public:
    ESP_RequestHandler();
    static void reconfigNetworkAP();
    static void reconfigNetwork();
    static void joinNetwork();
    static void blink();
    static void switchRelay();
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

class GPIO {
   public:
    GPIO();
    void blink(int repeat, float seconds);
    String switchRelay(String mode);
    String readRelay();
};

class Config {
   public:
    Config();
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

class Interrupt {
   public:
    static void setup();
    static void handle();
};

class Utilities {
   public:
    Utilities();
    static String IPtoStr(IPAddress);
};

#endif
