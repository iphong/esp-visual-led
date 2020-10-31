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
	serial_port: string
	serial_connection: number
	serial_connected: boolean
	show_file: string
	show_sync: true
	show_selected: 1,
	show: ShowData
	audio: AudioData
}

declare interface CacheData {
	audio: file,
	show: file
}

declare function map(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number
declare function constrain(value: number, min: number, max: number): number
