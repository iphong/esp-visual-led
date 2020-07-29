#include <esphome.h>
#include <FastLED.h>
#include "config.h"
#include "fire.h"
#include "pacifica.h"
#include "cyclone.h"
#include "pride.h"

class Led : public Component {
	uint8_t brightness = 50;
	uint8_t fps = 60;
	mode_t mode = 2;

	bool has_cleared;

	CRGB leds[NUM_LEDS];

	void next() {
		if (++mode > 2) {
			mode = 0;
		} else {
			has_cleared = false;
		}
		Serial.println(mode);
	}

	void brighter() {
		brightness += 10;
		if (brightness > 150) brightness = 150;
		FastLED.setBrightness(brightness);
		Serial.println(brightness);
	}
	void dimmer() {
		brightness -= 10;
		if (brightness < 0) brightness = 0;
		FastLED.setBrightness(brightness);
		Serial.println(brightness);
	}

	void setup() {
		Serial.begin(115200);
		FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
		FastLED.setCorrection(TypicalLEDStrip);
		FastLED.setBrightness(brightness);
	}

	void loop() {
		switch (mode) {
			case 1:
				fire();
				break;
			case 2:
				pacifica();
				break;
			case 3:
				cyclone();
				break;
			case 4:
				pride();
				break;
			default:
				if (!has_cleared) {
					for (int i = 0; i < NUM_LEDS; i++) leds[i] = CRGB(0, 0, 0);
					has_cleared = true;
				}
				break;
		}
		if (mode || mode && !has_cleared) {
			FastLED.show();
			FastLED.delay(1000 / fps);
		}
	}
};