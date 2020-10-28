import MusicTempo from 'music-tempo'

const AudioContext = window['AudioContext'] || window['webkitAudioContext']

export const player: HTMLAudioElement = document.createElement('audio')

export function waveformData(waveData:Float32Array, duration:number):any[] {
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

export async function parseAudio(file:File|Blob): Promise<ShowAudio> {
	return new Promise(async (resolve, reject) => {
		const audio:ShowAudio = {}
		const ctx = new AudioContext()
		ctx.decodeAudioData(await (new Blob([file]).arrayBuffer()), function(result) {
			const data = result.getChannelData(0)
			const { sampleRate, duration } = result
			const { beats } = new MusicTempo(data)
			audio.beats = beats.map(t => Math.round(t * 1000))
			audio.duration = Math.round(duration * 1000)
			audio.sampleRate = sampleRate
			audio.waveform = waveformData(data, duration * 10)
			resolve(audio)
		}, reject)
	})
}

