#include "Arduino.h"
#include "EEPROM.h"
#include "LittleFS.h"
#include "MeshRC.h"
#include "Ticker.h"

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

#define HEADER '$'
#define VERSION 2

namespace App {
enum Mode {
	SHOW = 0,
	BIND = 1
};
struct RGB {
	u8 r;
	u8 g;
	u8 b;
};
struct Output {
	RGB color = {0, 0, 0};
	u8 ratio;
	u32 period;
	u32 spacing;
};
struct Data {
	u8 header = HEADER;
	u8 version = VERSION;
	u8 master[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
	u8 brightness = 255;
	u8 channel = 0;
	u8 show = 0;
	Output a;
	Output b;
};

Data data;
Mode mode;

Ticker saveTimer;
Ticker blinkTimer;

char chipID[6];

FS* fs = &LittleFS;
bool fsOK;
bool sdOK;

static void lED_HIGH() {
	digitalWrite(LED_PIN, 1);
}
static void lED_LOW() {
	digitalWrite(LED_PIN, 0);
}
static void lED_BLINK() {
	digitalWrite(LED_PIN, !digitalRead(LED_PIN));
}

static void stopBlink() {
	if (blinkTimer.active()) blinkTimer.detach();
}
static void startBlink(u32 time) {
	stopBlink();
	blinkTimer.attach_ms(time, lED_BLINK);
}
bool isPaired() {
	return !MeshRC::equals(data.master, MeshRC::broadcast, 6);
}
bool isPairing() {
	return mode == BIND;
}

void saveData() {
	EEPROM.begin(512);
	uint8_t crc = 255;
	char buf[sizeof(data)];
	memcpy(buf, &data, sizeof(data));
	LOG("Saving config ... [ ");
	size_t pos = 0;
	while (pos < sizeof(data)) {
		crc += buf[pos];
		EEPROM.write(pos, buf[pos]);
		Serial.printf("%02X ", buf[pos]);
		pos++;
	}
	EEPROM.write(pos, crc);
	if (EEPROM.commit())
		LOGL("] - OK");
	else
		LOGL("] - FAIL");
	EEPROM.end();
}

void loadData() {
	size_t pos = 0;
	uint8_t crc = 255;
	Data tmp;
	char buf[sizeof(tmp)];
	EEPROM.begin(512);
	LOG("Loading config ... [ ");
	while (pos < sizeof(tmp)) {
		buf[pos] = EEPROM.read(pos);
		crc += buf[pos];
		Serial.printf("%02X ", buf[pos]);
		pos++;
	}
	EEPROM.end();
	memcpy(&tmp, buf, sizeof(tmp));
	if (tmp.header != HEADER || tmp.version != VERSION) {
		LOGL("] - INVALID");
		saveData();
	} else {
		memcpy(&data, &tmp, sizeof(tmp));
		LOGL("] - OK");
	}
	if (isPaired()) {
		MeshRC::setMaster(data.master);
	}
}
void save() {
	saveTimer.detach();
	saveTimer.once(1, saveData);
}
void setMode(Mode newMode) {
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

	if (!fs->exists("/show")) {
		fs->mkdir("/show");
	}
	if (!fs->exists("/tmp")) {
		fs->mkdir("/tmp");
	}
}
void loop() {
	
}
}  // namespace App

#endif
