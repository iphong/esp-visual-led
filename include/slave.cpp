#include <data.h>

#include <iostream>

enum MessageID {
  MSG_PING,
  MSG_INFO,
  MSG_PAIR,
  MSG_SYNC,
  MSG_FILE,
  MSG_WIFI,
  MSG_RGB
};

struct SyncMessage {
  uint8_t id;
  uint8_t show;
  uint8_t paused;
  uint8_t ended;
  uint32_t time;
};

struct PingMessage {
  uint8_t id;
};

struct InfoMessage {
  uint8_t id;
  uint8_t type;
  uint16_t vbat;
  char name[10];
};

struct FileMessage {
  uint8_t id;
  uint8_t pos;
  uint8_t data[128];
  uint8_t crc;
};

InfoMessage data = { MSG_INFO, 0x02, 3999, "Demo 1"};

void log(uint8_t *buf, uint8_t size) {
  for (auto i=0; i<sizeof(data); i++) {
    std::cout << buf[i];
  }
  printf("\n");
  for (auto i=0; i<sizeof(data); i++) {
    printf("%02X ", buf[i]);
  }
  printf("\n");
}

#define HEADER 0x36
#define VERSION 0x00

struct {
	u8 foo;
	u8 bar;
} data;

void setup() {
	load_data<typeof(data), HEADER, VERSION>(data);
}
void loop() {
}
