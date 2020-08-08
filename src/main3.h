#include "Arduino.h"

#include <ESP8266WiFi.h>
//#include <WiFiUdp.h>
//#include <ArduinoOTA.h>
// #include <DNSServer.h>
#include <FastLED.h>
#include <SPI.h>
#include <LittleFS.h>

#include "EspRC.h"
#include "button.h"
#include "files.h"

#define COLOR_ORDER GRB
#define CHIPSET WS2812B

#ifndef NUM_LEDS
#define NUM_LEDS 36
#endif
#ifndef IMG_SIZE
#define IMG_SIZE 36
#endif
// DNS server
// const byte DNS_PORT = 53;
// DNSServer dnsServer;

CRGB leds[NUM_LEDS];

String imageNames[1000] = {};
String imageName;
int imageIndex = 0;
int imageMax;

File img;
uint16_t row, col;

IPAddress apIP(10, 1, 1, 1);

Button b1(0);

void saveIndex()
{
	File store = LittleFS.open("/config", "w+");
	store.write(imageIndex);
	store.close();
}
void loadIndex()
{
	File store = LittleFS.open("/config", "r+");
	if (store.available())
	{
		imageIndex = store.read();
		if (imageIndex >= imageMax)
			imageIndex = imageMax - 1;
	}
	else
	{
		imageIndex = 0;
	}
}
void show_end()
{
	if (!img)
		return;
	img.close();
}
void show_setup()
{
	Dir images = LittleFS.openDir("/presets");
	while (images.next())
	{
		imageNames[imageMax++] = images.fileName();
		Serial.println(images.fileName());
	}
	loadIndex();
	FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
//	FastLED.setCorrection(TypicalLEDStrip);
	FastLED.setBrightness(255);
}
void show_start(String path)
{
	// Serial.printf("Start show: %s\n", path.c_str());
	if (path != imageName)
	{
		if (LittleFS.exists("/presets/" + path))
		{
			imageName = path;
			if (img) {
				img.close();
			}
			#ifdef MASTER
				EspRC.send("@", imageName);
			#endif
			img = LittleFS.open("/presets/" + path, "r");
		} else {
			show_end();
		}
	}
}
void show_start()
{
	show_start(imageNames[imageIndex]);
}
void show_next(bool up = true)
{
	if (up)
	{
		if (++imageIndex == imageMax)
		{
			imageIndex = 0;
		}
	}
	else
	{
		if (--imageIndex < 0)
		{
			imageIndex = imageMax - 1;
		}
	}
	saveIndex();
	show_start(imageNames[imageIndex]);
}
void show_seek(uint16_t _row)
{
	if (!img)
		return;
	row = _row;
	uint16_t pos = sizeof(CRGB) * IMG_SIZE * row;
	img.seek(pos);
}
void show_loop()
{
	if (!img)
		return;
	if (img.available() < 3)
	{
		#ifdef MASTER
			EspRC.send("@", imageName);
		#endif
		img.seek(0);
		row = 0;
		return;
	}
	while (img.available() >= 3 && col < IMG_SIZE)
	{
		if (col < IMG_SIZE)
			leds[col] = CRGB(img.read(), img.read(), img.read());
		col++;
	}
	FastLED.show();
	col = 0;
	row++;
}

void ota_setup()
{
//	ArduinoOTA.onStart([]() {
//		String type;
//		if (ArduinoOTA.getCommand() == U_FLASH)
//		{
//			type = "sketch";
//		}
//		else
//		{ // U_FS
//			type = "filesystem";
//		}
//
//		// NOTE: if updating FS this would be the place to unmount FS using FS.end()
//		Serial.println("Start updating " + type);
//	});
//	ArduinoOTA.onEnd([]() {
//		Serial.println("\nEnd");
//	});
//	ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
//		Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
//	});
//	ArduinoOTA.onError([](ota_error_t error) {
//		Serial.printf("Error[%u]: ", error);
//		if (error == OTA_AUTH_ERROR)
//		{
//			Serial.println("Auth Failed");
//		}
//		else if (error == OTA_BEGIN_ERROR)
//		{
//			Serial.println("Begin Failed");
//		}
//		else if (error == OTA_CONNECT_ERROR)
//		{
//			Serial.println("Connect Failed");
//		}
//		else if (error == OTA_RECEIVE_ERROR)
//		{
//			Serial.println("Receive Failed");
//		}
//		else if (error == OTA_END_ERROR)
//		{
//			Serial.println("End Failed");
//		}
//	});
}
void rc_setup()
{
	EspRC.on("@", [](String path) {
		show_start(path);
	});
	EspRC.on("brightness", [](String value) {
		FastLED.setBrightness(value.toInt());
	});
}
void btn_setup() {

	b1.onPress([]() {
		show_next(true);
	});
	b1.onLongPress([]() {
		show_next(false);
	});
	b1.begin();
}

void setup()
{
	Serial.begin(921600);

	WiFi.mode(WIFI_AP_STA);
	WiFi.disconnect();
//	WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
//	WiFi.softAP("SDC LED POI");

	// dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
	// dnsServer.start(DNS_PORT, "*", apIP);

	// MDNS.begin(host);
	// MDNS.addService("http", "tcp", 80);

	EspRC.begin(10);
	LittleFS.begin();
	// ArduinoOTA.begin();

	btn_setup();
	rc_setup();
	// ota_setup();
	show_setup();
//	server_setup();

	unsigned long timer = micros();
	FastLED.show();
	unsigned long duration = micros() - timer;
	Serial.printf("\n\nCycle: %u\n", duration);

	#ifdef MASTER
	show_start();
	#endif
}

void loop()
{
	b1.update();
	// ArduinoOTA.handle();
	// MDNS.update();
	// dnsServer.processNextRequest();

	show_loop();
//	server_loop();

//	if (Serial.available())
//	{
//		String line = Serial.readStringUntil('\n');
//		Serial.printf(">> %s\n", line.c_str());
//		esp_rc_handle_massge(line);
//		EspRC.send(line);
//	}
}