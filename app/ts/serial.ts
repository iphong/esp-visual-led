import { set, store } from "./store"

let handler = null

chrome.serial.onReceive.addListener(async ({ connectionId: id, data }) => {
	let m = ''
	let h = ''
	if (id === store.connection) {
		(new Uint8Array(data)).forEach((byte) => {
			m += String.fromCharCode(byte)
			h += byte.toString(16).padStart(2, '0') + ' '
			decodeMsg(byte)
		})
		console.groupCollapsed('serial', id, 'received', m.length, 'byte(s)')
		console.info('STR:', m)
		console.info('HEX:', h)
		console.info('BUF:', data)
		console.groupEnd()
	}
})
chrome.serial.onReceiveError.addListener(async ({ connectionId: id, error }) => {
	if (id === store.connection) {
		console.log("serial closed:", error)
		await set({ connection: 0, connected: false })
	}
})

export async function onSerialMessage(cb) {
	handler = cb
}

export async function serialConnect(force = false) {
	return new Promise(resolve => {
		if (!force && store.connection) {
			chrome.serial.getConnections(async (connections) => {
				const found = connections.find((conn) => conn.connectionId == store.connection)
				console.debug(connections)
				if (!found) {
					resolve(await serialConnect(true))
				} else {
					console.log('serial resumed:', found.connectionId, store.port)
					await set({ connection: found.connectionId, connected: true })
					resolve(found.connectionId)
				}
			})
		} else {
			const options = {
				name: 'connection',
				bufferSize: 255,
				bitrate: 115200,
				receiveTimeout: 0
			}
			chrome.serial.connect(store.port, options, async (conn) => {
				if (conn) {
					console.log('serial connected:', conn.connectionId)
					await set({ connection: conn.connectionId, connected: true })
				} else {
					console.log('can not connect to serial port')
					await set({ connection: 0, connected: false })
				}
				resolve(conn)
			})
		}
	})
}

export async function serialDisconnect() {
	await set('connected', false)
	return new Promise(resolve => {
		chrome.serial.disconnect(store.connection, resolve)
	})
}

export async function sendRaw(data: ArrayBuffer) {
	return new Promise(resolve => {
		if (store.connected)
			chrome.serial.send(store.connection, data, resolve)
		else resolve(null)
	})
}

export async function sendCommand(id: string, head: string, ...bytes: number[]): Promise<any> {
	console.log('send', id, head, ...bytes.map(c => c.toString(16).padStart(2, '0')))
	const i = id.split('').map(c => c.charCodeAt(0))
	const h = head.split('').map(c => c.charCodeAt(0))
	await sendRaw(encodeMsg([...i, 62, ...h, ...bytes]))
}

export function hexStr(arr: number[]) {
	return arr.map(n => n.toString(16).padStart(2, '0')).join(' ')
}

export function readStr(arr: number[], len = 1, pos = 0) {
	let output = ''
	for (let i = pos; i < pos + len; i++)
		output += String.fromCharCode(arr[i])
	return output
}

export function equals(a: number[], b: number[], size: number, offset: number = 0): boolean {
	for (let i = offset; i < offset + size; i++) {
		if (a[i] !== b[i]) return false
	}
	return true
}

const header = [36]
const buffer: number[] = []
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
export function decodeMsg(byte: number) {
	buffer[length++] = byte;
	if (isValidStart() && isValidSize() && checksum()) {
		synced = false;
		let frame = buffer.slice(2, buffer[1] + 2)
		if (handler) handler(frame)
	}
	if (!synced) {
		crc = 0;
		length = 0;
	} else {
		crc += byte;
	}
}
export function encodeMsg(input: number[]) {
	const output: number[] = []
	output[0] = 36 // header
	output[1] = input.length
	let crc = output[0] + output[1]
	for (let i = 0; i < input.length; i++) {
		output[i + 2] = input[i]
		crc += output[i + 2];
	}
	output.push(crc)
	return new Uint8Array(output)
}

export async function sendSync(time: number, show: number, ended: boolean, paused: boolean) {
	const data = new Uint8Array(8)
	const view = new DataView(data.buffer)
	view.setUint32(0, time, true)
	view.setUint8(4, show)
	view.setUint8(5, ended ? 1 : 0)
	view.setUint8(6, paused ? 1 : 0)
	view.setUint8(7, 0xFF)
	await sendCommand('#', 'SYNC', ...data);
}
export async function sendFile(file: File | Blob, path?: string, id: string = '#') {
	console.log('begin uploading')
	let bytesSent = 0
	if (file instanceof File)
		file = new Blob([file])
	const bytesLength = file.size;
	const buffer = await file.arrayBuffer()
	await sendCommand(id, 'FBEGIN' + path)
	await delay(500);
	let count = 0
	while (bytesSent < bytesLength) {
		const start = bytesSent
		const end = Math.min(bytesSent + 16, bytesLength)
		await sendCommand(id, 'FWRITE', ...new Uint8Array(buffer, start, end - start))
		bytesSent = end
		if (count++) await delay(2);
		else await delay(500);
	}
	await sendCommand(id, 'FCLOSE')
	await delay(100);
	console.log('file uploaded')
}

export async function delay(ms: number = 1000) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}
