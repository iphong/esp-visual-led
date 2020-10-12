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
#define VERSION 4

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
	char name[20];
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

u8 led_pin = LED_PIN;

bool equals(u8* a, u8* b, u8 size, u8 offset = 0) {
	for (auto i = offset; i < offset + size; i++)
		if (a[i] != b[i])
			return false;
	return true;
}

// bool blinking = false;
// u8 blinkColor[] = {255,255,255};
static void LED_HIGH() {
	digitalWrite(led_pin, 1);
	// LED::A.setRGB(blinkColor[0], blinkColor[1], blinkColor[2]);
	// LED::B.setRGB(blinkColor[0], blinkColor[1], blinkColor[2]);
}
static void LED_LOW() {
	digitalWrite(led_pin, 0);
	// LED::A.setRGB(0, 0, 0);
	// LED::B.setRGB(0, 0, 0);
}
static void LED_BLINK() {
	bool state = !digitalRead(led_pin);
	digitalWrite(led_pin, state);
	// state ? LED_LOW() : LED_HIGH();
}

static void stopBlink() {
	LED_HIGH();
	if (blinkTimer.active()) blinkTimer.detach();
}
static void startBlink(u32 time = 1000, u8 pin = LED_PIN) {
	LED_HIGH();
	led_pin = pin;
	pinMode(led_pin, OUTPUT);
	LED_LOW();
	blinkTimer.attach_ms(time, LED_BLINK);
}
static void toggleBlink(u32 time = 1000) {
	if (blinkTimer.active())
		stopBlink();
	else
		startBlink(time);
}
bool isPaired() {
	return !equals(data.master, MeshRC::broadcast, 6);
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
	if (!fs->exists("/show")) fs->mkdir("/show");
	if (!fs->exists("/tmp")) fs->mkdir("/tmp");
}
void loop() {
}
}  // namespace App

#endif
