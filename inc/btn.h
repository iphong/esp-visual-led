#include "Button.h"
#include "MeshRC.h"
#include "app.h"
#include "net.h"

Button btn(BTN_PIN);

Button::callback_t buttonPressHandler = [](u8 repeats) {
	if (repeats == 1) LOGD("Button pressed %u time.\n", repeats);
	else LOGD("Button pressed %u times.\n", repeats);
	switch (repeats) {
		case 0:
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
				App::mode = MODE_BIND;
				MeshRC::master = NULL;
				startBlink(200);
			} else {
				App::mode = MODE_SHOW;
				MeshRC::master = App::data.master;
				stopBlink();
			}
			LOGD("mode = %i\n", App::mode);
			break;
	}
};
