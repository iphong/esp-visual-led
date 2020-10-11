#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
// #include <WiFiServer.h>
#include <MeshRC.h>
// #include <ESP8266mDNS.h>
// #include <DNSServer.h>
// #include <WiFiUdp.h>
#include "led.h"
#include "sd.h"

#ifndef __NET_H__
#define __NET_H__

namespace Net {

#ifdef MASTER
WebSocketsServer webSocket(81);
#endif

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

struct SyncState {
	u8 show;
	u8 running;
	u8 paused;
	u32 time;
};
bool equals(u8* a, u8* b, u8 size, u8 offset = 0) {
	for (auto i = offset; i < offset + size; i++)
		if (a[i] != b[i])
			return false;
	return true;
}
u32 readUint32(unsigned char* buffer) {
	return (u32)(buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3]);
}
u16 readUint16(unsigned char* buffer) {
	return (u16)buffer[0] << 8 | buffer[1];
}
u8* setUint16(u8* buffer, u16 value, size_t offset = 0) {
	buffer[offset + 1] = value & 0xff;
	buffer[offset + 0] = (value >> 8);
	return &buffer[offset + 2];
}
u8* setUint32(u8* buffer, u16 value, size_t offset = 0) {
	buffer[offset + 3] = (value & 0x000000ff);
	buffer[offset + 2] = (value & 0x0000ff00) >> 8;
	buffer[offset + 1] = (value & 0x00ff0000) >> 16;
	buffer[offset + 0] = (value & 0xff000000) >> 24;
	return &buffer[offset + 4];
}
void recvSync(u8* data, u8 size) {
#ifndef MASTER
	if (!receivingFiles && !App::isPairing()) {
		SyncState state;
		state.show = data[0];
		state.running = data[1];
		state.paused = data[2];
		state.time = readUint32(&data[3]);
#ifdef SYNC_LOGS
		LOGD("Sync received: show=%u running=%i paused=%i sync=%u play=%u diff=%i\n", state.show, state.running, state.paused, state.time, LED::getTime(), LED::getTime() - state.time);
#endif
		if (state.show == 0 && App::data.show != 0) {
			LED::end();
			LED::begin();
		}
		App::data.show = state.show;
		if (state.show > 0) {
			if (LED::isRunning() && !state.running) {
				LED::end();
			} else if (!LED::isRunning() && state.running) {
				LED::begin();
			} else if (state.paused && !LED::isPaused()) {
				LED::pause();
			} else if (!state.paused && LED::isPaused()) {
				LED::resume();
			}
			if (!state.paused) {
				LED::setTime(state.time);
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
#ifdef MASTER
	MeshRC::send("#>PING");
#else
	u8 data[30];
	memcpy(&data[0], App::chipID, 6);
	data[7] = 2;
	setUint16(&data[8], ESP.getVcc());
	memcpy(&data[10], App::data.name, 20);
	MeshRC::send("#<PING", data, 30);
	LOGL("sent ping");
#endif
}
void recvPing(u8* data, u8 size) {
#ifdef MASTER
	NodeInfo n;
	memcpy(&n.id, &data[0], 6);
	n.type = data[7];
	n.vbat = readUint16(&data[8]);
	memcpy(&n.name, &data[10], 20);
	bool isNew = true;
	int i = 0;
	for (auto node : nodesList) {
		if (equals((u8*)n.id, (u8*)node.id, 6)) {
			isNew = false;
			nodesList[i] = n;
		}
		i++;
	}
	if (isNew) {
		nodesList[nodesCount++] = n;
	}
	LOG("received ping:");
	LOG(n.type);
	LOGL();
#else
	sendPing();
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
#ifdef USE_SD_CARD
	LOGD("send file: %s -- ", path.c_str());
	if (!SD::fs.exists(path.c_str())) {
		LOGD("NOT EXISTS\n");
		return;
	}
	sendingFiles = true;
	App::LED_LOW();
	LOGD("OK\n");
	SD::open(path);
#else
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
#endif
	crc = 0x00;
	// delayTime = 105;
	for (auto i = 0; i < 1; i++) {
#ifdef USE_SD_CARD
		MeshRC::send("#>FILE^" + targetID + path);
#else
		MeshRC::send("#>FILE^" + targetID + String(file.fullName()));
#endif
		waitDelay(500);
	}
#ifdef USE_SD_CARD
	while (SD::file.available()) {
		u16 pos = SD::file.position();
		u8 len = _min(240, SD::file.available());
		u8 data[len + 2];
		data[0] = pos >> 8;
		data[1] = pos & 0xff;
#ifdef SEND_FILE_LOGS
		LOGD("%04X :: ", pos);
#endif
		for (auto i = 0; i < len; i++) {
			data[i + 2] = SD::file.read();
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

	SD::file.close();
	for (auto i = 0; i < 1; i++) {
		MeshRC::send("#>FILE$" + String((const char)crc));
		waitDelay(500);
	}
#else
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
#endif
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

void restart() {
	ESP.restart();
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
#ifdef MASTER
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
		case WStype_PING:
		case WStype_PONG:
			break;
	}
}
#endif

void setName(u8* buf, u8 len) {
	if (MeshRC::equals(&buf[0], (u8*)App::chipID, 6)) {
		memset(App::data.name, 0, 20);
		memcpy(App::data.name, &buf[6], len - 6);
		App::save();
	}
}
void setAlpha(u8* buf, u8 len) {
	if (len == 7 && MeshRC::equals(&buf[0], (u8*)App::chipID, 6)) {
		App::data.brightness = buf[6];
		App::save();
	} else if (len == 1) {
		App::data.brightness = buf[0];
		App::save();
	}
}
void setColor(u8* buf, u8 len) {
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

#ifdef MASTER
void handleAll(u8* data, u8 size) {
	for (u8 i = 0; i < 8; i++) {
		webSocket.sendBIN(i, data, size);
	}
}
#endif

void setup() {
	WiFi.mode(WIFI_AP_STA);
	WiFi.setAutoConnect(false);
	WiFi.setAutoReconnect(false);
	WiFi.disconnect();

	WiFi.softAPConfig(apAddr, apAddr, apMask);

	ArduinoOTA.onProgress([](int percent, int total) { App::LED_BLINK(); });
	ArduinoOTA.begin();

#ifdef MASTER
	webSocket.begin();
	webSocket.onEvent(webSocketEvent);

	MeshRC::on("#<PING", Net::recvPing);
	MeshRC::on("#<RESET", Net::restart);
	MeshRC::on("#<WIFI:ON", Net::wifiOn);
	MeshRC::on("#<WIFI:OFF", Net::wifiOff);
	MeshRC::on("", Net::handleAll);
#else
	MeshRC::on("#>BLINK", Net::recvBlink);
	MeshRC::on("#>PING", Net::recvPing);
	MeshRC::on("#>SYNC", Net::recvSync);
	MeshRC::on("#>PAIR", Net::recvPair);
	MeshRC::on("#>FILE", Net::recvFile);

	MeshRC::on("#>NAME", Net::setName);
	MeshRC::on("#>COLOR", Net::setColor);
	MeshRC::on("#>ALPHA", Net::setAlpha);

	MeshRC::on("#>SHOW:START", LED::begin);
	MeshRC::on("#>SHOW:BEGIN", LED::begin);
	MeshRC::on("#>SHOW:PAUSE", LED::pause);
	MeshRC::on("#>SHOW:RESUME", LED::resume);
	MeshRC::on("#>SHOW:TOGGLE", LED::toggle);
	MeshRC::on("#>SHOW:STOP", LED::end);
	MeshRC::on("#>SHOW:END", LED::end);

	MeshRC::on("#>RESET", restart);
	MeshRC::on("#>WIFI:ON", Net::wifiOn);
	MeshRC::on("#>WIFI:OFF", Net::wifiOff);
#endif
	MeshRC::begin();
}

void loop() {
	ArduinoOTA.handle();
#ifdef MASTER
	webSocket.loop();
#endif
}
}  // namespace Net

#endif
