#include <functional>

#include "def.h"

#ifndef __LED_H__
#define __LED_H__

namespace LED {
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

	FrameData frame;  // Active frame
	u32 currentTime;  // Current playing time

	FrameData loopFrame;
	u32 loopTime;
	u32 loopStart;
	u32 loopEnd;

	float ratio;
	bool settingTime = false;

   public:
	bool running = false;
	bool paused = false;
	bool repeat = false;

	Show(const char id, u8 r_pin, u8 g_pin, u8 b_pin)
		: id(id), r_pin(r_pin), g_pin(g_pin), b_pin(b_pin) {
	}

	u32 readUint32(unsigned char* buffer) {
		return (u32)(buffer[0] << 24 | buffer[1] << 16 | buffer[2] << 8 | buffer[3]);
	}
	FrameData f;
	u8 b[16];
	FrameData next() {
		if (file.available() >= 16) {
			file.readBytes((char*)b, 16);
			memcpy(&f, b, 16);
		}
		// LOGD("- %u: %02x %02x %02x - %u %u %u\n", f.type, f.r, f.g, f.b, f.start, f.duration, frame.transition);
		return f;
	}
	bool isInLoop;
	FrameData prev() {
		isInLoop = 0;
		size_t pos = file.position();
		if (pos >= 32) {
			file.seek(pos - 32);
			file.readBytes((char*)b, 16);
			memcpy(&f, b, 16);
		}
		if (!isInLoop && f.type == END_FRAME) {
			isInLoop = true;
			while (isInLoop) prev();
		}
		if (isInLoop && f.type == LOOP_FRAME) {
			isInLoop = false;
		}
		// LOGD("- %u: %02x %02x %02x - %u %u %u\n", f.type, f.r, f.g, f.b, f.start, f.duration, frame.transition);
		return f;
	}

	void
	setTransition(FrameData* frame, u32 lapsed) {
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
		setRGB(color.r, color.g, color.b);
	}

	void end() {
		if (file) file.close();
		tmr.detach();
		setRGB(0, 0, 0);
		currentTime = 0;
		loopTime = 0;
		running = false;
		paused = false;
	}

	void pause() {
		paused = true;
	}

	void resume() {
		paused = false;
	}

	u32 getTime() {
		return currentTime;
	}
	void setTime(u32 time) {
		settingTime = true;
		int offset = (int)currentTime - (int)time;
#ifdef SYNC_LOGS
		LOGD("Time offset: %c %i\n", id, offset);
#endif
		if (!paused) {
			if (offset > 16) {
				while (running && frame.start >= time) {
					currentTime = frame.start;
					frame = prev();
				}
				while (running && currentTime < time) {
					if (!tick(false)) break;
				}
			} else if (offset < -16) {
				while (running && frame.start + frame.duration < time) {
					frame = next();
					currentTime = frame.start;
				}
				while (running && currentTime < time) {
					if (!tick(false)) break;
				}
			}
		}
		settingTime = false;
	}
	// true = playing
	// false = ended
	bool tick(bool shouldUpdate = true) {
		switch (frame.type) {
			case RGB_FRAME:
				if (shouldUpdate)
					setTransition(&frame, currentTime - frame.start);
				break;
			case LOOP_FRAME:
				if (loopTime == 0) {
					// LOGD("\n * ");
					loopStart = file.position();
					loopFrame = next();
				}
				if (shouldUpdate && loopFrame.type == RGB_FRAME) {
					setTransition(&loopFrame, loopTime - loopFrame.start);
				}
				// loopTime += shouldUpdate ? 1 : 1;
				if (loopTime++ >= loopFrame.start + loopFrame.duration) {
					loopTime = loopFrame.start + loopFrame.duration;
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
		// currentTime += shouldUpdate ? 1 : 1;
		if (currentTime++ >= frame.start + frame.duration) {
			currentTime = frame.start + frame.duration;
			// LOGD("\nframe");
			if (frame.type == LOOP_FRAME) {
				loopTime = 0;
				file.seek(loopEnd);
			}
			if (frame.type == RGB_FRAME) {
				lastColor.set(frame.r, frame.g, frame.b);
			}
			if (frame.type == END_FRAME) {
				end();
				return false;
			}
			frame = next();
		}
		return true;
	}

	void setRGB(u8 r, u8 g, u8 b) {
		r = map(r, 0, 255, 0, App::data.brightness * 1.0);
		g = map(g, 0, 255, 0, App::data.brightness * 0.6);
		b = map(b, 0, 255, 0, App::data.brightness * 0.6);
		analogWriteMode(r_pin, (int)r, false);
		analogWriteMode(g_pin, (int)g, false);
		analogWriteMode(b_pin, (int)b, false);
	}

	void setup() {
		pinMode(r_pin, OUTPUT_OPEN_DRAIN);
		pinMode(g_pin, OUTPUT_OPEN_DRAIN);
		pinMode(b_pin, OUTPUT_OPEN_DRAIN);
		setRGB(0, 0, 0);
	}

	void begin() {
		end();
		String path = "/show/" + String(App::data.show) + (id) + ".lsb";
		if (!App::fs->exists(path)) {
			LOGD("Show not found: %s\n", path.c_str());
			return;
		}
		LOGD("Playing show: %s\n", path.c_str());
		running = 1;
		paused = 0;
		file = App::fs->open(path, "r");
		file.setTimeout(0);
		frame = next();
		tmr.attach_ms_scheduled_accurate(1, [this]() {
			if (!paused && !settingTime) tick(true);
		});
	}
};

Show A('A', R1_PIN, G1_PIN, B1_PIN);
Show B('B', R2_PIN, G2_PIN, B2_PIN);

void setup() {
	analogWriteFreq(10000);
	analogWriteRange(255);
	A.setup();
	B.setup();
}
void end() {
	A.end();
	B.end();
}
void begin() {
	A.begin();
	B.begin();
}
void pause() {
	A.pause();
	B.pause();
}
void resume() {
	A.resume();
	B.resume();
}
void setTime(u32 time) {
	A.setTime(time);
	B.setTime(time);
}
bool isRunning() {
	return A.running || B.running;
}
bool isPaused() {
	return A.paused && B.paused;
}
void setRGB(u8* buf, u8 len) {
	u8 r = buf[0];
	u8 g = buf[1];
	u8 b = buf[2];
	A.setRGB(r, g, b);
	B.setRGB(r, g, b);
}

}  // namespace LED

#endif
