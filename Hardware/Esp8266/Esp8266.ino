
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
//#include <WiFiClientSecure.h>
//#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <time.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>


SoftwareSerial NodeSerial(D2, D3);

const char* ssid = "PAELECTRONIC_2.4GHz";
const char* password = "12345678";
const char* broker = "203.159.93.64";
const int port = 1883;
const char* mqttUser = "treeauto";
const char* mqttPassword = "P@ssw0rd";


WiFiClient espClient;
//  WiFiClientSecure httpsClient;

PubSubClient mqtt(espClient);
ESP8266WiFiMulti WiFiMulti;

float temperatures = 0.0f;
float ecVal = 0.0f;
int light = 0;

float setTemp = 0.0f;
int setLight = 0;
int setOpen = 0;
int setIntervals = 0;
bool setEC = false;

char ntp_server1[20] = "pool.ntp.org";
char ntp_server2[20] = "time.nist.gov";
char ntp_server3[20] = "time.uni.net.th";
int timezone = 7 * 3600;
int dst = 0;
String datetime = "";

#define OUT 14 //D5
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received in topic: ");
  Serial.print(topic);
  Serial.print("   length is:");
  Serial.println(length);
  Serial.print("Data Received From Broker:");
  String str = "";
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    str += (char)payload[i];
  }

  if (str.indexOf("SETLIGHT:") != -1) {
    setLight = (str.substring(str.indexOf("SETLIGHT:") + 9, str.indexOf("}"))).toInt();
    Serial.print("setLight : ");
    Serial.println(setLight);
  } else if (str.indexOf("SETTEMP:") != -1) {
    setTemp = (str.substring(str.indexOf("SETTEMP:") + 8, str.indexOf("}"))).toFloat();
    Serial.print("setTemp : ");
    Serial.println(setTemp);
  } else if (str.indexOf("SETTIME:") != -1) {
    setOpen = (str.substring(str.indexOf("SETTIME:") + 8, str.indexOf("}"))).toInt();
    Serial.print("setOpen : ");
    Serial.println(setOpen);
  } else if (str.indexOf("SETINTERVALS:") != -1) {
    setIntervals = (str.substring(str.indexOf("SETINTERVALS:") + 13, str.indexOf("}"))).toInt();
    Serial.print("setIntervals : ");
    Serial.println(setIntervals);
  } else if (str.indexOf("SETEC:") != -1) {
    ((str.substring(str.indexOf("SETEC:") + 6, str.indexOf("}") - 1)) == "on") ? setEC = true : setEC = false;
    Serial.print("setEC : ");
    Serial.println(setEC);
  }
}

