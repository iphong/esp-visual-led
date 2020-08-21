#include "Arduino.h"
#include "EEPROM.h"

#define KEY '$'
#define VERSION 4

struct config_t {
	uint8_t key = KEY;
	uint16_t version = VERSION;
	uint8_t master[6];
	bool paired = false;
} config;

void saveConfig() {
	EEPROM.begin(sizeof(config));
	char buf[sizeof(config)];
	memcpy(buf, &config, sizeof(config));
	size_t pos = 0;
	while (pos < sizeof(config)) {
		EEPROM.write(pos, buf[pos]);
		pos++;
	}
	if (EEPROM.commit())
		Serial.println("Config saved success.");
	else
		Serial.println("Config saved failure.");
	EEPROM.end();
}

void loadConfig() {
	size_t pos = 0;
	config_t tmp;
	char buf[sizeof(tmp)];
	EEPROM.begin(sizeof(tmp));
	while (pos < sizeof(tmp)) {
		buf[pos] = EEPROM.read(pos);
		pos++;
	}
	EEPROM.end();
	memcpy(&tmp, buf, sizeof(tmp));
	if (tmp.key != KEY || tmp.version != VERSION) {
		saveConfig();
	} else {
		memcpy(&config, &tmp, sizeof(tmp));
		Serial.println("Config loaded.");
	}
}
