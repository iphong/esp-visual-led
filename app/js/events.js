global.handleError = function handleError() {
	console.error(...arguments)
}
global.handleFile = function handleFile(file) {
	return new Promise((resolve, reject) => {
		console.debug('select file: ' + file.name)
		if (file.name.endsWith('.lsf')) {
			parseLSF(file).then(fetchData).then(resolve)
		} else if (file.name.endsWith('.ipx')) {
			// parseIPX(file).then(resolve)
		} else if (file.type.startsWith('audio')) {
			stopShow().then(() => {
				setAttr('#player', 'src', URL.createObjectURL(file))
				if (!AUDIO || AUDIO.filename !== file.name) {
					parseAudio(file)
						.then(saveLightShow)
						.then(resolve)
						.then(startShow)
				} else {
					startShow().then(resolve)
				}
			})
		} else {
			console.error('unsupported file format')
			reject('unsupported file format')
		}
	})
}
global.handleChange = function handleChange(e) {
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
global.handleClick = function handleClick(e) {
	if (e.target.dataset.segment) {
		CONFIG.segment = e.target.dataset.segment
		color = { rgb: CONFIG[CONFIG.segment] }
		updateHSL()
		render()
	}
	else if (e.target.dataset.show) {
		CONFIG.show = parseInt(e.target.dataset.show) || 0
		render()
		stopShow().then(() => {
			post('/config', { show: CONFIG.show }).then(() => {
				if (!CONFIG.show) startShow()
				else loadShowData().then(startShow)
			})
		})
	}
	else if (e.target.dataset.action) {
		const action = e.target.dataset.action
		switch (action) {
			case 'show-file-select-dialog':
				click('#select-file')
				break
			case 'reset-show-data':
				resetShow()
				break
			case 'save-show-data':
				saveShow()
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
		sendCommand(command).then(() => {
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
		})
	}
}
global.handleDragOver = function handleDragOver(e) {
	e.preventDefault()
}
global.handleDragLeave = function handleDragLeave(e) {
	e.preventDefault()
}
global.handleDragDrop = function handleDragDrop(e) {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		handleFile(file)
	}
}

global.handleScroll = function handleScroll(e) {
	if (e.target.closest('.timeline')) {
		$('.timeline').forEach(el => {
			if (el !== e.target) {
				el.scrollLeft = e.target.scrollLeft
			}
		})
	}
}

global.handleInit = function handleInit() {
	render()
	fetchData()
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
