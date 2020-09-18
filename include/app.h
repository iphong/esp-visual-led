#include "Arduino.h"
#include "EEPROM.h"
#include "MeshRC.h"
#include "Ticker.h"
#include "LittleFS.h"

#ifndef __APP_H__
#define __APP_H__

#ifdef ENABLE_DEBUG_LOGS
#define LOG(x...) Serial.print(x)
#define LOGD(x...) Serial.printf(x)
#define LOGL(x...) Serial.println(x)
#else
#define LOG(x...) Serial.write('.')
#define LOGL(x...) Serial.write('.')
#define LOGD(x...) Serial.write('.')
#endif

#define HEADER '$'
#define VERSION 1

namespace App {
enum Mode {
	SHOW = 0,
	BIND = 1
};
enum Effect {
	SOLID = 0,
	FLASH = 1,
	PULSE = 2,
	DOTS = 3,
	RAINBOW = 4,
	GRADIENT = 5
};
struct Color {
	u8 r;
	u8 g;
	u8 b;
};
struct Output {
	Effect type = SOLID;
	Color color = {0, 0, 0};
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
Ticker blink;

char chipID[6];

FS* fs = &LittleFS;
bool fsOK;
bool sdOK;

u32 lastChanged;
bool shouldSave;
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
	lED_HIGH();
	if (blink.active()) blink.detach();
}
static void startBlink(u32 time) {
	stopBlink();
	lED_LOW();
	blink.attach_ms_scheduled_accurate(time, lED_BLINK);
}

void save() {
	lastChanged = millis();
	shouldSave = true;
}

bool isPaired() {
	return !MeshRC::equals(data.master, MeshRC::broadcast, 6);
}
bool isPairing() {
	return mode == BIND;
}
void saveShow(u8 show) {
	data.show = show;
	save();
}
void saveChannel(u8 channel) {
	data.channel = channel;
	save();
}
void saveMaster(u8* addr) {
	if (addr == NULL) {
		memcpy(data.master, MeshRC::broadcast, 6);
	} else {
		memcpy(data.master, addr, 6);
	}
	save();
}
void setMode(Mode newMode) {
	mode = newMode;
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
void setup() {
	pinMode(LED_BUILTIN, OUTPUT);
	lED_LOW();

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
	if (shouldSave && millis() - lastChanged > 1000) {
		saveData();
		shouldSave = false;
	}
}
}  // namespace App

#endif
