import { set, store } from "./store"

let handler = null

chrome.serial.onReceive.addListener(async ({ connectionId: id, data }) => {
	if (handler && id === store.serial_connection)
		(new Uint8Array(data)).forEach((byte) => {
			decodeMsg(byte)
		})
})
chrome.serial.onReceiveError.addListener(async ({ connectionId: id, error }) => {
	if (id === store.serial_connection) {
		console.log("serial closed:", error)
		await set({ serial_connection: 0, serial_connected: false })
	}
})

export async function onSerialMessage(cb) {
	handler = cb
}

export async function serialConnect(force = false) {
	return new Promise(resolve => {
		if (!force && store.serial_connection) {
			chrome.serial.getConnections(async (connections) => {
				const found = connections.find((conn) => conn.connectionId == store.serial_connection)
				console.log(connections)
				if (!found) {
					resolve(await serialConnect(true))
				} else {
					console.log('serial resumed:', found.connectionId, store.serial_port)
					await set({ serial_connection: found.connectionId, serial_connected: true })
					resolve(found.connectionId)
				}
			})
		} else {
			const options = {
				name: 'serial_connection',
				bufferSize: 250,
				bitrate: 921600,
				receiveTimeout: 0
			}
			chrome.serial.connect(store.serial_port, options, async (conn) => {
				if (conn) {
					console.log('serial connected:', conn.connectionId, store.serial_port)
					await set({ serial_connection: conn.connectionId, serial_connected: true })
				} else {
					console.log('can not connect to serial port', store.serial_port)
					await set({ serial_connection: 0, serial_connected: false })
				}
				resolve(conn)
			})
		}
	})
}

export async function serialDisconnect() {
	await set('serial_connected', false)
	return new Promise(resolve => {
		chrome.serial.disconnect(store.serial_connection, resolve)
	})
}

export async function sendRaw(data: ArrayBuffer) {
	return new Promise(resolve => {
		if (store.serial_connected)
			chrome.serial.send(store.serial_connection, data, resolve)
		else resolve()
	})
}

export async function sendCommand(id: string, head: string, ...bytes: number[]): Promise<any> {
	const i = id.split('').map(c => c.charCodeAt(0))
	const h = head.split('').map(c => c.charCodeAt(0))
	await sendRaw(encodeMsg([...i, 62, ...h, ...bytes]))
}

export function hexStr(arr:number[]) {
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

const syncword = [36]
const buffer: number[] = []
let crc = 0;
let length = 0;
let synced = false;

function isValidStart() {
	return synced = synced || equals(buffer, syncword, syncword.length);
}
function isValidSize() {
	return length >= syncword.length + buffer[1] + 2;
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
	output[0] = 36 // syncword
	output[1] = input.length
	let crc = output[0] + output[1]
	for (let i = 0; i < input.length; i++) {
		output[i + 2] = input[i]
		crc += output[i + 2];
	}
	output.push(crc)
	return new Uint8Array(output)
}

export async function sendSync(time:number, show:number,  ended:boolean, paused:boolean) {
	const data = new Uint8Array(8)
	const view = new DataView(data.buffer)
	view.setUint32(0, time, true)
	view.setUint8(4, show)
	view.setUint8(5, ended ? 1 : 0)
	view.setUint8(6, paused ? 1 : 0)
	view.setUint8(7, 0xFF)
	sendCommand('#', 'SYNC', ...data);
}

export async function sendFile(file?:File|Blob) {
	
}

export async function delay(ms:number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}
