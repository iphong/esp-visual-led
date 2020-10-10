import { renderAudio } from "./audio"
import { renderShow } from "./light"

export function renderHead() {
	const { id, ip, mac, brightness, channel, show } = CONFIG
	setText('#id', id)
	setText('#ip', ip)
	setText('#mac', mac)
}
export function renderNodes() {
	$('section.nodes').forEach(section => {
		section.innerHTML = ''
		CONFIG.nodes.forEach(node => {
			const $node = document.createElement('article')
			const name = node.name || node.id
			$node.classList.add('node')
			$node.innerHTML = `<div>${name}</div><small>${(node.vbat/1000).toFixed(1)}v</small>`
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
