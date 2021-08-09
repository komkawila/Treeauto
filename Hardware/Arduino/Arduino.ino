#include <SoftwareSerial.h>
SoftwareSerial NodeSerial(10, 11);
#include <Wire.h>
#include "user_config.h"
#include "bme.h"
#include "ec.h"
#include "ldr.h"

unsigned long preSensor = 0;
unsigned long postSensor = 0;

float temperatures = 0.0f;
float ecVal = 0.0f;
int light = 0;

String str = "";

void readSensor() {
  preSensor = millis();
  if (preSensor - postSensor >= 1000) {
    temperatures = getTemp();
    ecVal = getEC();
    light = getLDR();
    String val = "";
    val += "{";
    val += "temp:" + String(temperatures, 2) + ",";
    val += "light:" + String(light) + ",";
    val += "ecVal:" + String(ecVal, 2);
    val += "}";
    NodeSerial.println(val);
    postSensor = preSensor;
  }
}

void setup() {
  Serial.begin(38400);
  NodeSerial.begin(38400);
  initBME();
  initEC();
}

void loop() {
  readSensor();
 
}
