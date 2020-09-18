#include <Arduino.h>
#include <Button.h>

#include "api.h"
#include "app.h"
#include "led.h"
#include "net.h"
// #include "sd.h"

Ticker app;
Button btn(BTN_PIN);

WiFiEventHandler connectedHandler = WiFi.onSoftAPModeStationConnected([](WiFiEventSoftAPModeStationConnected e) {
	LOGL("AP Connected");
	// App::startBlink(50);
	Net::sendPing();
});

WiFiEventHandler disconnectedHandler = WiFi.onSoftAPModeStationDisconnected([](WiFiEventSoftAPModeStationDisconnected e) {
	LOGL("AP Disonnected");
	// App::stopBlink();
});

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
			
			if (App::isPairing()) {
				App::stopBlink();
				App::mode = App::SHOW;
				MeshRC::master = App::data.master;
			} else {
				LED::end();
				App::startBlink(200);
				App::mode = App::BIND;
				MeshRC::master = NULL;
			}
			LOGD("mode = %i\n", App::mode);
#endif
			break;
		case 1:
			LOGD("unpair master\n");
			LED::end();
			App::saveMaster(NULL);
			break;
		case 4:
			Net::wifiToggle();
			break;
		case 5:
			LOGD("empty /show directory\n");
			LED::end();
			Api::deleteRecursive("/show");
			break;
	}
};

void setup() {
	Serial.begin(921600);

	sprintf(App::chipID, "%06X", system_get_chip_id());

	Net::apSSID = "SDC_" + String(App::chipID);
	Net::apPSK = "11111111";
	#ifdef MASTER
	Net::apAddr = {10, 1, 1, 1};
	#else
	Net::apAddr = {10, 1, 2, 1};
	#endif
	Net::apMask = {255, 255, 255, 0};

	// SD::setup();
	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();

	LED::begin();

	app.once_scheduled(1, Net::sendPing);
	// app.attach_ms_scheduled_accurate(1000, Net::sendSync);

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);
}

void loop() {
	App::loop();
	Api::loop();
	Net::loop();
}
