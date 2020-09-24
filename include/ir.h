#include <IRremoteESP8266.h>
#include <IRsend.h>

#ifndef __IR_H_
#define __IR_H__

namespace IR {

uint32_t codes[24] = {
	0xF700FF, 0xF7807F, 0xF740BF, 0xF7C03F,
	0xF720DF, 0xF7A05F, 0xF7609F, 0xF7E01F,
	0xF710EF, 0xF7906F, 0xF750AF, 0xF7D02F,
	0xF730CF, 0xF7B04F, 0xF7708F, 0xF7F00F,
	0xF708F7, 0xF78877, 0xF748B7, 0xF7C837,
	0xF728D7, 0xF7A857, 0xF76897, 0xF7E817};

IRsend ir0(LED_PIN);
IRsend ir1(R1_PIN);
IRsend ir2(G1_PIN);
IRsend ir3(B1_PIN);

void sendRGBButton(uint8_t num) {
	ir0.sendNEC(codes[num]);
	ir1.sendNEC(codes[num]);
	ir2.sendNEC(codes[num]);
	ir3.sendNEC(codes[num]);
}
void handleIREvent(u8 *data, u8 size) {
	sendRGBButton(data[0]);
}
void setup() {
	ir0.begin();	
	ir1.begin();	
	ir2.begin();
	ir3.begin();
	MeshRC::on("#>IRSEND", handleIREvent);
}
}  // namespace IR

#endif
