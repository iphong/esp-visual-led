#include "config.h"

void fadeall() {
	for (int i = 0; i < NUM_LEDS; i++) {
		leds[i].nscale8(250);
	}
}

void cyclone() {
	static uint8_t hue = 0;
	// First slide the led in one direction
	for (int i = 0; i < NUM_LEDS; i++) {
		// Set the i'th led to red
		leds[i] = CHSV(hue++, 255, 255);
		// Show the leds
		FastLED.show();
		// now that we've shown the leds, reset the i'th led to black
		// leds[i] = CRGB::Black;
		fadeall();
		FastLED.delay(1);
	}

	// Now go in the other direction.
	for (int i = (NUM_LEDS) - 1; i >= 0; i--) {
		// Set the i'th led to red
		leds[i] = CHSV(hue++, 255, 255);
		// Show the leds
		FastLED.show();
		// now that we've shown the leds, reset the i'th led to black
		// leds[i] = CRGB::Black;
		fadeall();
		FastLED.delay(1);
	}
}