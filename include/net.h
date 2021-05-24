#include <Arduino.h>
#include <Ticker.h>

#include "app.h"
#include "def.h"
#include "led.h"

#ifndef __NET_H__
#define __NET_H__

#define MSG_PING  		"#>PING"
#define MSG_SYNC  		"#>SYNC"
#define MSG_PAIR  		"#>PAIR"
#define MSG_NAME  		"#>NAME"
#define MSG_RGB  		"#>RGB"
#define MSG_SET  		"#>SET"
#define MSG_DIM  		"#>DIM"
#define MSG_WIFI_ON  	"#>WIFI"
#define MSG_WIFI_OFF  	"#>WIFI"
#define MSG_FBEGIN  	"#>FBEGIN"
#define MSG_FWRITE  	"#>FWRITE"
#define MSG_FCLOSE  	"#>FCLOSE"

namespace Net {

Ticker pingTimer;
String apSSID;
String apPSK;

IPAddress apAddr = {10, 1, 1, 1};
IPAddress apMask = {255, 255, 255, 0};

bool wifiActive = false;

void wifiOn() {
	wifiActive = true;
	WiFi.softAPConfig(apAddr, apAddr, apMask);
	WiFi.softAP(apSSID, apPSK);
}
void wifiOff() {
	wifiActive = false;
	WiFi.softAPdisconnect();
}
void wifiToggle() {
	!wifiActive ? wifiOn() : wifiOff();
}
void setSync(u8* data, u8 size) {
	SyncData state;
	memcpy(&state, data, size);
	LOGD("received sync: %u %u %u %u\n", state.show, state.ended, state.paused, state.time);
	if (state.show == 0 && App::data.show != 0) {
		LED::end();
		LED::begin();
	}
	App::data.show = state.show;
	if (state.show > 0) {
		if (LED::isRunning() && state.ended) {
			LED::end();
		} else if (!LED::isRunning() && !state.ended) {
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
void sendPing() {
	size_t size = sizeof(App::data.name) + 3;
	u8 data[size];
	data[0] = 2;
	setUint16(&data[1], ESP.getVcc());
	memcpy(&data[3], App::data.name, sizeof(App::data.name));
	MeshRC::send(String(App::chipID) + "<PING", data, size);
	LOGL(F("sent ping"));
}
void setPair() {
	LOGL(F("received pair"));
	if (App::isPairing()) {
		App::stopBlink();
		App::setMaster(MeshRC::sender);
		App::setMode(MODE_SHOW);
		App::save();
	}
}
void setName(u8* buf, u8 len) {
	memset(App::data.name, 0, 20);
	memcpy(App::data.name, buf, len);
	App::save();
}
void setAlpha(u8* buf, u8 len) {
	if (buf[0] == '-' && App::data.brightness > 0) App::data.brightness -= 16;
	if (buf[0] == '+' && App::data.brightness < 255) App::data.brightness += 16;
	App::save();
}
void setRGB(u8* buf, u8 len) {
	u8 r = buf[0];
	u8 g = buf[1];
	u8 b = buf[2];
	LED::A.setRGB(r, g, b);
	LED::B.setRGB(r, g, b);
}
void setColor(u8* buf, u8 len) {
	char segment = buf[0];
	u8 r = buf[1];
	u8 g = buf[2];
	u8 b = buf[3];
	if (segment == 'A' || segment == '*') LED::A.setRGB(r, g, b);
	if (segment == 'B' || segment == '*') LED::B.setRGB(r, g, b);
}

File file;
String path;
u32 time;
u8 blank[128];
void beginFile(u8* buf, u8 len) {
	LOG("FBEGIN: ");
	time = micros();
	path = "";
	if (file) file.close();
	for (u8 i = 0; i < len; i++) path += buf[i];
	file = App::fs->open((const char*)buf, "w");
	if (file) {
		file.write(blank, 128);
		file.seek(0);
		App::LED_LOW();
		LOGD("%lu us OK\n", micros() - time);
	} else
		LOG("\n");
}
void writeFile(u8* buf, u8 len) {
	time = micros();
	LOG("FWRITE : ");
	if (!file) {
		LOG("\n");
		return;
	}
	for (auto i = 0; i < len; i++) {
		file.write(buf[i]);
	}
	App::LED_BLINK();
	LOGD("%lu us\n", micros() - time);
}
void closeFile(u8* buf, u8 len) {
	LOG("CLOSE: ");
	time = micros();
	if (!file) {
		LOG("\n");
		return;
	}
	file.close();
	App::LED_HIGH();
	LOGD("%lu us\n", micros() - time);
}

void setup() {
	MeshRC::on(MSG_PING, 	sendPing);
	MeshRC::on(MSG_SYNC, 	setSync);
	MeshRC::on(MSG_PAIR, 	setPair);
	MeshRC::on(MSG_NAME, 	setName);
	
	MeshRC::on(MSG_RGB, 	setRGB);
	MeshRC::on(MSG_SET, 	setColor);
	MeshRC::on(MSG_DIM, 	setAlpha);

	MeshRC::on(MSG_WIFI_ON,  wifiOn);
	MeshRC::on(MSG_WIFI_OFF, wifiOff);

	MeshRC::on(MSG_FBEGIN, 	beginFile);
	MeshRC::on(MSG_FWRITE, 	writeFile);
	MeshRC::on(MSG_FCLOSE, 	closeFile);

	MeshRC::on("", [](u8* data, u8 size) {
		if (size > 6 && equals(data, (u8*)App::chipID, 6) && (data[6] == '>' || data[6] == '<')) {
			u8* newData = &data[5];
			newData[0] = '#';
			MeshRC::recvHandler(MeshRC::sender, newData, size - 5);
		}
	});
	MeshRC::begin();
}
void loop() {
}
}  // namespace Net

#endif
