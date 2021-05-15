
#include "app.h"
#include "api.h"
#include "btn.h"
#include "def.h"
#include "led.h"
#include "net.h"

ADC_MODE(ADC_VCC);

void setup() {
	sprintf(App::chipID, "%06X", system_get_chip_id());
	
	Net::apSSID = "SDC_" + String(App::chipID).substring(0, 6);
	Net::apPSK = "";

#ifdef ENABLE_DEBUG_LOGS
	Serial.begin(115200);
#endif

	btn.begin();
	btn.onPress(buttonPressHandler);
	btn.onPressHold(buttonPressHoldHandler);

	WiFi.mode(WIFI_AP_STA);
	WiFi.setSleepMode(WIFI_NONE_SLEEP);
	WiFi.disconnect();
	// Net::wifiOff();
	Net::wifiOn();

	ArduinoOTA.onProgress([](int percent, int total) {
		App::LED_BLINK();
	});
	ArduinoOTA.begin();

	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();
}

void loop() {
	if (!LED::isRunning()) {
		ArduinoOTA.handle();
		Api::loop();
	}
	// App::loop();
	// Net::loop();
}
