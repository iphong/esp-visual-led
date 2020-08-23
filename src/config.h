#include "Arduino.h"
#include "EEPROM.h"
#include "Ticker.h"
#include "MeshRC.h"

#define HEADER '$'
#define VERSION 9

Ticker delaySave;

namespace Config {

	u32 lastChanged;
	bool shouldSave;

	enum mode_t {
		IDLE,
		PLAY,
		BIND,
		BRIGHT,
	};

	mode_t mode = IDLE;
	bool modeChanged;
	bool pairing;
	bool sendFile = false;

	struct data_t {
		const char header = HEADER;
		const char version = VERSION;
		uint8_t master[6];
		bool paired = false;
		uint8_t channel = 0;
		uint8_t color[3] = {0xFF, 0xFF, 0xFF};
		uint8_t color2[3] = {0x00, 0x00, 0x00};
	} data;

	void _save() {
		lastChanged = millis();
		shouldSave = true;
	}

	void saveColor(u8 r, u8 g, u8 b) {
		data.color[0] = r;
		data.color[1] = g;
		data.color[2] = b;
		_save();
	}
	void saveChannel(u8 num) {
		data.channel = num;
		_save();
	}
	void saveMaster(u8 *addr) {
		memcpy(data.master, addr, 6);
		_save();
	}
	void saveBinding(bool state) {
		data.paired = state;
		_save();
	}
	void setMode(mode_t newMode) {
		mode = newMode;
		modeChanged = true;
        Serial.printf("mode = %i\n", Config::mode);
		if (mode == IDLE) {
			#ifdef SLAVE
            if (Config::data.paired)
				digitalWrite(LED_BUILTIN, LOW);
			else setMode(BIND);
			#endif
        }
	}

	void save() {
		EEPROM.begin(512);
		char buf[sizeof(data)];
		memcpy(buf, &data, sizeof(data));
		Serial.print("Saving config ... [ ");
		for (auto pos=0; pos < sizeof(data); pos++) {
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
		delaySave.attach(1, []() {
			if (shouldSave && millis() - 1000 > lastChanged) {
				save();
				shouldSave = false;
			}
		});
		if (data.paired) {
			MeshRC::setMaster(data.master);
		} else {
			#ifdef SLAVE
			setMode(BIND);
			#endif
		}
	}

	
}
