#pragma once

class RequestHandler {
   public:
    RequestHandler();
    void reconfigure();
    void onOff();
    void update();
    void info();
};

class RequestSender {
   public:
    RequestSender();
    void init();
    void reconnect();
};

class WiFiConfig {
   public:
    WiFiConfig();
    void startAP();
};

class Plugs {
   public:
    Plugs(int plug1, int plug2, int plug3, int plug4);
    void switchPlug();
    void readPlug();
    void setupPlugs();
   private:
    int plug1;
    int plug2;
    int plug3;
    int plug4;
};

class Config {
   public:
    Config();
    void load();
    void save();
    String get_ID();
    String get_ssid();
    String get_password();
    String get_IP();
    String get_routerIP();
    String get_masterIP();
    
   private:
    String ID;
    String ssid;
    String password;
    String IP;
    String routerIP;
    String masterIP;
}
