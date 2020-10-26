interface window {
	[key:string]: any
}
interface chrome {
	[key:string]: any
}
declare function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number
declare function constrain(value: number, min: number, max: number): number
interface EventTarget {
	closest(...args:any): any
}
type UploadFile = File|Blob

interface Track {
	[key: string]: any
}

interface ShowAudio {
	file?: File,
	filename?: string
	duration?: number
	sampleRate?: number
	waveform?: [number, number][]
}

interface ShowData {
	filename?: string
	params: {
		[key: string]: any
	},
	tracks: Track[],
	images: Blob[],
	audio: ShowAudio
}
