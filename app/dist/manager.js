/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/ts/manager.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/ts/actions.ts":
/*!***************************!*\
  !*** ./app/ts/actions.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openRemote = exports.openUtils = exports.openManager = exports.sendShowFile = exports.openShow = exports.saveShow = exports.stopShow = exports.startShow = exports.logHex = exports.newShow = void 0;
const serial_1 = __webpack_require__(/*! ./serial */ "./app/ts/serial.ts");
const store_1 = __webpack_require__(/*! ./store */ "./app/ts/store.ts");
const view_1 = __webpack_require__(/*! ./view */ "./app/ts/view.ts");
async function newShow() {
    view_1.$player.currentTime = 0;
    await view_1.updateSize();
    await view_1.updateTime();
    view_1.$player.src = '';
    await store_1.set(Object.assign({}, store_1.DEFAULT_STORE_DATA));
}
exports.newShow = newShow;
var store_2 = __webpack_require__(/*! ./store */ "./app/ts/store.ts");
Object.defineProperty(exports, "logHex", { enumerable: true, get: function () { return store_2.logHex; } });
async function startShow() {
    store_1.store.show.running = true;
    await view_1.$player.play();
}
exports.startShow = startShow;
async function stopShow() {
    store_1.store.show.running = false;
    view_1.$player.pause();
    view_1.$player.currentTime = 0;
}
exports.stopShow = stopShow;
async function saveShow() {
    return new Promise(async (resolve) => {
        if (store_1.store.show_file) {
            chrome['fileSystem'].restoreEntry(store_1.store.show_file, async (entry) => {
                await store_1.saveShowEntry(entry);
                resolve();
            });
        }
        else {
            chrome['fileSystem'].chooseEntry({ type: 'saveFile' }, async (entry) => {
                await store_1.saveShowEntry(entry);
                resolve();
            });
        }
    });
}
exports.saveShow = saveShow;
async function openShow() {
    return new Promise(resolve => {
        chrome['fileSystem'].chooseEntry({ type: 'openWritableFile' }, async (entry) => {
            await newShow();
            await view_1.renderShow(await store_1.openShowEntry(entry));
            if (store_1.cache.audio) {
                view_1.$player.src = URL.createObjectURL(store_1.cache.audio);
                console.log('set player src', [view_1.$player.src]);
            }
            resolve();
        });
    });
}
exports.openShow = openShow;
async function sendShowFile() {
    let index = 1;
    await serial_1.sendFile(new Blob(store_1.convertTracks(store_1.store.show.tracks[index].frames)), '/show/5A.lsb');
    await serial_1.sendFile(new Blob(store_1.convertTracks(store_1.store.show.tracks[index].frames)), '/show/5B.lsb');
}
exports.sendShowFile = sendShowFile;
function openManager() {
    chrome['app'].window.create('../manager.html', {
        id: 'manager',
        width: 800,
        height: 200
    });
}
exports.openManager = openManager;
function openUtils() {
    chrome['app'].window.create('../utils.html', {
        id: 'utils',
        width: 270,
        height: 370
    });
}
exports.openUtils = openUtils;
function openRemote() {
    chrome['app'].window.create('../remote.html', {
        id: 'remote',
        width: 250,
        height: 250
    });
}
exports.openRemote = openRemote;
__exportStar(__webpack_require__(/*! ./serial */ "./app/ts/serial.ts"), exports);


/***/ }),

/***/ "./app/ts/manager.ts":
/*!***************************!*\
  !*** ./app/ts/manager.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions = __importStar(__webpack_require__(/*! ./actions */ "./app/ts/actions.ts"));
const serial_1 = __webpack_require__(/*! ./serial */ "./app/ts/serial.ts");
const store_1 = __webpack_require__(/*! ./store */ "./app/ts/store.ts");
Object.assign(window, actions);
addEventListener('load', async () => {
    await store_1.init();
    await serial_1.serialConnect();
    await serial_1.onSerialMessage(async (buf) => {
        if (buf.length > 6 && [60, 62].includes(buf[6])) {
            const id = serial_1.readStr(buf, 6);
            const msg = serial_1.readStr(buf, buf.length - 7, 7);
            if (msg.startsWith('SELECT')) {
                await serial_1.sendCommand(id, 'BLINK');
            }
            if (msg.startsWith('PING')) {
                const type = buf[11];
                const vbat = (buf[12] << 8) | buf[13];
                const name = serial_1.readStr(buf, 20, 14);
                console.log(id, type, (vbat / 1000 + 0.04).toPrecision(3), name);
            }
        }
    });
});


/***/ }),

/***/ "./app/ts/serial.ts":
/*!**************************!*\
  !*** ./app/ts/serial.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.sendFile = exports.sendSync = exports.encodeMsg = exports.decodeMsg = exports.equals = exports.readStr = exports.hexStr = exports.sendCommand = exports.sendRaw = exports.serialDisconnect = exports.serialConnect = exports.onSerialMessage = void 0;
const store_1 = __webpack_require__(/*! ./store */ "./app/ts/store.ts");
let handler = null;
chrome.serial.onReceive.addListener(async ({ connectionId: id, data }) => {
    if (handler && id === store_1.store.serial_connection)
        (new Uint8Array(data)).forEach((byte) => {
            decodeMsg(byte);
        });
});
chrome.serial.onReceiveError.addListener(async ({ connectionId: id, error }) => {
    if (id === store_1.store.serial_connection) {
        console.log("serial closed:", error);
        await store_1.set({ serial_connection: 0, serial_connected: false });
    }
});
async function onSerialMessage(cb) {
    handler = cb;
}
exports.onSerialMessage = onSerialMessage;
async function serialConnect(force = false) {
    return new Promise(resolve => {
        if (!force && store_1.store.serial_connection) {
            chrome.serial.getConnections(async (connections) => {
                const found = connections.find((conn) => conn.connectionId == store_1.store.serial_connection);
                console.log(connections);
                if (!found) {
                    resolve(await serialConnect(true));
                }
                else {
                    console.log('serial resumed:', found.connectionId, store_1.store.serial_port);
                    await store_1.set({ serial_connection: found.connectionId, serial_connected: true });
                    resolve(found.connectionId);
                }
            });
        }
        else {
            const options = {
                name: 'serial_connection',
                bufferSize: 250,
                bitrate: 921600,
                receiveTimeout: 0
            };
            chrome.serial.connect(store_1.store.serial_port, options, async (conn) => {
                if (conn) {
                    console.log('serial connected:', conn.connectionId, store_1.store.serial_port);
                    await store_1.set({ serial_connection: conn.connectionId, serial_connected: true });
                }
                else {
                    console.log('can not connect to serial port', store_1.store.serial_port);
                    await store_1.set({ serial_connection: 0, serial_connected: false });
                }
                resolve(conn);
            });
        }
    });
}
exports.serialConnect = serialConnect;
async function serialDisconnect() {
    await store_1.set('serial_connected', false);
    return new Promise(resolve => {
        chrome.serial.disconnect(store_1.store.serial_connection, resolve);
    });
}
exports.serialDisconnect = serialDisconnect;
async function sendRaw(data) {
    return new Promise(resolve => {
        if (store_1.store.serial_connected)
            chrome.serial.send(store_1.store.serial_connection, data, resolve);
        else
            resolve();
    });
}
exports.sendRaw = sendRaw;
async function sendCommand(id, head, ...bytes) {
    console.log('send', id, head, ...bytes.map(c => c.toString(16).padStart(2, '0')));
    const i = id.split('').map(c => c.charCodeAt(0));
    const h = head.split('').map(c => c.charCodeAt(0));
    await sendRaw(encodeMsg([...i, 62, ...h, ...bytes]));
}
exports.sendCommand = sendCommand;
function hexStr(arr) {
    return arr.map(n => n.toString(16).padStart(2, '0')).join(' ');
}
exports.hexStr = hexStr;
function readStr(arr, len = 1, pos = 0) {
    let output = '';
    for (let i = pos; i < pos + len; i++)
        output += String.fromCharCode(arr[i]);
    return output;
}
exports.readStr = readStr;
function equals(a, b, size, offset = 0) {
    for (let i = offset; i < offset + size; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.equals = equals;
const header = [36];
const buffer = [];
let crc = 0;
let length = 0;
let synced = false;
function isValidStart() {
    return synced = synced || equals(buffer, header, header.length);
}
function isValidSize() {
    return length >= header.length + buffer[1] + 2;
}
function checksum() {
    return buffer[length - 1] == crc % 256;
}
function decodeMsg(byte) {
    buffer[length++] = byte;
    if (isValidStart() && isValidSize() && checksum()) {
        synced = false;
        let frame = buffer.slice(2, buffer[1] + 2);
        if (handler)
            handler(frame);
    }
    if (!synced) {
        crc = 0;
        length = 0;
    }
    else {
        crc += byte;
    }
}
exports.decodeMsg = decodeMsg;
function encodeMsg(input) {
    const output = [];
    output[0] = 36;
    output[1] = input.length;
    let crc = output[0] + output[1];
    for (let i = 0; i < input.length; i++) {
        output[i + 2] = input[i];
        crc += output[i + 2];
    }
    output.push(crc);
    return new Uint8Array(output);
}
exports.encodeMsg = encodeMsg;
async function sendSync(time, show, ended, paused) {
    const data = new Uint8Array(8);
    const view = new DataView(data.buffer);
    view.setUint32(0, time, true);
    view.setUint8(4, show);
    view.setUint8(5, ended ? 1 : 0);
    view.setUint8(6, paused ? 1 : 0);
    view.setUint8(7, 0xFF);
    await sendCommand('#', 'SYNC', ...data);
}
exports.sendSync = sendSync;
async function sendFile(file, path, id = '#') {
    console.log('begin uploading');
    let bytesSent = 0;
    if (file instanceof File)
        file = new Blob([file]);
    const bytesLength = file.size;
    const buffer = await file.arrayBuffer();
    await sendCommand(id, 'FBEGIN' + path);
    await delay(500);
    let count = 0;
    while (bytesSent < bytesLength) {
        const start = bytesSent;
        const end = Math.min(bytesSent + 16, bytesLength);
        await sendCommand(id, 'FWRITE', ...new Uint8Array(buffer, start, end - start));
        bytesSent = end;
        if (count++)
            await delay(2);
        else
            await delay(500);
    }
    await sendCommand(id, 'FCLOSE');
    await delay(100);
    console.log('file uploaded');
}
exports.sendFile = sendFile;
async function delay(ms = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
exports.delay = delay;


/***/ }),

/***/ "./app/ts/store.ts":
/*!*************************!*\
  !*** ./app/ts/store.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logHex = exports.convertTracks = exports.convertFrame = exports.createLoopFrame = exports.createEndFrame = exports.createColorFrame = exports.createBinaryFrame = exports.saveShowEntry = exports.openShowEntry = exports.handleImageFile = exports.parseAudioFile = exports.parseShowFile = exports.parseAudio = exports.parseShowTracks = exports.parseWaveform = exports.set = exports.init = exports.store = exports.DEFAULT_STORE_DATA = exports.cache = void 0;
Object.defineProperty(window, 'localStorage', { value: null });
const unzip_js_1 = __importDefault(__webpack_require__(/*! unzip-js */ "./node_modules/unzip-js/src/index.js"));
const jszip_1 = __importDefault(__webpack_require__(/*! jszip */ "./node_modules/jszip/dist/jszip.min.js"));
const music_tempo_1 = __importDefault(__webpack_require__(/*! music-tempo */ "./node_modules/music-tempo/dist/node/MusicTempo.js"));
const flattenDeep_1 = __importDefault(__webpack_require__(/*! lodash/flattenDeep */ "./node_modules/lodash/flattenDeep.js"));
exports.cache = {
    audio: null,
    show: null
};
exports.DEFAULT_STORE_DATA = {
    serial_port: '',
    serial_connection: 0,
    serial_connected: false,
    show_file: '',
    show: {
        LIGHT_MASTER_FILE: true,
        selected: 1,
        running: false,
        time: 0,
        duration: 0,
        markers: [],
        tracks: []
    },
    audio: null
};
exports.store = Object.assign({}, exports.DEFAULT_STORE_DATA);
window['store'] = exports.store;
chrome.storage.onChanged.addListener(changes => {
    for (let key in changes) {
        exports.store[key] = changes[key].newValue;
    }
});
async function init() {
    console.log('init storage');
    return new Promise(resolve => {
        chrome.storage.local.get(async (res) => {
            Object.assign(exports.store, res);
            resolve(exports.store);
        });
    });
}
exports.init = init;
async function set(key, value) {
    return new Promise(resolve => {
        if (typeof key === 'string') {
            chrome.storage.local.set({ [key]: value }, resolve);
        }
        else if (typeof key === 'object') {
            chrome.storage.local.set(key, resolve);
        }
        else {
            resolve();
        }
    });
}
exports.set = set;
function parseWaveform(audioData, width) {
    const step = Math.round(audioData.length / width);
    const waveformData = [];
    let x = 0, sumPositive = 0, sumNegative = 0, maxPositive = 0, maxNegative = 0, kNegative = 0, kPositive = 0, drawIdx = step;
    for (let i = 0; i < audioData.length; i++) {
        if (i == drawIdx) {
            waveformData.push([
                Math.round(sumPositive / kPositive * 100),
                Math.round(sumNegative / kNegative * 100),
                Math.round(maxPositive * 100),
                Math.round(maxNegative * 100)
            ]);
            x++;
            drawIdx += step;
            sumPositive = 0;
            sumNegative = 0;
            maxPositive = 0;
            maxNegative = 0;
            kNegative = 0;
            kPositive = 0;
        }
        else {
            if (audioData[i] < 0) {
                sumNegative += audioData[i];
                kNegative++;
                if (maxNegative > audioData[i])
                    maxNegative = audioData[i];
            }
            else {
                sumPositive += audioData[i];
                kPositive++;
                if (maxPositive < audioData[i])
                    maxPositive = audioData[i];
            }
        }
    }
    return waveformData;
}
exports.parseWaveform = parseWaveform;
function parseShowTracks(tracks) {
    function rgb({ r, g, b }) {
        return [r, g, b].map(v => Math.round(v * 255));
    }
    function hex(num) {
        return num.toString(16).padStart(2, '0').toUpperCase();
    }
    function frame({ type, startTime: start, endTime: end, color, colorEnd, colorStart, period, spacing, ratio }) {
        const data = {
            type,
            start,
            duration: end - start,
            color: []
        };
        if (color)
            data.color[0] = '#' + rgb(color).map(hex).join('');
        if (colorStart)
            data.color[0] = '#' + rgb(colorStart).map(hex).join('');
        if (colorEnd)
            data.color[1] = '#' + rgb(colorEnd).map(hex).join('');
        if (typeof period !== 'undefined')
            data.period = period;
        if (typeof ratio !== 'undefined')
            data.ratio = ratio;
        if (typeof spacing !== 'undefined')
            data.spacing = spacing;
        return data;
    }
    return tracks.map(({ name, trackType: type, device, elements }) => {
        return {
            type,
            name,
            device,
            frames: (elements || []).map(frame)
        };
    });
}
exports.parseShowTracks = parseShowTracks;
async function parseAudio(file) {
    return new Promise(async (resolve, reject) => {
        let name = '';
        let buffer = file;
        if (buffer instanceof File) {
            name = buffer.name;
            buffer = new Blob([buffer]);
        }
        if (buffer instanceof Blob)
            buffer = await buffer.arrayBuffer();
        new AudioContext().decodeAudioData(buffer, res => {
            console.log('decoded audio', [res]);
            const data = res.getChannelData(0);
            if (res.numberOfChannels == 2) {
                const data2 = res.getChannelData(1);
                for (let i in data) {
                    data[i] = (data[i] + data2[i]) / 2;
                }
            }
            console.log('getting music tempo');
            const { beats } = new music_tempo_1.default(data);
            resolve({
                name,
                url: URL.createObjectURL(file),
                beats: [...new Uint32Array(beats.map(v => v * 1000))],
                duration: Math.round(res.duration * 1000),
                waveform: parseWaveform(data, res.duration * 100)
            });
        }, reject);
    });
}
exports.parseAudio = parseAudio;
async function parseShowFile(file) {
    if (file instanceof File)
        file = new Blob([file]);
    console.log('parse show file');
    const body = await file.text();
    const res = JSON.parse(body);
    if (res.LIGHT_MASTER_FILE)
        return await set('show', res);
    const show = Object.assign(exports.store.show || {}, {
        markers: res.markers,
        tracks: parseShowTracks(res.tracks)
    });
    return await set('show', show);
}
exports.parseShowFile = parseShowFile;
async function parseAudioFile(file, force = false) {
    let audio = exports.store.audio;
    if (force || !audio || !audio.waveform) {
        console.log('parse audio file');
        audio = await parseAudio(file);
    }
    if (exports.store.show && audio.duration) {
        exports.store.show.duration = Math.max(exports.store.show.duration, audio.duration);
        await set('show', exports.store.show);
    }
    exports.cache.audio = file;
    await set('audio', audio);
    return audio;
}
exports.parseAudioFile = parseAudioFile;
async function handleImageFile(file) {
}
exports.handleImageFile = handleImageFile;
async function openShowEntry(entry) {
    if (!entry)
        return;
    console.log(`open show file`, [entry.fullPath]);
    if (entry.name.endsWith('ltp')) {
        await set('show_file', chrome['fileSystem'].retainEntry(entry));
    }
    else {
        await set('show_file', '');
    }
    return new Promise((resolve, reject) => {
        entry.file(file => {
            unzip_js_1.default(file, (err, zip) => {
                if (err)
                    reject(err);
                zip.readEntries((err, entries) => {
                    if (err)
                        reject(err);
                    let ended = 0;
                    entries.forEach(entry => {
                        const { name } = entry;
                        zip.readEntryData(entry, false, (err, stream) => {
                            if (err)
                                reject(err);
                            let content = [];
                            stream.on('data', (data) => {
                                content.push(data);
                            });
                            stream.on('end', async () => {
                                if (name == 'project.lt3') {
                                    exports.cache.show = new Blob(content);
                                    await parseShowFile(exports.cache.show);
                                }
                                else if (name.endsWith('.mp3')) {
                                    exports.cache.audio = new Blob(content, { type: 'audio/mp3' });
                                    await parseAudioFile(exports.cache.audio);
                                }
                                if (++ended === entries.length) {
                                    resolve();
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}
exports.openShowEntry = openShowEntry;
async function saveShowEntry(entry) {
    if (!entry)
        return;
    if (entry.fullPath.endsWith('ltp')) {
        await set('show_file', chrome['fileSystem'].retainEntry(entry));
    }
    else {
        await set('show_file', '');
    }
    return new Promise(resolve => {
        chrome.storage.local.get(['show', 'audio'], ({ show, audio, show_tracks }) => {
            entry.createWriter(async (writer) => {
                const zip = new jszip_1.default();
                if (show)
                    zip.file('project.lt3', JSON.stringify(show));
                if (exports.cache.audio)
                    zip.file('audio.mp3', exports.cache.audio);
                zip.generateAsync({ type: 'blob' }).then(content => {
                    writer.write(content);
                    writer.addEventListener('writeend', () => {
                        resolve();
                        console.log(`save show file`, [entry.fullPath]);
                    });
                });
            });
        });
    });
}
exports.saveShowEntry = saveShowEntry;
function createBinaryFrame({ type, start, duration, transition, r, g, b }) {
    const data = new Uint8Array(16);
    const view = new DataView(data.buffer);
    view.setUint8(0, type);
    view.setUint8(1, r);
    view.setUint8(2, g);
    view.setUint8(3, b);
    view.setUint32(4, start, true);
    view.setUint32(8, duration, true);
    view.setUint32(12, transition, true);
    return data;
}
exports.createBinaryFrame = createBinaryFrame;
function createColorFrame(start, duration, transition, r, g, b) {
    return createBinaryFrame({ type: 1, start, duration, transition, r, g, b });
}
exports.createColorFrame = createColorFrame;
function createEndFrame(start) {
    return createBinaryFrame({ type: 2, start });
}
exports.createEndFrame = createEndFrame;
function createLoopFrame(start, duration) {
    return createBinaryFrame({ type: 3, start, duration });
}
exports.createLoopFrame = createLoopFrame;
function hex2rgb(hex) {
    return [
        parseInt(hex[1] + hex[2], 16),
        parseInt(hex[3] + hex[4], 16),
        parseInt(hex[5] + hex[6], 16)
    ];
}
function convertFrame({ type, color, start, duration, ratio, spacing, period }) {
    switch (type) {
        case 2:
            return [
                createColorFrame(start, duration, 0, ...hex2rgb(color[0]))
            ];
        case 3:
            return [
                createColorFrame(start, 0, 0, ...hex2rgb(color[0])),
                createColorFrame(start, duration, duration, ...hex2rgb(color[1]))
            ];
        case 4:
            const dur = period * (ratio / 100);
            return [
                createLoopFrame(start, duration),
                createColorFrame(0, dur, 0, ...hex2rgb(color[0])),
                createColorFrame(dur, period - dur, 0, ...hex2rgb(color[1])),
                createEndFrame(period),
                createColorFrame(period, 0, 0, ...hex2rgb(color[0]))
            ];
        case 5:
            return [
                createColorFrame(start, duration, 0, 0, 0, 0)
            ];
        case 6:
            return [
                createLoopFrame(start, duration),
                createColorFrame(0, 1, 0, ...hex2rgb(color[0])),
                createColorFrame(1, spacing, 0, 0, 0, 0),
                createEndFrame(spacing + 1),
                createColorFrame(period, 0, 0, ...hex2rgb(color[0]))
            ];
        case 7:
            if (period < 24)
                period = 24;
            return [
                createLoopFrame(start, duration),
                createColorFrame(0, 10, 0, 0, 0, 0),
                createColorFrame(11, 2, 0, 255, 255, 255),
                createColorFrame(13, 10, 0, 0, 0, 0),
                createColorFrame(22, period - 22, 0, ...hex2rgb(color[0])),
                createEndFrame(period),
                createColorFrame(period, 0, 0, ...hex2rgb(color[0]))
            ];
        default:
            return [];
    }
}
exports.convertFrame = convertFrame;
function convertTracks(tracks) {
    const buf = [];
    tracks.forEach((track, index) => {
        if (index === 0) {
            buf.push(...new Array(createColorFrame(0, track.start, 0, 0, 0, 0)));
        }
        else if (index > 0 && index < tracks.length) {
            const last = tracks[index - 1];
            const gap = track.start - (last.start + last.duration);
            if (gap > 0)
                buf.push(...new Array(createColorFrame(last.start + last.duration, gap, 0, 0, 0, 0)));
        }
        buf.push(...new Array(convertFrame(track)));
        if (index === tracks.length - 1) {
            buf.push(...new Array(createEndFrame(track.start + track.duration)));
        }
    });
    return flattenDeep_1.default(buf);
}
exports.convertTracks = convertTracks;
function logHex(data) {
    console.log(data.map((c) => c.toString(16).padStart(2, '0')).join(' '));
}
exports.logHex = logHex;
window['convert'] = convertTracks;


/***/ }),

/***/ "./app/ts/view.ts":
/*!************************!*\
  !*** ./app/ts/view.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLight = exports.renderShow = exports.renderWaveform = exports.renderTempo = exports.renderAudio = exports.renderDevicesList = exports.renderSerial = exports.updateSize = exports.updateTime = exports.$tracks = exports.$main = exports.$handle = exports.$waveform = exports.$tempo = exports.$devices = exports.$shows = exports.$player = void 0;
const store_1 = __webpack_require__(/*! ./store */ "./app/ts/store.ts");
exports.$player = document.getElementById('player');
exports.$shows = document.getElementById('show-select');
exports.$devices = document.getElementById('serial-dev-select');
exports.$tempo = document.getElementById('tempo');
exports.$waveform = document.getElementById('waveform');
exports.$handle = document.getElementById('handle');
exports.$main = document.getElementById('main');
exports.$tracks = document.getElementById('tracks');
async function updateTime() {
    if (exports.$player.duration) {
        const ratio = exports.$player.currentTime / exports.$player.duration;
        exports.$main.scrollLeft = (exports.$main.scrollWidth - exports.$main.offsetWidth) * ratio;
        exports.$handle.style.left = ratio * 100 + '%';
    }
}
exports.updateTime = updateTime;
async function updateSize() {
    if (store_1.store.show && store_1.store.show.duration) {
        const width = store_1.store.show.duration / 10;
        exports.$tracks.style.width = width + 'px';
        exports.$waveform.style.width = width + 'px';
        exports.$tempo.style.width = width + 'px';
    }
}
exports.updateSize = updateSize;
async function renderSerial() {
    console.log('render serial');
    renderDevicesList();
    return new Promise(resolve => {
        const $c = document.getElementById('serial-connect');
        const $d = document.getElementById('serial-disconnect');
        if ($c && $d) {
            if (store_1.store.serial_connected) {
                $c.setAttribute('hidden', 'hidden');
                $d.removeAttribute('hidden');
                exports.$devices.setAttribute('disabled', 'disabled');
            }
            else {
                $d.setAttribute('hidden', 'hidden');
                $c.removeAttribute('hidden');
                exports.$devices.removeAttribute('disabled');
            }
        }
        resolve();
    });
}
exports.renderSerial = renderSerial;
async function renderDevicesList() {
    return new Promise(resolve => {
        chrome.serial.getDevices(devices => {
            exports.$devices.innerHTML = '<option value="">...</option>';
            devices.forEach(dev => {
                if (dev.path.startsWith('/dev/cu.')) {
                    const option = document.createElement('option');
                    option.value = dev.path;
                    option.innerHTML = dev.path.replace('/dev/cu.', '');
                    if (dev.path === store_1.store.serial_port)
                        option.selected = true;
                    exports.$devices.appendChild(option);
                }
            });
            resolve();
        });
    });
}
exports.renderDevicesList = renderDevicesList;
async function renderAudio(audio) {
    exports.$tempo.innerHTML = '';
    exports.$waveform.innerHTML = '';
    updateSize();
    if (audio) {
        renderTempo(audio);
        renderWaveform(audio);
    }
}
exports.renderAudio = renderAudio;
async function renderTempo(audio) {
    if (audio.beats) {
        audio.beats.reduce((start, end, index) => {
            const width = end - start;
            const $block = document.createElement('span');
            $block.classList.add('block');
            $block.style.width = width / 10 + 'px';
            $block.innerHTML = index ? `${(index - 1) % 8 + 1}` : `-`;
            exports.$tempo.appendChild($block);
            return end;
        }, 0);
    }
}
exports.renderTempo = renderTempo;
async function renderWaveform(audio) {
    if (audio.waveform) {
        console.log('render audio waveform');
        const height = exports.$waveform.offsetHeight;
        const halfHeight = height / 2;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        const size = 1;
        canvas.width = audio.duration / 10;
        canvas.height = height;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        audio.waveform.forEach(([max, min, pos, neg], i) => {
            const x = i * size;
            ctx.fillStyle = '#333333';
            const p1 = neg / height * halfHeight + halfHeight;
            ctx.fillRect(x, p1, size, (pos / height * halfHeight + halfHeight) - p1);
            ctx.fillStyle = '#000000';
            const p2 = Math.round(min / height * halfHeight) + halfHeight;
            ctx.fillRect(x, p2, size, Math.round(max / height * halfHeight + halfHeight) - p2);
        });
        if (audio.beats) {
            console.log('render audio tempo');
            audio.beats.forEach((time, i) => {
                if (i % 8 === 0) {
                    ctx.fillStyle = '#af0';
                    ctx.fillRect(time / 10 - 1, 0, 1, height);
                }
            });
        }
        exports.$waveform.appendChild(canvas);
    }
}
exports.renderWaveform = renderWaveform;
async function renderShow(show) {
    exports.$tracks.innerHTML = '';
    await updateSize();
    if (store_1.store.show) {
        store_1.store.show.tracks.forEach((track) => {
            const $track = document.createElement('div');
            const { frames, ...params } = track;
            Object.assign($track.dataset, params);
            $track.classList.add('track');
            exports.$tracks.appendChild($track);
            renderLight($track, track);
        });
    }
}
exports.renderShow = renderShow;
function renderLight(container, track) {
    switch (track.device) {
        case 1:
        case 2:
            track.frames.forEach(el => {
                const $el = document.createElement('span');
                const { color, ...params } = el;
                const { start, duration, ratio, spacing, period } = params;
                Object.assign($el.dataset, params);
                $el.style.left = `${start / 10}px`;
                $el.style.width = `${duration / 10}px`;
                switch (params.type) {
                    case 2:
                        $el.style.backgroundColor = color[0];
                        break;
                    case 3:
                        $el.style.background = `linear-gradient(90deg, ${color[0]} 0%, ${color[1]} 100%)`;
                        break;
                    case 4:
                        $el.style.backgroundImage = `url(${drawFlash(color[0], color[1], period, ratio)})`;
                        break;
                    case 5:
                        $el.style.backgroundImage = `url(${drawRainbow(period)})`;
                        break;
                    case 6:
                        $el.style.backgroundImage = `url(${drawDots(color[0], spacing)})`;
                        break;
                    case 7:
                        $el.style.backgroundImage = `url(${drawPulse(color[0], period)})`;
                        break;
                    default:
                        console.log("unhandled light type", [params.type]);
                }
                container.appendChild($el);
            });
            break;
        default:
            return console.log('unsupported device type', [track.device]);
    }
}
exports.renderLight = renderLight;
const tmpCanvas = document.createElement('canvas');
function drawFlash(color1, color2, period, ratio) {
    tmpCanvas.width = period / 10;
    tmpCanvas.height = 1;
    const ctx = tmpCanvas.getContext('2d');
    if (ctx) {
        const len1 = period * (ratio / 100) / 10;
        const len2 = period * ((100 - ratio) / 100) / 10;
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, len1, 1);
        ctx.fillStyle = color2;
        ctx.fillRect(len1, 0, len2, 1);
    }
    return tmpCanvas.toDataURL();
}
function drawDots(color, spacing) {
    tmpCanvas.width = spacing + 2;
    tmpCanvas.height = 1;
    const ctx = tmpCanvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = 'black';
        ctx.fillRect(1, 0, 1, 1);
    }
    return tmpCanvas.toDataURL();
}
function drawPulse(color, period) {
    tmpCanvas.width = period;
    tmpCanvas.height = 1;
    const ctx = tmpCanvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, period, 1);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 24, 1);
        ctx.fillStyle = 'white';
        ctx.fillRect(12, 0, 2, 1);
    }
    return tmpCanvas.toDataURL();
}
function drawRainbow(period) {
    tmpCanvas.width = period;
    tmpCanvas.height = 1;
    const ctx = tmpCanvas.getContext('2d');
    if (ctx) {
        var gradient = ctx.createLinearGradient(0, 0, period, 0);
        gradient.addColorStop(1 / 7 * 0, 'red');
        gradient.addColorStop(1 / 7 * 1, 'orange');
        gradient.addColorStop(1 / 7 * 2, 'yellow');
        gradient.addColorStop(1 / 7 * 3, 'green');
        gradient.addColorStop(1 / 7 * 4, 'cyan');
        gradient.addColorStop(1 / 7 * 5, 'blue');
        gradient.addColorStop(1 / 7 * 6, 'violet');
        gradient.addColorStop(1 / 7 * 7, 'red');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, period, 1);
    }
    return tmpCanvas.toDataURL();
}


/***/ }),

/***/ "./node_modules/assert/assert.js":
/*!***************************************!*\
  !*** ./node_modules/assert/assert.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var objectAssign = __webpack_require__(/*! object-assign */ "./node_modules/object-assign/index.js"); // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */


function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }

  if (y < x) {
    return 1;
  }

  return 0;
}

function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }

  return !!(b != null && b._isBuffer);
} // based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


var util = __webpack_require__(/*! util/ */ "./node_modules/util/util.js");

var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;

var functionsHaveNames = function () {
  return function foo() {}.name === 'foo';
}();

function pToString(obj) {
  return Object.prototype.toString.call(obj);
}

function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }

  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }

  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }

  if (!arrbuf) {
    return false;
  }

  if (arrbuf instanceof DataView) {
    return true;
  }

  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }

  return false;
} // 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.


var assert = module.exports = ok; // 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/; // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js

function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }

  if (functionsHaveNames) {
    return func.name;
  }

  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;

  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }

  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();

    if (err.stack) {
      var out = err.stack; // try to strip useless frames

      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);

      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
}; // assert.AssertionError instanceof Error


util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }

  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' + name + ']';
}

function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' + self.operator + ' ' + truncate(inspect(self.expected), 128);
} // At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.
// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.


function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
} // EXTENSION! allows for well behaved errors defined elsewhere.


assert.fail = fail; // 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}

assert.ok = ok; // 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
}; // 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);


assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
}; // 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);


assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0; // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime(); // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same source and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase; // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') && (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected; // If both values are instances of typed arrays, wrap their underlying
    // ArrayBuffers in a Buffer each to increase performance
    // This optimization requires the arrays to have the same type as checked by
    // Object.prototype.toString (aka pToString). Never perform binary
    // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
    // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0; // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {
      actual: [],
      expected: []
    };
    var actualIndex = memos.actual.indexOf(actual);

    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);
    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined) return false; // if one is a primitive, the other must be same

  if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return false;

  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }

  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i; // having the same number of owned properties (keys incorporates
  // hasOwnProperty)

  if (ka.length !== kb.length) return false; //the same set of keys (although not necessarily the same order),

  ka.sort();
  kb.sort(); //~~~cheap key test

  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i]) return false;
  } //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test


  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects)) return false;
  }

  return true;
} // 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);


assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;

function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
} // 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);


assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
}; // 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);


assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {// Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;

  try {
    block();
  } catch (e) {
    error = e;
  }

  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);
  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if (isUnwantedException && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
    throw actual;
  }
} // 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);


assert.throws = function (block,
/*optional*/
error,
/*optional*/
message) {
  _throws(true, block, error, message);
}; // EXTENSION! This is annoying to write outside this module.


assert.doesNotThrow = function (block,
/*optional*/
error,
/*optional*/
message) {
  _throws(false, block, error, message);
};

assert.ifError = function (err) {
  if (err) throw err;
}; // Expose a strict only variant of assert


function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}

assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }

  return keys;
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
} // Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications


revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function getLens(b64) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  } // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42


  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
} // base64 is 4/3 + up to two characters of the original data


function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}

function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0; // if there are placeholders, only get up to the last complete 4 chars

  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;

  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 0xFF;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 0xFF;
  }

  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 0xFF;
    arr[curByte++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];

  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 0xFF0000) + (uint8[i + 1] << 8 & 0xFF00) + (uint8[i + 2] & 0xFF);
    output.push(tripletToBase64(tmp));
  }

  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3
  // go through the array every three bytes, we'll deal with trailing stuff later

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  } // pad the end with zeros, but make sure to not forget the extra bytes


  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3F] + '==');
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3F] + lookup[tmp << 2 & 0x3F] + '=');
  }

  return parts.join('');
}

/***/ }),

/***/ "./node_modules/blob-slicer/src/index.js":
/*!***********************************************!*\
  !*** ./node_modules/blob-slicer/src/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var ReadStream = __webpack_require__(/*! ./read-stream */ "./node_modules/blob-slicer/src/read-stream.js");

module.exports = BlobSlicer;

function BlobSlicer(blob) {
  if (!(this instanceof BlobSlicer)) return new BlobSlicer(blob);
  if (!(blob instanceof Blob || ['[object Blob]', '[object File]'].indexOf(Object.prototype.toString.call(blob)) !== -1)) throw new TypeError('"blob" argument must be an instance of Blob or File');
  this._blob = blob;
}

BlobSlicer.prototype.read = function (start, end, cb) {
  if (typeof start === 'function') cb = start;else if (typeof end === 'function') {
    cb = end;
    end = this._blob.size;
  }
  if (typeof cb !== 'function') throw new TypeError('"callback" argument must be a function');
  start = ~~start;
  end = end === undefined ? this._blob.size : ~~end;
  var reader = new FileReader();
  reader.addEventListener('loadend', function onLoadend() {
    this.removeEventListener('loadend', onLoadend);
    cb(this.error, this.result ? Buffer.from(this.result) : null);
  });
  reader.readAsArrayBuffer(this._blob.slice(start, end));
};

BlobSlicer.prototype.createReadStream = function (options) {
  return new ReadStream(this._blob, options);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/blob-slicer/src/read-stream.js":
/*!*****************************************************!*\
  !*** ./node_modules/blob-slicer/src/read-stream.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var Readable = __webpack_require__(/*! readable-stream */ "./node_modules/readable-stream/readable-browser.js").Readable;

module.exports = ReadStream;

function ReadStream(blob, options) {
  if (!options) options = {};
  if (options.highWaterMark === undefined) options.highWaterMark = 64 * 1024;
  Readable.call(this, options);
  var start = ~~options.start;
  var end = options.end === undefined ? blob.size : ~~options.end;
  this._blob = blob.slice(start, end);
  this._end = this._blob.size;
  this._pos = 0;
  this._reader = new FileReader();
  var self = this;

  this._loadendListener = function () {
    if (this.error) {
      self.destroy(this.error);
      return;
    }

    self._pos += this.result.byteLength;
    self.push(Buffer.from(this.result));
  };

  this._reader.addEventListener('loadend', this._loadendListener);

  this.on('end', function () {
    this.destroy();
  });
}

ReadStream.prototype = Object.create(Readable.prototype);
ReadStream.prototype.constructor = ReadStream;
Object.defineProperties(ReadStream.prototype, {
  readableLength: {
    get: function () {
      return this._readableState.length;
    }
  },
  ended: {
    get: function () {
      return this._pos >= this._end;
    }
  }
});

ReadStream.prototype._read = function (n) {
  if (this.destroyed) return;

  if (this.ended) {
    this.push(null);
    return;
  }

  this._reader.readAsArrayBuffer(this._blob.slice(this._pos, this._pos + n));
};

ReadStream.prototype._destroy = function (err, cb) {
  cb(err);
  if (this._reader.readyState === FileReader.LOADING) this._reader.abort();

  this._reader.removeEventListener('loadend', this._loadendListener);

  this._reader = null;
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/browserify-zlib/lib/binding.js":
/*!*****************************************************!*\
  !*** ./node_modules/browserify-zlib/lib/binding.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer, process) {
/* eslint camelcase: "off" */

var assert = __webpack_require__(/*! assert */ "./node_modules/assert/assert.js");

var Zstream = __webpack_require__(/*! pako/lib/zlib/zstream */ "./node_modules/pako/lib/zlib/zstream.js");

var zlib_deflate = __webpack_require__(/*! pako/lib/zlib/deflate.js */ "./node_modules/pako/lib/zlib/deflate.js");

var zlib_inflate = __webpack_require__(/*! pako/lib/zlib/inflate.js */ "./node_modules/pako/lib/zlib/inflate.js");

var constants = __webpack_require__(/*! pako/lib/zlib/constants */ "./node_modules/pako/lib/zlib/constants.js");

for (var key in constants) {
  exports[key] = constants[key];
} // zlib modes


exports.NONE = 0;
exports.DEFLATE = 1;
exports.INFLATE = 2;
exports.GZIP = 3;
exports.GUNZIP = 4;
exports.DEFLATERAW = 5;
exports.INFLATERAW = 6;
exports.UNZIP = 7;
var GZIP_HEADER_ID1 = 0x1f;
var GZIP_HEADER_ID2 = 0x8b;
/**
 * Emulate Node's zlib C++ layer for use by the JS layer in index.js
 */

function Zlib(mode) {
  if (typeof mode !== 'number' || mode < exports.DEFLATE || mode > exports.UNZIP) {
    throw new TypeError('Bad argument');
  }

  this.dictionary = null;
  this.err = 0;
  this.flush = 0;
  this.init_done = false;
  this.level = 0;
  this.memLevel = 0;
  this.mode = mode;
  this.strategy = 0;
  this.windowBits = 0;
  this.write_in_progress = false;
  this.pending_close = false;
  this.gzip_id_bytes_read = 0;
}

Zlib.prototype.close = function () {
  if (this.write_in_progress) {
    this.pending_close = true;
    return;
  }

  this.pending_close = false;
  assert(this.init_done, 'close before init');
  assert(this.mode <= exports.UNZIP);

  if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
    zlib_deflate.deflateEnd(this.strm);
  } else if (this.mode === exports.INFLATE || this.mode === exports.GUNZIP || this.mode === exports.INFLATERAW || this.mode === exports.UNZIP) {
    zlib_inflate.inflateEnd(this.strm);
  }

  this.mode = exports.NONE;
  this.dictionary = null;
};

Zlib.prototype.write = function (flush, input, in_off, in_len, out, out_off, out_len) {
  return this._write(true, flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype.writeSync = function (flush, input, in_off, in_len, out, out_off, out_len) {
  return this._write(false, flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype._write = function (async, flush, input, in_off, in_len, out, out_off, out_len) {
  assert.equal(arguments.length, 8);
  assert(this.init_done, 'write before init');
  assert(this.mode !== exports.NONE, 'already finalized');
  assert.equal(false, this.write_in_progress, 'write already in progress');
  assert.equal(false, this.pending_close, 'close is pending');
  this.write_in_progress = true;
  assert.equal(false, flush === undefined, 'must provide flush value');
  this.write_in_progress = true;

  if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH && flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH && flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK) {
    throw new Error('Invalid flush value');
  }

  if (input == null) {
    input = Buffer.alloc(0);
    in_len = 0;
    in_off = 0;
  }

  this.strm.avail_in = in_len;
  this.strm.input = input;
  this.strm.next_in = in_off;
  this.strm.avail_out = out_len;
  this.strm.output = out;
  this.strm.next_out = out_off;
  this.flush = flush;

  if (!async) {
    // sync version
    this._process();

    if (this._checkError()) {
      return this._afterSync();
    }

    return;
  } // async version


  var self = this;
  process.nextTick(function () {
    self._process();

    self._after();
  });
  return this;
};

Zlib.prototype._afterSync = function () {
  var avail_out = this.strm.avail_out;
  var avail_in = this.strm.avail_in;
  this.write_in_progress = false;
  return [avail_in, avail_out];
};

Zlib.prototype._process = function () {
  var next_expected_header_byte = null; // If the avail_out is left at 0, then it means that it ran out
  // of room.  If there was avail_out left over, then it means
  // that all of the input was consumed.

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflate(this.strm, this.flush);
      break;

    case exports.UNZIP:
      if (this.strm.avail_in > 0) {
        next_expected_header_byte = this.strm.next_in;
      }

      switch (this.gzip_id_bytes_read) {
        case 0:
          if (next_expected_header_byte === null) {
            break;
          }

          if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID1) {
            this.gzip_id_bytes_read = 1;
            next_expected_header_byte++;

            if (this.strm.avail_in === 1) {
              // The only available byte was already read.
              break;
            }
          } else {
            this.mode = exports.INFLATE;
            break;
          }

        // fallthrough

        case 1:
          if (next_expected_header_byte === null) {
            break;
          }

          if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
            this.gzip_id_bytes_read = 2;
            this.mode = exports.GUNZIP;
          } else {
            // There is no actual difference between INFLATE and INFLATERAW
            // (after initialization).
            this.mode = exports.INFLATE;
          }

          break;

        default:
          throw new Error('invalid number of gzip magic number bytes read');
      }

    // fallthrough

    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
      this.err = zlib_inflate.inflate(this.strm, this.flush // If data was encoded with dictionary
      );

      if (this.err === exports.Z_NEED_DICT && this.dictionary) {
        // Load it
        this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);

        if (this.err === exports.Z_OK) {
          // And try to decode again
          this.err = zlib_inflate.inflate(this.strm, this.flush);
        } else if (this.err === exports.Z_DATA_ERROR) {
          // Both inflateSetDictionary() and inflate() return Z_DATA_ERROR.
          // Make it possible for After() to tell a bad dictionary from bad
          // input.
          this.err = exports.Z_NEED_DICT;
        }
      }

      while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP && this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0x00) {
        // Bytes remain in input buffer. Perhaps this is another compressed
        // member in the same archive, or just trailing garbage.
        // Trailing zero bytes are okay, though, since they are frequently
        // used for padding.
        this.reset();
        this.err = zlib_inflate.inflate(this.strm, this.flush);
      }

      break;

    default:
      throw new Error('Unknown mode ' + this.mode);
  }
};

Zlib.prototype._checkError = function () {
  // Acceptable error states depend on the type of zlib stream.
  switch (this.err) {
    case exports.Z_OK:
    case exports.Z_BUF_ERROR:
      if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
        this._error('unexpected end of file');

        return false;
      }

      break;

    case exports.Z_STREAM_END:
      // normal statuses, not fatal
      break;

    case exports.Z_NEED_DICT:
      if (this.dictionary == null) {
        this._error('Missing dictionary');
      } else {
        this._error('Bad dictionary');
      }

      return false;

    default:
      // something else.
      this._error('Zlib error');

      return false;
  }

  return true;
};

Zlib.prototype._after = function () {
  if (!this._checkError()) {
    return;
  }

  var avail_out = this.strm.avail_out;
  var avail_in = this.strm.avail_in;
  this.write_in_progress = false; // call the write() cb

  this.callback(avail_in, avail_out);

  if (this.pending_close) {
    this.close();
  }
};

Zlib.prototype._error = function (message) {
  if (this.strm.msg) {
    message = this.strm.msg;
  }

  this.onerror(message, this.err // no hope of rescue.
  );
  this.write_in_progress = false;

  if (this.pending_close) {
    this.close();
  }
};

Zlib.prototype.init = function (windowBits, level, memLevel, strategy, dictionary) {
  assert(arguments.length === 4 || arguments.length === 5, 'init(windowBits, level, memLevel, strategy, [dictionary])');
  assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits');
  assert(level >= -1 && level <= 9, 'invalid compression level');
  assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel');
  assert(strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE || strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY, 'invalid strategy');

  this._init(level, windowBits, memLevel, strategy, dictionary);

  this._setDictionary();
};

Zlib.prototype.params = function () {
  throw new Error('deflateParams Not supported');
};

Zlib.prototype.reset = function () {
  this._reset();

  this._setDictionary();
};

Zlib.prototype._init = function (level, windowBits, memLevel, strategy, dictionary) {
  this.level = level;
  this.windowBits = windowBits;
  this.memLevel = memLevel;
  this.strategy = strategy;
  this.flush = exports.Z_NO_FLUSH;
  this.err = exports.Z_OK;

  if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) {
    this.windowBits += 16;
  }

  if (this.mode === exports.UNZIP) {
    this.windowBits += 32;
  }

  if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) {
    this.windowBits = -1 * this.windowBits;
  }

  this.strm = new Zstream();

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflateInit2(this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy);
      break;

    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
    case exports.UNZIP:
      this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits);
      break;

    default:
      throw new Error('Unknown mode ' + this.mode);
  }

  if (this.err !== exports.Z_OK) {
    this._error('Init error');
  }

  this.dictionary = dictionary;
  this.write_in_progress = false;
  this.init_done = true;
};

Zlib.prototype._setDictionary = function () {
  if (this.dictionary == null) {
    return;
  }

  this.err = exports.Z_OK;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
      break;

    default:
      break;
  }

  if (this.err !== exports.Z_OK) {
    this._error('Failed to set dictionary');
  }
};

Zlib.prototype._reset = function () {
  this.err = exports.Z_OK;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
    case exports.GZIP:
      this.err = zlib_deflate.deflateReset(this.strm);
      break;

    case exports.INFLATE:
    case exports.INFLATERAW:
    case exports.GUNZIP:
      this.err = zlib_inflate.inflateReset(this.strm);
      break;

    default:
      break;
  }

  if (this.err !== exports.Z_OK) {
    this._error('Failed to reset stream');
  }
};

exports.Zlib = Zlib;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/browserify-zlib/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/browserify-zlib/lib/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js").Buffer;

var Transform = __webpack_require__(/*! stream */ "./node_modules/stream-browserify/index.js").Transform;

var binding = __webpack_require__(/*! ./binding */ "./node_modules/browserify-zlib/lib/binding.js");

var util = __webpack_require__(/*! util */ "./node_modules/util/util.js");

var assert = __webpack_require__(/*! assert */ "./node_modules/assert/assert.js").ok;

var kMaxLength = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js").kMaxLength;

var kRangeErrorMessage = 'Cannot create final Buffer. It would be larger ' + 'than 0x' + kMaxLength.toString(16) + ' bytes'; // zlib doesn't provide these, so kludge them in following the same
// const naming scheme zlib uses.

binding.Z_MIN_WINDOWBITS = 8;
binding.Z_MAX_WINDOWBITS = 15;
binding.Z_DEFAULT_WINDOWBITS = 15; // fewer than 64 bytes per chunk is stupid.
// technically it could work with as few as 8, but even 64 bytes
// is absurdly low.  Usually a MB or more is best.

binding.Z_MIN_CHUNK = 64;
binding.Z_MAX_CHUNK = Infinity;
binding.Z_DEFAULT_CHUNK = 16 * 1024;
binding.Z_MIN_MEMLEVEL = 1;
binding.Z_MAX_MEMLEVEL = 9;
binding.Z_DEFAULT_MEMLEVEL = 8;
binding.Z_MIN_LEVEL = -1;
binding.Z_MAX_LEVEL = 9;
binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION; // expose all the zlib constants

var bkeys = Object.keys(binding);

for (var bk = 0; bk < bkeys.length; bk++) {
  var bkey = bkeys[bk];

  if (bkey.match(/^Z/)) {
    Object.defineProperty(exports, bkey, {
      enumerable: true,
      value: binding[bkey],
      writable: false
    });
  }
} // translation table for return codes.


var codes = {
  Z_OK: binding.Z_OK,
  Z_STREAM_END: binding.Z_STREAM_END,
  Z_NEED_DICT: binding.Z_NEED_DICT,
  Z_ERRNO: binding.Z_ERRNO,
  Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
  Z_DATA_ERROR: binding.Z_DATA_ERROR,
  Z_MEM_ERROR: binding.Z_MEM_ERROR,
  Z_BUF_ERROR: binding.Z_BUF_ERROR,
  Z_VERSION_ERROR: binding.Z_VERSION_ERROR
};
var ckeys = Object.keys(codes);

for (var ck = 0; ck < ckeys.length; ck++) {
  var ckey = ckeys[ck];
  codes[codes[ckey]] = ckey;
}

Object.defineProperty(exports, 'codes', {
  enumerable: true,
  value: Object.freeze(codes),
  writable: false
});
exports.Deflate = Deflate;
exports.Inflate = Inflate;
exports.Gzip = Gzip;
exports.Gunzip = Gunzip;
exports.DeflateRaw = DeflateRaw;
exports.InflateRaw = InflateRaw;
exports.Unzip = Unzip;

exports.createDeflate = function (o) {
  return new Deflate(o);
};

exports.createInflate = function (o) {
  return new Inflate(o);
};

exports.createDeflateRaw = function (o) {
  return new DeflateRaw(o);
};

exports.createInflateRaw = function (o) {
  return new InflateRaw(o);
};

exports.createGzip = function (o) {
  return new Gzip(o);
};

exports.createGunzip = function (o) {
  return new Gunzip(o);
};

exports.createUnzip = function (o) {
  return new Unzip(o);
}; // Convenience methods.
// compress/decompress a string or buffer in one step.


exports.deflate = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new Deflate(opts), buffer, callback);
};

exports.deflateSync = function (buffer, opts) {
  return zlibBufferSync(new Deflate(opts), buffer);
};

exports.gzip = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new Gzip(opts), buffer, callback);
};

exports.gzipSync = function (buffer, opts) {
  return zlibBufferSync(new Gzip(opts), buffer);
};

exports.deflateRaw = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new DeflateRaw(opts), buffer, callback);
};

exports.deflateRawSync = function (buffer, opts) {
  return zlibBufferSync(new DeflateRaw(opts), buffer);
};

exports.unzip = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new Unzip(opts), buffer, callback);
};

exports.unzipSync = function (buffer, opts) {
  return zlibBufferSync(new Unzip(opts), buffer);
};

exports.inflate = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new Inflate(opts), buffer, callback);
};

exports.inflateSync = function (buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
};

exports.gunzip = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new Gunzip(opts), buffer, callback);
};

exports.gunzipSync = function (buffer, opts) {
  return zlibBufferSync(new Gunzip(opts), buffer);
};

exports.inflateRaw = function (buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  return zlibBuffer(new InflateRaw(opts), buffer, callback);
};

exports.inflateRawSync = function (buffer, opts) {
  return zlibBufferSync(new InflateRaw(opts), buffer);
};

function zlibBuffer(engine, buffer, callback) {
  var buffers = [];
  var nread = 0;
  engine.on('error', onError);
  engine.on('end', onEnd);
  engine.end(buffer);
  flow();

  function flow() {
    var chunk;

    while (null !== (chunk = engine.read())) {
      buffers.push(chunk);
      nread += chunk.length;
    }

    engine.once('readable', flow);
  }

  function onError(err) {
    engine.removeListener('end', onEnd);
    engine.removeListener('readable', flow);
    callback(err);
  }

  function onEnd() {
    var buf;
    var err = null;

    if (nread >= kMaxLength) {
      err = new RangeError(kRangeErrorMessage);
    } else {
      buf = Buffer.concat(buffers, nread);
    }

    buffers = [];
    engine.close();
    callback(err, buf);
  }
}

function zlibBufferSync(engine, buffer) {
  if (typeof buffer === 'string') buffer = Buffer.from(buffer);
  if (!Buffer.isBuffer(buffer)) throw new TypeError('Not a string or buffer');
  var flushFlag = engine._finishFlushFlag;
  return engine._processChunk(buffer, flushFlag);
} // generic zlib
// minimal 2-byte header


function Deflate(opts) {
  if (!(this instanceof Deflate)) return new Deflate(opts);
  Zlib.call(this, opts, binding.DEFLATE);
}

function Inflate(opts) {
  if (!(this instanceof Inflate)) return new Inflate(opts);
  Zlib.call(this, opts, binding.INFLATE);
} // gzip - bigger header, same deflate compression


function Gzip(opts) {
  if (!(this instanceof Gzip)) return new Gzip(opts);
  Zlib.call(this, opts, binding.GZIP);
}

function Gunzip(opts) {
  if (!(this instanceof Gunzip)) return new Gunzip(opts);
  Zlib.call(this, opts, binding.GUNZIP);
} // raw - no header


function DeflateRaw(opts) {
  if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
  Zlib.call(this, opts, binding.DEFLATERAW);
}

function InflateRaw(opts) {
  if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
  Zlib.call(this, opts, binding.INFLATERAW);
} // auto-detect header.


function Unzip(opts) {
  if (!(this instanceof Unzip)) return new Unzip(opts);
  Zlib.call(this, opts, binding.UNZIP);
}

function isValidFlushFlag(flag) {
  return flag === binding.Z_NO_FLUSH || flag === binding.Z_PARTIAL_FLUSH || flag === binding.Z_SYNC_FLUSH || flag === binding.Z_FULL_FLUSH || flag === binding.Z_FINISH || flag === binding.Z_BLOCK;
} // the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.


function Zlib(opts, mode) {
  var _this = this;

  this._opts = opts = opts || {};
  this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;
  Transform.call(this, opts);

  if (opts.flush && !isValidFlushFlag(opts.flush)) {
    throw new Error('Invalid flush flag: ' + opts.flush);
  }

  if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush)) {
    throw new Error('Invalid flush flag: ' + opts.finishFlush);
  }

  this._flushFlag = opts.flush || binding.Z_NO_FLUSH;
  this._finishFlushFlag = typeof opts.finishFlush !== 'undefined' ? opts.finishFlush : binding.Z_FINISH;

  if (opts.chunkSize) {
    if (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK) {
      throw new Error('Invalid chunk size: ' + opts.chunkSize);
    }
  }

  if (opts.windowBits) {
    if (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS) {
      throw new Error('Invalid windowBits: ' + opts.windowBits);
    }
  }

  if (opts.level) {
    if (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL) {
      throw new Error('Invalid compression level: ' + opts.level);
    }
  }

  if (opts.memLevel) {
    if (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL) {
      throw new Error('Invalid memLevel: ' + opts.memLevel);
    }
  }

  if (opts.strategy) {
    if (opts.strategy != exports.Z_FILTERED && opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE && opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY) {
      throw new Error('Invalid strategy: ' + opts.strategy);
    }
  }

  if (opts.dictionary) {
    if (!Buffer.isBuffer(opts.dictionary)) {
      throw new Error('Invalid dictionary: it should be a Buffer instance');
    }
  }

  this._handle = new binding.Zlib(mode);
  var self = this;
  this._hadError = false;

  this._handle.onerror = function (message, errno) {
    // there is no way to cleanly recover.
    // continuing only obscures problems.
    _close(self);

    self._hadError = true;
    var error = new Error(message);
    error.errno = errno;
    error.code = exports.codes[errno];
    self.emit('error', error);
  };

  var level = exports.Z_DEFAULT_COMPRESSION;
  if (typeof opts.level === 'number') level = opts.level;
  var strategy = exports.Z_DEFAULT_STRATEGY;
  if (typeof opts.strategy === 'number') strategy = opts.strategy;

  this._handle.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS, level, opts.memLevel || exports.Z_DEFAULT_MEMLEVEL, strategy, opts.dictionary);

  this._buffer = Buffer.allocUnsafe(this._chunkSize);
  this._offset = 0;
  this._level = level;
  this._strategy = strategy;
  this.once('end', this.close);
  Object.defineProperty(this, '_closed', {
    get: function () {
      return !_this._handle;
    },
    configurable: true,
    enumerable: true
  });
}

util.inherits(Zlib, Transform);

Zlib.prototype.params = function (level, strategy, callback) {
  if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL) {
    throw new RangeError('Invalid compression level: ' + level);
  }

  if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY && strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY) {
    throw new TypeError('Invalid strategy: ' + strategy);
  }

  if (this._level !== level || this._strategy !== strategy) {
    var self = this;
    this.flush(binding.Z_SYNC_FLUSH, function () {
      assert(self._handle, 'zlib binding closed');

      self._handle.params(level, strategy);

      if (!self._hadError) {
        self._level = level;
        self._strategy = strategy;
        if (callback) callback();
      }
    });
  } else {
    process.nextTick(callback);
  }
};

Zlib.prototype.reset = function () {
  assert(this._handle, 'zlib binding closed');
  return this._handle.reset();
}; // This is the _flush function called by the transform class,
// internally, when the last chunk has been written.


Zlib.prototype._flush = function (callback) {
  this._transform(Buffer.alloc(0), '', callback);
};

Zlib.prototype.flush = function (kind, callback) {
  var _this2 = this;

  var ws = this._writableState;

  if (typeof kind === 'function' || kind === undefined && !callback) {
    callback = kind;
    kind = binding.Z_FULL_FLUSH;
  }

  if (ws.ended) {
    if (callback) process.nextTick(callback);
  } else if (ws.ending) {
    if (callback) this.once('end', callback);
  } else if (ws.needDrain) {
    if (callback) {
      this.once('drain', function () {
        return _this2.flush(kind, callback);
      });
    }
  } else {
    this._flushFlag = kind;
    this.write(Buffer.alloc(0), '', callback);
  }
};

Zlib.prototype.close = function (callback) {
  _close(this, callback);

  process.nextTick(emitCloseNT, this);
};

function _close(engine, callback) {
  if (callback) process.nextTick(callback); // Caller may invoke .close after a zlib error (which will null _handle).

  if (!engine._handle) return;

  engine._handle.close();

  engine._handle = null;
}

function emitCloseNT(self) {
  self.emit('close');
}

Zlib.prototype._transform = function (chunk, encoding, cb) {
  var flushFlag;
  var ws = this._writableState;
  var ending = ws.ending || ws.ended;
  var last = ending && (!chunk || ws.length === chunk.length);
  if (chunk !== null && !Buffer.isBuffer(chunk)) return cb(new Error('invalid input'));
  if (!this._handle) return cb(new Error('zlib binding closed')); // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag
  // (or whatever flag was provided using opts.finishFlush).
  // If it's explicitly flushing at some other time, then we use
  // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
  // goodness.

  if (last) flushFlag = this._finishFlushFlag;else {
    flushFlag = this._flushFlag; // once we've flushed the last of the queue, stop flushing and
    // go back to the normal behavior.

    if (chunk.length >= ws.length) {
      this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
    }
  }

  this._processChunk(chunk, flushFlag, cb);
};

Zlib.prototype._processChunk = function (chunk, flushFlag, cb) {
  var availInBefore = chunk && chunk.length;
  var availOutBefore = this._chunkSize - this._offset;
  var inOff = 0;
  var self = this;
  var async = typeof cb === 'function';

  if (!async) {
    var buffers = [];
    var nread = 0;
    var error;
    this.on('error', function (er) {
      error = er;
    });
    assert(this._handle, 'zlib binding closed');

    do {
      var res = this._handle.writeSync(flushFlag, chunk, // in
      inOff, // in_off
      availInBefore, // in_len
      this._buffer, // out
      this._offset, //out_off
      availOutBefore); // out_len

    } while (!this._hadError && callback(res[0], res[1]));

    if (this._hadError) {
      throw error;
    }

    if (nread >= kMaxLength) {
      _close(this);

      throw new RangeError(kRangeErrorMessage);
    }

    var buf = Buffer.concat(buffers, nread);

    _close(this);

    return buf;
  }

  assert(this._handle, 'zlib binding closed');

  var req = this._handle.write(flushFlag, chunk, // in
  inOff, // in_off
  availInBefore, // in_len
  this._buffer, // out
  this._offset, //out_off
  availOutBefore); // out_len


  req.buffer = chunk;
  req.callback = callback;

  function callback(availInAfter, availOutAfter) {
    // When the callback is used in an async write, the callback's
    // context is the `req` object that was created. The req object
    // is === this._handle, and that's why it's important to null
    // out the values after they are done being used. `this._handle`
    // can stay in memory longer than the callback and buffer are needed.
    if (this) {
      this.buffer = null;
      this.callback = null;
    }

    if (self._hadError) return;
    var have = availOutBefore - availOutAfter;
    assert(have >= 0, 'have should not go down');

    if (have > 0) {
      var out = self._buffer.slice(self._offset, self._offset + have);

      self._offset += have; // serve some output to the consumer.

      if (async) {
        self.push(out);
      } else {
        buffers.push(out);
        nread += out.length;
      }
    } // exhausted the output buffer, or used all the input create a new one.


    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = Buffer.allocUnsafe(self._chunkSize);
    }

    if (availOutAfter === 0) {
      // Not actually done.  Need to reprocess.
      // Also, update the availInBefore to the availInAfter value,
      // so that if we have to hit it a third (fourth, etc.) time,
      // it'll have the correct byte counts.
      inOff += availInBefore - availInAfter;
      availInBefore = availInAfter;
      if (!async) return true;

      var newReq = self._handle.write(flushFlag, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize);

      newReq.callback = callback; // this same function

      newReq.buffer = chunk;
      return;
    }

    if (!async) return false; // finished with the chunk.

    cb();
  }
};

util.inherits(Deflate, Zlib);
util.inherits(Inflate, Zlib);
util.inherits(Gzip, Zlib);
util.inherits(Gunzip, Zlib);
util.inherits(DeflateRaw, Zlib);
util.inherits(InflateRaw, Zlib);
util.inherits(Unzip, Zlib);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/buffer-crc32/index.js":
/*!********************************************!*\
  !*** ./node_modules/buffer-crc32/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js").Buffer;

var CRC_TABLE = [0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91, 0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5, 0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59, 0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d, 0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01, 0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65, 0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9, 0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad, 0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1, 0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5, 0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79, 0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d, 0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21, 0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45, 0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9, 0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d];

if (typeof Int32Array !== 'undefined') {
  CRC_TABLE = new Int32Array(CRC_TABLE);
}

function ensureBuffer(input) {
  if (Buffer.isBuffer(input)) {
    return input;
  }

  var hasNewBufferAPI = typeof Buffer.alloc === "function" && typeof Buffer.from === "function";

  if (typeof input === "number") {
    return hasNewBufferAPI ? Buffer.alloc(input) : new Buffer(input);
  } else if (typeof input === "string") {
    return hasNewBufferAPI ? Buffer.from(input) : new Buffer(input);
  } else {
    throw new Error("input must be buffer, number, or string, received " + typeof input);
  }
}

function bufferizeInt(num) {
  var tmp = ensureBuffer(4);
  tmp.writeInt32BE(num, 0);
  return tmp;
}

function _crc32(buf, previous) {
  buf = ensureBuffer(buf);

  if (Buffer.isBuffer(previous)) {
    previous = previous.readUInt32BE(0);
  }

  var crc = ~~previous ^ -1;

  for (var n = 0; n < buf.length; n++) {
    crc = CRC_TABLE[(crc ^ buf[n]) & 0xff] ^ crc >>> 8;
  }

  return crc ^ -1;
}

function crc32() {
  return bufferizeInt(_crc32.apply(null, arguments));
}

crc32.signed = function () {
  return _crc32.apply(null, arguments);
};

crc32.unsigned = function () {
  return _crc32.apply(null, arguments) >>> 0;
};

module.exports = crc32;

/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */

/* eslint-disable no-proto */


var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js");

var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js");

var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js");

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */

Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
/*
 * Export kMaxLength after typed array support is determined.
 */

exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = {
      __proto__: Uint8Array.prototype,
      foo: function () {
        return 42;
      }
    };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }

    that.length = length;
  }

  return that;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */


function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  } // Common case.


  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }

    return allocUnsafe(this, arg);
  }

  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation
// TODO: Legacy, not needed anymore. Remove in next major version.

Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/


Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;

  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);

  if (size <= 0) {
    return createBuffer(that, size);
  }

  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }

  return createBuffer(that, size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/


Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }

  return that;
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */


Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */


Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }

  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }

  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }

      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }

  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }

  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;
  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;

    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;

  if (length === undefined) {
    length = 0;

    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;

  for (i = 0; i < list.length; ++i) {
    var buf = list[i];

    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }

    buf.copy(buffer, pos);
    pos += buf.length;
  }

  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }

  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }

  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0; // Use a for loop to avoid recursion

  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;

      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;

      case 'hex':
        return len >>> 1;

      case 'base64':
        return base64ToBytes(string).length;

      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8

        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}

Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false; // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.
  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.

  if (start === undefined || start < 0) {
    start = 0;
  } // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.


  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  } // Force coersion to uint32. This will also coerce falsey/NaN values to 0.


  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
} // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.


Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;

  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }

  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }

  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;

  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }

  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }

  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;

  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }

  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }

  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;

  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }

  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }

  if (end === undefined) {
    end = target ? target.length : 0;
  }

  if (thisStart === undefined) {
    thisStart = 0;
  }

  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }

  if (thisStart >= thisEnd) {
    return -1;
  }

  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target) return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
}; // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf


function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1; // Normalize byteOffset

  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }

  byteOffset = +byteOffset; // Coerce to Number.

  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  } // Normalize byteOffset: negative offsets start from the end of the buffer


  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;

  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  } // Normalize val


  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  } // Finally, search either indexOf (if dir is true) or lastIndexOf


  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }

    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]

    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }

    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();

    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }

      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;

  if (dir) {
    var foundIndex = -1;

    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;

    for (i = byteOffset; i >= 0; i--) {
      var found = true;

      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }

      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;

  if (!length) {
    length = remaining;
  } else {
    length = Number(length);

    if (length > remaining) {
      length = remaining;
    }
  } // must be an even number of digits


  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }

  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }

  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0; // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0; // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;

    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    } // legacy write(string, encoding, offset, length) - remove in v0.13

  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';
  var loweredCase = false;

  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;

  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }

          break;

        case 2:
          secondByte = buf[i + 1];

          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;

            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;

            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }

          break;

        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];

          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;

            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }

      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
} // Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety


var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;

  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  } // Decode in chunks to avoid "call stack size exceeded".


  var res = '';
  var i = 0;

  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }

  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }

  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }

  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;
  var out = '';

  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }

  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';

  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }

  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;
  var newBuf;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);

    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */


function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;

  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;

  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);
  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];

  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }

  mul *= 0x80;
  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;

  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;

  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;

  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;

  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);
    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;

  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }

    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }

  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }

  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }

  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }

  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
}; // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)


Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start; // Copy 0 bytes; we're done

  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0; // Fatal error conditions

  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds'); // Are we oob?

  if (end > this.length) end = this.length;

  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
}; // Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])


Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }

    if (val.length === 1) {
      var code = val.charCodeAt(0);

      if (code < 256) {
        val = code;
      }
    }

    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }

    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  } // Invalid ranges are not set to a default, so can range check early.


  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;
  if (!val) val = 0;
  var i;

  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;

    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
}; // HELPER FUNCTIONS
// ================


var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, ''); // Node converts strings with length < 2 to ''

  if (str.length < 2) return ''; // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not

  while (str.length % 4 !== 0) {
    str = str + '=';
  }

  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i); // is surrogate component

    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } // valid lead


        leadSurrogate = codePoint;
        continue;
      } // 2 leads in a row


      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      } // valid surrogate pair


      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null; // encode utf8

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }

  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];

  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }

  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/core-util-is/lib/util.js":
/*!***********************************************!*\
  !*** ./node_modules/core-util-is/lib/util.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }

  return objectToString(arg) === '[object Array]';
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return objectToString(e) === '[object Error]' || e instanceof Error;
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function eventListener() {
      if (errorListener !== undefined) {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    var errorListener; // Adding an error listener is not optional because
    // if an error is thrown on an event emitter we cannot
    // guarantee that the actual event we are waiting will
    // be fired. The result could be a silent way to create
    // memory or file descriptor leaks, which is something
    // we should avoid.

    if (name !== 'error') {
      errorListener = function errorListener(err) {
        emitter.removeListener(name, eventListener);
        reject(err);
      };

      emitter.once('error', errorListener);
    }

    emitter.once(name, eventListener);
  });
}

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;

  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;

  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }

  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);

    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }

    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;

  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;

      var TempCtor = function () {};

      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}

/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ }),

/***/ "./node_modules/jszip/dist/jszip.min.js":
/*!**********************************************!*\
  !*** ./node_modules/jszip/dist/jszip.min.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer, global, setImmediate) {var require;var require;/*!

JSZip v3.5.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function (t) {
  if (true) module.exports = t();else {}
}(function () {
  return function s(a, o, h) {
    function u(r, t) {
      if (!o[r]) {
        if (!a[r]) {
          var e = "function" == typeof require && require;
          if (!t && e) return require(r, !0);
          if (l) return l(r, !0);
          var i = new Error("Cannot find module '" + r + "'");
          throw i.code = "MODULE_NOT_FOUND", i;
        }

        var n = o[r] = {
          exports: {}
        };
        a[r][0].call(n.exports, function (t) {
          var e = a[r][1][t];
          return u(e || t);
        }, n, n.exports, s, a, o, h);
      }

      return o[r].exports;
    }

    for (var l = "function" == typeof require && require, t = 0; t < h.length; t++) u(h[t]);

    return u;
  }({
    1: [function (t, e, r) {
      "use strict";

      var c = t("./utils"),
          d = t("./support"),
          p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      r.encode = function (t) {
        for (var e, r, i, n, s, a, o, h = [], u = 0, l = t.length, f = l, d = "string" !== c.getTypeOf(t); u < t.length;) f = l - u, i = d ? (e = t[u++], r = u < l ? t[u++] : 0, u < l ? t[u++] : 0) : (e = t.charCodeAt(u++), r = u < l ? t.charCodeAt(u++) : 0, u < l ? t.charCodeAt(u++) : 0), n = e >> 2, s = (3 & e) << 4 | r >> 4, a = 1 < f ? (15 & r) << 2 | i >> 6 : 64, o = 2 < f ? 63 & i : 64, h.push(p.charAt(n) + p.charAt(s) + p.charAt(a) + p.charAt(o));

        return h.join("");
      }, r.decode = function (t) {
        var e,
            r,
            i,
            n,
            s,
            a,
            o = 0,
            h = 0,
            u = "data:";
        if (t.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
        var l,
            f = 3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
        if (t.charAt(t.length - 1) === p.charAt(64) && f--, t.charAt(t.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");

        for (l = d.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < t.length;) e = p.indexOf(t.charAt(o++)) << 2 | (n = p.indexOf(t.charAt(o++))) >> 4, r = (15 & n) << 4 | (s = p.indexOf(t.charAt(o++))) >> 2, i = (3 & s) << 6 | (a = p.indexOf(t.charAt(o++))), l[h++] = e, 64 !== s && (l[h++] = r), 64 !== a && (l[h++] = i);

        return l;
      };
    }, {
      "./support": 30,
      "./utils": 32
    }],
    2: [function (t, e, r) {
      "use strict";

      var i = t("./external"),
          n = t("./stream/DataWorker"),
          s = t("./stream/DataLengthProbe"),
          a = t("./stream/Crc32Probe");
      s = t("./stream/DataLengthProbe");

      function o(t, e, r, i, n) {
        this.compressedSize = t, this.uncompressedSize = e, this.crc32 = r, this.compression = i, this.compressedContent = n;
      }

      o.prototype = {
        getContentWorker: function () {
          var t = new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),
              e = this;
          return t.on("end", function () {
            if (this.streamInfo.data_length !== e.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), t;
        },
        getCompressedWorker: function () {
          return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        }
      }, o.createWorkerFrom = function (t, e, r) {
        return t.pipe(new a()).pipe(new s("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression", e);
      }, e.exports = o;
    }, {
      "./external": 6,
      "./stream/Crc32Probe": 25,
      "./stream/DataLengthProbe": 26,
      "./stream/DataWorker": 27
    }],
    3: [function (t, e, r) {
      "use strict";

      var i = t("./stream/GenericWorker");
      r.STORE = {
        magic: "\0\0",
        compressWorker: function (t) {
          return new i("STORE compression");
        },
        uncompressWorker: function () {
          return new i("STORE decompression");
        }
      }, r.DEFLATE = t("./flate");
    }, {
      "./flate": 7,
      "./stream/GenericWorker": 28
    }],
    4: [function (t, e, r) {
      "use strict";

      var i = t("./utils");

      var o = function () {
        for (var t, e = [], r = 0; r < 256; r++) {
          t = r;

          for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;

          e[r] = t;
        }

        return e;
      }();

      e.exports = function (t, e) {
        return void 0 !== t && t.length ? "string" !== i.getTypeOf(t) ? function (t, e, r, i) {
          var n = o,
              s = i + r;
          t ^= -1;

          for (var a = i; a < s; a++) t = t >>> 8 ^ n[255 & (t ^ e[a])];

          return -1 ^ t;
        }(0 | e, t, t.length, 0) : function (t, e, r, i) {
          var n = o,
              s = i + r;
          t ^= -1;

          for (var a = i; a < s; a++) t = t >>> 8 ^ n[255 & (t ^ e.charCodeAt(a))];

          return -1 ^ t;
        }(0 | e, t, t.length, 0) : 0;
      };
    }, {
      "./utils": 32
    }],
    5: [function (t, e, r) {
      "use strict";

      r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
    }, {}],
    6: [function (t, e, r) {
      "use strict";

      var i = null;
      i = "undefined" != typeof Promise ? Promise : t("lie"), e.exports = {
        Promise: i
      };
    }, {
      lie: 37
    }],
    7: [function (t, e, r) {
      "use strict";

      var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
          n = t("pako"),
          s = t("./utils"),
          a = t("./stream/GenericWorker"),
          o = i ? "uint8array" : "array";

      function h(t, e) {
        a.call(this, "FlateWorker/" + t), this._pako = null, this._pakoAction = t, this._pakoOptions = e, this.meta = {};
      }

      r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function (t) {
        this.meta = t.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, t.data), !1);
      }, h.prototype.flush = function () {
        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0);
      }, h.prototype.cleanUp = function () {
        a.prototype.cleanUp.call(this), this._pako = null;
      }, h.prototype._createPako = function () {
        this._pako = new n[this._pakoAction]({
          raw: !0,
          level: this._pakoOptions.level || -1
        });
        var e = this;

        this._pako.onData = function (t) {
          e.push({
            data: t,
            meta: e.meta
          });
        };
      }, r.compressWorker = function (t) {
        return new h("Deflate", t);
      }, r.uncompressWorker = function () {
        return new h("Inflate", {});
      };
    }, {
      "./stream/GenericWorker": 28,
      "./utils": 32,
      pako: 38
    }],
    8: [function (t, e, r) {
      "use strict";

      function A(t, e) {
        var r,
            i = "";

        for (r = 0; r < e; r++) i += String.fromCharCode(255 & t), t >>>= 8;

        return i;
      }

      function i(t, e, r, i, n, s) {
        var a,
            o,
            h = t.file,
            u = t.compression,
            l = s !== O.utf8encode,
            f = I.transformTo("string", s(h.name)),
            d = I.transformTo("string", O.utf8encode(h.name)),
            c = h.comment,
            p = I.transformTo("string", s(c)),
            m = I.transformTo("string", O.utf8encode(c)),
            _ = d.length !== h.name.length,
            g = m.length !== c.length,
            b = "",
            v = "",
            y = "",
            w = h.dir,
            k = h.date,
            x = {
          crc32: 0,
          compressedSize: 0,
          uncompressedSize: 0
        };

        e && !r || (x.crc32 = t.crc32, x.compressedSize = t.compressedSize, x.uncompressedSize = t.uncompressedSize);
        var S = 0;
        e && (S |= 8), l || !_ && !g || (S |= 2048);
        var z = 0,
            C = 0;
        w && (z |= 16), "UNIX" === n ? (C = 798, z |= function (t, e) {
          var r = t;
          return t || (r = e ? 16893 : 33204), (65535 & r) << 16;
        }(h.unixPermissions, w)) : (C = 20, z |= function (t) {
          return 63 & (t || 0);
        }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + d, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), {
          fileRecord: R.LOCAL_FILE_HEADER + E + f + b,
          dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(i, 4) + f + b + p
        };
      }

      var I = t("../utils"),
          n = t("../stream/GenericWorker"),
          O = t("../utf8"),
          B = t("../crc32"),
          R = t("../signature");

      function s(t, e, r, i) {
        n.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = e, this.zipPlatform = r, this.encodeFileName = i, this.streamFiles = t, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }

      I.inherits(s, n), s.prototype.push = function (t) {
        var e = t.meta.percent || 0,
            r = this.entriesCount,
            i = this._sources.length;
        this.accumulate ? this.contentBuffer.push(t) : (this.bytesWritten += t.data.length, n.prototype.push.call(this, {
          data: t.data,
          meta: {
            currentFile: this.currentFile,
            percent: r ? (e + 100 * (r - i - 1)) / r : 100
          }
        }));
      }, s.prototype.openedSource = function (t) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = t.file.name;
        var e = this.streamFiles && !t.file.dir;

        if (e) {
          var r = i(t, e, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({
            data: r.fileRecord,
            meta: {
              percent: 0
            }
          });
        } else this.accumulate = !0;
      }, s.prototype.closedSource = function (t) {
        this.accumulate = !1;
        var e = this.streamFiles && !t.file.dir,
            r = i(t, e, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r.dirRecord), e) this.push({
          data: function (t) {
            return R.DATA_DESCRIPTOR + A(t.crc32, 4) + A(t.compressedSize, 4) + A(t.uncompressedSize, 4);
          }(t),
          meta: {
            percent: 100
          }
        });else for (this.push({
          data: r.fileRecord,
          meta: {
            percent: 0
          }
        }); this.contentBuffer.length;) this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, s.prototype.flush = function () {
        for (var t = this.bytesWritten, e = 0; e < this.dirRecords.length; e++) this.push({
          data: this.dirRecords[e],
          meta: {
            percent: 100
          }
        });

        var r = this.bytesWritten - t,
            i = function (t, e, r, i, n) {
          var s = I.transformTo("string", n(i));
          return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(t, 2) + A(t, 2) + A(e, 4) + A(r, 4) + A(s.length, 2) + s;
        }(this.dirRecords.length, r, t, this.zipComment, this.encodeFileName);

        this.push({
          data: i,
          meta: {
            percent: 100
          }
        });
      }, s.prototype.prepareNextSource = function () {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, s.prototype.registerPrevious = function (t) {
        this._sources.push(t);

        var e = this;
        return t.on("data", function (t) {
          e.processChunk(t);
        }), t.on("end", function () {
          e.closedSource(e.previous.streamInfo), e._sources.length ? e.prepareNextSource() : e.end();
        }), t.on("error", function (t) {
          e.error(t);
        }), this;
      }, s.prototype.resume = function () {
        return !!n.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
      }, s.prototype.error = function (t) {
        var e = this._sources;
        if (!n.prototype.error.call(this, t)) return !1;

        for (var r = 0; r < e.length; r++) try {
          e[r].error(t);
        } catch (t) {}

        return !0;
      }, s.prototype.lock = function () {
        n.prototype.lock.call(this);

        for (var t = this._sources, e = 0; e < t.length; e++) t[e].lock();
      }, e.exports = s;
    }, {
      "../crc32": 4,
      "../signature": 23,
      "../stream/GenericWorker": 28,
      "../utf8": 31,
      "../utils": 32
    }],
    9: [function (t, e, r) {
      "use strict";

      var u = t("../compressions"),
          i = t("./ZipFileWorker");

      r.generateWorker = function (t, a, e) {
        var o = new i(a.streamFiles, e, a.platform, a.encodeFileName),
            h = 0;

        try {
          t.forEach(function (t, e) {
            h++;

            var r = function (t, e) {
              var r = t || e,
                  i = u[r];
              if (!i) throw new Error(r + " is not a valid compression method !");
              return i;
            }(e.options.compression, a.compression),
                i = e.options.compressionOptions || a.compressionOptions || {},
                n = e.dir,
                s = e.date;

            e._compressWorker(r, i).withStreamInfo("file", {
              name: t,
              dir: n,
              date: s,
              comment: e.comment || "",
              unixPermissions: e.unixPermissions,
              dosPermissions: e.dosPermissions
            }).pipe(o);
          }), o.entriesCount = h;
        } catch (t) {
          o.error(t);
        }

        return o;
      };
    }, {
      "../compressions": 3,
      "./ZipFileWorker": 8
    }],
    10: [function (t, e, r) {
      "use strict";

      function i() {
        if (!(this instanceof i)) return new i();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = {}, this.comment = null, this.root = "", this.clone = function () {
          var t = new i();

          for (var e in this) "function" != typeof this[e] && (t[e] = this[e]);

          return t;
        };
      }

      (i.prototype = t("./object")).loadAsync = t("./load"), i.support = t("./support"), i.defaults = t("./defaults"), i.version = "3.5.0", i.loadAsync = function (t, e) {
        return new i().loadAsync(t, e);
      }, i.external = t("./external"), e.exports = i;
    }, {
      "./defaults": 5,
      "./external": 6,
      "./load": 11,
      "./object": 15,
      "./support": 30
    }],
    11: [function (t, e, r) {
      "use strict";

      var i = t("./utils"),
          n = t("./external"),
          o = t("./utf8"),
          h = (i = t("./utils"), t("./zipEntries")),
          s = t("./stream/Crc32Probe"),
          u = t("./nodejsUtils");

      function l(i) {
        return new n.Promise(function (t, e) {
          var r = i.decompressed.getContentWorker().pipe(new s());
          r.on("error", function (t) {
            e(t);
          }).on("end", function () {
            r.streamInfo.crc32 !== i.decompressed.crc32 ? e(new Error("Corrupted zip : CRC32 mismatch")) : t();
          }).resume();
        });
      }

      e.exports = function (t, s) {
        var a = this;
        return s = i.extend(s || {}, {
          base64: !1,
          checkCRC32: !1,
          optimizedBinaryString: !1,
          createFolders: !1,
          decodeFileName: o.utf8decode
        }), u.isNode && u.isStream(t) ? n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : i.prepareContent("the loaded zip file", t, !0, s.optimizedBinaryString, s.base64).then(function (t) {
          var e = new h(s);
          return e.load(t), e;
        }).then(function (t) {
          var e = [n.Promise.resolve(t)],
              r = t.files;
          if (s.checkCRC32) for (var i = 0; i < r.length; i++) e.push(l(r[i]));
          return n.Promise.all(e);
        }).then(function (t) {
          for (var e = t.shift(), r = e.files, i = 0; i < r.length; i++) {
            var n = r[i];
            a.file(n.fileNameStr, n.decompressed, {
              binary: !0,
              optimizedBinaryString: !0,
              date: n.date,
              dir: n.dir,
              comment: n.fileCommentStr.length ? n.fileCommentStr : null,
              unixPermissions: n.unixPermissions,
              dosPermissions: n.dosPermissions,
              createFolders: s.createFolders
            });
          }

          return e.zipComment.length && (a.comment = e.zipComment), a;
        });
      };
    }, {
      "./external": 6,
      "./nodejsUtils": 14,
      "./stream/Crc32Probe": 25,
      "./utf8": 31,
      "./utils": 32,
      "./zipEntries": 33
    }],
    12: [function (t, e, r) {
      "use strict";

      var i = t("../utils"),
          n = t("../stream/GenericWorker");

      function s(t, e) {
        n.call(this, "Nodejs stream input adapter for " + t), this._upstreamEnded = !1, this._bindStream(e);
      }

      i.inherits(s, n), s.prototype._bindStream = function (t) {
        var e = this;
        (this._stream = t).pause(), t.on("data", function (t) {
          e.push({
            data: t,
            meta: {
              percent: 0
            }
          });
        }).on("error", function (t) {
          e.isPaused ? this.generatedError = t : e.error(t);
        }).on("end", function () {
          e.isPaused ? e._upstreamEnded = !0 : e.end();
        });
      }, s.prototype.pause = function () {
        return !!n.prototype.pause.call(this) && (this._stream.pause(), !0);
      }, s.prototype.resume = function () {
        return !!n.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
      }, e.exports = s;
    }, {
      "../stream/GenericWorker": 28,
      "../utils": 32
    }],
    13: [function (t, e, r) {
      "use strict";

      var n = t("readable-stream").Readable;

      function i(t, e, r) {
        n.call(this, e), this._helper = t;
        var i = this;
        t.on("data", function (t, e) {
          i.push(t) || i._helper.pause(), r && r(e);
        }).on("error", function (t) {
          i.emit("error", t);
        }).on("end", function () {
          i.push(null);
        });
      }

      t("../utils").inherits(i, n), i.prototype._read = function () {
        this._helper.resume();
      }, e.exports = i;
    }, {
      "../utils": 32,
      "readable-stream": 16
    }],
    14: [function (t, e, r) {
      "use strict";

      e.exports = {
        isNode: "undefined" != typeof Buffer,
        newBufferFrom: function (t, e) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(t, e);
          if ("number" == typeof t) throw new Error('The "data" argument must not be a number');
          return new Buffer(t, e);
        },
        allocBuffer: function (t) {
          if (Buffer.alloc) return Buffer.alloc(t);
          var e = new Buffer(t);
          return e.fill(0), e;
        },
        isBuffer: function (t) {
          return Buffer.isBuffer(t);
        },
        isStream: function (t) {
          return t && "function" == typeof t.on && "function" == typeof t.pause && "function" == typeof t.resume;
        }
      };
    }, {}],
    15: [function (t, e, r) {
      "use strict";

      function s(t, e, r) {
        var i,
            n = u.getTypeOf(e),
            s = u.extend(r || {}, f);
        s.date = s.date || new Date(), null !== s.compression && (s.compression = s.compression.toUpperCase()), "string" == typeof s.unixPermissions && (s.unixPermissions = parseInt(s.unixPermissions, 8)), s.unixPermissions && 16384 & s.unixPermissions && (s.dir = !0), s.dosPermissions && 16 & s.dosPermissions && (s.dir = !0), s.dir && (t = g(t)), s.createFolders && (i = _(t)) && b.call(this, i, !0);
        var a = "string" === n && !1 === s.binary && !1 === s.base64;
        r && void 0 !== r.binary || (s.binary = !a), (e instanceof d && 0 === e.uncompressedSize || s.dir || !e || 0 === e.length) && (s.base64 = !1, s.binary = !0, e = "", s.compression = "STORE", n = "string");
        var o = null;
        o = e instanceof d || e instanceof l ? e : p.isNode && p.isStream(e) ? new m(t, e) : u.prepareContent(t, e, s.binary, s.optimizedBinaryString, s.base64);
        var h = new c(t, o, s);
        this.files[t] = h;
      }

      var n = t("./utf8"),
          u = t("./utils"),
          l = t("./stream/GenericWorker"),
          a = t("./stream/StreamHelper"),
          f = t("./defaults"),
          d = t("./compressedObject"),
          c = t("./zipObject"),
          o = t("./generate"),
          p = t("./nodejsUtils"),
          m = t("./nodejs/NodejsStreamInputAdapter"),
          _ = function (t) {
        "/" === t.slice(-1) && (t = t.substring(0, t.length - 1));
        var e = t.lastIndexOf("/");
        return 0 < e ? t.substring(0, e) : "";
      },
          g = function (t) {
        return "/" !== t.slice(-1) && (t += "/"), t;
      },
          b = function (t, e) {
        return e = void 0 !== e ? e : f.createFolders, t = g(t), this.files[t] || s.call(this, t, null, {
          dir: !0,
          createFolders: e
        }), this.files[t];
      };

      function h(t) {
        return "[object RegExp]" === Object.prototype.toString.call(t);
      }

      var i = {
        load: function () {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        },
        forEach: function (t) {
          var e, r, i;

          for (e in this.files) this.files.hasOwnProperty(e) && (i = this.files[e], (r = e.slice(this.root.length, e.length)) && e.slice(0, this.root.length) === this.root && t(r, i));
        },
        filter: function (r) {
          var i = [];
          return this.forEach(function (t, e) {
            r(t, e) && i.push(e);
          }), i;
        },
        file: function (t, e, r) {
          if (1 !== arguments.length) return t = this.root + t, s.call(this, t, e, r), this;

          if (h(t)) {
            var i = t;
            return this.filter(function (t, e) {
              return !e.dir && i.test(t);
            });
          }

          var n = this.files[this.root + t];
          return n && !n.dir ? n : null;
        },
        folder: function (r) {
          if (!r) return this;
          if (h(r)) return this.filter(function (t, e) {
            return e.dir && r.test(t);
          });
          var t = this.root + r,
              e = b.call(this, t),
              i = this.clone();
          return i.root = e.name, i;
        },
        remove: function (r) {
          r = this.root + r;
          var t = this.files[r];
          if (t || ("/" !== r.slice(-1) && (r += "/"), t = this.files[r]), t && !t.dir) delete this.files[r];else for (var e = this.filter(function (t, e) {
            return e.name.slice(0, r.length) === r;
          }), i = 0; i < e.length; i++) delete this.files[e[i].name];
          return this;
        },
        generate: function (t) {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        },
        generateInternalStream: function (t) {
          var e,
              r = {};

          try {
            if ((r = u.extend(t || {}, {
              streamFiles: !1,
              compression: "STORE",
              compressionOptions: null,
              type: "",
              platform: "DOS",
              comment: null,
              mimeType: "application/zip",
              encodeFileName: n.utf8encode
            })).type = r.type.toLowerCase(), r.compression = r.compression.toUpperCase(), "binarystring" === r.type && (r.type = "string"), !r.type) throw new Error("No output type specified.");
            u.checkSupport(r.type), "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"), "win32" === r.platform && (r.platform = "DOS");
            var i = r.comment || this.comment || "";
            e = o.generateWorker(this, r, i);
          } catch (t) {
            (e = new l("error")).error(t);
          }

          return new a(e, r.type || "string", r.mimeType);
        },
        generateAsync: function (t, e) {
          return this.generateInternalStream(t).accumulate(e);
        },
        generateNodeStream: function (t, e) {
          return (t = t || {}).type || (t.type = "nodebuffer"), this.generateInternalStream(t).toNodejsStream(e);
        }
      };
      e.exports = i;
    }, {
      "./compressedObject": 2,
      "./defaults": 5,
      "./generate": 9,
      "./nodejs/NodejsStreamInputAdapter": 12,
      "./nodejsUtils": 14,
      "./stream/GenericWorker": 28,
      "./stream/StreamHelper": 29,
      "./utf8": 31,
      "./utils": 32,
      "./zipObject": 35
    }],
    16: [function (t, e, r) {
      e.exports = t("stream");
    }, {
      stream: void 0
    }],
    17: [function (t, e, r) {
      "use strict";

      var i = t("./DataReader");

      function n(t) {
        i.call(this, t);

        for (var e = 0; e < this.data.length; e++) t[e] = 255 & t[e];
      }

      t("../utils").inherits(n, i), n.prototype.byteAt = function (t) {
        return this.data[this.zero + t];
      }, n.prototype.lastIndexOfSignature = function (t) {
        for (var e = t.charCodeAt(0), r = t.charCodeAt(1), i = t.charCodeAt(2), n = t.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === e && this.data[s + 1] === r && this.data[s + 2] === i && this.data[s + 3] === n) return s - this.zero;

        return -1;
      }, n.prototype.readAndCheckSignature = function (t) {
        var e = t.charCodeAt(0),
            r = t.charCodeAt(1),
            i = t.charCodeAt(2),
            n = t.charCodeAt(3),
            s = this.readData(4);
        return e === s[0] && r === s[1] && i === s[2] && n === s[3];
      }, n.prototype.readData = function (t) {
        if (this.checkOffset(t), 0 === t) return [];
        var e = this.data.slice(this.zero + this.index, this.zero + this.index + t);
        return this.index += t, e;
      }, e.exports = n;
    }, {
      "../utils": 32,
      "./DataReader": 18
    }],
    18: [function (t, e, r) {
      "use strict";

      var i = t("../utils");

      function n(t) {
        this.data = t, this.length = t.length, this.index = 0, this.zero = 0;
      }

      n.prototype = {
        checkOffset: function (t) {
          this.checkIndex(this.index + t);
        },
        checkIndex: function (t) {
          if (this.length < this.zero + t || t < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t + "). Corrupted zip ?");
        },
        setIndex: function (t) {
          this.checkIndex(t), this.index = t;
        },
        skip: function (t) {
          this.setIndex(this.index + t);
        },
        byteAt: function (t) {},
        readInt: function (t) {
          var e,
              r = 0;

          for (this.checkOffset(t), e = this.index + t - 1; e >= this.index; e--) r = (r << 8) + this.byteAt(e);

          return this.index += t, r;
        },
        readString: function (t) {
          return i.transformTo("string", this.readData(t));
        },
        readData: function (t) {},
        lastIndexOfSignature: function (t) {},
        readAndCheckSignature: function (t) {},
        readDate: function () {
          var t = this.readInt(4);
          return new Date(Date.UTC(1980 + (t >> 25 & 127), (t >> 21 & 15) - 1, t >> 16 & 31, t >> 11 & 31, t >> 5 & 63, (31 & t) << 1));
        }
      }, e.exports = n;
    }, {
      "../utils": 32
    }],
    19: [function (t, e, r) {
      "use strict";

      var i = t("./Uint8ArrayReader");

      function n(t) {
        i.call(this, t);
      }

      t("../utils").inherits(n, i), n.prototype.readData = function (t) {
        this.checkOffset(t);
        var e = this.data.slice(this.zero + this.index, this.zero + this.index + t);
        return this.index += t, e;
      }, e.exports = n;
    }, {
      "../utils": 32,
      "./Uint8ArrayReader": 21
    }],
    20: [function (t, e, r) {
      "use strict";

      var i = t("./DataReader");

      function n(t) {
        i.call(this, t);
      }

      t("../utils").inherits(n, i), n.prototype.byteAt = function (t) {
        return this.data.charCodeAt(this.zero + t);
      }, n.prototype.lastIndexOfSignature = function (t) {
        return this.data.lastIndexOf(t) - this.zero;
      }, n.prototype.readAndCheckSignature = function (t) {
        return t === this.readData(4);
      }, n.prototype.readData = function (t) {
        this.checkOffset(t);
        var e = this.data.slice(this.zero + this.index, this.zero + this.index + t);
        return this.index += t, e;
      }, e.exports = n;
    }, {
      "../utils": 32,
      "./DataReader": 18
    }],
    21: [function (t, e, r) {
      "use strict";

      var i = t("./ArrayReader");

      function n(t) {
        i.call(this, t);
      }

      t("../utils").inherits(n, i), n.prototype.readData = function (t) {
        if (this.checkOffset(t), 0 === t) return new Uint8Array(0);
        var e = this.data.subarray(this.zero + this.index, this.zero + this.index + t);
        return this.index += t, e;
      }, e.exports = n;
    }, {
      "../utils": 32,
      "./ArrayReader": 17
    }],
    22: [function (t, e, r) {
      "use strict";

      var i = t("../utils"),
          n = t("../support"),
          s = t("./ArrayReader"),
          a = t("./StringReader"),
          o = t("./NodeBufferReader"),
          h = t("./Uint8ArrayReader");

      e.exports = function (t) {
        var e = i.getTypeOf(t);
        return i.checkSupport(e), "string" !== e || n.uint8array ? "nodebuffer" === e ? new o(t) : n.uint8array ? new h(i.transformTo("uint8array", t)) : new s(i.transformTo("array", t)) : new a(t);
      };
    }, {
      "../support": 30,
      "../utils": 32,
      "./ArrayReader": 17,
      "./NodeBufferReader": 19,
      "./StringReader": 20,
      "./Uint8ArrayReader": 21
    }],
    23: [function (t, e, r) {
      "use strict";

      r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b";
    }, {}],
    24: [function (t, e, r) {
      "use strict";

      var i = t("./GenericWorker"),
          n = t("../utils");

      function s(t) {
        i.call(this, "ConvertWorker to " + t), this.destType = t;
      }

      n.inherits(s, i), s.prototype.processChunk = function (t) {
        this.push({
          data: n.transformTo(this.destType, t.data),
          meta: t.meta
        });
      }, e.exports = s;
    }, {
      "../utils": 32,
      "./GenericWorker": 28
    }],
    25: [function (t, e, r) {
      "use strict";

      var i = t("./GenericWorker"),
          n = t("../crc32");

      function s() {
        i.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }

      t("../utils").inherits(s, i), s.prototype.processChunk = function (t) {
        this.streamInfo.crc32 = n(t.data, this.streamInfo.crc32 || 0), this.push(t);
      }, e.exports = s;
    }, {
      "../crc32": 4,
      "../utils": 32,
      "./GenericWorker": 28
    }],
    26: [function (t, e, r) {
      "use strict";

      var i = t("../utils"),
          n = t("./GenericWorker");

      function s(t) {
        n.call(this, "DataLengthProbe for " + t), this.propName = t, this.withStreamInfo(t, 0);
      }

      i.inherits(s, n), s.prototype.processChunk = function (t) {
        if (t) {
          var e = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = e + t.data.length;
        }

        n.prototype.processChunk.call(this, t);
      }, e.exports = s;
    }, {
      "../utils": 32,
      "./GenericWorker": 28
    }],
    27: [function (t, e, r) {
      "use strict";

      var i = t("../utils"),
          n = t("./GenericWorker");

      function s(t) {
        n.call(this, "DataWorker");
        var e = this;
        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, t.then(function (t) {
          e.dataIsReady = !0, e.data = t, e.max = t && t.length || 0, e.type = i.getTypeOf(t), e.isPaused || e._tickAndRepeat();
        }, function (t) {
          e.error(t);
        });
      }

      i.inherits(s, n), s.prototype.cleanUp = function () {
        n.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function () {
        return !!n.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, i.delay(this._tickAndRepeat, [], this)), !0);
      }, s.prototype._tickAndRepeat = function () {
        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (i.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
      }, s.prototype._tick = function () {
        if (this.isPaused || this.isFinished) return !1;
        var t = null,
            e = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();

        switch (this.type) {
          case "string":
            t = this.data.substring(this.index, e);
            break;

          case "uint8array":
            t = this.data.subarray(this.index, e);
            break;

          case "array":
          case "nodebuffer":
            t = this.data.slice(this.index, e);
        }

        return this.index = e, this.push({
          data: t,
          meta: {
            percent: this.max ? this.index / this.max * 100 : 0
          }
        });
      }, e.exports = s;
    }, {
      "../utils": 32,
      "./GenericWorker": 28
    }],
    28: [function (t, e, r) {
      "use strict";

      function i(t) {
        this.name = t || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
          data: [],
          end: [],
          error: []
        }, this.previous = null;
      }

      i.prototype = {
        push: function (t) {
          this.emit("data", t);
        },
        end: function () {
          if (this.isFinished) return !1;
          this.flush();

          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (t) {
            this.emit("error", t);
          }

          return !0;
        },
        error: function (t) {
          return !this.isFinished && (this.isPaused ? this.generatedError = t : (this.isFinished = !0, this.emit("error", t), this.previous && this.previous.error(t), this.cleanUp()), !0);
        },
        on: function (t, e) {
          return this._listeners[t].push(e), this;
        },
        cleanUp: function () {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        },
        emit: function (t, e) {
          if (this._listeners[t]) for (var r = 0; r < this._listeners[t].length; r++) this._listeners[t][r].call(this, e);
        },
        pipe: function (t) {
          return t.registerPrevious(this);
        },
        registerPrevious: function (t) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = t.streamInfo, this.mergeStreamInfo(), this.previous = t;
          var e = this;
          return t.on("data", function (t) {
            e.processChunk(t);
          }), t.on("end", function () {
            e.end();
          }), t.on("error", function (t) {
            e.error(t);
          }), this;
        },
        pause: function () {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        },
        resume: function () {
          if (!this.isPaused || this.isFinished) return !1;
          var t = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), t = !0), this.previous && this.previous.resume(), !t;
        },
        flush: function () {},
        processChunk: function (t) {
          this.push(t);
        },
        withStreamInfo: function (t, e) {
          return this.extraStreamInfo[t] = e, this.mergeStreamInfo(), this;
        },
        mergeStreamInfo: function () {
          for (var t in this.extraStreamInfo) this.extraStreamInfo.hasOwnProperty(t) && (this.streamInfo[t] = this.extraStreamInfo[t]);
        },
        lock: function () {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        },
        toString: function () {
          var t = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + t : t;
        }
      }, e.exports = i;
    }, {}],
    29: [function (t, e, r) {
      "use strict";

      var h = t("../utils"),
          n = t("./ConvertWorker"),
          s = t("./GenericWorker"),
          u = t("../base64"),
          i = t("../support"),
          a = t("../external"),
          o = null;
      if (i.nodestream) try {
        o = t("../nodejs/NodejsStreamOutputAdapter");
      } catch (t) {}

      function l(t, o) {
        return new a.Promise(function (e, r) {
          var i = [],
              n = t._internalType,
              s = t._outputType,
              a = t._mimeType;
          t.on("data", function (t, e) {
            i.push(t), o && o(e);
          }).on("error", function (t) {
            i = [], r(t);
          }).on("end", function () {
            try {
              var t = function (t, e, r) {
                switch (t) {
                  case "blob":
                    return h.newBlob(h.transformTo("arraybuffer", e), r);

                  case "base64":
                    return u.encode(e);

                  default:
                    return h.transformTo(t, e);
                }
              }(s, function (t, e) {
                var r,
                    i = 0,
                    n = null,
                    s = 0;

                for (r = 0; r < e.length; r++) s += e[r].length;

                switch (t) {
                  case "string":
                    return e.join("");

                  case "array":
                    return Array.prototype.concat.apply([], e);

                  case "uint8array":
                    for (n = new Uint8Array(s), r = 0; r < e.length; r++) n.set(e[r], i), i += e[r].length;

                    return n;

                  case "nodebuffer":
                    return Buffer.concat(e);

                  default:
                    throw new Error("concat : unsupported type '" + t + "'");
                }
              }(n, i), a);

              e(t);
            } catch (t) {
              r(t);
            }

            i = [];
          }).resume();
        });
      }

      function f(t, e, r) {
        var i = e;

        switch (e) {
          case "blob":
          case "arraybuffer":
            i = "uint8array";
            break;

          case "base64":
            i = "string";
        }

        try {
          this._internalType = i, this._outputType = e, this._mimeType = r, h.checkSupport(i), this._worker = t.pipe(new n(i)), t.lock();
        } catch (t) {
          this._worker = new s("error"), this._worker.error(t);
        }
      }

      f.prototype = {
        accumulate: function (t) {
          return l(this, t);
        },
        on: function (t, e) {
          var r = this;
          return "data" === t ? this._worker.on(t, function (t) {
            e.call(r, t.data, t.meta);
          }) : this._worker.on(t, function () {
            h.delay(e, arguments, r);
          }), this;
        },
        resume: function () {
          return h.delay(this._worker.resume, [], this._worker), this;
        },
        pause: function () {
          return this._worker.pause(), this;
        },
        toNodejsStream: function (t) {
          if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
          return new o(this, {
            objectMode: "nodebuffer" !== this._outputType
          }, t);
        }
      }, e.exports = f;
    }, {
      "../base64": 1,
      "../external": 6,
      "../nodejs/NodejsStreamOutputAdapter": 13,
      "../support": 30,
      "../utils": 32,
      "./ConvertWorker": 24,
      "./GenericWorker": 28
    }],
    30: [function (t, e, r) {
      "use strict";

      if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = !1;else {
        var i = new ArrayBuffer(0);

        try {
          r.blob = 0 === new Blob([i], {
            type: "application/zip"
          }).size;
        } catch (t) {
          try {
            var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            n.append(i), r.blob = 0 === n.getBlob("application/zip").size;
          } catch (t) {
            r.blob = !1;
          }
        }
      }

      try {
        r.nodestream = !!t("readable-stream").Readable;
      } catch (t) {
        r.nodestream = !1;
      }
    }, {
      "readable-stream": 16
    }],
    31: [function (t, e, s) {
      "use strict";

      for (var o = t("./utils"), h = t("./support"), r = t("./nodejsUtils"), i = t("./stream/GenericWorker"), u = new Array(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;

      u[254] = u[254] = 1;

      function a() {
        i.call(this, "utf-8 decode"), this.leftOver = null;
      }

      function l() {
        i.call(this, "utf-8 encode");
      }

      s.utf8encode = function (t) {
        return h.nodebuffer ? r.newBufferFrom(t, "utf-8") : function (t) {
          var e,
              r,
              i,
              n,
              s,
              a = t.length,
              o = 0;

          for (n = 0; n < a; n++) 55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;

          for (e = h.uint8array ? new Uint8Array(o) : new Array(o), n = s = 0; s < o; n++) 55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), r < 128 ? e[s++] = r : (r < 2048 ? e[s++] = 192 | r >>> 6 : (r < 65536 ? e[s++] = 224 | r >>> 12 : (e[s++] = 240 | r >>> 18, e[s++] = 128 | r >>> 12 & 63), e[s++] = 128 | r >>> 6 & 63), e[s++] = 128 | 63 & r);

          return e;
        }(t);
      }, s.utf8decode = function (t) {
        return h.nodebuffer ? o.transformTo("nodebuffer", t).toString("utf-8") : function (t) {
          var e,
              r,
              i,
              n,
              s = t.length,
              a = new Array(2 * s);

          for (e = r = 0; e < s;) if ((i = t[e++]) < 128) a[r++] = i;else if (4 < (n = u[i])) a[r++] = 65533, e += n - 1;else {
            for (i &= 2 === n ? 31 : 3 === n ? 15 : 7; 1 < n && e < s;) i = i << 6 | 63 & t[e++], n--;

            1 < n ? a[r++] = 65533 : i < 65536 ? a[r++] = i : (i -= 65536, a[r++] = 55296 | i >> 10 & 1023, a[r++] = 56320 | 1023 & i);
          }

          return a.length !== r && (a.subarray ? a = a.subarray(0, r) : a.length = r), o.applyFromCharCode(a);
        }(t = o.transformTo(h.uint8array ? "uint8array" : "array", t));
      }, o.inherits(a, i), a.prototype.processChunk = function (t) {
        var e = o.transformTo(h.uint8array ? "uint8array" : "array", t.data);

        if (this.leftOver && this.leftOver.length) {
          if (h.uint8array) {
            var r = e;
            (e = new Uint8Array(r.length + this.leftOver.length)).set(this.leftOver, 0), e.set(r, this.leftOver.length);
          } else e = this.leftOver.concat(e);

          this.leftOver = null;
        }

        var i = function (t, e) {
          var r;

          for ((e = e || t.length) > t.length && (e = t.length), r = e - 1; 0 <= r && 128 == (192 & t[r]);) r--;

          return r < 0 ? e : 0 === r ? e : r + u[t[r]] > e ? r : e;
        }(e),
            n = e;

        i !== e.length && (h.uint8array ? (n = e.subarray(0, i), this.leftOver = e.subarray(i, e.length)) : (n = e.slice(0, i), this.leftOver = e.slice(i, e.length))), this.push({
          data: s.utf8decode(n),
          meta: t.meta
        });
      }, a.prototype.flush = function () {
        this.leftOver && this.leftOver.length && (this.push({
          data: s.utf8decode(this.leftOver),
          meta: {}
        }), this.leftOver = null);
      }, s.Utf8DecodeWorker = a, o.inherits(l, i), l.prototype.processChunk = function (t) {
        this.push({
          data: s.utf8encode(t.data),
          meta: t.meta
        });
      }, s.Utf8EncodeWorker = l;
    }, {
      "./nodejsUtils": 14,
      "./stream/GenericWorker": 28,
      "./support": 30,
      "./utils": 32
    }],
    32: [function (t, e, a) {
      "use strict";

      var o = t("./support"),
          h = t("./base64"),
          r = t("./nodejsUtils"),
          i = t("set-immediate-shim"),
          u = t("./external");

      function n(t) {
        return t;
      }

      function l(t, e) {
        for (var r = 0; r < t.length; ++r) e[r] = 255 & t.charCodeAt(r);

        return e;
      }

      a.newBlob = function (e, r) {
        a.checkSupport("blob");

        try {
          return new Blob([e], {
            type: r
          });
        } catch (t) {
          try {
            var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return i.append(e), i.getBlob(r);
          } catch (t) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };

      var s = {
        stringifyByChunk: function (t, e, r) {
          var i = [],
              n = 0,
              s = t.length;
          if (s <= r) return String.fromCharCode.apply(null, t);

          for (; n < s;) "array" === e || "nodebuffer" === e ? i.push(String.fromCharCode.apply(null, t.slice(n, Math.min(n + r, s)))) : i.push(String.fromCharCode.apply(null, t.subarray(n, Math.min(n + r, s)))), n += r;

          return i.join("");
        },
        stringifyByChar: function (t) {
          for (var e = "", r = 0; r < t.length; r++) e += String.fromCharCode(t[r]);

          return e;
        },
        applyCanBeUsed: {
          uint8array: function () {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (t) {
              return !1;
            }
          }(),
          nodebuffer: function () {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
            } catch (t) {
              return !1;
            }
          }()
        }
      };

      function f(t) {
        var e = 65536,
            r = a.getTypeOf(t),
            i = !0;
        if ("uint8array" === r ? i = s.applyCanBeUsed.uint8array : "nodebuffer" === r && (i = s.applyCanBeUsed.nodebuffer), i) for (; 1 < e;) try {
          return s.stringifyByChunk(t, r, e);
        } catch (t) {
          e = Math.floor(e / 2);
        }
        return s.stringifyByChar(t);
      }

      function d(t, e) {
        for (var r = 0; r < t.length; r++) e[r] = t[r];

        return e;
      }

      a.applyFromCharCode = f;
      var c = {};
      c.string = {
        string: n,
        array: function (t) {
          return l(t, new Array(t.length));
        },
        arraybuffer: function (t) {
          return c.string.uint8array(t).buffer;
        },
        uint8array: function (t) {
          return l(t, new Uint8Array(t.length));
        },
        nodebuffer: function (t) {
          return l(t, r.allocBuffer(t.length));
        }
      }, c.array = {
        string: f,
        array: n,
        arraybuffer: function (t) {
          return new Uint8Array(t).buffer;
        },
        uint8array: function (t) {
          return new Uint8Array(t);
        },
        nodebuffer: function (t) {
          return r.newBufferFrom(t);
        }
      }, c.arraybuffer = {
        string: function (t) {
          return f(new Uint8Array(t));
        },
        array: function (t) {
          return d(new Uint8Array(t), new Array(t.byteLength));
        },
        arraybuffer: n,
        uint8array: function (t) {
          return new Uint8Array(t);
        },
        nodebuffer: function (t) {
          return r.newBufferFrom(new Uint8Array(t));
        }
      }, c.uint8array = {
        string: f,
        array: function (t) {
          return d(t, new Array(t.length));
        },
        arraybuffer: function (t) {
          return t.buffer;
        },
        uint8array: n,
        nodebuffer: function (t) {
          return r.newBufferFrom(t);
        }
      }, c.nodebuffer = {
        string: f,
        array: function (t) {
          return d(t, new Array(t.length));
        },
        arraybuffer: function (t) {
          return c.nodebuffer.uint8array(t).buffer;
        },
        uint8array: function (t) {
          return d(t, new Uint8Array(t.length));
        },
        nodebuffer: n
      }, a.transformTo = function (t, e) {
        if (e = e || "", !t) return e;
        a.checkSupport(t);
        var r = a.getTypeOf(e);
        return c[r][t](e);
      }, a.getTypeOf = function (t) {
        return "string" == typeof t ? "string" : "[object Array]" === Object.prototype.toString.call(t) ? "array" : o.nodebuffer && r.isBuffer(t) ? "nodebuffer" : o.uint8array && t instanceof Uint8Array ? "uint8array" : o.arraybuffer && t instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, a.checkSupport = function (t) {
        if (!o[t.toLowerCase()]) throw new Error(t + " is not supported by this platform");
      }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function (t) {
        var e,
            r,
            i = "";

        for (r = 0; r < (t || "").length; r++) i += "\\x" + ((e = t.charCodeAt(r)) < 16 ? "0" : "") + e.toString(16).toUpperCase();

        return i;
      }, a.delay = function (t, e, r) {
        i(function () {
          t.apply(r || null, e || []);
        });
      }, a.inherits = function (t, e) {
        function r() {}

        r.prototype = e.prototype, t.prototype = new r();
      }, a.extend = function () {
        var t,
            e,
            r = {};

        for (t = 0; t < arguments.length; t++) for (e in arguments[t]) arguments[t].hasOwnProperty(e) && void 0 === r[e] && (r[e] = arguments[t][e]);

        return r;
      }, a.prepareContent = function (r, t, i, n, s) {
        return u.Promise.resolve(t).then(function (i) {
          return o.blob && (i instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(i))) && "undefined" != typeof FileReader ? new u.Promise(function (e, r) {
            var t = new FileReader();
            t.onload = function (t) {
              e(t.target.result);
            }, t.onerror = function (t) {
              r(t.target.error);
            }, t.readAsArrayBuffer(i);
          }) : i;
        }).then(function (t) {
          var e = a.getTypeOf(t);
          return e ? ("arraybuffer" === e ? t = a.transformTo("uint8array", t) : "string" === e && (s ? t = h.decode(t) : i && !0 !== n && (t = function (t) {
            return l(t, o.uint8array ? new Uint8Array(t.length) : new Array(t.length));
          }(t))), t) : u.Promise.reject(new Error("Can't read the data of '" + r + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, {
      "./base64": 1,
      "./external": 6,
      "./nodejsUtils": 14,
      "./support": 30,
      "set-immediate-shim": 54
    }],
    33: [function (t, e, r) {
      "use strict";

      var i = t("./reader/readerFor"),
          n = t("./utils"),
          s = t("./signature"),
          a = t("./zipEntry"),
          o = (t("./utf8"), t("./support"));

      function h(t) {
        this.files = [], this.loadOptions = t;
      }

      h.prototype = {
        checkSignature: function (t) {
          if (!this.reader.readAndCheckSignature(t)) {
            this.reader.index -= 4;
            var e = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + n.pretty(e) + ", expected " + n.pretty(t) + ")");
          }
        },
        isSignature: function (t, e) {
          var r = this.reader.index;
          this.reader.setIndex(t);
          var i = this.reader.readString(4) === e;
          return this.reader.setIndex(r), i;
        },
        readBlockEndOfCentral: function () {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var t = this.reader.readData(this.zipCommentLength),
              e = o.uint8array ? "uint8array" : "array",
              r = n.transformTo(e, t);
          this.zipComment = this.loadOptions.decodeFileName(r);
        },
        readBlockZip64EndOfCentral: function () {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};

          for (var t, e, r, i = this.zip64EndOfCentralSize - 44; 0 < i;) t = this.reader.readInt(2), e = this.reader.readInt(4), r = this.reader.readData(e), this.zip64ExtensibleData[t] = {
            id: t,
            length: e,
            value: r
          };
        },
        readBlockZip64EndOfCentralLocator: function () {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        },
        readLocalFiles: function () {
          var t, e;

          for (t = 0; t < this.files.length; t++) e = this.files[t], this.reader.setIndex(e.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), e.readLocalPart(this.reader), e.handleUTF8(), e.processAttributes();
        },
        readCentralDir: function () {
          var t;

          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);) (t = new a({
            zip64: this.zip64
          }, this.loadOptions)).readCentralPart(this.reader), this.files.push(t);

          if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        },
        readEndOfCentral: function () {
          var t = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (t < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
          this.reader.setIndex(t);
          var e = t;

          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === n.MAX_VALUE_16BITS || this.diskWithCentralDirStart === n.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === n.MAX_VALUE_16BITS || this.centralDirRecords === n.MAX_VALUE_16BITS || this.centralDirSize === n.MAX_VALUE_32BITS || this.centralDirOffset === n.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (t = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(t), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }

          var r = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (r += 20, r += 12 + this.zip64EndOfCentralSize);
          var i = e - r;
          if (0 < i) this.isSignature(e, s.CENTRAL_FILE_HEADER) || (this.reader.zero = i);else if (i < 0) throw new Error("Corrupted zip: missing " + Math.abs(i) + " bytes.");
        },
        prepareReader: function (t) {
          this.reader = i(t);
        },
        load: function (t) {
          this.prepareReader(t), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        }
      }, e.exports = h;
    }, {
      "./reader/readerFor": 22,
      "./signature": 23,
      "./support": 30,
      "./utf8": 31,
      "./utils": 32,
      "./zipEntry": 34
    }],
    34: [function (t, e, r) {
      "use strict";

      var i = t("./reader/readerFor"),
          s = t("./utils"),
          n = t("./compressedObject"),
          a = t("./crc32"),
          o = t("./utf8"),
          h = t("./compressions"),
          u = t("./support");

      function l(t, e) {
        this.options = t, this.loadOptions = e;
      }

      l.prototype = {
        isEncrypted: function () {
          return 1 == (1 & this.bitFlag);
        },
        useUTF8: function () {
          return 2048 == (2048 & this.bitFlag);
        },
        readLocalPart: function (t) {
          var e, r;
          if (t.skip(22), this.fileNameLength = t.readInt(2), r = t.readInt(2), this.fileName = t.readData(this.fileNameLength), t.skip(r), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if (null === (e = function (t) {
            for (var e in h) if (h.hasOwnProperty(e) && h[e].magic === t) return h[e];

            return null;
          }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new n(this.compressedSize, this.uncompressedSize, this.crc32, e, t.readData(this.compressedSize));
        },
        readCentralPart: function (t) {
          this.versionMadeBy = t.readInt(2), t.skip(2), this.bitFlag = t.readInt(2), this.compressionMethod = t.readString(2), this.date = t.readDate(), this.crc32 = t.readInt(4), this.compressedSize = t.readInt(4), this.uncompressedSize = t.readInt(4);
          var e = t.readInt(2);
          if (this.extraFieldsLength = t.readInt(2), this.fileCommentLength = t.readInt(2), this.diskNumberStart = t.readInt(2), this.internalFileAttributes = t.readInt(2), this.externalFileAttributes = t.readInt(4), this.localHeaderOffset = t.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          t.skip(e), this.readExtraFields(t), this.parseZIP64ExtraField(t), this.fileComment = t.readData(this.fileCommentLength);
        },
        processAttributes: function () {
          this.unixPermissions = null, this.dosPermissions = null;
          var t = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), 0 == t && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == t && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
        },
        parseZIP64ExtraField: function (t) {
          if (this.extraFields[1]) {
            var e = i(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4));
          }
        },
        readExtraFields: function (t) {
          var e,
              r,
              i,
              n = t.index + this.extraFieldsLength;

          for (this.extraFields || (this.extraFields = {}); t.index + 4 < n;) e = t.readInt(2), r = t.readInt(2), i = t.readData(r), this.extraFields[e] = {
            id: e,
            length: r,
            value: i
          };

          t.setIndex(n);
        },
        handleUTF8: function () {
          var t = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);else {
            var e = this.findExtraFieldUnicodePath();
            if (null !== e) this.fileNameStr = e;else {
              var r = s.transformTo(t, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(r);
            }
            var i = this.findExtraFieldUnicodeComment();
            if (null !== i) this.fileCommentStr = i;else {
              var n = s.transformTo(t, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(n);
            }
          }
        },
        findExtraFieldUnicodePath: function () {
          var t = this.extraFields[28789];

          if (t) {
            var e = i(t.value);
            return 1 !== e.readInt(1) ? null : a(this.fileName) !== e.readInt(4) ? null : o.utf8decode(e.readData(t.length - 5));
          }

          return null;
        },
        findExtraFieldUnicodeComment: function () {
          var t = this.extraFields[25461];

          if (t) {
            var e = i(t.value);
            return 1 !== e.readInt(1) ? null : a(this.fileComment) !== e.readInt(4) ? null : o.utf8decode(e.readData(t.length - 5));
          }

          return null;
        }
      }, e.exports = l;
    }, {
      "./compressedObject": 2,
      "./compressions": 3,
      "./crc32": 4,
      "./reader/readerFor": 22,
      "./support": 30,
      "./utf8": 31,
      "./utils": 32
    }],
    35: [function (t, e, r) {
      "use strict";

      function i(t, e, r) {
        this.name = t, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = e, this._dataBinary = r.binary, this.options = {
          compression: r.compression,
          compressionOptions: r.compressionOptions
        };
      }

      var s = t("./stream/StreamHelper"),
          n = t("./stream/DataWorker"),
          a = t("./utf8"),
          o = t("./compressedObject"),
          h = t("./stream/GenericWorker");
      i.prototype = {
        internalStream: function (t) {
          var e = null,
              r = "string";

          try {
            if (!t) throw new Error("No output type specified.");
            var i = "string" === (r = t.toLowerCase()) || "text" === r;
            "binarystring" !== r && "text" !== r || (r = "string"), e = this._decompressWorker();
            var n = !this._dataBinary;
            n && !i && (e = e.pipe(new a.Utf8EncodeWorker())), !n && i && (e = e.pipe(new a.Utf8DecodeWorker()));
          } catch (t) {
            (e = new h("error")).error(t);
          }

          return new s(e, r, "");
        },
        async: function (t, e) {
          return this.internalStream(t).accumulate(e);
        },
        nodeStream: function (t, e) {
          return this.internalStream(t || "nodebuffer").toNodejsStream(e);
        },
        _compressWorker: function (t, e) {
          if (this._data instanceof o && this._data.compression.magic === t.magic) return this._data.getCompressedWorker();

          var r = this._decompressWorker();

          return this._dataBinary || (r = r.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r, t, e);
        },
        _decompressWorker: function () {
          return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new n(this._data);
        }
      };

      for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function () {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, f = 0; f < u.length; f++) i.prototype[u[f]] = l;

      e.exports = i;
    }, {
      "./compressedObject": 2,
      "./stream/DataWorker": 27,
      "./stream/GenericWorker": 28,
      "./stream/StreamHelper": 29,
      "./utf8": 31
    }],
    36: [function (t, l, e) {
      (function (e) {
        "use strict";

        var r,
            i,
            t = e.MutationObserver || e.WebKitMutationObserver;

        if (t) {
          var n = 0,
              s = new t(u),
              a = e.document.createTextNode("");
          s.observe(a, {
            characterData: !0
          }), r = function () {
            a.data = n = ++n % 2;
          };
        } else if (e.setImmediate || void 0 === e.MessageChannel) r = "document" in e && "onreadystatechange" in e.document.createElement("script") ? function () {
          var t = e.document.createElement("script");
          t.onreadystatechange = function () {
            u(), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null;
          }, e.document.documentElement.appendChild(t);
        } : function () {
          setTimeout(u, 0);
        };else {
          var o = new e.MessageChannel();
          o.port1.onmessage = u, r = function () {
            o.port2.postMessage(0);
          };
        }

        var h = [];

        function u() {
          var t, e;
          i = !0;

          for (var r = h.length; r;) {
            for (e = h, h = [], t = -1; ++t < r;) e[t]();

            r = h.length;
          }

          i = !1;
        }

        l.exports = function (t) {
          1 !== h.push(t) || i || r();
        };
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    37: [function (t, e, r) {
      "use strict";

      var n = t("immediate");

      function u() {}

      var l = {},
          s = ["REJECTED"],
          a = ["FULFILLED"],
          i = ["PENDING"];

      function o(t) {
        if ("function" != typeof t) throw new TypeError("resolver must be a function");
        this.state = i, this.queue = [], this.outcome = void 0, t !== u && c(this, t);
      }

      function h(t, e, r) {
        this.promise = t, "function" == typeof e && (this.onFulfilled = e, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r && (this.onRejected = r, this.callRejected = this.otherCallRejected);
      }

      function f(e, r, i) {
        n(function () {
          var t;

          try {
            t = r(i);
          } catch (t) {
            return l.reject(e, t);
          }

          t === e ? l.reject(e, new TypeError("Cannot resolve promise with itself")) : l.resolve(e, t);
        });
      }

      function d(t) {
        var e = t && t.then;
        if (t && ("object" == typeof t || "function" == typeof t) && "function" == typeof e) return function () {
          e.apply(t, arguments);
        };
      }

      function c(e, t) {
        var r = !1;

        function i(t) {
          r || (r = !0, l.reject(e, t));
        }

        function n(t) {
          r || (r = !0, l.resolve(e, t));
        }

        var s = p(function () {
          t(n, i);
        });
        "error" === s.status && i(s.value);
      }

      function p(t, e) {
        var r = {};

        try {
          r.value = t(e), r.status = "success";
        } catch (t) {
          r.status = "error", r.value = t;
        }

        return r;
      }

      (e.exports = o).prototype.finally = function (e) {
        if ("function" != typeof e) return this;
        var r = this.constructor;
        return this.then(function (t) {
          return r.resolve(e()).then(function () {
            return t;
          });
        }, function (t) {
          return r.resolve(e()).then(function () {
            throw t;
          });
        });
      }, o.prototype.catch = function (t) {
        return this.then(null, t);
      }, o.prototype.then = function (t, e) {
        if ("function" != typeof t && this.state === a || "function" != typeof e && this.state === s) return this;
        var r = new this.constructor(u);
        this.state !== i ? f(r, this.state === a ? t : e, this.outcome) : this.queue.push(new h(r, t, e));
        return r;
      }, h.prototype.callFulfilled = function (t) {
        l.resolve(this.promise, t);
      }, h.prototype.otherCallFulfilled = function (t) {
        f(this.promise, this.onFulfilled, t);
      }, h.prototype.callRejected = function (t) {
        l.reject(this.promise, t);
      }, h.prototype.otherCallRejected = function (t) {
        f(this.promise, this.onRejected, t);
      }, l.resolve = function (t, e) {
        var r = p(d, e);
        if ("error" === r.status) return l.reject(t, r.value);
        var i = r.value;
        if (i) c(t, i);else {
          t.state = a, t.outcome = e;

          for (var n = -1, s = t.queue.length; ++n < s;) t.queue[n].callFulfilled(e);
        }
        return t;
      }, l.reject = function (t, e) {
        t.state = s, t.outcome = e;

        for (var r = -1, i = t.queue.length; ++r < i;) t.queue[r].callRejected(e);

        return t;
      }, o.resolve = function (t) {
        if (t instanceof this) return t;
        return l.resolve(new this(u), t);
      }, o.reject = function (t) {
        var e = new this(u);
        return l.reject(e, t);
      }, o.all = function (t) {
        var r = this;
        if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array"));
        var i = t.length,
            n = !1;
        if (!i) return this.resolve([]);
        var s = new Array(i),
            a = 0,
            e = -1,
            o = new this(u);

        for (; ++e < i;) h(t[e], e);

        return o;

        function h(t, e) {
          r.resolve(t).then(function (t) {
            s[e] = t, ++a !== i || n || (n = !0, l.resolve(o, s));
          }, function (t) {
            n || (n = !0, l.reject(o, t));
          });
        }
      }, o.race = function (t) {
        var e = this;
        if ("[object Array]" !== Object.prototype.toString.call(t)) return this.reject(new TypeError("must be an array"));
        var r = t.length,
            i = !1;
        if (!r) return this.resolve([]);
        var n = -1,
            s = new this(u);

        for (; ++n < r;) a = t[n], e.resolve(a).then(function (t) {
          i || (i = !0, l.resolve(s, t));
        }, function (t) {
          i || (i = !0, l.reject(s, t));
        });

        var a;
        return s;
      };
    }, {
      immediate: 36
    }],
    38: [function (t, e, r) {
      "use strict";

      var i = {};
      (0, t("./lib/utils/common").assign)(i, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), e.exports = i;
    }, {
      "./lib/deflate": 39,
      "./lib/inflate": 40,
      "./lib/utils/common": 41,
      "./lib/zlib/constants": 44
    }],
    39: [function (t, e, r) {
      "use strict";

      var a = t("./zlib/deflate"),
          o = t("./utils/common"),
          h = t("./utils/strings"),
          n = t("./zlib/messages"),
          s = t("./zlib/zstream"),
          u = Object.prototype.toString,
          l = 0,
          f = -1,
          d = 0,
          c = 8;

      function p(t) {
        if (!(this instanceof p)) return new p(t);
        this.options = o.assign({
          level: f,
          method: c,
          chunkSize: 16384,
          windowBits: 15,
          memLevel: 8,
          strategy: d,
          to: ""
        }, t || {});
        var e = this.options;
        e.raw && 0 < e.windowBits ? e.windowBits = -e.windowBits : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
        var r = a.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
        if (r !== l) throw new Error(n[r]);

        if (e.header && a.deflateSetHeader(this.strm, e.header), e.dictionary) {
          var i;
          if (i = "string" == typeof e.dictionary ? h.string2buf(e.dictionary) : "[object ArrayBuffer]" === u.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, (r = a.deflateSetDictionary(this.strm, i)) !== l) throw new Error(n[r]);
          this._dict_set = !0;
        }
      }

      function i(t, e) {
        var r = new p(e);
        if (r.push(t, !0), r.err) throw r.msg || n[r.err];
        return r.result;
      }

      p.prototype.push = function (t, e) {
        var r,
            i,
            n = this.strm,
            s = this.options.chunkSize;
        if (this.ended) return !1;
        i = e === ~~e ? e : !0 === e ? 4 : 0, "string" == typeof t ? n.input = h.string2buf(t) : "[object ArrayBuffer]" === u.call(t) ? n.input = new Uint8Array(t) : n.input = t, n.next_in = 0, n.avail_in = n.input.length;

        do {
          if (0 === n.avail_out && (n.output = new o.Buf8(s), n.next_out = 0, n.avail_out = s), 1 !== (r = a.deflate(n, i)) && r !== l) return this.onEnd(r), !(this.ended = !0);
          0 !== n.avail_out && (0 !== n.avail_in || 4 !== i && 2 !== i) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(n.output, n.next_out))) : this.onData(o.shrinkBuf(n.output, n.next_out)));
        } while ((0 < n.avail_in || 0 === n.avail_out) && 1 !== r);

        return 4 === i ? (r = a.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === l) : 2 !== i || (this.onEnd(l), !(n.avail_out = 0));
      }, p.prototype.onData = function (t) {
        this.chunks.push(t);
      }, p.prototype.onEnd = function (t) {
        t === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
      }, r.Deflate = p, r.deflate = i, r.deflateRaw = function (t, e) {
        return (e = e || {}).raw = !0, i(t, e);
      }, r.gzip = function (t, e) {
        return (e = e || {}).gzip = !0, i(t, e);
      };
    }, {
      "./utils/common": 41,
      "./utils/strings": 42,
      "./zlib/deflate": 46,
      "./zlib/messages": 51,
      "./zlib/zstream": 53
    }],
    40: [function (t, e, r) {
      "use strict";

      var d = t("./zlib/inflate"),
          c = t("./utils/common"),
          p = t("./utils/strings"),
          m = t("./zlib/constants"),
          i = t("./zlib/messages"),
          n = t("./zlib/zstream"),
          s = t("./zlib/gzheader"),
          _ = Object.prototype.toString;

      function a(t) {
        if (!(this instanceof a)) return new a(t);
        this.options = c.assign({
          chunkSize: 16384,
          windowBits: 0,
          to: ""
        }, t || {});
        var e = this.options;
        e.raw && 0 <= e.windowBits && e.windowBits < 16 && (e.windowBits = -e.windowBits, 0 === e.windowBits && (e.windowBits = -15)), !(0 <= e.windowBits && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32), 15 < e.windowBits && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new n(), this.strm.avail_out = 0;
        var r = d.inflateInit2(this.strm, e.windowBits);
        if (r !== m.Z_OK) throw new Error(i[r]);
        this.header = new s(), d.inflateGetHeader(this.strm, this.header);
      }

      function o(t, e) {
        var r = new a(e);
        if (r.push(t, !0), r.err) throw r.msg || i[r.err];
        return r.result;
      }

      a.prototype.push = function (t, e) {
        var r,
            i,
            n,
            s,
            a,
            o,
            h = this.strm,
            u = this.options.chunkSize,
            l = this.options.dictionary,
            f = !1;
        if (this.ended) return !1;
        i = e === ~~e ? e : !0 === e ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof t ? h.input = p.binstring2buf(t) : "[object ArrayBuffer]" === _.call(t) ? h.input = new Uint8Array(t) : h.input = t, h.next_in = 0, h.avail_in = h.input.length;

        do {
          if (0 === h.avail_out && (h.output = new c.Buf8(u), h.next_out = 0, h.avail_out = u), (r = d.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r = d.inflateSetDictionary(this.strm, o)), r === m.Z_BUF_ERROR && !0 === f && (r = m.Z_OK, f = !1), r !== m.Z_STREAM_END && r !== m.Z_OK) return this.onEnd(r), !(this.ended = !0);
          h.next_out && (0 !== h.avail_out && r !== m.Z_STREAM_END && (0 !== h.avail_in || i !== m.Z_FINISH && i !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (n = p.utf8border(h.output, h.next_out), s = h.next_out - n, a = p.buf2string(h.output, n), h.next_out = s, h.avail_out = u - s, s && c.arraySet(h.output, h.output, n, s, 0), this.onData(a)) : this.onData(c.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = !0);
        } while ((0 < h.avail_in || 0 === h.avail_out) && r !== m.Z_STREAM_END);

        return r === m.Z_STREAM_END && (i = m.Z_FINISH), i === m.Z_FINISH ? (r = d.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === m.Z_OK) : i !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
      }, a.prototype.onData = function (t) {
        this.chunks.push(t);
      }, a.prototype.onEnd = function (t) {
        t === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = c.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
      }, r.Inflate = a, r.inflate = o, r.inflateRaw = function (t, e) {
        return (e = e || {}).raw = !0, o(t, e);
      }, r.ungzip = o;
    }, {
      "./utils/common": 41,
      "./utils/strings": 42,
      "./zlib/constants": 44,
      "./zlib/gzheader": 47,
      "./zlib/inflate": 49,
      "./zlib/messages": 51,
      "./zlib/zstream": 53
    }],
    41: [function (t, e, r) {
      "use strict";

      var i = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
      r.assign = function (t) {
        for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {
          var r = e.shift();

          if (r) {
            if ("object" != typeof r) throw new TypeError(r + "must be non-object");

            for (var i in r) r.hasOwnProperty(i) && (t[i] = r[i]);
          }
        }

        return t;
      }, r.shrinkBuf = function (t, e) {
        return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t);
      };
      var n = {
        arraySet: function (t, e, r, i, n) {
          if (e.subarray && t.subarray) t.set(e.subarray(r, r + i), n);else for (var s = 0; s < i; s++) t[n + s] = e[r + s];
        },
        flattenChunks: function (t) {
          var e, r, i, n, s, a;

          for (e = i = 0, r = t.length; e < r; e++) i += t[e].length;

          for (a = new Uint8Array(i), e = n = 0, r = t.length; e < r; e++) s = t[e], a.set(s, n), n += s.length;

          return a;
        }
      },
          s = {
        arraySet: function (t, e, r, i, n) {
          for (var s = 0; s < i; s++) t[n + s] = e[r + s];
        },
        flattenChunks: function (t) {
          return [].concat.apply([], t);
        }
      };
      r.setTyped = function (t) {
        t ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, n)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
      }, r.setTyped(i);
    }, {}],
    42: [function (t, e, r) {
      "use strict";

      var h = t("./common"),
          n = !0,
          s = !0;

      try {
        String.fromCharCode.apply(null, [0]);
      } catch (t) {
        n = !1;
      }

      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (t) {
        s = !1;
      }

      for (var u = new h.Buf8(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;

      function l(t, e) {
        if (e < 65537 && (t.subarray && s || !t.subarray && n)) return String.fromCharCode.apply(null, h.shrinkBuf(t, e));

        for (var r = "", i = 0; i < e; i++) r += String.fromCharCode(t[i]);

        return r;
      }

      u[254] = u[254] = 1, r.string2buf = function (t) {
        var e,
            r,
            i,
            n,
            s,
            a = t.length,
            o = 0;

        for (n = 0; n < a; n++) 55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;

        for (e = new h.Buf8(o), n = s = 0; s < o; n++) 55296 == (64512 & (r = t.charCodeAt(n))) && n + 1 < a && 56320 == (64512 & (i = t.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), r < 128 ? e[s++] = r : (r < 2048 ? e[s++] = 192 | r >>> 6 : (r < 65536 ? e[s++] = 224 | r >>> 12 : (e[s++] = 240 | r >>> 18, e[s++] = 128 | r >>> 12 & 63), e[s++] = 128 | r >>> 6 & 63), e[s++] = 128 | 63 & r);

        return e;
      }, r.buf2binstring = function (t) {
        return l(t, t.length);
      }, r.binstring2buf = function (t) {
        for (var e = new h.Buf8(t.length), r = 0, i = e.length; r < i; r++) e[r] = t.charCodeAt(r);

        return e;
      }, r.buf2string = function (t, e) {
        var r,
            i,
            n,
            s,
            a = e || t.length,
            o = new Array(2 * a);

        for (r = i = 0; r < a;) if ((n = t[r++]) < 128) o[i++] = n;else if (4 < (s = u[n])) o[i++] = 65533, r += s - 1;else {
          for (n &= 2 === s ? 31 : 3 === s ? 15 : 7; 1 < s && r < a;) n = n << 6 | 63 & t[r++], s--;

          1 < s ? o[i++] = 65533 : n < 65536 ? o[i++] = n : (n -= 65536, o[i++] = 55296 | n >> 10 & 1023, o[i++] = 56320 | 1023 & n);
        }

        return l(o, i);
      }, r.utf8border = function (t, e) {
        var r;

        for ((e = e || t.length) > t.length && (e = t.length), r = e - 1; 0 <= r && 128 == (192 & t[r]);) r--;

        return r < 0 ? e : 0 === r ? e : r + u[t[r]] > e ? r : e;
      };
    }, {
      "./common": 41
    }],
    43: [function (t, e, r) {
      "use strict";

      e.exports = function (t, e, r, i) {
        for (var n = 65535 & t | 0, s = t >>> 16 & 65535 | 0, a = 0; 0 !== r;) {
          for (r -= a = 2e3 < r ? 2e3 : r; s = s + (n = n + e[i++] | 0) | 0, --a;);

          n %= 65521, s %= 65521;
        }

        return n | s << 16 | 0;
      };
    }, {}],
    44: [function (t, e, r) {
      "use strict";

      e.exports = {
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        Z_BUF_ERROR: -5,
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        Z_BINARY: 0,
        Z_TEXT: 1,
        Z_UNKNOWN: 2,
        Z_DEFLATED: 8
      };
    }, {}],
    45: [function (t, e, r) {
      "use strict";

      var o = function () {
        for (var t, e = [], r = 0; r < 256; r++) {
          t = r;

          for (var i = 0; i < 8; i++) t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;

          e[r] = t;
        }

        return e;
      }();

      e.exports = function (t, e, r, i) {
        var n = o,
            s = i + r;
        t ^= -1;

        for (var a = i; a < s; a++) t = t >>> 8 ^ n[255 & (t ^ e[a])];

        return -1 ^ t;
      };
    }, {}],
    46: [function (t, e, r) {
      "use strict";

      var h,
          d = t("../utils/common"),
          u = t("./trees"),
          c = t("./adler32"),
          p = t("./crc32"),
          i = t("./messages"),
          l = 0,
          f = 4,
          m = 0,
          _ = -2,
          g = -1,
          b = 4,
          n = 2,
          v = 8,
          y = 9,
          s = 286,
          a = 30,
          o = 19,
          w = 2 * s + 1,
          k = 15,
          x = 3,
          S = 258,
          z = S + x + 1,
          C = 42,
          E = 113,
          A = 1,
          I = 2,
          O = 3,
          B = 4;

      function R(t, e) {
        return t.msg = i[e], e;
      }

      function T(t) {
        return (t << 1) - (4 < t ? 9 : 0);
      }

      function D(t) {
        for (var e = t.length; 0 <= --e;) t[e] = 0;
      }

      function F(t) {
        var e = t.state,
            r = e.pending;
        r > t.avail_out && (r = t.avail_out), 0 !== r && (d.arraySet(t.output, e.pending_buf, e.pending_out, r, t.next_out), t.next_out += r, e.pending_out += r, t.total_out += r, t.avail_out -= r, e.pending -= r, 0 === e.pending && (e.pending_out = 0));
      }

      function N(t, e) {
        u._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, F(t.strm);
      }

      function U(t, e) {
        t.pending_buf[t.pending++] = e;
      }

      function P(t, e) {
        t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;
      }

      function L(t, e) {
        var r,
            i,
            n = t.max_chain_length,
            s = t.strstart,
            a = t.prev_length,
            o = t.nice_match,
            h = t.strstart > t.w_size - z ? t.strstart - (t.w_size - z) : 0,
            u = t.window,
            l = t.w_mask,
            f = t.prev,
            d = t.strstart + S,
            c = u[s + a - 1],
            p = u[s + a];
        t.prev_length >= t.good_match && (n >>= 2), o > t.lookahead && (o = t.lookahead);

        do {
          if (u[(r = e) + a] === p && u[r + a - 1] === c && u[r] === u[s] && u[++r] === u[s + 1]) {
            s += 2, r++;

            do {} while (u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && s < d);

            if (i = S - (d - s), s = d - S, a < i) {
              if (t.match_start = e, o <= (a = i)) break;
              c = u[s + a - 1], p = u[s + a];
            }
          }
        } while ((e = f[e & l]) > h && 0 != --n);

        return a <= t.lookahead ? a : t.lookahead;
      }

      function j(t) {
        var e,
            r,
            i,
            n,
            s,
            a,
            o,
            h,
            u,
            l,
            f = t.w_size;

        do {
          if (n = t.window_size - t.lookahead - t.strstart, t.strstart >= f + (f - z)) {
            for (d.arraySet(t.window, t.window, f, f, 0), t.match_start -= f, t.strstart -= f, t.block_start -= f, e = r = t.hash_size; i = t.head[--e], t.head[e] = f <= i ? i - f : 0, --r;);

            for (e = r = f; i = t.prev[--e], t.prev[e] = f <= i ? i - f : 0, --r;);

            n += f;
          }

          if (0 === t.strm.avail_in) break;
          if (a = t.strm, o = t.window, h = t.strstart + t.lookahead, u = n, l = void 0, l = a.avail_in, u < l && (l = u), r = 0 === l ? 0 : (a.avail_in -= l, d.arraySet(o, a.input, a.next_in, l, h), 1 === a.state.wrap ? a.adler = c(a.adler, o, l, h) : 2 === a.state.wrap && (a.adler = p(a.adler, o, l, h)), a.next_in += l, a.total_in += l, l), t.lookahead += r, t.lookahead + t.insert >= x) for (s = t.strstart - t.insert, t.ins_h = t.window[s], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[s + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[s + x - 1]) & t.hash_mask, t.prev[s & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = s, s++, t.insert--, !(t.lookahead + t.insert < x)););
        } while (t.lookahead < z && 0 !== t.strm.avail_in);
      }

      function Z(t, e) {
        for (var r, i;;) {
          if (t.lookahead < z) {
            if (j(t), t.lookahead < z && e === l) return A;
            if (0 === t.lookahead) break;
          }

          if (r = 0, t.lookahead >= x && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== r && t.strstart - r <= t.w_size - z && (t.match_length = L(t, r)), t.match_length >= x) {
            if (i = u._tr_tally(t, t.strstart - t.match_start, t.match_length - x), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= x) {
              for (t.match_length--; t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart, 0 != --t.match_length;);

              t.strstart++;
            } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
          } else i = u._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;
          if (i && (N(t, !1), 0 === t.strm.avail_out)) return A;
        }

        return t.insert = t.strstart < x - 1 ? t.strstart : x - 1, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I;
      }

      function W(t, e) {
        for (var r, i, n;;) {
          if (t.lookahead < z) {
            if (j(t), t.lookahead < z && e === l) return A;
            if (0 === t.lookahead) break;
          }

          if (r = 0, t.lookahead >= x && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = x - 1, 0 !== r && t.prev_length < t.max_lazy_match && t.strstart - r <= t.w_size - z && (t.match_length = L(t, r), t.match_length <= 5 && (1 === t.strategy || t.match_length === x && 4096 < t.strstart - t.match_start) && (t.match_length = x - 1)), t.prev_length >= x && t.match_length <= t.prev_length) {
            for (n = t.strstart + t.lookahead - x, i = u._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - x), t.lookahead -= t.prev_length - 1, t.prev_length -= 2; ++t.strstart <= n && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + x - 1]) & t.hash_mask, r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 != --t.prev_length;);

            if (t.match_available = 0, t.match_length = x - 1, t.strstart++, i && (N(t, !1), 0 === t.strm.avail_out)) return A;
          } else if (t.match_available) {
            if ((i = u._tr_tally(t, 0, t.window[t.strstart - 1])) && N(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return A;
          } else t.match_available = 1, t.strstart++, t.lookahead--;
        }

        return t.match_available && (i = u._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < x - 1 ? t.strstart : x - 1, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I;
      }

      function M(t, e, r, i, n) {
        this.good_length = t, this.max_lazy = e, this.nice_length = r, this.max_chain = i, this.func = n;
      }

      function H() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new d.Buf16(2 * w), this.dyn_dtree = new d.Buf16(2 * (2 * a + 1)), this.bl_tree = new d.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new d.Buf16(k + 1), this.heap = new d.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new d.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }

      function G(t) {
        var e;
        return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = n, (e = t.state).pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? C : E, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = l, u._tr_init(e), m) : R(t, _);
      }

      function K(t) {
        var e = G(t);
        return e === m && function (t) {
          t.window_size = 2 * t.w_size, D(t.head), t.max_lazy_match = h[t.level].max_lazy, t.good_match = h[t.level].good_length, t.nice_match = h[t.level].nice_length, t.max_chain_length = h[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = x - 1, t.match_available = 0, t.ins_h = 0;
        }(t.state), e;
      }

      function Y(t, e, r, i, n, s) {
        if (!t) return _;
        var a = 1;
        if (e === g && (e = 6), i < 0 ? (a = 0, i = -i) : 15 < i && (a = 2, i -= 16), n < 1 || y < n || r !== v || i < 8 || 15 < i || e < 0 || 9 < e || s < 0 || b < s) return R(t, _);
        8 === i && (i = 9);
        var o = new H();
        return (t.state = o).strm = t, o.wrap = a, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + x - 1) / x), o.window = new d.Buf8(2 * o.w_size), o.head = new d.Buf16(o.hash_size), o.prev = new d.Buf16(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new d.Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = e, o.strategy = s, o.method = r, K(t);
      }

      h = [new M(0, 0, 0, 0, function (t, e) {
        var r = 65535;

        for (r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5);;) {
          if (t.lookahead <= 1) {
            if (j(t), 0 === t.lookahead && e === l) return A;
            if (0 === t.lookahead) break;
          }

          t.strstart += t.lookahead, t.lookahead = 0;
          var i = t.block_start + r;
          if ((0 === t.strstart || t.strstart >= i) && (t.lookahead = t.strstart - i, t.strstart = i, N(t, !1), 0 === t.strm.avail_out)) return A;
          if (t.strstart - t.block_start >= t.w_size - z && (N(t, !1), 0 === t.strm.avail_out)) return A;
        }

        return t.insert = 0, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : (t.strstart > t.block_start && (N(t, !1), t.strm.avail_out), A);
      }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function (t, e) {
        return Y(t, e, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function (t, e) {
        return t && t.state ? 2 !== t.state.wrap ? _ : (t.state.gzhead = e, m) : _;
      }, r.deflate = function (t, e) {
        var r, i, n, s;
        if (!t || !t.state || 5 < e || e < 0) return t ? R(t, _) : _;
        if (i = t.state, !t.output || !t.input && 0 !== t.avail_in || 666 === i.status && e !== f) return R(t, 0 === t.avail_out ? -5 : _);
        if (i.strm = t, r = i.last_flush, i.last_flush = e, i.status === C) if (2 === i.wrap) t.adler = 0, U(i, 31), U(i, 139), U(i, 8), i.gzhead ? (U(i, (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), U(i, 255 & i.gzhead.time), U(i, i.gzhead.time >> 8 & 255), U(i, i.gzhead.time >> 16 & 255), U(i, i.gzhead.time >> 24 & 255), U(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), U(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (U(i, 255 & i.gzhead.extra.length), U(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (t.adler = p(t.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = 69) : (U(i, 0), U(i, 0), U(i, 0), U(i, 0), U(i, 0), U(i, 9 === i.level ? 2 : 2 <= i.strategy || i.level < 2 ? 4 : 0), U(i, 3), i.status = E);else {
          var a = v + (i.w_bits - 8 << 4) << 8;
          a |= (2 <= i.strategy || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (a |= 32), a += 31 - a % 31, i.status = E, P(i, a), 0 !== i.strstart && (P(i, t.adler >>> 16), P(i, 65535 & t.adler)), t.adler = 1;
        }
        if (69 === i.status) if (i.gzhead.extra) {
          for (n = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), F(t), n = i.pending, i.pending !== i.pending_buf_size));) U(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;

          i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = 73);
        } else i.status = 73;
        if (73 === i.status) if (i.gzhead.name) {
          n = i.pending;

          do {
            if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), F(t), n = i.pending, i.pending === i.pending_buf_size)) {
              s = 1;
              break;
            }

            s = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, U(i, s);
          } while (0 !== s);

          i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), 0 === s && (i.gzindex = 0, i.status = 91);
        } else i.status = 91;
        if (91 === i.status) if (i.gzhead.comment) {
          n = i.pending;

          do {
            if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), F(t), n = i.pending, i.pending === i.pending_buf_size)) {
              s = 1;
              break;
            }

            s = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, U(i, s);
          } while (0 !== s);

          i.gzhead.hcrc && i.pending > n && (t.adler = p(t.adler, i.pending_buf, i.pending - n, n)), 0 === s && (i.status = 103);
        } else i.status = 103;

        if (103 === i.status && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && F(t), i.pending + 2 <= i.pending_buf_size && (U(i, 255 & t.adler), U(i, t.adler >> 8 & 255), t.adler = 0, i.status = E)) : i.status = E), 0 !== i.pending) {
          if (F(t), 0 === t.avail_out) return i.last_flush = -1, m;
        } else if (0 === t.avail_in && T(e) <= T(r) && e !== f) return R(t, -5);

        if (666 === i.status && 0 !== t.avail_in) return R(t, -5);

        if (0 !== t.avail_in || 0 !== i.lookahead || e !== l && 666 !== i.status) {
          var o = 2 === i.strategy ? function (t, e) {
            for (var r;;) {
              if (0 === t.lookahead && (j(t), 0 === t.lookahead)) {
                if (e === l) return A;
                break;
              }

              if (t.match_length = 0, r = u._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, r && (N(t, !1), 0 === t.strm.avail_out)) return A;
            }

            return t.insert = 0, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I;
          }(i, e) : 3 === i.strategy ? function (t, e) {
            for (var r, i, n, s, a = t.window;;) {
              if (t.lookahead <= S) {
                if (j(t), t.lookahead <= S && e === l) return A;
                if (0 === t.lookahead) break;
              }

              if (t.match_length = 0, t.lookahead >= x && 0 < t.strstart && (i = a[n = t.strstart - 1]) === a[++n] && i === a[++n] && i === a[++n]) {
                s = t.strstart + S;

                do {} while (i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && i === a[++n] && n < s);

                t.match_length = S - (s - n), t.match_length > t.lookahead && (t.match_length = t.lookahead);
              }

              if (t.match_length >= x ? (r = u._tr_tally(t, 1, t.match_length - x), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (r = u._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), r && (N(t, !1), 0 === t.strm.avail_out)) return A;
            }

            return t.insert = 0, e === f ? (N(t, !0), 0 === t.strm.avail_out ? O : B) : t.last_lit && (N(t, !1), 0 === t.strm.avail_out) ? A : I;
          }(i, e) : h[i.level].func(i, e);
          if (o !== O && o !== B || (i.status = 666), o === A || o === O) return 0 === t.avail_out && (i.last_flush = -1), m;
          if (o === I && (1 === e ? u._tr_align(i) : 5 !== e && (u._tr_stored_block(i, 0, 0, !1), 3 === e && (D(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), F(t), 0 === t.avail_out)) return i.last_flush = -1, m;
        }

        return e !== f ? m : i.wrap <= 0 ? 1 : (2 === i.wrap ? (U(i, 255 & t.adler), U(i, t.adler >> 8 & 255), U(i, t.adler >> 16 & 255), U(i, t.adler >> 24 & 255), U(i, 255 & t.total_in), U(i, t.total_in >> 8 & 255), U(i, t.total_in >> 16 & 255), U(i, t.total_in >> 24 & 255)) : (P(i, t.adler >>> 16), P(i, 65535 & t.adler)), F(t), 0 < i.wrap && (i.wrap = -i.wrap), 0 !== i.pending ? m : 1);
      }, r.deflateEnd = function (t) {
        var e;
        return t && t.state ? (e = t.state.status) !== C && 69 !== e && 73 !== e && 91 !== e && 103 !== e && e !== E && 666 !== e ? R(t, _) : (t.state = null, e === E ? R(t, -3) : m) : _;
      }, r.deflateSetDictionary = function (t, e) {
        var r,
            i,
            n,
            s,
            a,
            o,
            h,
            u,
            l = e.length;
        if (!t || !t.state) return _;
        if (2 === (s = (r = t.state).wrap) || 1 === s && r.status !== C || r.lookahead) return _;

        for (1 === s && (t.adler = c(t.adler, e, l, 0)), r.wrap = 0, l >= r.w_size && (0 === s && (D(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), u = new d.Buf8(r.w_size), d.arraySet(u, e, l - r.w_size, r.w_size, 0), e = u, l = r.w_size), a = t.avail_in, o = t.next_in, h = t.input, t.avail_in = l, t.next_in = 0, t.input = e, j(r); r.lookahead >= x;) {
          for (i = r.strstart, n = r.lookahead - (x - 1); r.ins_h = (r.ins_h << r.hash_shift ^ r.window[i + x - 1]) & r.hash_mask, r.prev[i & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = i, i++, --n;);

          r.strstart = i, r.lookahead = x - 1, j(r);
        }

        return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = x - 1, r.match_available = 0, t.next_in = o, t.input = h, t.avail_in = a, r.wrap = s, m;
      }, r.deflateInfo = "pako deflate (from Nodeca project)";
    }, {
      "../utils/common": 41,
      "./adler32": 43,
      "./crc32": 45,
      "./messages": 51,
      "./trees": 52
    }],
    47: [function (t, e, r) {
      "use strict";

      e.exports = function () {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, {}],
    48: [function (t, e, r) {
      "use strict";

      e.exports = function (t, e) {
        var r, i, n, s, a, o, h, u, l, f, d, c, p, m, _, g, b, v, y, w, k, x, S, z, C;

        r = t.state, i = t.next_in, z = t.input, n = i + (t.avail_in - 5), s = t.next_out, C = t.output, a = s - (e - t.avail_out), o = s + (t.avail_out - 257), h = r.dmax, u = r.wsize, l = r.whave, f = r.wnext, d = r.window, c = r.hold, p = r.bits, m = r.lencode, _ = r.distcode, g = (1 << r.lenbits) - 1, b = (1 << r.distbits) - 1;

        t: do {
          p < 15 && (c += z[i++] << p, p += 8, c += z[i++] << p, p += 8), v = m[c & g];

          e: for (;;) {
            if (c >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;else {
              if (!(16 & y)) {
                if (0 == (64 & y)) {
                  v = m[(65535 & v) + (c & (1 << y) - 1)];
                  continue e;
                }

                if (32 & y) {
                  r.mode = 12;
                  break t;
                }

                t.msg = "invalid literal/length code", r.mode = 30;
                break t;
              }

              w = 65535 & v, (y &= 15) && (p < y && (c += z[i++] << p, p += 8), w += c & (1 << y) - 1, c >>>= y, p -= y), p < 15 && (c += z[i++] << p, p += 8, c += z[i++] << p, p += 8), v = _[c & b];

              r: for (;;) {
                if (c >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                  if (0 == (64 & y)) {
                    v = _[(65535 & v) + (c & (1 << y) - 1)];
                    continue r;
                  }

                  t.msg = "invalid distance code", r.mode = 30;
                  break t;
                }

                if (k = 65535 & v, p < (y &= 15) && (c += z[i++] << p, (p += 8) < y && (c += z[i++] << p, p += 8)), h < (k += c & (1 << y) - 1)) {
                  t.msg = "invalid distance too far back", r.mode = 30;
                  break t;
                }

                if (c >>>= y, p -= y, (y = s - a) < k) {
                  if (l < (y = k - y) && r.sane) {
                    t.msg = "invalid distance too far back", r.mode = 30;
                    break t;
                  }

                  if (S = d, (x = 0) === f) {
                    if (x += u - y, y < w) {
                      for (w -= y; C[s++] = d[x++], --y;);

                      x = s - k, S = C;
                    }
                  } else if (f < y) {
                    if (x += u + f - y, (y -= f) < w) {
                      for (w -= y; C[s++] = d[x++], --y;);

                      if (x = 0, f < w) {
                        for (w -= y = f; C[s++] = d[x++], --y;);

                        x = s - k, S = C;
                      }
                    }
                  } else if (x += f - y, y < w) {
                    for (w -= y; C[s++] = d[x++], --y;);

                    x = s - k, S = C;
                  }

                  for (; 2 < w;) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;

                  w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                } else {
                  for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3););

                  w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                }

                break;
              }
            }
            break;
          }
        } while (i < n && s < o);

        i -= w = p >> 3, c &= (1 << (p -= w << 3)) - 1, t.next_in = i, t.next_out = s, t.avail_in = i < n ? n - i + 5 : 5 - (i - n), t.avail_out = s < o ? o - s + 257 : 257 - (s - o), r.hold = c, r.bits = p;
      };
    }, {}],
    49: [function (t, e, r) {
      "use strict";

      var I = t("../utils/common"),
          O = t("./adler32"),
          B = t("./crc32"),
          R = t("./inffast"),
          T = t("./inftrees"),
          D = 1,
          F = 2,
          N = 0,
          U = -2,
          P = 1,
          i = 852,
          n = 592;

      function L(t) {
        return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24);
      }

      function s() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }

      function a(t) {
        var e;
        return t && t.state ? (e = t.state, t.total_in = t.total_out = e.total = 0, t.msg = "", e.wrap && (t.adler = 1 & e.wrap), e.mode = P, e.last = 0, e.havedict = 0, e.dmax = 32768, e.head = null, e.hold = 0, e.bits = 0, e.lencode = e.lendyn = new I.Buf32(i), e.distcode = e.distdyn = new I.Buf32(n), e.sane = 1, e.back = -1, N) : U;
      }

      function o(t) {
        var e;
        return t && t.state ? ((e = t.state).wsize = 0, e.whave = 0, e.wnext = 0, a(t)) : U;
      }

      function h(t, e) {
        var r, i;
        return t && t.state ? (i = t.state, e < 0 ? (r = 0, e = -e) : (r = 1 + (e >> 4), e < 48 && (e &= 15)), e && (e < 8 || 15 < e) ? U : (null !== i.window && i.wbits !== e && (i.window = null), i.wrap = r, i.wbits = e, o(t))) : U;
      }

      function u(t, e) {
        var r, i;
        return t ? (i = new s(), (t.state = i).window = null, (r = h(t, e)) !== N && (t.state = null), r) : U;
      }

      var l,
          f,
          d = !0;

      function j(t) {
        if (d) {
          var e;

          for (l = new I.Buf32(512), f = new I.Buf32(32), e = 0; e < 144;) t.lens[e++] = 8;

          for (; e < 256;) t.lens[e++] = 9;

          for (; e < 280;) t.lens[e++] = 7;

          for (; e < 288;) t.lens[e++] = 8;

          for (T(D, t.lens, 0, 288, l, 0, t.work, {
            bits: 9
          }), e = 0; e < 32;) t.lens[e++] = 5;

          T(F, t.lens, 0, 32, f, 0, t.work, {
            bits: 5
          }), d = !1;
        }

        t.lencode = l, t.lenbits = 9, t.distcode = f, t.distbits = 5;
      }

      function Z(t, e, r, i) {
        var n,
            s = t.state;
        return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new I.Buf8(s.wsize)), i >= s.wsize ? (I.arraySet(s.window, e, r - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : (i < (n = s.wsize - s.wnext) && (n = i), I.arraySet(s.window, e, r - i, n, s.wnext), (i -= n) ? (I.arraySet(s.window, e, r - i, i, 0), s.wnext = i, s.whave = s.wsize) : (s.wnext += n, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += n))), 0;
      }

      r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function (t) {
        return u(t, 15);
      }, r.inflateInit2 = u, r.inflate = function (t, e) {
        var r,
            i,
            n,
            s,
            a,
            o,
            h,
            u,
            l,
            f,
            d,
            c,
            p,
            m,
            _,
            g,
            b,
            v,
            y,
            w,
            k,
            x,
            S,
            z,
            C = 0,
            E = new I.Buf8(4),
            A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

        if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in) return U;
        12 === (r = t.state).mode && (r.mode = 13), a = t.next_out, n = t.output, h = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, u = r.hold, l = r.bits, f = o, d = h, x = N;

        t: for (;;) switch (r.mode) {
          case P:
            if (0 === r.wrap) {
              r.mode = 13;
              break;
            }

            for (; l < 16;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            if (2 & r.wrap && 35615 === u) {
              E[r.check = 0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0), l = u = 0, r.mode = 2;
              break;
            }

            if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & u) << 8) + (u >> 8)) % 31) {
              t.msg = "incorrect header check", r.mode = 30;
              break;
            }

            if (8 != (15 & u)) {
              t.msg = "unknown compression method", r.mode = 30;
              break;
            }

            if (l -= 4, k = 8 + (15 & (u >>>= 4)), 0 === r.wbits) r.wbits = k;else if (k > r.wbits) {
              t.msg = "invalid window size", r.mode = 30;
              break;
            }
            r.dmax = 1 << k, t.adler = r.check = 1, r.mode = 512 & u ? 10 : 12, l = u = 0;
            break;

          case 2:
            for (; l < 16;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            if (r.flags = u, 8 != (255 & r.flags)) {
              t.msg = "unknown compression method", r.mode = 30;
              break;
            }

            if (57344 & r.flags) {
              t.msg = "unknown header flags set", r.mode = 30;
              break;
            }

            r.head && (r.head.text = u >> 8 & 1), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 3;

          case 3:
            for (; l < 32;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            r.head && (r.head.time = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, E[2] = u >>> 16 & 255, E[3] = u >>> 24 & 255, r.check = B(r.check, E, 4, 0)), l = u = 0, r.mode = 4;

          case 4:
            for (; l < 16;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            r.head && (r.head.xflags = 255 & u, r.head.os = u >> 8), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 5;

          case 5:
            if (1024 & r.flags) {
              for (; l < 16;) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              r.length = u, r.head && (r.head.extra_len = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0;
            } else r.head && (r.head.extra = null);

            r.mode = 6;

          case 6:
            if (1024 & r.flags && (o < (c = r.length) && (c = o), c && (r.head && (k = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), I.arraySet(r.head.extra, i, s, c, k)), 512 & r.flags && (r.check = B(r.check, i, c, s)), o -= c, s += c, r.length -= c), r.length)) break t;
            r.length = 0, r.mode = 7;

          case 7:
            if (2048 & r.flags) {
              if (0 === o) break t;

              for (c = 0; k = i[s + c++], r.head && k && r.length < 65536 && (r.head.name += String.fromCharCode(k)), k && c < o;);

              if (512 & r.flags && (r.check = B(r.check, i, c, s)), o -= c, s += c, k) break t;
            } else r.head && (r.head.name = null);

            r.length = 0, r.mode = 8;

          case 8:
            if (4096 & r.flags) {
              if (0 === o) break t;

              for (c = 0; k = i[s + c++], r.head && k && r.length < 65536 && (r.head.comment += String.fromCharCode(k)), k && c < o;);

              if (512 & r.flags && (r.check = B(r.check, i, c, s)), o -= c, s += c, k) break t;
            } else r.head && (r.head.comment = null);

            r.mode = 9;

          case 9:
            if (512 & r.flags) {
              for (; l < 16;) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              if (u !== (65535 & r.check)) {
                t.msg = "header crc mismatch", r.mode = 30;
                break;
              }

              l = u = 0;
            }

            r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), t.adler = r.check = 0, r.mode = 12;
            break;

          case 10:
            for (; l < 32;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            t.adler = r.check = L(u), l = u = 0, r.mode = 11;

          case 11:
            if (0 === r.havedict) return t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, r.hold = u, r.bits = l, 2;
            t.adler = r.check = 1, r.mode = 12;

          case 12:
            if (5 === e || 6 === e) break t;

          case 13:
            if (r.last) {
              u >>>= 7 & l, l -= 7 & l, r.mode = 27;
              break;
            }

            for (; l < 3;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            switch (r.last = 1 & u, l -= 1, 3 & (u >>>= 1)) {
              case 0:
                r.mode = 14;
                break;

              case 1:
                if (j(r), r.mode = 20, 6 !== e) break;
                u >>>= 2, l -= 2;
                break t;

              case 2:
                r.mode = 17;
                break;

              case 3:
                t.msg = "invalid block type", r.mode = 30;
            }

            u >>>= 2, l -= 2;
            break;

          case 14:
            for (u >>>= 7 & l, l -= 7 & l; l < 32;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            if ((65535 & u) != (u >>> 16 ^ 65535)) {
              t.msg = "invalid stored block lengths", r.mode = 30;
              break;
            }

            if (r.length = 65535 & u, l = u = 0, r.mode = 15, 6 === e) break t;

          case 15:
            r.mode = 16;

          case 16:
            if (c = r.length) {
              if (o < c && (c = o), h < c && (c = h), 0 === c) break t;
              I.arraySet(n, i, s, c, a), o -= c, s += c, h -= c, a += c, r.length -= c;
              break;
            }

            r.mode = 12;
            break;

          case 17:
            for (; l < 14;) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            if (r.nlen = 257 + (31 & u), u >>>= 5, l -= 5, r.ndist = 1 + (31 & u), u >>>= 5, l -= 5, r.ncode = 4 + (15 & u), u >>>= 4, l -= 4, 286 < r.nlen || 30 < r.ndist) {
              t.msg = "too many length or distance symbols", r.mode = 30;
              break;
            }

            r.have = 0, r.mode = 18;

          case 18:
            for (; r.have < r.ncode;) {
              for (; l < 3;) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              r.lens[A[r.have++]] = 7 & u, u >>>= 3, l -= 3;
            }

            for (; r.have < 19;) r.lens[A[r.have++]] = 0;

            if (r.lencode = r.lendyn, r.lenbits = 7, S = {
              bits: r.lenbits
            }, x = T(0, r.lens, 0, 19, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) {
              t.msg = "invalid code lengths set", r.mode = 30;
              break;
            }

            r.have = 0, r.mode = 19;

          case 19:
            for (; r.have < r.nlen + r.ndist;) {
              for (; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              if (b < 16) u >>>= _, l -= _, r.lens[r.have++] = b;else {
                if (16 === b) {
                  for (z = _ + 2; l < z;) {
                    if (0 === o) break t;
                    o--, u += i[s++] << l, l += 8;
                  }

                  if (u >>>= _, l -= _, 0 === r.have) {
                    t.msg = "invalid bit length repeat", r.mode = 30;
                    break;
                  }

                  k = r.lens[r.have - 1], c = 3 + (3 & u), u >>>= 2, l -= 2;
                } else if (17 === b) {
                  for (z = _ + 3; l < z;) {
                    if (0 === o) break t;
                    o--, u += i[s++] << l, l += 8;
                  }

                  l -= _, k = 0, c = 3 + (7 & (u >>>= _)), u >>>= 3, l -= 3;
                } else {
                  for (z = _ + 7; l < z;) {
                    if (0 === o) break t;
                    o--, u += i[s++] << l, l += 8;
                  }

                  l -= _, k = 0, c = 11 + (127 & (u >>>= _)), u >>>= 7, l -= 7;
                }

                if (r.have + c > r.nlen + r.ndist) {
                  t.msg = "invalid bit length repeat", r.mode = 30;
                  break;
                }

                for (; c--;) r.lens[r.have++] = k;
              }
            }

            if (30 === r.mode) break;

            if (0 === r.lens[256]) {
              t.msg = "invalid code -- missing end-of-block", r.mode = 30;
              break;
            }

            if (r.lenbits = 9, S = {
              bits: r.lenbits
            }, x = T(D, r.lens, 0, r.nlen, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) {
              t.msg = "invalid literal/lengths set", r.mode = 30;
              break;
            }

            if (r.distbits = 6, r.distcode = r.distdyn, S = {
              bits: r.distbits
            }, x = T(F, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S), r.distbits = S.bits, x) {
              t.msg = "invalid distances set", r.mode = 30;
              break;
            }

            if (r.mode = 20, 6 === e) break t;

          case 20:
            r.mode = 21;

          case 21:
            if (6 <= o && 258 <= h) {
              t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, r.hold = u, r.bits = l, R(t, d), a = t.next_out, n = t.output, h = t.avail_out, s = t.next_in, i = t.input, o = t.avail_in, u = r.hold, l = r.bits, 12 === r.mode && (r.back = -1);
              break;
            }

            for (r.back = 0; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            if (g && 0 == (240 & g)) {
              for (v = _, y = g, w = b; g = (C = r.lencode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              u >>>= v, l -= v, r.back += v;
            }

            if (u >>>= _, l -= _, r.back += _, r.length = b, 0 === g) {
              r.mode = 26;
              break;
            }

            if (32 & g) {
              r.back = -1, r.mode = 12;
              break;
            }

            if (64 & g) {
              t.msg = "invalid literal/length code", r.mode = 30;
              break;
            }

            r.extra = 15 & g, r.mode = 22;

          case 22:
            if (r.extra) {
              for (z = r.extra; l < z;) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              r.length += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra;
            }

            r.was = r.length, r.mode = 23;

          case 23:
            for (; g = (C = r.distcode[u & (1 << r.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
              if (0 === o) break t;
              o--, u += i[s++] << l, l += 8;
            }

            if (0 == (240 & g)) {
              for (v = _, y = g, w = b; g = (C = r.distcode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              u >>>= v, l -= v, r.back += v;
            }

            if (u >>>= _, l -= _, r.back += _, 64 & g) {
              t.msg = "invalid distance code", r.mode = 30;
              break;
            }

            r.offset = b, r.extra = 15 & g, r.mode = 24;

          case 24:
            if (r.extra) {
              for (z = r.extra; l < z;) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              r.offset += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra;
            }

            if (r.offset > r.dmax) {
              t.msg = "invalid distance too far back", r.mode = 30;
              break;
            }

            r.mode = 25;

          case 25:
            if (0 === h) break t;

            if (c = d - h, r.offset > c) {
              if ((c = r.offset - c) > r.whave && r.sane) {
                t.msg = "invalid distance too far back", r.mode = 30;
                break;
              }

              p = c > r.wnext ? (c -= r.wnext, r.wsize - c) : r.wnext - c, c > r.length && (c = r.length), m = r.window;
            } else m = n, p = a - r.offset, c = r.length;

            for (h < c && (c = h), h -= c, r.length -= c; n[a++] = m[p++], --c;);

            0 === r.length && (r.mode = 21);
            break;

          case 26:
            if (0 === h) break t;
            n[a++] = r.length, h--, r.mode = 21;
            break;

          case 27:
            if (r.wrap) {
              for (; l < 32;) {
                if (0 === o) break t;
                o--, u |= i[s++] << l, l += 8;
              }

              if (d -= h, t.total_out += d, r.total += d, d && (t.adler = r.check = r.flags ? B(r.check, n, d, a - d) : O(r.check, n, d, a - d)), d = h, (r.flags ? u : L(u)) !== r.check) {
                t.msg = "incorrect data check", r.mode = 30;
                break;
              }

              l = u = 0;
            }

            r.mode = 28;

          case 28:
            if (r.wrap && r.flags) {
              for (; l < 32;) {
                if (0 === o) break t;
                o--, u += i[s++] << l, l += 8;
              }

              if (u !== (4294967295 & r.total)) {
                t.msg = "incorrect length check", r.mode = 30;
                break;
              }

              l = u = 0;
            }

            r.mode = 29;

          case 29:
            x = 1;
            break t;

          case 30:
            x = -3;
            break t;

          case 31:
            return -4;

          case 32:
          default:
            return U;
        }

        return t.next_out = a, t.avail_out = h, t.next_in = s, t.avail_in = o, r.hold = u, r.bits = l, (r.wsize || d !== t.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== e)) && Z(t, t.output, t.next_out, d - t.avail_out) ? (r.mode = 31, -4) : (f -= t.avail_in, d -= t.avail_out, t.total_in += f, t.total_out += d, r.total += d, r.wrap && d && (t.adler = r.check = r.flags ? B(r.check, n, d, t.next_out - d) : O(r.check, n, d, t.next_out - d)), t.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 == f && 0 === d || 4 === e) && x === N && (x = -5), x);
      }, r.inflateEnd = function (t) {
        if (!t || !t.state) return U;
        var e = t.state;
        return e.window && (e.window = null), t.state = null, N;
      }, r.inflateGetHeader = function (t, e) {
        var r;
        return t && t.state ? 0 == (2 & (r = t.state).wrap) ? U : ((r.head = e).done = !1, N) : U;
      }, r.inflateSetDictionary = function (t, e) {
        var r,
            i = e.length;
        return t && t.state ? 0 !== (r = t.state).wrap && 11 !== r.mode ? U : 11 === r.mode && O(1, e, i, 0) !== r.check ? -3 : Z(t, e, i, i) ? (r.mode = 31, -4) : (r.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, {
      "../utils/common": 41,
      "./adler32": 43,
      "./crc32": 45,
      "./inffast": 48,
      "./inftrees": 50
    }],
    50: [function (t, e, r) {
      "use strict";

      var D = t("../utils/common"),
          F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
          N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
          U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
          P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];

      e.exports = function (t, e, r, i, n, s, a, o) {
        var h,
            u,
            l,
            f,
            d,
            c,
            p,
            m,
            _,
            g = o.bits,
            b = 0,
            v = 0,
            y = 0,
            w = 0,
            k = 0,
            x = 0,
            S = 0,
            z = 0,
            C = 0,
            E = 0,
            A = null,
            I = 0,
            O = new D.Buf16(16),
            B = new D.Buf16(16),
            R = null,
            T = 0;

        for (b = 0; b <= 15; b++) O[b] = 0;

        for (v = 0; v < i; v++) O[e[r + v]]++;

        for (k = g, w = 15; 1 <= w && 0 === O[w]; w--);

        if (w < k && (k = w), 0 === w) return n[s++] = 20971520, n[s++] = 20971520, o.bits = 1, 0;

        for (y = 1; y < w && 0 === O[y]; y++);

        for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;

        if (0 < z && (0 === t || 1 !== w)) return -1;

        for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];

        for (v = 0; v < i; v++) 0 !== e[r + v] && (a[B[e[r + v]]++] = v);

        if (c = 0 === t ? (A = R = a, 19) : 1 === t ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, d = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === t && 852 < C || 2 === t && 592 < C) return 1;

        for (;;) {
          for (p = b - S, _ = a[v] < c ? (m = 0, a[v]) : a[v] > c ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; n[d + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u;);

          for (h = 1 << b - 1; E & h;) h >>= 1;

          if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
            if (b === w) break;
            b = e[r + a[v]];
          }

          if (k < b && (E & f) !== l) {
            for (0 === S && (S = k), d += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0);) x++, z <<= 1;

            if (C += 1 << x, 1 === t && 852 < C || 2 === t && 592 < C) return 1;
            n[l = E & f] = k << 24 | x << 16 | d - s | 0;
          }
        }

        return 0 !== E && (n[d + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, {
      "../utils/common": 41
    }],
    51: [function (t, e, r) {
      "use strict";

      e.exports = {
        2: "need dictionary",
        1: "stream end",
        0: "",
        "-1": "file error",
        "-2": "stream error",
        "-3": "data error",
        "-4": "insufficient memory",
        "-5": "buffer error",
        "-6": "incompatible version"
      };
    }, {}],
    52: [function (t, e, r) {
      "use strict";

      var n = t("../utils/common"),
          o = 0,
          h = 1;

      function i(t) {
        for (var e = t.length; 0 <= --e;) t[e] = 0;
      }

      var s = 0,
          a = 29,
          u = 256,
          l = u + 1 + a,
          f = 30,
          d = 19,
          _ = 2 * l + 1,
          g = 15,
          c = 16,
          p = 7,
          m = 256,
          b = 16,
          v = 17,
          y = 18,
          w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
          k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
          x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
          S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
          z = new Array(2 * (l + 2));

      i(z);
      var C = new Array(2 * f);
      i(C);
      var E = new Array(512);
      i(E);
      var A = new Array(256);
      i(A);
      var I = new Array(a);
      i(I);
      var O,
          B,
          R,
          T = new Array(f);

      function D(t, e, r, i, n) {
        this.static_tree = t, this.extra_bits = e, this.extra_base = r, this.elems = i, this.max_length = n, this.has_stree = t && t.length;
      }

      function F(t, e) {
        this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;
      }

      function N(t) {
        return t < 256 ? E[t] : E[256 + (t >>> 7)];
      }

      function U(t, e) {
        t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;
      }

      function P(t, e, r) {
        t.bi_valid > c - r ? (t.bi_buf |= e << t.bi_valid & 65535, U(t, t.bi_buf), t.bi_buf = e >> c - t.bi_valid, t.bi_valid += r - c) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += r);
      }

      function L(t, e, r) {
        P(t, r[2 * e], r[2 * e + 1]);
      }

      function j(t, e) {
        for (var r = 0; r |= 1 & t, t >>>= 1, r <<= 1, 0 < --e;);

        return r >>> 1;
      }

      function Z(t, e, r) {
        var i,
            n,
            s = new Array(g + 1),
            a = 0;

        for (i = 1; i <= g; i++) s[i] = a = a + r[i - 1] << 1;

        for (n = 0; n <= e; n++) {
          var o = t[2 * n + 1];
          0 !== o && (t[2 * n] = j(s[o]++, o));
        }
      }

      function W(t) {
        var e;

        for (e = 0; e < l; e++) t.dyn_ltree[2 * e] = 0;

        for (e = 0; e < f; e++) t.dyn_dtree[2 * e] = 0;

        for (e = 0; e < d; e++) t.bl_tree[2 * e] = 0;

        t.dyn_ltree[2 * m] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;
      }

      function M(t) {
        8 < t.bi_valid ? U(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;
      }

      function H(t, e, r, i) {
        var n = 2 * e,
            s = 2 * r;
        return t[n] < t[s] || t[n] === t[s] && i[e] <= i[r];
      }

      function G(t, e, r) {
        for (var i = t.heap[r], n = r << 1; n <= t.heap_len && (n < t.heap_len && H(e, t.heap[n + 1], t.heap[n], t.depth) && n++, !H(e, i, t.heap[n], t.depth));) t.heap[r] = t.heap[n], r = n, n <<= 1;

        t.heap[r] = i;
      }

      function K(t, e, r) {
        var i,
            n,
            s,
            a,
            o = 0;
        if (0 !== t.last_lit) for (; i = t.pending_buf[t.d_buf + 2 * o] << 8 | t.pending_buf[t.d_buf + 2 * o + 1], n = t.pending_buf[t.l_buf + o], o++, 0 === i ? L(t, n, e) : (L(t, (s = A[n]) + u + 1, e), 0 !== (a = w[s]) && P(t, n -= I[s], a), L(t, s = N(--i), r), 0 !== (a = k[s]) && P(t, i -= T[s], a)), o < t.last_lit;);
        L(t, m, e);
      }

      function Y(t, e) {
        var r,
            i,
            n,
            s = e.dyn_tree,
            a = e.stat_desc.static_tree,
            o = e.stat_desc.has_stree,
            h = e.stat_desc.elems,
            u = -1;

        for (t.heap_len = 0, t.heap_max = _, r = 0; r < h; r++) 0 !== s[2 * r] ? (t.heap[++t.heap_len] = u = r, t.depth[r] = 0) : s[2 * r + 1] = 0;

        for (; t.heap_len < 2;) s[2 * (n = t.heap[++t.heap_len] = u < 2 ? ++u : 0)] = 1, t.depth[n] = 0, t.opt_len--, o && (t.static_len -= a[2 * n + 1]);

        for (e.max_code = u, r = t.heap_len >> 1; 1 <= r; r--) G(t, s, r);

        for (n = h; r = t.heap[1], t.heap[1] = t.heap[t.heap_len--], G(t, s, 1), i = t.heap[1], t.heap[--t.heap_max] = r, t.heap[--t.heap_max] = i, s[2 * n] = s[2 * r] + s[2 * i], t.depth[n] = (t.depth[r] >= t.depth[i] ? t.depth[r] : t.depth[i]) + 1, s[2 * r + 1] = s[2 * i + 1] = n, t.heap[1] = n++, G(t, s, 1), 2 <= t.heap_len;);

        t.heap[--t.heap_max] = t.heap[1], function (t, e) {
          var r,
              i,
              n,
              s,
              a,
              o,
              h = e.dyn_tree,
              u = e.max_code,
              l = e.stat_desc.static_tree,
              f = e.stat_desc.has_stree,
              d = e.stat_desc.extra_bits,
              c = e.stat_desc.extra_base,
              p = e.stat_desc.max_length,
              m = 0;

          for (s = 0; s <= g; s++) t.bl_count[s] = 0;

          for (h[2 * t.heap[t.heap_max] + 1] = 0, r = t.heap_max + 1; r < _; r++) p < (s = h[2 * h[2 * (i = t.heap[r]) + 1] + 1] + 1) && (s = p, m++), h[2 * i + 1] = s, u < i || (t.bl_count[s]++, a = 0, c <= i && (a = d[i - c]), o = h[2 * i], t.opt_len += o * (s + a), f && (t.static_len += o * (l[2 * i + 1] + a)));

          if (0 !== m) {
            do {
              for (s = p - 1; 0 === t.bl_count[s];) s--;

              t.bl_count[s]--, t.bl_count[s + 1] += 2, t.bl_count[p]--, m -= 2;
            } while (0 < m);

            for (s = p; 0 !== s; s--) for (i = t.bl_count[s]; 0 !== i;) u < (n = t.heap[--r]) || (h[2 * n + 1] !== s && (t.opt_len += (s - h[2 * n + 1]) * h[2 * n], h[2 * n + 1] = s), i--);
          }
        }(t, e), Z(s, u, t.bl_count);
      }

      function X(t, e, r) {
        var i,
            n,
            s = -1,
            a = e[1],
            o = 0,
            h = 7,
            u = 4;

        for (0 === a && (h = 138, u = 3), e[2 * (r + 1) + 1] = 65535, i = 0; i <= r; i++) n = a, a = e[2 * (i + 1) + 1], ++o < h && n === a || (o < u ? t.bl_tree[2 * n] += o : 0 !== n ? (n !== s && t.bl_tree[2 * n]++, t.bl_tree[2 * b]++) : o <= 10 ? t.bl_tree[2 * v]++ : t.bl_tree[2 * y]++, s = n, u = (o = 0) === a ? (h = 138, 3) : n === a ? (h = 6, 3) : (h = 7, 4));
      }

      function V(t, e, r) {
        var i,
            n,
            s = -1,
            a = e[1],
            o = 0,
            h = 7,
            u = 4;

        for (0 === a && (h = 138, u = 3), i = 0; i <= r; i++) if (n = a, a = e[2 * (i + 1) + 1], !(++o < h && n === a)) {
          if (o < u) for (; L(t, n, t.bl_tree), 0 != --o;);else 0 !== n ? (n !== s && (L(t, n, t.bl_tree), o--), L(t, b, t.bl_tree), P(t, o - 3, 2)) : o <= 10 ? (L(t, v, t.bl_tree), P(t, o - 3, 3)) : (L(t, y, t.bl_tree), P(t, o - 11, 7));
          s = n, u = (o = 0) === a ? (h = 138, 3) : n === a ? (h = 6, 3) : (h = 7, 4);
        }
      }

      i(T);
      var q = !1;

      function J(t, e, r, i) {
        P(t, (s << 1) + (i ? 1 : 0), 3), function (t, e, r, i) {
          M(t), i && (U(t, r), U(t, ~r)), n.arraySet(t.pending_buf, t.window, e, r, t.pending), t.pending += r;
        }(t, e, r, !0);
      }

      r._tr_init = function (t) {
        q || (function () {
          var t,
              e,
              r,
              i,
              n,
              s = new Array(g + 1);

          for (i = r = 0; i < a - 1; i++) for (I[i] = r, t = 0; t < 1 << w[i]; t++) A[r++] = i;

          for (A[r - 1] = i, i = n = 0; i < 16; i++) for (T[i] = n, t = 0; t < 1 << k[i]; t++) E[n++] = i;

          for (n >>= 7; i < f; i++) for (T[i] = n << 7, t = 0; t < 1 << k[i] - 7; t++) E[256 + n++] = i;

          for (e = 0; e <= g; e++) s[e] = 0;

          for (t = 0; t <= 143;) z[2 * t + 1] = 8, t++, s[8]++;

          for (; t <= 255;) z[2 * t + 1] = 9, t++, s[9]++;

          for (; t <= 279;) z[2 * t + 1] = 7, t++, s[7]++;

          for (; t <= 287;) z[2 * t + 1] = 8, t++, s[8]++;

          for (Z(z, l + 1, s), t = 0; t < f; t++) C[2 * t + 1] = 5, C[2 * t] = j(t, 5);

          O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, d, p);
        }(), q = !0), t.l_desc = new F(t.dyn_ltree, O), t.d_desc = new F(t.dyn_dtree, B), t.bl_desc = new F(t.bl_tree, R), t.bi_buf = 0, t.bi_valid = 0, W(t);
      }, r._tr_stored_block = J, r._tr_flush_block = function (t, e, r, i) {
        var n,
            s,
            a = 0;
        0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function (t) {
          var e,
              r = 4093624447;

          for (e = 0; e <= 31; e++, r >>>= 1) if (1 & r && 0 !== t.dyn_ltree[2 * e]) return o;

          if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return h;

          for (e = 32; e < u; e++) if (0 !== t.dyn_ltree[2 * e]) return h;

          return o;
        }(t)), Y(t, t.l_desc), Y(t, t.d_desc), a = function (t) {
          var e;

          for (X(t, t.dyn_ltree, t.l_desc.max_code), X(t, t.dyn_dtree, t.d_desc.max_code), Y(t, t.bl_desc), e = d - 1; 3 <= e && 0 === t.bl_tree[2 * S[e] + 1]; e--);

          return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
        }(t), n = t.opt_len + 3 + 7 >>> 3, (s = t.static_len + 3 + 7 >>> 3) <= n && (n = s)) : n = s = r + 5, r + 4 <= n && -1 !== e ? J(t, e, r, i) : 4 === t.strategy || s === n ? (P(t, 2 + (i ? 1 : 0), 3), K(t, z, C)) : (P(t, 4 + (i ? 1 : 0), 3), function (t, e, r, i) {
          var n;

          for (P(t, e - 257, 5), P(t, r - 1, 5), P(t, i - 4, 4), n = 0; n < i; n++) P(t, t.bl_tree[2 * S[n] + 1], 3);

          V(t, t.dyn_ltree, e - 1), V(t, t.dyn_dtree, r - 1);
        }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, a + 1), K(t, t.dyn_ltree, t.dyn_dtree)), W(t), i && M(t);
      }, r._tr_tally = function (t, e, r) {
        return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & r, t.last_lit++, 0 === e ? t.dyn_ltree[2 * r]++ : (t.matches++, e--, t.dyn_ltree[2 * (A[r] + u + 1)]++, t.dyn_dtree[2 * N(e)]++), t.last_lit === t.lit_bufsize - 1;
      }, r._tr_align = function (t) {
        P(t, 2, 3), L(t, m, z), function (t) {
          16 === t.bi_valid ? (U(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : 8 <= t.bi_valid && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);
        }(t);
      };
    }, {
      "../utils/common": 41
    }],
    53: [function (t, e, r) {
      "use strict";

      e.exports = function () {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}],
    54: [function (t, e, r) {
      "use strict";

      e.exports = "function" == typeof setImmediate ? setImmediate : function () {
        var t = [].slice.apply(arguments);
        t.splice(1, 0, 0), setTimeout.apply(null, t);
      };
    }, {}]
  }, {}, [10])(10);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../../timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");
/** Built-in value references. */


var Symbol = root.Symbol;
module.exports = Symbol;

/***/ }),

/***/ "./node_modules/lodash/_arrayPush.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayPush.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}

module.exports = arrayPush;

/***/ }),

/***/ "./node_modules/lodash/_baseFlatten.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseFlatten.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "./node_modules/lodash/_arrayPush.js"),
    isFlattenable = __webpack_require__(/*! ./_isFlattenable */ "./node_modules/lodash/_isFlattenable.js");
/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */


function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];

    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }

  return result;
}

module.exports = baseFlatten;

/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");
/** `Object#toString` result references. */


var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
/** Built-in value references. */

var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}

module.exports = baseGetTag;

/***/ }),

/***/ "./node_modules/lodash/_baseIsArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_baseIsArguments.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");
/** `Object#toString` result references. */


var argsTag = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
module.exports = freeGlobal;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/** Built-in value references. */

var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }

  return result;
}

module.exports = getRawTag;

/***/ }),

/***/ "./node_modules/lodash/_isFlattenable.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_isFlattenable.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "./node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "./node_modules/lodash/isArray.js");
/** Built-in value references. */


var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */

function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");
/** Detect free variable `self`. */


var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
module.exports = root;

/***/ }),

/***/ "./node_modules/lodash/flattenDeep.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/flattenDeep.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "./node_modules/lodash/_baseFlatten.js");
/** Used as references for various `Number` constants. */


var INFINITY = 1 / 0;
/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */

function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}

module.exports = flattenDeep;

/***/ }),

/***/ "./node_modules/lodash/isArguments.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/isArguments.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "./node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable = objectProto.propertyIsEnumerable;
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */

var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
module.exports = isArguments;

/***/ }),

/***/ "./node_modules/lodash/isArray.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/isArray.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;
module.exports = isArray;

/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

/***/ }),

/***/ "./node_modules/music-tempo/dist/node/Agent.js":
/*!*****************************************************!*\
  !*** ./node_modules/music-tempo/dist/node/Agent.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Agent = function () {
    /**
     * Constructor
     * @param {Number} tempo - tempo hypothesis of the Agent
     * @param {Number} firstBeatTime - the time of the first beat accepted by this Agent
     * @param {Number} firsteventScore - salience value of the first beat accepted by this Agent
     * @param {Array} agentList - reference to the agent list 
     * @param {Object} [params={}] - parameters     
     * @param {Number} [params.expiryTime=10] - the time after which an Agent that has not accepted any beat will be destroyed
     * @param {Number} [params.toleranceWndInner=0.04] - the maximum time that a beat can deviate from the predicted beat time without a fork occurring
     * @param {Number} [params.toleranceWndPre=0.15] - the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
     * @param {Number} [params.toleranceWndPost=0.3] - the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
     * @param {Number} [params.correctionFactor=50] - correction factor for updating beat period
     * @param {Number} [params.maxChange=0.2] - the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
     * @param {Number} [params.penaltyFactor=0.5] - factor for correcting score, if onset do not coincide precisely with predicted beat time
     */
    function Agent(tempo, firstBeatTime, firsteventScore, agentList) {
      var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      _classCallCheck(this, Agent);
      /** 
       * the time after which an Agent that has not accepted any beat will be destroyed
       * @type {Number} 
       */


      this.expiryTime = params.expiryTime || 10;
      /** 
       * the maximum time that a beat can deviate from the predicted beat time without a fork occurring
       * @type {Number} 
       */

      this.toleranceWndInner = params.toleranceWndInner || 0.04;
      /** 
       * the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
       * @type {Number} 
       */

      this.toleranceWndPre = params.toleranceWndPre || 0.15;
      /** 
       * the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
       * @type {Number} 
       */

      this.toleranceWndPost = params.toleranceWndPost || 0.3;
      this.toleranceWndPre *= tempo;
      this.toleranceWndPost *= tempo;
      /** 
       * correction factor for updating beat period
       * @type {Number} 
       */

      this.correctionFactor = params.correctionFactor || 50;
      /** 
       * the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
       * @type {Number} 
       */

      this.maxChange = params.maxChange || 0.2;
      /** 
       * factor for correcting score, if onset do not coincide precisely with predicted beat time
       * @type {Number} 
       */

      this.penaltyFactor = params.penaltyFactor || 0.5;
      /** 
       * the current tempo hypothesis of the Agent, expressed as the beat period
       * @type {Number} 
       */

      this.beatInterval = tempo;
      /** 
       * the initial tempo hypothesis of the Agent, expressed as the beat period
       * @type {Number}
       */

      this.initialBeatInterval = tempo;
      /** 
       * the time of the most recent beat accepted by this Agent
       * @type {Number} 
       */

      this.beatTime = firstBeatTime;
      /** 
       * the number of beats found by this Agent, including interpolated beats
       * @type {Number} 
       */

      this.totalBeatCount = 1;
      /** 
       * the array of onsets accepted by this Agent as beats, plus interpolated beats
       * @type {Array} 
       */

      this.events = [firstBeatTime];
      /** 
       * sum of salience values of the onsets which have been interpreted as beats by this Agent
       * @type {Number} 
       */

      this.score = firsteventScore;
      /** 
       * reference to the agent list 
       * @type {Array} 
       */

      this.agentListRef = agentList;
    }
    /**
     * The event time is tested if it is a beat time
     * @param {Number} eventTime - the event time to be tested
     * @param {Number} eventScore - salience values of the event time
     * @return {Boolean} indicate whether the given event time was accepted as a beat time
     */


    _createClass(Agent, [{
      key: "considerEvent",
      value: function considerEvent(eventTime, eventScore) {
        if (eventTime - this.events[this.events.length - 1] > this.expiryTime) {
          this.score = -1;
          return false;
        }

        var beatCount = Math.round((eventTime - this.beatTime) / this.beatInterval);
        var err = eventTime - this.beatTime - beatCount * this.beatInterval;

        if (beatCount > 0 && err >= -this.toleranceWndPre && err <= this.toleranceWndPost) {
          if (Math.abs(err) > this.toleranceWndInner) {
            this.agentListRef.push(this.clone());
          }

          this.acceptEvent(eventTime, eventScore, err, beatCount);
          return true;
        }

        return false;
      }
    }, {
      key: "acceptEvent",
      value: function acceptEvent(eventTime, eventScore, err, beatCount) {
        this.beatTime = eventTime;
        this.events.push(eventTime);
        var corrErr = err / this.correctionFactor;

        if (Math.abs(this.initialBeatInterval - this.beatInterval - corrErr) < this.maxChange * this.initialBeatInterval) {
          this.beatInterval += corrErr;
        }

        this.totalBeatCount += beatCount;
        var errFactor = err > 0 ? err / this.toleranceWndPost : err / -this.toleranceWndPre;
        var scoreFactor = 1 - this.penaltyFactor * errFactor;
        this.score += eventScore * scoreFactor;
      }
    }, {
      key: "fillBeats",
      value: function fillBeats() {
        var prevBeat = void 0,
            nextBeat = void 0,
            currentInterval = void 0,
            beats = void 0;
        prevBeat = 0;

        if (this.events.length > 2) {
          prevBeat = this.events[0];
        }

        for (var i = 0; i < this.events.length; i++) {
          nextBeat = this.events[i];
          beats = Math.round((nextBeat - prevBeat) / this.beatInterval - 0.01);
          currentInterval = (nextBeat - prevBeat) / beats;
          var k = 0;

          for (; beats > 1; beats--) {
            prevBeat += currentInterval;
            this.events.splice(i + k, 0, prevBeat);
            k++;
          }

          prevBeat = nextBeat;
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        var newAgent = new Agent();
        newAgent.beatInterval = this.beatInterval;
        newAgent.initialBeatInterval = this.initialBeatInterval;
        newAgent.beatTime = this.beatTime;
        newAgent.totalBeatCount = this.totalBeatCount;
        newAgent.events = this.events.slice();
        newAgent.expiryTime = this.expiryTime;
        newAgent.toleranceWndInner = this.toleranceWndInner;
        newAgent.toleranceWndPre = this.toleranceWndPre;
        newAgent.toleranceWndPost = this.toleranceWndPost;
        newAgent.correctionFactor = this.correctionFactor;
        newAgent.maxChange = this.maxChange;
        newAgent.penaltyFactor = this.penaltyFactor;
        newAgent.score = this.score;
        newAgent.agentListRef = this.agentListRef;
        return newAgent;
      }
    }]);

    return Agent;
  }();

  exports.default = Agent;
  module.exports = exports["default"];
});

/***/ }),

/***/ "./node_modules/music-tempo/dist/node/BeatTracking.js":
/*!************************************************************!*\
  !*** ./node_modules/music-tempo/dist/node/BeatTracking.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(/*! ./Agent */ "./node_modules/music-tempo/dist/node/Agent.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module, exports, _Agent) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Agent2 = _interopRequireDefault(_Agent);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var BeatTracking = function () {
    function BeatTracking() {
      _classCallCheck(this, BeatTracking);
    }

    _createClass(BeatTracking, null, [{
      key: "trackBeat",
      value: function trackBeat(events, eventsScores, tempoList) {
        var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var initPeriod = params.initPeriod || 5,
            thresholdBI = params.thresholdBI || 0.02,
            thresholdBT = params.thresholdBT || 0.04;

        function removeSimilarAgents() {
          agents.sort(function (a1, a2) {
            return a1.beatInterval - a2.beatInterval;
          });
          var length = agents.length;

          for (var i = 0; i < length; i++) {
            if (agents[i].score < 0) continue;

            for (var _j = i + 1; _j < length; _j++) {
              if (agents[_j].beatInterval - agents[i].beatInterval > thresholdBI) {
                break;
              }

              if (Math.abs(agents[_j].beatTime - agents[i].beatTime) > thresholdBT) {
                continue;
              }

              if (agents[i].score < agents[_j].score) {
                agents[i].score = -1;
              } else {
                agents[_j].score = -1;
              }
            }
          }

          for (var _i = length - 1; _i >= 0; _i--) {
            if (agents[_i].score < 0) {
              agents.splice(_i, 1);
            }
          }
        }

        var agents = [];

        for (var i = 0; i < tempoList.length; i++) {
          agents.push(new _Agent2.default(tempoList[i], events[0], eventsScores[0], agents, params));
        }

        var j = 1;
        removeSimilarAgents();

        while (events[j] < initPeriod) {
          var agentsLength = agents.length;
          var prevBeatInterval = -1;
          var isEventAccepted = true;

          for (var k = 0; k < agentsLength; k++) {
            if (agents[k].beatInterval != prevBeatInterval) {
              if (!isEventAccepted) {
                agents.push(new _Agent2.default(prevBeatInterval, events[j], eventsScores[j], agents, params));
              }

              prevBeatInterval = agents[k].beatInterval;
              isEventAccepted = false;
            }

            isEventAccepted = agents[k].considerEvent(events[j], eventsScores[j]) || isEventAccepted;
          }

          removeSimilarAgents();
          j++;
        }

        var eventsLength = events.length;

        for (var _i2 = j; _i2 < eventsLength; _i2++) {
          var _agentsLength = agents.length;

          for (var _j2 = 0; _j2 < _agentsLength; _j2++) {
            agents[_j2].considerEvent(events[_i2], eventsScores[_i2]);
          }

          removeSimilarAgents();
        }

        return agents;
      }
    }]);

    return BeatTracking;
  }();

  exports.default = BeatTracking;
  module.exports = exports["default"];
});

/***/ }),

/***/ "./node_modules/music-tempo/dist/node/FFT.js":
/*!***************************************************!*\
  !*** ./node_modules/music-tempo/dist/node/FFT.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var FFT = function () {
    function FFT() {
      _classCallCheck(this, FFT);
    }

    _createClass(FFT, null, [{
      key: "getHammingWindow",
      value: function getHammingWindow(bufferSize) {
        var a = 25 / 46;
        var b = 21 / 46;
        var scale = 1 / bufferSize / 0.54;
        var sqrtBufferSize = Math.sqrt(bufferSize);
        var factor = Math.PI * 2 / bufferSize;
        var wnd = [];

        for (var i = 0; i < bufferSize; i++) {
          wnd[i] = sqrtBufferSize * (scale * (a - b * Math.cos(factor * i)));
        }

        return wnd;
      }
    }, {
      key: "getSpectrum",
      value: function getSpectrum(re, im) {
        var direction = -1;
        var n = re.length;
        var bits = Math.round(Math.log(n) / Math.log(2));
        var twoPI = Math.PI * 2;
        if (n != 1 << bits) throw new Error("FFT data must be power of 2");
        var localN = void 0;
        var j = 0;

        for (var i = 0; i < n - 1; i++) {
          if (i < j) {
            var temp = re[j];
            re[j] = re[i];
            re[i] = temp;
            temp = im[j];
            im[j] = im[i];
            im[i] = temp;
          }

          var k = n / 2;

          while (k >= 1 && k - 1 < j) {
            j = j - k;
            k = k / 2;
          }

          j = j + k;
        }

        for (var m = 1; m <= bits; m++) {
          localN = 1 << m;
          var Wjk_r = 1;
          var Wjk_i = 0;
          var theta = twoPI / localN;
          var Wj_r = Math.cos(theta);
          var Wj_i = direction * Math.sin(theta);
          var nby2 = localN / 2;

          for (j = 0; j < nby2; j++) {
            for (var _k = j; _k < n; _k += localN) {
              var id = _k + nby2;
              var tempr = Wjk_r * re[id] - Wjk_i * im[id];
              var tempi = Wjk_r * im[id] + Wjk_i * re[id];
              re[id] = re[_k] - tempr;
              im[id] = im[_k] - tempi;
              re[_k] += tempr;
              im[_k] += tempi;
            }

            var wtemp = Wjk_r;
            Wjk_r = Wj_r * Wjk_r - Wj_i * Wjk_i;
            Wjk_i = Wj_r * Wjk_i + Wj_i * wtemp;
          }
        }

        for (var _i = 0; _i < re.length; _i++) {
          var pow = re[_i] * re[_i] + im[_i] * im[_i]; //im[i] = Math.atan2(im[i], re[i]);

          re[_i] = pow;
        }

        for (var _i2 = 0; _i2 < re.length; _i2++) {
          re[_i2] = Math.sqrt(re[_i2]);
        }
      }
    }]);

    return FFT;
  }();

  exports.default = FFT;
  module.exports = exports["default"];
});

/***/ }),

/***/ "./node_modules/music-tempo/dist/node/MusicTempo.js":
/*!**********************************************************!*\
  !*** ./node_modules/music-tempo/dist/node/MusicTempo.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(/*! ./OnsetDetection */ "./node_modules/music-tempo/dist/node/OnsetDetection.js"), __webpack_require__(/*! ./TempoInduction */ "./node_modules/music-tempo/dist/node/TempoInduction.js"), __webpack_require__(/*! ./BeatTracking */ "./node_modules/music-tempo/dist/node/BeatTracking.js"), __webpack_require__(/*! ./FFT */ "./node_modules/music-tempo/dist/node/FFT.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module, exports, _OnsetDetection, _TempoInduction, _BeatTracking, _FFT) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _OnsetDetection2 = _interopRequireDefault(_OnsetDetection);

  var _TempoInduction2 = _interopRequireDefault(_TempoInduction);

  var _BeatTracking2 = _interopRequireDefault(_BeatTracking);

  var _FFT2 = _interopRequireDefault(_FFT);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var MusicTempo =
  /**
   * Constructor
   * @param {Float32Array} audioData - non-interleaved IEEE 32-bit linear PCM with a nominal range of -1 -> +1 (Web Audio API - Audio Buffer)
   * @param {Object} [params={}] - parameters
   * @param {Number} [params.bufferSize=2048] - FFT windows size
   * @param {Number} [params.hopSize=441] - spacing of audio frames in samples
   * @param {Number} [params.decayRate=0.84] - how quickly previous peaks are forgotten
   * @param {Number} [params.peakFindingWindow=6] - minimum distance between peaks
   * @param {Number} [params.meanWndMultiplier=3] - multiplier for peak finding window
   * @param {Number} [params.peakThreshold=0.35] - minimum value of peaks
   * @param {Number} [params.widthTreshold=0.025] - the maximum difference in IOIs which are in the same cluster
   * @param {Number} [params.maxIOI=2.5] - the maximum IOI for inclusion in a cluster
   * @param {Number} [params.minIOI=0.07] - the minimum IOI for inclusion in a cluster
   * @param {Number} [params.maxTempos=10] - initial amount of tempo hypotheses
   * @param {Number} [params.minBeatInterval=0.3] - the minimum inter-beat interval (IBI) (0.30 seconds == 200 BPM)
   * @param {Number} [params.maxBeatInterval=1] - the maximum inter-beat interval (IBI) (1.00 seconds ==  60 BPM)
   * @param {Number} [params.initPeriod=5] - duration of the initial section
   * @param {Number} [params.thresholdBI=0.02] - for the purpose of removing duplicate agents, the default JND of IBI
   * @param {Number} [params.thresholdBT=0.04] - for the purpose of removing duplicate agents, the default JND of phase
   * @param {Number} [params.expiryTime=10] - the time after which an Agent that has not accepted any beat will be destroyed
   * @param {Number} [params.toleranceWndInner=0.04] - the maximum time that a beat can deviate from the predicted beat time without a fork occurring
   * @param {Number} [params.toleranceWndPre=0.15] - the maximum amount by which a beat can be earlier than the predicted beat time, expressed as a fraction of the beat period
   * @param {Number} [params.toleranceWndPost=0.3] - the maximum amount by which a beat can be later than the predicted beat time, expressed as a fraction of the beat period
   * @param {Number} [params.correctionFactor=50] - correction factor for updating beat period
   * @param {Number} [params.maxChange=0.2] - the maximum allowed deviation from the initial tempo, expressed as a fraction of the initial beat period
   * @param {Number} [params.penaltyFactor=0.5] - factor for correcting score, if onset do not coincide precisely with predicted beat time
   */
  function MusicTempo(audioData) {
    var _this = this;

    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MusicTempo);

    if (audioData instanceof Float32Array) {
      // Production steps of ECMA-262, Edition 6, 22.1.2.1
      if (!Array.from) {
        Array.from = function () {
          var toStr = Object.prototype.toString;

          var isCallable = function isCallable(fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
          };

          var toInteger = function toInteger(value) {
            var number = Number(value);

            if (isNaN(number)) {
              return 0;
            }

            if (number === 0 || !isFinite(number)) {
              return number;
            }

            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
          };

          var maxSafeInteger = Math.pow(2, 53) - 1;

          var toLength = function toLength(value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
          }; // The length property of the from method is 1.


          return function from(arrayLike
          /*, mapFn, thisArg */
          ) {
            // 1. Let C be the this value.
            var C = this; // 2. Let items be ToObject(arrayLike).

            var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

            if (arrayLike == null) {
              throw new TypeError('Array.from requires an array-like object - not null or undefined');
            } // 4. If mapfn is undefined, then let mapping be false.


            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;

            if (typeof mapFn !== 'undefined') {
              // 5. else
              // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
              if (!isCallable(mapFn)) {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
              } // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


              if (arguments.length > 2) {
                T = arguments[2];
              }
            } // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).


            var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method 
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).

            var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

            var k = 0; // 17. Repeat, while k < len… (also steps a - h)

            var kValue;

            while (k < len) {
              kValue = items[k];

              if (mapFn) {
                A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
              } else {
                A[k] = kValue;
              }

              k += 1;
            } // 18. Let putStatus be Put(A, "length", len, true).


            A.length = len; // 20. Return A.

            return A;
          };
        }();
      }

      audioData = Array.from(audioData);
    } else if (!Array.isArray(audioData)) {
      throw "audioData is not an array";
    }

    var timeStep = params.timeStep || 0.01;

    var res = _OnsetDetection2.default.calculateSF(audioData, _FFT2.default, params);
    /** 
     * Spectral flux
     * @type {Array} 
     */


    this.spectralFlux = res;

    _OnsetDetection2.default.normalize(this.spectralFlux);
    /** 
     * Spectral flux peaks indexes
     * @type {Array} 
     */


    this.peaks = _OnsetDetection2.default.findPeaks(this.spectralFlux, params);
    /** 
     * Onsets times array
     * @type {Array} 
     */

    this.events = this.peaks.map(function (a) {
      return a * timeStep;
    });

    var clusters = _TempoInduction2.default.processRhythmicEvents(this.events, params);

    clusters = _TempoInduction2.default.mergeClusters(clusters, params);

    var scores = _TempoInduction2.default.calculateScore(clusters, params);

    clusters = {
      clIntervals: clusters.clIntervals,
      clSizes: clusters.clSizes,
      clScores: scores.clScores,
      clScoresIdxs: scores.clScoresIdxs
    };
    /** 
     * Tempo hypotheses array
     * @type {Array} 
     */

    this.tempoList = _TempoInduction2.default.createTempoList(clusters, params);
    var minSFValue = this.spectralFlux.reduce(function (a, b) {
      return Math.min(a, b);
    });
    var eventsScores = this.peaks.map(function (a) {
      return _this.spectralFlux[a] - minSFValue;
    });
    /** 
     * Agents array
     * @type {Array} 
     */

    this.agents = _BeatTracking2.default.trackBeat(this.events, eventsScores, this.tempoList, params);
    var bestScore = -1;
    var idxBestAgent = -1;
    /** 
     * The tempo value in beats per minute
     * @type {Number} 
     */

    this.tempo = -1;
    /** 
     * Beat times array
     * @type {Array} 
     */

    this.beats = [];
    /** 
     * Inter-beat interval
     * @type {Number} 
     */

    this.beatInterval = -1;

    for (var i = 0; i < this.agents.length; i++) {
      if (this.agents[i].score > bestScore) {
        bestScore = this.agents[i].score;
        idxBestAgent = i;
      }
    }

    if (this.agents[idxBestAgent]) {
      /** 
       * The agent with the highest score
       * @type {Agent} 
       */
      this.bestAgent = this.agents[idxBestAgent];
      this.bestAgent.fillBeats();
      this.tempo = (60 / this.bestAgent.beatInterval).toFixed(3);
      this.beatInterval = this.bestAgent.beatInterval;
      this.beats = this.bestAgent.events;
    }

    if (this.tempo == -1) {
      throw "Tempo extraction failed";
    }
  };

  exports.default = MusicTempo;
  module.exports = exports["default"];
});

/***/ }),

/***/ "./node_modules/music-tempo/dist/node/OnsetDetection.js":
/*!**************************************************************!*\
  !*** ./node_modules/music-tempo/dist/node/OnsetDetection.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var OnsetDetection = function () {
    function OnsetDetection() {
      _classCallCheck(this, OnsetDetection);
    }

    _createClass(OnsetDetection, null, [{
      key: "calculateSF",
      value: function calculateSF(audioData, fft) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (typeof fft == "undefined") {
          throw new ReferenceError("fft is undefined");
        }

        if (typeof fft.getHammingWindow !== "function" || typeof fft.getSpectrum !== "function") {
          throw new ReferenceError("fft doesn't contain getHammingWindow or getSpectrum methods");
        } // Array.fill polyfill


        if (!Array.prototype.fill) {
          Array.prototype.fill = function (value) {
            if (this == null) {
              throw new TypeError('this is null or not defined');
            }

            var O = Object(this);
            var len = O.length >>> 0;
            var start = arguments[1];
            var relativeStart = start >> 0;
            var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
            var end = arguments[2];
            var relativeEnd = end === undefined ? len : end >> 0;
            var final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

            while (k < final) {
              O[k] = value;
              k++;
            }

            return O;
          };
        }

        params.bufferSize = params.bufferSize || 2048; //params.samplingRate = params.samplingRate || 44100;

        params.hopSize = params.hopSize || 441;
        var bufferSize = params.bufferSize,
            hopSize = params.hopSize;
        var k = Math.floor(Math.log(bufferSize) / Math.LN2);

        if (Math.pow(2, k) !== bufferSize) {
          throw "Invalid buffer size (" + bufferSize + "), must be power of 2";
        }

        var hammWindow = fft.getHammingWindow(bufferSize);
        var spectralFlux = [];
        var spectrumLength = bufferSize / 2 + 1;
        var previousSpectrum = new Array(spectrumLength);
        previousSpectrum.fill(0);
        var im = new Array(bufferSize);
        var length = audioData.length;
        var zerosStart = new Array(bufferSize - hopSize);
        zerosStart.fill(0);
        audioData = zerosStart.concat(audioData);
        var zerosEnd = new Array(bufferSize - audioData.length % hopSize);
        zerosEnd.fill(0);
        audioData = audioData.concat(zerosEnd);

        for (var wndStart = 0; wndStart < length; wndStart += hopSize) {
          var wndEnd = wndStart + bufferSize;
          var re = [];
          var _k = 0;

          for (var i = wndStart; i < wndEnd; i++) {
            re[_k] = hammWindow[_k] * audioData[i];
            _k++;
          }

          im.fill(0);
          fft.getSpectrum(re, im);
          var flux = 0;

          for (var j = 0; j < spectrumLength; j++) {
            var value = re[j] - previousSpectrum[j];
            flux += value < 0 ? 0 : value;
          }

          spectralFlux.push(flux);
          previousSpectrum = re;
        }

        return spectralFlux;
      }
    }, {
      key: "normalize",
      value: function normalize(data) {
        if (!Array.isArray(data)) {
          throw "Array expected";
        }

        if (data.length == 0) {
          throw "Array is empty";
        }

        var sum = 0;
        var squareSum = 0;

        for (var i = 0; i < data.length; i++) {
          sum += data[i];
          squareSum += data[i] * data[i];
        }

        var mean = sum / data.length;
        var standardDeviation = Math.sqrt((squareSum - sum * mean) / data.length);
        if (standardDeviation == 0) standardDeviation = 1;

        for (var _i = 0; _i < data.length; _i++) {
          data[_i] = (data[_i] - mean) / standardDeviation;
        }
      }
    }, {
      key: "findPeaks",
      value: function findPeaks(spectralFlux) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var length = spectralFlux.length;
        var sf = spectralFlux;
        var decayRate = params.decayRate || 0.84;
        var peakFindingWindow = params.peakFindingWindow || 6;
        var meanWndMultiplier = params.meanWndMultiplier || 3;
        var peakThreshold = params.peakThreshold || 0.35;
        var max = 0;
        var av = sf[0];
        var peaks = [];

        for (var i = 0; i < length; i++) {
          av = decayRate * av + (1 - decayRate) * sf[i];
          if (sf[i] < av) continue;
          var wndStart = i - peakFindingWindow;
          var wndEnd = i + peakFindingWindow + 1;
          if (wndStart < 0) wndStart = 0;
          if (wndEnd > length) wndEnd = length;
          if (av < sf[i]) av = sf[i];
          var isMax = true;

          for (var j = wndStart; j < wndEnd; j++) {
            if (sf[j] > sf[i]) isMax = false;
          }

          if (isMax) {
            var meanWndStart = i - peakFindingWindow * meanWndMultiplier;
            var meanWndEnd = i + peakFindingWindow;
            if (meanWndStart < 0) meanWndStart = 0;
            if (meanWndEnd > length) meanWndEnd = length;
            var sum = 0;
            var count = meanWndEnd - meanWndStart;

            for (var _j = meanWndStart; _j < meanWndEnd; _j++) {
              sum += sf[_j];
            }

            if (sf[i] > sum / count + peakThreshold) {
              peaks.push(i);
            }
          }
        }

        if (peaks.length < 2) {
          throw "Fail to find peaks";
        }

        return peaks;
      }
    }]);

    return OnsetDetection;
  }();

  exports.default = OnsetDetection;
  module.exports = exports["default"];
});

/***/ }),

/***/ "./node_modules/music-tempo/dist/node/TempoInduction.js":
/*!**************************************************************!*\
  !*** ./node_modules/music-tempo/dist/node/TempoInduction.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var TempoInduction = function () {
    function TempoInduction() {
      _classCallCheck(this, TempoInduction);
    }

    _createClass(TempoInduction, null, [{
      key: "processRhythmicEvents",
      value: function processRhythmicEvents(events) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var widthTreshold = params.widthTreshold || 0.025,
            maxIOI = params.maxIOI || 2.5,
            minIOI = params.minIOI || 0.07,
            length = events.length;
        var clIntervals = [],
            clSizes = [],
            clCount = 0;

        for (var i = 0; i < length - 1; i++) {
          for (var j = i + 1; j < length; j++) {
            var ioi = events[j] - events[i];

            if (ioi < minIOI) {
              continue;
            }

            if (ioi > maxIOI) {
              break;
            }

            var k = 0;

            for (; k < clCount; k++) {
              if (Math.abs(clIntervals[k] - ioi) < widthTreshold) {
                if (Math.abs(clIntervals[k + 1] - ioi) < Math.abs(clIntervals[k] - ioi) && k < clCount - 1) {
                  k++;
                }

                clIntervals[k] = (clIntervals[k] * clSizes[k] + ioi) / (clSizes[k] + 1);
                clSizes[k]++;
                break;
              }
            }

            if (k != clCount) continue;
            clCount++;

            for (; k > 0 && clIntervals[k - 1] > ioi; k--) {
              clIntervals[k] = clIntervals[k - 1];
              clSizes[k] = clSizes[k - 1];
            }

            clIntervals[k] = ioi;
            clSizes[k] = 1;
          }
        }

        if (clCount == 0) {
          throw "Fail to find IOIs";
        }

        clIntervals.length = clCount;
        clSizes.length = clCount;
        return {
          clIntervals: clIntervals,
          clSizes: clSizes
        };
      }
    }, {
      key: "mergeClusters",
      value: function mergeClusters(clusters) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var widthTreshold = params.widthTreshold || 0.025;
        var clIntervals = clusters.clIntervals,
            clSizes = clusters.clSizes;
        var clCount = clIntervals.length;

        for (var i = 0; i < clCount; i++) {
          for (var j = i + 1; j < clCount; j++) {
            if (Math.abs(clIntervals[i] - clIntervals[j]) < widthTreshold) {
              clIntervals[i] = (clIntervals[i] * clSizes[i] + clIntervals[j] * clSizes[j]) / (clSizes[i] + clSizes[j]);
              clSizes[i] = clSizes[i] + clSizes[j];
              --clCount;

              for (var k = j + 1; k <= clCount; k++) {
                clIntervals[k - 1] = clIntervals[k];
                clSizes[k - 1] = clSizes[k];
              }
            }
          }
        }

        clIntervals.length = clCount;
        clSizes.length = clCount;
        return {
          clIntervals: clIntervals,
          clSizes: clSizes
        };
      }
    }, {
      key: "calculateScore",
      value: function calculateScore(clusters) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var widthTreshold = params.widthTreshold || 0.025;
        var maxTempos = params.maxTempos || 10;
        var clIntervals = clusters.clIntervals,
            clSizes = clusters.clSizes,
            clScores = [],
            clScoresIdxs = [];
        var clCount = clIntervals.length;

        for (var i = 0; i < clCount; i++) {
          clScores[i] = 10 * clSizes[i];
          clScoresIdxs[i] = {
            score: clScores[i],
            idx: i
          };
        }

        clScoresIdxs.sort(function (a, b) {
          return b.score - a.score;
        });

        if (clScoresIdxs.length > maxTempos) {
          for (var _i = maxTempos - 1; _i < clScoresIdxs.length - 1; _i++) {
            if (clScoresIdxs[_i].score == clScoresIdxs[_i + 1].score) {
              maxTempos++;
            } else {
              break;
            }
          }

          clScoresIdxs.length = maxTempos;
        }

        clScoresIdxs = clScoresIdxs.map(function (a) {
          return a.idx;
        });

        for (var _i2 = 0; _i2 < clCount; _i2++) {
          for (var j = _i2 + 1; j < clCount; j++) {
            var ratio = clIntervals[_i2] / clIntervals[j];
            var isFraction = ratio < 1;
            var d = void 0,
                err = void 0;
            d = isFraction ? Math.round(1 / ratio) : Math.round(ratio);
            if (d < 2 || d > 8) continue;
            if (isFraction) err = Math.abs(clIntervals[_i2] * d - clIntervals[j]);else err = Math.abs(clIntervals[_i2] - clIntervals[j] * d);
            var errTreshold = isFraction ? widthTreshold : widthTreshold * d;
            if (err >= errTreshold) continue;
            d = d >= 5 ? 1 : 6 - d;
            clScores[_i2] += d * clSizes[j];
            clScores[j] += d * clSizes[_i2];
          }
        }

        return {
          clScores: clScores,
          clScoresIdxs: clScoresIdxs
        };
      }
    }, {
      key: "createTempoList",
      value: function createTempoList(clusters) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var widthTreshold = params.widthTreshold || 0.025,
            minBeatInterval = params.minBeatInterval || 0.3,
            maxBeatInterval = params.maxBeatInterval || 1;
        var clIntervals = clusters.clIntervals,
            clSizes = clusters.clSizes,
            clScores = clusters.clScores,
            clScoresIdxs = clusters.clScoresIdxs,
            tempoList = [];
        var clCount = clIntervals.length;

        for (var i = 0; i < clScoresIdxs.length; i++) {
          var idx = clScoresIdxs[i];
          var newSum = clIntervals[idx] * clScores[idx];
          var newWeight = clScores[idx];
          var err = void 0,
              errTreshold = void 0;

          for (var j = 0; j < clCount; j++) {
            if (j == idx) continue;
            var ratio = clIntervals[idx] / clIntervals[j];
            var isFraction = ratio < 1;
            var sumInc = 0;
            var d = isFraction ? Math.round(1 / ratio) : Math.round(ratio);
            if (d < 2 || d > 8) continue;

            if (isFraction) {
              err = Math.abs(clIntervals[idx] * d - clIntervals[j]);
              errTreshold = widthTreshold;
            } else {
              err = Math.abs(clIntervals[idx] - d * clIntervals[j]);
              errTreshold = widthTreshold * d;
            }

            if (err >= errTreshold) continue;

            if (isFraction) {
              newSum += clIntervals[j] / d * clScores[j];
            } else {
              newSum += clIntervals[j] * d * clScores[j];
            }

            newWeight += clScores[j];
          }

          var beat = newSum / newWeight;

          while (beat < minBeatInterval) {
            beat *= 2;
          }

          while (beat > maxBeatInterval) {
            beat /= 2;
          }

          tempoList.push(beat);
        }

        return tempoList;
      }
    }]);

    return TempoInduction;
  }();

  exports.default = TempoInduction;
  module.exports = exports["default"];
});

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

/***/ }),

/***/ "./node_modules/pako/lib/utils/common.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/utils/common.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TYPED_OK = typeof Uint8Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Int32Array !== 'undefined';

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

exports.assign = function (obj
/*from1, from2, from3, ...*/
) {
  var sources = Array.prototype.slice.call(arguments, 1);

  while (sources.length) {
    var source = sources.shift();

    if (!source) {
      continue;
    }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
}; // reduce buffer size, avoiding mem copy


exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) {
    return buf;
  }

  if (buf.subarray) {
    return buf.subarray(0, size);
  }

  buf.length = size;
  return buf;
};

var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    } // Fallback to ordinary array


    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result; // calculate data length

    len = 0;

    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    } // join chunks


    result = new Uint8Array(len);
    pos = 0;

    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};
var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function (chunks) {
    return [].concat.apply([], chunks);
  }
}; // Enable/Disable typed arrays use, for testing
//

exports.setTyped = function (on) {
  if (on) {
    exports.Buf8 = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8 = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);

/***/ }),

/***/ "./node_modules/pako/lib/zlib/adler32.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/adler32.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function adler32(adler, buf, len, pos) {
  var s1 = adler & 0xffff | 0,
      s2 = adler >>> 16 & 0xffff | 0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = s1 + buf[pos++] | 0;
      s2 = s2 + s1 | 0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return s1 | s2 << 16 | 0;
}

module.exports = adler32;

/***/ }),

/***/ "./node_modules/pako/lib/zlib/constants.js":
/*!*************************************************!*\
  !*** ./node_modules/pako/lib/zlib/constants.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,

  /* The deflate compression method */
  Z_DEFLATED: 8 //Z_NULL:                 null // Use -1 or null inline, depending on var type

};

/***/ }),

/***/ "./node_modules/pako/lib/zlib/crc32.js":
/*!*********************************************!*\
  !*** ./node_modules/pako/lib/zlib/crc32.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
// Use ordinary array, since untyped makes no boost here

function makeTable() {
  var c,
      table = [];

  for (var n = 0; n < 256; n++) {
    c = n;

    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
    }

    table[n] = c;
  }

  return table;
} // Create table on load. Just 255 signed longs. Not a problem.


var crcTable = makeTable();

function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;
  crc ^= -1;

  for (var i = pos; i < end; i++) {
    crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return crc ^ -1; // >>> 0;
}

module.exports = crc32;

/***/ }),

/***/ "./node_modules/pako/lib/zlib/deflate.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/deflate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");

var trees = __webpack_require__(/*! ./trees */ "./node_modules/pako/lib/zlib/trees.js");

var adler32 = __webpack_require__(/*! ./adler32 */ "./node_modules/pako/lib/zlib/adler32.js");

var crc32 = __webpack_require__(/*! ./crc32 */ "./node_modules/pako/lib/zlib/crc32.js");

var msg = __webpack_require__(/*! ./messages */ "./node_modules/pako/lib/zlib/messages.js");
/* Public constants ==========================================================*/

/* ===========================================================================*/

/* Allowed flush values; see deflate() and inflate() below for details */


var Z_NO_FLUSH = 0;
var Z_PARTIAL_FLUSH = 1; //var Z_SYNC_FLUSH    = 2;

var Z_FULL_FLUSH = 3;
var Z_FINISH = 4;
var Z_BLOCK = 5; //var Z_TREES         = 6;

/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */

var Z_OK = 0;
var Z_STREAM_END = 1; //var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;

var Z_STREAM_ERROR = -2;
var Z_DATA_ERROR = -3; //var Z_MEM_ERROR     = -4;

var Z_BUF_ERROR = -5; //var Z_VERSION_ERROR = -6;

/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;

var Z_DEFAULT_COMPRESSION = -1;
var Z_FILTERED = 1;
var Z_HUFFMAN_ONLY = 2;
var Z_RLE = 3;
var Z_FIXED = 4;
var Z_DEFAULT_STRATEGY = 0;
/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT

var Z_UNKNOWN = 2;
/* The deflate compression method */

var Z_DEFLATED = 8;
/*============================================================================*/

var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */

var MAX_WBITS = 15;
/* 32K LZ77 window */

var DEF_MEM_LEVEL = 8;
var LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS = 256;
/* number of literal bytes 0..255 */

var L_CODES = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES = 30;
/* number of distance codes */

var BL_CODES = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
var PRESET_DICT = 0x20;
var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;
var BS_NEED_MORE = 1;
/* block not completed, need more input or more output */

var BS_BLOCK_DONE = 2;
/* block flush performed */

var BS_FINISH_STARTED = 3;
/* finish started, need only more output at next deflate */

var BS_FINISH_DONE = 4;
/* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return (f << 1) - (f > 4 ? 9 : 0);
}

function zero(buf) {
  var len = buf.length;

  while (--len >= 0) {
    buf[len] = 0;
  }
}
/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */


function flush_pending(strm) {
  var s = strm.state; //_tr_flush_bits(s);

  var len = s.pending;

  if (len > strm.avail_out) {
    len = strm.avail_out;
  }

  if (len === 0) {
    return;
  }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;

  if (s.pending === 0) {
    s.pending_out = 0;
  }
}

function flush_block_only(s, last) {
  trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);

  s.block_start = s.strstart;
  flush_pending(s.strm);
}

function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}
/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */


function putShortMSB(s, b) {
  //  put_byte(s, (Byte)(b >> 8));
  //  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = b >>> 8 & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}
/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */


function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) {
    len = size;
  }

  if (len === 0) {
    return 0;
  }

  strm.avail_in -= len; // zmemcpy(buf, strm->next_in, len);

  utils.arraySet(buf, strm.input, strm.next_in, len, start);

  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  } else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;
  return len;
}
/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */


function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;
  /* max hash chain length */

  var scan = s.strstart;
  /* current string */

  var match;
  /* matched string */

  var len;
  /* length of current match */

  var best_len = s.prev_length;
  /* best match length so far */

  var nice_match = s.nice_match;
  /* stop if match long enough */

  var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0
  /*NIL*/
  ;
  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev = s.prev;
  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1 = _win[scan + best_len - 1];
  var scan_end = _win[scan + best_len];
  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */

  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */


  if (nice_match > s.lookahead) {
    nice_match = s.lookahead;
  } // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");


  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;
    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
      continue;
    }
    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */


    scan += 2;
    match++; // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */

    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend); // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");


    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;

      if (len >= nice_match) {
        break;
      }

      scan_end1 = _win[scan + best_len - 1];
      scan_end = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }

  return s.lookahead;
}
/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */


function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str; //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart; // JS ints have 32 bit, block below not needed

    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}

    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */

    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */

      s.block_start -= _w_size;
      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;

      do {
        m = s.head[--p];
        s.head[p] = m >= _w_size ? m - _w_size : 0;
      } while (--n);

      n = _w_size;
      p = n;

      do {
        m = s.prev[--p];
        s.prev[p] = m >= _w_size ? m - _w_size : 0;
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }

    if (s.strm.avail_in === 0) {
      break;
    }
    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");


    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;
    /* Initialize the hash value now that we have some input: */

    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];
      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */

      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask; //#if MIN_MATCH != 3
      //        Call update_hash() MIN_MATCH-3 more times
      //#endif

      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;

        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
  //  if (s.high_water < s.window_size) {
  //    var curr = s.strstart + s.lookahead;
  //    var init = 0;
  //
  //    if (s.high_water < curr) {
  //      /* Previous high water mark below current data -- zero WIN_INIT
  //       * bytes or up to end of window, whichever is less.
  //       */
  //      init = s.window_size - curr;
  //      if (init > WIN_INIT)
  //        init = WIN_INIT;
  //      zmemzero(s->window + curr, (unsigned)init);
  //      s->high_water = curr + init;
  //    }
  //    else if (s->high_water < (ulg)curr + WIN_INIT) {
  //      /* High water mark at or above current data, but below current data
  //       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
  //       * to end of window, whichever is less.
  //       */
  //      init = (ulg)curr + WIN_INIT - s->high_water;
  //      if (init > s->window_size - s->high_water)
  //        init = s->window_size - s->high_water;
  //      zmemzero(s->window + s->high_water, (unsigned)init);
  //      s->high_water += init;
  //    }
  //  }
  //
  //  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
  //    "not enough room for search");

}
/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */


function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }
  /* Copy as much as possible from input to output: */


  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {
      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
      //      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
      //        s.block_start >= s.w_size)) {
      //        throw  new Error("slide too late");
      //      }
      fill_window(s);

      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */

    } //Assert(s->block_start >= 0L, "block gone");
    //    if (s.block_start < 0) throw new Error("block gone");


    s.strstart += s.lookahead;
    s.lookahead = 0;
    /* Emit a stored block if pending_buf will be full: */

    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/

      flush_block_only(s, false);

      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/

    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */


    if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);

      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/

    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);

    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/


    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);

    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/

  }

  return BS_NEED_MORE;
}
/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */


function deflate_fast(s, flush) {
  var hash_head;
  /* head of the hash chain */

  var bflush;
  /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);

      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
        /* flush the current block */
      }
    }
    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */


    hash_head = 0
    /*NIL*/
    ;

    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }
    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */


    if (hash_head !== 0
    /*NIL*/
    && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }

    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
      s.lookahead -= s.match_length;
      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */

      if (s.match_length <= s.max_lazy_match
      /*max_insert_length*/
      && s.lookahead >= MIN_MATCH) {
        s.match_length--;
        /* string at strstart already in table */

        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/

          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/

          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);

        s.strstart++;
      } else {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */

        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask; //#if MIN_MATCH != 3
        //                Call UPDATE_HASH() MIN_MATCH-3 more times
        //#endif

        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));

      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
    }

    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);

      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/

    }
  }

  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);

    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/


    return BS_FINISH_DONE;
  }

  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);

    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/

  }

  return BS_BLOCK_DONE;
}
/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */


function deflate_slow(s, flush) {
  var hash_head;
  /* head of hash chain */

  var bflush;
  /* set if current block must be flushed */

  var max_insert;
  /* Process the input block. */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);

      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */

    }
    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */


    hash_head = 0
    /*NIL*/
    ;

    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }
    /* Find the longest match, discarding those <= prev_length.
     */


    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0
    /*NIL*/
    && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD
    /*MAX_DIST(s)*/
    ) {
        /* To simplify the code, we prevent matches with the string
         * of window index 0 (in particular we have to avoid a match
         * of the string with itself at the start of the input file).
         */
        s.match_length = longest_match(s, hash_head);
        /* longest_match() sets match_start */

        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096
        /*TOO_FAR*/
        )) {
          /* If prev_match is also MIN_MATCH, match_start is garbage
           * but we will ignore the current match anyway.
           */
          s.match_length = MIN_MATCH - 1;
        }
      }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */


    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */
      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/

      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */

      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;

      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);

      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);

        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/

      }
    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));

      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }

      s.strstart++;
      s.lookahead--;

      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  } //Assert (flush != Z_NO_FLUSH, "no flush?");


  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));

    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
    s.match_available = 0;
  }

  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);

    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/


    return BS_FINISH_DONE;
  }

  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);

    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/

  }

  return BS_BLOCK_DONE;
}
/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */


function deflate_rle(s, flush) {
  var bflush;
  /* set if current block must be flushed */

  var prev;
  /* byte at distance one to match */

  var scan, strend;
  /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);

      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */

    }
    /* See how many times the previous byte repeats */


    s.match_length = 0;

    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];

      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;

        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);

        s.match_length = MAX_MATCH - (strend - scan);

        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      } //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");

    }
    /* Emit match if have run of MIN_MATCH or longer, else emit literal */


    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));

      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
    }

    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);

      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/

    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);

    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/


    return BS_FINISH_DONE;
  }

  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);

    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/

  }

  return BS_BLOCK_DONE;
}
/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */


function deflate_huff(s, flush) {
  var bflush;
  /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);

      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }

        break;
        /* flush the current block */
      }
    }
    /* Output a literal byte */


    s.match_length = 0; //Tracevv((stderr,"%c", s->window[s->strstart]));

    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/

    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;

    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);

      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/

    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);

    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/


    return BS_FINISH_DONE;
  }

  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);

    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/

  }

  return BS_BLOCK_DONE;
}
/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */


function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table;
configuration_table = [
/*      good lazy nice chain */
new Config(0, 0, 0, 0, deflate_stored),
/* 0 store only */
new Config(4, 4, 8, 4, deflate_fast),
/* 1 max speed, no lazy matches */
new Config(4, 5, 16, 8, deflate_fast),
/* 2 */
new Config(4, 6, 32, 32, deflate_fast),
/* 3 */
new Config(4, 4, 16, 16, deflate_slow),
/* 4 lazy matches */
new Config(8, 16, 32, 32, deflate_slow),
/* 5 */
new Config(8, 16, 128, 128, deflate_slow),
/* 6 */
new Config(8, 32, 128, 256, deflate_slow),
/* 7 */
new Config(32, 128, 258, 1024, deflate_slow),
/* 8 */
new Config(32, 258, 258, 4096, deflate_slow)
/* 9 max compression */
];
/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */

function lm_init(s) {
  s.window_size = 2 * s.w_size;
  /*** CLEAR_HASH(s); ***/

  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */

  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;
  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}

function DeflateState() {
  this.strm = null;
  /* pointer back to this zlib stream */

  this.status = 0;
  /* as the name implies */

  this.pending_buf = null;
  /* output still pending */

  this.pending_buf_size = 0;
  /* size of pending_buf */

  this.pending_out = 0;
  /* next pending byte to output to the stream */

  this.pending = 0;
  /* nb of bytes in the pending buffer */

  this.wrap = 0;
  /* bit 0 true for zlib, bit 1 true for gzip */

  this.gzhead = null;
  /* gzip header information to write */

  this.gzindex = 0;
  /* where in extra, name, or comment */

  this.method = Z_DEFLATED;
  /* can only be DEFLATED */

  this.last_flush = -1;
  /* value of flush param for previous deflate call */

  this.w_size = 0;
  /* LZ77 window size (32K by default) */

  this.w_bits = 0;
  /* log2(w_size)  (8..16) */

  this.w_mask = 0;
  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;
  /* Heads of the hash chains or NIL. */

  this.ins_h = 0;
  /* hash index of string to be inserted */

  this.hash_size = 0;
  /* number of elements in hash table */

  this.hash_bits = 0;
  /* log2(hash_size) */

  this.hash_mask = 0;
  /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;
  /* length of best match */

  this.prev_match = 0;
  /* previous match */

  this.match_available = 0;
  /* set if previous match exists */

  this.strstart = 0;
  /* start of string to insert */

  this.match_start = 0;
  /* start of matching string */

  this.lookahead = 0;
  /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;

  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;
  /* compression level (1..9) */

  this.strategy = 0;
  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0;
  /* Stop searching when current match exceeds this */

  /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */
  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective

  this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree = new utils.Buf16((2 * D_CODES + 1) * 2);
  this.bl_tree = new utils.Buf16((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);
  this.l_desc = null;
  /* desc. for literal tree */

  this.d_desc = null;
  /* desc. for distance tree */

  this.bl_desc = null;
  /* desc. for bit length tree */
  //ush bl_count[MAX_BITS+1];

  this.bl_count = new utils.Buf16(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */
  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */

  this.heap = new utils.Buf16(2 * L_CODES + 1);
  /* heap used to build the Huffman trees */

  zero(this.heap);
  this.heap_len = 0;
  /* number of elements in the heap */

  this.heap_max = 0;
  /* element of largest frequency */

  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];

  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;
  /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;
  /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;
  /* bit length of current block with optimal trees */

  this.static_len = 0;
  /* bit length of current block with static trees */

  this.matches = 0;
  /* number of string matches in current block */

  this.insert = 0;
  /* bytes at end of window left to insert */

  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */

  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */
  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;

  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}

function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;
  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }

  s.status = s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = s.wrap === 2 ? 0 // crc32(0, Z_NULL, 0)
  : 1; // adler32(0, Z_NULL, 0)

  s.last_flush = Z_NO_FLUSH;

  trees._tr_init(s);

  return Z_OK;
}

function deflateReset(strm) {
  var ret = deflateResetKeep(strm);

  if (ret === Z_OK) {
    lm_init(strm.state);
  }

  return ret;
}

function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }

  if (strm.state.wrap !== 2) {
    return Z_STREAM_ERROR;
  }

  strm.state.gzhead = head;
  return Z_OK;
}

function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) {
    // === Z_NULL
    return Z_STREAM_ERROR;
  }

  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) {
    /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  } else if (windowBits > 15) {
    wrap = 2;
    /* write gzip wrapper instead */

    windowBits -= 16;
  }

  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }

  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */


  var s = new DeflateState();
  strm.state = s;
  s.strm = strm;
  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;
  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size); // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << memLevel + 6;
  /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4; //overlay = (ushf *) ZALLOC(strm, s->lit_bufsize, sizeof(ush)+2);
  //s->pending_buf = (uchf *) overlay;

  s.pending_buf = new utils.Buf8(s.pending_buf_size); // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->d_buf = overlay + s->lit_bufsize/sizeof(ush);

  s.d_buf = 1 * s.lit_bufsize; //s->l_buf = s->pending_buf + (1+sizeof(ush))*s->lit_bufsize;

  s.l_buf = (1 + 2) * s.lit_bufsize;
  s.level = level;
  s.strategy = strategy;
  s.method = method;
  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}

function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
    return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm;
  /* just in case */

  old_flush = s.last_flush;
  s.last_flush = flush;
  /* Write the header */

  if (s.status === INIT_STATE) {
    if (s.wrap === 2) {
      // GZIP header
      strm.adler = 0; //crc32(0L, Z_NULL, 0);

      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);

      if (!s.gzhead) {
        // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      } else {
        put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, s.gzhead.time >> 8 & 0xff);
        put_byte(s, s.gzhead.time >> 16 & 0xff);
        put_byte(s, s.gzhead.time >> 24 & 0xff);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 0xff);

        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, s.gzhead.extra.length >> 8 & 0xff);
        }

        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }

        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    } else // DEFLATE header
      {
        var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
        var level_flags = -1;

        if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
          level_flags = 0;
        } else if (s.level < 6) {
          level_flags = 1;
        } else if (s.level === 6) {
          level_flags = 2;
        } else {
          level_flags = 3;
        }

        header |= level_flags << 6;

        if (s.strstart !== 0) {
          header |= PRESET_DICT;
        }

        header += 31 - header % 31;
        s.status = BUSY_STATE;
        putShortMSB(s, header);
        /* Save the adler32 of the preset dictionary: */

        if (s.strstart !== 0) {
          putShortMSB(s, strm.adler >>> 16);
          putShortMSB(s, strm.adler & 0xffff);
        }

        strm.adler = 1; // adler32(0L, Z_NULL, 0);
      }
  } //#ifdef GZIP


  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra
    /* != Z_NULL*/
    ) {
        beg = s.pending;
        /* start of bytes to update crc */

        while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }

            flush_pending(strm);
            beg = s.pending;

            if (s.pending === s.pending_buf_size) {
              break;
            }
          }

          put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
          s.gzindex++;
        }

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }

        if (s.gzindex === s.gzhead.extra.length) {
          s.gzindex = 0;
          s.status = NAME_STATE;
        }
      } else {
      s.status = NAME_STATE;
    }
  }

  if (s.status === NAME_STATE) {
    if (s.gzhead.name
    /* != Z_NULL*/
    ) {
        beg = s.pending;
        /* start of bytes to update crc */
        //int val;

        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }

            flush_pending(strm);
            beg = s.pending;

            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          } // JS specific: little magic to add zero terminator to end of string


          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }

          put_byte(s, val);
        } while (val !== 0);

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }

        if (val === 0) {
          s.gzindex = 0;
          s.status = COMMENT_STATE;
        }
      } else {
      s.status = COMMENT_STATE;
    }
  }

  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment
    /* != Z_NULL*/
    ) {
        beg = s.pending;
        /* start of bytes to update crc */
        //int val;

        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
            }

            flush_pending(strm);
            beg = s.pending;

            if (s.pending === s.pending_buf_size) {
              val = 1;
              break;
            }
          } // JS specific: little magic to add zero terminator to end of string


          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
          } else {
            val = 0;
          }

          put_byte(s, val);
        } while (val !== 0);

        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }

        if (val === 0) {
          s.status = HCRC_STATE;
        }
      } else {
      s.status = HCRC_STATE;
    }
  }

  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }

      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, strm.adler >> 8 & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);

        s.status = BUSY_STATE;
      }
    } else {
      s.status = BUSY_STATE;
    }
  } //#endif

  /* Flush as much pending output as possible */


  if (s.pending !== 0) {
    flush_pending(strm);

    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }
    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */

  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }
  /* User must not provide more input after the first FINISH: */


  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }
  /* Start a new block or continue the current one.
   */


  if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }

    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }

      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }

    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      } else if (flush !== Z_BLOCK) {
        /* FULL_FLUSH or SYNC_FLUSH */
        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */


        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/

          /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }

      flush_pending(strm);

      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR at next call, see above */

        return Z_OK;
      }
    }
  } //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}


  if (flush !== Z_FINISH) {
    return Z_OK;
  }

  if (s.wrap <= 0) {
    return Z_STREAM_END;
  }
  /* Write the trailer */


  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, strm.adler >> 8 & 0xff);
    put_byte(s, strm.adler >> 16 & 0xff);
    put_byte(s, strm.adler >> 24 & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, strm.total_in >> 8 & 0xff);
    put_byte(s, strm.total_in >> 16 & 0xff);
    put_byte(s, strm.total_in >> 24 & 0xff);
  } else {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */

  if (s.wrap > 0) {
    s.wrap = -s.wrap;
  }
  /* write the trailer only once! */


  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm
  /*== Z_NULL*/
  || !strm.state
  /*== Z_NULL*/
  ) {
      return Z_STREAM_ERROR;
    }

  status = strm.state.status;

  if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;
  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}
/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */


function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;
  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;

  if (!strm
  /*== Z_NULL*/
  || !strm.state
  /*== Z_NULL*/
  ) {
      return Z_STREAM_ERROR;
    }

  s = strm.state;
  wrap = s.wrap;

  if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
    return Z_STREAM_ERROR;
  }
  /* when using zlib wrappers, compute Adler-32 for provided dictionary */


  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;
  /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */

  if (dictLength >= s.w_size) {
    if (wrap === 0) {
      /* already empty otherwise */

      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);

      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);


    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */


  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);

  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);

    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
      s.prev[str & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = str;
      str++;
    } while (--n);

    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }

  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}

exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';
/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/

/***/ }),

/***/ "./node_modules/pako/lib/zlib/inffast.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/inffast.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.
// See state defs from inflate.js

var BAD = 30;
/* got a data error -- remain here until reset */

var TYPE = 12;
/* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */

module.exports = function inflate_fast(strm, start) {
  var state;

  var _in;
  /* local strm.input */


  var last;
  /* have enough input while in < last */

  var _out;
  /* local strm.output */


  var beg;
  /* inflate()'s initial strm.output */

  var end;
  /* while out < end, enough space available */
  //#ifdef INFLATE_STRICT

  var dmax;
  /* maximum distance from zlib header */
  //#endif

  var wsize;
  /* window size or zero if not using window */

  var whave;
  /* valid bytes in the window */

  var wnext;
  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools

  var s_window;
  /* allocated sliding window, if wsize != 0 */

  var hold;
  /* local strm.hold */

  var bits;
  /* local strm.bits */

  var lcode;
  /* local strm.lencode */

  var dcode;
  /* local strm.distcode */

  var lmask;
  /* mask for first level of length codes */

  var dmask;
  /* mask for first level of distance codes */

  var here;
  /* retrieved table entry */

  var op;
  /* code bits, operation, extra bits, or */

  /*  window position, window bytes to copy */

  var len;
  /* match length, unused bytes */

  var dist;
  /* match distance */

  var from;
  /* where to copy match from */

  var from_source;
  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */

  state = strm.state; //here = state.here;

  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257); //#ifdef INFLATE_STRICT

  dmax = state.dmax; //#endif

  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;
  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top: do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen: for (;;) {
      // Goto emulation
      op = here >>> 24
      /*here.bits*/
      ;
      hold >>>= op;
      bits -= op;
      op = here >>> 16 & 0xff
      /*here.op*/
      ;

      if (op === 0) {
        /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff
        /*here.val*/
        ;
      } else if (op & 16) {
        /* length base */
        len = here & 0xffff
        /*here.val*/
        ;
        op &= 15;
        /* number of extra bits */

        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }

          len += hold & (1 << op) - 1;
          hold >>>= op;
          bits -= op;
        } //Tracevv((stderr, "inflate:         length %u\n", len));


        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }

        here = dcode[hold & dmask];

        dodist: for (;;) {
          // goto emulation
          op = here >>> 24
          /*here.bits*/
          ;
          hold >>>= op;
          bits -= op;
          op = here >>> 16 & 0xff
          /*here.op*/
          ;

          if (op & 16) {
            /* distance base */
            dist = here & 0xffff
            /*here.val*/
            ;
            op &= 15;
            /* number of extra bits */

            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;

              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }

            dist += hold & (1 << op) - 1; //#ifdef INFLATE_STRICT

            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            } //#endif


            hold >>>= op;
            bits -= op; //Tracevv((stderr, "inflate:         distance %u\n", dist));

            op = _out - beg;
            /* max distance in output */

            if (dist > op) {
              /* see if copy from window */
              op = dist - op;
              /* distance back in window */

              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                } // (!) This block is disabled in zlib defaults,
                // don't enable it for binary compatibility
                //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
                //                if (len <= op - whave) {
                //                  do {
                //                    output[_out++] = 0;
                //                  } while (--len);
                //                  continue top;
                //                }
                //                len -= op - whave;
                //                do {
                //                  output[_out++] = 0;
                //                } while (--op > whave);
                //                if (op === 0) {
                //                  from = _out - dist;
                //                  do {
                //                    output[_out++] = output[from++];
                //                  } while (--len);
                //                  continue top;
                //                }
                //#endif

              }

              from = 0; // window index

              from_source = s_window;

              if (wnext === 0) {
                /* very common case */
                from += wsize - op;

                if (op < len) {
                  /* some from window */
                  len -= op;

                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);

                  from = _out - dist;
                  /* rest from output */

                  from_source = output;
                }
              } else if (wnext < op) {
                /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;

                if (op < len) {
                  /* some from end of window */
                  len -= op;

                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);

                  from = 0;

                  if (wnext < len) {
                    /* some from start of window */
                    op = wnext;
                    len -= op;

                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);

                    from = _out - dist;
                    /* rest from output */

                    from_source = output;
                  }
                }
              } else {
                /* contiguous in window */
                from += wnext - op;

                if (op < len) {
                  /* some from window */
                  len -= op;

                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);

                  from = _out - dist;
                  /* rest from output */

                  from_source = output;
                }
              }

              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }

              if (len) {
                output[_out++] = from_source[from++];

                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            } else {
              from = _out - dist;
              /* copy direct from output */

              do {
                /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);

              if (len) {
                output[_out++] = output[from++];

                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          } else if ((op & 64) === 0) {
            /* 2nd level distance code */
            here = dcode[(here & 0xffff) + (
            /*here.val*/
            hold & (1 << op) - 1)];
            continue dodist;
          } else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      } else if ((op & 64) === 0) {
        /* 2nd level length code */
        here = lcode[(here & 0xffff) + (
        /*here.val*/
        hold & (1 << op) - 1)];
        continue dolen;
      } else if (op & 32) {
        /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      } else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);
  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */


  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;
  /* update state and return */

  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
  strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  return;
};

/***/ }),

/***/ "./node_modules/pako/lib/zlib/inflate.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/inflate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");

var adler32 = __webpack_require__(/*! ./adler32 */ "./node_modules/pako/lib/zlib/adler32.js");

var crc32 = __webpack_require__(/*! ./crc32 */ "./node_modules/pako/lib/zlib/crc32.js");

var inflate_fast = __webpack_require__(/*! ./inffast */ "./node_modules/pako/lib/zlib/inffast.js");

var inflate_table = __webpack_require__(/*! ./inftrees */ "./node_modules/pako/lib/zlib/inftrees.js");

var CODES = 0;
var LENS = 1;
var DISTS = 2;
/* Public constants ==========================================================*/

/* ===========================================================================*/

/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;

var Z_FINISH = 4;
var Z_BLOCK = 5;
var Z_TREES = 6;
/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */

var Z_OK = 0;
var Z_STREAM_END = 1;
var Z_NEED_DICT = 2; //var Z_ERRNO         = -1;

var Z_STREAM_ERROR = -2;
var Z_DATA_ERROR = -3;
var Z_MEM_ERROR = -4;
var Z_BUF_ERROR = -5; //var Z_VERSION_ERROR = -6;

/* The deflate compression method */

var Z_DEFLATED = 8;
/* STATES ====================================================================*/

/* ===========================================================================*/

var HEAD = 1;
/* i: waiting for magic header */

var FLAGS = 2;
/* i: waiting for method and flags (gzip) */

var TIME = 3;
/* i: waiting for modification time (gzip) */

var OS = 4;
/* i: waiting for extra flags and operating system (gzip) */

var EXLEN = 5;
/* i: waiting for extra length (gzip) */

var EXTRA = 6;
/* i: waiting for extra bytes (gzip) */

var NAME = 7;
/* i: waiting for end of file name (gzip) */

var COMMENT = 8;
/* i: waiting for end of comment (gzip) */

var HCRC = 9;
/* i: waiting for header crc (gzip) */

var DICTID = 10;
/* i: waiting for dictionary check value */

var DICT = 11;
/* waiting for inflateSetDictionary() call */

var TYPE = 12;
/* i: waiting for type bits, including last-flag bit */

var TYPEDO = 13;
/* i: same, but skip check to exit inflate on new block */

var STORED = 14;
/* i: waiting for stored size (length and complement) */

var COPY_ = 15;
/* i/o: same as COPY below, but only first time in */

var COPY = 16;
/* i/o: waiting for input or output to copy stored block */

var TABLE = 17;
/* i: waiting for dynamic block table lengths */

var LENLENS = 18;
/* i: waiting for code length code lengths */

var CODELENS = 19;
/* i: waiting for length/lit and distance code lengths */

var LEN_ = 20;
/* i: same as LEN below, but only first time in */

var LEN = 21;
/* i: waiting for length/lit/eob code */

var LENEXT = 22;
/* i: waiting for length extra bits */

var DIST = 23;
/* i: waiting for distance code */

var DISTEXT = 24;
/* i: waiting for distance extra bits */

var MATCH = 25;
/* o: waiting for output space to copy string */

var LIT = 26;
/* o: waiting for output space to write literal */

var CHECK = 27;
/* i: waiting for 32-bit check value */

var LENGTH = 28;
/* i: waiting for 32-bit length (gzip) */

var DONE = 29;
/* finished check, done -- remain here until reset */

var BAD = 30;
/* got a data error -- remain here until reset */

var MEM = 31;
/* got an inflate() memory error -- remain here until reset */

var SYNC = 32;
/* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/

var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592; //var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */

var DEF_WBITS = MAX_WBITS;

function zswap32(q) {
  return (q >>> 24 & 0xff) + (q >>> 8 & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);
}

function InflateState() {
  this.mode = 0;
  /* current inflate mode */

  this.last = false;
  /* true if processing last block */

  this.wrap = 0;
  /* bit 0 true for zlib, bit 1 true for gzip */

  this.havedict = false;
  /* true if dictionary provided */

  this.flags = 0;
  /* gzip header method and flags (0 if zlib) */

  this.dmax = 0;
  /* zlib header max distance (INFLATE_STRICT) */

  this.check = 0;
  /* protected copy of check value */

  this.total = 0;
  /* protected copy of output count */
  // TODO: may be {}

  this.head = null;
  /* where to save gzip header information */

  /* sliding window */

  this.wbits = 0;
  /* log base 2 of requested window size */

  this.wsize = 0;
  /* window size or zero if not using window */

  this.whave = 0;
  /* valid bytes in the window */

  this.wnext = 0;
  /* window write index */

  this.window = null;
  /* allocated sliding window, if needed */

  /* bit accumulator */

  this.hold = 0;
  /* input bit accumulator */

  this.bits = 0;
  /* number of bits in "in" */

  /* for string and stored block copying */

  this.length = 0;
  /* literal or length of data to copy */

  this.offset = 0;
  /* distance back to copy string from */

  /* for table and code decoding */

  this.extra = 0;
  /* extra bits needed */

  /* fixed and dynamic code tables */

  this.lencode = null;
  /* starting table for length/literal codes */

  this.distcode = null;
  /* starting table for distance codes */

  this.lenbits = 0;
  /* index bits for lencode */

  this.distbits = 0;
  /* index bits for distcode */

  /* dynamic table building */

  this.ncode = 0;
  /* number of code length code lengths */

  this.nlen = 0;
  /* number of length code lengths */

  this.ndist = 0;
  /* number of distance code lengths */

  this.have = 0;
  /* number of code lengths in lens[] */

  this.next = null;
  /* next available space in codes[] */

  this.lens = new utils.Buf16(320);
  /* temporary storage for code lengths */

  this.work = new utils.Buf16(288);
  /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */

  this.lendyn = null;
  /* dynamic table for length/literal codes (JS specific) */

  this.distdyn = null;
  /* dynamic table for distance codes (JS specific) */

  this.sane = 0;
  /* if false, allow invalid distance too far */

  this.back = 0;
  /* bits back of last unprocessed length/lit */

  this.was = 0;
  /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = '';
  /*Z_NULL*/

  if (state.wrap) {
    /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }

  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null
  /*Z_NULL*/
  ;
  state.hold = 0;
  state.bits = 0; //state.lencode = state.distcode = state.next = state.codes;

  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
  state.sane = 1;
  state.back = -1; //Tracev((stderr, "inflate: reset\n"));

  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;
  /* get the state */

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  /* extract wrap request from windowBits parameter */

  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 1;

    if (windowBits < 48) {
      windowBits &= 15;
    }
  }
  /* set number of window bits, free window if different */


  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }

  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }
  /* update state and reset the rest of it */


  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) {
    return Z_STREAM_ERROR;
  } //strm.msg = Z_NULL;                 /* in case we return an error */


  state = new InflateState(); //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));

  strm.state = state;
  state.window = null
  /*Z_NULL*/
  ;
  ret = inflateReset2(strm, windowBits);

  if (ret !== Z_OK) {
    strm.state = null
    /*Z_NULL*/
    ;
  }

  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}
/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */


var virgin = true;
var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;
    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);
    /* literal/length table */

    sym = 0;

    while (sym < 144) {
      state.lens[sym++] = 8;
    }

    while (sym < 256) {
      state.lens[sym++] = 9;
    }

    while (sym < 280) {
      state.lens[sym++] = 7;
    }

    while (sym < 288) {
      state.lens[sym++] = 8;
    }

    inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, {
      bits: 9
    });
    /* distance table */

    sym = 0;

    while (sym < 32) {
      state.lens[sym++] = 5;
    }

    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, {
      bits: 5
    });
    /* do this just once */

    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}
/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */


function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;
  /* if it hasn't been done already, allocate space for the window */

  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;
    state.window = new utils.Buf8(state.wsize);
  }
  /* copy state->wsize or less output bytes into the circular window */


  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;

    if (dist > copy) {
      dist = copy;
    } //zmemcpy(state->window + state->wnext, end - copy, dist);


    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;

    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;

      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }

      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }

  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output; // input/output buffers

  var next;
  /* next input INDEX */

  var put;
  /* next output INDEX */

  var have, left;
  /* available input and output */

  var hold;
  /* bit buffer */

  var bits;
  /* bits in bit buffer */

  var _in, _out;
  /* save starting available input and output */


  var copy;
  /* number of stored or match bytes to copy */

  var from;
  /* where to copy match bytes from */

  var from_source;
  var here = 0;
  /* current decoding table entry */

  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */

  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)

  var len;
  /* length to copy for repeats, bits to drop */

  var ret;
  /* return code */

  var hbuf = new utils.Buf8(4);
  /* buffer for gzip header crc calculation */

  var opts;
  var n; // temporary var for NEED_BITS

  var order =
  /* permutation of code lengths */
  [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;

  if (state.mode === TYPE) {
    state.mode = TYPEDO;
  }
  /* skip check */
  //--- LOAD() ---


  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits; //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        } //=== NEEDBITS(16);


        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        if (state.wrap & 2 && hold === 0x8b1f) {
          /* gzip header */
          state.check = 0
          /*crc32(0L, Z_NULL, 0)*/
          ; //=== CRC2(state.check, hold);

          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0); //===//
          //=== INITBITS();

          hold = 0;
          bits = 0; //===//

          state.mode = FLAGS;
          break;
        }

        state.flags = 0;
        /* expect zlib header */

        if (state.head) {
          state.head.done = false;
        }

        if (!(state.wrap & 1) ||
        /* check if zlib header allowed */
        (((hold & 0xff) <<
        /*BITS(8)*/
        8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }

        if ((hold & 0x0f) !==
        /*BITS(4)*/
        Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        } //--- DROPBITS(4) ---//


        hold >>>= 4;
        bits -= 4; //---//

        len = (hold & 0x0f) +
        /*BITS(4)*/
        8;

        if (state.wbits === 0) {
          state.wbits = len;
        } else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        state.dmax = 1 << len; //Tracev((stderr, "inflate:   zlib header ok\n"));

        strm.adler = state.check = 1
        /*adler32(0L, Z_NULL, 0)*/
        ;
        state.mode = hold & 0x200 ? DICTID : TYPE; //=== INITBITS();

        hold = 0;
        bits = 0; //===//

        break;

      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        state.flags = hold;

        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }

        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }

        if (state.head) {
          state.head.text = hold >> 8 & 1;
        }

        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0); //===//
        } //=== INITBITS();


        hold = 0;
        bits = 0; //===//

        state.mode = TIME;

      /* falls through */

      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        if (state.head) {
          state.head.time = hold;
        }

        if (state.flags & 0x0200) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          hbuf[2] = hold >>> 16 & 0xff;
          hbuf[3] = hold >>> 24 & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0); //===
        } //=== INITBITS();


        hold = 0;
        bits = 0; //===//

        state.mode = OS;

      /* falls through */

      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        if (state.head) {
          state.head.xflags = hold & 0xff;
          state.head.os = hold >> 8;
        }

        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = hold >>> 8 & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0); //===//
        } //=== INITBITS();


        hold = 0;
        bits = 0; //===//

        state.mode = EXLEN;

      /* falls through */

      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8;
          } //===//


          state.length = hold;

          if (state.head) {
            state.head.extra_len = hold;
          }

          if (state.flags & 0x0200) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = hold >>> 8 & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0); //===//
          } //=== INITBITS();


          hold = 0;
          bits = 0; //===//
        } else if (state.head) {
          state.head.extra = null
          /*Z_NULL*/
          ;
        }

        state.mode = EXTRA;

      /* falls through */

      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;

          if (copy > have) {
            copy = have;
          }

          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;

              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Array(state.head.extra_len);
              }

              utils.arraySet(state.head.extra, input, next, // extra field is limited to 65536 bytes
              // - no need for additional size check
              copy,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              len); //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }

            if (state.flags & 0x0200) {
              state.check = crc32(state.check, input, copy, next);
            }

            have -= copy;
            next += copy;
            state.length -= copy;
          }

          if (state.length) {
            break inf_leave;
          }
        }

        state.length = 0;
        state.mode = NAME;

      /* falls through */

      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) {
            break inf_leave;
          }

          copy = 0;

          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */

            if (state.head && len && state.length < 65536
            /*state.head.name_max*/
            ) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }

          have -= copy;
          next += copy;

          if (len) {
            break inf_leave;
          }
        } else if (state.head) {
          state.head.name = null;
        }

        state.length = 0;
        state.mode = COMMENT;

      /* falls through */

      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) {
            break inf_leave;
          }

          copy = 0;

          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */

            if (state.head && len && state.length < 65536
            /*state.head.comm_max*/
            ) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }

          have -= copy;
          next += copy;

          if (len) {
            break inf_leave;
          }
        } else if (state.head) {
          state.head.comment = null;
        }

        state.mode = HCRC;

      /* falls through */

      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8;
          } //===//


          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          } //=== INITBITS();


          hold = 0;
          bits = 0; //===//
        }

        if (state.head) {
          state.head.hcrc = state.flags >> 9 & 1;
          state.head.done = true;
        }

        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;

      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        strm.adler = state.check = zswap32(hold); //=== INITBITS();

        hold = 0;
        bits = 0; //===//

        state.mode = DICT;

      /* falls through */

      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits; //---

          return Z_NEED_DICT;
        }

        strm.adler = state.check = 1
        /*adler32(0L, Z_NULL, 0)*/
        ;
        state.mode = TYPE;

      /* falls through */

      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) {
          break inf_leave;
        }

      /* falls through */

      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7; //---//

          state.mode = CHECK;
          break;
        } //=== NEEDBITS(3); */


        while (bits < 3) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        state.last = hold & 0x01
        /*BITS(1)*/
        ; //--- DROPBITS(1) ---//

        hold >>>= 1;
        bits -= 1; //---//

        switch (hold & 0x03) {
          /*BITS(2)*/
          case 0:
            /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;

          case 1:
            /* fixed block */
            fixedtables(state); //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));

            state.mode = LEN_;
            /* decode codes */

            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2; //---//

              break inf_leave;
            }

            break;

          case 2:
            /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;

          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        } //--- DROPBITS(2) ---//


        hold >>>= 2;
        bits -= 2; //---//

        break;

      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7; //---//
        //=== NEEDBITS(32); */

        while (bits < 32) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        if ((hold & 0xffff) !== (hold >>> 16 ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }

        state.length = hold & 0xffff; //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();

        hold = 0;
        bits = 0; //===//

        state.mode = COPY_;

        if (flush === Z_TREES) {
          break inf_leave;
        }

      /* falls through */

      case COPY_:
        state.mode = COPY;

      /* falls through */

      case COPY:
        copy = state.length;

        if (copy) {
          if (copy > have) {
            copy = have;
          }

          if (copy > left) {
            copy = left;
          }

          if (copy === 0) {
            break inf_leave;
          } //--- zmemcpy(put, next, copy); ---


          utils.arraySet(output, input, next, copy, put); //---//

          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        } //Tracev((stderr, "inflate:       stored end\n"));


        state.mode = TYPE;
        break;

      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8;
        } //===//


        state.nlen = (hold & 0x1f) +
        /*BITS(5)*/
        257; //--- DROPBITS(5) ---//

        hold >>>= 5;
        bits -= 5; //---//

        state.ndist = (hold & 0x1f) +
        /*BITS(5)*/
        1; //--- DROPBITS(5) ---//

        hold >>>= 5;
        bits -= 5; //---//

        state.ncode = (hold & 0x0f) +
        /*BITS(4)*/
        4; //--- DROPBITS(4) ---//

        hold >>>= 4;
        bits -= 4; //---//
        //#ifndef PKZIP_BUG_WORKAROUND

        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        } //#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));


        state.have = 0;
        state.mode = LENLENS;

      /* falls through */

      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8;
          } //===//


          state.lens[order[state.have++]] = hold & 0x07; //BITS(3);
          //--- DROPBITS(3) ---//

          hold >>>= 3;
          bits -= 3; //---//
        }

        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        } // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table


        state.lencode = state.lendyn;
        state.lenbits = 7;
        opts = {
          bits: state.lenbits
        };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        } //Tracev((stderr, "inflate:       code lengths ok\n"));


        state.have = 0;
        state.mode = CODELENS;

      /* falls through */

      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            /*BITS(state.lenbits)*/

            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;

            if (here_bits <= bits) {
              break;
            } //--- PULLBYTE() ---//


            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8; //---//
          }

          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits; //---//

            state.lens[state.have++] = here_val;
          } else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;

              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }

                have--;
                hold += input[next++] << bits;
                bits += 8;
              } //===//
              //--- DROPBITS(here.bits) ---//


              hold >>>= here_bits;
              bits -= here_bits; //---//

              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }

              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03); //BITS(2);
              //--- DROPBITS(2) ---//

              hold >>>= 2;
              bits -= 2; //---//
            } else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;

              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }

                have--;
                hold += input[next++] << bits;
                bits += 8;
              } //===//
              //--- DROPBITS(here.bits) ---//


              hold >>>= here_bits;
              bits -= here_bits; //---//

              len = 0;
              copy = 3 + (hold & 0x07); //BITS(3);
              //--- DROPBITS(3) ---//

              hold >>>= 3;
              bits -= 3; //---//
            } else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;

              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }

                have--;
                hold += input[next++] << bits;
                bits += 8;
              } //===//
              //--- DROPBITS(here.bits) ---//


              hold >>>= here_bits;
              bits -= here_bits; //---//

              len = 0;
              copy = 11 + (hold & 0x7f); //BITS(7);
              //--- DROPBITS(7) ---//

              hold >>>= 7;
              bits -= 7; //---//
            }

            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }

            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }
        /* handle error breaks in while */


        if (state.mode === BAD) {
          break;
        }
        /* check for end-of-block code (better have one) */


        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }
        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */


        state.lenbits = 9;
        opts = {
          bits: state.lenbits
        };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts); // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;

        state.lenbits = opts.bits; // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6; //state.distcode.copy(state.codes);
        // Switch to use dynamic table

        state.distcode = state.distdyn;
        opts = {
          bits: state.distbits
        };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts); // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;

        state.distbits = opts.bits; // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        } //Tracev((stderr, 'inflate:       codes ok\n'));


        state.mode = LEN_;

        if (flush === Z_TREES) {
          break inf_leave;
        }

      /* falls through */

      case LEN_:
        state.mode = LEN;

      /* falls through */

      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits; //---

          inflate_fast(strm, _out); //--- LOAD() ---

          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits; //---

          if (state.mode === TYPE) {
            state.back = -1;
          }

          break;
        }

        state.back = 0;

        for (;;) {
          here = state.lencode[hold & (1 << state.lenbits) - 1];
          /*BITS(state.lenbits)*/

          here_bits = here >>> 24;
          here_op = here >>> 16 & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) {
            break;
          } //--- PULLBYTE() ---//


          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8; //---//
        }

        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;

          for (;;) {
            here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >>
            /*BITS(last.bits + last.op)*/
            last_bits)];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;

            if (last_bits + here_bits <= bits) {
              break;
            } //--- PULLBYTE() ---//


            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8; //---//
          } //--- DROPBITS(last.bits) ---//


          hold >>>= last_bits;
          bits -= last_bits; //---//

          state.back += last_bits;
        } //--- DROPBITS(here.bits) ---//


        hold >>>= here_bits;
        bits -= here_bits; //---//

        state.back += here_bits;
        state.length = here_val;

        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }

        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }

        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }

        state.extra = here_op & 15;
        state.mode = LENEXT;

      /* falls through */

      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;

          while (bits < n) {
            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8;
          } //===//


          state.length += hold & (1 << state.extra) - 1
          /*BITS(state.extra)*/
          ; //--- DROPBITS(state.extra) ---//

          hold >>>= state.extra;
          bits -= state.extra; //---//

          state.back += state.extra;
        } //Tracevv((stderr, "inflate:         length %u\n", state.length));


        state.was = state.length;
        state.mode = DIST;

      /* falls through */

      case DIST:
        for (;;) {
          here = state.distcode[hold & (1 << state.distbits) - 1];
          /*BITS(state.distbits)*/

          here_bits = here >>> 24;
          here_op = here >>> 16 & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) {
            break;
          } //--- PULLBYTE() ---//


          if (have === 0) {
            break inf_leave;
          }

          have--;
          hold += input[next++] << bits;
          bits += 8; //---//
        }

        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;

          for (;;) {
            here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >>
            /*BITS(last.bits + last.op)*/
            last_bits)];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 0xff;
            here_val = here & 0xffff;

            if (last_bits + here_bits <= bits) {
              break;
            } //--- PULLBYTE() ---//


            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8; //---//
          } //--- DROPBITS(last.bits) ---//


          hold >>>= last_bits;
          bits -= last_bits; //---//

          state.back += last_bits;
        } //--- DROPBITS(here.bits) ---//


        hold >>>= here_bits;
        bits -= here_bits; //---//

        state.back += here_bits;

        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }

        state.offset = here_val;
        state.extra = here_op & 15;
        state.mode = DISTEXT;

      /* falls through */

      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;

          while (bits < n) {
            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8;
          } //===//


          state.offset += hold & (1 << state.extra) - 1
          /*BITS(state.extra)*/
          ; //--- DROPBITS(state.extra) ---//

          hold >>>= state.extra;
          bits -= state.extra; //---//

          state.back += state.extra;
        } //#ifdef INFLATE_STRICT


        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        } //#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));


        state.mode = MATCH;

      /* falls through */

      case MATCH:
        if (left === 0) {
          break inf_leave;
        }

        copy = _out - left;

        if (state.offset > copy) {
          /* copy from window */
          copy = state.offset - copy;

          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            } // (!) This block is disabled in zlib defaults,
            // don't enable it for binary compatibility
            //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
            //          Trace((stderr, "inflate.c too far\n"));
            //          copy -= state.whave;
            //          if (copy > state.length) { copy = state.length; }
            //          if (copy > left) { copy = left; }
            //          left -= copy;
            //          state.length -= copy;
            //          do {
            //            output[put++] = 0;
            //          } while (--copy);
            //          if (state.length === 0) { state.mode = LEN; }
            //          break;
            //#endif

          }

          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          } else {
            from = state.wnext - copy;
          }

          if (copy > state.length) {
            copy = state.length;
          }

          from_source = state.window;
        } else {
          /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }

        if (copy > left) {
          copy = left;
        }

        left -= copy;
        state.length -= copy;

        do {
          output[put++] = from_source[from++];
        } while (--copy);

        if (state.length === 0) {
          state.mode = LEN;
        }

        break;

      case LIT:
        if (left === 0) {
          break inf_leave;
        }

        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;

      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }

            have--; // Use '|' instead of '+' to make sure that result is signed

            hold |= input[next++] << bits;
            bits += 8;
          } //===//


          _out -= left;
          strm.total_out += _out;
          state.total += _out;

          if (_out) {
            strm.adler = state.check =
            /*UPDATE(state.check, put - _out, _out);*/
            state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
          }

          _out = left; // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too

          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          } //=== INITBITS();


          hold = 0;
          bits = 0; //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }

        state.mode = LENGTH;

      /* falls through */

      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }

            have--;
            hold += input[next++] << bits;
            bits += 8;
          } //===//


          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          } //=== INITBITS();


          hold = 0;
          bits = 0; //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }

        state.mode = DONE;

      /* falls through */

      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;

      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;

      case MEM:
        return Z_MEM_ERROR;

      case SYNC:
      /* falls through */

      default:
        return Z_STREAM_ERROR;
    }
  } // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */
  //--- RESTORE() ---


  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits; //---

  if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH)) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }

  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;

  if (state.wrap && _out) {
    strm.adler = state.check =
    /*UPDATE(state.check, strm.next_out - _out, _out);*/
    state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
  }

  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);

  if ((_in === 0 && _out === 0 || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }

  return ret;
}

function inflateEnd(strm) {
  if (!strm || !strm.state
  /*|| strm->zfree == (free_func)0*/
  ) {
      return Z_STREAM_ERROR;
    }

  var state = strm.state;

  if (state.window) {
    state.window = null;
  }

  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;
  /* check state */

  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;

  if ((state.wrap & 2) === 0) {
    return Z_STREAM_ERROR;
  }
  /* save header structure */


  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;
  var state;
  var dictid;
  var ret;
  /* check state */

  if (!strm
  /* == Z_NULL */
  || !strm.state
  /* == Z_NULL */
  ) {
      return Z_STREAM_ERROR;
    }

  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }
  /* check for correct dictionary identifier */


  if (state.mode === DICT) {
    dictid = 1;
    /* adler32(0, null, 0)*/

    /* dictid = adler32(dictid, dictionary, dictLength); */

    dictid = adler32(dictid, dictionary, dictLength, 0);

    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */


  ret = updatewindow(strm, dictionary, dictLength, dictLength);

  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }

  state.havedict = 1; // Tracev((stderr, "inflate:   dictionary set\n"));

  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';
/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/

/***/ }),

/***/ "./node_modules/pako/lib/zlib/inftrees.js":
/*!************************************************!*\
  !*** ./node_modules/pako/lib/zlib/inftrees.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var utils = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592; //var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;
var lbase = [
/* Length codes 257..285 base */
3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
var lext = [
/* Length codes 257..285 extra */
16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78];
var dbase = [
/* Distance codes 0..29 base */
1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0];
var dext = [
/* Distance codes 0..29 extra */
16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
  var bits = opts.bits; //here = opts.here; /* table entry for duplication */

  var len = 0;
  /* a code's length in bits */

  var sym = 0;
  /* index of code symbols */

  var min = 0,
      max = 0;
  /* minimum and maximum code lengths */

  var root = 0;
  /* number of index bits for root table */

  var curr = 0;
  /* number of index bits for current table */

  var drop = 0;
  /* code bits to drop for sub-table */

  var left = 0;
  /* number of prefix codes available */

  var used = 0;
  /* code entries in table used */

  var huff = 0;
  /* Huffman code */

  var incr;
  /* for incrementing code, index */

  var fill;
  /* index for replicating entries */

  var low;
  /* low bits for current root entry */

  var mask;
  /* mask for low root bits */

  var next;
  /* next available space in table */

  var base = null;
  /* base value table to use */

  var base_index = 0; //  var shoextra;    /* extra bits table to use */

  var end;
  /* use base and extra for symbol > end */

  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */

  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */

  var extra = null;
  var extra_index = 0;
  var here_bits, here_op, here_val;
  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.
    This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.
    The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.
    The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */

  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }

  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }
  /* bound code lengths, force root to be within code lengths */


  root = bits;

  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break;
    }
  }

  if (root > max) {
    root = max;
  }

  if (max === 0) {
    /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0; //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;

    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    opts.bits = 1;
    return 0;
    /* no symbols, but wait for decoding to report error */
  }

  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break;
    }
  }

  if (root < min) {
    root = min;
  }
  /* check for an over-subscribed or incomplete set of lengths */


  left = 1;

  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];

    if (left < 0) {
      return -1;
    }
    /* over-subscribed */

  }

  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;
    /* incomplete set */
  }
  /* generate offsets into symbol table for each length for sorting */


  offs[1] = 0;

  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }
  /* sort symbols by length, by symbol order within each length */


  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }
  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.
    root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.
    When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.
    used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.
    sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8


  if (type === CODES) {
    base = extra = work;
    /* dummy value--not used */

    end = 19;
  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;
  } else {
    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }
  /* initialize opts for loop */


  huff = 0;
  /* starting code */

  sym = 0;
  /* starting code symbol */

  len = min;
  /* starting code length */

  next = table_index;
  /* current table to fill in */

  curr = root;
  /* current table index bits */

  drop = 0;
  /* current bits to drop from code for index */

  low = -1;
  /* trigger new sub-table when len > root */

  used = 1 << root;
  /* use root table entries */

  mask = used - 1;
  /* mask for comparing low */

  /* check available table space */

  if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
    return 1;
  }
  /* process all codes and make table entries */


  for (;;) {
    /* create table entry */
    here_bits = len - drop;

    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    } else {
      here_op = 32 + 64;
      /* end of block */

      here_val = 0;
    }
    /* replicate for those indices with low len bits equal to huff */


    incr = 1 << len - drop;
    fill = 1 << curr;
    min = fill;
    /* save offset to next table */

    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
    } while (fill !== 0);
    /* backwards increment the len-bit code huff */


    incr = 1 << len - 1;

    while (huff & incr) {
      incr >>= 1;
    }

    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }
    /* go to next symbol, update count, len */


    sym++;

    if (--count[len] === 0) {
      if (len === max) {
        break;
      }

      len = lens[lens_index + work[sym]];
    }
    /* create new sub-table if needed */


    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }
      /* increment past last table */


      next += min;
      /* here min is 1 << curr */

      /* determine length of next table */

      curr = len - drop;
      left = 1 << curr;

      while (curr + drop < max) {
        left -= count[curr + drop];

        if (left <= 0) {
          break;
        }

        curr++;
        left <<= 1;
      }
      /* check for enough space */


      used += 1 << curr;

      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      /* point entry in root table to sub-table */


      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/

      table[low] = root << 24 | curr << 16 | next - table_index | 0;
    }
  }
  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */


  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = len - drop << 24 | 64 << 16 | 0;
  }
  /* set return parameters */
  //opts.table_index += used;


  opts.bits = root;
  return 0;
};

/***/ }),

/***/ "./node_modules/pako/lib/zlib/messages.js":
/*!************************************************!*\
  !*** ./node_modules/pako/lib/zlib/messages.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {
  2: 'need dictionary',

  /* Z_NEED_DICT       2  */
  1: 'stream end',

  /* Z_STREAM_END      1  */
  0: '',

  /* Z_OK              0  */
  '-1': 'file error',

  /* Z_ERRNO         (-1) */
  '-2': 'stream error',

  /* Z_STREAM_ERROR  (-2) */
  '-3': 'data error',

  /* Z_DATA_ERROR    (-3) */
  '-4': 'insufficient memory',

  /* Z_MEM_ERROR     (-4) */
  '-5': 'buffer error',

  /* Z_BUF_ERROR     (-5) */
  '-6': 'incompatible version'
  /* Z_VERSION_ERROR (-6) */

};

/***/ }),

/***/ "./node_modules/pako/lib/zlib/trees.js":
/*!*********************************************!*\
  !*** ./node_modules/pako/lib/zlib/trees.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

var utils = __webpack_require__(/*! ../utils/common */ "./node_modules/pako/lib/utils/common.js");
/* Public constants ==========================================================*/

/* ===========================================================================*/
//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;


var Z_FIXED = 4; //var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */

var Z_BINARY = 0;
var Z_TEXT = 1; //var Z_ASCII             = 1; // = Z_TEXT

var Z_UNKNOWN = 2;
/*============================================================================*/

function zero(buf) {
  var len = buf.length;

  while (--len >= 0) {
    buf[len] = 0;
  }
} // From zutil.h


var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
/* The three kinds of block type */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
/* The minimum and maximum match lengths */
// From deflate.h

/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS = 256;
/* number of literal bytes 0..255 */

var L_CODES = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES = 30;
/* number of distance codes */

var BL_CODES = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE = 2 * L_CODES + 1;
/* maximum heap size */

var MAX_BITS = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size = 16;
/* size of bit buffer in bi_buf */

/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK = 256;
/* end of block literal code */

var REP_3_6 = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10 = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */

var extra_lbits =
/* extra bits for each length code */
[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
var extra_dbits =
/* extra bits for each distance code */
[0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
var extra_blbits =
/* extra bits for each bit length code */
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */
// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512;
/* see definition of array dist_code below */
// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1

var static_ltree = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code = new Array(DIST_CODE_LEN);

zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);

zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */

function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
  this.static_tree = static_tree;
  /* static tree or NULL */

  this.extra_bits = extra_bits;
  /* extra bits for each code or NULL */

  this.extra_base = extra_base;
  /* base index for extra_bits */

  this.elems = elems;
  /* max number of elements in the tree */

  this.max_length = max_length;
  /* max bit length for the codes */
  // show if `static_tree` has data or dummy - needed for monomorphic objects

  this.has_stree = static_tree && static_tree.length;
}

var static_l_desc;
var static_d_desc;
var static_bl_desc;

function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;
  /* the dynamic tree */

  this.max_code = 0;
  /* largest code with non zero frequency */

  this.stat_desc = stat_desc;
  /* the corresponding static tree */
}

function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}
/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */


function put_short(s, w) {
  //    put_byte(s, (uch)((w) & 0xff));
  //    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = w & 0xff;
  s.pending_buf[s.pending++] = w >>> 8 & 0xff;
}
/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */


function send_bits(s, value, length) {
  if (s.bi_valid > Buf_size - length) {
    s.bi_buf |= value << s.bi_valid & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> Buf_size - s.bi_valid;
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= value << s.bi_valid & 0xffff;
    s.bi_valid += length;
  }
}

function send_code(s, c, tree) {
  send_bits(s, tree[c * 2]
  /*.Code*/
  , tree[c * 2 + 1]
  /*.Len*/
  );
}
/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */


function bi_reverse(code, len) {
  var res = 0;

  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);

  return res >>> 1;
}
/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */


function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;
  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}
/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */


function gen_bitlen(s, desc) //    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree = desc.dyn_tree;
  var max_code = desc.max_code;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var extra = desc.stat_desc.extra_bits;
  var base = desc.stat_desc.extra_base;
  var max_length = desc.stat_desc.max_length;
  var h;
  /* heap index */

  var n, m;
  /* iterate over the tree elements */

  var bits;
  /* bit length */

  var xbits;
  /* extra bits */

  var f;
  /* frequency */

  var overflow = 0;
  /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }
  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */


  tree[s.heap[s.heap_max] * 2 + 1]
  /*.Len*/
  = 0;
  /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]
    /*.Dad*/
    * 2 + 1]
    /*.Len*/
    + 1;

    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }

    tree[n * 2 + 1]
    /*.Len*/
    = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) {
      continue;
    }
    /* not a leaf node */


    s.bl_count[bits]++;
    xbits = 0;

    if (n >= base) {
      xbits = extra[n - base];
    }

    f = tree[n * 2]
    /*.Freq*/
    ;
    s.opt_len += f * (bits + xbits);

    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]
      /*.Len*/
      + xbits);
    }
  }

  if (overflow === 0) {
    return;
  } // Trace((stderr,"\nbit length overflow\n"));

  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */


  do {
    bits = max_length - 1;

    while (s.bl_count[bits] === 0) {
      bits--;
    }

    s.bl_count[bits]--;
    /* move one leaf down the tree */

    s.bl_count[bits + 1] += 2;
    /* move one overflow item as its brother */

    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */

    overflow -= 2;
  } while (overflow > 0);
  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */


  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];

    while (n !== 0) {
      m = s.heap[--h];

      if (m > max_code) {
        continue;
      }

      if (tree[m * 2 + 1]
      /*.Len*/
      !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]
        /*.Len*/
        ) * tree[m * 2]
        /*.Freq*/
        ;
        tree[m * 2 + 1]
        /*.Len*/
        = bits;
      }

      n--;
    }
  }
}
/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */


function gen_codes(tree, max_code, bl_count) //    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS + 1);
  /* next code value for each bit length */

  var code = 0;
  /* running code value */

  var bits;
  /* bit index */

  var n;
  /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */

  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = code + bl_count[bits - 1] << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));


  for (n = 0; n <= max_code; n++) {
    var len = tree[n * 2 + 1]
    /*.Len*/
    ;

    if (len === 0) {
      continue;
    }
    /* Now reverse the bits */


    tree[n * 2]
    /*.Code*/
    = bi_reverse(next_code[len]++, len); //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}
/* ===========================================================================
 * Initialize the various 'constant' tables.
 */


function tr_static_init() {
  var n;
  /* iterates over tree elements */

  var bits;
  /* bit counter */

  var length;
  /* length value */

  var code;
  /* code value */

  var dist;
  /* distance index */

  var bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */
  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */

  /*#ifdef NO_INIT_GLOBAL_POINTERS
    static_l_desc.static_tree = static_ltree;
    static_l_desc.extra_bits = extra_lbits;
    static_d_desc.static_tree = static_dtree;
    static_d_desc.extra_bits = extra_dbits;
    static_bl_desc.extra_bits = extra_blbits;
  #endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */

  length = 0;

  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;

    for (n = 0; n < 1 << extra_lbits[code]; n++) {
      _length_code[length++] = code;
    }
  } //Assert (length == 256, "tr_static_init: length != 256");

  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */


  _length_code[length - 1] = code;
  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */

  dist = 0;

  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;

    for (n = 0; n < 1 << extra_dbits[code]; n++) {
      _dist_code[dist++] = code;
    }
  } //Assert (dist == 256, "tr_static_init: dist != 256");


  dist >>= 7;
  /* from now on, all distances are divided by 128 */

  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;

    for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
      _dist_code[256 + dist++] = code;
    }
  } //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */


  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;

  while (n <= 143) {
    static_ltree[n * 2 + 1]
    /*.Len*/
    = 8;
    n++;
    bl_count[8]++;
  }

  while (n <= 255) {
    static_ltree[n * 2 + 1]
    /*.Len*/
    = 9;
    n++;
    bl_count[9]++;
  }

  while (n <= 279) {
    static_ltree[n * 2 + 1]
    /*.Len*/
    = 7;
    n++;
    bl_count[7]++;
  }

  while (n <= 287) {
    static_ltree[n * 2 + 1]
    /*.Len*/
    = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */


  gen_codes(static_ltree, L_CODES + 1, bl_count);
  /* The static distance tree is trivial: */

  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]
    /*.Len*/
    = 5;
    static_dtree[n * 2]
    /*.Code*/
    = bi_reverse(n, 5);
  } // Now data ready and we can init static trees


  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS); //static_init_done = true;
}
/* ===========================================================================
 * Initialize a new block.
 */


function init_block(s) {
  var n;
  /* iterates over tree elements */

  /* Initialize the trees. */

  for (n = 0; n < L_CODES; n++) {
    s.dyn_ltree[n * 2]
    /*.Freq*/
    = 0;
  }

  for (n = 0; n < D_CODES; n++) {
    s.dyn_dtree[n * 2]
    /*.Freq*/
    = 0;
  }

  for (n = 0; n < BL_CODES; n++) {
    s.bl_tree[n * 2]
    /*.Freq*/
    = 0;
  }

  s.dyn_ltree[END_BLOCK * 2]
  /*.Freq*/
  = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}
/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */


function bi_windup(s) {
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }

  s.bi_buf = 0;
  s.bi_valid = 0;
}
/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */


function copy_block(s, buf, len, header) //DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);
  /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  } //  while (len--) {
  //    put_byte(s, *buf++);
  //  }


  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}
/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */


function smaller(tree, n, m, depth) {
  var _n2 = n * 2;

  var _m2 = m * 2;

  return tree[_n2]
  /*.Freq*/
  < tree[_m2]
  /*.Freq*/
  || tree[_n2]
  /*.Freq*/
  === tree[_m2]
  /*.Freq*/
  && depth[n] <= depth[m];
}
/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */


function pqdownheap(s, tree, k) //    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;
  /* left son of k */

  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */


    if (smaller(tree, v, s.heap[j], s.depth)) {
      break;
    }
    /* Exchange v with the smallest son */


    s.heap[k] = s.heap[j];
    k = j;
    /* And continue down the tree, setting j to the left son of k */

    j <<= 1;
  }

  s.heap[k] = v;
} // inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */


function compress_block(s, ltree, dtree) //    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;
  /* distance of matched string */

  var lc;
  /* match length or unmatched char (if dist == 0) */

  var lx = 0;
  /* running index in l_buf */

  var code;
  /* the code to send */

  var extra;
  /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree);
        /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree);
        /* send the length code */

        extra = extra_lbits[code];

        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);
          /* send the extra length bits */
        }

        dist--;
        /* dist is now the match distance - 1 */

        code = d_code(dist); //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);
        /* send the distance code */

        extra = extra_dbits[code];

        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);
          /* send the extra distance bits */
        }
      }
      /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}
/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */


function build_tree(s, desc) //    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree = desc.dyn_tree;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems = desc.stat_desc.elems;
  var n, m;
  /* iterate over heap elements */

  var max_code = -1;
  /* largest code with non zero frequency */

  var node;
  /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */

  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]
    /*.Freq*/
    !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;
    } else {
      tree[n * 2 + 1]
      /*.Len*/
      = 0;
    }
  }
  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */


  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
    tree[node * 2]
    /*.Freq*/
    = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]
      /*.Len*/
      ;
    }
    /* node is 0 or 1 so it does not have extra bits */

  }

  desc.max_code = max_code;
  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */

  for (n = s.heap_len >> 1
  /*int /2*/
  ; n >= 1; n--) {
    pqdownheap(s, tree, n);
  }
  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */


  node = elems;
  /* next internal node of the tree */

  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */

    /*** pqremove ***/
    n = s.heap[1
    /*SMALLEST*/
    ];
    s.heap[1
    /*SMALLEST*/
    ] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1
    /*SMALLEST*/
    );
    /***/

    m = s.heap[1
    /*SMALLEST*/
    ];
    /* m = node of next least frequency */

    s.heap[--s.heap_max] = n;
    /* keep the nodes sorted by frequency */

    s.heap[--s.heap_max] = m;
    /* Create a new node father of n and m */

    tree[node * 2]
    /*.Freq*/
    = tree[n * 2]
    /*.Freq*/
    + tree[m * 2]
    /*.Freq*/
    ;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]
    /*.Dad*/
    = tree[m * 2 + 1]
    /*.Dad*/
    = node;
    /* and insert the new node in the heap */

    s.heap[1
    /*SMALLEST*/
    ] = node++;
    pqdownheap(s, tree, 1
    /*SMALLEST*/
    );
  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1
  /*SMALLEST*/
  ];
  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */

  gen_bitlen(s, desc);
  /* The field len is now set, we can generate the bit codes */

  gen_codes(tree, max_code, s.bl_count);
}
/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */


function scan_tree(s, tree, max_code) //    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;
  /* iterates over all tree elements */

  var prevlen = -1;
  /* last emitted length */

  var curlen;
  /* length of current code */

  var nextlen = tree[0 * 2 + 1]
  /*.Len*/
  ;
  /* length of next code */

  var count = 0;
  /* repeat count of the current code */

  var max_count = 7;
  /* max repeat count */

  var min_count = 4;
  /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  tree[(max_code + 1) * 2 + 1]
  /*.Len*/
  = 0xffff;
  /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]
    /*.Len*/
    ;

    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      s.bl_tree[curlen * 2]
      /*.Freq*/
      += count;
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        s.bl_tree[curlen * 2] /*.Freq*/++;
      }

      s.bl_tree[REP_3_6 * 2] /*.Freq*/++;
    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2] /*.Freq*/++;
    } else {
      s.bl_tree[REPZ_11_138 * 2] /*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}
/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */


function send_tree(s, tree, max_code) //    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;
  /* iterates over all tree elements */

  var prevlen = -1;
  /* last emitted length */

  var curlen;
  /* length of current code */

  var nextlen = tree[0 * 2 + 1]
  /*.Len*/
  ;
  /* length of next code */

  var count = 0;
  /* repeat count of the current code */

  var max_count = 7;
  /* max repeat count */

  var min_count = 4;
  /* min repeat count */

  /* tree[max_code+1].Len = -1; */

  /* guard already set */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]
    /*.Len*/
    ;

    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      do {
        send_code(s, curlen, s.bl_tree);
      } while (--count !== 0);
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      } //Assert(count >= 3 && count <= 6, " 3_6?");


      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);
    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);
    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}
/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */


function build_bl_tree(s) {
  var max_blindex;
  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */

  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
  /* Build the bit length tree: */

  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */

  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]
    /*.Len*/
    !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */


  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4; //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}
/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */


function send_all_trees(s, lcodes, dcodes, blcodes) //    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;
  /* index in bl_order */
  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));

  send_bits(s, lcodes - 257, 5);
  /* not +255 as stated in appnote.txt */

  send_bits(s, dcodes - 1, 5);
  send_bits(s, blcodes - 4, 4);
  /* not -3 as stated in appnote.txt */

  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]
    /*.Len*/
    , 3);
  } //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));


  send_tree(s, s.dyn_ltree, lcodes - 1);
  /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1);
  /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}
/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */


function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;
  /* Check for non-textual ("black-listed") bytes. */

  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if (black_mask & 1 && s.dyn_ltree[n * 2]
    /*.Freq*/
    !== 0) {
      return Z_BINARY;
    }
  }
  /* Check for textual ("white-listed") bytes. */


  if (s.dyn_ltree[9 * 2]
  /*.Freq*/
  !== 0 || s.dyn_ltree[10 * 2]
  /*.Freq*/
  !== 0 || s.dyn_ltree[13 * 2]
  /*.Freq*/
  !== 0) {
    return Z_TEXT;
  }

  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]
    /*.Freq*/
    !== 0) {
      return Z_TEXT;
    }
  }
  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */


  return Z_BINARY;
}

var static_init_done = false;
/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */

function _tr_init(s) {
  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
  s.bi_buf = 0;
  s.bi_valid = 0;
  /* Initialize the first block of the first file: */

  init_block(s);
}
/* ===========================================================================
 * Send a stored block
 */


function _tr_stored_block(s, buf, stored_len, last) //DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
  /* send block type */

  copy_block(s, buf, stored_len, true);
  /* with header */
}
/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */


function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}
/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */


function _tr_flush_block(s, buf, stored_len, last) //DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;
  /* opt_len and static_len in bytes */

  var max_blindex = 0;
  /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */

  if (s.level > 0) {
    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }
    /* Construct the literal and distance trees */


    build_tree(s, s.l_desc); // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc); // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */

    max_blindex = build_bl_tree(s);
    /* Determine the best encoding. Compute the block lengths in bytes. */

    opt_lenb = s.opt_len + 3 + 7 >>> 3;
    static_lenb = s.static_len + 3 + 7 >>> 3; // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) {
      opt_lenb = static_lenb;
    }
  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5;
    /* force a stored block */
  }

  if (stored_len + 4 <= opt_lenb && buf !== -1) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);
  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);
  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  } // Assert (s->compressed_len == s->bits_sent, "bad compressed size");

  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */


  init_block(s);

  if (last) {
    bi_windup(s);
  } // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));

}
/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */


function _tr_tally(s, dist, lc) //    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;
  s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;
  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2] /*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */

    dist--;
    /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2] /*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2] /*.Freq*/++;
  } // (!) This block is disabled in zlib defaults,
  // don't enable it for binary compatibility
  //#ifdef TRUNCATE_BLOCK
  //  /* Try to guess if it is profitable to stop the current block here */
  //  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
  //    /* Compute an upper bound for the compressed length */
  //    out_length = s.last_lit*8;
  //    in_length = s.strstart - s.block_start;
  //
  //    for (dcode = 0; dcode < D_CODES; dcode++) {
  //      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
  //    }
  //    out_length >>>= 3;
  //    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
  //    //       s->last_lit, in_length, out_length,
  //    //       100L - out_length*100L/in_length));
  //    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
  //      return true;
  //    }
  //  }
  //#endif


  return s.last_lit === s.lit_bufsize - 1;
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;

/***/ }),

/***/ "./node_modules/pako/lib/zlib/zstream.js":
/*!***********************************************!*\
  !*** ./node_modules/pako/lib/zlib/zstream.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers

  this.next_in = 0;
  /* number of bytes available at input */

  this.avail_in = 0;
  /* total number of input bytes read so far */

  this.total_in = 0;
  /* next output byte should be put there */

  this.output = null; // JS specific, because we have no pointers

  this.next_out = 0;
  /* remaining free space at output */

  this.avail_out = 0;
  /* total number of bytes output so far */

  this.total_out = 0;
  /* last error message, NULL if no error */

  this.msg = ''
  /*Z_NULL*/
  ;
  /* not visible by applications */

  this.state = null;
  /* best guess about the data type: binary or text */

  this.data_type = 2
  /*Z_UNKNOWN*/
  ;
  /* adler32 value of the uncompressed data */

  this.adler = 0;
}

module.exports = ZStream;

/***/ }),

/***/ "./node_modules/process-nextick-args/index.js":
/*!****************************************************!*\
  !*** ./node_modules/process-nextick-args/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (typeof process === 'undefined' || !process.version || process.version.indexOf('v0.') === 0 || process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = {
    nextTick: nextTick
  };
} else {
  module.exports = process;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }

  var len = arguments.length;
  var args, i;

  switch (len) {
    case 0:
    case 1:
      return process.nextTick(fn);

    case 2:
      return process.nextTick(function afterTickOne() {
        fn.call(null, arg1);
      });

    case 3:
      return process.nextTick(function afterTickTwo() {
        fn.call(null, arg1, arg2);
      });

    case 4:
      return process.nextTick(function afterTickThree() {
        fn.call(null, arg1, arg2, arg3);
      });

    default:
      args = new Array(len - 1);
      i = 0;

      while (i < args.length) {
        args[i++] = arguments[i];
      }

      return process.nextTick(function afterTick() {
        fn.apply(null, args);
      });
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),

/***/ "./node_modules/readable-stream/duplex-browser.js":
/*!********************************************************!*\
  !*** ./node_modules/readable-stream/duplex-browser.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/_stream_duplex.js */ "./node_modules/readable-stream/lib/_stream_duplex.js");

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_duplex.js":
/*!************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_duplex.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

/*<replacement>*/

var pna = __webpack_require__(/*! process-nextick-args */ "./node_modules/process-nextick-args/index.js");
/*</replacement>*/

/*<replacement>*/


var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


module.exports = Duplex;
/*<replacement>*/

var util = Object.create(__webpack_require__(/*! core-util-is */ "./node_modules/core-util-is/lib/util.js"));
util.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/*</replacement>*/

var Readable = __webpack_require__(/*! ./_stream_readable */ "./node_modules/readable-stream/lib/_stream_readable.js");

var Writable = __webpack_require__(/*! ./_stream_writable */ "./node_modules/readable-stream/lib/_stream_writable.js");

util.inherits(Duplex, Readable);
{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  if (options && options.readable === false) this.readable = false;
  if (options && options.writable === false) this.writable = false;
  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
}); // the no-half-open enforcer

function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();
  pna.nextTick(cb, err);
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_passthrough.js":
/*!*****************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_passthrough.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.


module.exports = PassThrough;

var Transform = __webpack_require__(/*! ./_stream_transform */ "./node_modules/readable-stream/lib/_stream_transform.js");
/*<replacement>*/


var util = Object.create(__webpack_require__(/*! core-util-is */ "./node_modules/core-util-is/lib/util.js"));
util.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_readable.js":
/*!**************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_readable.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*<replacement>*/

var pna = __webpack_require__(/*! process-nextick-args */ "./node_modules/process-nextick-args/index.js");
/*</replacement>*/


module.exports = Readable;
/*<replacement>*/

var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js");
/*</replacement>*/

/*<replacement>*/


var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = __webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/


var Stream = __webpack_require__(/*! ./internal/streams/stream */ "./node_modules/readable-stream/lib/internal/streams/stream-browser.js");
/*</replacement>*/

/*<replacement>*/


var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/readable-stream/node_modules/safe-buffer/index.js").Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/

/*<replacement>*/


var util = Object.create(__webpack_require__(/*! core-util-is */ "./node_modules/core-util-is/lib/util.js"));
util.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/*</replacement>*/

/*<replacement>*/

var debugUtil = __webpack_require__(/*! util */ 0);

var debug = void 0;

if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/


var BufferList = __webpack_require__(/*! ./internal/streams/BufferList */ "./node_modules/readable-stream/lib/internal/streams/BufferList.js");

var destroyImpl = __webpack_require__(/*! ./internal/streams/destroy */ "./node_modules/readable-stream/lib/internal/streams/destroy.js");

var StringDecoder;
util.inherits(Readable, Stream);
var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  var isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm; // cast to ints.

  this.highWaterMark = Math.floor(this.highWaterMark); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(/*! string_decoder/ */ "./node_modules/string_decoder/lib/string_decoder.js").StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
  if (!(this instanceof Readable)) return new Readable(options);
  this._readableState = new ReadableState(options, this); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;

Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  return er;
} // if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.


function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(/*! string_decoder/ */ "./node_modules/string_decoder/lib/string_decoder.js").StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
}; // Don't raise the hwm > 8MB


var MAX_HWM = 0x800000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true; // emit 'readable' now to make sure it gets picked up.

  emitReadable(stream);
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;

  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;else len = state.length;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  } // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.


  var increasedAwaitDrain = false;
  src.on('data', ondata);

  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);

    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;

    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;

      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }

  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);

  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {}
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList; // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }
  return ret;
} // Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function fromListPartial(n, list, hasStrings) {
  var ret;

  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }

  return ret;
} // Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;

  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;

    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
} // Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.


function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;

  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;

    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }

      break;
    }

    ++c;
  }

  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState; // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.

  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_transform.js":
/*!***************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_transform.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.


module.exports = Transform;

var Duplex = __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
/*<replacement>*/


var util = Object.create(__webpack_require__(/*! core-util-is */ "./node_modules/core-util-is/lib/util.js"));
util.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  Duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);

    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');
  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');
  return stream.push(null);
}

/***/ }),

/***/ "./node_modules/readable-stream/lib/_stream_writable.js":
/*!**************************************************************!*\
  !*** ./node_modules/readable-stream/lib/_stream_writable.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

/*<replacement>*/

var pna = __webpack_require__(/*! process-nextick-args */ "./node_modules/process-nextick-args/index.js");
/*</replacement>*/


module.exports = Writable;
/* <replacement> */

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
} // It seems a linked list but it is not
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/

var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;
/*<replacement>*/

var util = Object.create(__webpack_require__(/*! core-util-is */ "./node_modules/core-util-is/lib/util.js"));
util.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/*</replacement>*/

/*<replacement>*/

var internalUtil = {
  deprecate: __webpack_require__(/*! util-deprecate */ "./node_modules/util-deprecate/browser.js")
};
/*</replacement>*/

/*<replacement>*/

var Stream = __webpack_require__(/*! ./internal/streams/stream */ "./node_modules/readable-stream/lib/internal/streams/stream-browser.js");
/*</replacement>*/

/*<replacement>*/


var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/readable-stream/node_modules/safe-buffer/index.js").Buffer;

var OurUint8Array = global.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}
/*</replacement>*/


var destroyImpl = __webpack_require__(/*! ./internal/streams/destroy */ "./node_modules/readable-stream/lib/internal/streams/destroy.js");

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js");
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  var isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm; // cast to ints.

  this.highWaterMark = Math.floor(this.highWaterMark); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(/*! ./_stream_duplex */ "./node_modules/readable-stream/lib/_stream_duplex.js"); // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.

  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end'); // TODO: defer error events consistently everywhere, not just the cb

  stream.emit('error', er);
  pna.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }

  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }

  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;
  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      stream.emit('error', err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;

Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../../timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/BufferList.js":
/*!*************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/BufferList.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/readable-stream/node_modules/safe-buffer/index.js").Buffer;

var util = __webpack_require__(/*! util */ 1);

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = {
      data: v,
      next: null
    };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = {
      data: v,
      next: this.head
    };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;

    while (p = p.next) {
      ret += s + p.data;
    }

    return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;

    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }

    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({
      length: this.length
    });
    return this.constructor.name + ' ' + obj;
  };
}

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/destroy.js":
/*!**********************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/destroy.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*<replacement>*/

var pna = __webpack_require__(/*! process-nextick-args */ "./node_modules/process-nextick-args/index.js");
/*</replacement>*/
// undocumented cb() API, needed for core, not for public API


function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);

      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),

/***/ "./node_modules/readable-stream/lib/internal/streams/stream-browser.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/readable-stream/lib/internal/streams/stream-browser.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter;

/***/ }),

/***/ "./node_modules/readable-stream/node_modules/safe-buffer/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/readable-stream/node_modules/safe-buffer/index.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js");

var Buffer = buffer.Buffer; // alternative to using Object.keys for old browsers

function copyProps(src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}

if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer(arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length);
} // Copy static methods from Buffer


copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number');
  }

  return Buffer(arg, encodingOrOffset, length);
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  var buf = Buffer(size);

  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }

  return buf;
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  return Buffer(size);
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  return buffer.SlowBuffer(size);
};

/***/ }),

/***/ "./node_modules/readable-stream/passthrough.js":
/*!*****************************************************!*\
  !*** ./node_modules/readable-stream/passthrough.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./readable */ "./node_modules/readable-stream/readable-browser.js").PassThrough;

/***/ }),

/***/ "./node_modules/readable-stream/readable-browser.js":
/*!**********************************************************!*\
  !*** ./node_modules/readable-stream/readable-browser.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ./lib/_stream_readable.js */ "./node_modules/readable-stream/lib/_stream_readable.js");
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(/*! ./lib/_stream_writable.js */ "./node_modules/readable-stream/lib/_stream_writable.js");
exports.Duplex = __webpack_require__(/*! ./lib/_stream_duplex.js */ "./node_modules/readable-stream/lib/_stream_duplex.js");
exports.Transform = __webpack_require__(/*! ./lib/_stream_transform.js */ "./node_modules/readable-stream/lib/_stream_transform.js");
exports.PassThrough = __webpack_require__(/*! ./lib/_stream_passthrough.js */ "./node_modules/readable-stream/lib/_stream_passthrough.js");

/***/ }),

/***/ "./node_modules/readable-stream/transform.js":
/*!***************************************************!*\
  !*** ./node_modules/readable-stream/transform.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./readable */ "./node_modules/readable-stream/readable-browser.js").Transform;

/***/ }),

/***/ "./node_modules/readable-stream/writable-browser.js":
/*!**********************************************************!*\
  !*** ./node_modules/readable-stream/writable-browser.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/_stream_writable.js */ "./node_modules/readable-stream/lib/_stream_writable.js");

/***/ }),

/***/ "./node_modules/safe-buffer/index.js":
/*!*******************************************!*\
  !*** ./node_modules/safe-buffer/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js");

var Buffer = buffer.Buffer; // alternative to using Object.keys for old browsers

function copyProps(src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}

if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer(arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length);
}

SafeBuffer.prototype = Object.create(Buffer.prototype); // Copy static methods from Buffer

copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number');
  }

  return Buffer(arg, encodingOrOffset, length);
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  var buf = Buffer(size);

  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }

  return buf;
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  return Buffer(size);
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number');
  }

  return buffer.SlowBuffer(size);
};

/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }

  var nextHandle = 1; // Spec says greater than zero

  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;

  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    } // Copy function arguments


    var args = new Array(arguments.length - 1);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    } // Store and register the task


    var task = {
      callback: callback,
      args: args
    };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback;
    var args = task.args;

    switch (args.length) {
      case 0:
        callback();
        break;

      case 1:
        callback(args[0]);
        break;

      case 2:
        callback(args[0], args[1]);
        break;

      case 3:
        callback(args[0], args[1], args[2]);
        break;

      default:
        callback.apply(undefined, args);
        break;
    }
  }

  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];

      if (task) {
        currentlyRunningATask = true;

        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function (handle) {
      process.nextTick(function () {
        runIfPresent(handle);
      });
    };
  }

  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;

      global.onmessage = function () {
        postMessageIsAsynchronous = false;
      };

      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    var messagePrefix = "setImmediate$" + Math.random() + "$";

    var onGlobalMessage = function (event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function (handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function (handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;

    registerImmediate = function (handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");

      script.onreadystatechange = function () {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };

      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function (handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  } // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.


  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global; // Don't get fooled by e.g. browserify environments.

  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/stream-browserify/index.js":
/*!*************************************************!*\
  !*** ./node_modules/stream-browserify/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
module.exports = Stream;

var EE = __webpack_require__(/*! events */ "./node_modules/events/events.js").EventEmitter;

var inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");

inherits(Stream, EE);
Stream.Readable = __webpack_require__(/*! readable-stream/readable.js */ "./node_modules/readable-stream/readable-browser.js");
Stream.Writable = __webpack_require__(/*! readable-stream/writable.js */ "./node_modules/readable-stream/writable-browser.js");
Stream.Duplex = __webpack_require__(/*! readable-stream/duplex.js */ "./node_modules/readable-stream/duplex-browser.js");
Stream.Transform = __webpack_require__(/*! readable-stream/transform.js */ "./node_modules/readable-stream/transform.js");
Stream.PassThrough = __webpack_require__(/*! readable-stream/passthrough.js */ "./node_modules/readable-stream/passthrough.js"); // Backwards-compat with node 0.4.x

Stream.Stream = Stream; // old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function (dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain); // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.

  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;

  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;
    dest.end();
  }

  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;
    if (typeof dest.destroy === 'function') dest.destroy();
  } // don't leave dangling pipes when there are errors.


  function onerror(er) {
    cleanup();

    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror); // remove all the event listeners that were added.

  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);
    source.removeListener('end', onend);
    source.removeListener('close', onclose);
    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);
    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);
  dest.on('close', cleanup);
  dest.emit('pipe', source); // Allow for unix-like usage: A.pipe(B).pipe(C)

  return dest;
};

/***/ }),

/***/ "./node_modules/string_decoder/lib/string_decoder.js":
/*!***********************************************************!*\
  !*** ./node_modules/string_decoder/lib/string_decoder.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

/*<replacement>*/

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer;
/*</replacement>*/


var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;

  switch (encoding && encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;

    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;

  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';

      case 'latin1':
      case 'binary':
        return 'latin1';

      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;

      default:
        if (retried) return; // undefined

        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}

; // Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings

function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);

  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
} // StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.


exports.StringDecoder = StringDecoder;

function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;

  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;

    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;

    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;

    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }

  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;

  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }

  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End; // Returns only complete characters in a Buffer

StringDecoder.prototype.text = utf8Text; // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer

StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
}; // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.


function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
} // Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.


function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }

  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);

  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }

    return nb;
  }

  return 0;
} // Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.


function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }

  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }

    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
} // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.


function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;

  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }

  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
} // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.


function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
} // For UTF-8, a replacement character is added when ending on a partial
// character.


function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
} // UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.


function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);

    if (r) {
      var c = r.charCodeAt(r.length - 1);

      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }

    return r;
  }

  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
} // For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.


function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';

  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }

  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;

  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }

  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
} // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)


function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // setimmediate attaches itself to the global object


__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js"); // On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.


exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || this && this.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || this && this.clearImmediate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/unzip-js/src/index.js":
/*!********************************************!*\
  !*** ./node_modules/unzip-js/src/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BlobSlicer = __webpack_require__(/*! blob-slicer */ "./node_modules/blob-slicer/src/index.js");

var ZipFile = __webpack_require__(/*! ./zip-file */ "./node_modules/unzip-js/src/zip-file.js");

var Utils = __webpack_require__(/*! ./utils */ "./node_modules/unzip-js/src/utils.js");

module.exports = function unzip(source, callback) {
  if (typeof source === 'string') {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        if (this.status === 200) createZipFile(this.response, callback);else callback(Utils.E('network error: {0} {1}', this.status, this.statusText));
      }
    });

    try {
      xhr.open('GET', source);
      xhr.responseType = 'blob';
      xhr.send();
    } catch (err) {
      callback(err);
    }
  } else {
    createZipFile(source, callback);
  }
};

function createZipFile(source, callback) {
  try {
    var reader = new BlobSlicer(source);
    Utils.readEOCDRecord(reader, function (err, eocdr) {
      callback(err, err ? null : new ZipFile(reader, eocdr));
    });
  } catch (err) {
    callback(err);
  }
}

/***/ }),

/***/ "./node_modules/unzip-js/src/utils.js":
/*!********************************************!*\
  !*** ./node_modules/unzip-js/src/utils.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.readEOCDRecord = readEOCDRecord;
exports.readUInt64LE = readUInt64LE;
exports.E = E;
exports.cp437ToUnicode = cp437ToUnicode;

function readEOCDRecord(reader, callback) {
  var fixedFieldsSize = 22;
  var maxRecordSize = fixedFieldsSize + 0xffff;
  reader.read(-maxRecordSize, function (err, buf) {
    if (err) return callback(err);

    if (buf.length < fixedFieldsSize) {
      return callback(E('expected at least 22 bytes for End Of Central Directory got {0}', buf.length));
    }

    var eocdr = {}; // end of central dir signature    4 bytes  (0x06054b50)

    var offset = buf.lastIndexOf('PK\x05\x06');
    if (offset === -1) return callback(E('End Of Central Directory not found'));
    var recordBuffer = buf.slice(offset); // number of this disk             2 bytes

    if (recordBuffer.readUInt16LE(4) !== 0) {
      return callback(E('spanned zip files are not supported'));
    } // number of the disk with the
    // start of the central directory  2 bytes
    // total number of entries in the
    // central directory on this disk  2 bytes
    // total number of entries in
    // the central directory           2 bytes


    eocdr.entryCount = recordBuffer.readUInt16LE(10); // size of the central directory   4 bytes

    eocdr.cdSize = recordBuffer.readUInt32LE(12); // offset of start of central
    // directory with respect to
    // the starting disk number        4 bytes

    eocdr.cdOffset = recordBuffer.readUInt32LE(16); // .ZIP file comment length        2 bytes

    var commentLength = recordBuffer.readUInt16LE(20); // .ZIP file comment       (variable size)

    eocdr.comment = recordBuffer.toString('utf-8', 22, 22 + commentLength);
    console.assert(eocdr.comment.length === commentLength, 'expected ' + commentLength + ' bytes for zip file comment got ' + eocdr.comment.length);

    if (eocdr.entryCount === 0xffff || eocdr.cdSize === 0xffffffff || eocdr.cdOffset === 0xffffffff) {
      readEOCD64Record(reader, offset, function (err, eocd64r) {
        if (eocd64r) eocd64r.comment = eocdr.comment;
        callback(err, eocd64r);
      });
    } else callback(null, eocdr);
  });
}

function readEOCD64Record(reader, eocdOffset, callback) {
  var fixedFieldsSize = 56;
  readEOCDLocator(reader, eocdOffset, function (err, eocd64Offset) {
    if (err) return callback(err);
    reader.read(eocd64Offset, eocd64Offset + fixedFieldsSize, function (err, buf) {
      if (err) return callback(err);

      if (buf.length < fixedFieldsSize) {
        return callback(E('expected at least 56 bytes for Zip64 End Of Central Directory got {0}', buf.length));
      }

      var eocd64r = {}; // zip64 end of central dir
      // signature                       4 bytes  (0x06064b50)

      if (buf.readUInt32LE(0) !== 0x06064b50) {
        return callback(E('Zip64 End Of Central Directory not found'));
      } // size of zip64 end of central
      // directory record                8 bytes
      // version made by                 2 bytes
      // version needed to extract       2 bytes
      // number of this disk             4 bytes
      // number of the disk with the
      // start of the central directory  4 bytes
      // total number of entries in the
      // central directory on this disk  8 bytes
      // total number of entries in the
      // central directory               8 bytes


      eocd64r.entryCount = readUInt64LE(buf, 32); // size of the central directory   8 bytes

      eocd64r.cdSize = readUInt64LE(buf, 40); // offset of start of central
      // directory with respect to
      // the starting disk number        8 bytes

      eocd64r.cdOffset = readUInt64LE(buf, 48); // zip64 extensible data sector    (variable size)

      callback(null, eocd64r);
    });
  });
}

function readEOCDLocator(reader, eocdOffset, callback) {
  var locatorRecordSize = 20;
  reader.read(eocdOffset - locatorRecordSize, eocdOffset, function (err, buf) {
    if (err) return callback(err);

    if (buf.length < locatorRecordSize) {
      return callback(E('expected at least 20 bytes for Zip64 End Of Central Directory Locator got {0}', buf.length));
    } // zip64 end of central dir locator
    // signature                       4 bytes  (0x07064b50)


    if (buf.readUInt32LE(0) !== 0x07064b50) {
      return callback(E('Zip64 End Of Central Directory Locator not found'));
    } // number of the disk with the
    // start of the zip64 end of
    // central directory               4 bytes
    // relative offset of the zip64
    // end of central directory record 8 bytes


    var eocd64Offset = readUInt64LE(buf, 8); // total number of disks           4 bytes

    if (buf.readUInt32LE(16) !== 1) {
      return callback(E('spanned zip files are not supported'));
    }

    callback(null, eocd64Offset);
  });
}

function readUInt64LE(buffer, offset) {
  return buffer.readUInt32LE(offset) + buffer.readUInt32LE(offset + 4) * 0x100000000;
}

function E(message) {
  var args = arguments;
  return new Error(message.replace(/{(\d+)}/g, function (match, p) {
    var r = args[+p + 1];
    return r === undefined ? match : r;
  }));
}

function cp437ToUnicode(buffer) {
  var table = [0x0000, 0x263A, 0x263B, 0x2665, 0x2666, 0x2663, 0x2660, 0x2022, 0x25D8, 0x25CB, 0x25D9, 0x2642, 0x2640, 0x266A, 0x266B, 0x263C, 0x25BA, 0x25C4, 0x2195, 0x203C, 0x00B6, 0x00A7, 0x25AC, 0x21A8, 0x2191, 0x2193, 0x2192, 0x2190, 0x221F, 0x2194, 0x25B2, 0x25BC, 0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025, 0x0026, 0x0027, 0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F, 0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F, 0x0040, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F, 0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005A, 0x005B, 0x005C, 0x005D, 0x005E, 0x005F, 0x0060, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F, 0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 0x0079, 0x007A, 0x007B, 0x007C, 0x007D, 0x007E, 0x2302, 0x00C7, 0x00FC, 0x00E9, 0x00E2, 0x00E4, 0x00E0, 0x00E5, 0x00E7, 0x00EA, 0x00EB, 0x00E8, 0x00EF, 0x00EE, 0x00EC, 0x00C4, 0x00C5, 0x00C9, 0x00E6, 0x00C6, 0x00F4, 0x00F6, 0x00F2, 0x00FB, 0x00F9, 0x00FF, 0x00D6, 0x00DC, 0x00A2, 0x00A3, 0x00A5, 0x20A7, 0x0192, 0x00E1, 0x00ED, 0x00F3, 0x00FA, 0x00F1, 0x00D1, 0x00AA, 0x00BA, 0x00BF, 0x2310, 0x00AC, 0x00BD, 0x00BC, 0x00A1, 0x00AB, 0x00BB, 0x2591, 0x2592, 0x2593, 0x2502, 0x2524, 0x2561, 0x2562, 0x2556, 0x2555, 0x2563, 0x2551, 0x2557, 0x255D, 0x255C, 0x255B, 0x2510, 0x2514, 0x2534, 0x252C, 0x251C, 0x2500, 0x253C, 0x255E, 0x255F, 0x255A, 0x2554, 0x2569, 0x2566, 0x2560, 0x2550, 0x256C, 0x2567, 0x2568, 0x2564, 0x2565, 0x2559, 0x2558, 0x2552, 0x2553, 0x256B, 0x256A, 0x2518, 0x250C, 0x2588, 0x2584, 0x258C, 0x2590, 0x2580, 0x03B1, 0x00DF, 0x0393, 0x03C0, 0x03A3, 0x03C3, 0x00B5, 0x03C4, 0x03A6, 0x0398, 0x03A9, 0x03B4, 0x221E, 0x03C6, 0x03B5, 0x2229, 0x2261, 0x00B1, 0x2265, 0x2264, 0x2320, 0x2321, 0x00F7, 0x2248, 0x00B0, 0x2219, 0x00B7, 0x221A, 0x207F, 0x00B2, 0x25A0, 0x00A0];
  var convertedBuffer = new Array(buffer.length);
  var len = convertedBuffer.length;
  var i;

  for (i = 0; i < len; i++) {
    convertedBuffer[i] = table[buffer[i]];
  }

  var MAX_CHUNK_SIZE = 32767;
  var str = '';

  for (i = 0; i < len; i += MAX_CHUNK_SIZE) {
    str += String.fromCharCode.apply(null, convertedBuffer.slice(i, i + MAX_CHUNK_SIZE));
  }

  return str;
}

/***/ }),

/***/ "./node_modules/unzip-js/src/zip-file.js":
/*!***********************************************!*\
  !*** ./node_modules/unzip-js/src/zip-file.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var crc32 = __webpack_require__(/*! buffer-crc32 */ "./node_modules/buffer-crc32/index.js");

var createInflateRaw = __webpack_require__(/*! zlib */ "./node_modules/browserify-zlib/lib/index.js").createInflateRaw;

var Transform = __webpack_require__(/*! readable-stream */ "./node_modules/readable-stream/readable-browser.js").Transform;

var Utils = __webpack_require__(/*! ./utils */ "./node_modules/unzip-js/src/utils.js");

var E = Utils.E;
var readUInt64LE = Utils.readUInt64LE;
var cp437ToUnicode = Utils.cp437ToUnicode;
module.exports = ZipFile;

function ZipFile(reader, eocdr) {
  this.entries = [];
  this.entryCount = eocdr.entryCount;
  this.comment = eocdr.comment;
  this._cdSize = eocdr.cdSize;
  this._cdOffset = eocdr.cdOffset;
  this._reader = reader;
}

ZipFile.prototype.readEntries = function (callback) {
  var fixedFieldsSize = 46;
  var self = this;

  callback = function (fn) {
    var called = false;
    return function (err, entries) {
      if (called) return;
      called = true;
      fn(err, entries);
    };
  }(callback);

  var readStream = this._reader.createReadStream({
    start: this._cdOffset,
    end: this._cdOffset + this._cdSize
  });

  readStream.on('error', callback);
  readStream.on('end', function () {
    callback(self.entries.length === self.entryCount ? null : E('expected {0} entries got {1}', self.entryCount, self.entries.length), self.entries);
  });
  readStream.on('readable', onReadable);

  function destroyAndDrain(error) {
    readStream.destroy(error);
    readStream.read();
  }

  function onReadable() {
    while (this.readableLength > 0) {
      if (this.readableLength < fixedFieldsSize) {
        if (this.ended) {
          return destroyAndDrain(E('expected at least 46 bytes for Central File Header got {0}', this.readableLength));
        }

        break;
      }

      var fixedFieldsBuffer = this.read(fixedFieldsSize);
      var entry = new Entry(); // central file header signature   4 bytes  (0x02014b50)

      if (fixedFieldsBuffer.readUInt32LE(0) !== 0x02014b50) {
        return destroyAndDrain(E('invalide Central File Header signature'));
      } // version made by                 2 bytes


      entry.versionMadeBy = fixedFieldsBuffer.readUInt16LE(4); // version needed to extract       2 bytes

      entry.versionNeededToExtract = fixedFieldsBuffer.readUInt16LE(6); // general purpose bit flag        2 bytes

      entry.generalPurposeBitFlag = fixedFieldsBuffer.readUInt16LE(8); // compression method              2 bytes

      entry.compressionMethod = fixedFieldsBuffer.readUInt16LE(10); // last mod file time              2 bytes

      entry.lastModTime = fixedFieldsBuffer.readUInt16LE(12); // last mod file date              2 bytes

      entry.lastModDate = fixedFieldsBuffer.readUInt16LE(14); // crc-32                          4 bytes

      entry.crc32 = fixedFieldsBuffer.readUInt32LE(16); // compressed size                 4 bytes

      entry.compressedSize = fixedFieldsBuffer.readUInt32LE(20); // uncompressed size               4 bytes

      entry.uncompressedSize = fixedFieldsBuffer.readUInt32LE(24); // file name length                2 bytes

      var nameLength = fixedFieldsBuffer.readUInt16LE(28); // extra field length              2 bytes

      var extraFieldsLength = fixedFieldsBuffer.readUInt16LE(30); // file comment length             2 bytes

      var commentLength = fixedFieldsBuffer.readUInt16LE(32); // disk number start               2 bytes
      // internal file attributes        2 bytes

      entry.internalAttributes = fixedFieldsBuffer.readUInt16LE(36); // external file attributes        4 bytes

      entry.externalAttributes = fixedFieldsBuffer.readUInt32LE(38); // relative offset of local header 4 bytes

      entry.localHeaderOffset = fixedFieldsBuffer.readUInt32LE(42);
      var variableFieldsSize = nameLength + extraFieldsLength + commentLength;

      if (this.readableLength < variableFieldsSize) {
        if (this.ended) {
          return destroyAndDrain(E('expected at least {0} bytes for variable fields in Central File Header got {1}', variableFieldsSize, this.readableLength));
        }

        this.unshift(fixedFieldsBuffer);
        break;
      }

      var variableFieldsBuffer = this.read(variableFieldsSize); // file name (variable size)

      entry.name = variableFieldsBuffer.slice(0, nameLength); // extra field (variable size)

      var extraFieldsBuffer = variableFieldsBuffer.slice(nameLength, nameLength + extraFieldsLength);

      for (var i = 0, len = extraFieldsBuffer.length - 3; i < len;) {
        var headerId = extraFieldsBuffer.readUInt16LE(i);
        var dataSize = extraFieldsBuffer.readUInt16LE(i += 2);
        var data = Buffer.from(extraFieldsBuffer.slice(i += 2, i += dataSize));
        entry.extraFields.push({
          headerId: headerId,
          dataSize: dataSize,
          data: data
        });
      } // comment (variable size)


      entry.comment = variableFieldsBuffer.slice(nameLength + extraFieldsLength); // handle encoding

      var isUTF8 = (entry.generalPurposeBitFlag & 0x800) === 0x800;

      if (isUTF8) {
        entry.name = entry.name.toString();
        entry.comment = entry.comment.toString();
      } else {
        entry.name = cp437ToUnicode(entry.name);
        entry.comment = cp437ToUnicode(entry.comment);
      } // Info-ZIP Unicode Path/Comment Extra Field


      ;
      ['name', 'comment'].forEach(function (field) {
        var headerId;
        var oldData;

        if (field === 'name') {
          headerId = 0x7075;
          oldData = variableFieldsBuffer.slice(0, nameLength);
        } else {
          headerId = 0x6375;
          oldData = variableFieldsBuffer.slice(nameLength + extraFieldsLength);
        }

        var infoZipUEFs = entry.extraFields.filter(function (ef) {
          return ef.headerId === headerId;
        });
        infoZipUEFs.forEach(function (infoZipUEF) {
          var data = infoZipUEF.data;

          if (data.length > 6) {
            var versionRecognized = data.readUInt8(0) === 1;
            var crcCheckPassed = crc32.unsigned(oldData) === data.readUInt32LE(1);
            var str = data.toString('utf8', 5);
            if (versionRecognized && crcCheckPassed && str.length > 0) entry[field] = str;
          }
        });
      }); // handle zip64 format

      if (entry.compressedSize === 0xffffffff || entry.uncompressedSize === 0xffffffff || entry.localHeaderOffset === 0xffffffff) {
        var zip64EIEF = entry.extraFields.filter(function (ef) {
          return ef.headerId === 0x0001;
        })[0];

        if (zip64EIEF) {
          var offset = 0;
          var fields = ['uncompressedSize', 'compressedSize', 'localHeaderOffset'];

          for (var j in fields) {
            var field = fields[j];

            if (entry[field] === 0xffffffff) {
              try {
                entry[field] = readUInt64LE(zip64EIEF.data, offset);
                offset += 8;
              } catch (err) {
                return destroyAndDrain(E('invalid Zip64 Extended Information Extra Field: {0} not found', field));
              }
            }
          }
        } else {
          return destroyAndDrain(E('Zip64 Extended Information Extra Field not found'));
        }
      }

      self.entries.push(entry);
    }

    this.read(0);
  }
};

ZipFile.prototype.readEntryData = function (entry, checkCrc, callback) {
  if (entry.encrypted) {
    callback(E('encrypted files are not supported'));
    return;
  }

  if (entry.compressionMethod !== 0 && entry.compressionMethod !== 8) {
    callback(E('compression method is not supported'));
    return;
  }

  var fixedFieldsSize = 30;
  var self = this;

  this._reader.read(entry.localHeaderOffset, entry.localHeaderOffset + fixedFieldsSize, function (err, buf) {
    if (err) return callback(err);

    if (buf.length < fixedFieldsSize) {
      return callback(E('expected at least 30 bytes for Local File Header got {1}', buf.length));
    } // local file header signature     4 bytes  (0x04034b50)


    if (buf.readUInt32LE(0) !== 0x04034b50) {
      return callback(E('invalid Local File Header signature'));
    } // version needed to extract       2 bytes
    // general purpose bit flag        2 bytes
    // compression method              2 bytes
    // last mod file time              2 bytes
    // last mod file date              2 bytes
    // crc-32                          4 bytes
    // compressed size                 4 bytes
    // uncompressed size               4 bytes
    // file name length                2 bytes


    var nameLength = buf.readUInt16LE(26); // extra field length              2 bytes

    var extraFieldLength = buf.readUInt16LE(28);
    var dataStart = entry.localHeaderOffset + fixedFieldsSize + nameLength + extraFieldLength;

    var readStream = self._reader.createReadStream({
      start: dataStart,
      end: dataStart + entry.compressedSize
    });

    var outStream = readStream;

    if (entry.compressionMethod === 8) {
      var inflate = createInflateRaw();
      outStream = outStream.on('error', function (err) {
        inflate.destroy(err);
      }).pipe(inflate);
    }

    if (checkCrc) {
      var partialCrc;
      var crcTransform = new Transform({
        transform: function (chunk, encoding, callback) {
          partialCrc = crc32(chunk, partialCrc);
          callback(null, chunk);
        },
        flush: function (callback) {
          var finalCrc = partialCrc.readUInt32BE(0);
          callback(finalCrc === entry.crc32 ? null : E('corrupted file: crc check fails'));
        }
      });
      outStream = outStream.on('error', function (err) {
        crcTransform.destroy(err);
      }).pipe(crcTransform);
    }

    callback(null, outStream);
  });
};

function Entry() {
  this.extraFields = [];
}

Object.defineProperties(Entry.prototype, {
  encrypted: {
    get: function () {
      return (this.generalPurposeBitFlag & 0x0001) === 0x0001;
    }
  },
  lastModDateTime: {
    get: function () {
      return new Date((this.lastModDate >> 9 & 0x7f) + 1980, // year
      (this.lastModDate >> 5 & 0xf) - 1, // month
      this.lastModDate & 0x1f, // day
      this.lastModTime >> 11 & 0x1f, // hours
      this.lastModTime >> 5 & 0x3f, // minutes
      (this.lastModTime & 0x1f) * 2 // seconds
      );
    }
  }
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/util-deprecate/browser.js":
/*!************************************************!*\
  !*** ./node_modules/util-deprecate/browser.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Module exports.
 */
module.exports = deprecate;
/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate(fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
}
/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */


function config(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }

  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/util/node_modules/inherits/inherits_browser.js":
/*!*********************************************************************!*\
  !*** ./node_modules/util/node_modules/inherits/inherits_browser.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function () {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
  !*** ./node_modules/util/support/isBufferBrowser.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
  !*** ./node_modules/util/util.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};

  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  } // Allow for deprecating things in the process of starting up.


  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/util/node_modules/inherits/inherits_browser.js");

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];

    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }

  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  } // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.


  function callbackified() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();

    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }

    var self = this;

    var cb = function () {
      return maybeCb.apply(self, arguments);
    }; // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)


    original.apply(this, args).then(function (ret) {
      process.nextTick(cb, null, ret);
    }, function (rej) {
      process.nextTick(callbackifyOnRejected, rej, cb);
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

exports.callbackify = callbackify;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if (typeof window === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ }),

/***/ 0:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });