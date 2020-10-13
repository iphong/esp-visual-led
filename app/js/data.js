// store hardware configs data
export const CONFIG = {
	brightness: 255,
	channel: 0,
	show: 0,
	time: 0,
	running: 0,
	paused: 0,
	nodes: [],
	syncing: true
}

// store audio configs for current show
export const AUDIO = {
	filename: null,
	channels: [],
	duration: 0
}

export const LIGHT = {
	params: {},
	tracks: []
}

export const SHOW = {
	map: {}
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

Object.assign(global, { CONFIG, AUDIO, LIGHT, SHOW })
