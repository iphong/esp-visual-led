import { send } from "./controller"

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
const queue: number[] = []
let length = 0;
let crc = 0;
let synced = false;

window['queue'] = queue;

function isValidStart() {
	return synced = synced || equals(queue, syncword, syncword.length);
}
function isValidSize() {
	return length >= syncword.length + queue[1] + 2;
}
function checksum() {
	return queue[length - 1] == crc;
}
export function decode(byte: number) {
	queue[length++] = byte;
	if (isValidStart() && isValidSize() && checksum()) {
		synced = false;
		let buf = queue.slice(2, queue[1] + 2)
		if (buf.length > 6 && [60, 62].includes(buf[6])) { // XXXXXX< or XXXXXX>
			const id = readStr(buf, 6)
			const msg = readStr(buf, buf.length-7, 7)
			// console.log(`${id}: ${msg}`)
			if (msg.startsWith('SELECT')) {
				send(id, 'BLINK', 1, 2)
			}
			if (msg.startsWith('PING')) {
				const type = buf[11]
				const vbat = (buf[12] << 8) | buf[13]
				const name = readStr(buf, 20, 14);
				console.log((vbat/1000+0.04).toPrecision(3) + 'v - ' +name)
			}

			
			// const type = view.getUint8(4)
			// const vbat = view.getUint16(5)
			// const name =readStr(msg, 6, 20)
			// const node = {id, type, vbat, name}
		}
		// console.log(`received ${buf.length} bytes: ${buf.map((c) => String.fromCharCode(c)).join('')}`)
	}
	crc += byte;
	crc %= 256
	if (!synced) {
		length = 0;
		crc = 0;
	}
}
