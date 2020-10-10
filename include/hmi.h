#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Ticker.h>

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
		u32 time = (float)LED::getTime() / 1000;
		u16 hour = (float)time / 3600;
		u16 min = (float)time / 60;
		u16 sec = time % 60;
		com.printf("playtime.txt=\"%02u:%02u:%02u\"", hour, min, sec);
		com.write(termination, 3);
	}
}
void readDisplay() {
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

				switch (type) {
					case 0xA0:
						switch (data[0]) {
							case 0x01:	// SHOW ID BEGIN
								LED::end();
								Net::sendSync();
								App::setShow(data[1]);
								App::save();
								LED::begin();
								Net::sendSync();
								break;
							case 0x02:	// SHOW BEGIN
								LED::end();
								Net::sendSync();
								LED::begin();
								Net::sendSync();
								break;
							case 0x03:	// SHOW END
								LED::end();
								Net::sendSync();
								break;
							case 0x04:	// SHOW TOGGLE
								LED::toggle();
								Net::sendSync();
								break;
						}
						break;

					case 0xA1:
							Net::sendPair();
						break;
					
					case 0x65: // e pid cid state
						if (data[0] == 0x06) { // IR remote page
							LOG("Send IR code: ");
							LOG(data[1], HEX);
							LOGL();
							MeshRC::send("#>IRSEND", &data[1] - 1, 1);
						}
						break;

					case 0xAA:
						MeshRC::send(data, size);
						break;
				}
				offset = 0;
			}
		}
	}
#endif
}
void setup() {
	com.begin(9600);
	com.print("page entry");
	com.write(termination, 3);
	timer.attach_ms_scheduled(1000, sendTime);
}
void loop() {
	readDisplay();
}
}  // namespace Hmi

#endif
