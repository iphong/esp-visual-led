const AudioContext = window['AudioContext'] || window['webkitAudioContext']

function parseAudio(file) {
	return new Promise(resolve => {
		const ctx = new AudioContext()
		const reader = new FileReader()
		reader.readAsArrayBuffer(file)
		reader.addEventListener('loadend', e => {
			console.debug(`decoding ${file.type}...`)
			ctx.decodeAudioData(reader.result).catch(handleError).then(audio => {
				console.append("OK")
				Object.assign(AUDIO, {
					id: CONFIG.show,
					filename: file.name,
					duration: audio.duration,
					sampleRate: audio.sampleRate,
					tempo: 0,
					beats: 0,
					channels: []
				})
				for (let i = 0 ; i < audio.numberOfChannels ; i++) {
					const { tempo, beats } = new MusicTempo(audio.getChannelData(i))
					AUDIO.channels[i] = { tempo, beats }
					AUDIO.tempo += parseInt((tempo))
					AUDIO.beats += beats.length
					console.info(`-- @${i + 1}: ${beats.length} beats, TEMPO: ${tempo} BPM`)
				}
				AUDIO.tempo /= audio.numberOfChannels
				AUDIO.beats /= audio.numberOfChannels
				renderAudio()
				saveAudioConfig()
				resolve(AUDIO)
			})
		})
	})
}
function saveAudioConfig(id = CONFIG.show, data = AUDIO) {
	return uploadFile(`show/${id}.json`, JSON.stringify(AUDIO))
}
function loadAudioConfig(id = CONFIG.show, data = AUDIO) {
	return get(`show/${id}.json`).then(res => {
		Object.assign(data, res)
		renderAudio()
	})
}
function saveLightShow(id = CONFIG.show, data = AUDIO) {
	return new Promise(resolve => {
		SHOWS[0] = createSequenceFromBeats(AUDIO.channels[0].beats, 0)
		SHOWS[1] = createSequenceFromBeats(AUDIO.channels[1].beats, 1)
		uploadFile(`show/${CONFIG.show}A.lsb`, SHOWS[0])
			.then(() => uploadFile(`show/${CONFIG.show}B.lsb`, SHOWS[1]))
			.then(() => resolve(SHOWS))
	})
}
function createSequenceFromBeats(beats, channel = 0) {
	let seq = `C 0 ${Math.round(beats[0] * 1000)} 0 0 0 0\n`
	seq += beats.map((time, index) => {
		if (index + 1 < beats.length) {
			const start = Math.round(time * 1000)
			const dur = Math.round((beats[index + 1] - time) * 1000)
			const dur1 = Math.round(dur * AUDIO.ratio)
			const dur2 = dur - dur1
			let color, color2
			if ((index + channel) % 2) {
				color = hexToIntString(AUDIO.color1)
				color2 = hexToIntString(AUDIO.color2)
			} else {
				color = hexToIntString(AUDIO.color2)
				color = hexToIntString(AUDIO.color2)
				color2 = hexToIntString(AUDIO.color1)
			}
			return [
				`C ${start} ${dur1} 0 ${color}`,
				`C ${start + dur1} ${dur2} 0 ${color2}`
			].join('\n')
		}
	}).join('\n')
	return seq
}
function hexToIntString(hex) {
	hex = hex.replace(/[^0-9a-f]+/gi, '')
	return [
		parseInt(hex.slice(0, 2), 16),
		parseInt(hex.slice(2, 4), 16),
		parseInt(hex.slice(4, 6), 16)
	].join(' ')
}
