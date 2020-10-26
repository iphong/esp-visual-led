import { parseAudio, player } from './audio'
import { parseLTP } from "./light"
import { set, store } from "./model"
import { renderSerial, renderShow } from "./view"

export async function exitApp() {
	window.close()
}

export async function openShow() {
	return new Promise(resolve => {
		chrome['fileSystem'].chooseEntry(async (entry: any) => {
			if (entry) {
				await set('show_file_entry_id', chrome['fileSystem'].retainEntry(entry))
				entry.file(async (file: File) => {
					const show = await parseLTP(file)
					if (show.audio.file) {
						Object.assign(show.audio, await parseAudio(show.audio.file))
						player.src = URL.createObjectURL(show.audio.file)
						delete show.audio.file
					}
					set('show_data', show);
					renderShow(show)
					resolve()
				})
			}
		})
	})
}

export async function restoreShow() {
	return new Promise(resolve => {
		chrome['fileSystem'].isRestorable(store.show_file_entry_id, (res: boolean) => {
			if (res) {
				chrome['fileSystem'].restoreEntry(store.show_file_entry_id, (entry: any) => {
					if (entry) {
						entry.file(async (file: File) => {
							const show = await parseLTP(file)
							if (show.audio.file) {
								store.show_data.audio.file = show.audio.file
								player.src = URL.createObjectURL(show.audio.file)
								delete show.audio.file
							}
							renderShow(store.show_data)
							resolve()
						})
					} else resolve()
				})
			} else resolve()
		})
	})
}


export async function startShow() {
	player.play()
}
export async function endShow() {
	player.currentTime = player.duration
}
export async function pauseShow() {
	player.pause()
}
export async function resumeShow() {
	player.play()
}
export async function syncShow() {
}
export async function serialConnect() {
	return new Promise(resolve => {
		if (store.serial_connection_id) {
			chrome.serial.getConnections(async (connections) => {
				const exist = connections.find((conn) => {
					return conn.connectionId == store.serial_connection_id
				})
				if (!exist) {
					await set('serial_connection_id', 0)
					resolve(await serialConnect())
				} else {
					console.log('resuming connection:', exist.connectionId)
					await renderSerial()
					resolve(exist.connectionId)
				}
			})
		} else {
			const options = {
				name: 'sdc_device_connection',
				bufferSize: 250,
				bitrate: 921600,
				receiveTimeout: 0
			}
			chrome.serial.connect(store.serial_port, options, async (conn) => {
				if (conn) {
					await set('serial_connection_id', conn.connectionId)
					await renderSerial()
					resolve(conn)
				} else {
					console.log("Can not connect to the selected serial port.")
				}
			})
		}
	})
}

export async function serialDisconnect() {
	return new Promise(resolve => {
		chrome.serial.disconnect(store.serial_connection_id, resolve)
	})
}

export async function serialSend(input: String) {
	const data = new Uint8Array([...input.split('').map(c => c.charCodeAt(0))])
	chrome.serial.send(store.serial_connection_id, data.buffer, async () => {

	})
}

export async function sendText(text: string) {
	return new Promise(resolve => {
		resolve(sendBinary(new Uint8Array(text.split('').map(c => c.charCodeAt(0))).buffer))
	})
}


export async function sendBinary(data: ArrayBuffer) {
	return new Promise(resolve => {
		const buf = new Uint8Array(data.byteLength + 3)
		const last = buf.byteLength - 1
		buf[0] = 36
		buf[1] = data.byteLength
		buf.set(new Uint8Array(data), 2);
		buf[last] = 0
		for (let i = 0; i < last; i++) {
			buf[last] += buf[i];
		}
		chrome.serial.send(store.serial_connection_id, buf.buffer, async (res) => {
			resolve(buf.buffer)
			// console.log(buf, await (new Blob([buf]).text()))
		})
	})
}

export async function send(id: string = '#', head: string = '', ...bytes: number[]): Promise<any> {
	const i = id.split('').map(c => c.toUpperCase().charCodeAt(0))
	const h = head.split('').map(c => c.toUpperCase().charCodeAt(0))
	sendBinary((new Uint8Array([...i, 62, ...h, ...bytes])).buffer)
}

