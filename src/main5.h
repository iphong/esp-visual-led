#include <FastLED.h>
#include <Arduino.h>
#include <SPI.h>

CRGB leds[36] = {
	CRGB(255, 255, 255),
	CRGB(255, 0, 0)
};

void setup() {
	Serial.begin(921600);
	// FastLED.addLeds<WS2812B, 13, GRB>(leds, 36);
	// FastLED.setBrightness(255);

	SPI.setFrequency(800000);
	SPI.begin();
	
	unsigned long timer = micros();
	
	// FastLED.show();
	SPI.beginTransaction(SPISettings(800000, MSBFIRST, SPI_MODE0));

	for (int i=0; i<36; i++) {
		SPI.transfer(0x00);
		SPI.transfer(0xFF);
		SPI.transfer(0x00);
	}
	SPI.endTransaction();

	unsigned long duration = micros() - timer;

	Serial.printf("\n\nCycle: %i\n", duration);
}
void loop() {
	// FastLED.show();
}