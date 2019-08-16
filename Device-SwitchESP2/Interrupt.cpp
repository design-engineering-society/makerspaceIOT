#ifndef Interrupt_cpp
#define Interrupt_cpp

#include "ESP8266Main.h"
#include "Arduino.h"
#include <Ticker.h>

#define IS_GREATER_THAN 0
#define IS_LESS_THAN 1

const byte interruptPin = 0;
volatile byte pressedItr = 0;

int validISRThreshold = 150;

int justChanged;
int lastChanged;

Ticker APwindowTimer;
Ticker APsetupTimer;
int counter;

int mode;

int APsetupTime = 7; // seconds

extern GPIO* gpio;
extern Network* net;

void ICACHE_RAM_ATTR handlePressed() {
  pressedItr++;
}

bool pressed() {return digitalRead(interruptPin) == LOW;}
bool released() {return digitalRead(interruptPin) == HIGH;}
bool timeGap(int type, int value) {
  if (type == IS_GREATER_THAN) {return (justChanged - lastChanged) > value;}
  else if (type == IS_LESS_THAN) {return (justChanged - lastChanged) < value;}
}
int timeGap() {return justChanged - lastChanged;}

void closeWindow() {
  if (mode == 1) { mode = 0; }
  Serial.println("Window closed");
  APwindowTimer.detach();
}

void APsetup() {
  if (mode == 2) {
    gpio->blink(8,0.1);
  }
  APsetupTimer.detach();
}

void Interrupt::setup() {

  pinMode(interruptPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(interruptPin), handlePressed, CHANGE);
}
 
void Interrupt::handle() {

  if(pressedItr>0){

    pressedItr--;
    justChanged = millis();
        
    if (timeGap(IS_GREATER_THAN, validISRThreshold)) { 

      Serial.print(".");

      if (mode == 0) {
        if(released() && timeGap(IS_GREATER_THAN, 2000)) {
          mode = 1;
          gpio->blink(4, 0.1);
          APwindowTimer.attach(5, closeWindow);
          Serial.println(String("Held for at least 2 seconds: ") + String(timeGap()));
        }
      } else if (mode == 1) {
        if(pressed()) {
          Serial.println("Starting set up AP hold");
          APsetupTimer.attach(APsetupTime, APsetup);
          mode = 2;
        }
      } else if (mode == 2) {
        if (released() && timeGap(IS_GREATER_THAN, APsetupTime*1000)) {
          Serial.println(String("Setting up AP: ") + String(timeGap()));
          net->setupAP()
          mode = 0;
        }
      }
      lastChanged = millis();
    } else {
      ;//Serial.println("FALSE ISR");
    }
  }
}
#endif
