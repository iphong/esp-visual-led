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
			$node.classList.add('node')
			$node.innerHTML = node.id
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
