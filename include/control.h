#include "Arduino.h"
#include "ESP8266WiFi.h"
#include "espnow.h"

String mac;
String ssid;
u32 tmr;

u16 sent = 0, received = 0;
bool done = true, sending = false;
u8 broadcast[6] ={
		0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
	};
#ifdef MASTER
u8 peer[6] ={ 0X50, 0X02, 0X91, 0X78, 0XE3, 0XC0 };
#else
u8 peer[6] ={ 0xF4, 0xCF, 0xA2, 0xD0, 0x90, 0xF8 };
#endif

void control_setup() {

    #ifdef MASTER
    Serial.printf("\n\n--MASTER--\n");
    #else
    Serial.printf("\n\n--SLAVE--\n");
    #endif

    mac = WiFi.macAddress();
    ssid = "ESP__" + mac.substring(9, 11) + mac.substring(12, 14) + mac.substring(15, 17);

    Serial.printf("MAC: %s\n", mac.c_str());
    Serial.printf("SSID: %s\n", ssid.c_str());

    WiFi.mode(WIFI_AP_STA);
    WiFi.setAutoReconnect(true);
    WiFi.softAP(ssid, "", 0, 0, 20);

    // EspRC.begin(1);
    // EspRC.on("foo", []() {
    //     float value = EspRC.getValue().toFloat();
    //     Serial.printf("received foo: %f \n", value);
    // });
    esp_now_init();
    #ifdef MASTER
    esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
    #else
    esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
    #endif
    // esp_now_add_peer(peer, ESP_NOW_ROLE_COMBO, 1, 0, 0);
    esp_now_add_peer(broadcast, ESP_NOW_ROLE_COMBO, 1, 0, 0);
    esp_now_register_recv_cb([](u8 *from, u8 *data, u8 size) {
        Serial.println(micros() - tmr);
        tmr = micros();
        if (size > 4) received++;
        if (size == 1) {
            Serial.printf("received %u\n", received);
            received = 0;
        }
    });
    esp_now_register_send_cb([](u8 *to, u8 err) {
        sending = false;
        Serial.println(micros() - tmr);
    });
}

void control_loop() {
    if (Serial.available()) {
        while (Serial.available()) Serial.read();
        sent = 0;
        done = false;
        // String message = Serial.readStringUntil('\n');
        // esp_now_send(NULL, (u8 *)message.c_str(), message.length());
        // EspRC.send(message);
    }

    if (done || sending) return;
    if (sent < 1000) {
        u8 data[] = {
            0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00,
            0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00,
            0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00,
            0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00, 0xAA, 0xFF, 0x89, 0x00
        };
        sending = true;
        tmr = micros();
        sent++;
        esp_now_send(NULL, data, sizeof(data));
    } else {
        Serial.println(micros() - tmr);

        u8 data[1] = {0xFF};
        esp_now_send(NULL, data, 1);
        done = true;
    }
}