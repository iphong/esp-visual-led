import isEqual from "lodash/isEqual"
import { renderNodes } from "./app"
import { CONFIG } from "./data"

let socket
let fsResponsed

(function createSocket() {
	console.log('SOCKET initialize ...')
	socket = new WebSocket(`ws://${location.hostname}:81`)
	socket.binaryType = 'arraybuffer'
	socket.addEventListener('message', async (e) => {
		if (typeof e.data === 'string') {
			// handleMessage(e.data)
		}
		if (e.data instanceof ArrayBuffer) {
			let changed = false
			let view = new DataView(e.data)
			const id = readStr(view, 6, 0);
			if (readStr(view, 1, 6) !== '<') {
				console.warn("wrong format XXXXXX<CMD...");
			} else if (equals('<PING', view, 6)) {
				const n1 = {
					id,
					type: view.getUint8(11),
					vbat: view.getUint16(12),
					name: readStr(view, 20, 14),
					hidden: false,
					lastUpdated: Date.now()
				}
				let exist = false
				CONFIG.nodes.forEach(n2 => {
					if (n1.id == n2.id) {
						if (!isEqual(n1, n2)) {
							Object.assign(n2, n1)
							changed = true
						}
						exist = true
					}
				})
				if (!exist) CONFIG.nodes.push(n1)
			} else {
				CONFIG.nodes.forEach(node => {
					if (id == node.id) {
						view = new DataView(e.data.slice(7))
						if (equals('SELECT', view)) {
							node.selected = !node.selected;
							node.lastUpdated = Date.now()
							changed = true
							if (node.selected) send(node.id, 'BLINK', 5)
							else send(node.id, 'BLINK', 0)
						}
					}
				})
			}
			if (changed) renderNodes()
		}
	})
	socket.addEventListener('close', () => {
		setTimeout(createSocket, 1000)
	})
	socket.addEventListener('open', () => {

	})
	window.socket = socket
})()

async function waitFileResponse(timeout = 1000) {
	const expired = Date.now + 1000
	fsResponsed = false
	return new Promise((resolve, reject) => {
		setTimeout(function check() {
			if (fsResponsed) resolve()
			else if (Date.now() > expired) reject()
			else setTimeout(check, 1)
		})
	})
}
export async function sendFile(target, path, file) {
	await send(target, 'FS1' + path)
	await waitFileResponse()
	console.log('file send open')
	const reader = new FileReader
	reader.readAsArrayBuffer(file)
	reader.addEventListener('loadend', async e => {
		let offset = 0;
		const buf = e.target.result
		while (offset < buf.byteLength) {
			console.log('file sent chunk')
			const size = Math.min(buf.byteLength - offset, 240)
			await send(target, 'FS2', ...new Uint8Array(buf.slice(offset, size)))
			await waitFileResponse()
			offset += 240
		}
		await send(target, 'FS3')
		await waitFileResponse()
		console.log('file send done')
	})

}

export async function sendSync() {
	const payload = new Uint8Array(13)
	const view = new DataView(payload.buffer)
	print(view, '#>SYNC', 0)
	view.setUint8(6, CONFIG.show)
	view.setUint8(7, CONFIG.running)
	view.setUint8(8, CONFIG.paused)
	view.setUint32(9, CONFIG.time)
	socket.send(payload.buffer)
}
export function equals(text = '', view, offset = 0) {
	return text.split('').every((c, i) => {
		return c == String.fromCharCode(view.getUint8(i + offset))
	})
}
export function readStr(view, size, offset = 0) {
	let output = ''
	let byte
	for (let i = 0; i < size; i++) {
		byte = view.getUint8(i + offset)
		if (byte >= 30 && byte < 127) {
			output += String.fromCharCode(byte)
		}
	}
	return output
}
export function print(view, str, pos = 0) {
	let offset = pos
	str.split('').map((c, i) => {
		offset = i + pos
		view.setUint8(offset, c.charCodeAt(0))
	})
	return offset + 1
}
export async function send(target = '#', header = '', ...payload) {
	const targetBytes = target.split('').map(c => c.charCodeAt(0))
	const headerBytes = header.split('').map(c => c.charCodeAt(0))
	socket.send(new Uint8Array([...targetBytes, 62, ...headerBytes, ...payload]))
}

// const debounceGetNodes = debounce(async function () {
// 	CONFIG.nodes = await get('nodes')
// 	renderNodes()
// }, 100)
// let isRunning = false;
// let isPaused = false;
//  async function handleMessage(msg) {
// 	// console.log(`SOCKET:: `, msg)
// 	if (msg.startsWith('#<PING')) {
// 		debounceGetNodes()
// 	}
// 	else if (msg.startsWith('#>SYNC')) {
// 		const [, a, b, c] = msg.split(':')
// 		const time = parseInt(a) / 10
// 		const running = !!parseInt(b)
// 		const paused = !!parseInt(c)
// 		if (isPaused !== paused) {
// 			isPaused = paused
// 			if (paused) {
// 				setAttr('#pause', 'data-command', 'resume')
// 				setText('#pause', 'RESUME')
// 				call('#player', 'pause')
// 			} else {
// 				setAttr('#pause', 'data-command', 'pause')
// 				setText('#pause', 'PAUSE')
// 				call('#player', 'play')
// 			}
// 		}
// 		if (isRunning !== running) {
// 			isRunning = running
// 			if (running) {
// 				setAttr('#play', 'data-command', 'end')
// 				setText('#play', 'STOP')
// 				setProp('#player', 'currentTime', 0)
// 				call('#player', 'play')
// 			} else {
// 				setAttr('#play', 'data-command', 'start')
// 				setText('#play', 'PLAY')
// 				call('#player', 'pause')
// 				setProp('#player', 'currentTime', 0)
// 			}
// 		}
// 	}
// }

// export async function sendFile(file, receivers = []) {
// 	const reader = new FileReader
// 	reader.readAsArrayBuffer(file)
// 	reader.addEventListener('loadend', async e => {
// 		const buf = e.target.result
// 		const view = new DataView(buf)

// 		// Begin file stream
// 		if (!receivers.length) {
// 			await send('#>FILE^')
// 		} else {
// 			while (receivers.length) {
// 				let id = receivers.pop()
// 				await send('#>FILE^' + id)
// 			}
// 		}

// 		// file content stream
// 		let offset = 0
// 		while (offset < buf.byteLength) {
// 			let len = Math.min(buf.byteLength - offset, 240)
// 			let payload = buf.slice(offset, len)
// 			send(new Blob(['#>FILE+', payload]))
// 			offset += len
// 		}

// 		// file end

// 	})
// }

Object.assign(global, { send, sendSync })
