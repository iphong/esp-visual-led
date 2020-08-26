#include "Arduino.h"
#include "FastLED.h"
#include "espnow.h"
#include "Ticker.h"

// #define R1_PIN 12
// #define G1_PIN 14
// #define B1_PIN 13
#define R1_PIN D6
#define G1_PIN D7
#define B1_PIN D8

#define R2_PIN D1
#define G2_PIN D2
#define B2_PIN D4

namespace Light {

	class Frame {
	public:
		u8 type = 0;
		u32 start = 0;
		u32 duration = 0;
		u32 transition = 0;
		u32 size = 0;
		u8 r = 0;
		u8 g = 0;
		u8 b = 0;
	};

	class Show {
	protected:

		u8 r_pin;
		u8 g_pin;
		u8 b_pin;
		
		Ticker tmr;
		File file;
		
		Frame frame;
		u8 lastColor[3];
		u32 playTime;
		u32 lapsed;

		Frame loopFrame;
		u32 loopTime;
		u32 loopPosition;
		u32 loopStart;
		u32 loopEnd;
		
	public:
		Show(u8 r_pin, u8 g_pin, u8 b_pin): 
				r_pin(r_pin), g_pin(g_pin), b_pin(b_pin) {}
			
		Frame next() {
			Frame frame;
			if (file.available()) {
				String line = file.readStringUntil('\n');
				line.trim();
				u32 start;
				u32 duration;
				u32 transition;
				u32 size;
				u32 r;
				u32 g;
				u32 b;

				if (line.startsWith("rgb")) {
					sscanf(line.c_str(), "%*s %u %u %u %u %u %u", &start, &duration, &transition, &r, &g, &b);
					frame.type = 1;
					frame.start = start;
					frame.duration = duration;
					frame.transition = transition;
					frame.r = r;
					frame.g = g;
					frame.b = b;
				}
				else if (line.startsWith("loop")) {
					sscanf(line.c_str(), "%*s %u %u %u", &start, &duration, &size);
					frame.type = 2;
					frame.start = start;
					frame.duration = duration;
					frame.size = size;
				}
				else if (line.startsWith("end")) {
					sscanf(line.c_str(), "%*s %u", &start);
					frame.type = 3;
					frame.start = start;
				}
			}
			return frame;
		}
		void setColor(u8 r, u8 g, u8 b) {
			analogWrite(r_pin, 255 - map(r, 0, 255, 0, Config::data.brightness));
			analogWrite(g_pin, 255 - map(g, 0, 255, 0, Config::data.brightness));
			analogWrite(b_pin, 255 - map(b, 0, 255, 0, Config::data.brightness));
		}
		// void setColor(Frame *frame) {
		// 	analogWrite(r_pin, 255 - map(frame->r, 0, 255, 0, Config::data.brightness));
		// 	analogWrite(g_pin, 255 - map(frame->g, 0, 255, 0, Config::data.brightness));
		// 	analogWrite(b_pin, 255 - map(frame->b, 0, 255, 0, Config::data.brightness));
		// }
		void setColor(Frame *frame) {
			lapsed = playTime - frame->start;
			u8 r = frame->r;
			u8 g = frame->g;
			u8 b = frame->b;

			if (lapsed < frame->transition) {
				float ratio = (float)lapsed / frame->transition;
				r = (float)lastColor[0] + (frame->r - lastColor[0]) * ratio;
				g = (float)lastColor[1] + (frame->g - lastColor[1]) * ratio;
				b = (float)lastColor[2] + (frame->b - lastColor[2]) * ratio;	
				// Serial.printf("%u %u %u %f\n", lastColor[0], frame->r, r, ratio);
				// Serial.printf("%u %u %u %f\n", lastColor[1], frame->g, g, ratio);
				// Serial.printf("%u %u %u %f\n", lastColor[2], frame->b, b, ratio);
			}
			analogWrite(r_pin, 255 - map(r, 0, 255, 0, Config::data.brightness));
			analogWrite(g_pin, 255 - map(g, 0, 255, 0, Config::data.brightness));
			analogWrite(b_pin, 255 - map(b, 0, 255, 0, Config::data.brightness));
		}
		void begin() {
			pinMode(r_pin, OUTPUT);
			pinMode(g_pin, OUTPUT);
			pinMode(b_pin, OUTPUT);

			analogWrite(r_pin, 255);
			analogWrite(g_pin, 255);
			analogWrite(b_pin, 255);

			file = Config::fs->open("/seq/3.txt", "r");
			file.setTimeout(0);
			frame = next();

			tmr.attach_ms_scheduled_accurate(1, [this]() {
				switch (frame.type) {
					case 1:
						setColor(&frame);
						break;
					case 2:
						if (loopTime == 0) {
							// Serial.println("loop start");
							loopStart = file.position();
							loopFrame = next();
						}
						if (loopFrame.type == 1) {
							setColor(&loopFrame);
						}
						if (++loopTime > loopFrame.start + loopFrame.duration) {
							// Serial.println("loop next");
							if (loopFrame.type == 1) {
								lastColor[0] = loopFrame.r;
								lastColor[1] = loopFrame.g;
								lastColor[2] = loopFrame.b;
							}
							loopFrame = next();
							if (loopFrame.type == 3) {
								loopTime = 0;
								loopEnd = file.position();
								file.seek(loopStart);
							}
						}
						break;
					case 3:
						// Serial.println("ended.");
						loopTime = 0;
						playTime = 0;
						file.seek(0);
						frame = next();
						return;
						break;
				}
				if (++playTime - frame.start >= frame.duration) {
					if (frame.type == 2) {
						loopTime = 0;
						file.seek(loopEnd);
					}
					// Serial.printf("%d %u -- ", frame.type, frame.start);
					// Serial.println("next");
					if (frame.type == 1) {
						lastColor[0] = frame.r;
						lastColor[1] = frame.g;
						lastColor[2] = frame.b;
					}
					frame = next();
				}
			});
		}
	};

	Light::Show outputA(R1_PIN, G1_PIN, B1_PIN);

	void setup() {
		analogWriteFreq(40000);
		analogWriteRange(255);
		outputA.begin();
	}

	void loop() {

	}
}
