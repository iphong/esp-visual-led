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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/ts/utils.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/ts/utils.ts":
/*!*************************!*\
  !*** ./app/ts/utils.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const $txt = document.getElementById('txt');
const $hex = document.getElementById('hex');
const $dec = document.getElementById('dec');
const $bin = document.getElementById('bin');
const $int = document.getElementById('int');
const $res = document.getElementById('res');
const $array = document.getElementById('arr');
const $message = document.getElementById('message');
const $send = document.getElementById('send');
chrome.storage.local.get('utils_txt', ({ utils_txt: codes }) => {
    if (!codes)
        return;
    $bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ');
    $hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ');
    $dec.innerHTML = codes.map(c => c.toString()).join(' ');
    $txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('');
    $array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ');
});
let codes = [];
addEventListener('input', (e) => {
    let value = e.target.innerText.replace(/\s+/, '');
    switch (e.target.id) {
        case 'txt':
            codes = value ? value.split('').map(c => c.charCodeAt(0)) : [];
            $bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ');
            $hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ');
            $dec.innerHTML = codes.map(c => c.toString()).join(' ');
            $array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ');
            break;
        case 'hex':
            value = e.target.innerText.replace(/[^0-9a-f ]/ig, '').trim();
            codes = value ? value.split(' ').map(c => parseInt(c, 16)) : [];
            $bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ');
            $dec.innerHTML = codes.map(c => c.toString()).join(' ');
            $txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('');
            $array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ');
            break;
        case 'dec':
            value = e.target.innerText.replace(/[^0-9 ]/ig, '').trim();
            codes = value ? value.split(' ').map(c => parseInt(c, 10)) : [];
            $bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ');
            $hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ');
            $txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('');
            $array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ');
            break;
        case 'bin':
            value = e.target.innerText.replace(/[^01 ]/ig, '').trim();
            codes = value ? value.split(' ').map(c => parseInt(c, 2)) : [];
            $hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ');
            $dec.innerHTML = codes.map(c => c.toString()).join(' ');
            $txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('');
            $array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ');
            break;
        case 'int':
            let res = '\n';
            value = e.target.innerText.replace(/[^0-9]/ig, '').trim();
            if (value) {
                const num = parseFloat(value);
                const buf = new Uint8Array(4);
                const view = new DataView(buf.buffer);
                view.setUint16(0, num);
                res += 'U16 BE = ' + toHEX(buf.slice(0, 2));
                view.setUint16(0, num, true);
                res += 'U16 LE = ' + toHEX(buf.slice(0, 2));
                view.setUint32(0, num);
                res += 'U32 BE = ' + toHEX(buf);
                view.setUint32(0, num, true);
                res += 'U32 LE = ' + toHEX(buf);
                view.setFloat32(0, num);
                res += 'F32 BE = ' + toHEX(buf);
                view.setFloat32(0, num, true);
                res += 'F32 LE = ' + toHEX(buf);
            }
            $res.innerHTML = res;
            break;
        default: return;
    }
    chrome.storage.local.set({ 'utils_txt': codes });
});
function toHEX(bytes) {
    return [...bytes].map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ') + '\n';
}
$send.addEventListener('click', e => {
    chrome['app'].window.get('app').contentWindow.postMessage(new Uint8Array([1, ...codes]));
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwL3RzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRmE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsbUJBQW1CO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIscUJBQXFCO0FBQ25ELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vYXBwL3RzL3V0aWxzLnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCAkdHh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R4dCcpO1xuY29uc3QgJGhleCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZXgnKTtcbmNvbnN0ICRkZWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVjJyk7XG5jb25zdCAkYmluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JpbicpO1xuY29uc3QgJGludCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnQnKTtcbmNvbnN0ICRyZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzJyk7XG5jb25zdCAkYXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXJyJyk7XG5jb25zdCAkbWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlJyk7XG5jb25zdCAkc2VuZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZW5kJyk7XG5jaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ3V0aWxzX3R4dCcsICh7IHV0aWxzX3R4dDogY29kZXMgfSkgPT4ge1xuICAgIGlmICghY29kZXMpXG4gICAgICAgIHJldHVybjtcbiAgICAkYmluLmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoMikudG9VcHBlckNhc2UoKS5wYWRTdGFydCg4LCAnMCcpKS5qb2luKCcgJyk7XG4gICAgJGhleC5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJyAnKTtcbiAgICAkZGVjLmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoKSkuam9pbignICcpO1xuICAgICR0eHQuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShjKSkuam9pbignJyk7XG4gICAgJGFycmF5LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+ICcweCcgKyBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJywgJyk7XG59KTtcbmxldCBjb2RlcyA9IFtdO1xuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGUudGFyZ2V0LmlubmVyVGV4dC5yZXBsYWNlKC9cXHMrLywgJycpO1xuICAgIHN3aXRjaCAoZS50YXJnZXQuaWQpIHtcbiAgICAgICAgY2FzZSAndHh0JzpcbiAgICAgICAgICAgIGNvZGVzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKSA6IFtdO1xuICAgICAgICAgICAgJGJpbi5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKDIpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoOCwgJzAnKSkuam9pbignICcpO1xuICAgICAgICAgICAgJGhleC5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICRkZWMuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkYXJyYXkuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gJzB4JyArIGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignLCAnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdoZXgnOlxuICAgICAgICAgICAgdmFsdWUgPSBlLnRhcmdldC5pbm5lclRleHQucmVwbGFjZSgvW14wLTlhLWYgXS9pZywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGNvZGVzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnICcpLm1hcChjID0+IHBhcnNlSW50KGMsIDE2KSkgOiBbXTtcbiAgICAgICAgICAgICRiaW4uaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygyKS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDgsICcwJykpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICRkZWMuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkdHh0LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoYykpLmpvaW4oJycpO1xuICAgICAgICAgICAgJGFycmF5LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+ICcweCcgKyBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJywgJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZGVjJzpcbiAgICAgICAgICAgIHZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0LnJlcGxhY2UoL1teMC05IF0vaWcsICcnKS50cmltKCk7XG4gICAgICAgICAgICBjb2RlcyA9IHZhbHVlID8gdmFsdWUuc3BsaXQoJyAnKS5tYXAoYyA9PiBwYXJzZUludChjLCAxMCkpIDogW107XG4gICAgICAgICAgICAkYmluLmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoMikudG9VcHBlckNhc2UoKS5wYWRTdGFydCg4LCAnMCcpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkaGV4LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignICcpO1xuICAgICAgICAgICAgJHR4dC5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpKS5qb2luKCcnKTtcbiAgICAgICAgICAgICRhcnJheS5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiAnMHgnICsgYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcsICcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Jpbic6XG4gICAgICAgICAgICB2YWx1ZSA9IGUudGFyZ2V0LmlubmVyVGV4dC5yZXBsYWNlKC9bXjAxIF0vaWcsICcnKS50cmltKCk7XG4gICAgICAgICAgICBjb2RlcyA9IHZhbHVlID8gdmFsdWUuc3BsaXQoJyAnKS5tYXAoYyA9PiBwYXJzZUludChjLCAyKSkgOiBbXTtcbiAgICAgICAgICAgICRoZXguaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkZGVjLmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoKSkuam9pbignICcpO1xuICAgICAgICAgICAgJHR4dC5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpKS5qb2luKCcnKTtcbiAgICAgICAgICAgICRhcnJheS5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiAnMHgnICsgYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcsICcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ludCc6XG4gICAgICAgICAgICBsZXQgcmVzID0gJ1xcbic7XG4gICAgICAgICAgICB2YWx1ZSA9IGUudGFyZ2V0LmlubmVyVGV4dC5yZXBsYWNlKC9bXjAtOV0vaWcsICcnKS50cmltKCk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBudW0gPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1Zi5idWZmZXIpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0VWludDE2KDAsIG51bSk7XG4gICAgICAgICAgICAgICAgcmVzICs9ICdVMTYgQkUgPSAnICsgdG9IRVgoYnVmLnNsaWNlKDAsIDIpKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNldFVpbnQxNigwLCBudW0sIHRydWUpO1xuICAgICAgICAgICAgICAgIHJlcyArPSAnVTE2IExFID0gJyArIHRvSEVYKGJ1Zi5zbGljZSgwLCAyKSk7XG4gICAgICAgICAgICAgICAgdmlldy5zZXRVaW50MzIoMCwgbnVtKTtcbiAgICAgICAgICAgICAgICByZXMgKz0gJ1UzMiBCRSA9ICcgKyB0b0hFWChidWYpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0VWludDMyKDAsIG51bSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmVzICs9ICdVMzIgTEUgPSAnICsgdG9IRVgoYnVmKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNldEZsb2F0MzIoMCwgbnVtKTtcbiAgICAgICAgICAgICAgICByZXMgKz0gJ0YzMiBCRSA9ICcgKyB0b0hFWChidWYpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0RmxvYXQzMigwLCBudW0sIHRydWUpO1xuICAgICAgICAgICAgICAgIHJlcyArPSAnRjMyIExFID0gJyArIHRvSEVYKGJ1Zik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkcmVzLmlubmVySFRNTCA9IHJlcztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7ICd1dGlsc190eHQnOiBjb2RlcyB9KTtcbn0pO1xuZnVuY3Rpb24gdG9IRVgoYnl0ZXMpIHtcbiAgICByZXR1cm4gWy4uLmJ5dGVzXS5tYXAoYyA9PiBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJyAnKSArICdcXG4nO1xufVxuJHNlbmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICBjaHJvbWVbJ2FwcCddLndpbmRvdy5nZXQoJ2FwcCcpLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobmV3IFVpbnQ4QXJyYXkoWzEsIC4uLmNvZGVzXSkpO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9