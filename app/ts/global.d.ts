declare namespace chrome {
	const app: any
	const serial: any
	const storage: any
}

declare namespace window {}

declare interface EventTarget extends EventTarget {
	closest(...args:any): any
}
declare interface HTMLSelectElement extends HTMLSelectElement {
	value: string|number
}

declare interface Track {
	[key: string]: any
}

declare interface TrackData {
	[key:string]: any
}

declare type WaveformData = [
	number, // average positive
	number, // average negative
	number, // max positive
	number,  // max negative
]

declare interface AudioData {
	name?: string
	duration?: number
	tempo?: number
	beats?: number[]
	waveform?: WaveformData[]
}

declare interface ShowData {
	[key:string]: any
}

declare interface StoreData {

	port: string
	connection: number
	connected: boolean

	sync: boolean
	file: string
	time: number
	slot: number
	duration: number
	paused: boolean
	ended: boolean

	tempo: number
	division: number

	beats: number[]
	tracks: TrackData[]
	waveform: WaveformData[]

	show: ShowData
	audio: AudioData
}

declare interface CacheData {
	audio: file,
	show: file
}

declare function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number
declare function constrain(value: number, min: number, max: number): number
