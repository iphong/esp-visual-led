#include <Arduino.h>
#include <FastLED.h>
#include <LittleFS.h>

#include "config.h"
#include "button.h"

#include "fire.h"
#include "pacifica.h"
#include "cyclone.h"
#include "pride.h"

#include "img/01.h"

#include "esp_rc.h"

CRGB leds[NUM_LEDS];

int fps = 1000;
int brightness = 50;
uint8_t effect = 0;
uint8_t effect_total = 2;

// void image() {
// 	uint16_t offset = 0;
// 	uint8_t r, g, b;
// 	File file = LittleFS.open("/picture.rgb", "r");
// 	while (file.available() >= 3) {
// 		r = file.read();
// 		g = file.read();
// 		b = file.read();
// 		// a = file.read();
// 		Serial.printf("%02X %02X %02X\n", r, g, b);
// 		leds[offset++] = CRGB(r, g, b);
// 		if (offset == 32) {
// 			offset = 0;
// 			FastLED.show();
// 			FastLED.delay(1000 / fps);
// 		}
// 	}
// 	file.close();
// }
void image() {
	uint16_t offset = 0;
	uint8_t r, g, b;
	for (uint16_t i=0; i<sizeof(img_01); i+=3) {
		r = img_01[i];
		g = img_01[i+1];
		b = img_01[i+2];
		leds[offset++] = CRGB(r, g, b);
		if (offset == 32) {
			offset = 0;
			FastLED.show();
			FastLED.delay(1000 / fps);
		}
	}
}
effect_t effects[] = {
	fire,
	pacifica
	// pride
	// cyclone
};
void next() {
	if (++effect >= effect_total) {
		effect = 0;
	} 
	ESPNow.send("effect " + String(effect));
}
void prev() {
	if (effect > 0) {
		effect--;
	} else {
		effect = effect_total - 1;
	}
	ESPNow.send("effect " + String(effect));
}
void brighter() {
	brightness += 10;
	if (brightness == 4) brightness = 250;
	FastLED.setBrightness(brightness);
	FastLED.show();
	Serial.println(brightness);
}
void dimmer() {
	brightness -= 10;	
	if (brightness == 246) brightness = 0;
	FastLED.setBrightness(brightness);
	FastLED.show();
	Serial.println(brightness);
}
void turn_on() {
	digitalWrite(LED_BUILTIN, HIGH);
}
void turn_off() {
	digitalWrite(LED_BUILTIN, LOW);
}

Button b1(D1, next);
Button b2(D2, dimmer);
Button b3(D3, brighter);

uint8_t counter = 0;
uint32_t timer;
int dur;

void setup() {

	Serial.begin(921600);
	
	LittleFS.begin();
	
	ESPNow.begin();

	ESPNow.on("ping", [](String value) {
		Serial.printf("received ping %i\n", value.toInt());
		dur = millis();
		ESPNow.send("pong");
	});
	ESPNow.on("pong", []() {
		Serial.printf("received pong in %i ms\n", millis() - dur);
	});
	
	FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
	FastLED.setCorrection(TypicalLEDStrip);
	FastLED.setBrightness(brightness);

	// b1.begin();
	// b2.begin();
	// b3.begin();
}

void loop() {
	image();

	if (millis() - timer > 100) {
		ESPNow.send("ping", counter++);
		timer = millis();
	}
	
	// b1.update();
	// b2.update();
	// b3.update();
	
	// if (effects[effect]) {
	// 	effects[effect]();
	// 	FastLED.show();
	// 	FastLED.delay(1000 / fps);
	// }
}
