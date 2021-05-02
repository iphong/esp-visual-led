#include <esp8266wifi.h>
#include <espnow.h>
#include <transport.h>

Transport bridge(&Serial);

void setup() {
	Serial.begin(460800);
	Serial.print("\n\n\n\n\n");
	delay(2000);
	Serial.println("Hello World.");

	WiFi.mode(WIFI_AP_STA);
	WiFi.begin("nest", "jmrp24mkl;");
	WiFi.softAPdisconnect();
	bridge.receive(esp_now_send);
	esp_now_init();
	esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
	esp_now_add_peer(broadcast, ESP_NOW_ROLE_COMBO, 1, 0, 0);
	esp_now_register_recv_cb([](u8 *addr, u8* data, u8 size) {
		bridge.send(addr, data, size);
	});

	u8 dt[6] = {24, 3, 49, 48, 47, 0};
	esp_now_send(broadcast, dt, 6);
}

void loop() {
	bridge.loop();
}
