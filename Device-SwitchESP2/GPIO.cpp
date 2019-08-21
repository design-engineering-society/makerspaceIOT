#ifndef GPIO_cpp
#define GPIO_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <Ticker.h>

extern int builtin_LED_pin;
extern int relay_pin;

byte blinkCounter;
bool blinkOn;

Ticker blinker;

void blinkTimer() {
  if (blinkCounter == 0) {
    Serial.println();
    blinker.detach();
    return;
  }
  //Serial.print(blinkOn? "O": ".");
  digitalWrite(builtin_LED_pin, blinkOn? LOW: HIGH);
  blinkOn = !blinkOn;
  if (blinkOn){  blinkCounter--; }
}

  GPIO::GPIO() {

  pinMode(builtin_LED_pin, OUTPUT);
  pinMode(relay_pin, OUTPUT);
  
  digitalWrite(builtin_LED_pin, HIGH);
}

void GPIO::blink(int repeat, float seconds) {

  digitalWrite(builtin_LED_pin, LOW);
  blinkCounter = repeat;
  blinkOn = false;
  blinker.detach();
  blinker.attach(seconds, blinkTimer);
}

String GPIO::switchRelay(String mode) {

  if (mode == "toggle") {
    digitalWrite(relay_pin,!digitalRead(relay_pin));
  } else if (mode == "on") {
    digitalWrite(relay_pin,HIGH);
  } else if (mode == "off") {
    digitalWrite(relay_pin,LOW);
  }
  return digitalRead(relay_pin) == 0? "OFF": "ON";
}

String GPIO::readRelay() {

  return digitalRead(relay_pin) == 0? "OFF": "ON";
}

#endif
