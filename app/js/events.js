import debounce from "lodash/debounce"
import { $, call, get, setProp, setText, uploadFile, fetchFile, formatTime, sendCommand } from "./api"
import { render, renderHead, renderNodes, checkNodes, selectShow } from "./app"
import { AUDIO, CONFIG, SHOW } from "./data"
import { send, sendSync } from "./ws"
import * as actions from './action'

const { parseAudio, renderAudio } = require("./audio")
const { parseLSF, parseLTP, parseIPX, renderShow } = require("./light")

export function handleError() {
	console.error(...arguments)
}

export async function handleFile(file, event) {
	if (CONFIG.running) {
		call('#player', 'pause')
		setProp('#player', 'currentTime', 0)
		await handleEnd()
	}
	console.debug(`select file: ${file.name}`)
	if (file.name.endsWith('.bin')) {
		await uploadFile('firmware/' + filename, file)
	} else if (file.name.endsWith('.ltp')) {
		const show = JSON.stringify(await parseLTP(file))
		await render()
		await uploadFile(`show/${CONFIG.show}.json`, show);
		await uploadFile(`show/${CONFIG.show}.mp3`, AUDIO.file);
	} else if (file.name.endsWith('.lsf')) {
		const data = await parseLSF(file)
		let target = event.target.closest('[data-device]')
		target && (target = target.dataset.device)
		if (target) {
			SHOW.map[target] = file.name
			await uploadFile(`/show/${CONFIG.show}.json`, new Blob([JSON.stringify(SHOW)]))
		}
		for (let id in SHOW.map) {
			if (SHOW.map[id] == file.name) {
				if (data.length == 1) {
					await uploadFile(`/show/${CONFIG.show}A.lsb`, new Blob(data[0]), true, id);
					await uploadFile(`/show/${CONFIG.show}B.lsb`, new Blob(data[0]), true, id);
				} else if (data.length === 3) {
					await uploadFile(`/show/${CONFIG.show}A.lsb`, new Blob(data[1]), true, id);
					await uploadFile(`/show/${CONFIG.show}B.lsb`, new Blob(data[2]), true, id);
				}
			}
		}
	} else if (file.name.endsWith('.ipx')) {
		await parseIPX(file)
	} else if (file.type.startsWith('audio')) {
		await parseAudio(file)
		await renderAudio()
	} else {
		console.error('unsupported file format')
	}
}

export async function handleChange(e) {
	if (e.type === 'change' && e.target.id === 'select-file') {
		for (let file of e.target.files) {
			await handleFile(file)
		}
	}
}

export async function handleClick(e) {
	const { show, action, command, bytes } = e.target.dataset
	if (e.target.closest('[data-device]')) {
		const target = e.target.closest('[data-device]')
		CONFIG.nodes.forEach(node => {
			if (node.id == target.dataset.device) {
				node.selected = !node.selected
				if (node.selected) send(node.id, 'BLINK', 5)
				else send(node.id, 'BLINK', 0)
			}
		})
		renderNodes()
	}
	if (e.target.dataset.show) {
		selectShow(parseInt(e.target.dataset.show) || 0)
	}
	if (action) {
		if (typeof actions[action] !== 'function') {
			console.error(`ACTION ${action}() is undefined.`)
		} else {
			actions[action].call(e.target, e)
		}
	}
	if (e.target.dataset.command) {
		let rest = []
		try { rest = eval(`[${e.target.dataset.body || ''}]`) } catch (e) { console.log(e) }
		sendCommand(e.target.dataset.command, ...rest)
	}
}
function handleDragOver(e) {
	e.preventDefault()
	const droppable = e.target.closest('[data-droppable]')
	if (droppable) {
		droppable.classList.add('active')
	}
}
function handleDragLeave(e) {
	e.preventDefault()
	const droppable = e.target.closest('[data-droppable]')
	if (droppable) {
		droppable.classList.remove('active')
	}
}
export async function handleDragDrop(e) {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		await handleFile(file, e)
	}
}

let scrolling = false;
let scrollEnded = 0;
const scrollStart = debounce(() => {
	if (Date.now() - scrollEnded > 10) {
		scrolling = true
		if (CONFIG.running && !CONFIG.paused) call('#player', 'pause')
	}
}, 300, { leading: true })
const scrollEnd = debounce(() => {
	$('#player').forEach(player => {
		player.play()
	})
	scrolling = false
	scrollEnded = Date.now();
}, 300, { trailing: true })

