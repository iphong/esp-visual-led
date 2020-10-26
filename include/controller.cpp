
#include "app.h"
#include "api.h"
#include "btn.h"
#include "def.h"
#include "led.h"
#include "net.h"
#ifdef USE_SD_CARD
#include "sd.h"
#endif

ADC_MODE(ADC_VCC);

void setup() {
	sprintf(App::chipID, "%06X", system_get_chip_id());

	Serial.begin(921600);
	Serial.println("\n\n\n\n\n");

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);

	Net::apSSID = "SDC_" + String(App::chipID).substring(0, 6);
	Net::apPSK = "11111111";
	Net::apAddr = {10, 1, 1, 1};
	Net::apMask = {255, 255, 255, 0};

	WiFi.mode(WIFI_AP_STA);
	WiFi.setAutoConnect(true);
	WiFi.setAutoReconnect(true);
	WiFi.setPhyMode(WIFI_PHY_MODE_11N);
	WiFi.setSleepMode(WIFI_NONE_SLEEP);
	WiFi.disconnect();

	App::setup();
#ifdef USE_SD_CARD
	SD::setup();
#endif
	LED::setup();
	Net::setup();
	Api::setup();
#ifdef MASTER
	Net::wifiOn();
	Net::sendPing();
#else
	if (App::isPaired()) {
		Net::sendPing();
	}
#endif
	if (MDNS.begin("lightmaster")) {
		LOGL("MDNS responder started");
	}
	
}

void loop() {
	MDNS.update();
	App::loop();
	Api::loop();
	Net::loop();
}
