#include <Arduino.h>
#include <ArduinoOTA.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <DNSServer.h>
#include <WiFiUdp.h>
#include <MeshRC.h>

#ifndef __TRANSPORT_H_
#define __TRANSPORT_H__

namespace Transport {	
	bool shouldSendFiles;
	bool shouldSendSync;
	Dir dir;
	File file;
	String tmpName = "/tmp/receiving";
	String name = "";	
	u32 lastReceiveTime;
	bool didReceivedFiles;
	u8 crc = 0x00;
	
	const byte DNS_PORT = 53;
	DNSServer dnsServer;

	struct SyncData {
		u8 show;
		u32 time;
		bool paused;
		bool ended;
	};
	u8 syncBuffer[32];
	void recvSync(u8 *data, u8 size) {
		if (Config::isPairing()) return;
		LOG("Sync received.\n");
		SyncData tmp;
		memcpy(&tmp, data, size);
		Config::data.show = tmp.show;
		if (tmp.ended) {
			Light::end();
		}
		else if (tmp.paused) {
			Light::pause();
		} else {
			Light::resume();
			Light::setTime(tmp.time);
		}
	}
	void sendSync() {
		if (Config::isPairing()) return;
		SyncData tmp = {
			Config::data.show,
			Light::getTime(),
			Light::paused,
			Light::ended
		};
		memcpy(syncBuffer, &tmp, sizeof(tmp));
		MeshRC::send("#>SYNC", syncBuffer, sizeof(tmp));
		MeshRC::wait();
		LOG("Sync sent.\n");
	}

	void syncRequest() {
		if (Config::isPairing()) return;
		MeshRC::send("#<SYNC");
		LOG("Sync requested.\n");
	}

	// Master send pair message to pending slaves
	void sendPair(u8 channel = 255) {
		if (channel != 255) {
			LOG("Sending pair with channel: %u\n", channel);
			MeshRC::send("#>PAIR@", &channel, 1);
		} else {
			LOG("Sending pair without channel\n");
			MeshRC::send("#>PAIR*");
		}
	}

	u32 delayUntil;
	void waitDelay(u32 time) {
		while (MeshRC::sending) yield(); // Wait while sending
		delayUntil = millis() + time;
		while (millis() < delayUntil) yield();
	}

	void setup() {
		
		static String ssid = "SDC_" + String(Config::chipID);
		static IPAddress addr = {1,1,1,1};
		static IPAddress mask = {255,255,255,0};

		LOG("AP SSID: %s\n", ssid.c_str());
		WiFi.mode(WIFI_AP_STA);
		WiFi.begin("nest", "khongbiet");

		WiFi.softAP(ssid, "");
		WiFi.softAPConfig(addr, addr, mask);
		WiFi.setAutoConnect(true);
		WiFi.setAutoReconnect(true);

		WiFi.onEvent([](WiFiEvent e) {
			if (e == WIFI_EVENT_STAMODE_GOT_IP) {
				LOG("%s\n", WiFi.localIP().toString().c_str());
			}
		});

		dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  		dnsServer.start(DNS_PORT, "*", addr);

		// Setup MDNS responder
        MDNS.begin(Config::hostname);
		MDNS.addService("http", "tcp", 80);

		ArduinoOTA.setHostname(Config::hostname);
		ArduinoOTA.begin();

		ArduinoOTA.onStart([]() {
			Light::end();
		});

		#ifdef SLAVE
		MeshRC::on("#>FILE^", [](u8* filename, u8 size) {
			if (!Config::isPaired()) return;
			Light::end();
			name = "";
			crc = 0x00;
			for (auto i=0; i<size; i++) {
				name.concat((const char)filename[i]);
			}
			if (file) file.close();
			file = Config::fs->open(name, "w");
			if (!file) {
                Serial.println(F("CREATE FAILED"));
            }
			LOG("\nReceiving file: %s\n", name.c_str());
			digitalWrite(LED_PIN, HIGH);
		});
		MeshRC::on("#>FILE+", [](u8* data, u8 size) {
			if (!Config::isPaired()) return;
			if (file) {
				u32 tmr = millis();
				u16 pos = data[0] << 8 | data[1];
				if (file.position() != pos) {
					file.close();
					Config::fs->remove(tmpName);
					LOG("TRUNCATED.\n");
					return;
				}
				LOG("%04X :: ", pos);
				for (auto i=2; i<size;i++) {
					crc += data[i];
					file.write(data[i]);
					LOG("%02X ", data[i]);
				}
				digitalWrite(LED_PIN, !digitalRead(LED_PIN));
				Serial.println(millis() - tmr);
			}
		});
		MeshRC::on("#>FILE$", [](u8* data, u8 size) {
			if (!Config::isPaired()) return;
			LOG("%02X %02X\n", crc, data[0]);
			if (!file || data[0] != crc) return;
			file.close();
			// Config::fs->rename(tmpName, name);
			// Config::fs->remove(tmpName);
			Serial.println("EOF.\n");
		});
		MeshRC::on("#>SYNC", recvSync);
		#endif
		#ifdef MASTER
		MeshRC::on("#<SYNC", [](u8 *data, u8 size) {
			LOG("Sync requested.\n");
			shouldSendSync = true;
		});
		#endif
		
		MeshRC::on("#>PAIR*", [](u8* data, u8 size) {
			if (!Config::isPairing()) return;
			Config::saveMaster(MeshRC::sender);
			Config::setMode(Config::IDLE);
			Light::begin();
		});
		MeshRC::on("#>PAIR@", [](u8* data, u8 size) {
			if (!Config::isPairing()) return;
			Config::saveChannel(data[0]);
			Config::saveMaster(MeshRC::sender);
			Config::setMode(Config::IDLE);
			Light::begin();
		});
		MeshRC::on("#>RGB+", [](u8* colors, u8 size) {
			u8 index = Config::data.channel * 3;
			if (index >= size - 3) return; // Channel is not in range
		});
		MeshRC::on("#>WIFI", [](u8* data, u8 size) {

		});
		MeshRC::begin();
	}
	void sendFile(File file) {
		crc = 0x00;
		LOG("Send file : %s\n", file.fullName());
		MeshRC::send("#>FILE^" + String(file.fullName()));
		waitDelay(100);
		while (file.available()) {
			u16 pos = file.position();
			u8 len = _min(64, file.available());
			u8 data[len+2];
			data[0] = pos >> 8;
			data[1] = pos & 0xff;
			LOG("%04X :: ", pos);
			for (auto i=0; i<len; i++) {
				data[i+2] = file.read();
				crc += data[i+2];
				LOG("%02X ", data[i+2]);
			}
			LOG("\n");
			MeshRC::send("#>FILE+", data, sizeof(data));
			digitalWrite(LED_PIN, !digitalRead(LED_PIN));
			waitDelay(15);
		}

		file.close();
		MeshRC::send("#>FILE$" + String((const char)crc));
		waitDelay(100);
		LOG("Sent\n\n");
	}
	void sendDir(String name) {
		dir = Config::fs->openDir(name);
		while (dir.next()) {
			sendFile(dir.openFile("r"));
		}
	}
	void loop() {
  		MDNS.update();
		ArduinoOTA.handle();
		#ifdef MASTER
		if (shouldSendSync) {
			sendSync();
			shouldSendSync = false;
		}
		if (shouldSendFiles) {
			Light::end();
			sendDir("/show/1");
			sendDir("/show/2");
			sendDir("/show/3");
			sendDir("/show/4");
			shouldSendFiles = false;
		}
		#endif // MASTER
	}
}
#endif
