
import { init, set, store, parseAudioFile, parseShowFile, cache, openShowEntry } from './store'
import { $player, $tracks, renderBeats, renderSerial, renderTimeline, renderTracks, renderWaveform, updateSize, updateTime } from './view'
import { encodeMsg, sendRaw, sendSync } from './serial'
import { serialConnect } from './serial'
import * as actions from './actions'
import $ from 'jquery'
import { openRemote, openUtils } from './actions'

Object.assign(window, actions)
window['player'] = $player

function update() {
	document.querySelectorAll('[data-key]').forEach((control: any) => {
		const key = control.dataset.key
		if ((control instanceof HTMLInputElement) || (control instanceof HTMLSelectElement)) {
			if (control.type === 'checkbox') {
				control['checked'] = store[key]
			} else
				control.value = store[key]
		} else {
			if (control instanceof HTMLButtonElement) {
				let selected = !!store[key]
				if (control.hasAttribute('value')) {
					selected = store[key] == control.getAttribute('value')
				}
				control.classList[selected ? 'add' : 'remove']('selected')
			}
		}
	})
}
chrome.serial.onReceiveError.addListener(({ connectionId: id }) => {
	if (id === store.serial_connection) {
		const current = chrome.app.window.current()
		chrome.app.window.getAll().forEach(view => {
			if (view !== current) view.close()
		})
	}
})

chrome.storage.onChanged.addListener(async (changes) => {
	update()
	if (changes.port || changes.connection || changes.connected) {
		await renderSerial()
	}
	if (changes.waveform || changes.beats) {
		await renderWaveform()
		await renderBeats()
	}
	if (changes.tracks) {
		await renderTracks()
	}
})

addEventListener('load', async () => {
	await init()
	await update()
	store.connected ? await serialConnect(true) : await renderSerial()
	await renderTracks()
	await renderWaveform()
	await renderBeats()
	requestAnimationFrame(function tick() {
		updateTime()
		requestAnimationFrame(tick)
	})
	setInterval(renderSerial, 1000)
	setInterval(() => {
		if (store.sync) {
			sendSync(store.time, store.slot, store.ended, store.paused)
		}
	}, 100)
	if (store.file) {
		chrome['fileSystem'].restoreEntry(store.file, async (entry: FileEntry) => {
			if (entry) {
				await openShowEntry(entry)
				if (cache.audio) {
					$player.src = URL.createObjectURL(cache.audio)
					console.debug('set player src')
					await renderTimeline()
					await renderTracks()
					await renderWaveform()
					await renderBeats()
				}
			} else {
				console.debug('unable to restore show entry', [store.file])
				await set('file', '')
			}
		})
	}
})

addEventListener('pause', async e => {
	store.paused = true
	store.ended = false
}, true)

addEventListener('play', async e => {
	store.paused = false
	store.ended = false
}, true)

addEventListener('ended', async e => {
	store.paused = false
	store.ended = true
}, true)

addEventListener('durationchange', async e => {
	await set('duration', Math.max($player.duration * 1000, store.duration))
	// store.duration = Math.max($player.duration * 1000, store.duration)
	await updateSize()
}, true)

addEventListener('click', async (e: MouseEvent) => {
	const target = e.target as HTMLElement
	if (target.closest('*[data-key]')) {
		let actionTarget = target.closest('*[data-key]') as HTMLElement
		if (actionTarget && actionTarget instanceof HTMLButtonElement) {
			const { key } = actionTarget.dataset
			let value:any = !store[key]
			if (actionTarget.hasAttribute('value')) {
				value = actionTarget.getAttribute('value')
			}
			await set(key, value)
		}
	}
	if (target.closest('*[data-action]')) {
		let actionTarget = target.closest('*[data-action]') as HTMLElement
		if (actionTarget) {
			const { action } = actionTarget.dataset
			if (typeof actions[action] === 'function') {
				const prevContent = actionTarget.innerHTML
				const prevClassNames = actionTarget.getAttribute('class')
				actionTarget.setAttribute('class', 'mdi mdi-loading mdi-spin')
				actionTarget.innerHTML = ''
				actionTarget.setAttribute('disabled', 'true')
				
				try {
					await actions[action].call(actionTarget, e)
					actionTarget.style.color = ''
				} catch(err) {
					actionTarget.style.color = 'red'
				}

				actionTarget.setAttribute('class', prevClassNames)
				actionTarget.innerHTML = prevContent
				actionTarget.removeAttribute('disabled')
			}
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

addEventListener('drop', async (e: DragEvent) => {
	e.preventDefault()
	if (!e.dataTransfer) return
	for (let file of e.dataTransfer.files) {
		if (file.type.startsWith('audio/')) {
			const audio = await parseAudioFile(file)
			if (audio) {
				cache.audio = file
				$player.src = URL.createObjectURL(file)
				console.debug('set player src')
			}
		}
		if (file.name.endsWith('lt3')) {
			const show = await parseShowFile(file)
			if (show) await set(show)
		}
	}
})

addEventListener('wheel', (e) => {
	const delta = (e.deltaX + e.deltaY) / 2
	if ($player.src) $player.currentTime = Math.max(0, Math.min(store.duration / 1000, $player.currentTime + (delta / (e.altKey ? 200 : 10))))
	else store.time = Math.max(0, Math.min(store.duration, store.time + (delta * (e.altKey ? 200 : 10))))
})

addEventListener('mousedown', (e) => {
	const $track = e.target.closest('.track')
	if ($track) {
		const $selected = $track.parentElement.querySelector('.selected')
		if ($selected) {
			$selected.classList.remove('selected')
		}
		$track.classList.add('selected')
		$track.focus()
	}
})

addEventListener('keydown', (e) => {
	e.preventDefault()
	switch (e.key) {
		case ' ':
			store.ended || $player.paused ? actions.play() : $player.pause()
			// $player.paused || $player.ended ? $player.play() : $player.pause()
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
