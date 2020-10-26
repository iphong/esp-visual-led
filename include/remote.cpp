#include <esp8266wifi.h>
#include <espnow.h>
#include <transport.h>
#include <data.h>


#define HEADER 	0x36
#define VERSION 0x00

struct data_t {
	u8 foo;
	u8 bar;
	u32 a;
} data;

Transport bridge(&Serial);

void setup() {
	Serial.begin(921600);
	Serial.print("\n\n\n\n\n");
	
	load_data<data_t, HEADER, VERSION>(data);

	WiFi.mode(WIFI_AP_STA);
	WiFi.disconnect();
	WiFi.softAPdisconnect();
	bridge.receive(esp_now_send);
	esp_now_init();
	esp_now_add_peer(broadcast, ESP_NOW_ROLE_MAX, 1, 0, 0);
	esp_now_register_recv_cb([](u8 *addr, u8* data, u8 size) {
		bridge.send(addr, data, size);
	});
}

void loop() {
	bridge.loop();
}
