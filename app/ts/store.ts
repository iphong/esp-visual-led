import { $player } from './view'

Object.defineProperty(window, 'localStorage', { value: null })

import JSZip from 'jszip'
import unzip from 'unzip-js'
import MusicTempo from 'music-tempo'
import flattenDeep from 'lodash/flattenDeep'

export const cache: CacheData = {
	audio: null,
	show: null
}
export const DEFAULT_SHOW_DATA = {
	selected: 1,
	time: 0,
	duration: 0,
	markers: [],
	tracks: []
}
export const DEFAULT_AUDIO_DATA = {
	url: null,
	beats: [],
	duration: 0,
	waveform: []
}
export const DEFAULT_STORE_DATA: StoreData = {

	port: '',
	connection: 0,
	connected: false,

	sync: false,
	file: '',
	time: 0,
	slot: 1,
	channel: 'A',
	duration: 0,
	paused: false,
	ended: false,

	tempo: 120,
	division: 4,

	tracks: [],
	beats: [],
	waveform: [],

	show: null,
	audio: null
}
export const store: StoreData | any = Object.create(DEFAULT_STORE_DATA)
window['store'] = store

chrome.storage.onChanged.addListener(async (changes) => {
	for (let key in changes) {
		store[key] = changes[key].newValue
	}
	// console.debug('changed', [changes])
	// await renderTracks()
	// await renderWaveform()
	// await renderBeats()
})

export async function init() {
	console.debug('init storage')
	return new Promise(resolve => {
		chrome.storage.local.get(async (res: any) => {
			// const { tracks, duration, solution, ...data } = res
			Object.assign(store, res)
			resolve(store)
		})
	})
}

export async function set(key: string | object, value?: any) {
	return new Promise(resolve => {
		if (typeof key === 'string') {
			chrome.storage.local.set({ [key]: value } as any, resolve)
		} else if (typeof key === 'object') {
			chrome.storage.local.set(key, resolve)
		} else {
			resolve(null)
		}
	})
}

export async function parseShowFile(file: File | Blob): Promise<ShowData> {
	console.debug('parse show file')
	return new Promise(async (resolve) => {
		if (file instanceof File) file = new Blob([file], { type: file.type })
		let result = null
		const body = await file.text()
		try {
			result = JSON.parse(body)
		} catch (e) {
			console.debug(e)
			console.debug(await file.text())
		}
		if (file.type !== 'lmp' && result) result = {
			tracks: parseShowTracks(result.tracks)
		}
		resolve(result)
	})
}

export async function parseAudioFile(file: File | Blob): Promise<AudioData> {
	console.debug('parse audio file')
	return {}
	// const { duration, waveform, beats, tempo }:any = await parseAudio(file)
	// return { duration: Math.max(duration, store.duration), waveform, beats, tempo }
}

export async function parseAudio(file: File | Blob | ArrayBuffer): Promise<AudioData> {
	return new Promise(async (resolve, reject) => {
		let name = ''
		let buffer = file
		if (buffer instanceof File) {
			name = buffer.name
			buffer = new Blob([buffer])
		}
		if (buffer instanceof Blob)
			buffer = await buffer.arrayBuffer()
		new AudioContext().decodeAudioData(buffer, res => {
			console.debug('decoded audio', [res])
			const data = res.getChannelData(0)
			if (res.numberOfChannels == 2) {
				const data2 = res.getChannelData(1)
				for (let i in data) {
					data[i] = (data[i] + data2[i]) / 2
				}
			}
			console.debug('getting music tempo')
			const { beats, tempo } = new MusicTempo(data) as { beats: Float32Array, tempo: number }
			resolve({
				name,
				tempo,
				beats: [...new Uint32Array(beats.map(v => v * 1000))],
				duration: Math.round(res.duration * 1000),
				waveform: parseWaveform(data, res.duration * 100)
			} as AudioData)
		}, reject)
	})
}

