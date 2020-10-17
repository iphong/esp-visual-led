// #define MESH_RC_DEBUG_ALL_MSG
// #define SEND_FILE_LOGS
// #define RECV_FILE_LOGS
// #define SYNC_LOGS

#include "app.h"

#include <Arduino.h>
#include <ArduinoOTA.h>
#include <Button.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>

#include "api.h"
#include "def.h"
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
			MeshRC::send(String(App::chipID).substring(0, 6) + "<SELECT");
			break;
		case 2:
			Net::sendPing();
			break;
	}
};

Button::callback_t buttonPressHoldHandler = [](u8 repeats) {
	switch (repeats) {
		case 0:
			if (!App::isPairing()) {
				LED::end();
				App::startBlink(200, B1_PIN);
				App::mode = MODE_BIND;
				MeshRC::master = NULL;
			} else {
				App::stopBlink();
				App::mode = MODE_SHOW;
				MeshRC::master = App::data.master;
			}
			LOGD("mode = %i\n", App::mode);
			break;
		case 2:
			Net::wifiToggle();
			break;
	}
};

void setup() {
	sprintf(App::chipID, "%06X", system_get_chip_id());

	Serial.begin(115200);
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
	// WiFi.begin("nest", "khongbiet");
	// // Wait for connection
	// while (WiFi.status() != WL_CONNECTED) {
	// 	delay(500);
	// 	Serial.print(".");
	// }
	// Serial.println("");
	// Serial.print("Connected to ");
	// //   Serial.println(ssid);
	// Serial.print("IP address: ");
	// Serial.println(WiFi.localIP());

	if (MDNS.begin("lightmaster")) {
		Serial.println("MDNS responder started");
	}

	App::setup();
#ifdef USE_SD_CARD
	SD::setup();
#endif
	LED::setup();
	Net::setup();
	Api::setup();
#ifdef MASTER
	// Hmi::setup();
	Net::wifiOn();
	// Net::wifiOff();
	Net::sendPing();
#else
	if (App::isPaired()) {
		Net::sendPing();
	}
#endif
}

void loop() {
	MDNS.update();
	App::loop();
	Api::loop();
	Net::loop();
	// #ifdef MASTER
	// 	Hmi::loop();
	// #endif
}
