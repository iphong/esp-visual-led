#include "app.h"
#include "def.h"
#include "led.h"
#include "net.h"

#ifndef __API_H__
#define __API_H__

namespace Api {

ESP8266WebServer server(80);

String unsupportedFiles = String();
File uploadFile;
String transferTarget;

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
	server.send(400, FPSTR(TEXT_PLAIN), msg + "\r\n");
}

void replyServerError(String msg) {
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
	} else if (path.endsWith("mp3")) {
		contentType = F("audio/mp3");
	} else if (path.endsWith("lt3")) {
		contentType = F("application/json");
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
				uploadFile.close();
			}
			LOGL(String("Upload: END, Size: ") + upload.totalSize);
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
