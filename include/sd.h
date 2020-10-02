#include "Arduino.h"
#include "FS.h"
#include "SdFat.h"

#ifndef __SD_H__
#define __SD_H__

namespace SD {
	using namespace sdfat;

	SdFat fs;
	bool sdOK;
	sdfat::File file;

	sdfat::File open(String path) {
		return open(path.c_str());
	}
	sdfat::File open(const char *path) {
		if (file.isOpen()) file.close();
		file = fs.open(path, (O_RDWR | O_CREAT));
		Serial.printf("File openned: %s.\n", path);
		return file;
	}
	size_t write(const uint8_t *buf, size_t size) {
		Serial.printf("File write: %i.\n", size);
		return file.write(buf, size);
	}
	size_t write(const char *buf, size_t size) {
		Serial.printf("File write: %i.\n", size);
		return file.write(buf, size);
	}
	bool close() {
		Serial.printf("File closed.\n");
		return file.close();
	}
	void setup() {
		sdOK = fs.begin(D8);
		Serial.println(sdOK ? F("SD card initialized.") : F("SD card init failed!"));

		// open("_test1.txt");
		// write("Hello 1", 7);
		// close();
		// open("/show/1.json");
		// write("{}", 2);
		// close();
		// fs.chdir("/show");
		// open("_test3.txt");
		// write("Hello 3", 7);
		// close();
		// Serial.println("DONE SD CARD TEST");

		
		// fs.chdir("/");
		// open("_test1.txt");
		// while (file.available()) {
		// 	Serial.write(file.read());
		// } 
		// close();
		// open("/show/1.json");
		// while (file.available()) {
		// 	Serial.write(file.read());
		// } 
		// close();
		// fs.chdir("/show");
		// open("_test3.txt");
		// while (file.available()) {
		// 	Serial.write(file.read());
		// } 
		// close();
	}
}

#endif
