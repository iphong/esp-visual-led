#include <Arduino.h>
#include <FastLED.h>

#define leds_num 35

CRGB leds[leds_num];

CRGB hsvToRgb(uint16_t h, uint8_t s, uint8_t v)
{
    uint8_t f = (h % 60) * 255 / 60;
    uint8_t p = (255 - s) * (uint16_t)v / 255;
    uint8_t q = (255 - f * (uint16_t)s / 255) * (uint16_t)v / 255;
    uint8_t t = (255 - (255 - f) * (uint16_t)s / 255) * (uint16_t)v / 255;
    uint8_t r = 0, g = 0, b = 0;
    switch((h / 60) % 6){
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return CRGB(r, g, b);
}
void fill(u8 r, u8 g, u8 b) {
    for (auto i=0; i<35; i++) {
        leds[i] = CRGB(r,g,b);
    }
    FastLED.show();
}
void setup() {
    FastLED.addLeds<WS2812B, 13, GRB>(leds, leds_num);
    FastLED.setBrightness(255);
    FastLED.show();
}
void loop() {
    uint8_t time = millis() >> 4;

    for(uint16_t i = 0; i < leds_num; i++)
    {
        uint8_t p = time - i * 8;
        leds[i] = hsvToRgb((uint32_t)p * 359 / 256, 255, 255);
    }
    FastLED.show();
}
