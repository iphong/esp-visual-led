#include <Arduino.h>
#include <EEPROM.h>

template <typename T, int HEADER, int VERSION>
void save_data(T &store) {
	EEPROM.begin(512);
	static char buf[sizeof(T)];
	uint8_t crc = 255;
	size_t pos = 0;
	memcpy(buf, &store, sizeof(store));
	Serial.print(F("saving data ... [ "));
	EEPROM.write(0, HEADER);
	EEPROM.write(1, VERSION);
	while (pos < sizeof(store)) {
		crc += buf[pos];
		EEPROM.write(pos+2, buf[pos]);
		Serial.printf("%02X ", buf[pos]);
		pos++;
	}
	EEPROM.write(pos+2, crc);
	if (EEPROM.commit())
		Serial.println(F("] - OK"));
	else
		Serial.println(F("] - FAIL"));
	EEPROM.end();
}
template <typename T, int HEADER, int VERSION>
void load_data(T &store) {
	EEPROM.begin(512);
	if (EEPROM.read(0) != HEADER || EEPROM.read(1) != VERSION) {
		delay(2000);
		Serial.println(F("INVALID"));
		save_data<T, HEADER, VERSION>(store);
	} else {
		static char buf[sizeof(T)];
		uint8_t pos = 0;
		size_t crc = 255;
		Serial.print(F("loading data ... [ "));
		while (pos < sizeof(buf)) {
			buf[pos] = EEPROM.read(pos + 2);
			crc += buf[pos];
			Serial.printf("%02X ", buf[pos]);
			pos++;
		}
		if (crc == EEPROM.read(pos + 2)) {
			memcpy(&store, &buf, sizeof(buf));
			Serial.println(F("] - OK"));
		} else {
			Serial.println(F("] - CRC FAIL"));
			delay(2000);
			save_data<T, HEADER, VERSION>(store);
		}
		EEPROM.end();
	}
}
