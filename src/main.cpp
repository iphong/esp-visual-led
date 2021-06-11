#include <Arduino.h>

#ifdef RECEIVER
#include "receiver.h"
#endif

#ifdef TRANSMITTER
#include "transmitter.h"
#endif

// #include <ArduinoOTA.h>
// #include <ESP8266WiFiAP.h>

// #include "RGBLed.h"
// RGBLed led(13, 12, 14);
// RGBLed led2(5, 15, 4);

// IPAddress apAddr = {10, 1, 1, 1};
// IPAddress apMask = {255, 255, 255, 0};

// void setup() {
// 	char chipID[10];
// 	sprintf(chipID, "%06X", system_get_chip_id());
// 	String apSSID = "SDC_" + String(chipID).substring(0, 6);
// 	String apPSK = "";
// 	WiFi.mode(WIFI_AP_STA);
// 	WiFi.softAPConfig(apAddr, apAddr, apMask);
// 	WiFi.softAP(apSSID, apPSK);
// 	ArduinoOTA.begin();
// 	led.setRGB(0, 0, 255);
// 	led2.setRGB(255, 0, 0);
// }

// void loop() {
// 	ArduinoOTA.handle();
// }
