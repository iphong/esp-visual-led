#include "Arduino.h"
#include "Button.h"
#include "EspRC.h"
#include "show.h"
#include "web.h"
#include "rgb.h"

Button button(BTN_PIN);
// VisualPOI ledpoi(NUM_LEDS);

RGBLight rgb1(D1, D2, D3);
RGBLight rgb2(D5, D6, D7);

void setup() {
    button.begin();
    // ledpoi.begin();
    EspRC.begin(255);
    EspRC.bridge(&Serial);
    EspRC.on("color", []() {
        rgb1.set(EspRC.getBytes());
    });
    EspRC.on("brightness", []() {
        FastLED.setBrightness((u8)EspRC.getValue().toInt());
        FastLED.show();
    });
}
void loop() {
    EspRC.update();
    ledpoi.rainbow();
}