import { $ } from "./api"
import { renderAudio } from "./audio"
import { AUDIO, CONFIG, SHOW } from "./data"
import { renderShow } from "./light"

export function renderHead() {
	$('#toolbar').forEach(el => {
		if (CONFIG.running) {
			el.innerHTML = `<button data-action="show-stop">STOP</button>`
			if (CONFIG.paused)
				el.innerHTML += `<button data-action="show-resume">RESUME</button>`
			else
				el.innerHTML += `<button data-action="show-pause">PAUSE</button>`
		} else if (AUDIO.file) {
			el.innerHTML = `<button data-action="show-add">ADD</button>`
			el.innerHTML += `<button data-action="show-start">START</button>`
		} else {
			el.innerHTML = `<button data-action="show-add">ADD</button>`
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
			const batt = Math.max(Math.round((node.vbat - 3300) / 700 * 100), 0)
			$node.classList.add('node')
			$node.dataset.droppable = true
			if (node.selected) $node.classList.add('selected')
			if (node.hidden) $node.setAttribute('hidden', true)
			$node.innerHTML = `
			<small>${node.id}</small>
			<div>${node.name}</div>
			<progress value="${batt}" max="100"></progress>
			`
			$node.dataset.device = node.id
			$node.dataset.droppable = true
			section.appendChild($node)
		})
	})
}

export async function render() {
	renderHead()
	renderNodes()
	renderShow()
	renderAudio()
}
