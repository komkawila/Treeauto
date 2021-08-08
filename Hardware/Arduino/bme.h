#include "Seeed_BME280.h"
#include "Adafruit_Si7021.h"

Adafruit_Si7021 sensor = Adafruit_Si7021();
BME280 bme280;

void initBME() {
  if (!bme280.init()) {
    Serial.println("Device error!");
  }
  if (!sensor.begin())  {
    Serial.println("Did not find Si7021 sensor!");
    while (true);
  }
}

float getTemp() {
  float temps_buff = 0.0f;
  for (int i = 0; i < 10; i++) {
    temps_buff += bme280.getTemperature();
  }
  return temps_buff / 10.0;
}

float getPressures() {
  float pressure_buff = 0.0f;
  for (int i = 0; i < 10; i++) {
    pressure_buff += bme280.getPressure();
  }
  return pressure_buff / 10.0;
}

void readALL() {
  float pressure;
  Serial.print("Temp: ");
  Serial.print(bme280.getTemperature());
  Serial.println("C");

  Serial.print("Pressure: ");
  Serial.print(pressure = bme280.getPressure());
  Serial.println("Pa");

  Serial.print("Altitude: ");
  Serial.print(bme280.calcAltitude(pressure));
  Serial.println("m");

  Serial.println("SI7021 results");
  Serial.print("Humidity: ");
  Serial.println(sensor.readHumidity(), 2);
  Serial.print("Temperature: ");
  Serial.println(sensor.readTemperature(), 2);
  Serial.println();
}
