import { handleError } from "./events"

const AudioContext = window['AudioContext'] || window['webkitAudioContext']

export async function parseAudio(file) {
	return new Promise(resolve => {
		const ctx = new AudioContext()
		const reader = new FileReader()
		reader.readAsArrayBuffer(file)
		reader.addEventListener('loadend', e => {
			console.log(`decoding ${file.type}...`)
			function handle(audio) {
				const { sampleRate, duration } = audio
				const channels = []
				for (let i = 0; i < audio.numberOfChannels; i++) {
					const data = audio.getChannelData(i)
					const { tempo, beats, peaks, spectralFlux: flux, ...other } = new MusicTempo(data)
					beats.forEach((t, i, b) => (b[i] = Math.round(t * 1000)))
					channels[i] = { data, beats, tempo }
				}
				resolve(Object.assign(AUDIO, { duration, channels }))
			}
			if ('chrome' in window) {
				ctx.decodeAudioData(reader.result).catch(handleError).then(handle)
			} else {
				ctx.decodeAudioData(reader.result, handle, handleError)
			}
		})
	})
}

export async function renderAudio() {
	if (AUDIO.file) {
		$('.track.waveform').forEach(el => (el.innerHTML = '<div class="loading">Loading...</div>'))
		renderWaveform(await parseAudio(AUDIO.file))
		setAttr('#player', 'src', URL.createObjectURL(AUDIO.file))
	} else {
		setAttr('#player', 'src', '')
		$('.track.waveform').forEach(el => (el.innerHTML = ''))
	}
}

export async function renderWaveform() {
	$('.track.waveform').forEach((wrapper, index) => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext("2d");
		const waveData = AUDIO.channels[index].data
		const height = 80;
		const width = AUDIO.duration * 20
		const halfHeight = height / 2;
		const length = waveData.length;
		const step = Math.round(length / width);

		wrapper.innerHTML = ''
		wrapper.appendChild(canvas)
		
		canvas.width = width;
		canvas.height = height;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";
		canvas.style.left = Math.round(wrapper.clientWidth / 2) + "px";

		let x = 0,
			sumPositive = 0,
			sumNegative = 0,
			maxPositive = 0,
			maxNegative = 0,
			kNegative = 0,
			kPositive = 0,
			drawIdx = step;
		for (let i = 0; i < length; i++) {
			if (i == drawIdx) {
				const p1 = maxNegative * halfHeight + halfHeight;
				ctx.strokeStyle = '#333333';
				ctx.strokeRect(x, p1, 1, (maxPositive * halfHeight + halfHeight) - p1);

				const p2 = sumNegative / kNegative * halfHeight + halfHeight;
				ctx.strokeStyle = '#eeeeee';
				ctx.strokeRect(x, p2, 1, (sumPositive / kPositive * halfHeight + halfHeight) - p2);
				x++;
				drawIdx += step;
				sumPositive = 0;
				sumNegative = 0;
				maxPositive = 0;
				maxNegative = 0;
				kNegative = 0;
				kPositive = 0;
			} else {
				if (waveData[i] < 0) {
					sumNegative += waveData[i];
					kNegative++;
					if (maxNegative > waveData[i]) maxNegative = waveData[i];
				} else {
					sumPositive += waveData[i];
					kPositive++;
					if (maxPositive < waveData[i]) maxPositive = waveData[i];
				}

			}
		}
	})
}


