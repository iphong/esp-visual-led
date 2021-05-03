import { sendFile, serialConnect, serialDisconnect } from './serial'
export * from './serial'
import {
	set,
	store,
	cache,
	openShowEntry,
	saveShowEntry,
	convertTracks,
	DEFAULT_STORE_DATA
} from './store'
import { $player } from './view'

export { logHex } from './store'

export async function clear() {
	$player.src = ''
	cache.audio = null
	cache.show = null
	await set({ ...DEFAULT_STORE_DATA })
}
export async function save() {
	return new Promise(async (resolve) => {
		if (store.file) {
			chrome['fileSystem'].restoreEntry(store.file, async (entry: FileEntry) => {
				if (entry) await saveShowEntry(entry)
				resolve(null)
			})
		} else await saveAs()
	})
}
export async function saveAs() {
	return new Promise(async (resolve) => {
		chrome['fileSystem'].chooseEntry({ type: 'saveFile' }, async (entry: FileEntry) => {
			if (entry) await saveShowEntry(entry)
			resolve(null)
		})
	})
}

export async function open() {
	return new Promise((resolve) => {
		chrome['fileSystem'].chooseEntry({ type: 'openWritableFile' }, async (entry: FileEntry) => {
			if (entry) {
				await clear()
				await openShowEntry(entry)
				if (cache.audio) {
					$player.src = URL.createObjectURL(cache.audio)
					console.log('set player src', [$player.src])
				}
				resolve(null)
			} else {
				resolve(null)
			}
		})
	})
}
export async function connect() {
	if (store.connected)
		await serialDisconnect()
	else
		await serialConnect()
}
export function openManager() {
	chrome['app'].window.create('../manager.html', {
		id: 'manager',
		width: 800,
		height: 200
	})
}
export function openUtils() {
	chrome['app'].window.create('../utils.html', {
		id: 'utils',
		width: 270,
		height: 400
	})
}
export function openRemote() {
	chrome['app'].window.create('../remote.html', {
		id: 'remote',
		width: 250,
		height: 250
	})
}
export async function uploadShowHandle() {
	await uploadFile(createLightShowBinaryFile(0), `/show/${store.slot}${store.channel}.lsb`)
}

const NODE_ADDR = '10.1.1.1'
const NODE_PORT = '11111'

export async function uploadFile(file: Blob, path: string) {
	return new Promise((resolve, reject) => {
		if (!file || !path) throw 'Missing file or path'
		if (!path.startsWith("/")) path = "/" + path;
		let req = new XMLHttpRequest();
		var form = new FormData();
		form.append("data", file, path);
		req.open("POST", `http://${NODE_ADDR}:${NODE_PORT}/edit`, true);
		req.send(form);
		req.addEventListener('load', e => {
			console.debug('upload completed.')
			resolve(null)
		})
		req.addEventListener('error', e => {
			console.debug('upload error.')
			reject(e)
		})
	})
}

export function createLightShowBinaryFile(trackIndex: number) {
	return new Blob(convertTracks(store.tracks[trackIndex].frames))
}
