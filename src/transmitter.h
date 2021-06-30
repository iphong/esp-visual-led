#ifdef ESP8266
#include <esp8266wifi.h>
#include <espnow.h>
#endif
#ifdef ESP32
#include <wifi.h>
#include <esp_now.h>
#endif
#include <Transport.h>
#include <ArduinoOTA.h>


u8 psk[] = {'1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f'};

Transport bridge(&Serial);

String get_mac_address(bool short_addr = true) {
	char tmp[20];
	uint8_t mac[6];
#ifdef ARDUINO_ARCH_ESP32
	esp_efuse_mac_get_default(mac);
#endif
#ifdef ARDUINO_ARCH_ESP8266
	WiFi.macAddress(mac);
#endif
sprintf(tmp, "%02X%02X%02X", mac[3], mac[4], mac[5]);
	if (short_addr) {
		return String(tmp).substring(0, 6);
	} else {
		return String(tmp).substring(0, 6);
	}
};

void setup() {
	Serial.begin(115200);

	IPAddress apAddr = {10, 1, 1, 1};
	IPAddress apMask = {255, 255, 255, 0};
	String apSSID = "SDC_" + get_mac_address() + "_TX";
	String apPSK = "";
	WiFi.mode(WIFI_AP_STA);
	WiFi.setPhyMode(WIFI_PHY_MODE_11G);
	WiFi.softAPConfig(apAddr, apAddr, apMask);
	WiFi.softAP(apSSID, apPSK);
	WiFi.disconnect();
	// WiFi.softAPdisconnect();
	ArduinoOTA.begin();

	bridge.receive([](uint8_t* addr, uint8_t* data, size_t size) {
		esp_now_send(addr, data, size);
	});
	esp_now_init();
	#ifdef ESP8266
	// esp_now_set_kok(psk, sizeof(psk));
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
