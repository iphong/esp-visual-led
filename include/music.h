// Sample time period capped at 10 Mhz
// ESP8266 ananlogRead() function takes 100 nano secs
// 1000000 * (1.0 / SAMPLING_FREQUENCY)

#include <FastLED.h>
#include "arduinoFFT.h"

#define SAMPLES 256
#define BAND_NUMS 4
#define LED_NUMS 36

arduinoFFT FFT = arduinoFFT();

CRGB leds[LED_NUMS * BAND_NUMS];

double vReal[SAMPLES];
double vImag[SAMPLES];

u8 size[BAND_NUMS];
u8 peak[BAND_NUMS];

void setup() {
  auto offset = 0;
  FastLED.addLeds<WS2812B, D5, GRB>(leds, LED_NUMS, offset += LED_NUMS);
  FastLED.addLeds<WS2812B, D6, GRB>(leds, LED_NUMS, offset += LED_NUMS);
  FastLED.addLeds<WS2812B, D7, GRB>(leds, LED_NUMS, offset += LED_NUMS);
  FastLED.addLeds<WS2812B, D8, GRB>(leds, LED_NUMS, offset += LED_NUMS);
  FastLED.setBrightness(255);
  Serial.begin(921600);
  FastLED.show();
}
void loop() {
  for (auto i = 0; i < SAMPLES; i++) {
    vReal[i] = analogRead(A0);
    vImag[i] = 0;
  }
  FFT.Windowing(vReal, SAMPLES, FFT_WIN_TYP_HAMMING, FFT_FORWARD);
  FFT.Compute(vReal, vImag, SAMPLES, FFT_FORWARD);
  FFT.ComplexToMagnitude(vReal, vImag, SAMPLES);
 
  memset(size, 0, BAND_NUMS);

  u8 prev = 255, band;
  for (int i = 2; i < (SAMPLES/2); i++){
    band = floor(sqrt(i)) - 1;
    if (vReal[i] > 100) {
      if (prev != band) {
        size[band] = _min(map(vReal[i]/50, 0, 50, 0, 23), 23);
        if (size[band] > peak[band]) {
          peak[band] = size[band];
        }
        prev = band;
      }
    }
  }
  auto led = &leds[0];
  for (auto band=0; band<BAND_NUMS; band++) {
    for (auto i=0; i<LED_NUMS; i++) {
      auto hue = (band * 20) + i * 8; 
      if (i < size[band]) *led = CHSV(hue, 255, 255);
      else *led = CRGB(0,0,0);
      led++;
    }
  }
  FastLED.show();
}
