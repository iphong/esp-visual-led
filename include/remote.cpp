#ifdef ESP8266
#include <esp8266wifi.h>
#include <espnow.h>
#endif
#ifdef ESP32
#include <wifi.h>
#include <esp_now.h>
#endif
#include <transport.h>

Transport bridge(&Serial);

void setup() {
	Serial.begin(115200);

	WiFi.mode(WIFI_AP_STA);
	WiFi.disconnect();
	WiFi.softAPdisconnect();

	bridge.receive([](uint8_t* addr, uint8_t* data, size_t size) {
		esp_now_send((const uint8_t*)addr, (const uint8_t*)data, size);
	});
	esp_now_init();
	#ifdef ESP8266
	esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
	esp_now_add_peer(broadcast, ESP_NOW_ROLE_COMBO, 1, 0, 0);
	esp_now_register_recv_cb([](uint8_t *addr, uint8_t* data, uint8_t size) {
		bridge.send(addr, data, size);
	});
	#endif
	#ifdef ESP32
	esp_now_peer_info_t peerInfo;
	memcpy(peerInfo.peer_addr, broadcast, 6);
	peerInfo.channel = 1;  
	peerInfo.encrypt = false;
	esp_now_register_recv_cb([](const uint8_t *addr, const uint8_t* data, int size) {
		bridge.send((uint8_t*)addr, (uint8_t*)data, (uint8_t)size);
	});
	#endif
	
}

void loop() {
	bridge.loop();
}
