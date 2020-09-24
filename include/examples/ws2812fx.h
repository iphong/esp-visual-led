
#include <WS2812FX.h>

#define LED_COUNT 144

#define TIMER_MS 3000

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
//   NEO_RGBW    Pixels are wired for RGBW bitstream (NeoPixel RGBW products)
WS2812FX light1 = WS2812FX(LED_COUNT, D5, NEO_RGB + NEO_KHZ800);
WS2812FX light2 = WS2812FX(LED_COUNT, D6, NEO_RGB + NEO_KHZ800);
WS2812FX light3 = WS2812FX(LED_COUNT, D7, NEO_RGB + NEO_KHZ800);
WS2812FX light4 = WS2812FX(LED_COUNT, D8, NEO_RGB + NEO_KHZ800);

unsigned long last_change = 0;
unsigned long now = 0;

void setup() {
  light1.init();
  light1.setBrightness(255);
  light1.setSpeed(1000);
  light1.setColor(0x007BFF);
  light1.setMode(FX_MODE_STATIC);
  light1.start();

  light2.init();
  light2.setBrightness(255);
  light2.setSpeed(1000);
  light2.setColor(0x007BFF);
  light2.setMode(FX_MODE_STATIC);
  light2.start();

  light3.init();
  light3.setBrightness(255);
  light3.setSpeed(1000);
  light3.setColor(0x007BFF);
  light3.setMode(FX_MODE_STATIC);
  light3.start();

  light4.init();
  light4.setBrightness(255);
  light4.setSpeed(1000);
  light4.setColor(0x007BFF);
  light4.setMode(FX_MODE_STATIC);
  light4.start();

  light1.setMode(light1.getModeCount() / 4 * 0);
  light2.setMode(light2.getModeCount() / 4 * 1);
  light3.setMode(light3.getModeCount() / 4 * 2);
  light4.setMode(light4.getModeCount() / 4 * 3);
}

void loop() {
  now = millis();

  light1.service();
  light2.service();
  light3.service();
  light4.service();

  if(now - last_change > TIMER_MS) {
    light1.setMode((light1.getMode() + 1) % light1.getModeCount());
    light2.setMode((light2.getMode() + 1) % light2.getModeCount());
    light3.setMode((light3.getMode() + 1) % light3.getModeCount());
    light4.setMode((light4.getMode() + 1) % light4.getModeCount());
    last_change = now;
  }
}
