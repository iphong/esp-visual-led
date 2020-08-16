#include "Arduino.h"
#include "ESP8266WiFi.h"
#include "Ticker.h"
#include "SPI.h"
#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"
#include "espnow.h"
#include "lcd.h"

#define log tft.printf

Adafruit_ILI9341 tft = Adafruit_ILI9341(15, 16);

Ticker logger;

u32 send_duration;

static u8 cast[6] = {0xff, 0xff, 0xff, 0xff, 0xff, 0xff};

int scrollTop = 0;
u8 send_buffer[250];
u8 recv_buffer[250];
u32 last_send_time;
u32 last_message_id = 0;
u16 received = 0;
bool draw;

void handle_messages(u8 *mac, u8 *msg, u8 len)
{
}

esp_now_recv_cb_t recv_cb = [](u8 *mac, u8 *buf, u8 len) {
    if (len < 10)
        return;
    if (buf[0] != 0xFF || buf[1] != 0x81)
        return;
    u32 id = buf[2] << 24 | buf[3] << 16 | buf[4] << 8 | buf[5];
    u8 size = buf[6];
    if (size + 10 > len)
        return;
    u8 crc = buf[7];
    for (auto i = 0; i < size; i++)
    {
        recv_buffer[i] = buf[10 + i];
        crc -= recv_buffer[i];
    }
    // log("received -->%u %u %u %u\n", crc, sum, id, size);
    if (0xff != crc)
        return;
    // if (id <= last_message_id)
    // {
    //     log("ignore relayed message\n");
    //     return;
    // }
    last_message_id = id;
    received++;
    // log("received data --> (%u) %u bytes\n", id, size);
    // relay
    // esp_now_send(cast, buf, len);
};
esp_now_send_cb_t send_cb = [](u8 *mac, u8 err) {
    send_duration = micros() - last_send_time;
    // log("sent data --> (%s) %u us\n", err ? "FAIL" : "SUCCESS", send_duration);
};

void send(u8 *data, u8 size)
{
    last_send_time = micros();
    last_message_id++;

    send_buffer[0] = 0xff;
    send_buffer[1] = 0x81;

    send_buffer[2] = last_message_id >> 24;
    send_buffer[3] = (0x00ffffff & last_message_id) >> 16;
    send_buffer[4] = (0x0000ffff & last_message_id) >> 8;
    send_buffer[5] = 0x000000ff & last_message_id;

    send_buffer[6] = size;
    send_buffer[7] = 0xFF; // CRC byte
    for (auto i = 0; i < size; i++)
    {
        send_buffer[10 + i] = data[i];
        send_buffer[7] += data[i];
    }
    esp_now_send(cast, send_buffer, size + 10);
}

void display()
{
}

void setup()
{
    Serial.begin(921600);
    WiFi.mode(WIFI_AP_STA);
    WiFi.disconnect();
    WiFi.softAPdisconnect();
    tft.begin(80000000UL);
    tft.setRotation(3);
    tft.fillScreen(ILI9341_BLACK);
    esp_now_init();
    esp_now_set_self_role(ESP_NOW_ROLE_COMBO);
    esp_now_add_peer(cast, ESP_NOW_ROLE_COMBO, 0, 0, 0);
    esp_now_register_recv_cb(recv_cb);
    esp_now_register_send_cb(send_cb);
#ifdef MASTER
    logger.attach_ms_scheduled_accurate(10, []() {
        send((u8 *)"Hello", 5);
    });
#else
    logger.attach(1, []() {
        draw = true;
        // scrollTop+=8;
        // if (scrollTop > 320) scrollTop = 0;
        // tft.scrollTo(scrollTop);
        // log("received %03u messages.\n", received);
    });

#endif
}
void loop()
{
    if (draw)
    {
        tft.fillRect(48, 28, 108, 32, ILI9341_BLACK);
        tft.setTextColor(ILI9341_RED);
        tft.setCursor(50, 30);
        tft.setTextSize(4);
        tft.printf("%3u", received);

        tft.setCursor(122, 40);
        tft.setTextColor(ILI9341_GREEN);
        tft.setTextSize(2);
        tft.printf("FPS");
        draw = false;
        received = 0;
    }
}
