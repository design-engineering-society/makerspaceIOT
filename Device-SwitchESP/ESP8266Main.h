#ifndef Main_cpp
#define Main_cpp

#include "Arduino.h"

class ESP_RequestHandler {
   public:
    ESP_RequestHandler();
    static void reconfigureNetwork();
    static void joinNetwork();
    static void onOff();
    static void update();
    static void info();
    static void notFound();
};

class ESP_RequestSender {
   public:
    ESP_RequestSender();
    static void init();
};

class Network {
   public:
    Network();
    void reset();
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
};

#endif
