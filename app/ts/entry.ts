Object.defineProperty(window, 'localStorage', { value: null })

import { loadData, set, store } from './model'
import { renderDevicesList, renderSerial, updateTime } from './view'
import { decode } from './socket'
import * as actions from './controller'
import { restoreShow, serialConnect } from './controller'
import { player } from './audio'

Object.assign(window, actions)

addEventListener('click', (e: MouseEvent) => {
	if (e.target) {
		const actionTarget = e.target.closest('*[data-action]')
		if (actionTarget) {
			const { action } = actionTarget.dataset
			if (typeof actions[action] === 'function') {
				actions[action].call(actionTarget, e)
			}
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

addEventListener('load', async () => {
	await loadData()
	await renderDevicesList()
	await renderSerial()
	if (store.serial_connection_id) {
		await serialConnect()
	}
	if (store.show_data) {
		await restoreShow()
	}
})

addEventListener('wheel', (e) => {
	player.currentTime = Math.max(0, Math.min(player.duration, player.currentTime + (e.deltaX / 100)))
})

chrome.serial.onReceive.addListener(async ({ connectionId: id, data }) => {
	if (id === store.serial_connection_id)
		(new Uint8Array(data)).forEach(decode)
})

chrome.serial.onReceiveError.addListener(async ({ connectionId: id, error }) => {
	if (id === store.serial_connection_id) {
		console.log("serial closed:", error)
		set('serial_connection_id', 0)
		renderSerial()
	}
})

setInterval(() => renderDevicesList, 5000)

requestAnimationFrame(function tick(){
	updateTime()
	requestAnimationFrame(tick)
})
