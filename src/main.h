#include <Arduino.h>
#include "config.h"
#include "light.h"
#include "transport.h"
#include "input.h"
#include "api.h"
// #include "display.h"

// ADC_MODE(ADC_VCC);
Ticker app;


void setup() {
    Serial.begin(921600);
    
    sprintf(Config::chipID, "%06X", system_get_chip_id());

    #ifdef MASTER
    LOG("\n\nMASTER %s\n\n", Config::chipID);
    #else
    LOG("\n\nSLAVE %s\n\n", Config::chipID);
    #endif

    WiFi.printDiag(Serial);

    Config::setup();
    Input::setup();
    Light::setup();
    Transport::setup();
    API::setup();

    #ifdef MASTER
    Transport::sendSync();
    // Light::begin();
    app.attach_ms_scheduled_accurate(1000, []() {
        Transport::sendSync();
    });
    #endif
    #ifdef SLAVE
    Transport::syncRequest();
    #endif
}

void loop() {
    Config::loop();
    Transport::loop();
    Input::loop();
    API::loop();
}

