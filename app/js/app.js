import { $, map, constrain } from "./api"
import { AUDIO, CONFIG, SHOW } from "./data"
import { renderAudio } from "./audio"
import { renderShow } from "./light"
import { handleEnd } from "./events"

export function renderHead() {
	$('[data-show]').forEach(el => {
		if (parseInt(el.dataset.show) === CONFIG.show) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	$('#toolbar').forEach(el => {
		el.innerHTML = ``
		if (CONFIG.running) {
			// el.innerHTML = `<button data-action="show-stop">STOP</button>`
			el.innerHTML += `<span id="time"></span>`
			if (CONFIG.paused)
				el.innerHTML += `<button data-action="resumeShow">PLAY</button>`
			else
				el.innerHTML += `<button data-action="pauseShow">PAUSE</button>`
		} else if (AUDIO.file) {
			el.innerHTML += `<button data-action="startShow">START</button>`
		} else {
			el.innerHTML += `<button data-action="openFile">UPLOAD</button>`
		}
	})
	// const { id, ip, mac, brightness, channel, show } = CONFIG
	// setText('#id', id)
	// setText('#ip', ip)
	// setText('#mac', mac)
}
export function renderNodes() {
	$('section.nodes').forEach(section => {
		section.innerHTML = ''
		CONFIG.nodes.sort((a, b) => {
			if (a.name > b.name) return 1
			if (a.name < b.name) return -1
			return 0
		}).forEach(node => { 	
			const $node = document.createElement('article')
			const vbat = node.hidden ? 0 : node.vbat / 1000
			const percent = constrain(map(vbat, 3.0, 4.1, 0, 100), 0, 100)
			$node.classList.add('node')
			$node.dataset.droppable = true
			if (node.selected) $node.classList.add('selected')
			if (node.hidden) $node.classList.add('hidden')
			$node.innerHTML = `
			<small>${node.id}</small>
			<div>${node.name}</div>
			<small>${vbat.toPrecision(2)}v ${percent.toFixed(0)}%</small>
			<progress value="${percent.toFixed(0)}" max="100"></progress>
			`
			$node.dataset.device = node.id
			$node.dataset.droppable = true
			section.appendChild($node)
		})
	})
}

export async function checkNodes() {
	try {
		const expired = Date.now() - 15000;
		let changed
		CONFIG.nodes.forEach(node => {
			if (!node.hidden && node.lastUpdated < expired) {
				node.hidden = true
				node.selected = false
				changed = true
			}
		})
		if (changed) renderNodes()
	} catch (e) { }
}

let fetchRequest
export async function selectShow(id) {
	if (fetchRequest) {
		fetchRequest.cancel()
	}
	handleEnd()
	CONFIG.show = id
	Object.assign(SHOW, { map: {}, tracks: [], params: {} })
	AUDIO.file = null
	setText('.tracks', '')
	render()
	fetchRequest = fetchFile(`show?id=${id}`)
	fetchRequest.then(async (file) => {
		Object.assign(SHOW, JSON.parse(await file.text()))
		renderShow()
		fetchRequest = fetchFile(`show/${id}.mp3`)
		fetchRequest.then(async (file) => {
			fetchRequest = null
			AUDIO.file = file
			renderAudio()
			renderHead()
		}).catch(e => {
			fetchRequest = null
		})
	}).catch(e => {
		fetchRequest = null
	})
}

export async function render() {
	renderHead()
	renderNodes()
	renderShow()
	renderAudio()
}

Object.assign(global, {
	render,
	renderAudio,
	renderHead,
	renderNodes,
	renderShow
})
