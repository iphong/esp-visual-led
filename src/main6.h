#include <Arduino.h>
#include <WiFi.h>
#include <FastLED.h>
#include <button.h>
#ifdef ESP32
#include <SPIFFS.h>
#define FS SPIFFS
#else
#include <littlefs.h>
#define FS LittleFS
#endif

#define COLOR_ORDER GRB
#define CHIPSET WS2812B

#ifndef NUM_LEDS
#define NUM_LEDS 36
#endif
#ifndef IMG_SIZE
#define IMG_SIZE 36
#endif
CRGB leds[NUM_LEDS];

String imageNames[1000] = {};
String imageName;
int imageIndex = 0;
int imageMax;

File img;
uint16_t row, col;

IPAddress apIP(10, 1, 1, 1);

Button b1(0);

void saveIndex() {
	File store = FS.open("/config", "w+");
	store.write(imageIndex);
	store.close();
}

void loadIndex() {
	File store = FS.open("/config", "r+");
	if (store.available()) {
		imageIndex = store.read();
		if (imageIndex >= imageMax)
			imageIndex = imageMax - 1;
	} else {
		imageIndex = 0;
	}
}

void show_end() {
	if (!img)
		return;
	img.close();
}

void show_setup() {
	Dir images = FS.openDir("/presets");
	while (images.next()) {
		imageNames[imageMax++] = images.fileName();
		Serial.println(images.fileName());
	}
	loadIndex();
	FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
//	FastLED.setCorrection(TypicalLEDStrip);
	FastLED.setBrightness(255);
}

void show_start(String path) {
	// Serial.printf("Start show: %s\n", path.c_str());
	if (path != imageName) {
		if (FS.exists("/presets/" + path)) {
			imageName = path;
			if (img) {
				img.close();
			}
#ifdef MASTER
			EspRC.send("@", imageName);
#endif
			img = FS.open("/presets/" + path, "r");
		} else {
			show_end();
		}
	}
}

void show_start() {
	show_start(imageNames[imageIndex]);
}

void show_next(bool up = true) {
	if (up) {
		if (++imageIndex == imageMax) {
			imageIndex = 0;
		}
	} else {
		if (--imageIndex < 0) {
			imageIndex = imageMax - 1;
		}
	}
	saveIndex();
	show_start(imageNames[imageIndex]);
}

void show_seek(uint16_t _row) {
	if (!img)
		return;
	row = _row;
	uint16_t pos = sizeof(CRGB) * IMG_SIZE * row;
	img.seek(pos);
}

void show_loop() {
	if (!img)
		return;
	if (img.available() < 3) {
#ifdef MASTER
		EspRC.send("@", imageName);
#endif
		img.seek(0);
		row = 0;
		return;
	}
	while (img.available() >= 3 && col < IMG_SIZE) {
		if (col < IMG_SIZE)
			leds[col] = CRGB(img.read(), img.read(), img.read());
		col++;
	}
	FastLED.show();
	col = 0;
	row++;
}

void btn_setup() {

	b1.onPress([]() {
		show_next(true);
	});
	b1.onLongPress([]() {
		show_next(false);
	});
	b1.begin();
}

void setup() {
	Serial.begin(921600);

	WiFi.mode(WIFI_AP_STA);
	// EspRC.begin(10);
	FS.begin();
	btn_setup();
	show_setup();

#ifdef MASTER
	show_start();
#endif
}

void loop() {
	b1.update();
	show_loop();
}