export function parseWaveform(audioData: Float32Array, width: number): WaveformData[] {
	const step = Math.round(audioData.length / width)
	const waveformData: WaveformData[] = []
	let x = 0,
		sumPositive = 0,
		sumNegative = 0,
		maxPositive = 0,
		maxNegative = 0,
		kNegative = 0,
		kPositive = 0,
		drawIdx = step
	for (let i = 0; i < audioData.length; i++) {
		if (i == drawIdx) {
			waveformData.push([
				Math.round(sumPositive / kPositive * 100) || 0,
				Math.round(sumNegative / kNegative * 100) || 0,
				Math.round(maxPositive * 100) || 0,
				Math.round(maxNegative * 100) || 0
			])
			x++
			drawIdx += step
			sumPositive = 0
			sumNegative = 0
			maxPositive = 0
			maxNegative = 0
			kNegative = 0
			kPositive = 0
		} else {
			if (audioData[i] < 0) {
				sumNegative += audioData[i]
				kNegative++
				if (maxNegative > audioData[i]) maxNegative = audioData[i]
			} else {
				sumPositive += audioData[i]
				kPositive++
				if (maxPositive < audioData[i]) maxPositive = audioData[i]
			}
		}
	}
	return waveformData
}

export function parseShowTracks(tracks: any[]) {
	function rgb({ r, g, b }: { r: number, g: number, b: number }) {
		return [r, g, b].map(v => Math.round(v * 255))
	}
	function hex(num: number) {
		return num.toString(16).padStart(2, '0').toUpperCase()
	}
	function frame({ type, startTime: start, endTime: end, color, colorEnd, colorStart, period, spacing, ratio }: any) {
		const data: any = {
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
			frames: (elements || []).map(frame)
		}
	})
}

export async function openShowEntry(entry: FileEntry) {
	return new Promise(async (resolve, reject) => {
		const upName = entry.name.toUpperCase()
		if (upName.endsWith('LMP') || upName.endsWith('LTP')) {
			await set('file', chrome['fileSystem'].retainEntry(entry))
		}
		entry.file(file => {
			unzip(file, (err: any, zip) => {
				if (err) reject(err)
				function callback(err: any, entries) {
					let ended = 0
					entries.forEach(entry => {
						const { name } = entry
						let show, audio
						zip.readEntryData(entry, false, (err, stream) => {
							if (err) return resolve(null)
							let content: Uint8Array[] = []
							stream.on('data', (data: Uint8Array) => {
								content.push(data)
							})
							stream.on('end', async () => {
								switch (name) {
									case 'project.lt3':
										cache.show = new Blob(content, { type: 'lt3' })
										show = await parseShowFile(cache.show)
										if (show) await set(show)
										break
									case 'project.json':
										cache.show = new Blob(content, { type: 'lmp' })
										show = await parseShowFile(cache.show)
										if (show) await set(show)
										break
									default:
										if (name.endsWith('.mp3')) {
											cache.audio = new Blob(content, { type: 'mp3' })
											audio = await parseAudioFile(cache.audio)
											if (audio) {
												await set(audio)
												$player.src = URL.createObjectURL(cache.audio)
											}
										}
								}
								if (++ended === entries.length) {
									resolve(null)
								}
							})
						})
					})
				}
				zip.readEntries(callback, reject)
			})
		})
	})
}

export async function saveShowEntry(entry: FileEntry) {
	if (!entry) return
	const upName = entry.name.toUpperCase()
	console.debug(`open file`, [entry.fullPath])
	if (upName.endsWith('LMP')) {
		try {
			await set('file', chrome['fileSystem'].retainEntry(entry))
		}
		catch (e) {
			console.debug(e)
		}
	}
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(async ({ show, audio, ...data }) => {
			entry.createWriter(async (writer: FileWriter) => {
				const zip = new JSZip()
				zip.file('project.json', JSON.stringify(data))
				if (cache.audio) zip.file('audio.mp3', cache.audio)
				zip.generateAsync({ type: 'blob' }).then(content => {
					writer.write(content)
					writer.addEventListener('writeend', async () => {
						if (entry.fullPath.toUpperCase().endsWith('LMP')) {
							await set('file', chrome['fileSystem'].retainEntry(entry))
						} else {
							await set('file', '')
						}
						console.debug(`save LMP file`, [entry.fullPath])
						resolve(null)
					})
				}).catch(reject)
			})
		})
	})
}

interface Frame {
	type: number
	start: number
	duration?: number
	transition?: number
	r?: number
	g?: number
	b?: number
}

