#include "arduino.h"
#include "ArduinoOTA.h"
#include "esp8266wifi.h"
#include "littlefs.h"
#include "ticker.h"
#include "fastled.h"
#include "meshrc.h"
#include "config.h"
#include "button.h"
#include "display.h"

#define IS_BIND_MODE Config::mode == Config::BIND

Ticker frame;
Ticker pairing;
Ticker report;

Button btn = Button(BTN_PIN);

Button::onHoldHandler btn1 = btn.onPressHold([]() {
    #ifdef MASTER
    Serial.println("Sending pair message...");
    MeshRC::send("#>PAIR*");
    #endif
    #ifdef SLAVE
    if (IS_BIND_MODE) {
        Config::setMode(Config::IDLE);
        MeshRC::setMaster(Config::data.master);
    } else {
        Config::setMode(Config::BIND);
        MeshRC::setMaster(NULL);
    }
    #endif
});

Button::onClickHandler btn2 = btn.onClick([](u8 repeats) {
    Serial.println("Button pressed.");
    Config::sendFile = true;
});

void sendFileLoop() {
    if (!Config::sendFile) return;

    Dir dir = LittleFS.openDir("/seq");
    while (dir.next()) {
        File f = dir.openFile("r");
        u8 crc = 0x00;

        Serial.printf("Send file : %s\n", f.fullName());
        MeshRC::send("#>FILE^" + String(f.fullName()));
        while (MeshRC::sending) yield();
        delay(50);

        while (f.available()) {
            u16 pos = f.position();
            u8 len = _min(64, f.available());
            u8 data[len+2];
            data[0] = pos >> 8;
            data[1] = pos & 0xff;
            Serial.printf("%5u %04X :: ",  pos, pos);
            for (auto i=0; i<len; i++) {
                data[i+2] = f.read();
                crc += data[i+2];
                Serial.printf("%02X ", data[i+2]);
            }
            Serial.printf("\n");
            MeshRC::send("#>FILE+", data, sizeof(data));
            digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
            while (MeshRC::sending) yield();
            delay(100);
        }

        f.close();
        MeshRC::send("#>FILE$" + String((const char)crc));
        while (MeshRC::sending) yield();
        delay(200);
        Serial.printf("Sent\n\n");
    }
    
    Config::sendFile = false;
}

void setup_rc() {
    #ifdef SLAVE
    static File f;
    static String tmpName = "/tmp/receiving";
    static String name = "";
    static uint8_t crc = 0x00;
    MeshRC::on("#>FILE^", [](u8* filename, u8 size) {
        name = "";
        crc = 0x00;
        for (auto i=0; i<size; i++) {
            name.concat((const char)filename[i]);
        }
        if (f) f.close();
        f = LittleFS.open(tmpName, "w+");
        Serial.printf("\nReceiving file: %s\n", name.c_str());
        digitalWrite(LED_BUILTIN, HIGH);
    });
    MeshRC::on("#>FILE+", [](u8* data, u8 size) {
        if (f) {
            u16 pos = data[0] << 8 | data[1];
            if (f.position() != pos) {
                f.close();
                LittleFS.remove(tmpName);
                Serial.printf("TRUNCATED.\n");
                return;
            }
            Serial.printf("%5u %04X :: ", pos, pos);
            for (auto i=2; i<size;i++) {
                crc += data[i];
                f.write(data[i]);
                Serial.printf("%02X ", data[i]);
            }
            Serial.println();
            digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
        }
    });
    MeshRC::on("#>FILE$", [](u8* data, u8 size) {
        Serial.printf("%02X %02X\n", crc, data[0]);
        if (!f || data[0] != crc) return;
        f.close();
        LittleFS.rename(tmpName, name);
        LittleFS.remove(tmpName);
        Serial.println("EOF.\n");
        digitalWrite(LED_BUILTIN, LOW);
    });
    #endif
    MeshRC::on("#>PAIR*", [](u8* data, u8 size) {
        if (!(IS_BIND_MODE)) return;
        Config::saveBinding(true);
        Config::saveMaster(MeshRC::sender);
        Config::setMode(Config::IDLE);
    });
    MeshRC::on("#>PAIR@", [](u8* data, u8 size) {
        if (!(IS_BIND_MODE)) return;
        Config::saveChannel(data[0]);
        Config::saveBinding(true);
        Config::saveMaster(MeshRC::sender);
        Config::setMode(Config::IDLE);
    });
    MeshRC::on("#>RGB+", [](u8* colors, u8 size) {
        u8 index = Config::data.channel * 3;
        if (index >= size - 3) return; // Channel is not in range
    });
}

void pairModeLoop() {
    static u32 startTime;
    while (IS_BIND_MODE) {
        startTime = millis();
        digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
        while (millis() - startTime < 200) yield();
    }
}

void setup() {
    Serial.begin(921600);
    LittleFS.begin();
    btn.begin();
    WiFi.mode(WIFI_AP_STA);

    #ifdef MASTER
    Serial.print("\n\nMASTER CONTROLLER\n\n");
    // WiFi.softAP("ESP_MASTER", "12345678");
    WiFi.softAPdisconnect();
    WiFi.disconnect();
    #endif
    #ifdef SLAVE
    Serial.print("\n\nSLAVE CONTROLLER\n\n");
    // WiFi.begin("ESP_MASTER", "12345678");
    WiFi.disconnect();
    WiFi.softAPdisconnect();
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, LOW);
    #endif
    Config::load();
    MeshRC::begin();
    Display::begin();
    setup_rc();
}

void loop() {
    #ifdef SLAVE
    pairModeLoop();
    #endif
    #ifdef MASTER
    sendFileLoop();
    #endif
}

