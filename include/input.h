#include "Arduino.h"
#include "Button.h"
#include "MeshRC.h"
#include "api.h"
#include "app.h"
#include "light.h"
#include "net.h"

#ifndef __INPUT_H__
#define __INPUT_H__

namespace Input {

Button btn = Button(BTN_PIN);

Button::onClickHandler handler1 = btn.onClick([](u8 repeats) {
	Serial.printf("Button pressed.\n");
	switch (repeats) {
		case 1:
			if (Light::ended) {
				Light::begin();
			} else {
				Light::end();
				Net::sendSync();
				App::data.show++;
				if (++App::data.show >= 8)
					App::data.show = 0;
				App::save();
				Light::begin();
				Net::sendSync();
			}
			break;
		case 2:
			if (Light::ended)
				Light::begin();
			else {
				Light::end();
				Net::sendSync();
				if (--App::data.show == 255)
					App::data.show = 8;
				App::save();
				Light::begin();
				Net::sendSync();
			}
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
				App::setMode(App::SHOW);
				MeshRC::setMaster(App::data.master);
			} else {
				App::setMode(App::BIND);
				MeshRC::setMaster(NULL);
			}
#endif
			break;
		case 1:
			if (Net::isWifiOn()) {
				Net::wifiOff();
			} else {
				Net::wifiOn();
			}
			break;
		case 2:
			Net::shouldSendFiles = true;
			break;
		case 3:
			Serial.begin(921600);
			break;
		case 4:
			Light::end();
			Api::deleteRecursive("/show");
			break;
		case 5:
			Light::end();
			App::saveMaster(NULL);
			break;
	}
});

void setup() {
	btn.begin();
}
void loop() {
}
}  // namespace Input

#endif
