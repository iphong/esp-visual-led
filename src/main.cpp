#include "Arduino.h"
#include "api.h"
#include "app.h"
#include "input.h"
#include "light.h"
#include "net.h"
#include "sd.h"

// ADC_MODE(ADC_VCC);
Ticker app;

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
	Net::apMask = {255, 255, 0, 0};

	// SD::setup();
	App::setup();
	Input::setup();
	Light::setup();
	Net::setup();
	Api::setup();

Light::begin();
#ifdef MASTER
	app.attach_ms_scheduled_accurate(100, Net::sendSync);
#endif
#ifdef SLAVE
	Net::syncRequest();
	// app.once_ms(1000, Net::syncRequest);
	if (!App::isPaired()) App::setMode(App::BIND);
#endif
}

void loop() {
	App::loop();
	Input::loop();
	Api::loop();
	Net::loop();
}
