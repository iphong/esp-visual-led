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
	number,  // max nagative
]

declare interface AudioData {
	[key:string]: any // For dev only remove if production
	name: string
	duration: number
	beats: number[]
	waveform: WaveformData[]
	url: string
}

declare interface ShowData {
	[key:string]: any
}

declare interface StoreData {
	[key:string]: any // For dev only remove if production
	serial_port: string
	serial_connection: number
	serial_connected: boolean
	show_selected: number
	show_duration: number
	show_tracks: TrackData[]
	show_file: string
	show: ShowData
	audio: AudioData
}

declare interface CacheData {
	audio: file,
	show: file
}

declare function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number
declare function constrain(value: number, min: number, max: number): number
