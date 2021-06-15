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
#define MSG_RESET  		"#>RESET"
#define MSG_RESTART  	"#>RESTART"
#define MSG_WIFI_ON  	"#>WIFI"
#define MSG_WIFI_OFF  	"#>WIFI"
#define MSG_FBEGIN  	"#>FBEGIN"
#define MSG_FWRITE  	"#>FWRITE"
#define MSG_FCLOSE  	"#>FCLOSE"

namespace Net {

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
		} else {
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
	MeshRC::send(String(chipID).substring(0, 6) + "<PING", data, size);
	LOGL(F("sent ping"));
}
void setPair() {
	LOGL(F("received pair"));
	if (App::isPairing()) {
		App::setMaster(MeshRC::sender);
		App::setMode(MODE_SHOW);
		App::save();
		stopBlink();
	}
}
void setName(u8* buf, u8 len) {
	memset(App::data.name, 0, 20);
	memcpy(App::data.name, buf, len);
	App::save();
}
void setRGB(u8* buf, u8 len) {
	LED::setRGB(buf, len);
}
void restart() {
	ESP.restart();
}

void setup() {

	MeshRC::on(MSG_RESTART, restart);
	MeshRC::on(MSG_PING, 	sendPing);
	MeshRC::on(MSG_SYNC, 	setSync);
	MeshRC::on(MSG_PAIR, 	setPair);
	MeshRC::on(MSG_NAME, 	setName);
	
	MeshRC::on(MSG_RGB, 	setRGB);
	MeshRC::on(MSG_SET, 	setRGB);

	MeshRC::on("", [](u8* data, u8 size) {
		if (size > 6 && equals(data, (u8*)chipID, 6) && (data[6] == '>')) {
			u8* newData = &data[5];
			newData[0] = '#';
			MeshRC::recvHandler(MeshRC::sender, newData, size - 5);
			MeshRC::send("#<OK");
		}
	});
	MeshRC::begin();
}
uint8_t lastCount = 0;
void loop() {
	uint8_t cnt = wifi_softap_get_station_num();
	if (cnt > 0) {
		wifi_softap_get_station_info();
		if (lastCount == 0) startBlink(100);
	} else {
		stopBlink();
	}
	lastCount = cnt <= 0 ? 0 : cnt;
}
}  // namespace Net

#endif
