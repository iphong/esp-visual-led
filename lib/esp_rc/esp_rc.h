//
// Author: Phong Vu
//
#ifndef ESP_RC_H
#define ESP_RC_H

#ifdef ESP8266
#include <ESP8266WiFi.h>
#include <espnow.h>
#endif
#ifdef ESP32
#include <WiFi.h>
#include <esp_now.h>
#endif

#define RSP_RC_MAX_LISTENER 20
#define ESP_RC_DEBUGGER

typedef void (*esp_rc_listener_cb_t)();
typedef void (*esp_rc_listener_str_cb_t)(String);
typedef void (*esp_rc_listener_int_cb_t)(int);

static uint8_t broadcast[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

struct esp_rc_listener_t {
    String subscribe;
    esp_rc_listener_cb_t callback;
    esp_rc_listener_str_cb_t str_callback;
};

esp_rc_listener_t listeners[RSP_RC_MAX_LISTENER];
uint8_t listeners_num = 0;

// #ifdef ESP_RC_DEBUGGER
// Serial.printf("%02X:%02X:%02X:%02X:%02X:%02X >>> %s\n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], esp_now_payload.c_str()); 
// #endif
// #ifdef ESP_LOGD
// ESP_LOGD("espnow", "%02X:%02X:%02X:%02X:%02X:%02X >>> %s", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], esp_now_payload.c_str()); 
// #endif

String esp_now_payload;

class {
public:
    void begin(uint8_t channel = 1) {
        WiFi.mode(WIFI_AP_STA);
        if (esp_now_init() == OK) {
            esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
            if (esp_now_is_peer_exist(broadcast))
                esp_now_del_peer(broadcast);
            esp_now_add_peer(broadcast, ESP_NOW_ROLE_COMBO, channel, 0, 0);
            esp_now_register_recv_cb([](uint8_t *mac, uint8_t *payload, uint8_t size) {
                esp_now_payload = "";
                for (auto i=0; i<size; i++) {
                    esp_now_payload.concat((const char)payload[i]);
                }
                for (auto i=0; i<listeners_num; i++) {
                    esp_rc_listener_t listener = listeners[i];
                    if (esp_now_payload.startsWith(listener.subscribe)) {
                        if (listener.callback) {
                            listener.callback();
                        }
                        if (listener.str_callback) {
                            String value = esp_now_payload.substring(listener.subscribe.length(), size);
                            value.trim();
                            listener.str_callback(value);
                        }
                    }
                }
            });
        }
    }
    void send(String payload) {
        esp_now_send(broadcast, (uint8_t *)payload.c_str(), (uint8_t)payload.length());
    }
    void send(String payload, String value, char delimiter = ' ') {
        send(payload + delimiter + String(value));
    }
    void send(String payload, double value, char delimiter = ' ') {
        send(payload + delimiter + String(value));
    }
    void on(String  subscribe, esp_rc_listener_cb_t callback) {
        listeners[listeners_num++] = {subscribe, callback, NULL};
    }
    void on(String  subscribe, esp_rc_listener_str_cb_t callback) {
        listeners[listeners_num++] = {subscribe, NULL, callback};
    }
} ESPNow;

#endif //ESP_RC_H

