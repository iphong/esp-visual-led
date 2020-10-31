import { sendFile } from './serial'
import { set, store, openShowEntry, saveShowEntry, cache, convertTracks, DEFAULT_STORE_DATA } from './store'
import { $player, renderShow, updateSize, updateTime } from './view'

export async function newShow() {
	$player.currentTime = 0
	await updateSize()
	await updateTime()
	$player.src = ''
	await set(Object.assign({}, DEFAULT_STORE_DATA))
}

export { logHex } from './store'

export async function startShow() {
	store.show.running = true
	await $player.play()
}

export async function stopShow() {
	store.show.running = false
	$player.pause()
	$player.currentTime = 0
}

export async function saveShow() {
	return new Promise(async (resolve) => {
		if (store.show_file) {
			chrome['fileSystem'].restoreEntry( store.show_file, async (entry:FileEntry) => {
				await saveShowEntry(entry)
				resolve()
			})
		} else {
			chrome['fileSystem'].chooseEntry({ type: 'saveFile' }, async (entry:FileEntry) => {
				await saveShowEntry(entry)
				resolve()
			})
		}
	})
}

export async function openShow() {
	return new Promise(resolve => {
		chrome['fileSystem'].chooseEntry({ type: 'openWritableFile' }, async (entry:FileEntry) => {
			await newShow()
			await renderShow(await openShowEntry(entry))

			if (cache.audio) {
				$player.src = URL.createObjectURL(cache.audio)
				console.log('set player src', [$player.src])
			}
			resolve()
		})
	})
}
export async function sendShowFile() {
	let index = 1
	await sendFile(new Blob(convertTracks(store.show.tracks[index].frames)), '/show/5A.lsb')
	await sendFile(new Blob(convertTracks(store.show.tracks[index].frames)), '/show/5B.lsb')
}
export function openManager() {
	chrome['app'].window.create('../manager.html', {
		id: 'manager',
		width: 800,
		height: 200
	});
}
export function openUtils() {
	chrome['app'].window.create('../utils.html', {
		id: 'utils',
		width: 270,
		height: 370
	});
}
export function openRemote() {
	chrome['app'].window.create('../remote.html', {
		id: 'remote',
		width: 250,
		height: 250
	});
}

export * from './serial'