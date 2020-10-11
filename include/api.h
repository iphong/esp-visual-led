#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

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

String unsupportedFiles = String();

File uploadFile;
String transferTarget;

WiFiClient client;
HTTPClient http;

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
	if (server.hasArg("download")) {
		contentType = F("application/octet-stream");
	} else {
		contentType = mime::getContentType(path);
	}
#ifdef USE_SD_CARD
	if (!SD::fs.exists(path.c_str())) {
#else
	if (!App::fs->exists(path)) {
#endif
		// File not found, try gzip version
		path = path + ".gz";
	}
#ifdef USE_SD_CARD
	if (SD::fs.exists(path.c_str())) {
		SD::open(path);
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
		json += "\"vbat\":" + String(Net::nodesList[i].vbat) + "";
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
	server.on("/show", HTTP_GET, []() {
		if (!server.hasArg("id")) {
			replyBadRequest("Missing show ID");
		} else {
			File file = App::fs->open("/show/" + server.arg("id") + ".json", "r");
			if (file) {
				server.streamFile(file, "application/json");
			} else {
				server.send(200, "application/json", "{}");
			}
		}
	});
	server.on("/show", HTTP_POST, []() {
		if (!server.hasArg("id")) {
			replyBadRequest("Missing show ID");
		} else {
			u32 id = server.arg("id").toInt();
			if (App::data.show != id) {
				App::data.show = id;
				App::save();
			}
			replyOK();
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
		if (upload.status == UPLOAD_FILE_START) {
			String filename = upload.filename;

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
		message += server.arg("path");
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
