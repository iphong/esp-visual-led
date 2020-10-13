import { debounce } from "lodash"
import { $, call, get, setProp, uploadFile } from "./api"
import { render, renderHead, renderNodes } from "./app"
import { CONFIG, SHOW } from "./data"
import { send, sendSync } from "./ws"

const { parseAudio, renderAudio } = require("./audio")
const { parseLSF, parseLTP, parseIPX } = require("./light")

export function handleError() {
	console.error(...arguments)
}

async function handleFile(file, event) {
	if (CONFIG.running) await handleEnd()
	console.debug(`select file: ${file.name}`)
	if (file.name.endsWith('.bin')) {
		await uploadFile('firmware/' + filename, file)
	} else if (file.name.endsWith('.ltp')) {
		setAttr('#player', 'src', ``)
		await parseLTP(file)
		await render()
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

async function handleChange(e) {
	if (e.type === 'change' && e.target.id === 'select-file') {
		for (let file of e.target.files) {
			await handleFile(file)
		}
	}
}

async function handleClick(e) {
	if (e.target.closest('[data-device]')) {
		const target = e.target.closest('[data-device]')
		CONFIG.nodes.forEach(node => {
			if (node.id == target.dataset.device) {
				node.selected = !node.selected
				send(target.dataset.device, 'BLINK', node.selected ? 1 : 0, 2)
			}
		})
		renderNodes()
	} else if (e.target.dataset.show) {
		selectShow(parseInt(e.target.dataset.show) || 0)
	} else if (e.target.dataset.action) {
		switch (e.target.dataset.action) {
			case 'show-add':
				click('#select-file')
				break
			case 'show-start':
				handleStart()
				break
			case 'show-pause':
				call('#player', 'pause')
				break
			case 'show-resume':
				call('#player', 'play')
				break
			case 'show-stop':
				call('#player', 'pause')
				setProp('#player', 'currentTime', 0)
				handleEnd()
				break
		}
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
async function handleDragDrop(e) {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		await handleFile(file, e)
	}
}

const scrollStart = debounce(() => {
	if (CONFIG.running) call('#player', 'pause')
}, 500, { leading: true })
const scrollEnd = debounce(() => {
	if (CONFIG.running) call('#player', 'play')
}, 500, { trailing: true })

function handleScroll(e) {
	scrollStart()
	const timeline = e.target.closest('.timeline')
	if (timeline) {
		const ratio = timeline.scrollLeft / timeline.scrollWidth
		if (CONFIG.running) {
			$('#player').forEach(player => {
				player.currentTime = player.duration * ratio
			})
		}
	}
	scrollEnd()
}
async function fetchData() {
	Object.assign(CONFIG, await get('stat'))
	selectShow(CONFIG.show)
	// Object.assign(SHOW, await get(`show?id=${CONFIG.show}`))
}
async function handleInit() {
	await fetchData()
	await render()
}

let audio;
async function handlePlay(e) {
	console.log('play')
	audio = e.target
	CONFIG.paused = 0
	renderHead()
}
async function handlePlaying(e) {
	console.log('playing')
	audio = e.target
	CONFIG.running = 1
	renderHead()
}
async function handlePause(e) {
	console.log('paused')
	audio = e.target
	if (e.target.currentTime === e.target.duration) {
		handleEnd(e)
	} else {
		CONFIG.paused = 1
		renderHead()
	}
}
async function handleStart() {
	console.log('start')
	setProp('#player', 'currentTime', 0)
	call('#player', 'play')
}
async function handleEnd() {
	console.log('end')
	CONFIG.running = 0
	CONFIG.paused = 0
	CONFIG.time = 0
	await send('#>END')
	renderHead()
}
async function handleTimeUpdate(e) {
	// audio = e.target
}
async function selectShow(id) {
	if (CONFIG.show !== id) {
		await post(`show?id=${id}`)
	}
	CONFIG.show = id
	try {
		Object.assign(SHOW, await get(`/show/${id}.json`))
	} catch(e) {}
	await render()
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
	if (audio && !CONFIG.paused) {
		const ratio = audio.currentTime / audio.duration
		$timeline.forEach(el => {
			el.scrollLeft = el.scrollWidth * ratio
			// el.style.transform = `translateX(-${ratio*100}%)`
		})
	}
	requestAnimationFrame(draw)
})

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
window.addEventListener('seeked', handleTimeUpdate, true)
// window.addEventListener('seeking', handlePause, true)
window.addEventListener('end', handleEnd, true)

window.addEventListener('touchstart', new Function(), true)

window.addEventListener('load', handleInit)



