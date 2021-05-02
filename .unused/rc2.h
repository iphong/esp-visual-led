#include "Arduino.h"

#ifdef ESP32
#include "esp_now.h"
esp_now_peer_info_t cast = {0xff,0xff,0xff,0xff,0xff,0xff};
esp_now_peer_info_t peers[] = {cast};
#endif
#ifdef ESP8266
#include "espnow.h"
#include "esp8266wifi.h"
u8 cast[] = {0xff,0xff,0xff,0xff,0xff,0xff};
u8 *peers[] = {cast};
#endif

char chipID[6];

void setup() {
    Serial.begin(460800);
    #ifdef ESP32
    esp_now_init();
    esp_now_add_peer(peers);
    esp_now_register_recv_cb([](const uint8_t *addr, const uint8_t *data, int size) {
        printf("received %*s\n", size, data);
    });
    esp_now_register_send_cb([](const uint8_t *addr, esp_now_send_status_t status) {
        printf("sent %i\n", (int)status);
    });
    #endif
    #ifdef ESP8266
    sprintf(chipID, "%06X", system_get_chip_id());
    WiFi.mode(WIFI_AP_STA);
    WiFi.disconnect();
    WiFi.softAP(chipID, "");
    esp_now_init();
    esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
    esp_now_add_peer(cast, ESP_NOW_ROLE_COMBO, 1, 0, 0);
    esp_now_register_recv_cb([](u8 *addr, u8 *data, u8 size) {
        printf("received %*s\n", size, data);
    });
    esp_now_register_send_cb([](u8 *addr, u8 status) {
        printf("sent %i\n", (int)status);
    });
    #endif
}

void loop() {
    if (Serial.available()) {
        String data = Serial.readStringUntil('\n');
        esp_now_send(cast.peer_addr, (const uint8_t *)data.c_str(), data.length());
    }
}
