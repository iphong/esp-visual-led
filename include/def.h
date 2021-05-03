#include <Arduino.h>

#ifndef __DEF_H__
#define __DEF_H__

#define API_PORT	(u16)11111

#define HEADER 		(u8)0x36 // character '$'
#define VERSION 	(u8)0x05

#define RGB_FRAME 	(u8)0x01
#define END_FRAME 	(u8)0x02
#define LOOP_FRAME 	(u8)0x03

#define MODE_SHOW 	(u8)0x00
#define MODE_BIND 	(u8)0x01

enum MSG_ID {

	PING_MSG        = 0x01,
	PAIR_MSG        = 0x02,
	NODE_MSG        = 0x03,
	NAME_MSG        = 0x04,
	INFO_MSG        = 0x05,

	SET_RGB_MSG     = 0x10,
	SET_DIM_MSG     = 0x11,

	FILE_BEGIN_MSG  = 0x20,
	FILE_WRITE_MSG  = 0x21,
	FILE_CLOSE_MSG  = 0x22,

	WIFI_ON_MSG     = 0x70,
	WIFI_OFF_MSG    = 0x71
};

struct RGB {
	u8 r;
	u8 g;
	u8 b;
	void set(u32 c) {
		r = (c & 0xFF0000) >> 16;
		g = (c & 0x00FF00) >> 8;
		b = (c & 0x0000FF) >> 0;
	}
	void set(u8* d) {
		r = d[0];
		g = d[1];
		b = d[2];
	}
	void set(RGB* c) {
		r = c->r;
		g = c->g;
		b = c->b;
	}
	void set(u8 red, u8 green, u8 blue) {
		r = red;
		g = green;
		b = blue;
	}
};
struct FrameData {
	u8 type;
	u8 r;
	u8 g;
	u8 b;
	u32 start;
	u32 duration;
	u32 transition;
};
struct SyncData {
	u32 time;
	u8 show;
	u8 ended;
	u8 paused;
};
struct PingData {
	char id[6];
	u8 type;
	u16 vbat;
	char name[20];
};
struct SaveData {
	u8 header = HEADER;
	u8 version = VERSION;
	u8 master[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
	u8 brightness = 255;
	u8 channel = 0;
	u8 show = 1;
	char name[20];
};

bool equals(u8* a, u8* b, u8 size, u8 offset = 0) {
	for (auto i = offset; i < (offset + size); i++)
		if (a[i] != b[i])
			return false;
	return true;
}
bool equals(const char* a, const char* b, u8 size, u8 offset = 0) {
	return equals((u8*)a, (u8*)b, size, offset);
}
bool equals(u8* a, const char* b, u8 size, u8 offset = 0) {
	return equals(a, (u8*)b, size, offset);
}
bool equals(const char* a, u8* b, u8 size, u8 offset = 0) {
	return equals((u8*)a, b, size, offset);
}
u32 readUint32(u8* buffer) {
	return (u32)(buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3]);
}
u16 readUint16(u8* buffer) {
	return (u16)buffer[0] << 8 | buffer[1];
}
u8* setUint16(u8* buffer, u16 value, size_t offset = 0) {
	buffer[offset + 1] = value & 0xff;
	buffer[offset + 0] = (value >> 8);
	return &buffer[offset + 2];
}
u8* setUint32(u8* buffer, u16 value, size_t offset = 0) {
	buffer[offset + 3] = (value & 0x000000ff);
	buffer[offset + 2] = (value & 0x0000ff00) >> 8;
	buffer[offset + 1] = (value & 0x00ff0000) >> 16;
	buffer[offset + 0] = (value & 0xff000000) >> 24;
	return &buffer[offset + 4];
}

#endif
