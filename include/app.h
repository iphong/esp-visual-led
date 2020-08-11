#include "Arduino.h"
#include "Button.h"
#include "show.h"

Button button(BTN_PIN);
VisualPOI visual(NUM_LEDS);

void setup() {
    Serial.begin(921600);
    button.begin();
    visual.begin();
}
void loop() {
    visual.rainbow();
}