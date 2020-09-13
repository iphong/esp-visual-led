// store hardware configs data
global.CONFIG = {
	mode: 0,
	show: 0,
	segment: 'a',
	a: {
		r: 255,
		g: 0,
		b: 0
	},
	b: {
		r: 255,
		g: 0,
		b: 0
	}
}
// store audio configs for current show
global.AUDIO = {
	id: 0,
	url: '',
	filename: '',
	duration: 0,
	channels: 0,
	sampleRate: 0,
	tempo: 0,
	beats: 0,
	tracks: [],
	color1: '#0000FF',
	color2: '#FF0000',
	ratio: 0.5,
	swap: true
}

global.AUDIO_DEFAULT = Object.assign({}, AUDIO)

// store light sequences for current show
global.SHOWS = []

// store color data for current segment
global.color = {
	rgb: {
		r: 255,
		g: 0,
		b: 0
	},
	hsl: {
		h: 255,
		s: 0,
		l: 0
	}
}
global.updateRGB = function updateRGB() {
	const { h, s, l } = color.hsl
	color.rgb = hslToRgb(h, s, l)
}
global.updateHSL = function updateHSL() {
	const { r, g, b } = color.rgb
	color.hsl = rgbToHsl(r, g, b)
}
updateHSL()

window.updateRGB = updateRGB