// let ab
// global.getWaveformData = function getWaveformData(audio) {
// 	const data = audio.getChannelData(0)
// 	const size = audio.sampleRate / 10
// 	const total = audio.duration * 10
// 	const array = new Int8Array(total * 2)
// 	for (let i = 0 ; i < total ; i++) {
// 		let min = 1, max = -1
// 		const offset = i * size
// 		for (let a = 0 ; a < size ; a++) {
// 			min = Math.min(min, data[offset + a])
// 			max = Math.max(max, data[offset + a])
// 		}
// 		array[offset * 2] = min * 127
// 		array[offset * 2 + 1] = max * 127
// 	}
// }
// global.parseAudio = function parseAudio(file) {
// 	AUDIO.filename = file.name
// 	renderAudio()
// 	return new Promise(resolve => {
// 		const ctx = new AudioContext()
// 		const reader = new FileReader()
// 		reader.readAsArrayBuffer(file)
// 		reader.addEventListener('loadend', e => {
// 			console.debug(`decoding ${file.type}...`)
// 			const handle = audio => {
// 				// getWaveformData(audio)
// 				console.append('OK')
// 				Object.assign(AUDIO, {
// 					id: CONFIG.show,
// 					url: URL.createObjectURL(file),
// 					filename: file.name,
// 					duration: Math.round(audio.duration * 1000) / 1000,
// 					sampleRate: audio.sampleRate,
// 					tempo: 0,
// 					beats: 0,
// 					channels: []
// 				})
// 				for (let i = 0 ; i < audio.numberOfChannels ; i++) {
// 					const { tempo, beats } = new MusicTempo(audio.getChannelData(i))
// 					beats.forEach((t, i, b) => {
// 						b[i] = Math.round(t*1000)
// 					})
// 					AUDIO.channels[i] = { 
// 						tempo,
// 						beats,
// 						delay: beats[0],
// 						end: beats[beats.length - 1]
// 					}
// 					AUDIO.tempo += parseInt((tempo))
// 					AUDIO.beats += beats.length
// 					console.info(`-- @${i + 1}: ${beats.length} beats, TEMPO: ${tempo} BPM`)
// 				}
// 				AUDIO.tempo /= audio.numberOfChannels
// 				AUDIO.beats /= audio.numberOfChannels
// 				renderAudio()
// 				saveAudioConfig().then(resolve)
// 			}
// 			if ('chrome' in window) {
// 				ctx.decodeAudioData(reader.result).catch(handleError).then(handle)
// 			} else {
// 				ctx.decodeAudioData(reader.result, handle, handleError)
// 			}
// 		})
// 	})
// }
// global.saveAudioConfig = function saveAudioConfig(id = CONFIG.show, data = AUDIO) {
// 	return uploadFile(`/show/${id}.json`, JSON.stringify(AUDIO))
// }
// global.loadAudioConfig = function loadAudioConfig(id = CONFIG.show, data = AUDIO) {
// 	return get(`show/${id}.json`)
// 		.then(res => {
// 			Object.assign(data, res)
// 			renderAudio()
// 		})
// 		.catch(() => {
// 			Object.assign(data, AUDIO_DEFAULT)
// 			renderAudio()
// 		})
// }
// global.saveLightShow = function saveLightShow(id = CONFIG.show, data = AUDIO) {
// 	return new Promise(resolve => {
// 		// SHOWS[0] = createLoop(0, AUDIO.channels[0], AUDIO.tempo)
// 		// SHOWS[1] = createLoop(1, AUDIO.channels[1], AUDIO.tempo)
// 		SHOWS[0] = createSequenceFromBeats(AUDIO.channels[0].beats, 0)
// 		SHOWS[1] = createSequenceFromBeats(AUDIO.channels[1].beats, 1)
// 		return uploadFile(`/show/${CONFIG.show}A.lsb`, SHOWS[0])
// 			.then(() => uploadFile(`/show/${CONFIG.show}B.lsb`, SHOWS[1]))
// 			.then(() => resolve(SHOWS))
// 	})
// }
// global.clearLightShow = function clearLightShow(id = CONFIG.show, data = AUDIO) {
// 	return new Promise(resolve => {
// 		return request('DELETE', `show/${CONFIG.show}.json`)
// 			.finally(() => request('DELETE', `/show/${CONFIG.show}A.lsb`))
// 			.finally(() => request('DELETE', `/show/${CONFIG.show}B.lsb`))
// 			.finally(resolve)
// 	})
// }

// global.createLoop = function createLoop(index, channel, tempo) {
// 	const delay = channel.delay
// 	const end = channel.end
// 	const dur = Math.ceil(1000 / (tempo / 60))
// 	const dur1 = Math.round(dur * AUDIO.ratio)
// 	const dur2 = dur - dur1
// 	const fade1 = Math.round(dur1 * 1)
// 	const fade2 = Math.round(dur2 * 1)
// 	let color1 = hexToIntString(AUDIO.color1)
// 	let color2 = hexToIntString(AUDIO.color2)
// 	if (AUDIO.swap && index % 2) {
// 		color1 = hexToIntString(AUDIO.color2)
// 		color2 = hexToIntString(AUDIO.color1)
// 	}
// 	return [
// 		`C 0 ${delay} 0 0 0 0`,
// 		`L ${delay} ${end - delay}`,
// 		`	C 0 ${dur1} ${fade1} ${color1}`,
// 		`	C ${dur1} ${dur2} ${fade2} ${color2}`,
// 		`	E ${dur}`,
// 		`E ${end}`
// 	].join('\n')
// }
// global.createSequenceFromBeats = function createSequenceFromBeats(beats, channel = 0) {
// 	let seq = `C 0 ${beats[0]} 0 0 0 0\n`
// 	seq += beats.map((time, index) => {
// 		if (index + 1 < beats.length) {
// 			const start = Math.round(time)
// 			const dur = Math.round((beats[index + 1] - time))
// 			const dur1 = Math.round(dur * AUDIO.ratio)
// 			const dur2 = dur - dur1
// 			const fade1 = Math.round(dur1 * 1)
// 			const fade2 = Math.round(dur2 * 1)
// 			let color1 = hexToIntString(AUDIO.color1)
// 			let color2 = hexToIntString(AUDIO.color2)
// 			if (AUDIO.swap && channel % 2) {
// 				return [
// 					`C ${start} ${dur1} ${fade1} ${color2}`,
// 					`C ${start + dur1} ${dur2} ${fade2} ${color1}`
// 				].join('\n')
// 			} else {
// 				return [
// 					`C ${start} ${dur1} ${fade1} ${color1}`,
// 					`C ${start + dur1} ${dur2} ${fade2} ${color2}`
// 				].join('\n')
// 			}
// 		}
// 	}).join('\n')
// 	seq += `E ${beats[beats.length-1]}`
// 	return seq
// }
// global.hexToIntString = function hexToIntString(hex) {
// 	hex = hex.replace(/[^0-9a-f]+/gi, '')
// 	return [
// 		parseInt(hex.slice(0, 2), 16),
// 		parseInt(hex.slice(2, 4), 16),
// 		parseInt(hex.slice(4, 6), 16)
// 	].join(' ')
// }