export function createBinaryFrame({ type, start, duration, transition, r, g, b }: Frame) {
	const data = new Uint8Array(16)
	const view = new DataView(data.buffer)
	view.setUint8(0, type || 1)
	view.setUint8(1, r || 0)
	view.setUint8(2, g || 0)
	view.setUint8(3, b || 0)
	view.setUint32(4, start || 0, true)
	view.setUint32(8, duration || 0, true)
	view.setUint32(12, transition || 0, true)
	return data
}

export function createColorFrame(start: number, duration: number, transition: number, r: number, g: number, b: number) {
	return createBinaryFrame({ type: 1, start, duration, transition, r, g, b })
}

export function createEndFrame(start: number) {
	return createBinaryFrame({ type: 2, start })
}

export function createLoopFrame(start: number, duration: number) {
	return createBinaryFrame({ type: 3, start, duration })
}

function hex2rgb(hex: string): [number, number, number] {
	return [
		parseInt(hex[1] + hex[2], 16),
		parseInt(hex[3] + hex[4], 16),
		parseInt(hex[5] + hex[6], 16)
	]
}

export function convertFrame({ type, color, start, duration, ratio, spacing, period }) {
	switch (type) {
		case 2: // solid
			return [
				createColorFrame(start, duration, 0, ...hex2rgb(color[0]))
			]
		case 3: // gradient
			return [
				createColorFrame(start, 0, 0, ...hex2rgb(color[0])),
				createColorFrame(start, duration, duration, ...hex2rgb(color[1]))
			]
		case 4: // flash
			const dur = period * (ratio / 100)
			return [
				createLoopFrame(start, duration),
				createColorFrame(0, dur, 0, ...hex2rgb(color[0])),
				createColorFrame(dur, period - dur, 0, ...hex2rgb(color[1])),
				createEndFrame(period)
			]
		case 5: // rainbow
			const seg = Math.floor(period / 7)
			let pos = 0
			return [
				createLoopFrame(start, duration),
				createColorFrame(seg * 0, seg, seg, 255, 0, 0),
				createColorFrame(seg * 1, seg, seg, 255, 165, 0),
				createColorFrame(seg * 2, seg, seg, 255, 255, 0),
				createColorFrame(seg * 3, seg, seg, 0, 128, 0),
				createColorFrame(seg * 4, seg, seg, 0, 0, 255),
				createColorFrame(seg * 5, seg, seg, 75, 0, 130),
				createColorFrame(seg * 6, seg, seg, 238, 130, 238),
				createEndFrame(seg * 7)
			]
		case 6: // dots
			return [
				createLoopFrame(start, duration),
				createColorFrame(0, 1, 0, ...hex2rgb(color[0])),
				createColorFrame(1, spacing, 0, 0, 0, 0),
				createEndFrame(spacing + 1),
				createColorFrame(period, 0, 0, ...hex2rgb(color[0]))
			]
		case 7: // pulse
			if (period < 24) period = 24
			return [
				createLoopFrame(start, duration),
				createColorFrame(0, 10, 0, 0, 0, 0),
				createColorFrame(11, 2, 0, 255, 255, 255),
				createColorFrame(13, 10, 0, 0, 0, 0),
				createColorFrame(22, period - 22, 0, ...hex2rgb(color[0])),
				createEndFrame(period),
				createColorFrame(period, 0, 0, ...hex2rgb(color[0]))
			]
		default:
			return []
	}
}

export function convertTracks(tracks) {
	const buf = []
	tracks.forEach((track: any, index: any) => {
		if (index === 0) {
			buf.push(...new Array(createColorFrame(0, track.start, 0, 0, 0, 0)))
		} else if (index > 0 && index < tracks.length) {
			const last = tracks[index - 1]
			const gap = track.start - (last.start + last.duration)
			if (gap > 0) buf.push(...new Array(createColorFrame(last.start + last.duration, gap, 0, 0, 0, 0)))
		}
		buf.push(...new Array(convertFrame(track)))
		if (index === tracks.length - 1) {
			buf.push(...new Array(createEndFrame(track.start + track.duration)))
		}
	})
	return flattenDeep(buf)
}

export function logHex(data) {
	console.debug(data.map((c: number) => c.toString(16).padStart(2, '0')).join(' '))
}


window['convert'] = convertTracks
