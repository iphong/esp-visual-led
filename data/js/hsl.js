/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @return  Array           The HSL representation
 * @param r Number
 * @param g Number
 * @param b Number
 */
function rgbToHsl(r, g, b) {
	r /= 255
	g /= 255
	b /= 255

	let max = Math.max(r, g, b), min = Math.min(r, g, b)
	let h, s, l = (max + min) / 2

	if (max === min) {
		h = s = 0 // achromatic
	} else {
		let d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}

		h /= 6
	}

	return {h, s, l}
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @return  Object           The RGB representation
 * @param h
 * @param s
 * @param l
 */
function hslToRgb(h, s, l) {
	let r, g, b

	if (s === 0) {
		r = g = b = l // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s
		let p = 2 * l - q

		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	return { r: r * 255, g: g * 255, b: b * 255 }
}