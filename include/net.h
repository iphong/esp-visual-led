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

Ticker timeSyncInterrupt;

bool receivingFiles;
bool sendingFiles;
bool IS_WIFI_ON = false;

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

void wifiOn() {
	IS_WIFI_ON = true;
	WiFi.mode(WIFI_AP_STA);
	WiFi.softAPConfig(apAddr, apAddr, apMask);
	WiFi.softAP(apSSID, apPSK, 0, 0, 8);
}

void wifiOff() {
	IS_WIFI_ON = false;
	WiFi.softAPdisconnect();
}
void wifiToggle() {
	!IS_WIFI_ON ? wifiOn() : wifiOff();
}

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
	if (!sendingFiles && !App::isPairing()) {
		SyncData tmp = {
			LED::getTime(),
			App::data.show,
			App::data.brightness,
			LED::paused,
			LED::ended};
		memcpy(syncBuffer, &tmp, sizeof(tmp));
		MeshRC::send("#>SYNC", syncBuffer, sizeof(tmp));
		MeshRC::wait();
	}
#endif
}
void recvSync(u8* data, u8 size) {
#ifndef MASTER
	if (!receivingFiles && !App::isPairing()) {
		SyncData tmp;
		memcpy(&tmp, data, size);
		LOGD("Sync received: %u %i %i %u\n", tmp.show, tmp.ended, tmp.paused,
			 tmp.time);
		if (tmp.show == 0 && App::data.show != 0) {
			LED::end();
		}
		App::data.show = tmp.show;
		if (tmp.show > 0) {
			if (tmp.ended) {
				LED::end();
			} else if (tmp.paused) {
				LED::pause();
			} else {
				LED::resume();
				LED::setTime(tmp.time);
			}
		}
	}
#endif
}
NodeInfo nodesList[255];
size_t nodesCount = 0;
void sendPing() {
	LOGL("sent ping");
	MeshRC::send("#>PING");
}
void recvPing() {
	LOGL("received ping");
	MeshRC::send("#>PONG" + String(App::chipID));
}
void recvPong(u8* data, u8 size) {
	LOGL("received pong");
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

void sendPair(u8 channel = 255) {
	if (channel != 255) {
		LOGD("Sending pair with channel: %u\n", channel);
		MeshRC::send("#>PAIR", &channel, 1);
	} else {
		LOGD("Sending pair without channel\n");
		MeshRC::send("#>PAIR");
	}
}

void recvPair(u8* data, u8 size) {
	if (App::isPairing() && !receivingFiles) {
		App::stopBlink();
		if (size >= 1) App::saveChannel(data[0]);
		App::saveMaster(MeshRC::sender);
		App::setMode(App::SHOW);
		App::lED_LOW();
	}
}

void waitDelay(u32 time) {
	static u32 delayUntil;
	while (MeshRC::sending)
		yield();  // Wait while sending
	delayUntil = millis() + time;
	while (millis() < delayUntil)
		yield();
}

void sendFile(String path, String targetID = "******") {
	LOGD("send file: %s -- ", path.c_str());
	if (!App::fs->exists(path)) {
		LOGD("NOT EXISTS\n");
		return;
	}
	sendingFiles = true;
	App::lED_LOW();
	LOGD("OK\n");
	file = App::fs->open(path, "r");
	crc = 0x00;
	for (auto i = 0; i < 1; i++) {
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
		for (auto i = 0; i < 1; i++) {
			MeshRC::send("#>FILE+", data, sizeof(data));
			App::lED_BLINK();
			waitDelay(100);
		}
	}

	file.close();
	for (auto i = 0; i < 1; i++) {
		MeshRC::send("#>FILE$" + String((const char)crc));
		waitDelay(500);
	}
	App::lED_HIGH();
	LOGD("Sent\n\n");
	sendingFiles = false;
}

void sendDir(String path) {
	LOGD("Send DIR: %s\n", path.c_str());
	dir = App::fs->openDir(path);
	while (dir.next()) {
		if (dir.isFile()) {
			sendFile(path + "/" + dir.fileName());
		} else if (dir.isDirectory() && dir.fileName() != "." && dir.fileName() != "..") {
			sendDir(path + "/" + dir.fileName());
		}
	}
}

void recvFile(u8* buf, u8 len) {
	if (!App::isPaired()) return;
	char type = buf[0];
	u8* data = &buf[1];
	u8 size = len - 1;
	switch (type) {
		// FILE STREAM HEADER
		case '^':
			if (MeshRC::equals(data, (u8*)App::chipID, 6) || MeshRC::equals(data, broadcastWildCard, 6)) {
				receivingFiles = true;
				LOGD("My file\n");
				LED::end();
				App::stopBlink();
				App::lED_LOW();
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
					LOGD("\nreceiving file: %s\n", name.c_str());
				}
			}
			break;

		// FILE STREAM DATA
		case '+':
			if (file) {
				App::lED_BLINK();
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
			} else {
				receivingFiles = false;
			}
			break;

		// FILE STREAM END
		case '$':
			if (receivingFiles && file) {
				App::lED_LOW();
				LOGD("EOF %02X = %02X\n", crc, data[0]);
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
			}
			receivingFiles = false;
			break;
		default:
			break;
	}
}

void handleRestartMsg() {
	ESP.restart();
}

void handleWifiMsg(u8* data, u8 size) {
	if (size) {
		u8 turnOn = data[0];
		if (turnOn)
			wifiOn();
		else
			wifiOff();
	}
}

bool callbackOnConnect = false;
struct WiFiConnection {
	String ssid;
	String pass;
};
void sendWiFiConnection(String ssid, String pass) {
	WiFiConnection msg = {ssid, pass};
	u8 buffer[sizeof(msg)];
	memcpy(buffer, &msg, sizeof(msg));
	MeshRC::send("$>WIFI+", buffer, sizeof(msg));
}
void recvWiFiConnection(u8* data, u8 size) {
	WiFiConnection conn;
	memcpy(&conn, data, size);
	WiFi.begin(conn.ssid, conn.pass);
	callbackOnConnect = true;
};

void setup() {
	MeshRC::on("$>WIFI+", recvWiFiConnection);
	MeshRC::on("$>WIFI-", []() { WiFi.disconnect(); });

	MeshRC::on("#>PING", Net::recvPing);
	MeshRC::on("#>PONG", Net::recvPong);
	MeshRC::on("#>SYNC", Net::recvSync);
	MeshRC::on("#>PAIR", Net::recvPair);
	MeshRC::on("#>FILE", Net::recvFile);

	MeshRC::on("#>RESTART", handleRestartMsg);
	MeshRC::on("#>WIFI", handleWifiMsg);

	MeshRC::on("#>BEGIN", LED::begin);
	MeshRC::on("#>PAUSE", LED::pause);
	MeshRC::on("#>RESUME", LED::resume);
	MeshRC::on("#>TOGGLE", LED::toggle);
	MeshRC::on("#>END", LED::end);

	MeshRC::begin();
#ifdef MASTER
	timeSyncInterrupt.attach_ms_scheduled_accurate(1000, sendSync);
#endif
}

void loop() {
	if (callbackOnConnect && WiFi.status() == WL_CONNECTED) {
		MeshRC::send("$<WIFI+" + WiFi.localIP().toString());
		callbackOnConnect = false;
	}
}
}  // namespace Net

#endif
