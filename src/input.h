#include "Arduino.h"
#include "Button.h"
#include "MeshRC.h"

#ifndef __INPUT_H__
#define __INPUT_H__

Button btn = Button(BTN_PIN);

Button::onHoldHandler btn1 = btn.onPressHold([](u8 repeats) {
	switch (repeats) {
		case 0:
			#ifdef MASTER
			Serial.println("Sending pair message...");
			MeshRC::send("#>PAIR*");
			#endif
			#ifdef SLAVE
			if (Config::isPairing()) {
				Config::setMode(Config::IDLE);
				MeshRC::setMaster(Config::data.master);
			} else {
				Config::setMode(Config::BIND);
				MeshRC::setMaster(NULL);
			}
			#endif
		break;
		case 1:
			Transport::sendFile = true;
		break;
	}
});

Button::onClickHandler btn2 = btn.onClick([](u8 repeats) {
	Serial.println("Button pressed.");
});

namespace Input {
	void setup() {
		pinMode(LED_BUILTIN, OUTPUT);
    	digitalWrite(LED_BUILTIN, LOW);
		btn.begin();
	}
	void loop() {
		
	}
}

#endif
