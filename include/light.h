#include "Arduino.h"
#include "Ticker.h"
#include "espnow.h"

// #define R1_PIN D6
// #define G1_PIN D7
// #define B1_PIN D8

// #define R2_PIN D1
// #define G2_PIN D2
// #define B2_PIN D4

// #define INVERTED_RGB

#ifndef __LIGHT_H__
#define __LIGHT_H__

namespace Light {

bool paused = false;
bool ended = true;
bool repeat = true;

void pause() {
	paused = true;
}

void resume() {
	paused = false;
}

void toggle() {
	paused = !paused;
}

enum FrameType {
	RGB_FRAME = 1,
	LOOP_FRAME = 2,
	END_FRAME = 3
};

class RGB {
   public:
	u8 r;
	u8 g;
	u8 b;

	void set(u8* d) {
		memcpy(this, d, 3);
	}

	void set(RGB* c) {
		r = c->r;
		g = c->g;
		b = c->b;
	}

	void set(App::Color* c) {
		r = c->r;
		g = c->g;
		b = c->b;
	}

	void set(u8 red, u8 green, u8 blue) {
		r = red;
		g = green;
		b = blue;
	}
};

class Frame : public RGB {
   public:
	FrameType type;
	unsigned int start = 0;
	unsigned int duration = 0;
	unsigned int transition = 0;
	unsigned int r = 0;
	unsigned int g = 0;
	unsigned int b = 0;
};

class Show {
   protected:
	const char id;
	u8 r_pin;
	u8 g_pin;
	u8 b_pin;

	RGB color;
	RGB lastColor;

	Ticker tmr;
	File file;

	Frame frame;   // Active frame
	u32 playTime;  // Current playing time
	u16 holdTime = 0;

	Frame loopFrame;
	u32 loopTime;
	u32 loopStart;
	u32 loopEnd;
	u32 loopStartTime;

	u32 lapsed;

	App::Output* data;

   public:
	Show(const char id, u8 r_pin, u8 g_pin, u8 b_pin, App::Output* d)
		: id(id), r_pin(r_pin), g_pin(g_pin), b_pin(b_pin), data(d) {
	}

	u32 getTime() {
		return playTime;
	}

	Frame parse(String* line) {
		Frame frame;
		line->trim();
		if (line->startsWith("C")) {
			frame.type = RGB_FRAME;
			sscanf(
				line->c_str(),
				"%*s %u %u %u %u %u %u",
				&frame.start,
				&frame.duration,
				&frame.transition,
				&frame.r,
				&frame.g,
				&frame.b);
		} else if (line->startsWith("L")) {
			frame.type = LOOP_FRAME;
			sscanf(
				line->c_str(),
				"%*s %u %u",
				&frame.start,
				&frame.duration);
		} else if (line->startsWith("E")) {
			frame.type = END_FRAME;
			sscanf(
				line->c_str(),
				"%*s %u",
				&frame.start);
		}
		return frame;
	}

	Frame next() {
		if (file.available()) {
			String line = file.readStringUntil('\n');
			return parse(&line);
		}
		return frame;
	}

	void setColor(Frame* frame, bool isLoop) {
		if (isLoop) {
			lapsed = loopTime - frame->start;
		} else {
			lapsed = playTime - frame->start;
		}
		if (frame->transition && lapsed <= frame->transition) {
			// Compute color value during transition
			float ratio = (float)lapsed / frame->transition;
			color.set(
				((float)lastColor.r + (frame->r - lastColor.r) * ratio),
				((float)lastColor.g + (frame->g - lastColor.g) * ratio),
				((float)lastColor.b + (frame->b - lastColor.b) * ratio));
			// Serial.printf("%3u %3u %4u %02f\n", lastColor[0], frame->r, color.r, ratio);
			// Serial.printf("%3u %3u %4u %02f\n", lastColor[1], frame->g, color.g, ratio);
			// Serial.printf("%3u %3u %4u %02f\n", lastColor[2], frame->b, color.b, ratio);
		} else {
			color.set(frame->r, frame->g, frame->b);
			// lastColor.set(frame->r, frame->g, frame->b);
		}
		setRGB(
			map(color.r, 0, 255, 0, App::data.brightness),
			map(color.g, 0, 255, 0, App::data.brightness),
			map(color.b, 0, 255, 0, App::data.brightness));
	}

