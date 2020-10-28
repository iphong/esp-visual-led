import JSZip from 'jszip'
import unzip from 'unzip-js'
import { parseAudio, player } from './audio'
import { set, store, cache } from "./model"
import { encodeMsg } from './socket'
import { renderAudio, renderSerial, renderShow } from "./view"

export async function handleJsonFile(file: File | Blob) {
	console.log('handle show file')
	const show = JSON.parse(await (new Blob([file]).text()))
	await set('show', show)
	renderShow(show)
}
export async function handleAudioFile(file: File | Blob, force = false) {
	let audio = store.audio || {}
	player.src = URL.createObjectURL(file)
	cache.audio = file
	await set('show_duration', Math.max(store.show_duration, audio.duration * 1000))
	console.log('handle audio file')
	if (force || !audio.waveform) {
		audio = await parseAudio(file)
	}
	await set('audio', audio)
	renderAudio(audio)
}
export async function handleImageFile(file: File | Blob) {

}
export async function openShowEntry(entry: FileEntry) {
	console.log(`open show entry "${entry.fullPath}"`)
	await newShow()
	return new Promise((resolve, reject) => {
		entry.file(file => {
			unzip(file, (err, zip) => {
				if (err) reject(err)
				zip.readEntries((err, entries) => {
					if (err) reject(err)
					let ended = 0
					entries.forEach(entry => {
						const { name } = entry
						zip.readEntryData(entry, false, (err, stream) => {
							if (err) reject(err)
							let content: Uint8Array[] = []
							stream.on('data', (data: Uint8Array) => {
								content.push(data)
							})
							stream.on('end', async () => {
								if (name == 'project.lt3' || name == 'project.json') {
									await handleJsonFile(new Blob(content))
								} else if (name.endsWith('.mp3')) {
									await handleAudioFile(new Blob(content, { type: 'audio/mp3' }))
								}
								if (++ended === entries.length) {
									const end = Math.max(store.show.solution.end, store.audio.duration * 1000)
									await set('show_duration', end)
									resolve()
								}
							})
						})
					})
				})
			})
		})
	})
}
export async function newShow() {
	return new Promise(async (resolve) => {
		player.src = ''
		await set('show', {})
		await set('audio', {})
		await set('show_file', '')
		resolve()
	})
}

export async function saveShowEntry(entry: FileEntry) {
	await set('show_file', chrome['fileSystem'].retainEntry(entry))
	return new Promise(resolve => {
		chrome.storage.local.get(['show', 'audio'], ({ show = {}, audio }) => {
			entry.createWriter(async (writer: FileWriter) => {
				const zip = new JSZip()
				zip.file('project.json', JSON.stringify(show))
				if (cache.audio) zip.file('audio.mp3', cache.audio)
				zip.generateAsync({ type: 'blob' }).then(content => {
					writer.write(content)
					writer.addEventListener('writeend', () => {
						resolve()
						console.log(`saved to "${entry.fullPath}"`)
					})
				})
			})
		})
	})
}
export async function saveShow() {
	return new Promise(async (resolve) => {
		const file = store.show_file
		if (file) {
			chrome['fileSystem'].restoreEntry(file, async (entry: FileEntry) => {
				if (entry) {
					await saveShowEntry(entry)
				}
				resolve()
			})
		} else {
			chrome['fileSystem'].chooseEntry({ type: 'saveFile' }, async (entry: FileEntry) => {
				if (entry) {
					await saveShowEntry(entry)
				}
				resolve()
			})
		}
	})
}
export async function openShow() {
	return new Promise(resolve => {
		chrome['fileSystem'].chooseEntry({ type: 'openWritableFile' }, async (entry: FileEntry) => {
			if (!entry) return resolve()
			if (entry.name.endsWith('lmp')) {
				await set('file', chrome['fileSystem'].retainEntry(entry))
			}
			openShowEntry(entry)
			resolve()
		})
	})
}
export async function syncShow() {
	if (!player.duration) return
	const data = new Uint8Array(8)
	const view = new DataView(data.buffer)
	view.setUint32(0, Math.round(player.currentTime * 1000), true)
	view.setUint8(4, 1)
	view.setUint8(5, player.ended ? 1 : 0)
	view.setUint8(6, player.paused ? 1 : 0)
	view.setUint8(7, 0xFF)
	send('#', 'SYNC', ...data);

}

export async function serialConnect(force = false) {
	return new Promise(resolve => {
		if (!force && store.serial_connection) {
			chrome.serial.getConnections(async (connections) => {
				const exist = connections.find((conn) => {
					return conn.connectionId == store.serial_connection
				})
				if (!exist) {
					resolve(await serialConnect(true))
				} else {
					console.log('resuming connection:', exist.connectionId)
					await set('serial_connection', exist.connectionId)
					await set('serial_connected', true)
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
					await set('serial_connection', conn.connectionId)
					await set('serial_connected', true)
				} else {
					await set('serial_connection', 0)
					await set('serial_connected', false)
				}
				await renderSerial()
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

export async function serialSend(data: ArrayBuffer) {
	if (store.serial_connected)
		return new Promise(resolve => {
			chrome.serial.send(store.serial_connection, data, resolve)
		})
}

export async function send(id: string, head: string, ...bytes: number[]): Promise<any> {
	const i = id.split('').map(c => c.toUpperCase().charCodeAt(0))
	const h = head.split('').map(c => c.toUpperCase().charCodeAt(0))
	await serialSend(encodeMsg([...i, 62, ...h, ...bytes]))
}
