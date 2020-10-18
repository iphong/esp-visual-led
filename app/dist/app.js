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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/ts/entry.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/ts/audio.ts":
/*!*************************!*\
  !*** ./app/ts/audio.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.player = void 0;\nexports.player = document.createElement('audio');\n\n\n//# sourceURL=webpack:///./app/ts/audio.ts?");

/***/ }),

/***/ "./app/ts/controller.ts":
/*!******************************!*\
  !*** ./app/ts/controller.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.syncShow = exports.resumeShow = exports.pauseShow = exports.endShow = exports.startShow = void 0;\nconst socket_1 = __webpack_require__(/*! ./socket */ \"./app/ts/socket.ts\");\nconst audio_1 = __webpack_require__(/*! ./audio */ \"./app/ts/audio.ts\");\nasync function startShow() {\n    await socket_1.send('#>BEGIN');\n    audio_1.player.play();\n}\nexports.startShow = startShow;\nasync function endShow() {\n    await socket_1.send('#>END');\n    audio_1.player.currentTime = audio_1.player.duration;\n}\nexports.endShow = endShow;\nasync function pauseShow() {\n    await socket_1.send('#>PAUSE');\n    audio_1.player.pause();\n}\nexports.pauseShow = pauseShow;\nasync function resumeShow() {\n    await socket_1.send('#>RESUME');\n    audio_1.player.play();\n}\nexports.resumeShow = resumeShow;\nasync function syncShow() {\n    await socket_1.send('#>SYNC');\n}\nexports.syncShow = syncShow;\n\n\n//# sourceURL=webpack:///./app/ts/controller.ts?");

/***/ }),

/***/ "./app/ts/entry.ts":
/*!*************************!*\
  !*** ./app/ts/entry.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst actions = __importStar(__webpack_require__(/*! ./controller */ \"./app/ts/controller.ts\"));\naddEventListener('click', (e) => {\n    if (e.target) {\n        const actionTarget = e.target.closest('*[data-action]');\n        if (actionTarget) {\n            const { action } = actionTarget.dataset;\n            if (typeof actions[action] === 'function') {\n                actions[action].call(actionTarget, e);\n            }\n        }\n    }\n});\n\n\n//# sourceURL=webpack:///./app/ts/entry.ts?");

/***/ }),

/***/ "./app/ts/socket.ts":
/*!**************************!*\
  !*** ./app/ts/socket.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.send = void 0;\nasync function send(header, ...bytes) {\n}\nexports.send = send;\n\n\n//# sourceURL=webpack:///./app/ts/socket.ts?");

/***/ })

/******/ });