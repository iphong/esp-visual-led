#include <Arduino.h>

#ifndef __RGBLED_H__
#define __RGBLED_H__

class RGBLed {
   protected:
	uint8_t r_pin;
	uint8_t g_pin;
	uint8_t b_pin;

	bool inverted;

   public:
	RGBLed(uint8_t r, uint8_t g, uint8_t b, bool common_anode = false)
		: r_pin(r), g_pin(g), b_pin(b), inverted(common_anode) {
		pinMode(r_pin, OUTPUT_OPEN_DRAIN);
		pinMode(g_pin, OUTPUT_OPEN_DRAIN);
		pinMode(b_pin, OUTPUT_OPEN_DRAIN);
		analogWriteFreq(10000);
		analogWriteRange(255);
	}

	void set(uint8_t r, uint8_t g, uint8_t b) {
		analogWrite(r_pin, inverted ? 255 - r : r);
		analogWrite(g_pin, inverted ? 255 - g : g);
		analogWrite(b_pin, inverted ? 255 - b : b);
	}
};

#endif	// __RGBLED_H__
