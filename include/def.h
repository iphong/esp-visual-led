#include <c_types.h>

#ifndef __DEF_H__
#define __DEF_H__

#define HEADER '$'
#define VERSION 5

#define RGB_FRAME 	0x01
#define END_FRAME 	0x02
#define LOOP_FRAME 	0x03

#define MODE_SHOW 	0x00
#define MODE_BIND 	0x01

struct RGB {
	u8 r;
	u8 g;
	u8 b;
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
	u8 show;
	u8 running;
	u8 paused;
	u32 time;
};
struct PingData {
	char id[6];
	u8 type;
	u16 vbat;
	char name[20];
	u32 lastUpdate;
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
	for (auto i = offset; i < offset + size; i++)
		if (a[i] != b[i])
			return false;
	return true;
}
u32 readUint32(unsigned char* buffer) {
	return (u32)(buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3]);
}
u16 readUint16(unsigned char* buffer) {
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
