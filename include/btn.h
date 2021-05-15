#include "Button.h"
#include "MeshRC.h"
#include "app.h"
#include "net.h"

Button btn(BTN_PIN);

Button::callback_t buttonPressHandler = [](u8 repeats) {
	if (repeats == 1) LOGD("Button pressed %u time.\n", repeats);
	else LOGD("Button pressed %u times.\n", repeats);
	switch (repeats) {
		case 1:
			MeshRC::send(String(App::chipID).substring(0, 6) + "<SELECT");
			break;
		case 2:
			Net::sendPing();
			break;
	}
};

Button::callback_t buttonPressHoldHandler = [](u8 repeats) {
	if (!repeats) LOGD("Long pressed hold.\n");
	else LOGD("%u short presses then hold.\n", repeats);
	switch (repeats) {
		case 0:
			if (!App::isPairing()) {
				LED::end();
				App::startBlink(200, LED_PIN);
				App::mode = MODE_BIND;
				MeshRC::master = NULL;
			} else {
				App::stopBlink();
				App::mode = MODE_SHOW;
				MeshRC::master = App::data.master;
			}
			LOGD("mode = %i\n", App::mode);
			break;
	}
};
