import { openShowEntry } from "./controller"
import { renderAudio, renderShow } from "./view"

export const store: any = {
	serial_port: '',
	serial_connection: 0,
	serial_connected: true,
	show_selected: 1,
	show_duration: 60000,
	show_tracks: [],
	show: {},
	audio: {},
	file: ''
}

export const cache: any = {}

export async function set(key: string|object, value?: any) {
	return new Promise(resolve => {
		if (typeof key === 'string') {
			console.log(`SET`, key, '=', value)
			store[key] = value
		} else if (typeof key === 'object') {
			console.log(`SET`, Object.entries(key))
			Object.assign(store, key)
		}
		chrome.storage.local.set(store, resolve)
	})
}

export async function loadData() {
	return new Promise(resolve => {
		chrome.storage.local.get(async (res) => {
			Object.assign(store, res)
			resolve(store)
		})
	})
}

chrome.storage.onChanged.addListener((changes) => {
	for (let key in changes) {
		store[key] = changes[key].newValue
	}
	if ('show' in changes) {
		renderShow(store.show)
	}
	if ('audio' in changes) {
		renderAudio(store.audio)
	}
})
