#include "app.h"
#include "def.h"
#include "led.h"
#include "sd.h"
#include "transport.h"

#ifndef __NET_H__
#define __NET_H__

namespace Net {

// SoftwareSerial ss(12, 13);
// Transport _transports[2] = {&Serial, &ss};

Transport t1(&Serial);

#ifdef MASTER
WebSocketsServer webSocket(81);
#else
Ticker pingTimer;
#endif

bool receivingFiles;
bool sendingFiles;
bool fsReplyOK;
bool IS_WIFI_ON;

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
	WiFi.softAPConfig(apAddr, apAddr, apMask);
	WiFi.softAP(apSSID, apPSK, 1, 0, 4);
}

void wifiOff() {
	IS_WIFI_ON = false;
	WiFi.softAPdisconnect();
}
void wifiToggle() {
	!IS_WIFI_ON ? wifiOn() : wifiOff();
}
void recvSync(u8* data, u8 size) {
#ifndef MASTER
	if (!receivingFiles && !App::isPairing()) {
		SyncData state;
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
PingData nodesList[255];
size_t nodesCount = 0;

void sendPing() {
#ifdef MASTER
	MeshRC::send(F("#>PING"));
#else
	size_t size = sizeof(App::data.name) + 3;
	u8 data[size];
	data[0] = 2;
	setUint16(&data[1], ESP.getVcc());
	memcpy(&data[3], App::data.name, sizeof(App::data.name));
	MeshRC::send(String(App::chipID) + "<PING", data, size);
	LOGL(F("sent ping"));
#endif
}
void recvPing(u8* data, u8 size) {
#ifdef MASTER
	PingData n;
	memcpy(&n.id, &data[0], 6);
	n.type = data[7];
	n.vbat = readUint16(&data[8]);
	n.lastUpdate = millis();
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
	LOG(F("received ping:"));
	LOG(n.type);
	LOGL();
#else
	sendPing();
#endif
}

void recvPair() {
	if (App::isPairing() && !receivingFiles) {
		App::stopBlink();
		App::setMaster(MeshRC::sender);
		App::setMode(MODE_SHOW);
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

void sendFile2(String path, String target = "#") {
	File file = LittleFS.open(path, "r");
	MeshRC::send(target + ">FS1" + path);
	MeshRC::wait();
	MeshRC::delayMs(5);
	while (file.available()) {
		// u16 pos = file.position();
		u8 len = _min(16, file.available());
		u8 data[len];
		for (auto i = 0; i < len; i++) {
			data[i] = file.read();
		}
		MeshRC::send(target + ">FS2", data, len);
		MeshRC::wait();
		MeshRC::delayMs(5);
	}
	MeshRC::send(target + ">FS3");
	MeshRC::wait();
	MeshRC::delayMs(1);
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
	LOG(F("OK\n"));
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
	LOG(F("OK\n"));
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
	LOG(F("Sent\n\n"));
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
	// if (!App::isPaired()) return;
	char type = buf[0];
	u8* data = &buf[1];
	u8 size = len - 1;
	u32 timer = millis();
	switch (type) {
		// FILE STREAM HEADER
		case '^':
			if (MeshRC::equals(data, (u8*)App::chipID, 6) || MeshRC::equals(data, broadcastWildCard, 6)) {
				receivingFiles = true;
				LED::end();
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
#ifdef RECV_FILE_LOGS
				if (!file) {
					LOG(F("CREATE FAILED - "));
				} else {
					LOGD("receiving file: %s - ", name.c_str());
				}
				LOGL(F(" us"));
				LOG(millis() - timer);
#else
				if (!file)
					receivingFiles = false;
#endif
			}
			break;

		// FILE STREAM DATA
		case '+':
			if (file) {
				App::LED_BLINK();
#ifdef RECV_FILE_LOGS
				u16 pos = data[0] << 8 | data[1];
				u16 pos2 = file.position();
				LOGD("%04X %04X :: %u bytes :: ", pos, pos2, size);
#endif
				for (auto i = 2; i < size; i++) {
					crc += data[i];
					file.write(data[i]);
#ifdef RECV_FILE_LOGS
					LOGD("%02X ", data[i]);
				}
				LOG(millis() - timer);
				LOGL(F(" us"));
#else
				}
#endif
			} else {
				receivingFiles = false;
			}
			break;

		// FILE STREAM END
		case '$':
			if (receivingFiles && file) {
				App::LED_HIGH();
#ifdef RECV_FILE_LOGS
				LOGD("EOF %02X = %02X - ", crc, data[0]);
#endif
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
#ifdef RECV_FILE_LOGS
				LOG(millis() - timer);
				LOGL(F(" us"));
#endif
			}
			receivingFiles = false;
			break;
		default:
			break;
	}
}  // namespace Net

void restart() {
	ESP.restart();
}
void recvBlink(u8* data, u8 size) {
	if (!size) {
		App::toggleBlink(200);
	} else if (size == 1) {
		// App::toggleBlink(data[0] * 10);
		data[0] ? App::startBlink(data[0] * 10) : App::stopBlink();
	} else if (size == 2) {
		// App::toggleBlink(data[0] * 10, data[1]);
		data[0] ? App::startBlink(data[0] * 10, data[1]) : App::stopBlink();
	}
}
#ifdef MASTER
bool activeSockets[8];
void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
	switch (type) {
		case WStype_DISCONNECTED:
			LOGD("WS[%u] Disconnected!\n", num);
			if (num < 8) activeSockets[num] = false;
			break;
		case WStype_CONNECTED: {
			IPAddress ip = webSocket.remoteIP(num);
			if (num < 8) activeSockets[num] = true;
			LOGD("WS[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
		} break;
		case WStype_TEXT:
		case WStype_BIN:
			LOGD("WS[%u] >> %s\n", num, payload);
			if (payload[0] == '#') {
				if (payload[1] == '<') MeshRC::recvHandler(NULL, payload, length);
				if (payload[1] == '>') MeshRC::send(payload, length);
			} else {
				MeshRC::send(payload, length);
			}
			// for (auto x = 0; x < 2; x++) {
			// 	_transports[x].send(payload, length);
			// }
			break;
		case WStype_ERROR:
		case WStype_FRAGMENT_TEXT_START:
		case WStype_FRAGMENT_BIN_START:
		case WStype_FRAGMENT:
		case WStype_FRAGMENT_FIN:
		case WStype_PING:
		case WStype_PONG:
			break;
	}
}
#endif

void setName(u8* buf, u8 len) {
	memset(App::data.name, 0, 20);
	memcpy(App::data.name, buf, len);
	App::save();
}
void setAlpha(u8* buf, u8 len) {
	App::data.brightness = buf[0];
	App::save();
}
void setColor(u8* buf, u8 len) {
	char segment = buf[0];
	u8 r = buf[1];
	u8 g = buf[2];
	u8 b = buf[3];
	if (segment == 'A' || segment == '*') LED::A.setRGB(r, g, b);
	if (segment == 'B' || segment == '*') LED::B.setRGB(r, g, b);
}

void setup() {
	// ss.begin(9600);
	ArduinoOTA.onProgress([](int percent, int total) {
		App::led_pin = R1_PIN;
		App::LED_BLINK();
	});
	ArduinoOTA.begin();
// 	for (auto i = 0; i < 2; i++) {
// 		_transports[i].receive([i](u8* data, u8 size) {
// 			MeshRC::send(data, size);
// 			for (auto x = 0; x < 2; x++) {
// 				if (i != x) {
// 					_transports[x].send(data, size);
// 				}
// 			}
// #ifdef MASTER
// 			for (u8 i = 0; i < 8; i++) {
// 				webSocket.sendBIN(i, data, size);
// 			}
// #endif
// 		});
// 	}

#ifdef MASTER
	webSocket.begin();
	webSocket.onEvent(webSocketEvent);

	MeshRC::on("#<PING", Net::recvPing);
	MeshRC::on("#<RESET", Net::restart);
	MeshRC::on("#<WIFI:ON", Net::wifiOn);
	MeshRC::on("#<WIFI:OFF", Net::wifiOff);
#else
	pingTimer.attach_ms_scheduled_accurate(10000, Net::sendPing);

	MeshRC::on("#>BLINK", Net::recvBlink);
	MeshRC::on("#>PING", Net::recvPing);
	MeshRC::on("#>SYNC", Net::recvSync);
	MeshRC::on("#>PAIR", Net::recvPair);
	MeshRC::on("#>FILE", Net::recvFile);

	MeshRC::on("#>NAME", Net::setName);
	MeshRC::on("#>SET", Net::setColor);
	MeshRC::on("#>DIM", Net::setAlpha);

	MeshRC::on("#>START", LED::begin);
	MeshRC::on("#>BEGIN", LED::begin);
	MeshRC::on("#>PAUSE", LED::pause);
	MeshRC::on("#>RESUME", LED::resume);
	MeshRC::on("#>TOGGLE", LED::toggle);
	MeshRC::on("#>STOP", LED::end);
	MeshRC::on("#>END", LED::end);

	MeshRC::on("#>RESET", Net::restart);
	MeshRC::on("#>WIFI:ON", Net::wifiOn);
	MeshRC::on("#>WIFI:OFF", Net::wifiOff);

	MeshRC::on("#>FS", [](u8* buf, u8 len) {
		u8 action = buf[0];
		if (action == '1') {
			String name = "";
			for (auto i = 1; i < len; i++) {
				name += String((char)buf[i]);
			}
			if (file) file.close();
			file = LittleFS.open(name, "w");
			MeshRC::send("#<FSOK");
			App::LED_LOW();
		}
		if (action == '2') {
			u8* data = &buf[1];
			if (file) {
				file.write((const char*)data, len - 1);
			}
			App::LED_BLINK();
			delay(2);
			MeshRC::send("#<FSOK");
		}
		if (action == '3') {
			if (file) file.close();
			MeshRC::send("#<FSOK");
			App::LED_HIGH();
		}
	});

#endif
	MeshRC::on("", [](u8* data, u8 size) {
		if (size > 6 && equals(data, (u8*)App::chipID, 6) && (data[6] == '>' || data[6] == '<')) {
			u8* newData = &data[5];
			newData[0] = '#';
			MeshRC::recvHandler(MeshRC::sender, newData, size - 5);
		}
		t1.send(data, size);
#ifdef MASTER
		for (u8 i = 0; i < 8; i++) {
			webSocket.sendBIN(i, data, size);
		}
#endif
	});
	MeshRC::begin();
	t1.send("Hello");
	t1.receive([](u8 *data, u8 size) {
		MeshRC::send(data, size);
	});
}

void loop() {
	t1.loop();
	ArduinoOTA.handle();
#ifdef MASTER
	webSocket.loop();
#endif
}
}  // namespace Net

#endif
