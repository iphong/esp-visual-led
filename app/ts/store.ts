Object.defineProperty(window, 'localStorage', { value: null })

import unzip from 'unzip-js'
import JSZip from 'jszip'
import MusicTempo from 'music-tempo'
import flattenDeep from 'lodash/flattenDeep'

export const cache:CacheData = {
	audio: null,
	show: null
}
export const DEFAULT_SHOW_DATA = {
	selected: 1,
	running: false,
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
export const DEFAULT_STORE_DATA = {
	serial_port: '',
	serial_connection: 0,
	serial_connected: false,
	show_file: '',
	show_sync: false,
	show: DEFAULT_SHOW_DATA,
	audio: DEFAULT_AUDIO_DATA
}
export const store:StoreData|any = Object.create((DEFAULT_STORE_DATA))
window['store'] = store

chrome.storage.onChanged.addListener(changes => {
	for (let key in changes) {
		store[key] = changes[key].newValue
	}
})

export async function init() {
	console.log('init storage')
	return new Promise(resolve => {
		chrome.storage.local.get(async (res) => {
			Object.assign(store, res)
			resolve(store)
		})
	})
}

export async function set(key:string|object, value?:any) {
	return new Promise(resolve => {
		if (typeof key === 'string') {
			chrome.storage.local.set({ [key]: value } as any, resolve)
		} else if (typeof key === 'object') {
			chrome.storage.local.set(key, resolve)
		} else {
			resolve()
		}
	})
}


export async function parseAudioFile(file:File|Blob, force = false) {
	let audio:AudioData = store.audio
	if (force || !audio || !audio.waveform) {
		console.log('parse audio file')
		audio = await parseAudio(file)
	}
	if (store.show && audio.duration) {
		store.show.duration = Math.max(store.show.duration, audio.duration)
		await set('show', store.show)
	}
	cache.audio = file
	await set('audio', audio)
	return audio
}

export async function parseAudio(file:File|Blob|ArrayBuffer):Promise<AudioData> {
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
			console.log('decoded audio', [res])
			const data = res.getChannelData(0)
			if (res.numberOfChannels == 2) {
				const data2 = res.getChannelData(1)
				for (let i in data) {
					data[i] = (data[i] + data2[i]) / 2
				}
			}
			console.log('getting music tempo')
			const { beats } = new MusicTempo(data) as {beats:Float32Array}
			resolve({
				name,
				url: URL.createObjectURL(file),
				beats: [...new Uint32Array(beats.map(v => v * 1000))],
				duration: Math.round(res.duration * 1000),
				waveform: parseWaveform(data, res.duration * 100)
			} as AudioData)
		}, reject)
	})
}

