#include <c_types.h>
#include <string>
#include <functional>
#include <Stream.h>

#ifndef __PROTOCOL_H__
#define __PROTOCOL_H__

using namespace std;

static u8 syncword[] = {0x24};
static u8 broadcast[] = {0xff,0xff,0xff,0xff,0xff,0xff};

class Transport {
   protected:
	Stream *_stream;
	function<void(u8*, u8*, u8)> _receive;

	u8 buffer[64];
	u8 length = 0;
	u8 crc = 0;
	bool synced = false;

	bool equals(u8 *a, u8 *b, u8 size, u8 offset = 0) {
		for (auto i = offset; i < (offset + size); i++)
			if (a[i] != b[i])
				return false;
		return true;
	}
	bool isValidStart() {
		return synced = synced || equals(buffer, syncword, sizeof(syncword));
	}
	bool isValidSize() {
		return length >= (u8)(sizeof(syncword) + buffer[1] + 2);
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

	void receive(function<void(u8*, u8*, u8)> cb) { _receive = cb; }

	void parse(u8 data) {
		buffer[length++] = data;
		if (isValidFrame()) {
			synced = false;
			u8 size = buffer[1];
			u8 *buf = &buffer[2];

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
	void parse(u8 *data, u8 size) {
		for (auto i = 0; i < size; i++) parse(data[i]);
	}
	void send(u8* addr, u8 *data, u8 size) {
		u8 sum = 0;
		u8 len = size + sizeof(syncword) + 2;
		u8 payload[len];
		for (auto i = 0; i < (u8)sizeof(syncword); i++) {
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
	void send(u8* addr, const char *data, size_t size) {
		send(addr, (u8 *)data, (u8)size);
	}
	void send(u8* addr, string data) {
		send(addr, data.c_str(), data.length());
	}
	void send(u8 * data, u8 size) {
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
