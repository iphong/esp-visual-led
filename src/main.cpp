#include "Arduino.h"
#include "app.h"
#include "light.h"
#include "net.h"
#include "api.h"
#include "input.h"

// ADC_MODE(ADC_VCC);
Ticker app;


void setup() {

#ifdef ENABLE_DEBUG_LOGS
    Serial.begin(921600);
#endif
    
    sprintf(App::chipID, "%06X", system_get_chip_id());

    #ifdef MASTER
    LOGD("\n\nMASTER %s\n\n", App::chipID);
    #else
    LOGD("\n\nSLAVE %s\n\n", App::chipID);
    #endif

    WiFi.printDiag(Serial);

    App::setup();
    Input::setup();
    Light::setup();
    Net::setup();
    Api::setup();

    #ifdef MASTER
    Net::sendSync();
    app.attach_ms_scheduled_accurate(1000, []() {
        Net::sendSync();
    });
    #endif
    #ifdef SLAVE
    Net::syncRequest();
    #endif
}

void loop() {
    App::loop();
    Input::loop();
    Api::loop();
    Net::loop();
}

