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

   public:
	bool running = false;
	bool paused = false;
	bool repeat = false;

	Show() :id('#') {}

	Show(const char id, u8 r_pin, u8 g_pin, u8 b_pin)
		: id(id), r_pin(r_pin), g_pin(g_pin), b_pin(b_pin) {
	}

	bool isActive() {
		return id != '#';
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
		if (!file) return;
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
				if (!tick(false))
					continue;
			}
		} else if (offset < -1) {
			while (frame.start + frame.duration < time) {
				frame = next();
				currentTime = frame.start;
			}
			while (currentTime < time) {
				if (!tick(false))
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
				// loopTime += shouldUpdate ? 1 : 1;
				if (++loopTime >= loopFrame.start + loopFrame.duration) {
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
		if (++currentTime >= frame.start + frame.duration) {
			currentTime = frame.start + frame.duration;
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
		r = map(r, 0, 255, 0, App::data.brightness);
		g = map(g, 0, 255, 0, App::data.brightness);
		b = map(b, 0, 255, 0, App::data.brightness);
		analogWrite(r_pin, r);
		analogWrite(g_pin, g);
		analogWrite(b_pin, b);
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
};

Show A('A', R1_PIN, G1_PIN, B1_PIN);
Show B('B', R2_PIN, G2_PIN, B2_PIN);
// Show C('C', 2);

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


// -------------------------

// Show A('A', R1_PIN, G1_PIN, B1_PIN);
// Show B('B', R2_PIN, G2_PIN, B2_PIN);

// const Show shows[8] = {
// 	Show('A', R1_PIN, G1_PIN, B1_PIN),
// 	Show('B', R2_PIN, G2_PIN, B2_PIN)};

// typedef std::function<void(Show*)> show_iterator;

// void each(show_iterator callback) {
// 	for (auto show : shows) {
// 		if (show.isActive() != ' ') {
// 			callback(&show);
// 		}
// 	}
// }

// void setup() {
// 	analogWriteFreq(1000);
// 	analogWriteRange(255);
// 	each([](Show* show) { show->setup(); });
// }
// void end() {
// 	each([](Show* show) { show->end(); });
// }
// void begin() {
// 	each([](Show* show) { show->begin(); });
// }
// void pause() {
// 	each([](Show* show) { show->pause(); });
// }
// void resume() {
// 	each([](Show* show) { show->resume(); });
// }
// void toggle() {
// 	each([](Show* show) { show->toggle(); });
// }
// void setTime(u32 time) {
// 	A.setTime(time);
// 	B.setTime(time);
// 	each([time](Show* show) { show->setTime(time); });
// }
// bool isRunning() {
// 	for (auto show : shows) {
// 		if (show.isActive() != '#' && !A.running) {
// 			return false;
// 		}
// 	}
// 	return true;
// }
// bool isPaused() {
// 	for (auto show : shows) {
// 		if (show.isActive() != '#' && !A.paused) {
// 			return false;
// 		}
// 	}
// 	return true;
// }
// }  // namespace LED

// --------------------------

#endif
