#include <Arduino.h>
#include <ArduinoOTA.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>
#include <LittleFS.h>
#include <EEPROM.h>
#include <Ticker.h>

#include "espnow.h"
#include "Button.h"
#include "MeshRC.h"

#include "def.h"

#ifndef __APP_H__
#define __APP_H__

#ifdef ENABLE_DEBUG_LOGS
#define LOG(x...) Serial.print(x)
#define LOGD(x...) Serial.printf(x)
#define LOGL(x...) Serial.println(x)
#else
#define LOG(x...) Serial.print("")
#define LOGL(x...) Serial.print("")
#define LOGD(x...) Serial.print("")
#endif

namespace App {

u8 mode;
SaveData data;
Ticker saveTimer;
Ticker blinkTimer;

char chipID[6];

FS* fs = &LittleFS;
bool fsOK;
bool sdOK;

u8 led_pin = B1_PIN;

static void LED_HIGH() {
	digitalWrite(led_pin, 0);
}
static void LED_LOW() {
	digitalWrite(led_pin, 1);
}
static void LED_BLINK() {
	digitalWrite(led_pin, !digitalRead(led_pin));
}

static void stopBlink() {
	LED_HIGH();
	if (blinkTimer.active()) blinkTimer.detach();
}
static void startBlink(u32 time = 1000, u8 pin = 0) {
	if (pin && pin != led_pin) {
		stopBlink();
		led_pin = pin;
		pinMode(led_pin, OUTPUT);
	}
	blinkTimer.attach_ms(time, LED_BLINK);
}
static void toggleBlink(u32 time = 1000, u8 pin = led_pin) {
	if (blinkTimer.active())
		stopBlink();
	else
		startBlink(time, pin);
}
bool isPaired() {
	return !equals(data.master, MeshRC::broadcast, 6);
}
bool isPairing() {
	return mode == MODE_BIND;
}
void saveData() {
	static SaveData tmp;
	static char buf[sizeof(tmp)];
	uint8_t crc = 255;
	size_t pos = 0;
	EEPROM.begin(512);
	memcpy(buf, &data, sizeof(data));
	LOG(F("Saving config ... [ "));
	while (pos < sizeof(data)) {
		crc += buf[pos];
		EEPROM.write(pos, buf[pos]);
		LOGD("%02X ", buf[pos]);
		pos++;
	}
	EEPROM.write(pos, crc);
	if (EEPROM.commit())
		LOGL(F("] - OK"));
	else
		LOGL(F("] - FAIL"));
	EEPROM.end();
}
void loadData() {
	static SaveData tmp;
	static char buf[sizeof(tmp)];
	uint8_t pos = 0;
	size_t crc = 255;
	EEPROM.begin(512);
	LOG(F("Loading config ... [ "));
	while (pos < sizeof(tmp)) {
		buf[pos] = EEPROM.read(pos);
		crc += buf[pos];
		LOGD("%02X ", buf[pos]);
		pos++;
	}
	EEPROM.end();
	memcpy(&tmp, buf, sizeof(tmp));
	if (tmp.header != HEADER || tmp.version != VERSION) {
		LOGL(F("] - INVALID"));
		saveData();
	} else {
		memcpy(&data, &tmp, sizeof(tmp));
		LOGL(F("] - OK"));
	}
	if (isPaired()) {
		MeshRC::setMaster(data.master);
	}
}
void save() {
	saveTimer.once(1, saveData);
}
void setMode(u8 newMode) {
	mode = newMode;
}
void setShow(u8 show) {
	data.show = show;
}
void setChannel(u8 channel) {
	data.channel = channel;
}
void setMaster(u8* addr) {
	if (addr == NULL) {
		memcpy(data.master, MeshRC::broadcast, 6);
	} else {
		memcpy(data.master, addr, 6);
	}
	if (isPaired()) {
		MeshRC::setMaster(data.master);
	}
}
void setup() {
	loadData();
	fsOK = fs->begin();
	LOGL(fsOK ? F("Filesystem initialized.") : F("Filesystem init failed!"));
	if (!fs->exists("/show")) fs->mkdir("/show");
	if (!fs->exists("/tmp")) fs->mkdir("/tmp");
}
void loop() {
}
}  // namespace App

#endif
