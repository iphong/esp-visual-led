// store hardware configs data
export const CONFIG = {
	brightness: 255,
	channel: 0,
	show: 1,
	time: 0,
	running: 0,
	paused: 0,
	nodes: [],
	syncing: true
}

// store audio configs for current show
export const AUDIO = {
	file: null,
	channels: [],
	duration: 0
}

export const LIGHT = {
	file: null
}

export const SHOW = {
	map: {},
	params: {},
	tracks: [],
}

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

export default { CONFIG, AUDIO, LIGHT, SHOW }

Object.assign(global, { CONFIG, AUDIO, LIGHT, SHOW })
