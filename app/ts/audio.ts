// import MusicTempo from 'music-tempo'

const AudioContext = window['AudioContext'] || window['webkitAudioContext']

function handleError(e) {
	console.error(e)
}

export const player: HTMLAudioElement = document.createElement('audio')

export function waveformData(waveData:number[], duration:number):any[] {
	const step = Math.round(waveData.length / duration);
	const data:any[] = []
	let x = 0,
		sumPositive = 0,
		sumNegative = 0,
		maxPositive = 0,
		maxNegative = 0,
		kNegative = 0,
		kPositive = 0,
		drawIdx = step;
	for (let i = 0; i < waveData.length; i++) {
		if (i == drawIdx) {
			data.push([
				Math.round(sumPositive / kPositive * 100), 
				Math.round(sumNegative / kNegative * 100),
				Math.round(maxPositive * 100),
				Math.round(maxNegative * 100)
			])
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
	return data
}

export async function parseAudio(file:File): Promise<ShowAudio> {
	const result:ShowAudio = {}
	player.src = URL.createObjectURL(file)
	return new Promise(resolve => {
		const ctx = new AudioContext()
		const reader = new FileReader()
		reader.readAsArrayBuffer(file)
		reader.addEventListener('loadend', e => {
			console.log(`decoding ${file.type}...`)
			if (reader.result) {
				const data = reader.result as ArrayBuffer
				function handle(audio) {
					const { sampleRate, duration } = audio
					// const channels: any[] = []
					// for (let i = 0; i < audio.numberOfChannels; i++) {
					// 	const data = audio.getChannelData(i)
					// 	const { tempo, beats, peaks, spectralFlux: flux, ...other } = new MusicTempo(data)
					// 	beats.forEach((t, i, b) => (b[i] = Math.round(t * 1000)))
					// 	channels[i] = { data, beats, tempo }
					// }
					const d = audio.getChannelData(0)
					result.duration = duration
					result.sampleRate = sampleRate
					result.waveform = waveformData(d, duration * 10)
					resolve(result)
				}
				if ('chrome' in window) {
					ctx.decodeAudioData(data).catch(handleError).then(handle)
				} else {
					ctx.decodeAudioData(data, handle, handleError)
				}
			}
		})
	})
}

