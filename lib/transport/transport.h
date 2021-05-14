#ifdef ESP32
#include <arduino.h>
#else
#include <c_types.h>
#include <string>
#include <functional>
#include <Stream.h>
#endif

#ifndef __PROTOCOL_H__
#define __PROTOCOL_H__

using namespace std;

static uint8_t syncword[] = {0x24};
static uint8_t broadcast[] = {0xff,0xff,0xff,0xff,0xff,0xff};

class Transport {
   protected:
	Stream *_stream;
	function<void(uint8_t*, uint8_t*, uint8_t)> _receive;

	uint8_t buffer[64];
	uint8_t length = 0;
	uint8_t crc = 0;
	bool synced = false;

	bool equals(uint8_t *a, uint8_t *b, uint8_t size, uint8_t offset = 0) {
		for (auto i = offset; i < (offset + size); i++)
			if (a[i] != b[i])
				return false;
		return true;
	}
	bool isValidStart() {
		return synced = synced || equals(buffer, syncword, sizeof(syncword));
	}
	bool isValidSize() {
		return length >= (uint8_t)(sizeof(syncword) + buffer[1] + 2);
	}
	bool checksum() {
		return buffer[length - 1] == crc;
	}
	bool isValidFrame() {
		return isValidStart() && isValidSize() && checksum();
	}

   public:
	Transport();
	Transport(Stream *stream) : _stream(stream) {}

	void receive(function<void(uint8_t*, uint8_t*, uint8_t)> cb) { _receive = cb; }

	void parse(uint8_t data) {
		buffer[length++] = data;
		if (isValidFrame()) {
			synced = false;
			uint8_t size = buffer[1];
			uint8_t *buf = &buffer[2];

			if (_receive)
				_receive(broadcast, buf, size);

			// LOGD(":: receive %u bytes (0x%02X): ", size, crc);
			// for (auto i = 0; i < size; i++) {
			// 	LOGD("%02X ", buf[i]);
			// }
			// LOGL();
		}
		crc += data;
		if (!synced) {
			length = 0;
			crc = 0;
		}
	}
	void parse(uint8_t *data, uint8_t size) {
		for (auto i = 0; i < size; i++) parse(data[i]);
	}
	void send(uint8_t* addr, uint8_t *data, uint8_t size) {
		uint8_t sum = 0;
		uint8_t len = size + sizeof(syncword) + 2;
		uint8_t payload[len];
		for (auto i = 0; i < (uint8_t)sizeof(syncword); i++) {
			payload[i] = syncword[i];
			sum += payload[i];
		}
		payload[sizeof(syncword)] = size;
		sum += size;
		for (auto i = 0; i < size; i++) {
			payload[sizeof(syncword) + 1 + i] = data[i];
			sum += data[i];
		}
		payload[len - 1] = sum;

		_stream->write(payload, len);

		// LOGD(":: sending %u bytes (0x%02X): ", size, sum);
		// for (auto i = 0; i < size; i++) {
		// 	LOGD("%02X ", data[i]);
		// }
		// LOGL();
		// parse(payload, len);
	}
	void send(uint8_t* addr, const char *data, size_t size) {
		send(addr, (uint8_t *)data, (uint8_t)size);
	}
	void send(uint8_t* addr, string data) {
		send(addr, data.c_str(), data.length());
	}
	void send(uint8_t * data, uint8_t size) {
		send(broadcast, data, size);
	}
	void send(const char * data, size_t size) {
		send(broadcast, data, size);
	}
	void send(string data) {
		send(broadcast, data);
	}
	void loop() {
		if (_stream && _stream->available()) {
			while (_stream->available()) {
				parse(_stream->read());
			}
		}
	}
};

#endif
