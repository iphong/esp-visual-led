// #define MESH_RC_DEBUG_ALL_MSG
// #define SEND_FILE_LOGS
// #define RECV_FILE_LOGS
// #define SYNC_LOGS
// #ifdef MASTER
// #define USE_SD_CARD
// #endif

#include "app.h"

#include <Arduino.h>
#include <ArduinoOTA.h>
#include <Button.h>

#include "api.h"
#include "hmi.h"
#include "led.h"
#include "net.h"
#ifdef USE_SD_CARD
#include "sd.h"
#endif

// ADC_MODE(ADC_VCC);

Button btn(BTN_PIN);

Button::callback_t buttonPressHandler = [](u8 repeats) {
	LOGD("Button pressed.\n");
	switch (repeats) {
		case 1:
			if (!LED::running) {
				LED::begin();
			} else {
				LOGD("play next show\n");
				LED::end();
				Net::sendSync();
				if (App::data.show == 8)
					App::data.show = 0;
				else
					App::data.show++;
				App::save();
				LED::begin();
				Net::sendSync();
			}
			break;
		case 2:
			if (!LED::running)
				LED::begin();
			else {
				LOGD("play prev show\n");
				LED::end();
				Net::sendSync();
				if (App::data.show == 0)
					App::data.show = 8;
				else
					App::data.show--;
				App::save();
				LED::begin();
				Net::sendSync();
			}
			break;
	}
};

Button::callback_t buttonPressHoldHandler = [](u8 repeats) {
	switch (repeats) {
		case 0:
#ifdef MASTER
			Net::sendPair();
#else
			if (!App::isPairing()) {
				LED::end();
				App::startBlink(200);
				App::mode = App::BIND;
				MeshRC::master = NULL;
			} else {
				App::stopBlink();
				App::mode = App::SHOW;
				MeshRC::master = App::data.master;
			}
			LOGD("mode = %i\n", App::mode);
#endif
			break;
		case 1:
			Net::wifiToggle();
			break;
	}
};

void setup() {
	pinMode(LED_PIN, OUTPUT);
	sprintf(App::chipID, "%06X", system_get_chip_id());

	App::startBlink(200);

	Serial.begin(921600);

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);

	Net::apSSID = "SDC_" + String(App::chipID).substring(0, 6);
	Net::apPSK = "11111111";
	Net::apAddr = {10, 1, 1, 1};
	Net::apMask = {255, 255, 255, 0};

	LED::onBegin = []() {
		Net::sendSync();
	};
	LED::onEnd = []() {
		Net::sendSync();
	};

	// SD::setup();
	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();
#ifdef MASTER
	Hmi::setup();
	Net::wifiOn();
#else
	Net::wifiOff();
#endif
#ifdef USE_SD_CARD
	SD::setup();
#endif
	Net::sendPing();
	App::stopBlink();
}

void loop() {
	App::loop();
	Api::loop();
	Net::loop();
#ifdef MASTER
	Hmi::loop();
#endif
}
