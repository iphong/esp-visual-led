#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
// #include <WiFiServer.h>
#include <MeshRC.h>
// #include <ESP8266mDNS.h>
// #include <DNSServer.h>
// #include <WiFiUdp.h>
#include "led.h"

#ifndef __NET_H__
#define __NET_H__

namespace Net {

WebSocketsServer webSocket(81);

Ticker timeSyncInterrupt;
Ticker nodePingInterrupt;

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
	WiFi.softAP(apSSID, apPSK, 0, 0, 8);
	WiFi.softAPConfig(apAddr, apAddr, apMask);
}

void wifiOff() {
	IS_WIFI_ON = false;
	WiFi.softAPdisconnect();
}
void wifiToggle() {
	!IS_WIFI_ON ? wifiOn() : wifiOff();
}

struct SyncData {
	u8 show;
	u32 time;
	bool running;
	bool paused;
};
u8 syncBuffer[32];
void sendSync() {
#ifdef MASTER
	if (!sendingFiles && !App::isPairing()) {
		SyncData tmp = {
			App::data.show,
			LED::getTime(),
			LED::running,
			LED::paused};
		memcpy(syncBuffer, &tmp, sizeof(tmp));
		MeshRC::send("#>SYNC", syncBuffer, sizeof(tmp));
		MeshRC::wait();
#ifdef SYNC_LOGS
		LOGD("Sync sent: show=%u running=%i paused=%i sync=%u play=%u\n", tmp.show, tmp.running, tmp.paused, tmp.time, LED::getTime());
#endif
	}
#endif
}
void recvSync(u8* data, u8 size) {
#ifndef MASTER
	if (!receivingFiles && !App::isPairing()) {
		SyncData tmp;
		memcpy(&tmp, data, size);
#ifdef SYNC_LOGS
		LOGD("Sync received: show=%u running=%i paused=%i sync=%u play=%u diff=%i\n", tmp.show, tmp.running, tmp.paused, tmp.time, LED::getTime(), LED::getTime() - tmp.time);
#endif
		if (tmp.show == 0 && App::data.show != 0) {
			LED::end();
			LED::begin();
		}
		App::data.show = tmp.show;
		if (tmp.show > 0) {
			if (LED::isRunning() && !tmp.running) {
				LED::end();
			} else if (!LED::isRunning() && tmp.running) {
				LED::begin();
			} else if (tmp.paused && !LED::isPaused()) {
				LED::pause();
			} else if (!tmp.paused && LED::isPaused()) {
				LED::resume();
			}
			if (tmp.running && !tmp.paused) {
				LED::setTime(tmp.time);
			}
		}
	}
#endif
}
struct NodeInfo {
	char id[6];
	u8 type;
	u16 vbat;
	char name[20];
};
NodeInfo nodesList[255];
size_t nodesCount = 0;

void sendPing() {
	LOGL("sent ping");
#ifdef MASTER
	MeshRC::send("#>PING");
#else
	NodeInfo n;
	memcpy(n.id, App::chipID, 6);
	memcpy(n.name, App::data.name, 20);
	n.type = 2;
	n.vbat = ESP.getVcc();
	u8 buf[sizeof(n)];
	memcpy(buf, &n, sizeof(n));
	MeshRC::send("#<PING", buf, sizeof(n));
#endif
}
void recvPing(u8* data, u8 size) {
	LOGL("received ping");
#ifdef MASTER
	if (size) {
		NodeInfo n;
		memcpy(&n, data, size);
		bool isNew = true;
		int i = 0;
		for (auto node : nodesList) {
			if (MeshRC::equals((u8*)n.id, (u8*)node.id, 6)) {
				isNew = false;
				nodesList[i] = n;
			}
			i++;
		}
		if (isNew) {
			nodesList[nodesCount++] = n;
		}
	}
#else
	if (!size) {
		sendPing();
	}
#endif
}

void sendPair() {
	LOGD("Sending pair without channel\n");
	MeshRC::send("#>PAIR");
}

