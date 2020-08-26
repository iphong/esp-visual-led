#include <Arduino.h>
#include "config.h"
#include "transport.h"
#include "input.h"
#include "light.h"
#include "api.h"
// #include "display.h"

// ADC_MODE(ADC_VCC);

void setup() {
    Serial.begin(921600);
    
    sprintf(Config::chipID, "%06x", system_get_chip_id());

    #ifdef MASTER
    Serial.printf("\n\nMASTER %s\n\n", Config::chipID);
    #else
    Serial.printf("\n\nSLAVE %s\n\n", Config::chipID);
    #endif

    WiFi.printDiag(Serial);

    Config::setup();
    Light::setup();
    Transport::setup();
    Input::setup();
    API::setup();
    // Display::setup();

    Light::A.begin();
    Light::B.begin();
}

void loop() {
    Config::loop();
    Transport::loop();
    Input::loop();
    API::loop();
    // Display::loop();
}

