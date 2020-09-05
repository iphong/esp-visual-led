// store hardware configs data
const CONFIG = {
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
let AUDIO = {
	id: 0,
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
// store light sequences for current show
let SHOWS = []

// store color data for current segment
let color = {
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
function updateRGB() {
	const { h, s, l } = color.hsl
	color.rgb = hslToRgb(h, s, l)
}
function updateHSL() {
	const { r, g, b } = color.rgb
	color.hsl = rgbToHsl(r, g, b)
}
updateHSL()