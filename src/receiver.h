
#include "api.h"
#include "app.h"
#include "btn.h"
#include "def.h"
#include "led.h"
#include "net.h"

ADC_MODE(ADC_VCC);

void setup() {
	LED_SETUP();
#ifdef ENABLE_DEBUG_LOGS
	Serial.begin(115200);
#endif

	sprintf(chipID, "%06X", system_get_chip_id());

	WiFi.mode(WIFI_AP_STA);
	WiFi.setSleepMode(WIFI_NONE_SLEEP);
	WiFi.disconnect();
	WiFi.softAPConfig(apAddr, apAddr, apMask);
	WiFi.softAP("SDC_" + String(chipID).substring(0, 6), "");

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);

	// ArduinoOTA.onProgress([](int percent, int total) { if (LED::isRunning()) LED::end(); });
	ArduinoOTA.onProgress([](int percent, int total) { LED_BLINK(); });
	ArduinoOTA.onEnd([]() { LED_LOW(); });
	ArduinoOTA.begin();

	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();
}

void loop() {
	ArduinoOTA.handle();
	Api::loop();
	Net::loop();
}
