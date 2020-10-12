import { $ } from "./api"
import { renderAudio } from "./audio"
import { AUDIO, CONFIG, SHOW } from "./data"
import { renderShow } from "./light"

export function renderHead() {
	$('#toolbar').forEach(el => {
		if (CONFIG.running) {
			el.innerHTML = `
			<button data-action="show-stop">STOP SHOW</button>
			`
		} else if (AUDIO.file) {
			el.innerHTML = `
			<button data-action="show-start">START SHOW</button>
			`
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
			const name = node.name || node.id
			$node.classList.add('node')
			if (node.selected) $node.classList.add('selected')
			if (node.hidden) $node.setAttribute('hidden', true)
			$node.innerHTML = `<div>${node.name}</div><small>${(node.vbat / 1000).toFixed(1)}v</small>`
			$node.dataset.device = node.id
			$node.dataset.droppable = true
			section.appendChild($node)
		})
	})
}

export async function render() {
	renderHead()
	renderNodes();
	renderShow()
	renderAudio()
}
