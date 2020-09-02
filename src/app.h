#include "Arduino.h"
#include "EEPROM.h"
#include "Ticker.h"
#include "MeshRC.h"
#include "LittleFS.h"

#ifndef __APP_H__
#define __APP_H__

#define ENABLE_DEBUG_LOGS

#define LOG(x...) Serial.print(x)
#define LOGD(x...) Serial.printf(x)
#define LOGL(x...) Serial.println(x)

#define HEADER '$'
#define VERSION 3

namespace App {
	
	char chipID[6];

    FS *fs = &LittleFS;
	bool fsOK;

	u32 lastChanged;
	bool shouldSave;

	enum mode_t {
		IDLE,
		PLAY,
		BIND,
		BRIGHT,
	};

	mode_t mode = PLAY;

	struct data_t {
		u8 header = HEADER;
		u8 version = VERSION;
		u8 master[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
		u8 channel = 1;
		u8 show = 1;
		u8 brightness = 255;
	} data;

	void lED_HIGH() {
		digitalWrite(LED_PIN, 1);
	}
	void lED_LOW() {
		digitalWrite(LED_PIN, 0);
	}
	void lED_BLINK() {
		digitalWrite(LED_PIN, !digitalRead(LED_PIN));
	}
	void _save() {
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
		_save();
	}
	void saveChannel(u8 channel) {
		data.channel = channel;
		_save();
	}
	void saveMaster(u8 *addr) {
		memcpy(data.master, addr, 6);
		_save();
	}
	void setMode(mode_t newMode) {
		mode = newMode;
        Serial.printf("mode = %i\n", App::mode);
		if (mode == IDLE) {
			digitalWrite(LED_PIN, LOW);
        }
	}

	void save() {
		EEPROM.begin(512);
		char buf[sizeof(data)];
		memcpy(buf, &data, sizeof(data));
		LOG("Saving config ... [ ");
		for (size_t pos=0; pos < sizeof(data); pos++) {
			EEPROM.write(pos, buf[pos]);
			Serial.printf("%02X ", buf[pos]);
		}
		if (EEPROM.commit())
			LOGL("] - OK");
		else
			LOGL("] - FAIL");
		EEPROM.end();
	}

	void load() {
		size_t pos = 0;
		data_t tmp;
		char buf[sizeof(tmp)];
		EEPROM.begin(512);
		LOG("Loading config ... [ ");
		while (pos < sizeof(tmp)) {
			buf[pos] = EEPROM.read(pos);
			Serial.printf("%02X ", buf[pos]);
			pos++;
		}
		EEPROM.end();
		memcpy(&tmp, buf, sizeof(tmp));
		if (tmp.header != HEADER || tmp.version != VERSION) {
			LOGL("] - INVALID");
			save();
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

		load();

        fsOK = fs->begin();
		
        LOGL(fsOK ? F("Filesystem initialized.") : F("Filesystem init failed!"));
	}
	void loop() {
		#ifdef SLAVE
		static u32 lastBlink;
		if (isPairing() && millis() - lastBlink > 200) {
			digitalWrite(LED_PIN, !digitalRead(LED_PIN));
			lastBlink = millis();
		}
		#endif
		if (shouldSave && millis() - lastChanged > 1000) {
			save();
			shouldSave = false;
		}
	}
}

#endif
