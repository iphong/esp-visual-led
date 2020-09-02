#include <Arduino.h>
#include <ArduinoOTA.h>
#include <ESP8266WiFi.h>
// #include <WiFiServer.h>
#include <MeshRC.h>
// #include <ESP8266mDNS.h>
// #include <DNSServer.h>
// #include <WiFiUdp.h>

#ifndef __TRANSPORT_H_
#define __TRANSPORT_H__

namespace Net {	

	bool shouldSendFiles;
	bool shouldSendSync;

	Dir dir;
	File file;
	String tmpName = "/tmp/receiving";
	String name = "";

	u8 crc = 0x00;
	
	// const byte DNS_PORT = 53;
	// DNSServer dnsServer;

	struct NodeInfo {
		char id[6];
		u8 mac[6];
	};
	struct SyncData {
		u32 time;
		u8 show;
		u8 brightness;
		bool paused;
		bool ended;
	};
	u8 syncBuffer[32];
	void recvSync(u8 *data, u8 size) {
		if (App::isPairing()) return;
		App::lED_BLINK();
		SyncData tmp;
		memcpy(&tmp, data, size);
		LOGD("Sync received: %u %i %i %u\n", tmp.show, tmp.ended, tmp.paused, tmp.time);
		App::data.show = tmp.show;
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
		#ifdef MASTER
		if (App::isPairing()) return;
		SyncData tmp = {
			Light::getTime(),
			App::data.show,
			App::data.brightness,
			Light::paused,
			Light::ended
		};
		memcpy(syncBuffer, &tmp, sizeof(tmp));
		MeshRC::send("#>SYNC", syncBuffer, sizeof(tmp));
		MeshRC::wait();
		App::lED_BLINK();
		#endif
	}

	void syncRequest() {
		if (App::isPairing()) return;
		MeshRC::send("#<SYNC");
		LOGD("Sync requested.\n");
	}

	void sendProbe() {
		MeshRC::send("#>PROBE");
	}

	void sendNodeInfo() {
		MeshRC::send("#<INFO" + String(App::chipID) + WiFi.macAddress());
	}

	// Master send pair message to pending slaves
	void sendPair(u8 channel = 255) {
		if (channel != 255) {
			LOGD("Sending pair with channel: %u\n", channel);
			MeshRC::send("#>PAIR@", &channel, 1);
		} else {
			LOGD("Sending pair without channel\n");
			MeshRC::send("#>PAIR*");
		}
	}

	u32 delayUntil;
	void waitDelay(u32 time) {
		while (MeshRC::sending) yield(); // Wait while sending
		delayUntil = millis() + time;
		while (millis() < delayUntil) yield();
	}

	void sendFile(String path, String targetID = "******") {
		LOGD("Send file : %s -- ", path.c_str());
		if (!App::fs->exists(path)) {
			LOGD("NOT EXISTS\n");
			return;
		}
		LOGD("OK\n");
		file = App::fs->open(path, "r");
		crc = 0x00;
		MeshRC::send("#>FILE^" + targetID + String(file.fullName()));
		waitDelay(100);
		while (file.available()) {
			u16 pos = file.position();
			u8 len = _min(64, file.available());
			u8 data[len+2];
			data[0] = pos >> 8;
			data[1] = pos & 0xff;
			LOGD("%04X :: ", pos);
			for (auto i=0; i<len; i++) {
				data[i+2] = file.read();
				crc += data[i+2];
				LOGD("%02X ", data[i+2]);
			}
			LOGD("\n");
			MeshRC::send("#>FILE+", data, sizeof(data));
			App::lED_BLINK();
			waitDelay(15);
		}

		file.close();
		MeshRC::send("#>FILE$" + String((const char)crc));
		waitDelay(100);
		App::lED_LOW();
		LOGD("Sent\n\n");
	}

	void sendDir(String path) {
		LOGD("Send DIR : %s\n", path.c_str());
		dir = App::fs->openDir(path);
		while (dir.next()) {
			if (dir.isFile()) {
				sendFile(path + "/" + dir.fileName());
			} else if (dir.isDirectory() && dir.fileName() != "." && dir.fileName() != "..") {
				sendDir(path + "/" + dir.fileName());
			}
		}
	}

	void setup() {
		static String ssid = "SDC_" + String(App::chipID);
		static String psk = "11111111";
		static IPAddress addr = {10,0,0,1};
		static IPAddress mask = {255,255,255,0};

		WiFi.mode(WIFI_AP_STA);
		WiFi.disconnect();

		WiFi.softAP(ssid, psk, 0, 0, 8);
		WiFi.softAPConfig(addr, addr, mask);
		WiFi.setAutoConnect(false);
		WiFi.setAutoReconnect(false);

		ArduinoOTA.begin();
		ArduinoOTA.onStart([]() {
			Light::end();
		});

		MeshRC::on("#>PAIR*", [](u8* data, u8 size) {
			if (!App::isPairing()) return;
			App::saveMaster(MeshRC::sender);
			App::setMode(App::SHOW);
		});

		MeshRC::on("#>PAIR@", [](u8* data, u8 size) {
			if (!App::isPairing()) return;
			App::saveChannel(data[0]);
			App::saveMaster(MeshRC::sender);
			App::setMode(App::SHOW);
		});

		MeshRC::on("#>FILE^", [](u8* data, u8 size) {
			if (!App::isPaired()) return;
			if (MeshRC::equals(data, (u8*)App::chipID, 6)) {
				LOGD("My file\n");
			}
			Light::end();
			name = "";
			crc = 0x00;
			for (auto i=6; i<size; i++) {
				name.concat((const char)data[i]);
			}
			if (file) file.close();
			file = App::fs->open(name, "w");
			if (!file) {
				LOGL(F("CREATE FAILED"));
			}
			LOGD("\nReceiving file: %s\n", name.c_str());
			
		});

		MeshRC::on("#>FILE+", [](u8* data, u8 size) {
			if (!App::isPaired()) return;
			if (file) {
				u32 tmr = millis();
				u16 pos = data[0] << 8 | data[1];
				if (file.position() != pos) {
					file.close();
					App::fs->remove(tmpName);
					LOGD("TRUNCATED.\n");
					return;
				}
				LOGD("%04X :: ", pos);
				for (auto i=2; i<size;i++) {
					crc += data[i];
					file.write(data[i]);
					LOGD("%02X ", data[i]);
				}
				App::lED_BLINK();
				LOGL(millis() - tmr);
			}
		});

		MeshRC::on("#>FILE$", [](u8* data, u8 size) {
			if (!App::isPaired()) return;
			LOGD("%02X %02X\n", crc, data[0]);
			if (!file || data[0] != crc) return;
			file.close();
			// App::fs->rename(tmpName, name);
			// App::fs->remove(tmpName);
			LOGL("EOF.\n");
		});

#ifdef SLAVE
		MeshRC::on("#>SYNC", recvSync);
		MeshRC::on("#>PROBE", [](u8 *data, u8 size) {
			sendNodeInfo();
		});
#endif
#ifdef MASTER
		MeshRC::on("#<SYNC", [](u8 *data, u8 size) {
			LOGD("Sync requested.\n");
			shouldSendSync = true;
		});
#endif
		MeshRC::begin();
	}

	WiFiClient client;

	void loop() {
  		// MDNS.update();
		ArduinoOTA.handle();
		if (shouldSendSync) {
			sendSync();
			LOGD("Sync sent.\n");
			shouldSendSync = false;
		}
		if (shouldSendFiles) {
			Light::end();
			sendDir("/show");
			shouldSendFiles = false;
		}
	}
}
#endif
