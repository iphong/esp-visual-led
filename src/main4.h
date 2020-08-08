#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FastLED.h>
#include <LittleFS.h>
#include <EspRC.h>
#include <Button.h>
#include "files.h"

CRGB leds[NUM_LEDS];

String curAsset;
String assets[256];

bool isUploading = false;

uint8_t assetCount = 0;
uint8_t brightness = 200;
uint8_t channel = 1;
uint8_t isMaster = 1;

File img;
uint16_t row, col;

Button b1(0);

void show_end() {
	if (!img)
		return;
	curAsset = "";
	img.close();
}

void show_setup() {
	FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, NUM_LEDS);
	FastLED.setBrightness(brightness);
}

void show_start(String path) {
	if (path != curAsset) {
		if (LittleFS.exists("/assets/" + path)) {
			curAsset = path;
			if (img) {
				img.close();
			}
			if (isMaster) {
				EspRC.send("#", curAsset);
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
	uint16_t pos = sizeof(CRGB) * NUM_LEDS * row;
	img.seek(pos);
}

void show_loop() {
	if (!img)
		return;
	if (img.available() < 3) {
		if (isMaster) {
			EspRC.send("#", curAsset);
		}
		img.seek(0);
		row = 0;
		return;
	}
	while (img.available() >= 3 && col < NUM_LEDS) {
		if (col < NUM_LEDS)
			leds[col] = CRGB(img.read(), img.read(), img.read());
		col++;
	}
	FastLED.show();
	col = 0;
	row++;
}

void getAssets() {
	Dir d = LittleFS.openDir("/assets");
	assetCount = 0;
	while (d.next()) {
		assets[assetCount++] = d.fileName();
		Serial.println(d.fileName());
	}
}

void saveShow() {
	File store = LittleFS.open("/show", "w+");
	store.print(curAsset);
	store.close();
}

void loadShow() {
	File store = LittleFS.open("/show", "r+");
	String path = "";
	while (store.available()) {
		path.concat((char)store.read());
	}
	store.close();
	if ((path =="" || !LittleFS.exists("/assets/" + path)) && assetCount) {
		path = assets[0];
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
	EspRC.begin();
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
	for (auto i=0; i<assetCount; i++) {
		if (assets[i] == curAsset) {
			int toIndex = (i + step);
			if (step > 0 && toIndex >= assetCount) {
				toIndex = 0;
			}
			if (step < 0 && toIndex < 0) {
				toIndex = assetCount - 1;
			}
			String newPath = assets[toIndex];
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
				if (repeat > 5) {
					isUploading = !isUploading;
					if (!isUploading) {
						getAssets();
					}
					Serial.printf("Change uploading mode to %s \n", isUploading ? "ON" : "OFF");
				}
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
	LittleFS.begin();

	WiFi.disconnect();

	getAssets();
	loadSettings();
	
	rc_setup();
	btn_setup();
	show_setup();
	server_setup();

	loadShow();
}

void loop() {
	b1.update();
	if (isUploading) {
		server_loop();
	} else {
		show_loop();
	}
}