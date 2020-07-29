#include <Arduino.h>

class Button {
protected:
	uint8_t _pin;
	bool _state;
	uint32_t last_press;
	void (*onPress)();

public:
	Button(uint8_t pin, void (*cb)()) {
		_pin = pin;
		onPress = cb;
	}
	void begin() {
		pinMode(_pin, INPUT_PULLUP);
	}
	void update() {
		bool state = digitalRead(_pin);
		if (state != _state) {
			_state = state;
			if (state == LOW && millis() - last_press > 200) {
				last_press = millis();
				if (onPress) onPress();
			}
		}
	}
};

bool task_started;

void task_fn(void * params) {

}

class Touchpad {
protected:
	uint8_t _pin;
	bool _state;
	uint32_t last_press;
	void (*onPress)();

public:
	Touchpad(uint8_t pin, void (*cb)()) {
		_pin = pin;
		onPress = cb;

	}
	void begin() {
		pinMode(_pin, INPUT);
	}
	void update() {
		#ifdef ESP32
        bool state = touchRead(_pin) < 40 ? LOW : HIGH;
        #else
        bool state = digitalRead(_pin);
        #endif
		if (state != _state) {
			_state = state;
			if (state == LOW && millis() - last_press > 500) {
				last_press = millis();
				if (onPress) onPress();
			}
		}
	}
};