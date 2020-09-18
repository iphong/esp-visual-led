
global.$ = function $(selector) {
	return document.body.querySelectorAll(selector)
}
global.setText = function setText(selector, text) {
	if (typeof text === 'undefined') return
	$(selector).forEach(el => {
		el.innerText = text
	})
}
global.setValue = function setValue(selector, value) {
	if (typeof value === 'undefined') return
	$(selector).forEach(el => {
		el.value = value
	})
}
global.setProp = function setProp(selector, prop, value) {
	if (typeof value === 'undefined') return
	$(selector).forEach(el => {
		el[prop] = value
	})
}
global.setAttr = function setAttr(selector, attr, value) {
	if (typeof value === 'undefined') return
	$(selector).forEach(el => {
		el.setAttribute(attr, value)
	})
}
global.click = function click(selector) {
	$(selector).forEach(el => {
		el.click()
	})
}
global.call = function call(selector, method, ...args) {
	$(selector).forEach(el => {
		if (typeof el[method] === 'function') {
			el[method].call(el, ...args)
		}
	})
}

// render rgb and hsl color input sliders
global.renderColor = function renderColor() {
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
global.renderShow = function renderShow() {
	$('[data-segment]').forEach(el => {
		if (el.dataset.segment === CONFIG.segment) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	$('[data-show]').forEach(el => {
		if (parseInt(el.dataset.show) === CONFIG.show) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	$('section.tab').forEach(el => {
		if (parseInt(el.dataset.tab) === 1 && !CONFIG.show) {
			el.classList.add('active')
		} else if (parseInt(el.dataset.tab) === 2 && CONFIG.show) {
			el.classList.add('active')
		} else {
			el.classList.remove('active')
		}
	})
}
global.renderShowTimeline = function renderShowTimeline(selector, content) {
	$(selector).forEach(wrapper => {
		wrapper.innerHTML = ''
		let lastColor = `rgb(0,0,0)`
		content.split('\n').forEach(line => {
			if (line.trim().startsWith('C')) {
				const [, start, duration, transition, r, g, b] = line.trim().split(' ')
				const color = `rgb(${r},${g},${b})`
				const percent = Math.round(transition / duration * 100)

				const frame = document.createElement('span')
				frame.classList.add('frame')
				frame.style.width = `${Math.round(parseInt(duration) / 10)}px`
				frame.style.background = `linear-gradient(90deg, ${lastColor}0px, ${color} ${Math.round(transition / 10)}px, ${color} ${Math.round(duration / 10)}px)`
				wrapper.appendChild(frame)
				lastColor = color
			}
		})
	})
}
global.renderAudio = function renderAudio() {
	setAttr('#player', 'src', AUDIO.url)
	setText('#audio-filename', AUDIO.filename)
	setText('#audio-duration', Math.round(AUDIO.duration))
	setText('#audio-tempo', AUDIO.tempo)
	setText('#audio-beats', AUDIO.beats)
	setValue('#audio-color1', AUDIO.color1)
	setValue('#audio-color2', AUDIO.color2)
	setValue('#audio-ratio', AUDIO.ratio)
}

global.render = function render() {
	renderShow()
	renderColor()
	// renderAudio()
}

