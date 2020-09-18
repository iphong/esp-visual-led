#include <Arduino.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#include "app.h"
#include "led.h"
#include "net.h"

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
	if (!App::fsOK) {
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
	if (!App::fs->exists(path)) {
		// File not found, try gzip version
		path = path + ".gz";
	}
	if (App::fs->exists(path)) {
		File file = App::fs->open(path, "r");
		if (server.streamFile(file, contentType) != file.size()) {
			LOGL("Sent less data than expected!");
		}
		file.close();
		return true;
	}
	return false;
}
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

void setup(void) {
	server.on("/nodes", HTTP_GET, []() {
		LOGL("GET online nodes list");
		String json;
		json.reserve(128);

		json = "[";
		for (size_t i=0; i<Net::nodesCount; i++) {
			json += "{\"id\":\"" + String(Net::nodesList[i].id).substring(0, 6) + "\"}";
			if (i < Net::nodesCount-1) json += ",";
		}
		json += "]";

		server.send(200, "application/json", json);
	});
	server.on("/nodes", HTTP_POST, []() {
		LOGL("POST online nodes action");
		if (server.hasArg("select")) {
			Net::wifiConnect("SDC_" + server.arg("select"), "11111111");
		}
		replyOK();
	});

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

	server.on("/color", HTTP_GET, []() {
		LOGL("handleColor");
		App::Color* a = &App::data.a.color;
		App::Color* b = &App::data.b.color;
		String value1 = String(a->r) + "," + String(a->g) + "," + String(a->b);
		String value2 = String(b->r) + "," + String(b->g) + "," + String(b->b);
		String json = "{ \"a\": [" + value1 + "], \"b\": [" + value2 + "] }";

		server.send(200, "application/json", json);
	});

	server.on("/config", HTTP_POST, []() {
		if (server.hasArg("brightness")) {
			App::data.brightness = server.arg("brightness").toInt();
			App::save();
		}
		if (server.hasArg("channel")) {
			App::data.channel = server.arg("channel").toInt();
			App::save();
			if (!LED::ended) {
				LED::begin();
			}
		}
		if (server.hasArg("show")) {
			App::data.show = server.arg("show").toInt();
			App::save();
			if (!LED::ended) {
				LED::begin();
			}
		}
		replyOK();
	});

	server.on("/color", HTTP_POST, []() {
		String segment = server.arg("segment");
		u8 r = server.arg("r").toInt();
		u8 g = server.arg("g").toInt();
		u8 b = server.arg("b").toInt();
		if (segment == "a" || segment == "ab") {
			App::data.a.color.r = r;
			App::data.a.color.g = g;
			App::data.a.color.b = b;
		}
		if (segment == "b" || segment == "ab") {
			App::data.b.color.r = r;
			App::data.b.color.g = g;
			App::data.b.color.b = b;
		}
		App::save();
		LED::begin();
		replyOK();
	});

	server.on("/command", HTTP_POST, []() {
		if (server.hasArg("command")) {
			String cmd = server.arg("command");
			if (cmd == "pair") {
				if (server.hasArg("channel")) {
					Net::sendPair(server.arg("channel").toInt());
				} else {
					Net::sendPair();
				}
				replyOK();
			} else if (cmd == "seek") {
				if (server.hasArg("time")) {
					u32 time = server.arg("time").toInt();
					LED::end();
					Net::sendSync();
					LED::setTime(time);
					Net::sendSync();
					replyOK();
				} else {
					replyBadRequest("Missing argument: time ");
				}
			} else if (cmd == "start") {
				LED::begin();
				Net::sendSync();
				replyOK();
			} else if (cmd == "toggle") {
				LED::toggle();
				Net::sendSync();
				replyOK();
			} else if (cmd == "pause") {
				LED::pause();
				Net::sendSync();
				replyOK();
			} else if (cmd == "resume") {
				LED::resume();
				Net::sendSync();
				replyOK();
			} else if (cmd == "end") {
				LED::end();
				Net::sendSync();
				replyOK();
			} else if (cmd == "ping") {
				Net::sendPing();
				replyOK();
			} else if (cmd == "sync") {
				LED::end();
				Net::sendSync();
				Net::sendFile("/show/" + String(App::data.show) + "A.lsb");
				Net::sendFile("/show/" + String(App::data.show) + "B.lsb");
				replyOK();
			} else {
				replyBadRequest("Unknown command: " + cmd);
			}
		} else {
			replyBadRequest("Missing command argument.");
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
			uploadFile = App::fs->open(filename, "w");
			if (!uploadFile) {
				return replyServerError(F("CREATE FAILED"));
			}
			LOGL(String("Upload: START, filename: ") + filename);
		} else if (upload.status == UPLOAD_FILE_WRITE) {
			if (uploadFile) {
				size_t bytesWritten = uploadFile.write(upload.buf, upload.currentSize);
				if (bytesWritten != upload.currentSize) {
					return replyServerError(F("WRITE FAILED"));
				}
			}
			LOGL(String("Upload: WRITE, Bytes: ") + upload.currentSize);
		} else if (upload.status == UPLOAD_FILE_END) {
			if (uploadFile) {
				LOGL(WiFi.status());
				if (WiFi.status() == WL_CONNECTED) {
					const String url = "http://" + WiFi.gatewayIP().toString() + "/edit";
					const String path = uploadFile.fullName();
					uploadFile.close();
					uploadFile = App::fs->open(path, "r");
					String body = "------WebKitFormBoundaryZsEgKezFz4SNJZFs\n";
					body += "Content-Disposition: form-data; name=\"data\"; filename=\"" + path + "\"\n";
					body += "Content-Type: " + mime::getContentType(path) + "\n\n\n";
					body += "------WebKitFormBoundaryZsEgKezFz4SNJZFs--" + uploadFile.readString();

					LOGL(url);
					LOGL(body);
					http.begin(client, url);
					http.addHeader("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryZsEgKezFz4SNJZFs");
					int status = http.POST(body);
					
					if (status > 0) {
					// HTTP header has been send and Server response header has been handled
					LOGD("[HTTP] POST... code: %d\n", status);

					// file found at server
					if (status == HTTP_CODE_OK) {
						const String& payload = http.getString();
						LOGL("received payload:\n<<");
						LOGL(payload);
						LOGL(">>");
					}
					} else {
						LOGD("[HTTP] POST... failed, error: %s\n", http.errorToString(status).c_str());
					}

					http.end();
				}
				else uploadFile.close();
			}
			LOGL(String("Upload: END, Size: ") + upload.totalSize);

			if (server.hasArg("sync")) {
				if (server.hasArg("target"))
					Net::sendFile(upload.filename, server.arg("target"));
				else
					Net::sendFile(upload.filename);
			}
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
