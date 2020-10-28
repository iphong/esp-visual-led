import { openShowEntry } from "./controller"
import { renderAudio, renderShow } from "./view"

export const store: any = {
	serial_port: '',
	serial_connection: 0,
	serial_connected: true,
	show_selected: 1,
	show: {},
	audio: {},
	file: ''
}

export const cache: any = {}

export async function set(key: string, value: any) {
	store[key] = value
	return new Promise(resolve => {
		chrome.storage.local.set(store, () => {
			console.log(`SET`, key, '=', value)
			resolve(value)
		})
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
