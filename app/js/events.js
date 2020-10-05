import { render } from "./app"
import { send } from "./ws"

const { parseAudio, renderAudio } = require("./audio")
const { parseLSF, parseLTP, parseIPX, renderShow } = require("./light")


export function handleError() {
	console.error(...arguments)
}

async function handleFile(file, event) {
	console.debug(`select file: ${file.name}`)
	if (file.name.endsWith('.bin')) {
		await uploadFile('firmware/' + filename, file)
	} else if (file.name.endsWith('.ltp')) {
		await parseLTP(file)
		await render()
	} else if (file.name.endsWith('.lsf')) {
		const data = await parseLSF(file)
		const target = event.target.dataset.device
		const sync = !!target
		if (data.length == 1) {
			await uploadFile(`show/${CONFIG.show}A.lsb`, new Blob(data[0]), sync, target);
			await uploadFile(`show/${CONFIG.show}B.lsb`, new Blob(data[0]), sync, target);
		} else if (data.length === 3) {
			await uploadFile(`show/${CONFIG.show}A.lsb`, new Blob(data[1]), sync, target);
			await uploadFile(`show/${CONFIG.show}B.lsb`, new Blob(data[2]), sync, target);
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
function handleChange(e) {
	if (e.type === 'change' && e.target.id === 'select-file') {
		for (let file of e.target.files) {
			handleFile(file)
		}
	}
}
async function handleClick(e) {
	if (e.target.dataset.device) {
		if (e.target.classList.has('selected')) {
			e.target.classList.remove('selected')
			send('#>BLINK-' + e.target.dataset.device)
		} else {
			e.target.classList.add('selected')
			send('#>BLINK+1' + e.target.dataset.device)
		}
	} else if (e.target.dataset.show) {
		CONFIG.show = parseInt(e.target.dataset.show) || 0
		await post(`show?id=${CONFIG.show}`)
		await renderShow()
	} else if (e.target.dataset.action) {
		switch (e.target.dataset.action) {
			case 'show-file-select-dialog':
				click('#select-file')
				break
		}
	} else if (e.target.dataset.command) {
		await post(`exec?cmd=${e.target.dataset.command}`)
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
	CONFIG.nodes = await get('nodes')
	Object.assign(SHOW, await get(`show?id=${CONFIG.show}`))
}
async function handleInit() {
	await fetchData()
	await render()
}

window.addEventListener('scroll', handleScroll, true)
window.addEventListener('dragover', handleDragOver, true)
window.addEventListener('dragleave', handleDragLeave, true)
window.addEventListener('drop', handleDragDrop, true)

window.addEventListener('change', handleChange, true)
window.addEventListener('input', handleChange, true)
window.addEventListener('click', handleClick, true)
window.addEventListener('touchstart', new Function(), true)

window.addEventListener('load', handleInit)