void initMQTT() {
  mqtt.setServer(broker, port);
  mqtt.setCallback(callback);
  while (!mqtt.connected()) {
    Serial.println("Connecting to MQTT...");
    if (mqtt.connect("ESP32Client", mqttUser, mqttPassword ))    {
      Serial.println("connected to MQTT broker");
    }
    else    {
      Serial.print("failed with state ");
      Serial.print(mqtt.state());
      delay(500);
    }
  }
  mqtt.subscribe("DATA");
  Serial.println("ESP8266 AS SUBSCRIBER");
  Serial.println("Subscribing topic test:");
}
String payload = "";
void setup() {
  Serial.begin(38400);
  WiFi.begin(ssid, password);
  NodeSerial.begin(38400);
  Serial.println("Connecting to WiFi..");
  WiFi.mode(WIFI_STA);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  WiFiMulti.addAP(ssid, password);
  Serial.println("Connected to the WiFi network");

  if ((WiFiMulti.run() == WL_CONNECTED)) {
    HTTPClient http;
    Serial.print("[HTTP] begin...\n");
    if (http.begin(espClient, "http://203.159.93.64:5000/setting")) {
      Serial.print("[HTTP] GET...\n");
      int httpCode = http.GET();
      if (httpCode > 0) {
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          payload = http.getString();

        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  }
  initMQTT();

  configTime(timezone, dst, ntp_server1, ntp_server2, ntp_server3);
  Serial.println("\nWaiting for time");
  while (!time(nullptr)) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("");

  payload = payload.substring(payload.indexOf("[") + 1, payload.indexOf("]"));
  Serial.print("payload : ");
  Serial.println(payload);
  StaticJsonDocument<500> doc;
  DeserializationError error = deserializeJson(doc, payload);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }
  String setting_light = doc["setting_light"];
  String setting_temp = doc["setting_temp"];
  String setting_status_ec = doc["setting_status_ec"];
  String setting_open_time = doc["setting_open_time"];
  String setting_interval_time = doc["setting_interval_time"];

  setTemp = setting_temp.toFloat();
  setLight = setting_light.toInt();
  setOpen = setting_open_time.toInt();
  setIntervals = setting_interval_time.toInt();
  (setting_status_ec.toInt() == 0) ? setEC = false : setEC = true;
  Serial.print("setTemp : ");
  Serial.println(setTemp);
  Serial.print("setLight : ");
  Serial.println(setLight);
  Serial.print("setOpen : ");
  Serial.println(setOpen);
  Serial.print("setIntervals : ");
  Serial.println(setIntervals);
  Serial.print("setEC : ");
  Serial.println(setEC);

  pinMode(OUT, OUTPUT);
  digitalWrite(OUT, 1);
}

String datas = "";

unsigned long preTime = 0;
unsigned long postTime = 0;

unsigned long preOpen = 0;
unsigned long postOpen = 0;
bool _flag = false;
int _state = 0;

void loop() {
  mqtt.loop();
  if (NodeSerial.available() > 0) {
    char c = NodeSerial.read();
    datas += c;
    if (c == '\n') {
      Serial.print("datas = ");
      Serial.println(datas);

      temperatures = (datas.substring(datas.indexOf("temp:") + 5, datas.indexOf(","))).toFloat();
      light = (datas.substring(datas.indexOf("light") + 6, datas.indexOf("ecVal") - 1)).toInt();
      ecVal = (datas.substring(datas.indexOf("ecVal:") + 6, datas.length() - 1)).toFloat();
      Serial.println(temperatures);
      Serial.println(light);
      Serial.println(ecVal);
      int len = datas.length() ;
      char mes[len];
      datas.toCharArray(mes, len);
      mqtt.publish("DATASEND", mes);
      datas = "";
    }
  }
  preTime = millis();
  if (preTime - postTime >= 1000) {
    time_t now = time(nullptr);
    struct tm* p_tm = localtime(&now);
    if ((p_tm->tm_year + 1900) > 2020) {
      datetime = "";
      datetime += String(p_tm->tm_mday);
      datetime += "/";
      datetime += String(p_tm->tm_mon + 1);
      datetime += "/";
      datetime += String(p_tm->tm_year + 1900);
      datetime += " ";
      datetime += String(p_tm->tm_hour);
      datetime += ":";
      datetime += String(p_tm->tm_min);
      datetime += ":";
      datetime += String(p_tm->tm_sec);
      if (((p_tm->tm_min == 0)) &&  \
          (p_tm->tm_sec == 0 || p_tm->tm_sec == 1)) {
        if ((WiFiMulti.run() == WL_CONNECTED)) {
          HTTPClient http;
          Serial.print("[HTTP] begin...\n");
          if (http.begin(espClient, "http://203.159.93.64:5000/insertsensor/" + String(temperatures, 2) + "/" + String(light))) {
            Serial.print("[HTTP] GET...\n");
            int httpCode = http.GET();
            if (httpCode > 0) {
              Serial.printf("[HTTP] GET... code: %d\n", httpCode);
              if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
                payload = http.getString();

              }
            } else {
              Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
            }
            http.end();
          } else {
            Serial.printf("[HTTP} Unable to connect\n");
          }
        }
        if (setEC) {
          if ((WiFiMulti.run() == WL_CONNECTED)) {
            HTTPClient http;
            Serial.print("[HTTP] begin...\n");
            if (http.begin(espClient, "http://203.159.93.64:5000/insertec/" + String(ecVal, 2))) {
              Serial.print("[HTTP] GET...\n");
              int httpCode = http.GET();
              if (httpCode > 0) {
                Serial.printf("[HTTP] GET... code: %d\n", httpCode);
                if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
                  payload = http.getString();

                }
              } else {
                Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
              }
              http.end();
            } else {
              Serial.printf("[HTTP} Unable to connect\n");
            }
          }
        }
        initMQTT();
        delay(3000);
      }

      Serial.println(datetime);
    }
    postTime = preTime;
  }

  if (temperatures >= setTemp && light >= setLight) {
    if (!_flag) {
      _flag = true;
      _state = 1;
      preOpen = millis();
      postOpen = preOpen;
      digitalWrite(OUT, 0);
    }
  } else {
    _flag = false;
    preOpen = millis();
    postOpen = preOpen;
    digitalWrite(OUT, 1);
  }

  if (_flag && _state == 1) {
    preOpen = millis();
    digitalWrite(OUT, 0);
    Serial.println("1");
    if (preOpen - postOpen >= setOpen * 1000) {
      Serial.println("2");
      digitalWrite(OUT, 1);
      _state = 2;
      postOpen = preOpen;
    }
  } else if (_flag && _state == 2) {
    preOpen = millis();
    digitalWrite(OUT, 1);
    Serial.println("3");
    if (preOpen - postOpen >= setIntervals * 10000) {
      Serial.println("4");
      digitalWrite(OUT, 0);
      _state = 1;
      postOpen = preOpen;
    }
  }
}
