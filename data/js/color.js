const color = {
	rgb: {
		r: 255,
		g: 0,
		b: 0
	},
	hsl: {
		h: 0,
		s: 0,
		l: 0
	}
}

function updateRGB() {
	const { h, s, l } = color.hsl
	color.rgb = hslToRgb(h, s, l)
	renderColor()
}
function updateHSL() {
	const { r, g, b } = color.rgb
	color.hsl = rgbToHsl(r, g, b)
	renderColor()
}
function renderColor() {
	Object.keys(color).forEach(group => {
		Object.keys(color[group]).forEach(channel => {
			const el = document.querySelector(`input[data-group="${group}"][data-channel="${channel}"]`)
			if (el) {
				el.value = color[group][channel]
				const span = el.parentElement.querySelector('span')
				if (span) {
					switch (group) {
						case 'hsl':
							span.innerText = Math.round(color[group][channel] * 100) + '%'
							break
						case 'rgb':
							span.innerText = el.value.padStart(3, '0')
					}
				}
			}
		})
	})
}

function handleChange(e) {
	if (e.target.matches('grid.color-slider input')) {
		const channel = e.target.dataset.channel
		const group = e.target.dataset.group
		color[group][channel] = parseFloat(e.target.value)
		switch (group) {
			case 'rgb': updateHSL(); break
			case 'hsl': updateRGB(); break
		}
		if (e.type === 'change') {
			post('/set_color', Object.assign({ segment: data.segment }, color.rgb))
		}
	}
}

window.addEventListener('change', handleChange)
window.addEventListener('input', handleChange)
window.addEventListener('load', updateHSL)
