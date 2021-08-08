#include "DFRobot_EC.h"
float voltage, ecValue, temperature = 25;
DFRobot_EC ec;

void initEC() {
  ec.begin();
}

float getEC() {
  voltage = analogRead(EC_PIN) / 1024.0 * 5000;
  ecValue =  ec.readEC(voltage, temperature);
  ec.calibration(voltage, temperature);

  return (ecValue >= 5.00) ? 5.00 : ecValue ;
}
