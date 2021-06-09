#include <Arduino.h>

class RGBLed {
   protected:
	uint8_t r_pin;
	uint8_t g_pin;
	uint8_t b_pin;

	uint8_t r_val;
	uint8_t g_val;
	uint8_t b_val;

	bool inverted;

	void setPWM() {
		analogWrite(r_pin, inverted ? 255 - r_val : r_val);
		analogWrite(g_pin, inverted ? 255 - g_val : g_val);
		analogWrite(b_pin, inverted ? 255 - b_val : b_val);
	}

   public:
	RGBLed(uint8_t r, uint8_t g, uint8_t b, bool common_anode = false) : r_pin(r), g_pin(g), b_pin(b), inverted(common_anode) {
		pinMode(r_pin, OUTPUT_OPEN_DRAIN);
		pinMode(g_pin, OUTPUT_OPEN_DRAIN);
		pinMode(b_pin, OUTPUT_OPEN_DRAIN);
		analogWriteFreq(1000);
		analogWriteRange(255);
	}

	void setRGB(uint8_t r, uint8_t g, uint8_t b) {
		r_val = r;
		g_val = g;
		b_val = b;
		setPWM();
	}
};