	void end() {
		tmr.detach();
		if (file)
			file.close();
		playTime = 0;
		loopTime = 0;
		setRGB(0, 0, 0);
	}

	void setTime(u32 time) {
		LOGD("Play time: %u, sync time: %u\n", playTime, time);
		if (!file || !time || paused)
			begin();
		if (playTime > time + 2) {
			holdTime = playTime - time;
		} else if (playTime < time - 2) {
			while (playTime < time) {
				if (!tick(false))
					continue;
			}
		}
	}

	// true = playing
	// false = ended
	bool tick(bool shouldSetColor = true) {
		if (holdTime && shouldSetColor) {
			holdTime--;
			return true;
		}
		if (paused & shouldSetColor)
			return false;
		switch (frame.type) {
			case RGB_FRAME:
				if (shouldSetColor)
					setColor(&frame, false);
				break;
			case LOOP_FRAME:
				if (loopTime == 0) {
					LOGD("\nloop ");
					loopStart = file.position();
					loopFrame = next();
				}
				if (shouldSetColor && loopFrame.type == RGB_FRAME) {
					setColor(&loopFrame, true);
				}
				if (++loopTime >= loopFrame.start + loopFrame.duration) {
					LOGD(" * ");
					loopFrame = next();
					if (loopFrame.type == END_FRAME) {
						loopTime = 0;
						loopEnd = file.position();
						file.seek(loopStart);
					} else {
						lastColor.set(loopFrame.r, loopFrame.g, loopFrame.b);
					}
				}
				break;
			case END_FRAME:
				LOGD("\nended.");
				if (repeat) {
					loopTime = 0;
					playTime = 0;
					loopStart = 0;
					file.seek(0);
					frame = next();
				} else {
					end();
				}
				return false;
		}
		if (++playTime - frame.start >= frame.duration && frame.type) {
			if (frame.type == LOOP_FRAME) {
				loopTime = 0;
				file.seek(loopEnd);
			}
			LOGD("\nframe");
			if (frame.type == RGB_FRAME) {
				lastColor.set(frame.r, frame.g, frame.b);
			}
			frame = next();
		}
		return true;
	}

	void setRGB(u8 r, u8 g, u8 b) {
#ifdef INVERTED_RGB
		analogWrite(r_pin, 255 - r);
		analogWrite(g_pin, 255 - g);
		analogWrite(b_pin, 255 - b);
#else
		analogWrite(r_pin, r);
		analogWrite(g_pin, g);
		analogWrite(b_pin, b);
#endif
	}

	void setup() {
		pinMode(r_pin, OUTPUT);
		pinMode(g_pin, OUTPUT);
		pinMode(b_pin, OUTPUT);
		setRGB(0, 0, 0);
	}

	void begin() {
		if (!ended)
			end();
		if (App::data.show != 0) {
			String path = "/show/" + String(App::data.show) + (id) + ".lsb";
			if (!App::fs->exists(path)) {
				LOGD("Show not found: %s\n", path.c_str());
				return;
			}
			LOGD("Playing show: %s\n", path.c_str());
			file = App::fs->open(path, "r");
			file.setTimeout(0);
			frame = next();
			tmr.attach_ms_scheduled_accurate(1, [this]() {
				tick(true);
			});
		} else {
			setRGB(data->color.r, data->color.g, data->color.b);
		}
	}
};

Show A('A', R1_PIN, G1_PIN, B1_PIN, &App::data.a);
Show B('B', R2_PIN, G2_PIN, B2_PIN, &App::data.b);

u32 getTime() {
	return _max(A.getTime(), B.getTime());
}

void setTime(u32 time) {
	if (App::data.show) {
		A.setTime(time);
		B.setTime(time);
	}
}

void setup() {
	analogWriteFreq(1000);
	analogWriteRange(255);
	A.setup();
	B.setup();
}

void end() {
	ended = true;
	paused = false;
	A.end();
	B.end();
}

void begin() {
	ended = false;
	paused = false;
	A.begin();
	B.begin();
}
}  // namespace Light

#endif	// __LIGHT_H__
