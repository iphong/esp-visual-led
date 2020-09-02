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
				Net::sendSync();
				App::data.show++;
				if (App::data.show > 4)
					App::data.show = 1;
				App::save();
				Light::begin();
				Net::sendSync();
				break;
			case 2:
				Light::end();
				Net::sendSync();
				App::data.show--;
				if (App::data.show == 0)
					App::data.show = 4;
				App::save();
				Light::begin();
				Net::sendSync();
				break;
			case 5:
				Light::end();
				Api::deleteRecursive("/show");
				App::saveMaster(NULL);
				break;
		}
	});

	Button::onHoldHandler handler2 = btn.onPressHold([](u8 repeats) {
		switch (repeats) {
			case 0:
				#ifdef MASTER
				Net::sendPair();
				#endif
				#ifdef SLAVE
				if (App::isPairing()) {
					App::setMode(App::IDLE);
					MeshRC::setMaster(App::data.master);
				} else {
					App::setMode(App::BIND);
					MeshRC::setMaster(NULL);
				}
				#endif
			break;
			case 1:
				Net::shouldSendFiles = true;
			break;
		}
	});

	void setup() {
		btn.begin();
	}
	void loop() {
		
	}
}

#endif
