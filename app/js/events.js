import { renderLight, renderNodes, renderWaveform } from "./app"

const { fetchData, post, uploadFile, get, loadNodes } = require("./api")
const { parseAudio } = require("./audio")
const { parseLSF } = require("./lsf")

export function handleError() {
	console.error(...arguments)
}
async function handleFile(file, event) {
	console.debug(`select file: ${file.name}`)
	if (file.name.endsWith('.lsf')) {
		const data = await parseLSF(file)
		let sync, target
		if (event && event.target.dataset.device) {
			sync = true
			target = event.target.dataset.device
		}
		if (data.length == 1) {
			await uploadFile(`show/${CONFIG.show}A.lsb`, new Blob(data[0]), sync, target);
			await uploadFile(`show/${CONFIG.show}B.lsb`, new Blob(data[0]), sync, target);
		} else if (data.length === 3) {
			await uploadFile(`show/${CONFIG.show}A.lsb`, new Blob(data[1]), sync, target);
			await uploadFile(`show/${CONFIG.show}B.lsb`, new Blob(data[2]), sync, target);
		}
		await fetchData()
	} else if (file.name.endsWith('.lt3')) {
		const path = `show/${CONFIG.show}.json`
		await uploadFile(path, file)
		await fetchData()
	} else if (file.name.endsWith('.ipx')) {
		// parseIPX(file).then(resolve)
	} else if (file.type.startsWith('audio')) {
		renderWaveform(await parseAudio(file))
		setAttr('#player', 'src', URL.createObjectURL(file))
	} else {
		console.error('unsupported file format')
	}
}
function handleChange(e) {
	if (e.type === 'change' && e.target.id === 'select-file') {
		for (let file of e.target.files) {
			handleFile(file)
		}
	} else if (e.target.matches('grid.color-slider input')) {
		const channel = e.target.dataset.key
		const group = e.target.dataset.group
		color[group][channel] = parseFloat(e.target.value)
		switch (group) {
			case 'rgb':
				updateHSL()
				break
			case 'hsl':
				updateRGB()
				break
		}
		renderColor()
		if (e.type === 'change') {
			post('/color', Object.assign({ segment: CONFIG.segment }, color.rgb))
		}

	} else if (e.target.matches('input[data-group="audio"]')) {
		const { key } = e.target.dataset
		const value = e.target.value
		switch (e.target.type) {
			case 'color':
				AUDIO[key] = value
				break
			case 'range':
				AUDIO[key] = parseFloat(value)
				break
		}
		if (e.type === 'change') {
			console.info(`set ${key} = ${JSON.stringify(AUDIO[key])}`)
		}
	}
}
async function handleClick(e) {
	if (e.target.matches('article.node')) {
		const id = e.target.dataset.device
		post('blink?target=' + id)
	} else if (e.target.dataset.segment) {
		CONFIG.segment = e.target.dataset.segment
		color = { rgb: CONFIG[CONFIG.segment] }
		await updateHSL()
		await render()
	}
	else if (e.target.dataset.show) {
		CONFIG.show = parseInt(e.target.dataset.show) || 0
		await render()
		// await post('exec?cmd=end')
		await post('show', { id: CONFIG.show })
		if (CONFIG.show) await loadShowData()
		render()
		// await post('exec?cmd=start')
	}
	else if (e.target.dataset.action) {
		const action = e.target.dataset.action
		switch (action) {
			case 'show-file-select-dialog':
				click('#select-file')
				break
			case 'reset-show-data':
				// await resetShow()
				break
			case 'save-show-data':
				// await saveShow()
				break
			case 'toggle-prop':
				const key = e.target.dataset.key
				AUDIO[key] = !AUDIO[key]
				console.info(`set ${key} = ${AUDIO[key] ? 'on' : 'off'}`)
				break
		}
	}
	
	else if (e.target.dataset.command) {
		const command = e.target.dataset.command
		await post(`exec?cmd=${command}`)
		switch (command) {
			case 'start':
				setProp('#player', 'currentTime', 0)
				call('#player', 'play')
				break
			case 'resume':
				call('#player', 'play')
				break
			case 'end':
				call('#player', 'pause')
				setProp('#player', 'currentTime', 0)
				break
			case 'pause':
				call('#player', 'pause')
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
	// if (e.target.closest('.timeline')) {
	// 	$('.timeline').forEach(el => {
	// 		if (el !== e.target) {
	// 			el.scrollLeft = e.target.scrollLeft
	// 		}
	// 	})
	// }
}

function handleInit() {
	// render()
	fetchData()
	setInterval(async () => {
		if (await loadNodes()) renderNodes() 
	}, 5000)
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
