#include "Arduino.h"
#include "espnow.h"
#include "Ticker.h"

#define R1_PIN 14
#define G1_PIN 13
#define B1_PIN 4

#define R2_PIN 5
#define G2_PIN 12
#define B2_PIN 15

namespace Light {

	bool paused = false;
	bool ended = true;

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
		u32 loopStartTime;

		double lapsed;
		String line;
		u8 lastColor[3];

		App::Output *data;

	public:
		Show(const char id, u8 r_pin, u8 g_pin, u8 b_pin, App::Output *d) :
				id(id), r_pin(r_pin), g_pin(g_pin), b_pin(b_pin) {
					data = d;
				}

		u32 getTime() {
			return playTime;
		}

		Frame parse(String line) {
			Frame frame;
			if (line.startsWith("C")) {
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
			} else if (line.startsWith("L")) {
				frame.type = LOOP_FRAME;
				sscanf(
						line.c_str(),
						"%*s %u %u",
						&frame.start,
						&frame.duration
				);
			} else if (line.startsWith("E")) {
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

//		u8 buf[16];
//		u32 readUint32(u8 *data) {
//			return (u32)data[0] << 24 | (data[1] << 16 | (data[2] << 8 | data[3]));
//		}
//		Frame next2() {
//			Frame frame;
//			if (file.available()) {
//				u8 type = file.peek();
//				switch (type) {
//					case 0x01:
//						file.readBytes((char *)buf, 16);
//						frame.type = RGB_FRAME;
//						frame.start = readUint32(&buf[1]);
//						frame.duration = readUint32(&buf[5]);
//						frame.transition = readUint32(&buf[9]);
//						frame.r = buf[13];
//						frame.g = buf[14];
//						frame.b = buf[15];
//						break;
//					case 0x02:
//						file.readBytes((char *)buf, 9);
//						frame.type = LOOP_FRAME;
//						frame.start = readUint32(&buf[1]);
//						frame.duration = readUint32(&buf[5]);
//						break;
//					case 0x03:
//						file.readBytes((char *)buf, 5);
//						frame.type = END_FRAME;
//						frame.start = readUint32(&buf[1]);
//						break;
//				}
//			}
//			return frame;
//		}

		void setColor(Frame *frame) {
			lapsed = playTime - loopStartTime;
			if (lapsed < frame->transition) {
				// Compute color value during transition
				double ratio = lapsed / frame->transition;
				color.r = (double) lastColor[0] + (frame->r - lastColor[0]) * ratio;
				color.g = (double) lastColor[1] + (frame->g - lastColor[1]) * ratio;
				color.b = (double) lastColor[2] + (frame->b - lastColor[2]) * ratio;
				// Serial.printf("%3u %3u %4u %02f\n", lastColor[0], frame->r, color.r, ratio);
				// Serial.printf("%3u %3u %4u %02f\n", lastColor[1], frame->g, color.g, ratio);
				// Serial.printf("%3u %3u %4u %02f\n", lastColor[2], frame->b, color.b, ratio);
			} else {
				color.r = frame->r;
				color.g = frame->g;
				color.b = frame->b;
			}
			setRGB(
				map(color.r, 0, 255, 0, App::data.brightness),
				map(color.g, 0, 255, 0, App::data.brightness),
				map(color.b, 0, 255, 0, App::data.brightness)
			);
		}

		void end() {
			tmr.detach();
			if (file) file.close();
			playTime = 0;
			loopTime = 0;
			setRGB(0, 0, 0);
		}

		void setTime(u32 time) {
			LOGD("Play time: %u, sync time: %u\n", playTime, time);
			if (!file || !time) begin();
			if (playTime > time + 2 ) {
				holdTime = playTime - time;
			} else if (playTime < time - 2) {
				while (playTime < time) {
					if (!tick(false)) continue;
				}
			}
		}

		void begin() {
			if (!ended) end();
			if (App::data.show != 0) {
				// String path = "/show/" + String(App::data.show) + "/" + String(App::data.channel) + (id);
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
				setRGB(
					data->color.r,
					data->color.g,
					data->color.b
				);
			}
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
						// LOGD("\nloop ");
						loopStart = file.position();
						loopStartTime = playTime;
						loopFrame = next();
					}
					if (shouldSetColor && loopFrame.type == RGB_FRAME) {
						setColor(&loopFrame);
					}
					if (++loopTime > loopFrame.start + loopFrame.duration) {
						// LOGD(" * ");
						lastColor[0] = loopFrame.r;
						lastColor[1] = loopFrame.g;
						lastColor[2] = loopFrame.b;
						loopStartTime = playTime;
						loopFrame = next();
						if (loopFrame.type == END_FRAME) {
							loopTime = 0;
							loopEnd = file.position();
							file.seek(loopStart);
						}
					}
					break;
				case END_FRAME:
					// LOGD("\nended.");
					loopTime = 0;
					playTime = 0;
					loopStartTime = 0;
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
				// LOGD("\nframe");
				if (frame.type == RGB_FRAME) {
					lastColor[0] = frame.r;
					lastColor[1] = frame.g;
					lastColor[2] = frame.b;
				}
				frame = next();
				loopStartTime = frame.start;
			}
			return true;
		}

		void setRGB(u8 r, u8 g, u8 b) {
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
	};

	Light::Show A('A', R1_PIN, G1_PIN, B1_PIN, &App::data.a);
	Light::Show B('B', R2_PIN, G2_PIN, B2_PIN, &App::data.b);

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
		analogWriteFreq(App::data.frequency);
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
