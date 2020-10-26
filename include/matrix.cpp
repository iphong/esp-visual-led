#include <esp8266wifi.h>
#include <espnow.h>
#include <littlefs.h>

#include "FastLED.h"

static u8 broadcast[] = {0xff, 0xff, 0xff, 0xff, 0xff, 0xff};

// static CRGB leds[32];
static File file;
u32 tmr;

void foo(String str) {
	tmr = micros();
	file.println(str);
	Serial.printf("write %u bytes in %lu\n", str.length(), micros() - tmr);
	delay(1);
}

char blank[64];
void setup() {
	Serial.begin(921600);
	Serial.print("\n\n\n\n\n");

	WiFi.mode(WIFI_OFF);
	WiFi.disconnect();
	WiFi.softAPdisconnect();

	// FastLED.addLeds<WS2812B, 2, GRB>(leds, sizeof(leds));
	// FastLED.setBrightness(255);

	LittleFS.begin();

	esp_now_init();
	esp_now_add_peer(broadcast, ESP_NOW_ROLE_MAX, 1, 0, 0);
	esp_now_register_recv_cb([](u8 *addr, u8 *buf, u8 len) {
		tmr = micros();
		for (auto i=0;i<len;i++)file.write(buf[i]);
		Serial.printf("write %u bytes in %lu\n", len, micros() - tmr);
	});

	// memset(blank, 0x00, sizeof(blank));
	file = LittleFS.open("test.bin", "r+");
	file.truncate(0);
	// file.write(blank, sizeof(blank));
	// file.seek(0, SeekSet);
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
	// foo("linelinelinelinelinelinelinelinelinelinelinelinelinelinelineline");
}
void loop() {
	if (Serial.available()) {
		Serial.readString();
		file.seek(0);
		while (file.available()) {
			Serial.write(file.read());
		}
	}
	// FastLED.show();
}
