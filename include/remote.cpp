#include <esp8266wifi.h>
#include <espnow.h>
#include <transport.h>

Transport bridge(&Serial);

void setup() {
	Serial.begin(921600);
	Serial.print("\n\n\n\n\n");

	WiFi.mode(WIFI_AP_STA);
	WiFi.disconnect();
	WiFi.softAPdisconnect();
	bridge.receive(esp_now_send);
	esp_now_init();
	esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
	esp_now_add_peer(broadcast, ESP_NOW_ROLE_COMBO, 1, 0, 0);
	esp_now_register_recv_cb([](u8 *addr, u8* data, u8 size) {
		bridge.send(addr, data, size);
	});
}

void loop() {
	bridge.loop();
}
