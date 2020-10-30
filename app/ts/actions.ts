import { sendCommand, serialConnect } from './serial'
import { set, store, openShowEntry, saveShowEntry, cache, convertFrame, createEndFrame } from './store'
import { $player, renderShow, updateSize, updateTime } from './view'

export async function newShow() {
	cache.audio = null
	cache.show = null
	$player.currentTime = 0
	await updateSize()
	await updateTime()
	$player.src = ''
	await set({
		show: null, 
		audio: null,
		show_file: '',
		show_duration: 0,
		show_tracks: []
	})
}

export { logHex } from './store'

export async function startShow() {
	await $player.play()
}

export async function stopShow() {
	await $player.play()
	$player.currentTime = $player.duration
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

export { serialConnect, serialDisconnect, sendCommand, sendRaw } from './serial'

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