export function parseWaveform(audioData:Float32Array, width:number):WaveformData[] {
	const step = Math.round(audioData.length / width)
	const waveformData:WaveformData[] = []
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
				Math.round(sumPositive / kPositive * 100),
				Math.round(sumNegative / kNegative * 100),
				Math.round(maxPositive * 100),
				Math.round(maxNegative * 100)
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

export async function parseShowFile(file:File|Blob) {
	if (file instanceof File)
		file = new Blob([file])
	console.log('parse show file')
	const body = await file.text()
	const res:any = JSON.parse(body)

	if (res.LIGHT_MASTER) {
		return await set({ show_selected: res.selected, show: res })
	}

	const show:ShowData = Object.assign(store.show || {}, {
		LIGHT_MASTER: true,
		tracks: parseShowTracks(res.tracks)
	})
	set({ show_selected: show.selected, show })
}

export function parseShowTracks(tracks:any[]) {
	function rgb({ r, g, b }:{r:number, g:number, b:number}) {
		return [r, g, b].map(v => Math.round(v * 255))
	}
	function hex(num:number) {
		return num.toString(16).padStart(2, '0').toUpperCase()
	}
	function frame({ type, startTime: start, endTime: end, color, colorEnd, colorStart, period, spacing, ratio }:any) {
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
	return tracks.map(({ name, trackType: type, device, elements }:any) => {
		return {
			type,
			name,
			device,
			frames: (elements || []).map(frame)
		}
	})
}

export async function openShowEntry(entry:FileEntry) {
	if (!entry) return
	return new Promise(async(resolve, reject) => {
		console.log(`open show file`, [entry.fullPath])
		if (entry.name.toUpperCase().endsWith('LMP')) {
			await set('show_file', chrome['fileSystem'].retainEntry(entry))
		} else {
			await set('show_file', '')
		}
		entry.file(file => {
			unzip(file, (err, zip) => {
				if (err) reject(err)
				zip.readEntries(( entries) => {
					let ended = 0
					entries.forEach(entry => {
						const { name } = entry
						zip.readEntryData(entry, false, (err, stream) => {
							if (err) reject(err)
							let content:Uint8Array[] = []
							stream.on('data', (data:Uint8Array) => {
								content.push(data)
							})
							stream.on('end', async () => {
								if (name == 'show.json') {
									const file = new Blob(content)
									await set('show', JSON.parse(await file.text()))
									await set('show_selected', store.show.selected)
								} else if (name == 'audio.json') {
									const file = new Blob(content)
									await set('audio', JSON.parse(await file.text()))
								} else if (name == 'project.lt3') {
									cache.show = new Blob(content)
									await parseShowFile(cache.show)
								} else if (name.endsWith('.mp3')) {
									cache.audio = new Blob(content, { type: 'audio/mp3' })
									await parseAudioFile(cache.audio)
								}
								if (++ended === entries.length) {
									resolve()
								}
							})
						})
					})
				}, reject)
			})
		})
	})
}

export async function saveShowEntry(entry:FileEntry) {
	if (!entry) return
	if (entry.fullPath.toUpperCase().endsWith('LMP')) {
		await set('show_file', chrome['fileSystem'].retainEntry(entry))
	} else {
		await set('show_file', '')
	}
	return new Promise(resolve => {
		chrome.storage.local.get(['show', 'audio'], ({ show, audio, show_selected }) => {
			entry.createWriter(async (writer:FileWriter) => {
				const zip = new JSZip()
				show.selected = show_selected
				if (show) zip.file('show.json', JSON.stringify(show))
				if (audio) zip.file('audio.json', JSON.stringify(audio))
				if (cache.audio) zip.file('audio.mp3', cache.audio)
				zip.generateAsync({ type: 'blob' }).then(content => {
					writer.write(content)
					writer.addEventListener('writeend', () => {
						resolve()
						console.log(`save show file`, [entry.fullPath])
					})
				})
			})
		})
	})
}

interface Frame {
	type:number
	start:number
	duration?:number
	transition?:number
	r?:number
	g?:number
	b?:number
}

export function createBinaryFrame({ type, start, duration, transition, r, g, b }:Frame) {
	const data = new Uint8Array(16)
	const view = new DataView(data.buffer)
	view.setUint8(0, type)
	view.setUint8(1, r)
	view.setUint8(2, g)
	view.setUint8(3, b)
	view.setUint32(4, start, true)
	view.setUint32(8, duration, true)
	view.setUint32(12, transition, true)
	return data
}

export function createColorFrame(start:number, duration:number, transition:number, r:number, g:number, b:number) {
	return createBinaryFrame({ type: 1, start, duration, transition, r, g, b })
}

export function createEndFrame(start:number) {
	return createBinaryFrame({ type: 2, start })
}

export function createLoopFrame(start:number, duration:number) {
	return createBinaryFrame({ type: 3, start, duration })
}

function hex2rgb(hex:string): [number, number, number] {
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
				createEndFrame(period),
				createColorFrame(period, 0, 0, ...hex2rgb(color[0]))
			]
		case 5: // rainbow
			return [
				createColorFrame(start, duration, 0, 0, 0, 0)
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
	tracks.forEach((track, index) => {
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
	console.log(data.map((c:number) => c.toString(16).padStart(2, '0')).join(' '))
}


window['convert'] = convertTracks
