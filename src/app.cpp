// #define MESH_RC_DEBUG_ALL_MSG
// #define SEND_FILE_LOGS
// #define RECV_FILE_LOGS
// #define SYNC_LOGS
// #ifdef MAST≈

#include "app.h"

#include <Arduino.h>
#include <ArduinoOTA.h>
#include <Button.h>

#include "api.h"
// #include "hmi.h"
#include "led.h"
#include "net.h"
#ifdef USE_SD_CARD
#include "sd.h"
#endif

ADC_MODE(ADC_VCC);

Button btn(BTN_PIN);

Button::callback_t buttonPressHandler = [](u8 repeats) {
	LOGD("Button pressed.\n");
	switch (repeats) {
		case 1:
			Net::sendPing();
			break;
	}
};

Button::callback_t buttonPressHoldHandler = [](u8 repeats) {
	switch (repeats) {
		case 0:
			if (!App::isPairing()) {
				LED::end();
				App::startBlink(200, LED_PIN);
				App::mode = App::BIND;
				MeshRC::master = NULL;
			} else {
				App::stopBlink();
				App::mode = App::SHOW;
				MeshRC::master = App::data.master;
			}
			LOGD("mode = %i\n", App::mode);
			break;
	}
};

void setup() {
	sprintf(App::chipID, "%06X", system_get_chip_id());

	Serial.begin(921600);

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);

	Net::apSSID = "SDC_" + String(App::chipID).substring(0, 6);
	Net::apPSK = "11111111";
	Net::apAddr = {10, 1, 1, 1};
	Net::apMask = {255, 255, 255, 0};

	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();
#ifdef MASTER
	// Hmi::setup();
	Net::wifiOn();
	MeshRC::delayMs(2000);
	Net::sendPing();
#else
	if (App::isPaired()) {
		Net::sendPing();
	}
#endif
#ifdef USE_SD_CARD
	SD::setup();
#endif
}

void loop() {
	App::loop();
	Api::loop();
	Net::loop();
	// #ifdef MASTER
	// 	Hmi::loop();
	// #endif
}
