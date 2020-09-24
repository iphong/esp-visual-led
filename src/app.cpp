#define MESH_RC_DEBUG_ALL_MSG


#include <Arduino.h>
#include <Button.h>

#include "app.h"
#include "api.h"
#include "led.h"
#include "net.h"
#include "ir.h"
#include "hmi.h"
// #include "sd.h"

Button btn(BTN_PIN);

Button::callback_t buttonPressHandler = [](u8 repeats) {
	LOGD("Button pressed.\n");
	switch (repeats) {
		case 1:
			if (LED::ended) {
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
			if (LED::ended)
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
	sprintf(App::chipID, "%06X", system_get_chip_id());

	Serial.begin(921600);

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);

	Net::apSSID = "SDC_" + String(App::chipID);
	Net::apPSK = "11111111";
	Net::apAddr = {10, 1, 1, 1};
	Net::apMask = {255, 255, 255, 0};

	// SD::setup();
	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();
#ifdef BRIDGE
	IR::setup();
#endif
#ifdef MASTER
	Hmi::setup();
#endif
}

void loop() {
	App::loop();
	Api::loop();
	Net::loop();
#ifdef MASTER
	Hmi::loop();
#endif
}
