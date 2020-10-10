import debounce from 'lodash/debounce'
import { E } from 'unzip-js/src/utils'
import { get } from "./api"
import { renderNodes } from "./app"

export const socket = new WebSocket(`ws://${location.hostname}:81`)

socket.addEventListener('message', async (e) => {
	if (typeof e.data === 'string') {
		handleMessage(e.data)
	} else {
		const reader = new FileReader()
		reader.readAsText(e.data)
		reader.addEventListener('loadend', async () => {
			handleMessage(reader.result)
		})
	}
})

const debounceGetNodes = debounce(async function() {
	CONFIG.nodes = await get('nodes')
	renderNodes()
}, 100)
export async function handleMessage(msg) {
	console.log(`SOCKET:: `, msg)
	if (msg.startsWith('#<PING')) {
		debounceGetNodes()
	}
}

export async function send(header = '', ...payload) {
	const headerBytes = header.split('').map(c => c.charCodeAt(0))
	socket.send(new Uint8Array([35, 62, ...headerBytes, ...payload]))
}

export async function sendFile(file, receivers = []) {
	const reader = new FileReader
	reader.readAsArrayBuffer(file)
	reader.addEventListener('loadend', async e => {
		const buf = e.target.result
		const view = new DataView(buf)

		// Begin file stream
		if (!receivers.length) {
			await send('#>FILE^')
		} else {
			while (receivers.length) {
				let id = receivers.pop()
				await send('#>FILE^' + id)
			}
		}

		// file content stream
		let offset = 0
		while (offset < buf.byteLength) {
			let len = Math.min(buf.byteLength - offset, 240)
			let payload = buf.slice(offset, len)
			send(new Blob(['#>FILE+', payload]))
			offset += len
		}

		// file end

	})
}

Object.assign(global, { send })
