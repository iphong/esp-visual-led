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

	sdfat::File open(const char *path) {
		if (file.isOpen()) file.close();
		file = fs.open(path, (O_RDWR | O_CREAT));
		LOGD("File openned: %s.\n", path);
		return file;
	}

	sdfat::File openWrite(const char *path) {
		if (file.isOpen()) file.close();
		file = fs.open(path, (O_RDWR | O_CREAT | O_TRUNC));
		LOGD("File openned: %s.\n", path);
		return file;
	}

	sdfat::File open(String path) {
		return open(path.c_str());
	}

	sdfat::File openWrite(String path) {
		return openWrite(path.c_str());
	}
	size_t write(uint8_t *buf, size_t size) {
		// LOGD("File write: %i.\n", size);
		return file.write((char *)buf, size);
	}
	size_t write(const char *buf, size_t size) {
		// LOGD("File write: %i.\n", size);
		return file.write((char *)buf, size);
	}
	bool close() {
		// LOGD("File closed.\n");
		return file.close();
	}
	void setup() {
		sdOK = fs.begin(D8);
		Serial.println(sdOK ? F("SD card initialized.") : F("SD card init failed!"));
		fs.mkdir("/show");

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
		// open("/dist/bundle.js.gz");
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
