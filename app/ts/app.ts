Object.defineProperty(window, 'localStorage', { value: null })

import { loadData, set, store } from './model'
import { renderDevicesList, renderSerial, updateTime } from './view'
import { player } from './audio'
import { decodeMsg, encodeMsg } from './socket'
import * as actions from './controller'
import { serialConnect } from './controller'

Object.assign(window, actions)
window['store'] = store

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
addEventListener('canplaythrough', updateTime)
addEventListener('load', async () => {
	await loadData()
	await renderDevicesList()
	if (store.serial_connection) {
		await serialConnect()
	} else {
		await renderSerial()
	}
	if (store.show_file) {
		chrome['fileSystem'].restoreEntry(store.show_file, (entry: FileEntry) => {
			if (entry)
				actions.openShowEntry(entry)
		})
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
			await actions.handleAudioFile(file, true)
			updateTime()
		}
		if (file.name.endsWith('ltp') || file.name.endsWith('json')) {
			actions.handleJsonFile(file)
		}
	}
})

addEventListener('wheel', (e) => {
	if (player.duration) {
		const delta = (e.deltaX + e.deltaY) / 2
		player.currentTime = Math.max(0, Math.min(player.duration, player.currentTime + (delta / 100)))
	}
})

addEventListener('keydown', (e) => {
	switch (e.key) {
		case ' ':
			player.paused || player.ended ? player.play() : player.pause()
			break
		case 'ArrowLeft':
			player.currentTime -= 0.1
			break
		case 'ArrowRight':
			player.currentTime += 0.1
			break
		case 'ArrowUp':
			player.volume = Math.min(player.volume + 0.1, 1)
			break
		case 'ArrowDown':
			player.volume = Math.max(player.volume - 0.1, 0)
			break
	}
})

chrome.serial.onReceive.addListener(async ({ connectionId: id, data }) => {
	if (id === store.serial_connection)
		(new Uint8Array(data)).forEach(decodeMsg)
})

chrome.serial.onReceiveError.addListener(async ({ connectionId: id, error }) => {
	if (id === store.serial_connection) {
		console.log("serial closed:", error)
		await set('serial_connection', 0)
		await set('serial_connected', false)
		await renderSerial()
		await renderDevicesList()
	}
})

setInterval(actions.syncShow, 1000)

requestAnimationFrame(function tick() {
	updateTime()
	requestAnimationFrame(tick)
})

addEventListener('message', e => {
	const type = e.data[0]
	const data = e.data.slice(1)
	switch (type) {
		case 0:
			actions.serialSend(data)
			break
		case 1:
			actions.serialSend(encodeMsg(data))
			break
		case 2:
			actions.serialSend(encodeMsg([35, 62, ...data]))
			break
	}
})
