#include "Arduino.h"
#include "Ticker.h"
#include "espnow.h"

#ifndef __LED_H__
#define __LED_H__

namespace LED {

bool running = false;
bool paused = false;
bool repeat = false;

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
	RGB_FRAME = 0x01,
	END_FRAME = 0x02,
	LOOP_FRAME = 0x03
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

	void set(App::RGB* c) {
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
	u8 type;
	u32 start = 0;
	u32 duration = 0;
	u32 transition = 0;
	u8 r = 0;
	u8 g = 0;
	u8 b = 0;
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
	u32 startTime;
	u32 holdTime;

	Frame loopFrame;
	u32 loopTime;
	u32 loopStart;
	u32 loopEnd;

	float ratio;

	App::Output* data;

   public:
	Show(const char id, u8 r_pin, u8 g_pin, u8 b_pin, App::Output* d)
		: id(id), r_pin(r_pin), g_pin(g_pin), b_pin(b_pin), data(d) {
	}

	u32 getTime() {
		return playTime;
	}
	u32 readUint32(unsigned char* buffer) {
		return (u32)(buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3]);
	}
	Frame next() {
		u8 b[16];
		Frame f;
		if (file.available()) {
			file.readBytes((char*)b, 16);
			f.type = b[0];
			f.start = readUint32(&b[1]);
			f.duration = readUint32(&b[5]);
			f.transition = readUint32(&b[9]);
			f.r = b[13];
			f.g = b[14];
			f.b = b[15];
			// for (auto b : b) LOGD("%02X ", b);
			// LOGD("\n%X %u %u\n", f.type, f.start, f.duration, frame.transition);
		}
		return f;
	}

	void setColor(Frame* frame, u32 lapsed) {
		if (frame->transition && lapsed <= frame->transition) {
			// Compute color value during transition
			ratio = (float)lapsed / frame->transition;

			if (frame->r > lastColor.r)
				color.r = lastColor.r + (frame->r - lastColor.r) * ratio;
			else
				color.r = lastColor.r - (lastColor.r - frame->r) * ratio;

			if (frame->g > lastColor.g)
				color.g = lastColor.g + (frame->g - lastColor.g) * ratio;
			else
				color.g = lastColor.g - (lastColor.g - frame->g) * ratio;

			if (frame->b > lastColor.b)
				color.b = lastColor.b + (frame->b - lastColor.b) * ratio;
			else
				color.b = lastColor.b - (lastColor.b - frame->b) * ratio;

			// LOGD("%f %u %u %u\n", ratio, color.r, color.g, color.b);

		} else {
			color.set(frame->r, frame->g, frame->b);
		}
		setRGB(
			map(color.r, 0, 255, 0, App::data.brightness),
			map(color.g, 0, 255, 0, App::data.brightness),
			map(color.b, 0, 255, 0, App::data.brightness));
	}

	void end() {
		if (file) file.close();
		tmr.detach();
		playTime = 0;
		loopTime = 0;
		setRGB(0, 0, 0);
	}

	void setTime(u32 time) {
		static u32 count;
		int offset = (int)playTime - (int)time;
#ifdef SYNC_LOGS
		LOGD("Time offset: %c %i\n", id, offset);
#endif
		if (!running || !file || !time)
			begin();
		else if (paused)
			resume();
		if (offset > 1) {
			holdTime = playTime - time;
		} else if (offset < -1) {
			count = 8000;
			while (--count && playTime < time) {
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
					setColor(&frame, playTime - frame.start);
				break;
			case LOOP_FRAME:
				if (loopTime == 0) {
					// LOGD("\n * ");
					loopStart = file.position();
					loopFrame = next();
				}
				if (shouldSetColor && loopFrame.type == RGB_FRAME) {
					setColor(&loopFrame, loopTime - loopFrame.start);
				}
				if (++loopTime >= loopFrame.start + loopFrame.duration) {
					// LOGD(" * ");
					if (loopFrame.type == RGB_FRAME) {
						lastColor.set(loopFrame.r, loopFrame.g, loopFrame.b);
					}
					loopFrame = next();
					if (loopFrame.type == END_FRAME) {
						loopTime = 0;
						loopEnd = file.position();
						file.seek(loopStart);
					}
				}
				break;
			case END_FRAME:
				// LOGL("ended");
				repeat ? begin() : end();
		}
		if (++playTime >= frame.start + frame.duration) {
			// LOGD("\nframe");
			if (frame.type == LOOP_FRAME) {
				loopTime = 0;
				file.seek(loopEnd);
			}
			if (frame.type == RGB_FRAME) {
				lastColor.set(frame.r, frame.g, frame.b);
			}
			frame = next();
		}
		return true;
	}

	void setRGB(u8 r, u8 g, u8 b) {
#ifndef MASTER
#ifdef INVERTED_RGB
		analogWrite(r_pin, 255 - r);
		analogWrite(g_pin, 255 - g);
		analogWrite(b_pin, 255 - b);
#else
		analogWrite(r_pin, r);
		analogWrite(g_pin, g);
		analogWrite(b_pin, b);
#endif
#endif
	}

	void setup() {
		pinMode(r_pin, OUTPUT);
		pinMode(g_pin, OUTPUT);
		pinMode(b_pin, OUTPUT);
		setRGB(0, 0, 0);
	}

	void begin() {
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
			startTime = millis();
		} else {
			setRGB(data->color.r, data->color.g, data->color.b);
		}
		startTime = millis();
	}
};

Show A('A', R1_PIN, G1_PIN, B1_PIN, &App::data.a);
Show B('B', R2_PIN, G2_PIN, B2_PIN, &App::data.b);

u32 getTime() {
	return _max(A.getTime(), B.getTime());
}

using callback_t = std::function<void()>;

callback_t onBegin;
callback_t onEnd;

void setTime(u32 time) {
#ifndef MASTER
	if (App::data.show) {
		A.setTime(time);
		B.setTime(time);
	}
#endif
}

void setup() {
#ifndef MASTER
	analogWriteFreq(100);
	analogWriteRange(255);
	A.setup();
	B.setup();
#endif
}

void end() {
	running = false;
	paused = false;
	A.end();
	B.end();
	if (onEnd) onEnd();
}

void begin() {
	running = true;
	paused = false;
	A.begin();
	B.begin();
	if (onBegin) onBegin();
}
bool isRunning() {
	return running;
}
bool isPaused() {
	return paused;
}
}  // namespace LED

#endif
