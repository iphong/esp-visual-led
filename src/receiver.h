
#include "api.h"
#include "app.h"
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

	Net::wifiOn();

	ArduinoOTA.onStart([]() { App::LED_HIGH(); });
	ArduinoOTA.onProgress([](int percent, int total) {
		if (LED::isRunning()) LED::end();
		App::LED_BLINK();
	});
	ArduinoOTA.onEnd([]() { App::LED_LOW(); });
	ArduinoOTA.begin();

	App::setup();
	LED::setup();
	Net::setup();
	Api::setup();
}

void loop() {
	ArduinoOTA.handle();
	Api::loop();
	App::loop();
	Net::loop();
}
