#include <Arduino.h>
#include <ArduinoOTA.h>
#include <ESP8266WiFi.h>
// #include <WiFiServer.h>
#include <MeshRC.h>
// #include <ESP8266mDNS.h>
// #include <DNSServer.h>
// #include <WiFiUdp.h>
#include "led.h"

#ifndef __NET_H__
#define __NET_H__

namespace Net {

bool shouldSendAllShow;
bool shouldSendCurrentShow;
bool shouldSendSync;
bool receivingFiles;
bool sendingFiles;

String staSSID;
String staPSK;
String apSSID;
String apPSK;

IPAddress apAddr;
IPAddress apMask;

Dir dir;
File file;
String tmpName = "/tmp/receiving";
String name = "";

u8 broadcastWildCard[] = "******";

u8 crc = 0x00;

// const byte DNS_PORT = 53;
// DNSServer dnsServer;

struct NodeInfo {
	char id[6];
	u32 lastUpdate;
};
struct SyncData {
	u32 time;
	u8 show;
	u8 brightness;
	bool paused;
	bool ended;
};
u8 syncBuffer[32];
void sendSync() {
#ifdef MASTER
	if (sendingFiles || App::isPairing())
		return;
	SyncData tmp = {
		LED::getTime(),
		App::data.show,
		App::data.brightness,
		LED::paused,
		LED::ended};
	memcpy(syncBuffer, &tmp, sizeof(tmp));
	MeshRC::send("#>SYNC", syncBuffer, sizeof(tmp));
	MeshRC::wait();
#endif
}
void recvSync(u8* data, u8 size) {
	if (receivingFiles || App::isPairing())
		return;
	SyncData tmp;
	memcpy(&tmp, data, size);
	LOGD("Sync received: %u %i %i %u\n", tmp.show, tmp.ended, tmp.paused,
		 tmp.time);
	App::data.show = tmp.show;
	if (tmp.ended) {
		LED::end();
	} else if (tmp.paused) {
		LED::pause();
	} else {
		LED::resume();
		LED::setTime(tmp.time);
	}
}
NodeInfo nodesList[255];
size_t nodesCount = 0;
void sendPing() {
	LOGL("sent ping");
	MeshRC::send("#>PING");
}
void recvPing(u8* data, u8 size) {
	LOGL("received ping");
	MeshRC::send("#>NODE" + String(App::chipID));
}
void recvNode(u8* data, u8 size) {
	LOGL("received node");
	bool isNew = true;
	NodeInfo tmp;
	memcpy(&tmp, data, size);
	for (auto node : nodesList) {
		if (MeshRC::equals((u8*)node.id, (u8*)tmp.id, 6)) {
			isNew = false;
			node.lastUpdate = millis();
		}
	}
	if (isNew) {
		nodesList[nodesCount++] = tmp;
	}
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
	while (MeshRC::sending)
		yield();  // Wait while sending
	delayUntil = millis() + time;
	while (millis() < delayUntil)
		yield();
}

void sendFile(String path, String targetID = "******") {
	LOGD("Send file : %s -- ", path.c_str());
	if (!App::fs->exists(path)) {
		LOGD("NOT EXISTS\n");
		return;
	}
	sendingFiles = true;
	App::lED_LOW();
	LOGD("OK\n");
	file = App::fs->open(path, "r");
	crc = 0x00;
	for (auto i=0; i<1; i++) {
		MeshRC::send("#>FILE^" + targetID + String(file.fullName()));
		waitDelay(1000);
	}
	while (file.available()) {
		u16 pos = file.position();
		u8 len = _min(128, file.available());
		u8 data[len + 2];
		data[0] = pos >> 8;
		data[1] = pos & 0xff;
		LOGD("%04X :: ", pos);
		for (auto i = 0; i < len; i++) {
			data[i + 2] = file.read();
			crc += data[i + 2];
			LOGD("%02X ", data[i + 2]);
		}
		LOGD("\n");
		for (auto i=0; i<1; i++) {
			MeshRC::send("#>FILE+", data, sizeof(data));
			App::lED_BLINK();
			waitDelay(100);
		}
	}

	file.close();
	for (auto i=0; i<1; i++) {
		MeshRC::send("#>FILE$" + String((const char)crc));
		waitDelay(500);
	}
	App::lED_HIGH();
	LOGD("Sent\n\n");
	sendingFiles = false;
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

bool IS_WIFI_ON;
void wifiOn() {
	IS_WIFI_ON = true;
	WiFi.softAPConfig(apAddr, apAddr, apMask);
	WiFi.softAP(apSSID, apPSK, 0, 0, 8);
}

void wifiOff() {
	IS_WIFI_ON = false;
	WiFi.softAPdisconnect();
}
void wifiToggle() {
	IS_WIFI_ON ? wifiOff() : wifiOn();
}
void wifiConnect(String ssid, String pass) {
	WiFi.begin(ssid, pass);
}
void wifiDisconnect() {
	WiFi.disconnect();
}

void setup() {
	WiFi.mode(WIFI_AP_STA);
	WiFi.setAutoConnect(true);
	WiFi.setAutoReconnect(true);

	wifiOn();
	wifiDisconnect();

	ArduinoOTA.onStart([]() { App::startBlink(100); });
	ArduinoOTA.onEnd([]() { App::stopBlink(); });
	ArduinoOTA.begin();

	MeshRC::on("#>SYNC", recvSync);
	MeshRC::on("#>PING", recvPing);
	MeshRC::on("#>NODE", recvNode);
	MeshRC::on("#>PAIR*", [](u8* data, u8 size) {
		if (receivingFiles || !App::isPairing())
			return;
		App::saveMaster(MeshRC::sender);
		App::setMode(App::SHOW);
	});

	MeshRC::on("#>PAIR@", [](u8* data, u8 size) {
		if (receivingFiles || !App::isPairing())
			return;
		App::saveChannel(data[0]);
		App::saveMaster(MeshRC::sender);
		App::setMode(App::SHOW);
	});

	MeshRC::on("#>FILE^", [](u8* data, u8 size) {
		// if (!App::isPaired()) return;
		if (receivingFiles) return;
		if (MeshRC::equals(data, (u8*)App::chipID, 6) || MeshRC::equals(data, broadcastWildCard, 6)) {
			receivingFiles = true;
			LOGD("My file\n");
			LED::end();
			App::startBlink(50);
			name = "";
			crc = 0x00;
			for (auto i = 6; i < size; i++) {
				name.concat((const char)data[i]);
			}
			if (file)
				file.close();
			file = App::fs->open(tmpName, "w");
			file.write((const char*)0);
			file.seek(0);
			if (!file) {
				LOGL(F("CREATE FAILED"));
				receivingFiles = false;
			} else {
				LOGD("\nReceiving file: %s\n", name.c_str());
			}
		}
	});

	static bool savingSegment = false;
	MeshRC::on("#>FILE+", [](u8* data, u8 size) {
		// if (!App::isPaired()) return;
		if (savingSegment) return;
		savingSegment = true;
		if (file) {
			u32 tmr = millis();
			u16 pos = data[0] << 8 | data[1];
			LOGD("%04X :: %u bytes :: ", pos, size);
			for (auto i = 2; i < size; i++) {
				crc += data[i];
				file.write(data[i]);
				// LOGD("%02X ", data[i]);
			}
			LOG(millis() - tmr);
			LOGL(" ms");
		}
		savingSegment = false;
	});

	MeshRC::on("#>FILE$", [](u8* data, u8 size) {
		// if (!App::isPaired()) return;
		if (!receivingFiles) return;
		receivingFiles = false;
		if (file) {
			App::stopBlink();
			LOGD("%02X %02X\n", crc, data[0]);
			file.close();
			if (data[0] == crc) {
				if (App::fs->exists(name)) {
					App::fs->remove(name);
				}
				App::fs->rename(tmpName, name);
				if (App::fs->exists(tmpName)) {
					App::fs->remove(tmpName);
				}
			}		
			LOGL("EOF.\n");
		}
	});
	MeshRC::begin();
}

void loop() {
	// MDNS.update();
	ArduinoOTA.handle();
	if (shouldSendSync) {
		sendSync();
		LOGD("Sync sent.\n");
		shouldSendSync = false;
	}
	if (shouldSendAllShow) {
		LED::end();
		sendDir("/show");
		shouldSendAllShow = false;
	}
	if (shouldSendCurrentShow) {
		LED::end();
		sendFile("/show/1A.lsb");
		sendFile("/show/1B.lsb");
		shouldSendCurrentShow = false;
	}
}
}  // namespace Net

#endif
