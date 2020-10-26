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
		if (file.available()) {
			file.readBytes((char*)b, 16);
			memcpy(&f, b, 16);
		}
		LOGD("- %u: %02x %02x %02x - %u %u %u\n", f.type, f.r, f.g, f.b, f.start, f.duration, frame.transition);
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
		LOGD("- %u: %02x %02x %02x - %u %u %u\n", f.type, f.r, f.g, f.b, f.start, f.duration, frame.transition);
		return f;
	}
	// FrameData next() {
	// 	u8 b[16];
	// 	FrameData f;
	// 	if (file.available()) {
	// 		file.readBytes((char*)b, 16);
	// 		f.type = b[0];
	// 		f.start = readUint32(&b[1]);
	// 		f.duration = readUint32(&b[5]);
	// 		f.transition = readUint32(&b[9]);
	// 		f.r = b[13];
	// 		f.g = b[14];
	// 		f.b = b[15];
	// 		// for (auto b : b) LOGD("%02X ", b);
	// 		// LOGD("\n%X %u %u\n", f.type, f.start, f.duration, frame.transition);
	// 	}
	// 	return f;
	// }
	// FrameData prev() {
	// 	static bool isInLoop = 0;
	// 	u8 b[16];
	// 	FrameData f;
	// 	size_t pos = file.position();
	// 	if (pos >= 32) {
	// 		file.seek(pos - 32);
	// 		file.readBytes((char*)b, 16);
	// 		f.type = b[0];
	// 		f.start = readUint32(&b[1]);
	// 		f.duration = readUint32(&b[5]);
	// 		f.transition = readUint32(&b[9]);
	// 		f.r = b[13];
	// 		f.g = b[14];
	// 		f.b = b[15];
	// 		// for (auto b : b) LOGD("%02X ", b);
	// 		// LOGD("\n%X %u %u\n", f.type, f.start, f.duration, frame.transition);
	// 	}
	// 	if (!isInLoop && f.type == END_FRAME) {
	// 		isInLoop = true;
	// 		while (isInLoop) prev();
	// 	}
	// 	if (isInLoop && f.type == LOOP_FRAME) {
	// 		isInLoop = false;
	// 	}
	// 	return f;
	// }

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
		setRGB(
			map(color.r, 0, 255, 0, App::data.brightness),
			map(color.g, 0, 255, 0, App::data.brightness),
			map(color.b, 0, 255, 0, App::data.brightness));
	}

	void end() {
		if (file) file.close();
		tmr.detach();
		setRGB(0, 0, 0);
		currentTime = 0;
		loopTime = 0;
		running = 0;
		paused = 0;
	}

	void pause() {
		paused = true;
	}

	void resume() {
		paused = false;
	}

	void toggle() {
		paused = !paused;
	}

	u32 getTime() {
		return currentTime;
	}
	void setTime(u32 time) {
		int offset = (int)currentTime - (int)time;
#ifdef SYNC_LOGS
		LOGD("Time offset: %c %i\n", id, offset);
#endif
		if (!running || !file || !time)
			begin();
		else if (paused)
			resume();
		if (offset > 1) {
			while (frame.start >= time) {
				frame = prev();
				currentTime = frame.start;
			}
			while (currentTime < time) {
				if (!tick(true))
					continue;
			}
		} else if (offset < -1) {
			while (frame.start + frame.duration < time) {
				frame = next();
				currentTime = frame.start;
			}
			while (currentTime < time) {
				if (!tick(true))
					continue;
			}
		}
	}
	// true = playing
	// false = ended
	bool tick(bool shouldUpdate = true) {
		if (paused & shouldUpdate)
			return false;
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
		if (++currentTime >= frame.start + frame.duration) {
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
		running = 1;
		paused = 0;
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
	}
};	// namespace LED

Show A('A', R1_PIN, G1_PIN, B1_PIN);
Show B('B', R2_PIN, G2_PIN, B2_PIN);

void setup() {
#ifndef MASTER
	analogWriteFreq(100);
	analogWriteRange(255);
	A.setup();
	B.setup();
#endif
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
void toggle() {
	A.toggle();
	B.toggle();
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
}  // namespace LED

#endif
