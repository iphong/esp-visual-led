#include "Arduino.h"
#include "espnow.h"
#include "Ticker.h"

#define R1_PIN D6
#define G1_PIN D7
#define B1_PIN D8

#define R2_PIN D1
#define G2_PIN D2
#define B2_PIN D4

namespace Light {

	bool paused;
	bool ended;

	void pause() {
		paused = true;
	}

	void resume() {
		paused = false;
	}

	void toggle() {
		if (paused) resume();
		else pause();
	}

	enum FrameType {
		RGB_FRAME = 1,
		LOOP_FRAME = 2,
		END_FRAME = 3
	};

	struct RGB {
		u8 r;
		u8 g;
		u8 b;

		void set(u8 *d) {
			r = d[0];
			g = d[1];
			b = d[2];
		}
	};

	class Frame {
	public:
		FrameType type;
		u32 start = 0;
		u32 duration = 0;
		u32 transition = 0;
		RGB color;
		u32 r = 0;
		u32 g = 0;
		u32 b = 0;
	};

	class Show {
	protected:

		const char id;
		u8 r_pin;
		u8 g_pin;
		u8 b_pin;

		RGB color;

		Ticker tmr;
		File file;

		Frame frame; // Active frame
		u32 playTime; // Current playing time
		u16 holdTime = 0;

		Frame loopFrame;
		u32 loopTime;
		u32 loopStart;
		u32 loopEnd;

		u32 lapsed;
		String line;
		u32 lastColor[3];

	public:
		Show(const char id, u8 r_pin, u8 g_pin, u8 b_pin) :
				id(id), r_pin(r_pin), g_pin(g_pin), b_pin(b_pin) { }

		u32 getTime() {
			return playTime;
		}

		Frame parse(String line) {
			Frame frame;
			if (line.startsWith("rgb")) {
				frame.type = RGB_FRAME;
				sscanf(
						line.c_str(),
						"%*s %u %u %u %u %u %u",
						&frame.start,
						&frame.duration,
						&frame.transition,
						&frame.r,
						&frame.g,
						&frame.b
				);
			} else if (line.startsWith("loop")) {
				frame.type = LOOP_FRAME;
				sscanf(
						line.c_str(),
						"%*s %u %u",
						&frame.start,
						&frame.duration
				);
			} else if (line.startsWith("end")) {
				frame.type = END_FRAME;
				sscanf(
						line.c_str(),
						"%*s %u",
						&frame.start
				);
			}
			return frame;
		}

		Frame next() {
			if (file.available()) {
				line = file.readStringUntil('\n');
				line.trim();
				return parse(line);
			}
			return frame;
		}

		void setColor(Frame *frame) {
			lapsed = playTime - frame->start;
			color.r = frame->r;
			color.g = frame->g;
			color.b = frame->b;

			if (lapsed < frame->transition) {
				// Compute color value during transition
				float ratio = (float) lapsed / frame->transition;
				color.r = (float) lastColor[0] + (frame->r - lastColor[0]) * ratio;
				color.g = (float) lastColor[1] + (frame->g - lastColor[1]) * ratio;
				color.b = (float) lastColor[2] + (frame->b - lastColor[2]) * ratio;
				// Serial.printf("%u %u %u %f\n", lastColor[0], frame->r, r, ratio);
				// Serial.printf("%u %u %u %f\n", lastColor[1], frame->g, g, ratio);
				// Serial.printf("%u %u %u %f\n", lastColor[2], frame->b, b, ratio);
			}
			analogWrite(r_pin, 255 - map(color.r, 0, 255, 0, Config::data.brightness));
			analogWrite(g_pin, 255 - map(color.g, 0, 255, 0, Config::data.brightness));
			analogWrite(b_pin, 255 - map(color.b, 0, 255, 0, Config::data.brightness));
		}

		void end() {
			tmr.detach();
			if (file) file.close();
			playTime = 0;
			loopTime = 0;
			analogWrite(r_pin, 255);
			analogWrite(g_pin, 255);
			analogWrite(b_pin, 255);
		}

		void setTime(u32 time) {
			LOG("Play time: %u, sync time: %u\n", playTime, time);
			if (!file || !time) begin();
			if (playTime > time ) {
				holdTime = playTime - time;
			} else while (playTime < time) {
				if (!tick(false)) continue;
			}
		}

		void begin() {
			end();
			String path = "/show/" + String(Config::data.show) + "/" + String(Config::data.channel) + (id);
			if (!Config::fs->exists(path)) {
				Serial.printf("Sequence file not found: %s\n", path.c_str());
				return;
			}
			file = Config::fs->open(path, "r");
			file.setTimeout(0);
			frame = next();

			tmr.attach_ms_scheduled_accurate(1, [this]() {
				tick(true);
			});
		}

		// true = playing
		// false = ended
		bool tick(bool shouldSetColor = true) {
			if (holdTime) {
				holdTime--;
				return true;
			}
			if (paused) return false;
			switch (frame.type) {
				case RGB_FRAME:
					if (shouldSetColor) setColor(&frame);
					break;
				case LOOP_FRAME:
					if (loopTime == 0) {
						// LOG("\nloop ");
						loopStart = file.position();
						loopFrame = next();
					}
					if (shouldSetColor && loopFrame.type == RGB_FRAME) {
						setColor(&loopFrame);
					}
					if (++loopTime > loopFrame.start + loopFrame.duration) {
						// LOG(" * ");
						lastColor[0] = loopFrame.r;
						lastColor[1] = loopFrame.g;
						lastColor[2] = loopFrame.b;
						loopFrame = next();
						if (loopFrame.type == END_FRAME) {
							loopTime = 0;
							loopEnd = file.position();
							file.seek(loopStart);
						}
					}
					break;
				case END_FRAME:
					// LOG("\nended.");
					loopTime = 0;
					playTime = 0;
					file.seek(0);
					frame = next();
					// end();
					return false;
			}
			if (++playTime - frame.start >= frame.duration && frame.type) {
				if (frame.type == LOOP_FRAME) {
					loopTime = 0;
					file.seek(loopEnd);
				}
				// LOG("\nframe");
				if (frame.type == RGB_FRAME) {
					lastColor[0] = frame.r;
					lastColor[1] = frame.g;
					lastColor[2] = frame.b;
				}
				frame = next();
			}
			return true;
		}

		void setup() {
			pinMode(r_pin, OUTPUT);
			pinMode(g_pin, OUTPUT);
			pinMode(b_pin, OUTPUT);

			analogWrite(r_pin, 255);
			analogWrite(g_pin, 255);
			analogWrite(b_pin, 255);
		}
	};

	Light::Show A('A', R1_PIN, G1_PIN, B1_PIN);
	Light::Show B('B', R2_PIN, G2_PIN, B2_PIN);

	u32 getTime() {
		return A.getTime();
	}

	void setTime(u32 time) {
		A.setTime(time);
		B.setTime(time);
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
}