void recvPair() {
	if (App::isPairing() && !receivingFiles) {
		App::stopBlink();
		App::setMaster(MeshRC::sender);
		App::setMode(App::SHOW);
		App::save();
		App::LED_LOW();
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
	// static u8 delayTime;
	LOGD("send file: %s -- ", path.c_str());
	if (!App::fs->exists(path)) {
		LOGD("NOT EXISTS\n");
		return;
	}
	sendingFiles = true;
	App::LED_LOW();
	LOGD("OK\n");
	file = App::fs->open(path, "r");
	crc = 0x00;
	// delayTime = 105;
	for (auto i = 0; i < 1; i++) {
		MeshRC::send("#>FILE^" + targetID + String(file.fullName()));
		waitDelay(500);
	}
	while (file.available()) {
		u16 pos = file.position();
		u8 len = _min(240, file.available());
		u8 data[len + 2];
		data[0] = pos >> 8;
		data[1] = pos & 0xff;
#ifdef SEND_FILE_LOGS
		LOGD("%04X :: ", pos);
#endif
		for (auto i = 0; i < len; i++) {
			data[i + 2] = file.read();
			crc += data[i + 2];
#ifdef SEND_FILE_LOGS
			LOGD("%02X ", data[i + 2]);
#endif
		}
#ifdef SEND_FILE_LOGS
		LOGD("\n");
#endif

		for (auto i = 0; i < 1; i++) {
			MeshRC::send("#>FILE+", data, sizeof(data));
			App::LED_BLINK();
			// if (delayTime > 5) delayTime -= 10;
			waitDelay(100);
		}
	}

	file.close();
	for (auto i = 0; i < 1; i++) {
		MeshRC::send("#>FILE$" + String((const char)crc));
		waitDelay(500);
	}
	App::LED_HIGH();
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
	u32 tmr = millis();
	switch (type) {
		// FILE STREAM HEADER
		case '^':
			if (MeshRC::equals(data, (u8*)App::chipID, 6) || MeshRC::equals(data, broadcastWildCard, 6)) {
				receivingFiles = true;
				LED::end();
				// wifiOff();
				// WiFi.disconnect();
				// App::stopBlink();
				App::LED_LOW();
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
					LOG(F("CREATE FAILED - "));
					receivingFiles = false;
				} else {
					LOGD("receiving file: %s - ", name.c_str());
				}
				LOG(millis() - tmr);
				LOGL(" us");
			}
			break;

		// FILE STREAM DATA
		case '+':
			if (file) {
				App::LED_BLINK();
				u16 pos = data[0] << 8 | data[1];
				u16 pos2 = file.position();
#ifdef RECV_FILE_LOGS
				LOGD("%04X %04X :: %u bytes :: ", pos, pos2, size);
#endif
				for (auto i = 2; i < size; i++) {
					crc += data[i];
					file.write(data[i]);
					// LOGD("%02X ", data[i]);
				}
#ifdef RECV_FILE_LOGS
				LOG(millis() - tmr);
				LOGL(" us");
#endif
			} else {
				receivingFiles = false;
			}
			break;

		// FILE STREAM END
		case '$':
			if (receivingFiles && file) {
				// wifiOn();
				App::LED_HIGH();
				LOGD("EOF %02X = %02X - ", crc, data[0]);
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
				LOG(millis() - tmr);
				LOGL(" us");
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

struct WiFiConnection {
	String ssid;
	String pass;
};
void recvWiFiConnect(u8* data, u8 size) {
	WiFiConnection conn;
	memcpy(&conn, data, size);
	WiFi.begin(conn.ssid, conn.pass);
	wifiOn();
}
void recvBlink(u8* data, u8 size) {
	char action = data[0];
	char speed = data[1];
	u8* id = &data[2];
	if (size > 2 && !MeshRC::equals(id, (u8*)App::chipID, size)) {
		return;
	}
	if (action == '+') {
		App::startBlink(String(speed).toInt() * 100);
	} else if (action == '-') {
		App::stopBlink();
	} else {
		App::toggleBlink(String(speed).toInt() * 100);
	}
}
void parseCommand(String hex) {
	int i;
	int len = hex.length();
	String byte;
	String message = "#>";
	String id;
	if (hex[0] == ':') {
		for (i = 1; i < len; i += 2) {
			byte = hex.substring(i, 2);
			message += (char)(int)strtol(byte.c_str(), NULL, 16);
		}
	} else if (hex[3] == ':') {
		id = hex.substring(0, 6);
		for (i = 4; i < len; i += 2) {
			byte = hex.substring(i, 2);
			message += (char)(int)strtol(byte.c_str(), NULL, 16);
		}
	}
	LOGL(message);
	MeshRC::send(message);
}
bool activeSockets[8];
void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
	switch (type) {
		case WStype_DISCONNECTED:
			LOGD("[%u] Disconnected!\n", num);
			if (num < 8) activeSockets[num] = false;
			break;
		case WStype_CONNECTED: {
			IPAddress ip = webSocket.remoteIP(num);
			if (num < 8) activeSockets[num] = true;
			LOGD("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
		} break;
		case WStype_TEXT:
			LOGD("[%u] get Text: %s\n", num, payload);
			if (payload[0] == '#') {
				if (payload[1] == '<') MeshRC::recvHandler(NULL, payload, length);
				if (payload[1] == '>') MeshRC::send(payload, length);
			}
			break;
		case WStype_BIN:
			LOGD("[%u] get binary length: %u\n", num, length);
			if (payload[0] == '#') {
				if (payload[1] == '<') MeshRC::recvHandler(NULL, payload, length);
				if (payload[1] == '>') MeshRC::send(payload, length);
			}
			break;
		case WStype_ERROR:
		case WStype_FRAGMENT_TEXT_START:
		case WStype_FRAGMENT_BIN_START:
		case WStype_FRAGMENT:
		case WStype_FRAGMENT_FIN:
			break;
	}
}

void setName(u8* buf, u8 len) {
	if (MeshRC::equals(&buf[0], (u8*)App::chipID, 6)) {
		memset(App::data.name, 0, 20);
		memcpy(App::data.name, &buf[6], len - 6);
		App::save();
	}
}
void setBrightness(u8* buf, u8 len) {
	if (len == 7 && MeshRC::equals(&buf[0], (u8*)App::chipID, 6)) {
		App::data.brightness = buf[6];
		App::save();
	} else if (len == 1) {
		App::data.brightness = buf[0];
		App::save();
	}
}
void setRGB(u8* buf, u8 len) {
	u8* color;
	char segment;
	if (len == 10)
		if (!MeshRC::equals(&buf[0], (u8*)App::chipID, 6))
			return;
		else {
			segment = (char)buf[6];
			color = &buf[7];
		}
	else if (len == 4) {
		segment = (char)buf[0];
		color = &buf[1];
	}
	App::data.show = 0;
	if (segment == 'A' || segment == '0') {
		LED::A.setRGB(color[0], color[1], color[2]);
	} else if (segment == 'B' || segment == '1') {
		LED::B.setRGB(color[0], color[1], color[2]);
	}
}

void handleAll(u8* data, u8 size) {
	for (u8 i = 0; i < 8; i++) {
		webSocket.sendBIN(i, data, size);
	}
}

void setup() {
	WiFi.mode(WIFI_AP_STA);
	WiFi.setAutoConnect(false);
	WiFi.setAutoReconnect(false);
	WiFi.disconnect();

	WiFi.softAPConfig(apAddr, apAddr, apMask);

	ArduinoOTA.onProgress([](int percent, int total) { App::LED_BLINK(); });
	ArduinoOTA.begin();

	webSocket.begin();
	webSocket.onEvent(webSocketEvent);

	MeshRC::on("#>BLINK", Net::recvBlink);
	MeshRC::on("#<BLINK", Net::recvBlink);

#ifdef MASTER
	MeshRC::on("#<PING", Net::recvPing);
#else
	MeshRC::on("#>PING", Net::recvPing);
#endif

	MeshRC::on("#>SYNC", Net::recvSync);
	MeshRC::on("#>PAIR", Net::recvPair);

	MeshRC::on("#>FILE", Net::recvFile);

	MeshRC::on("#>RESTART", handleRestartMsg);

	MeshRC::on("#>WIFI:AP:ON", Net::wifiOn);
	MeshRC::on("#>WIFI:AP:OFF", Net::wifiOff);
	MeshRC::on("$>WIFI:STA:ON", Net::recvWiFiConnect);
	MeshRC::on("$>WIFI:STA:OFF", []() { WiFi.disconnect(); });

	MeshRC::on("#>SHOW:START", LED::begin);
	MeshRC::on("#>SHOW:BEGIN", LED::begin);
	MeshRC::on("#>SHOW:PAUSE", LED::pause);
	MeshRC::on("#>SHOW:RESUME", LED::resume);
	MeshRC::on("#>SHOW:TOGGLE", LED::toggle);
	MeshRC::on("#>SHOW:STOP", LED::end);
	MeshRC::on("#>SHOW:END", LED::end);

	MeshRC::on("#>NAME", Net::setName);
	MeshRC::on("#>BRIGHT", Net::setBrightness);
	MeshRC::on("#>RGB:", Net::setRGB);
	MeshRC::on("", Net::handleAll);
	MeshRC::begin();
#ifdef MASTER
	timeSyncInterrupt.attach_ms_scheduled_accurate(100, sendSync);
#endif
}

void loop() {
	ArduinoOTA.handle();
	webSocket.loop();
}
}  // namespace Net

#endif
