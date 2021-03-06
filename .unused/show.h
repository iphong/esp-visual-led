#include "Arduino.h"
#include "LittleFS.h"
#include "FastLED.h"

class VisualPOI {
protected:
    CRGB _leds[100];
    u8 _led_nums;

public:
    VisualPOI(u8 num) {
        _led_nums = num;
    }
    void begin() {
        FastLED.addLeds<WS2812B, DAT_PIN, GRB>(_leds, _led_nums);
        FastLED.setBrightness(255);
    }
    void fillColor(u8 red, u8 green, u8 blue) {
        for (auto i=0; i<_led_nums; i++) {
            _leds[i] = CRGB(red, green, blue);
        }
        FastLED.show();
    }
    void rainbow() {
        uint8_t time = millis() >> 4;
        for(uint16_t i = 0; i < _led_nums; i++)
        {
            uint8_t p = time - i * 8;
            _leds[i] = hsvToRgb((uint32_t)p * 359 / 256, 255, 255);
        }
        FastLED.show();
    }
    static CRGB hsvToRgb(uint16_t h, uint8_t s, uint8_t v) {
        uint8_t f = (h % 60) * 255 / 60;
        uint8_t p = (255 - s) * (uint16_t)v / 255;
        uint8_t q = (255 - f * (uint16_t)s / 255) * (uint16_t)v / 255;
        uint8_t t = (255 - (255 - f) * (uint16_t)s / 255) * (uint16_t)v / 255;
        uint8_t r = 0, g = 0, b = 0;
        switch ((h / 60) % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        }
        return CRGB(r, g, b);
    }
};
