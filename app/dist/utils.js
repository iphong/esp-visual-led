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
/******/ 	return __webpack_require__(__webpack_require__.s = "./ts/utils.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./ts/utils.ts":
/*!*********************!*\
  !*** ./ts/utils.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxtQkFBbUI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixxQkFBcUI7QUFDbkQsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi90cy91dGlscy50c1wiKTtcbiIsImNvbnN0ICR0eHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHh0Jyk7XG5jb25zdCAkaGV4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hleCcpO1xuY29uc3QgJGRlYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWMnKTtcbmNvbnN0ICRiaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmluJyk7XG5jb25zdCAkaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ludCcpO1xuY29uc3QgJHJlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXMnKTtcbmNvbnN0ICRhcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcnInKTtcbmNvbnN0ICRtZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2UnKTtcbmNvbnN0ICRzZW5kID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbmQnKTtcbmNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgndXRpbHNfdHh0JywgKHsgdXRpbHNfdHh0OiBjb2RlcyB9KSA9PiB7XG4gICAgaWYgKCFjb2RlcylcbiAgICAgICAgcmV0dXJuO1xuICAgICRiaW4uaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygyKS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDgsICcwJykpLmpvaW4oJyAnKTtcbiAgICAkaGV4LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignICcpO1xuICAgICRkZWMuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygpKS5qb2luKCcgJyk7XG4gICAgJHR4dC5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpKS5qb2luKCcnKTtcbiAgICAkYXJyYXkuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gJzB4JyArIGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignLCAnKTtcbn0pO1xubGV0IGNvZGVzID0gW107XG5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0LnJlcGxhY2UoL1xccysvLCAnJyk7XG4gICAgc3dpdGNoIChlLnRhcmdldC5pZCkge1xuICAgICAgICBjYXNlICd0eHQnOlxuICAgICAgICAgICAgY29kZXMgPSB2YWx1ZSA/IHZhbHVlLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpIDogW107XG4gICAgICAgICAgICAkYmluLmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoMikudG9VcHBlckNhc2UoKS5wYWRTdGFydCg4LCAnMCcpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkaGV4LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignICcpO1xuICAgICAgICAgICAgJGRlYy5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKCkpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICRhcnJheS5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiAnMHgnICsgYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcsICcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgICAgICB2YWx1ZSA9IGUudGFyZ2V0LmlubmVyVGV4dC5yZXBsYWNlKC9bXjAtOWEtZiBdL2lnLCAnJykudHJpbSgpO1xuICAgICAgICAgICAgY29kZXMgPSB2YWx1ZSA/IHZhbHVlLnNwbGl0KCcgJykubWFwKGMgPT4gcGFyc2VJbnQoYywgMTYpKSA6IFtdO1xuICAgICAgICAgICAgJGJpbi5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKDIpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoOCwgJzAnKSkuam9pbignICcpO1xuICAgICAgICAgICAgJGRlYy5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKCkpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICR0eHQuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShjKSkuam9pbignJyk7XG4gICAgICAgICAgICAkYXJyYXkuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gJzB4JyArIGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignLCAnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkZWMnOlxuICAgICAgICAgICAgdmFsdWUgPSBlLnRhcmdldC5pbm5lclRleHQucmVwbGFjZSgvW14wLTkgXS9pZywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGNvZGVzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnICcpLm1hcChjID0+IHBhcnNlSW50KGMsIDEwKSkgOiBbXTtcbiAgICAgICAgICAgICRiaW4uaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygyKS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDgsICcwJykpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICRoZXguaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKS5wYWRTdGFydCgyLCAnMCcpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkdHh0LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoYykpLmpvaW4oJycpO1xuICAgICAgICAgICAgJGFycmF5LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+ICcweCcgKyBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJywgJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYmluJzpcbiAgICAgICAgICAgIHZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0LnJlcGxhY2UoL1teMDEgXS9pZywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGNvZGVzID0gdmFsdWUgPyB2YWx1ZS5zcGxpdCgnICcpLm1hcChjID0+IHBhcnNlSW50KGMsIDIpKSA6IFtdO1xuICAgICAgICAgICAgJGhleC5pbm5lckhUTUwgPSBjb2Rlcy5tYXAoYyA9PiBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICRkZWMuaW5uZXJIVE1MID0gY29kZXMubWFwKGMgPT4gYy50b1N0cmluZygpKS5qb2luKCcgJyk7XG4gICAgICAgICAgICAkdHh0LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoYykpLmpvaW4oJycpO1xuICAgICAgICAgICAgJGFycmF5LmlubmVySFRNTCA9IGNvZGVzLm1hcChjID0+ICcweCcgKyBjLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLnBhZFN0YXJ0KDIsICcwJykpLmpvaW4oJywgJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaW50JzpcbiAgICAgICAgICAgIGxldCByZXMgPSAnXFxuJztcbiAgICAgICAgICAgIHZhbHVlID0gZS50YXJnZXQuaW5uZXJUZXh0LnJlcGxhY2UoL1teMC05XS9pZywgJycpLnRyaW0oKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmLmJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgdmlldy5zZXRVaW50MTYoMCwgbnVtKTtcbiAgICAgICAgICAgICAgICByZXMgKz0gJ1UxNiBCRSA9ICcgKyB0b0hFWChidWYuc2xpY2UoMCwgMikpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0VWludDE2KDAsIG51bSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmVzICs9ICdVMTYgTEUgPSAnICsgdG9IRVgoYnVmLnNsaWNlKDAsIDIpKTtcbiAgICAgICAgICAgICAgICB2aWV3LnNldFVpbnQzMigwLCBudW0pO1xuICAgICAgICAgICAgICAgIHJlcyArPSAnVTMyIEJFID0gJyArIHRvSEVYKGJ1Zik7XG4gICAgICAgICAgICAgICAgdmlldy5zZXRVaW50MzIoMCwgbnVtLCB0cnVlKTtcbiAgICAgICAgICAgICAgICByZXMgKz0gJ1UzMiBMRSA9ICcgKyB0b0hFWChidWYpO1xuICAgICAgICAgICAgICAgIHZpZXcuc2V0RmxvYXQzMigwLCBudW0pO1xuICAgICAgICAgICAgICAgIHJlcyArPSAnRjMyIEJFID0gJyArIHRvSEVYKGJ1Zik7XG4gICAgICAgICAgICAgICAgdmlldy5zZXRGbG9hdDMyKDAsIG51bSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmVzICs9ICdGMzIgTEUgPSAnICsgdG9IRVgoYnVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRyZXMuaW5uZXJIVE1MID0gcmVzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICB9XG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgJ3V0aWxzX3R4dCc6IGNvZGVzIH0pO1xufSk7XG5mdW5jdGlvbiB0b0hFWChieXRlcykge1xuICAgIHJldHVybiBbLi4uYnl0ZXNdLm1hcChjID0+IGMudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkucGFkU3RhcnQoMiwgJzAnKSkuam9pbignICcpICsgJ1xcbic7XG59XG4kc2VuZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgIGNocm9tZVsnYXBwJ10ud2luZG93LmdldCgnYXBwJykuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShuZXcgVWludDhBcnJheShbMSwgLi4uY29kZXNdKSk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=