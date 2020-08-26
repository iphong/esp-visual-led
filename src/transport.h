#include "Arduino.h"
#include "ESP8266WiFi.h"
#include "MeshRC.h"
#include "ArduinoOTA.h"
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#ifdef ESP8266
extern "C" {
#include "user_interface.h"
}
#endif

#ifndef __TRANSPORT_H_
#define __TRANSPORT_H__

namespace Transport {	
	bool sendFile;
	Dir dir;
	File file;
	String tmpName = "/tmp/receiving";
	String name = "";
	u8 crc = 0x00;

	void setup() {
		WiFi.mode(WIFI_AP_STA);
		WiFi.begin("nest", "khongbiet");
		WiFi.softAP("node_" + String(Config::chipID), "");

		ArduinoOTA.begin();

		#ifdef SLAVE
		MeshRC::on("#>FILE^", [](u8* filename, u8 size) {
			if (!Config::isPaired()) return;
			name = "";
			crc = 0x00;
			for (auto i=0; i<size; i++) {
				name.concat((const char)filename[i]);
			}
			if (file) file.close();
			file = Config::fs->open(tmpName, "w+");
			Serial.printf("\nReceiving file: %s\n", name.c_str());
			digitalWrite(LED_BUILTIN, HIGH);
		});
		MeshRC::on("#>FILE+", [](u8* data, u8 size) {
			if (!Config::isPaired()) return;
			if (file) {
				u32 tmr = millis();
				u16 pos = data[0] << 8 | data[1];
				if (file.position() != pos) {
					file.close();
					Config::fs->remove(tmpName);
					Serial.printf("TRUNCATED.\n");
					return;
				}
				Serial.printf("%04X :: ", pos);
				for (auto i=2; i<size;i++) {
					crc += data[i];
					file.write(data[i]);
					Serial.printf("%02X ", data[i]);
				}
				digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
				Serial.println(millis() - tmr);
			}
		});
		MeshRC::on("#>FILE$", [](u8* data, u8 size) {
			if (!Config::isPaired()) return;
			Serial.printf("%02X %02X\n", crc, data[0]);
			if (!file || data[0] != crc) return;
			file.close();
			Config::fs->rename(tmpName, name);
			Config::fs->remove(tmpName);
			Serial.println("EOF.\n");
			digitalWrite(LED_BUILTIN, LOW);
		});
		#endif

		MeshRC::on("#>PAIR*", [](u8* data, u8 size) {
			if (!Config::isPairing()) return;
			Config::saveMaster(MeshRC::sender);
			Config::setMode(Config::IDLE);
		});
		MeshRC::on("#>PAIR@", [](u8* data, u8 size) {
			if (!Config::isPairing()) return;
			Config::saveChannel(data[0]);
			Config::saveMaster(MeshRC::sender);
			Config::setMode(Config::IDLE);
		});
		MeshRC::on("#>RGB+", [](u8* colors, u8 size) {
			u8 index = Config::data.channel * 3;
			if (index >= size - 3) return; // Channel is not in range
		});
		MeshRC::on("#>WIFI", [](u8* data, u8 size) {

		});
		MeshRC::begin();
	}

	void loop() {
		ArduinoOTA.handle();
		#ifdef MASTER
		if (sendFile) {
			dir = Config::fs->openDir("/seq");
			while (dir.next()) {
				file = dir.openFile("r");
				crc = 0x00;

				Serial.printf("Send file : %s\n", file.fullName());
				MeshRC::send("#>FILE^" + String(file.fullName()));
				while (MeshRC::sending) yield();
				delay(100);

				while (file.available()) {
					u16 pos = file.position();
					u8 len = _min(64, file.available());
					u8 data[len+2];
					data[0] = pos >> 8;
					data[1] = pos & 0xff;
					Serial.printf("%04X :: ", pos);
					for (auto i=0; i<len; i++) {
						data[i+2] = file.read();
						crc += data[i+2];
						Serial.printf("%02X ", data[i+2]);
					}
					Serial.printf("\n");
					MeshRC::send("#>FILE+", data, sizeof(data));
					digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
					while (MeshRC::sending) yield(); // Wait while sending
					delay(15); // give nodes sometimes to write data (about 2ms)
				}

				file.close();
				MeshRC::send("#>FILE$" + String((const char)crc));
				while (MeshRC::sending) yield();
				delay(100);
				Serial.printf("Sent\n\n");
			}
			
			sendFile = false;
		}
		#endif // MASTER
	}
}
#endif
