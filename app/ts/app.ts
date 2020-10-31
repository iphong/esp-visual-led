import { init, set, store, openShowEntry, parseAudioFile, parseShowFile, cache } from './store'
import { $player, renderAudio, renderSerial, renderShow, updateTime } from './view'
import { decodeMsg, encodeMsg, sendSync, sendRaw } from './serial'
import { serialConnect } from './serial'
import * as actions from './actions'
import $ from 'jquery'

Object.assign(window, actions)
window['player'] = $player

chrome.serial.onReceiveError.addListener(async ({ connectionId: id }) => {
	if (id === store.serial_connection) {
		const current = chrome.app.window.current()
		chrome.app.window.getAll().forEach(view => {
			if (view !== current) view.close()
		})
	}
})

function updateSerialView() {
	if (store.serial_connected) {
		$('#open-manager').removeAttr('hidden')
		$('#open-remote').removeAttr('hidden')
		$('#open-tools').removeAttr('hidden')
		$('#serial-disconnect').removeAttr('hidden')
		$('#serial-connect').attr('hidden', 'true')
		$('#serial-dev-select').attr('hidden', 'true')
	} else {
		$('#open-manager').attr('hidden', 'true')
		$('#open-remote').attr('hidden', 'true')
		$('#open-tools').attr('hidden', 'true')
		$('#serial-connect').removeAttr('hidden')
		$('#serial-disconnect').attr('hidden', 'true')
		$('#serial-dev-select').removeAttr('hidden')
	}
}

chrome.storage.onChanged.addListener(async (changes) => {
	if ('serial_connected' in changes) {
		updateSerialView()
	}
	if ('audio' in changes) {
		await renderAudio(changes.audio.newValue)
	}
	if ('show' in changes) {
		await renderShow(changes.show.newValue)
	}
	if ('serial' in changes) {
		await renderSerial()
	}
})

addEventListener('load', async () => {
	await init()
	if (store.serial_connected) {
		await serialConnect()
	} else {
		await renderSerial()
	}
	updateSerialView()
	await renderShow(store.show)
	await renderAudio(store.audio)
	if (store.show_file) {
		chrome['fileSystem'].restoreEntry(store.show_file, async (entry: FileEntry) => {
			if (entry) {
				await openShowEntry(entry)
				if (cache.audio) {
					$player.src = URL.createObjectURL(cache.audio)
					console.log('set player src', [$player.src])
				}
			} else {
				console.log('unable to restore show entry', [store.show_file])
				await set('show_file', '')
			}
			await renderShow(store.show)
			await renderAudio(store.audio)
		})
	}
	requestAnimationFrame(function tick() {
		updateTime()
		requestAnimationFrame(tick)
	})
	setInterval(() => {
		if ($player.duration) {
			sendSync(Math.round($player.currentTime * 1000), store.show.selected, !store.show.running, $player.paused)
		}
	}, 100)
})

addEventListener('click', (e: MouseEvent) => {
	if (e.target) {
		const actionTarget = e.target.closest('*[data-action]')
		if (actionTarget) {
			const { action } = actionTarget.dataset
			if (typeof actions[action] === 'function') {
				actions[action].call(actionTarget, e)
			}
			actionTarget.blur()
		}
	}
})

addEventListener('change', async (e) => {
	if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
		const { key } = e.target.dataset
		if (key) {
			set(key, e.target.value)
		}
	}
})

addEventListener('dragover', async (e) => {
	e.preventDefault()
})

addEventListener('drop', async (e: DragEvent) => {
	e.preventDefault()
	if (!e.dataTransfer) return
	for (let file of e.dataTransfer.files) {
		if (file.type.startsWith('audio/')) {
			await parseAudioFile(file, true)
			cache.audio = file
			$player.src = URL.createObjectURL(cache.audio)
			console.log('set player src', [$player.src])
			await updateTime()
		}
		if (file.name.endsWith('lt3')) {
			await parseShowFile(file)
		}
	}
})

addEventListener('wheel', (e) => {
	if ($player.duration) {
		const delta = (e.deltaX + e.deltaY) / 2
		$player.currentTime = Math.max(0, Math.min($player.duration, $player.currentTime + (delta / (e.altKey ? 200 : 10))))
	}
})

addEventListener('keydown', (e) => {
	switch (e.key) {
		case ' ':
			$player.paused || $player.ended ? $player.play() : $player.pause()
			break
		case 'ArrowLeft':
			$player.currentTime -= e.altKey ? 0.01 : 1
			break
		case 'ArrowRight':
			$player.currentTime += e.altKey ? 0.01 : 1
			break
		case 'ArrowUp':
			$player.volume = Math.min($player.volume + 0.1, 1)
			break
		case 'ArrowDown':
			$player.volume = Math.max($player.volume - 0.1, 0)
			break
	}
})

addEventListener('message', e => {
	const type = e.data[0]
	const data = e.data.slice(1)
	switch (type) {
		case 0:
			sendRaw(data)
			break
		case 1:
			sendRaw(encodeMsg(data))
			break
		case 2:
			sendRaw(encodeMsg([35, 62, ...data]))
			break
	}
})
