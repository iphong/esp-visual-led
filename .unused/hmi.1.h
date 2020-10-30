#include "led.h"
#include "net.h"

#ifndef __HMI_H__
#define __HMI_H__

namespace Hmi {

SoftwareSerial com(12, 13);

u8 buffer[250];
u8 offset = 0;
u8 termination[] = {0xff, 0xff, 0xff};

bool shouldSend = false;
Ticker timer;

void sendTime() {
	if (LED::isRunning()) {
		u32 time = (float)LED::A.getTime() / 1000;
		u16 hour = (float)time / 3600;
		u16 min = (float)time / 60;
		u16 sec = time % 60;
		com.printf("playtime.txt=\"%02u:%02u:%02u\"", hour, min, sec);
		com.write(termination, 3);
	}
}
// void readDisplay() {
// #ifdef MASTER
// 	if (com.available()) {
// 		while (com.available()) {
// 			buffer[offset++] = com.read();
// 			if (offset > 3 && MeshRC::equals(&buffer[offset - 3], termination, 3)) {
// 				u8 type = buffer[0];
// 				u8 *data = &buffer[1];
// 				u8 size = offset - 4;

// 				LOGD(":: HMI received 0x[%02X] = ", size);
// 				for (auto i = 0; i < size; i++) {
// 					LOGD("%02X ", data[i]);
// 				}
// 				LOGL();
// 				offset = 0;
// 			}
// 		}
// 	}
// #endif
// }
void read() {
}
void send(const char *msg, size_t len) {
	com.write(msg, len);
	com.write(termination, 3);
}
void send(u8 *msg, u8 len) {
	com.write(msg, len);
	com.write(termination, 3);
}
void send(String msg) {
	com.print(msg);
	com.write(termination, 3);
}
void setup() {
	com.begin(9600);
	// timer.attach_ms_scheduled(1000, sendTime);
	send("page entry");
}
void loop() {
#ifdef MASTER
	if (com.available()) {
		while (com.available()) {
			buffer[offset++] = com.read();
			if (offset > 3 && MeshRC::equals(&buffer[offset - 3], termination, 3)) {
				u8 type = buffer[0];
				u8 *data = &buffer[1];
				u8 size = offset - 4;

				LOGD(":: HMI received 0x[%02X] = ", size);
				for (auto i = 0; i < size; i++) {
					LOGD("%02X ", data[i]);
				}
				LOGL();
				offset = 0;
			}
		}
	}
#endif
}
}  // namespace Hmi

#endif
