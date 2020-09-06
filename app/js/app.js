
function setText(selector, text) {
	if (typeof text === 'undefined') return
	document.querySelectorAll(selector).forEach(el => {
		el.innerText = text
	})
}
function setValue(selector, value) {
	if (typeof value === 'undefined') return
	document.querySelectorAll(selector).forEach(el => {
		el.value = value
	})
}
function setProp(selector, prop, value) {
	if (typeof value === 'undefined') return
	document.querySelectorAll(selector).forEach(el => {
		el[prop] = value
	})
}
function setAttr(selector, attr, value) {
	if (typeof value === 'undefined') return
	document.querySelectorAll(selector).forEach(el => {
		el.setAttribute(attr, value)
	})
}
function click(selector) {
	document.querySelectorAll(selector).forEach(el => {
		el.click()
	})
}
function call(selector, method, ...args) {
	document.querySelectorAll(selector).forEach(el => {
		if (typeof el[method] === 'function') {
			el[method].call(el, ...args)
		}
	})
}

// render rgb and hsl color input sliders
function renderColor() {
	Object.keys(color).forEach(group => {
		Object.keys(color[group]).forEach(channel => {
			const el = document.querySelector(`input[data-group="${group}"][data-key="${channel}"]`)
			if (el) {
				el.value = color[group][channel]
				const span = el.parentElement.querySelector('span')
				if (span) {
					switch (group) {
						case 'hsl':
							span.innerText = Math.round(color[group][channel] * 100) + '%'
							break
						case 'rgb':
							span.innerText = el.value
					}
				}
			}
		})
	})
}

// render ui components bound to current show
function renderShow() {
	document.querySelectorAll('[data-segment]').forEach(el => {
		if (el.dataset.segment === CONFIG.segment) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	document.querySelectorAll('[data-show]').forEach(el => {
		if (parseInt(el.dataset.show) === CONFIG.show) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	document.querySelectorAll('section.tab').forEach(el => {
		if (parseInt(el.dataset.tab) === 1 && !CONFIG.show) {
			el.classList.add('active')
		} else if (parseInt(el.dataset.tab) === 2 && CONFIG.show) {
			el.classList.add('active')
		} else {
			el.classList.remove('active')
		}
	})
}
function renderAudio() {
	setAttr('#player', 'src', AUDIO.url)
	setText('#audio-filename', AUDIO.filename)
	setText('#audio-duration', Math.round(AUDIO.duration))
	setText('#audio-tempo', AUDIO.tempo)
	setText('#audio-beats', AUDIO.beats)
	setValue('#audio-color1', AUDIO.color1)
	setValue('#audio-color2', AUDIO.color2)
	setValue('#audio-ratio', AUDIO.ratio)
}

function render() {
	renderShow()
	renderColor()
	renderAudio()
}