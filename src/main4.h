#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FastLED.h>
#include <LittleFS.h>
#include <EspRC.h>
#include <Button.h>

#define COLOR_ORDER GRB
#define CHIPSET WS2812B

#ifndef NUM_LEDS
#define NUM_LEDS 36
#endif
#ifndef IMG_SIZE
#define IMG_SIZE 36
#endif

CRGB leds[NUM_LEDS];

String imageName;
String images[256];

uint8_t imageCount = 0;
uint8_t brightness = 200;
uint8_t channel = 1;
uint8_t isMaster = 1;

File img;
uint16_t row, col;

Button b1(0);

void show_end() {
	if (!img)
		return;
	imageName = "";
	img.close();
}

void show_setup() {
	FastLED.addLeds<CHIPSET, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
	FastLED.setBrightness(brightness);
}

void show_start(String path) {
	if (path != imageName) {
		if (LittleFS.exists("/assets/" + path)) {
			imageName = path;
			if (img) {
				img.close();
			}
			if (isMaster) {
				EspRC.send("#", imageName);
			}
			img = LittleFS.open("/assets/" + path, "r");
		} else {
			show_end();
		}
	}
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
		if (isMaster) {
			EspRC.send("#", imageName);
		}
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

void getAssets() {
	Dir d = LittleFS.openDir("/assets");
	imageCount = 0;
	while (d.next()) {
		images[imageCount++] = d.fileName();
		Serial.println(d.fileName());
	}
}

void saveShow() {
	File store = LittleFS.open("/show", "w+");
	store.print(imageName);
	store.close();
}

void loadShow() {
	File store = LittleFS.open("/show", "r+");
	String path = "";
	while (store.available()) {
		path.concat((char)store.read());
	}
	store.close();
	if ((path =="" || !LittleFS.exists("/assets/" + path)) && imageCount) {
		path = images[0];
	}
	show_start(path);
}

void saveSettings() {
	File store = LittleFS.open("/settings", "w+");
	store.write(isMaster);
	store.write(channel);
	store.write(brightness);
	store.close();
}

void loadSettings() {
	File store = LittleFS.open("/settings", "r+");
	if (store.available() == 3) {
		isMaster = store.read();
		channel = store.read();
		brightness = _max(store.read(), 50);
		store.close();
	}
	else {
		isMaster = 1;
		channel = 1;
		brightness = 100;
		saveSettings();
	}
}

void rc_setup() {
	EspRC.on("#", [](String path) {
		if (!isMaster) {
			show_start(path);
		}
	});
	EspRC.on("*", [](String value) {
		if (!isMaster) {
			FastLED.setBrightness(value.toInt());
		}
	});
}

void show_skip(int step) {
	for (auto i=0; i<imageCount; i++) {
		if (images[i] == imageName) {
			int toIndex = (i + step);
			if (step > 0 && toIndex >= imageCount) {
				toIndex = 0;
			}
			if (step < 0 && toIndex < 0) {
				toIndex = imageCount - 1;
			}
			String newPath = images[toIndex];
			show_start(newPath);
			saveShow();
			break;
		}
	}
}

void btn_setup() {
	b1.onPress([](uint8_t repeat) {
		switch (repeat) {
			case 1:
				show_skip(1);
				break;
			case 2:
				show_skip(-1);
				break;

			default:
				break;
			}
	});
	b1.onPressHold([]() {
		isMaster = !isMaster;
		saveSettings();
	});
	b1.begin();
}

void setup() {
	Serial.begin(921600);

	WiFi.mode(WIFI_AP_STA);
	EspRC.begin(10);
	LittleFS.begin();

	getAssets();
	loadSettings();
	
	rc_setup();
	btn_setup();
	show_setup();

	loadShow();
}

void loop() {
	b1.update();
	show_loop();
}