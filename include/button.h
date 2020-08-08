#include <Arduino.h>

#ifndef __BUTTON_H__
#define __BUTTON_H__

#define MIN_PRESS_DURATION 100
#define SHORT_PRESS_DURATION 300
#define LONG_PRESS_DURATION 600

class Button {
protected:
	uint8_t _pin;
	bool _state = HIGH;
	uint8_t _repeat = 0;
	bool _longPressed = true;
	unsigned int _lastPressed;
	unsigned int _lastReleased;
	unsigned int _duration;
	void (*_onPress)(uint8_t);
	void (*_onPressHold)();

public:
	Button(uint8_t pin) {
		_pin = pin;
	}
	void begin() {
		pinMode(_pin, INPUT_PULLUP);
	}
	void onPress(void (*cb)(uint8_t)) {
		_onPress = cb;
	}
	void onPressHold(void (*cb)()) {
		_onPressHold = cb;
	}
	void update() {
		bool state = digitalRead(_pin);
		if (state != _state) {
			if (!state && millis() - _lastReleased > MIN_PRESS_DURATION) {
				_state = state;
				_lastPressed = millis();
			}
			if (state && millis() - _lastPressed > MIN_PRESS_DURATION) {
				_state = state;
				_lastReleased = millis();
				if (_longPressed) {
					_repeat = 0;
				} else {
					_repeat ++;
				}
			}

			_longPressed = false;
		}
		else {
			if (!_state) {
				_duration = millis() - _lastPressed;
				if (!_longPressed && _duration > LONG_PRESS_DURATION) {
					if (_onPressHold) _onPressHold();
					_longPressed = true;
					Serial.printf("clicked hold\n");
					_repeat = 0;
				}
			} else {
				_duration = millis() - _lastReleased;
				if (!_longPressed && _repeat && _duration > SHORT_PRESS_DURATION) {
					if (_onPress) _onPress(_repeat);
					Serial.printf("clicked %i times\n", _repeat);
					_repeat = 0;
				}
			}
		}
	}
};

#endif