#include <Arduino.h>
#include <Button.h>

#include "api.h"
#include "app.h"
#include "led.h"
#include "net.h"
// #include "sd.h"

// ADC_MODE(ADC_VCC);
Ticker app;
Button btn(BTN_PIN);

void setup() {
#ifdef ENABLE_DEBUG_LOGS
	Serial.begin(921600);
#endif

	sprintf(App::chipID, "%06X", system_get_chip_id());

	Net::staSSID = "nest";
	Net::staPSK = "khongbiet";

	Net::apSSID = "SDC_" + String(App::chipID);
	Net::apPSK = "11111111";
	Net::apAddr = {10, 1, 1, 1};
	Net::apMask = {255, 255, 255, 0};

	// SD::setup();
	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();

	LED::begin();
#ifdef MASTER
	app.attach_ms_scheduled_accurate(100, Net::sendSync);
#endif
#ifdef SLAVE
	Net::syncRequest();
	// if (!App::isPaired())
	// 	App::setMode(App::BIND);
#endif
	btn.begin();
	btn.onPress([](u8 repeats) {
		Serial.printf("Button pressed.\n");
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
	});

	btn.onPressHold([](u8 repeats) {
		switch (repeats) {
			case 0:
#ifdef MASTER
				Net::sendPair();
#endif
#ifdef SLAVE
				if (App::isPairing()) {
					App::setMode(App::SHOW);
					MeshRC::setMaster(App::data.master);
				} else {
					App::setMode(App::BIND);
					MeshRC::setMaster(NULL);
				}
#endif
				break;
			case 1:
				if (Net::isWifiOn()) {
					LOGD("wifi = off\n");
					Net::wifiOff();
				} else {
					LOGD("wifi = on\n");
					Net::wifiOn();
				}
				break;
			case 2:
				LOGD("send file flag = on\n");
				Net::shouldSendCurrentShow = true;
				break;
			case 3:
				Serial.begin(921600);
				break;
			case 4:
				LOGD("empty /show directory\n");
				LED::end();
				Api::deleteRecursive("/show");
				break;
			case 5:
				LOGD("unpair master\n");
				LED::end();
				App::saveMaster(NULL);
				break;
		}
	});
}

void loop() {
	App::loop();
	Api::loop();
	Net::loop();
}
