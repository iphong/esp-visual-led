#include "Arduino.h"
#include "config.h"
#include "esp_rc.h"
#include "ESP8266WiFi.h"
#include "Ticker.h"
#include "Wire.h"
#include "Adafruit_GFX.h"    // Core graphics library
#include "gfxfont.h"
#include "Adafruit_ILI9341.h"
#include "Adafruit_ST7735.h"
#include "Adafruit_ST7789.h"
#include "Adafruit_SSD1306.h"
#include "Fonts/FreeSansBold12pt7b.h"
#include "Fonts/FreeSansBold18pt7b.h"
#include "Fonts/FreeMonoBold12pt7b.h"
#include "Fonts/FreeMonoBold18pt7b.h"
#include "SPI.h"

#define TFT_CS 0
#define TFT_RST -1
#define TFT_DC 15

Ticker frame;
Ticker report;

int frameCount = 0;
bool sendFrame, showReport, shouldUpdate;
u8 counter = 0;
u8 missing = 0;

// Adafruit_ILI9341 tft = Adafruit_ILI9341(15, 16);
Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

#ifdef MASTER
u8 peer[6] ={ 0X50, 0X02, 0X91, 0X78, 0XE3, 0XC0 };
#else
u8 peer[6] ={ 0xF4, 0xCF, 0xA2, 0xD0, 0x90, 0xF8 };
#endif

void drawValue(String name, int value, int top) {
    int16_t x, y;
    uint16_t w, h;

    tft.setFont(&FreeMonoBold12pt7b);
    tft.setTextColor(ST77XX_WHITE);

    tft.getTextBounds(name, 0, 0, &x, &y, &w, &h);
    tft.setCursor(0, top + h);
    tft.print(name);
    
    char str[7];
    sprintf(str, "% 7i", value);
    tft.getTextBounds(str, 0, 0, &x, &y, &w, &h);
    tft.fillRect(tft.width() - w, top, w, h + 4, ST77XX_BLACK);
    tft.setCursor(tft.width() - w, top + h);
    tft.print(str);
}

void setup() {
    Serial.begin(921600);
    pinMode(16, OUTPUT);
    pinMode(2, OUTPUT);
    digitalWrite(2, HIGH);
    WiFi.mode(WIFI_AP_STA);
    WiFi.disconnect();
    esp_rc.begin();

    tft.init(240, 240);
    tft.setRotation(2);
    tft.setTextWrap(false);
    tft.fillScreen(ST77XX_BLACK);

    tft.setFont(&FreeMonoBold18pt7b);
    tft.setTextColor(ST77XX_MAGENTA);
    tft.setCursor(0, 36);
    tft.println("SDC");
    tft.setFont(&FreeMonoBold12pt7b);
    tft.println("Technology");

    
    loadConfig();

    Serial.println();
    Serial.println(WiFi.macAddress());

    #ifdef SLAVE
    if (!config.paired) {
        config.paired = true;
        memcpy(config.master, peer, 6);
        saveConfig();
    }
    #endif
    if (config.paired) {
        esp_rc.pair(config.master);
        Serial.printf("%02X %02X %02X %02X %02X %02X", 
            config.master[0],
            config.master[1],
            config.master[2],
            config.master[3],
            config.master[4],
            config.master[5]
        );
    }

#ifdef MASTER
    frame.attach_ms_scheduled_accurate(5, []() {
        sendFrame = true;
    });
#endif
#ifdef SLAVE
    esp_rc.on("RGB**", [](u8* data, u8 size) {
        frameCount++;
        shouldUpdate = true;
        u8 id = data[0];
        if (counter != id - 1) {
            missing += id - counter - 1;
        }
        counter = id;
    });
     report.attach_scheduled(1, []() {
        showReport = true;
    });
#endif
}

void loop() {
#ifdef MASTER
    if (sendFrame && !esp_rc.sending) {
        esp_rc.send("RGB**" + String((const char)counter++));
        sendFrame = false;
    }
#endif
#ifdef SLAVE
    if (shouldUpdate) {
        analogWrite(16, 512);
        analogWrite(16, 512);
        analogWrite(16, 512);
        analogWrite(16, 512);
        analogWrite(16, 512);
        analogWrite(16, 512);
        shouldUpdate = false;
    }
    if (showReport) {
        int c = frameCount;
        int r = esp_rc.received - frameCount;
        int m = missing;
        double q = c == 0 ? 0 :
            m == 0 ? 100 :
            (double)missing / (double)frameCount * 100;

        frameCount = 0;
        esp_rc.received = 0;
        missing = 0;
        showReport = false;
        // drawValue("RSSI%", (int)q, 100);
        drawValue("VALID", c, 125);
        drawValue("OTHER", r, 150);
        drawValue("LOST", m, 175);
    }
#endif
}
