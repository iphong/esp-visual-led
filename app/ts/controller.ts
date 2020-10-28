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
	await set('show_duration', Math.max(store.show_duration, show.solution.end))
	if (show.tracks) {
		await set('show_tracks', convertTracks(show.tracks))
	}
	renderShow(show)
	return show
}
export async function handleAudioFile(file: File | Blob, force = false) {
	let audio = store.audio || {}
	player.src = URL.createObjectURL(file)
	cache.audio = file
	console.log('handle audio file')
	if (force || !audio.waveform) {
		audio = await parseAudio(file)
	}
	if (audio.duration)
		await set('show_duration', Math.max(store.show_duration, audio.duration))
	await set('audio', audio)
	renderAudio(audio)
	return audio
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

export function convertTracks(tracks: any[]) {
	function rgb({ r, g, b }: { r: number, g: number, b: number }) {
		return [r, g, b].map(v => Math.round(v * 255))
	}
	function hex(num: number) {
		return num.toString(16).padStart(2, '0').toUpperCase()
	}
	function frame({ type, startTime: start, endTime: end, color, colorEnd, colorStart, period, spacing, ratio }: any) {
		const data:any = {
			type,
			start,
			duration: end - start,
			color: []
		}
		if (color) data.color[0] = '#' + rgb(color).map(hex).join('')
		if (colorStart) data.color[0] = '#' + rgb(colorStart).map(hex).join('')
		if (colorEnd) data.color[1] = '#' + rgb(colorEnd).map(hex).join('')
		if (typeof period !== 'undefined') data.period = period
		if (typeof ratio !== 'undefined') data.ratio = ratio
		if (typeof spacing !== 'undefined') data.spacing = spacing
		return data
	}
	return tracks.map(({ name, trackType: type, device, elements }: any) => {
		return {
			type,
			name,
			device,
			frames: elements.map(frame)
		}
	})
}
export async function newShow() {
	player.src = ''
	await set({ show: {}, audio: {}, show_file: '', show_duration: 60000, show_tracks: [] })
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
	if (!store.show_selected || !player.duration) return
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
	return new Promise(resolve => {
		if (store.serial_connected)
			chrome.serial.send(store.serial_connection, data, resolve)
			else resolve()
	})	
}

export async function send(id: string, head: string, ...bytes: number[]): Promise<any> {
	const i = id.split('').map(c => c.toUpperCase().charCodeAt(0))
	const h = head.split('').map(c => c.toUpperCase().charCodeAt(0))
	await serialSend(encodeMsg([...i, 62, ...h, ...bytes]))
}
