function handleError() {
	console.error(...arguments)
}
function handleFile(file) {
	return new Promise((resolve, reject) => {
		console.debug('select file: ' + file.name)
		if (file.name.endsWith('.lsf')) {
			// parseLSF(file).then(resolve)
		} else if (file.name.endsWith('.ipx')) {
			// parseIPX(file).then(resolve)
		} else if (file.type.startsWith('audio')) {
			const url = URL.createObjectURL(file)
			if (!AUDIO || AUDIO.url !== url)
				parseAudio(file)
					.then(() => saveLightShow())
					.then(resolve)
			else resolve()
		} else {
			console.error('unsupported file format')
			reject('unsupported file format')
		}
	})
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
			console.info(`set AUDIO.${key} = ${JSON.stringify(AUDIO[key])}`)
		}
	}
}
function handleClick(e) {
	if (e.target.dataset.segment) {
		CONFIG.segment = e.target.dataset.segment
		console.debug('select segment: ' + CONFIG.segment.toUpperCase())
		color = { rgb: CONFIG[CONFIG.segment] }
		updateHSL()
		render()
	}
	else if (e.target.dataset.show) {
		CONFIG.show = parseInt(e.target.dataset.show) || 0
		render()
		sendCommand('end').then(() => {
			console.debug('select show: ' + CONFIG.show)
			post('/config', { show: CONFIG.show }).then(() => {
				if (!CONFIG.show) sendCommand('start')
				else loadAudioConfig()
			})
		})
	}
	else if (e.target.dataset.action) {
		const action = e.target.dataset.action
		switch (action) {
			case 'show-file-select-dialog':
				click('#select-file')
				break
			case 'save-show-data':
				stopShow()
					.then(saveAudioConfig)
					.then(saveLightShow)
					.then(startShow)
				break
		}
	}
	else if (e.target.dataset.command) {
		const command = e.target.dataset.command
		sendCommand(command).then(() => {
			switch (command) {
				case 'start':
					setAttr('#player', 'currentTime', 0)
					call('#player', 'play')
					break
				case 'resume':
					call('#player', 'play')
					break
				case 'end':
					call('#player', 'pause')
					setAttr('#player', 'currentTime', 0)
					break
				case 'pause':
					call('#player', 'pause')
					break
			}
		})
	}
}
function handleDragOver(e) {
	e.preventDefault()
}
function handleDragLeave(e) {
	e.preventDefault()
}
function handleDragDrop(e) {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		handleFile(file)
	}
}

function handleInit() {
	render()
	fetchData()
}

window.addEventListener('dragover', handleDragOver, true)
window.addEventListener('dragleave', handleDragLeave, true)
window.addEventListener('drop', handleDragDrop, true)

window.addEventListener('change', handleChange, true)
window.addEventListener('input', handleChange, true)
window.addEventListener('click', handleClick, true)
window.addEventListener('touchstart', new Function(), true)

window.addEventListener('end', sendCommand.bind(null, 'end'), true)
window.addEventListener('play', sendCommand.bind(null, 'resume'), true)
window.addEventListener('pause', sendCommand.bind(null, 'pause'), true)

window.addEventListener('load', handleInit)
