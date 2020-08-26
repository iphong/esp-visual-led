#include "Arduino.h"
#include "config.h"
#include "transport.h"
#include "input.h"
#include "light.h"
#include "display.h"
#include "api.h"

ADC_MODE(ADC_VCC);

void setup() {
    Serial.begin(921600);
    
    #ifdef MASTER
    Serial.printf("\n\nMASTER %X %d\n\n", system_get_chip_id(),  ESP.getVcc());
    #else
    Serial.printf("\n\nSLAVE %X %d\n\n", system_get_chip_id(),  ESP.getVcc());
    #endif

    WiFi.printDiag(Serial);

    Config::setup();
    Transport::setup();
    Display::setup();
    Light::setup();
    Input::setup();
    API::setup();
}

void loop() {
    Config::loop();
    Transport::loop();
    Display::loop();
    Light::loop();
    Input::loop();
    API::loop();
}

