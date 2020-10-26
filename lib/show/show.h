#include <Arduino.h>
#include <Ticker.h>
#include <FS.h>

#ifndef __SHOW_H__
#define __SHOW_H__

namespace Show {

class RGB {
   public:
	u8 r;
	u8 g;
	u8 b;
	RGB(u8 red = 0, u8 green = 0, u8 blue = 0) : r(red), g(green), b(blue) {}
	void set(u8 red, u8 green, u8 blue) {
		r = red;
		g = green;
		b = blue;
	}
	void set(u8 *data) {
		r = data[0];
		g = data[1];
		b = data[2];
	}
};

class RGBFX {
   protected:
	RGB _pins;
	RGB _color;
	FS *fs;

   public:
	RGBFX(u8 r, u8 g, u8 b) : _pins(r, g, b){};
	bool setup() {
		pinMode(_pins.r, OUTPUT);
		pinMode(_pins.g, OUTPUT);
		pinMode(_pins.b, OUTPUT);
	};
	void render() {
		analogWrite(_pins.r, _color.r);
		analogWrite(_pins.g, _color.g);
		analogWrite(_pins.b, _color.b);
	};
	bool begin() {
		render();
	};
	bool loop();
	bool end();

	u16 r() { return _color.r; }
	u16 g() { return _color.g; }
	u16 b() { return _color.b; }
	bool r(u16 r) { _color.r = r; }
	bool g(u16 g) { _color.g = g; }
	bool b(u16 b) { _color.b = b; }
};

}  // namespace Show

using RGBFX = Show::RGBFX;

#endif