function handleScroll(e) {
	if (CONFIG.running && e.target.closest('.timeline')) {
		scrollStart()
		$('.timeline').forEach(timeline => {
			const ratio = timeline.scrollLeft / (timeline.scrollWidth - timeline.offsetWidth)
			$('#player').forEach(player => {
				player.currentTime = (SHOW.params.end / 1000) * ratio
			})
		})

		scrollEnd()
	}
}

let audio;
export async function handlePlay(e) {
	// console.log('play')
	audio = e.target
	CONFIG.paused = 0
	CONFIG.running = 1
	renderHead()
	handleTimeUpdate(e)
}
export async function handlePlaying(e) {
	console.log('playing')
	audio = e.target
	CONFIG.paused = 0
	CONFIG.running = 1
	renderHead()
	handleTimeUpdate(e)
}
export async function handlePause(e) {
	console.log('paused')
	audio = e.target
	if (e.target.currentTime === e.target.duration) {
		handleEnd(e)
	} else {
		CONFIG.paused = 1
		renderHead()
		handleTimeUpdate(e)
	}
}
export async function handleStart() {
	console.log('start')
	CONFIG.running = 1
	await sendCommand('begin')
	call('#player', 'play')
}
export async function handleEnd() {
	console.log('ended')
	CONFIG.running = 0
	CONFIG.paused = 0
	CONFIG.time = 0
	sendCommand('end')
	renderHead()
	handleTimeUpdate()
}
export async function handleTimeSeeking(e) {
	audio = e.target
	// console.log('seeking')
}
export async function handleTimeSeeked(e) {
	audio = e.target
	// console.log('seeked')
	if (scrolling) return
	const timeline = $('.timeline')
	if (timeline) {
		const ratio = e.currentTime / (SHOW.params.end / 1000)
		$timeline.forEach(el => {
			el.scrollLeft = (el.scrollWidth - el.offsetWidth) * ratio
			const $handle = el.querySelector('.handle')
			if ($handle) {
				$handle.style.left = Math.round(el.offsetWidth * ratio) + 'px'
				$handle.style.top = el.offsetTop + 'px'
				$handle.style.height = el.offsetHeight + 'px'
			}
		})
	}
}

export async function handleTimeUpdate() {
	audio && setText('#time', formatTime(audio.currentTime))
}

setTimeout(async function sync() {
	if (audio && CONFIG.syncing) {
		CONFIG.time = Math.min(Math.round(audio.currentTime * 1000), SHOW.params.end)
		await sendSync()
	}
	setTimeout(sync, 100)
})
const $timeline = $('.timeline')
requestAnimationFrame(function draw() {
	if (audio && CONFIG.running && !CONFIG.paused) {
		const ratio = audio.currentTime / (SHOW.params.end / 1000)
		handleTimeUpdate()
		$timeline.forEach(el => {
			el.scrollLeft = (el.scrollWidth - el.offsetWidth) * ratio
			const $handle = el.querySelector('.handle')
			if ($handle) {
				$handle.style.left = Math.round(el.offsetWidth * ratio) + 'px'
				$handle.style.top = el.offsetTop + 'px'
				$handle.style.height = el.offsetHeight + 'px'
			}
			// el.style.transform = `translateX(-${ratio*100}%)`
		})
	}
	requestAnimationFrame(draw)
})

export async function handleInit() {
	Object.assign(CONFIG, await get('stat'))
	// setTimeout(() => selectShow(CONFIG.show), 1000)
	setInterval(checkNodes, 1000)
}

window.addEventListener('mousewheel', handleScroll, true)
window.addEventListener('dragover', handleDragOver, true)
window.addEventListener('dragleave', handleDragLeave, true)
window.addEventListener('drop', handleDragDrop, true)

window.addEventListener('change', handleChange, true)
window.addEventListener('input', handleChange, true)
window.addEventListener('click', handleClick, true)

window.addEventListener('play', handlePlay, true)
window.addEventListener('pause', handlePause, true)
window.addEventListener('playing', handlePlaying, true)
window.addEventListener('timeupdate', handleTimeUpdate, true)
window.addEventListener('seeked', handleTimeSeeked, true)
window.addEventListener('seeking', handleTimeSeeking, true)
window.addEventListener('end', handleEnd, true)

window.addEventListener('touchstart', new Function(), true)

window.addEventListener('load', handleInit)



