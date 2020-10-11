import { renderNodes } from "./app"

let socket

(function createSocket() {
	console.log('SOCKET initialize ...')
	socket = new WebSocket(`ws://${location.hostname}:81`)
	socket.addEventListener('message', async (e) => {
		if (typeof e.data === 'string') {
			// handleMessage(e.data)
		} else {
			const reader = new FileReader()
			reader.readAsArrayBuffer(e.data)
			reader.addEventListener('loadend', async e => {
				const buf = e.target.result
				const view = new DataView(buf)
				if (equals('#<PING', view)) {
					const n1 = {
						id: readStr(view, 6, 6),
						type: view.getUint8(6+7),
						vbat: view.getUint16(6+8),
						name: readStr(view, 20, 6+10)
					}
					let exist = false
					CONFIG.nodes.forEach(n2 => {
						if (n1.id == n2.id) {
							Object.assign(n2, n1)
							exist = true
						}
					})
					if (!exist) {
						CONFIG.nodes.push(n1)
					}
					renderNodes()
				}
			})
		}
	})
	socket.addEventListener('close', () => {
		setTimeout(createSocket, 1000)
	})
	window.socket = socket
})()

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
	for (let i=0; i<size;i ++) {
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
export async function send(header = '', ...payload) {
	const headerBytes = header.split('').map(c => c.charCodeAt(0))
	socket.send(new Uint8Array([35, 62, ...headerBytes, ...payload]))
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
