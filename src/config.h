#include "Arduino.h"
#include "EEPROM.h"
#include "Ticker.h"
#include "MeshRC.h"
#include "LittleFS.h"

#define LOG(x...) Serial.printf(x)

#ifndef __CONFIG_H__
#define __CONFIG_H__

#define HEADER '$'
#define VERSION 2

namespace Config {
	
	char chipID[6];
	const char *hostname = "home";

    FS *fs = &LittleFS;
	bool fsOK;
	const char *fsName = "LittleFS";

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

	#define IS_PAIRED !MeshRC::equals(data.master, MeshRC::broadcast, 6)
	#define IS_PAIRING Config::mode == Config::BIND

	void _save() {
		lastChanged = millis();
		shouldSave = true;
	}

	bool isPaired() {
		return IS_PAIRED;
	}
	bool isPairing() {
		return IS_PAIRING;
	}
	void saveChannel(u8 num) {
		data.channel = num;
		_save();
	}
	void saveMaster(u8 *addr) {
		memcpy(data.master, addr, 6);
		_save();
	}
	void setMode(mode_t newMode) {
		mode = newMode;
        Serial.printf("mode = %i\n", Config::mode);
		if (mode == IDLE) {
			#ifdef SLAVE
            if (IS_PAIRED)
				digitalWrite(LED_PIN, LOW);
			else setMode(BIND);
			#endif
        }
	}

	void save() {
		EEPROM.begin(512);
		char buf[sizeof(data)];
		memcpy(buf, &data, sizeof(data));
		Serial.print("Saving config ... [ ");
		for (size_t pos=0; pos < sizeof(data); pos++) {
			EEPROM.write(pos, buf[pos]);
			Serial.printf("%02X ", buf[pos]);
		}
		if (EEPROM.commit())
			Serial.println("] - OK");
		else
			Serial.println("] - FAIL");
		EEPROM.end();
	}

	void load() {
		size_t pos = 0;
		data_t tmp;
		char buf[sizeof(tmp)];
		EEPROM.begin(512);
		Serial.print("Loading config ... [ ");
		while (pos < sizeof(tmp)) {
			buf[pos] = EEPROM.read(pos);
			Serial.printf("%02X ", buf[pos]);
			pos++;
		}
		EEPROM.end();
		memcpy(&tmp, buf, sizeof(tmp));
		if (tmp.header != HEADER || tmp.version != VERSION) {
			Serial.println("] - INVALID");
			save();
		} else {
			memcpy(&data, &tmp, sizeof(tmp));
			Serial.println("] - OK");
		}
		if (IS_PAIRED) {
			MeshRC::setMaster(data.master);
		} else {
			#ifdef SLAVE
			setMode(BIND);
			#endif
		}
	}
	void setup() {
		load();
        // fsConfig.setAutoFormat(false);
        // fs->setConfig(fsConfig);
        fsOK = fs->begin();
        Serial.println(fsOK ? F("Filesystem initialized.") : F("Filesystem init failed!"));
	}
	void loop() {
		#ifdef SLAVE
		static u32 tmr;
		while (IS_PAIRING) {
			digitalWrite(LED_PIN, !digitalRead(LED_PIN));
			tmr = millis();
			while (millis() - tmr < 500) yield();
		}
		#endif
		if (shouldSave && millis() - 1000 > lastChanged) {
			save();
			shouldSave = false;
		}
	}
}

#endif
