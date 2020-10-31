import { init, set, store, openShowEntry, parseAudioFile, parseShowFile, cache } from './store'
import { $player, renderAudio, renderSerial, renderShow, updateTime } from './view'
import { decodeMsg, encodeMsg, sendSync, sendRaw } from './serial'
import { serialConnect } from './serial'
import * as actions from './actions'
import $ from 'jquery'

Object.assign(window, actions)
window['player'] = $player

function render() {
	document.querySelectorAll('[data-key]').forEach((control:any) => {
		const key = control.dataset.key
		if ((control instanceof HTMLInputElement) || (control instanceof HTMLSelectElement)) {
			if (control.type === 'checkbox') {
				control['checked'] = store[key]
			} else
				control.value = store[key]
		} else {
			if (control instanceof HTMLButtonElement) {
				if (store[key]) {
					control.classList.add('selected')
				} else {
					control.classList.remove('selected')
				}
			}
		}
	})
}

chrome.serial.onReceiveError.addListener( ({ connectionId: id }) => {
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
		$('#toggle-sync').removeAttr('hidden')
		$('#serial-connect').attr('hidden', 'true')
		$('#serial-dev-select').attr('hidden', 'true')
	} else {
		$('#open-manager').attr('hidden', 'true')
		$('#open-remote').attr('hidden', 'true')
		$('#open-tools').attr('hidden', 'true')
		$('#serial-connect').removeAttr('hidden')
		$('#serial-disconnect').attr('hidden', 'true')
		$('#toggle-sync').attr('hidden', 'true')
		$('#serial-dev-select').removeAttr('hidden')
	}
}

chrome.storage.onChanged.addListener(async (changes) => {
	if ('serial_connected' in changes) {
		updateSerialView()
	}
	if ('show_sync' in changes) {
		$('#toggle-sync')[store.show_sync ? 'addClass' : 'removeClass']('mdi-spin')
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
	render()
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
	render();
	if (store.show_file) {
		chrome['fileSystem'].restoreEntry(store.show_file, async (entry:FileEntry) => {
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
			render()
		})
	}
	requestAnimationFrame(function tick() {
		updateTime()
		requestAnimationFrame(tick)
	})
	setInterval(() => {
		if (store.show_sync) {
			sendSync(Math.round($player.currentTime * 1000), store.show_selected, !store.show.running, $player.paused)
		}
	}, 100)
})

addEventListener('click', async (e:MouseEvent) => {
	if (e.target.closest('*[data-action]')) {
		let actionTarget = e.target.closest('*[data-action]')
		if (actionTarget) {
			const { action } = actionTarget.dataset
			if (typeof actions[action] === 'function') {
				actions[action].call(actionTarget, e)
			}
		}
	}
	if (e.target.closest('*[data-key]')) {
		let actionTarget = e.target.closest('*[data-key]')
		if (actionTarget && actionTarget instanceof HTMLButtonElement) {
			const { key } = actionTarget.dataset
			await set(key, !store[key])
		}
	}
})

addEventListener('change', async (e) => {
	if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
		const { key } = e.target.dataset
		if (key) {
			if (e.target.type === 'checkbox') {
				await set(key, e.target['checked'])
			} else {
				await set(key, e.target.value)
			}
		}
	}
})

addEventListener('dragover', async (e) => {
	e.preventDefault()
})

addEventListener('drop', async (e:DragEvent) => {
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
