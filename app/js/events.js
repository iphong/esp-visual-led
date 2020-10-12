import { $, call, setProp } from "./api"
import { render, renderHead, renderNodes } from "./app"
import { AUDIO, CONFIG, SHOW } from "./data"
import { send, sendFile, sendSync } from "./ws"

const { parseAudio, renderAudio } = require("./audio")
const { parseLSF, parseLTP, parseIPX } = require("./light")

export function handleError() {
	console.error(...arguments)
}

async function handleFile(file, event) {
	CONFIG.syncing = false
	send('#>STOP')
	console.debug(`select file: ${file.name}`)
	if (file.name.endsWith('.bin')) {
		await uploadFile('firmware/' + filename, file)
	} else if (file.name.endsWith('.ltp')) {
		setAttr('#player', 'src', ``)
		await parseLTP(file)
		await render()
	} else if (file.name.endsWith('.lsf')) {
		const data = await parseLSF(file)
		const target = event.target.dataset.device
		
		// await sendFile(target, `/show/${CONFIG.show}A.lsb`, new Blob(data[0]))
		const sync = !!target
		if (data.length == 1) {
			await uploadFile(`/show/${CONFIG.show}A.lsb`, new Blob(data[0]), sync, target);
			await uploadFile(`/show/${CONFIG.show}B.lsb`, new Blob(data[0]), sync, target);
		} else if (data.length === 3) {
			await uploadFile(`/show/${CONFIG.show}A.lsb`, new Blob(data[1]), sync, target);
			await uploadFile(`/show/${CONFIG.show}B.lsb`, new Blob(data[2]), sync, target);
		}
	} else if (file.name.endsWith('.ipx')) {
		await parseIPX(file)
	} else if (file.type.startsWith('audio')) {
		await parseAudio(file)
		await renderAudio()
	} else {
		console.error('unsupported file format')
	}
	CONFIG.syncing = true
}

function handleChange(e) {
	if (e.type === 'change' && e.target.id === 'select-file') {
		for (let file of e.target.files) {
			handleFile(file)
		}
	}
}

async function handleClick(e) {
	if (e.target.dataset.device) {
		CONFIG.nodes.forEach(node => {
			if (node.id == e.target.dataset.device) {
				node.selected = !node.selected
				send(e.target.dataset.device, 'BLINK', node.selected ? 1 : 0, 2)
			}
		})
		renderNodes()
	} else if (e.target.dataset.show) {
		CONFIG.show = parseInt(e.target.dataset.show) || 0
		// await post(`show?id=${CONFIG.show}`)
		render()
	} else if (e.target.dataset.action) {
		switch (e.target.dataset.action) {
			case 'show-file-select-dialog':
				click('#select-file')
				break
			case 'show-start':
				call('#player', 'play')
				break
			case 'show-stop':
				call('#player', 'pause')
				setProp('#player', 'currentTime', 0)
				CONFIG.running = 0
				CONFIG.paused = 0
				send('#>STOP')
				break
		}
	}
}
function handleDragOver(e) {
	e.preventDefault()
	const droppable = e.target.closest('[data-dropppable]')
	if (droppable) {
		droppable.classList.add('active')
	}
}
function handleDragLeave(e) {
	e.preventDefault()
	const droppable = e.target.closest('[data-dropppable]')
	if (droppable) {
		droppable.classList.remove('active')
	}
}
function handleDragDrop(e) {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		handleFile(file, e)
	}
}

function handleScroll(e) {

}
async function fetchData() {
	Object.assign(CONFIG, await get('stat'))
	// Object.assign(SHOW, await get(`show?id=${CONFIG.show}`))
}
async function handleInit() {
	await fetchData()
	await render()
}

let audio;
async function handlePlay(e) {
	audio = e.target
	CONFIG.running = 1
	CONFIG.paused = 0
	CONFIG.time = 0
	renderHead()
}
async function handlePlaying(e) {
	audio = e.target
	CONFIG.paused = 0
	renderHead()
}
async function handlePause(e) {
	audio = e.target
	CONFIG.paused = 1
	renderHead()
}
async function handleEnd(e) {
	audio = e.target
	CONFIG.running = 0
	CONFIG.time = 0
	renderHead()
}
async function handleTimeUpdate(e) {
	// audio = e.target
}

setTimeout(async function sync() {
	if (audio && CONFIG.syncing) {
		CONFIG.time = Math.round(audio.currentTime * 1000)
		await sendSync()
	}
	setTimeout(sync, 1000)
})

const $timeline = $('.timeline')
requestAnimationFrame(function draw() {
	if (audio) {
		const ratio = audio.currentTime / audio.duration
		$timeline.forEach(el => {
			el.scrollLeft = el.scrollWidth * ratio
			// el.style.transform = `translateX(-${ratio*100}%)`
		})
	}
	requestAnimationFrame(draw)
})

window.addEventListener('scroll', handleScroll, true)
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
window.addEventListener('seeked', handleTimeUpdate, true)
window.addEventListener('seeking', handlePause, true)
window.addEventListener('end', handleEnd, true)

window.addEventListener('touchstart', new Function(), true)

window.addEventListener('load', handleInit)



