#include "Arduino.h"
#include "Button.h"
#include "MeshRC.h"

#ifndef __INPUT_H__
#define __INPUT_H__

namespace Input {

	Button btn = Button(BTN_PIN);

	Button::onClickHandler handler1 = btn.onClick([](u8 repeats) {
		Serial.printf("Button pressed.\n");
		switch (repeats) {
			case 1:
				Light::end();
				Config::data.show++;
				if (Config::data.show > 4)
					Config::data.show = 1;
				Config::save();
				Transport::sendSync();
				Light::begin();
				break;
			case 2:
				Light::end();
				Config::data.show--;
				if (Config::data.show == 0)
					Config::data.show = 4;
				Config::save();
				Transport::sendSync();
				Light::begin();
				break;
			case 5:
				Light::end();
				Dir dir = Config::fs->openDir("/seq");
				while (dir.next()) {
					Config::fs->remove(dir.openFile("w").fullName());
				}
				Config::saveMaster(NULL);
				break;
		}
	});

	Button::onHoldHandler handler2 = btn.onPressHold([](u8 repeats) {
		switch (repeats) {
			case 0:
				#ifdef MASTER
				Transport::sendPair();
				#endif
				#ifdef SLAVE
				if (Config::isPairing()) {
					Config::setMode(Config::IDLE);
					MeshRC::setMaster(Config::data.master);
					Light::begin();
				} else {
					Config::setMode(Config::BIND);
					MeshRC::setMaster(NULL);
					Light::end();
				}
				#endif
			break;
			case 1:
				Transport::shouldSendFiles = true;
			break;
		}
	});

	void setup() {
		btn.begin();
		pinMode(LED_BUILTIN, OUTPUT);
	}
	void loop() {
		
	}
}

#endif
