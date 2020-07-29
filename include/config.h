#ifndef __CONFIG__
#define __CONFIG__

#ifndef LED_PIN
#define LED_PIN LED_BUILTIN
#endif
#define NUM_LEDS 72
#define COLOR_ORDER GRB
#define CHIPSET WS2812B

typedef void (*effect_t)();

extern CRGB leds[NUM_LEDS];
extern effect_t effects[];

extern void next();
extern void brighter();
extern void dimmer();

#endif