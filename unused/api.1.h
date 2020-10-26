#include <Arduino.h>
#include <ESP8266WebServer.h>
// #include <ESP8266WebServerSecure.h>
// #include <ESP8266mDNS.h>
// #include <ESP8266WiFi.h>
// #include <WiFiClient.h>

#include "def.h"
#include "app.h"
#include "led.h"
#include "net.h"
#ifdef USE_SD_CARD
#include "sd.h"
#endif

#ifndef __API_H__
#define __API_H__

namespace Api {

ESP8266WebServer server(80);
// ESP8266WebServerSecure server(443);

// The certificate is stored in PMEM
static const uint8_t x509[] PROGMEM = {
  0x30, 0x82, 0x01, 0x33, 0x30, 0x81, 0xde, 0x02, 0x09, 0x00, 0x9a, 0x83,
  0x17, 0x53, 0x74, 0x78, 0x1f, 0x1f, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86,
  0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b, 0x05, 0x00, 0x30, 0x21, 0x31,
  0x0c, 0x30, 0x0a, 0x06, 0x03, 0x55, 0x04, 0x0a, 0x0c, 0x03, 0x53, 0x44,
  0x43, 0x31, 0x11, 0x30, 0x0f, 0x06, 0x03, 0x55, 0x04, 0x03, 0x0c, 0x08,
  0x31, 0x30, 0x2e, 0x31, 0x2e, 0x31, 0x2e, 0x31, 0x30, 0x1e, 0x17, 0x0d,
  0x32, 0x30, 0x31, 0x30, 0x31, 0x37, 0x32, 0x30, 0x33, 0x39, 0x33, 0x33,
  0x5a, 0x17, 0x0d, 0x33, 0x34, 0x30, 0x36, 0x32, 0x36, 0x32, 0x30, 0x33,
  0x39, 0x33, 0x33, 0x5a, 0x30, 0x21, 0x31, 0x0c, 0x30, 0x0a, 0x06, 0x03,
  0x55, 0x04, 0x0a, 0x0c, 0x03, 0x53, 0x44, 0x43, 0x31, 0x11, 0x30, 0x0f,
  0x06, 0x03, 0x55, 0x04, 0x03, 0x0c, 0x08, 0x31, 0x30, 0x2e, 0x31, 0x2e,
  0x31, 0x2e, 0x31, 0x30, 0x5c, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48,
  0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00, 0x03, 0x4b, 0x00, 0x30,
  0x48, 0x02, 0x41, 0x00, 0xb6, 0x30, 0x6a, 0x67, 0x59, 0xac, 0xab, 0x78,
  0x40, 0xa9, 0x9a, 0xe2, 0x45, 0xbb, 0xe6, 0x4c, 0x7c, 0x7a, 0x52, 0x0b,
  0x3c, 0x28, 0xec, 0x44, 0x6c, 0xc3, 0x41, 0x08, 0x65, 0x7c, 0xaa, 0xd3,
  0x04, 0xa3, 0xc4, 0x73, 0x87, 0x2d, 0x60, 0x3d, 0x94, 0x91, 0x67, 0xc1,
  0x30, 0x7a, 0x31, 0xae, 0xf3, 0xc9, 0x3b, 0xd4, 0x6a, 0x48, 0x6c, 0x11,
  0x56, 0xa8, 0xb7, 0x18, 0xe7, 0x06, 0x27, 0x19, 0x02, 0x03, 0x01, 0x00,
  0x01, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01,
  0x01, 0x0b, 0x05, 0x00, 0x03, 0x41, 0x00, 0xd4, 0x2e, 0xcc, 0x5b, 0x3d,
  0x78, 0x86, 0xce, 0x1d, 0x40, 0x50, 0x9a, 0xce, 0x66, 0xc7, 0xb9, 0xd8,
  0xde, 0x5c, 0xc1, 0x91, 0x0c, 0x8a, 0x7f, 0x19, 0x21, 0x60, 0x37, 0xb3,
  0x1a, 0xfc, 0x01, 0x66, 0x6c, 0x74, 0xd2, 0x06, 0xb4, 0xca, 0x0f, 0xea,
  0x64, 0x39, 0x40, 0x47, 0x86, 0x46, 0xe3, 0x9a, 0xb6, 0x9e, 0x2e, 0x1a,
  0x73, 0xeb, 0x9a, 0x14, 0xc9, 0x38, 0xd2, 0x66, 0x7b, 0x7e, 0xe1
};

// And so is the key.  These could also be in DRAM
static const uint8_t rsakey[] PROGMEM = {
  0x30, 0x82, 0x01, 0x3a, 0x02, 0x01, 0x00, 0x02, 0x41, 0x00, 0xb6, 0x30,
  0x6a, 0x67, 0x59, 0xac, 0xab, 0x78, 0x40, 0xa9, 0x9a, 0xe2, 0x45, 0xbb,
  0xe6, 0x4c, 0x7c, 0x7a, 0x52, 0x0b, 0x3c, 0x28, 0xec, 0x44, 0x6c, 0xc3,
  0x41, 0x08, 0x65, 0x7c, 0xaa, 0xd3, 0x04, 0xa3, 0xc4, 0x73, 0x87, 0x2d,
  0x60, 0x3d, 0x94, 0x91, 0x67, 0xc1, 0x30, 0x7a, 0x31, 0xae, 0xf3, 0xc9,
  0x3b, 0xd4, 0x6a, 0x48, 0x6c, 0x11, 0x56, 0xa8, 0xb7, 0x18, 0xe7, 0x06,
  0x27, 0x19, 0x02, 0x03, 0x01, 0x00, 0x01, 0x02, 0x40, 0x25, 0xb8, 0x96,
  0x7f, 0x39, 0x78, 0xdf, 0xb3, 0xb1, 0x27, 0xac, 0x92, 0xc6, 0xbf, 0x65,
  0xaa, 0x56, 0x67, 0x79, 0x0f, 0x2c, 0x70, 0x88, 0xa2, 0x8e, 0x26, 0x4b,
  0x13, 0xb2, 0xf7, 0x81, 0xe2, 0x7e, 0xe6, 0x3e, 0x36, 0x22, 0x93, 0xa0,
  0x8e, 0xe3, 0xf8, 0x1d, 0xaa, 0xe9, 0xd5, 0xf7, 0xba, 0x7b, 0x80, 0xf6,
  0xe4, 0x5a, 0x4e, 0x04, 0x31, 0x19, 0xcc, 0x91, 0x2c, 0xa0, 0xc1, 0xb3,
  0x65, 0x02, 0x21, 0x00, 0xf1, 0xcc, 0xd3, 0x49, 0x59, 0x1e, 0x2c, 0x65,
  0xfb, 0x73, 0xfb, 0xc0, 0x57, 0xc1, 0x81, 0xce, 0x4c, 0x60, 0xcb, 0x88,
  0xf7, 0x3a, 0xb0, 0x22, 0x54, 0x47, 0x48, 0x8c, 0x10, 0xd8, 0x61, 0x03,
  0x02, 0x21, 0x00, 0xc0, 0xe3, 0x69, 0x26, 0x17, 0x02, 0x4b, 0x95, 0xdb,
  0x6e, 0x40, 0xc2, 0xba, 0x7b, 0x0a, 0x16, 0xbd, 0x6a, 0xb1, 0xf6, 0x90,
  0xaf, 0x9e, 0x54, 0x6f, 0x9a, 0xf0, 0x02, 0x34, 0xe6, 0xc6, 0xb3, 0x02,
  0x20, 0x64, 0xd7, 0x8b, 0x76, 0x97, 0x98, 0x21, 0xe4, 0x16, 0x4e, 0x74,
  0xbb, 0xee, 0xdd, 0x61, 0x09, 0x6c, 0x89, 0x21, 0xd9, 0x69, 0x62, 0x2c,
  0x7a, 0xe4, 0xb3, 0x25, 0xea, 0x64, 0x4c, 0x19, 0x89, 0x02, 0x21, 0x00,
  0x97, 0xef, 0x09, 0x16, 0x0d, 0xad, 0xab, 0x28, 0x01, 0x4d, 0xd9, 0x09,
  0x09, 0xa6, 0x7d, 0x0d, 0xe8, 0x69, 0xb0, 0x80, 0x4c, 0xfb, 0x68, 0x35,
  0x8e, 0x2b, 0x76, 0xbd, 0xe6, 0x39, 0x99, 0x6d, 0x02, 0x20, 0x54, 0x1c,
  0x54, 0x4c, 0x22, 0xe6, 0x48, 0x47, 0x01, 0xd8, 0xea, 0xbe, 0xe6, 0x79,
  0x15, 0xde, 0x34, 0x3f, 0x05, 0x97, 0xa8, 0x91, 0x3c, 0xf5, 0xde, 0x24,
  0xfd, 0x25, 0xc6, 0x49, 0xda, 0x17
};


String unsupportedFiles = String();
#ifdef USE_SD_CARD
#else
File uploadFile;
#endif
String transferTarget;

// WiFiClient client;

static const char TEXT_PLAIN[] PROGMEM = "text/plain";
static const char FS_INIT_ERROR[] PROGMEM = "FS INIT ERROR";
static const char FILE_NOT_FOUND[] PROGMEM = "FileNotFound";
static const char DEFAULT_SHOW_JSON[] PROGMEM = "{}";

boolean isIp(String str) {
	for (size_t i = 0; i < str.length(); i++) {
		int c = str.charAt(i);
		if (c != '.' && (c < '0' || c > '9')) {
			return false;
		}
	}
	return true;
}

String toStringIp(IPAddress ip) {
	String res = "";
	for (int i = 0; i < 3; i++) {
		res += String((ip >> (8 * i)) & 0xFF) + ".";
	}
	res += String(((ip >> 8 * 3)) & 0xFF);
	return res;
}

void replyOK() {
	server.send(200, FPSTR(TEXT_PLAIN), "");
}

void replyOKWithMsg(String msg) {
	server.send(200, FPSTR(TEXT_PLAIN), msg);
}

void replyNotFound(String msg) {
	server.send(404, FPSTR(TEXT_PLAIN), msg);
}

void replyBadRequest(String msg) {
	LOGL(msg);
	server.send(400, FPSTR(TEXT_PLAIN), msg + "\r\n");
}

void replyServerError(String msg) {
	LOGL(msg);
	server.send(500, FPSTR(TEXT_PLAIN), msg + "\r\n");
}

/* Read the given file from the filesystem and stream it back to the client */
bool handleFileRead(String path) {
	LOGL(String("handleFileRead: ") + path);
#ifdef USE_SD_CARD
	if (!SD::sdOK) {
#else
	if (!App::fsOK) {
#endif
		replyServerError(FPSTR(FS_INIT_ERROR));
		return true;
	}
	if (path.endsWith("/")) {
		path += "index.html";
	}
	String contentType;
#ifdef USE_SD_CARD
	bool isGZIP = false;
#endif
	if (server.hasArg("download")) {
		contentType = F("application/octet-stream");
	} else if (path.endsWith("mp3")) {
		contentType = F("audio/mp3");
	} else if (path.endsWith("lt3")) {
		contentType = F("application/json");
	} else {
		contentType = mime::getContentType(path);
	}

#ifdef USE_SD_CARD
	if (!SD::fs.exists(path.c_str())) {
		isGZIP = true;
#else
	if (!App::fs->exists(path)) {
#endif
		// File not found, try gzip version
		path = path + ".gz";
	}
#ifdef USE_SD_CARD
	if (SD::fs.exists(path.c_str())) {
		SD::open(path);
		if (isGZIP) {
			server.sendHeader("Content-Encoding", "gzip");
		}
		if (server.streamFile(SD::file, contentType) != SD::file.size()) {
			LOGL("Sent less data than expected!");
		}
		SD::close();
		return true;
	}
#else
	if (App::fs->exists(path)) {
		File file = App::fs->open(path, "r");
		if (server.streamFile(file, contentType) != file.size()) {
			LOGL("Sent less data than expected!");
		}
		file.close();
		return true;
	}
#endif
	return false;
}  // namespace Api
String lastExistingParent(String path) {
	while (!path.isEmpty() && !App::fs->exists(path)) {
		if (path.lastIndexOf('/') > 0) {
			path = path.substring(0, path.lastIndexOf('/'));
		} else {
			path = String();  // No slash => the top folder does not exist
		}
	}
	LOGL(String("Last existing parent: ") + path);
	return path;
}

void deleteRecursive(String path) {
	File file = App::fs->open(path, "r");
	bool isDir = file.isDirectory();
	file.close();

	// If it's a plain file, delete it
	if (!isDir) {
		App::fs->remove(path);
		return;
	}

	// Otherwise delete its contents first
	Dir dir = App::fs->openDir(path);

	while (dir.next()) {
		deleteRecursive(path + '/' + dir.fileName());
	}

	// Then delete the folder itself
	App::fs->rmdir(path);
}

String nodesListJSON() {
	String json;
	json.reserve(128);
	json = "[";
	for (size_t i = 0; i < Net::nodesCount; i++) {
		json += "{";
		json += "\"id\":\"" + String(Net::nodesList[i].id).substring(0, 6) + "\",";
		json += "\"name\":\"" + String(Net::nodesList[i].name).substring(0, 20) + "\",";
		json += "\"type\":" + String(Net::nodesList[i].type) + ",";
		json += "\"vbat\":" + String(Net::nodesList[i].vbat) + ",";
		json += "\"hidden\":" + String(millis() - Net::nodesList[i].lastUpdate > 10000 ? 1 : 0) + "";
		json += "}";
		if (i < Net::nodesCount - 1) json += ",";
	}
	json += "]";
	return json;
}

String configJSON() {
	String json;
	json.reserve(128);

	json = "{";
	json += "\"id\":\"" + String(App::chipID) + "\",";
	json += "\"ip\":\"" + WiFi.localIP().toString() + "\",";
	json += "\"mac\":\"" + WiFi.macAddress() + "\",";
	json += "\"brightness\":" + String(App::data.brightness) + ",";
	json += "\"channel\":" + String(App::data.channel) + ",";
	json += "\"show\":" + String(App::data.show) + ",";
	json += "\"nodes\":" + nodesListJSON() + "";
	json += "}";
	return json;
}

void setup(void) {
	// server.getServer().setServerKeyAndCert_P(rsakey, sizeof(rsakey), x509, sizeof(x509));
	
	server.on("/status", HTTP_GET, []() {
		LOGL("handleStatus");
		FSInfo fs_info;
		String json;
		json.reserve(128);
		json = "{\"type\":\"LittleFS\",\"show\":";
		json += String(App::data.show);
		json += ",\"channel\":";
		json += String(App::data.channel);
		json += ", \"isOk\":";
		if (App::fsOK) {
			App::fs->info(fs_info);
			json += F("\"true\", \"totalBytes\":\"");
			json += fs_info.totalBytes;
			json += F("\", \"usedBytes\":\"");
			json += fs_info.usedBytes;
			json += "\"";
		} else {
			json += "\"false\"";
		}
		json += F(",\"unsupportedFiles\":\"");
		json += unsupportedFiles;
		json += "\"}";

		server.send(200, "application/json", json);
	});
	server.on("/stat", HTTP_GET, []() {
		server.send(200, "application/json", configJSON());
	});
	server.on("/show", []() {
		if (!server.hasArg("id")) {
			replyBadRequest("Missing show ID");
		} else {
			u32 id = server.arg("id").toInt();
			if (App::data.show != id) {
				App::data.show = id;
				App::save();
			}
			if (!handleFileRead("/show/" + String(id) + ".json")) {
				replyNotFound("Show not found.");
			}
		}
	});
	server.on("/list", HTTP_GET, []() {
		if (!App::fsOK) {
			return replyServerError(FPSTR(FS_INIT_ERROR));
		}

		if (!server.hasArg("dir")) {
			return replyBadRequest(F("DIR ARG MISSING"));
		}

		String path = server.arg("dir");
		if (path != "/" && !App::fs->exists(path)) {
			return replyBadRequest("BAD PATH");
		}

		LOGL(String("handleFileList: ") + path);
		Dir dir = App::fs->openDir(path);
		path.clear();

		// use HTTP/1.1 Chunked response to avoid building a huge temporary string
		if (!server.chunkedResponseModeStart(200, "text/json")) {
			server.send(505, F("text/html"), F("HTTP1.1 required"));
			return;
		}

		// use the same string for every line
		String output;
		output.reserve(64);
		while (dir.next()) {
			if (output.length()) {
				// send string from previous iteration
				// as an HTTP chunk
				server.sendContent(output);
				output = ',';
			} else {
				output = '[';
			}

			output += "{\"type\":\"";
			if (dir.isDirectory()) {
				output += "dir";
			} else {
				output += F("file\",\"size\":\"");
				output += dir.fileSize();
			}

			output += F("\",\"name\":\"");
			// Always return names without leading "/"
			if (dir.fileName()[0] == '/') {
				output += &(dir.fileName()[1]);
			} else {
				output += dir.fileName();
			}

			output += "\"}";
		}

		// send last string
		output += "]";
		server.sendContent(output);
		server.chunkedResponseFinalize();
	});

	// Editor
	server.on("/edit", HTTP_GET, []() {
		if (!handleFileRead(F("/edit.html"))) {
			replyNotFound(FPSTR(FILE_NOT_FOUND));
		}
	});

	// Create file
	server.on("/edit", HTTP_PUT, []() {
		if (!App::fsOK) {
			return replyServerError(FPSTR(FS_INIT_ERROR));
		}

		String path = server.arg("path");
		if (path.isEmpty()) {
			return replyBadRequest(F("PATH ARG MISSING"));
		}
		if (path == "/") {
			return replyBadRequest("BAD PATH");
		}
		if (App::fs->exists(path)) {
			return replyBadRequest(F("PATH FILE EXISTS"));
		}

		String src = server.arg("src");
		if (src.isEmpty()) {
			// No source specified: creation
			LOGL(String("handleFileCreate: ") + path);
			if (path.endsWith("/")) {
				// Create a folder
				path.remove(path.length() - 1);
				if (!App::fs->mkdir(path)) {
					return replyServerError(F("MKDIR FAILED"));
				}
			} else {
				// Create a file
				File file = App::fs->open(path, "w");
				if (file) {
					file.write((const char*)0);
					file.close();
				} else {
					return replyServerError(F("CREATE FAILED"));
				}
			}
			if (path.lastIndexOf('/') > -1) {
				path = path.substring(0, path.lastIndexOf('/'));
			}
			replyOKWithMsg(path);
		} else {
			// Source specified: rename
			if (src == "/") {
				return replyBadRequest(F("BAD SRC"));
			}
			if (!App::fs->exists(src)) {
				return replyBadRequest(F("SRC FILE NOT FOUND"));
			}

			LOGL(String("handleFileCreate: ") + path + " from " + src);

			if (path.endsWith("/")) {
				path.remove(path.length() - 1);
			}
			if (src.endsWith("/")) {
				src.remove(src.length() - 1);
			}
			if (!App::fs->rename(src, path)) {
				return replyServerError(F("RENAME FAILED"));
			}
			replyOKWithMsg(lastExistingParent(src));
		}
	});

	// Delete file
	server.on("/edit", HTTP_DELETE, []() {
		if (!App::fsOK) {
			return replyServerError(FPSTR(FS_INIT_ERROR));
		}

		String path = server.arg(0);
		if (path.isEmpty() || path == "/") {
			return replyBadRequest("BAD PATH");
		}

		LOGL(String("handleFileDelete: ") + path);
		if (!App::fs->exists(path)) {
			return replyNotFound(FPSTR(FILE_NOT_FOUND));
		}
		deleteRecursive(path);

		replyOKWithMsg(lastExistingParent(path));
	});

	// Upload file
	server.on("/edit", HTTP_POST, replyOK, []() {
		if (!App::fsOK) {
			return replyServerError(FPSTR(FS_INIT_ERROR));
		}
		if (server.uri() != "/edit") {
			return;
		}
		HTTPUpload& upload = server.upload();
		String filename;
		if (upload.status == UPLOAD_FILE_START) {
			if (server.hasArg("path")) {
				filename = server.arg("path");
			} else {
				filename = upload.filename;
			}
			// Make sure paths always start with "/"
			if (!filename.startsWith("/")) {
				filename = "/" + filename;
			}
			LOGL(String("handleFileUpload Name: ") + filename);
#ifdef USE_SD_CARD
			SD::openWrite(filename.c_str());
			if (!SD::file) {
				return replyServerError(F("CREATE FAILED"));
			}
#else
			uploadFile = App::fs->open(filename, "w");
			if (!uploadFile) {
				return replyServerError(F("CREATE FAILED"));
			}
#endif
			LOGL(String("Upload: START, filename: ") + filename);
		} else if (upload.status == UPLOAD_FILE_WRITE) {
#ifdef USE_SD_CARD
			if (SD::file) {
				size_t bytesWritten = SD::file.write(upload.buf, upload.currentSize);
				if (bytesWritten != upload.currentSize) {
					return replyServerError(F("WRITE FAILED"));
				}
			}
#else
			if (uploadFile) {
				size_t bytesWritten = uploadFile.write(upload.buf, upload.currentSize);
				if (bytesWritten != upload.currentSize) {
					return replyServerError(F("WRITE FAILED"));
				}
			}
#endif
			LOGL(String("Upload: WRITE, Bytes: ") + upload.currentSize);
		} else if (upload.status == UPLOAD_FILE_END) {
#ifdef USE_SD_CARD
			if (SD::file) {
				SD::file.close();
			}
#else
			if (uploadFile) {
				uploadFile.close();
			}
#endif
			LOGL(String("Upload: END, Size: ") + upload.totalSize);

#ifdef MASTER
			if (server.hasArg("sync")) {
				if (server.hasArg("target"))
					Net::sendFile(upload.filename, server.arg("target"));
				else
					Net::sendFile(upload.filename);
			}
#endif
		}
	});

	server.onNotFound([]() {
		if (!App::fsOK) {
			return replyServerError(FPSTR(FS_INIT_ERROR));
		}

		String uri = ESP8266WebServer::urlDecode(server.uri());	 // required to read paths with blanks

		if (handleFileRead(uri)) {
			return;
		}

		// Dump debug data
		String message;
		message.reserve(100);
		message = F("Error: File not found\n\nURI: ");
		message += uri;
		message += F("\nMethod: ");
		message += (server.method() == HTTP_GET) ? "GET" : "POST";
		message += F("\nArguments: ");
		message += server.args();
		message += '\n';
		for (uint8_t i = 0; i < server.args(); i++) {
			message += F(" NAME:");
			message += server.argName(i);
			message += F("\n VALUE:");
			message += server.arg(i);
			message += '\n';
		}
		message += "path=";
		message += uri;
		message += '\n';
		LOG(message);

		return replyNotFound(message);
	});

	server.begin();

	LOGL("HTTP server started");
}

void loop(void) {
	server.handleClient();
}
};	// namespace Api

#endif
