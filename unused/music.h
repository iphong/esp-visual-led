// Sample time period capped at 10 Mhz
// ESP8266 ananlogRead() function takes 100 nano secs
// 1000000 * (1.0 / SAMPLING_FREQUENCY)

#include "Arduino.h"
#include "FastLED.h"
#include "arduinoFFT.h"

#define SAMPLES 256
#define BAND_NUMS 6
#define LED_NUMS 34

arduinoFFT FFT = arduinoFFT();

CRGB leds[LED_NUMS * BAND_NUMS];

double vReal[SAMPLES];
double vImag[SAMPLES];

u8 size[BAND_NUMS];
u8 peak[BAND_NUMS];

void sample() {
	for (auto i = 0; i < SAMPLES; i++) {
		vReal[i] = analogRead(A0);
		vImag[i] = 0;
	}
	FFT.Windowing(vReal, SAMPLES, FFT_WIN_TYP_HAMMING, FFT_FORWARD);
	FFT.Compute(vReal, vImag, SAMPLES, FFT_FORWARD);
	FFT.ComplexToMagnitude(vReal, vImag, SAMPLES);

	memset(size, 0, BAND_NUMS);

	u8 prev = 0, band;
	int total = 0;
	int count = 0;
	for (int i = 2; i < (SAMPLES / 2); i++) {
		band = floor(sqrt(i)) - 1;
		if (vReal[i] > 100) {
			if (prev != band) {
				if (count) size[prev] = _min(map(total / count, 0, 50, 1, LED_NUMS), LED_NUMS);
				total = 0;
				count = 0;
				prev = band;
			}
			total += vReal[i] / 50;
			count++;
		}
	}
}
void light() {
	auto led = &leds[0];
	for (auto band = 0; band < BAND_NUMS; band++) {
		for (auto i = 0; i < LED_NUMS; i++) {
			// auto hue = 0;
			auto hue = 10 + (band * 40) + i * 2;
			if (i <= size[band])
				*led = CHSV(hue, 255, 255);
			else
				*led = CRGB(0, 0, 0);
			led++;
		}
	}
	FastLED.show();
}

void setup() {
	Serial.begin(921600);
	auto offset = 0;
	FastLED.addLeds<WS2812B, D1, GRB>(&leds[0], LED_NUMS);
	FastLED.addLeds<WS2812B, D2, GRB>(&leds[offset += LED_NUMS], LED_NUMS);
	FastLED.addLeds<WS2812B, D5, GRB>(&leds[offset += LED_NUMS], LED_NUMS);
	FastLED.addLeds<WS2812B, D6, GRB>(&leds[offset += LED_NUMS], LED_NUMS);
	FastLED.addLeds<WS2812B, D7, GRB>(&leds[offset += LED_NUMS], LED_NUMS);
	FastLED.addLeds<WS2812B, D8, GRB>(&leds[offset += LED_NUMS], LED_NUMS);
	FastLED.setBrightness(255);
	FastLED.show();
}
void loop() {
	sample();
	light();
}
