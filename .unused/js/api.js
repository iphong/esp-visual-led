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

import { CONFIG } from "./data"

export function constrain(value, min, max) {
	return value < min ? min : value > max ? max : value
}
export function map(value, fromMin, fromMax, toMin, toMax) {
	return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin))
}

export function rgbToHsl(r, g, b) {
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

	return { h, s, l }
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
export function hslToRgb(h, s, l) {
	let r, g, b

	if (s === 0) {
		r = g = b = l // achromatic
	} else {
		global.hue2rgb = function hue2rgb(p, q, t) {
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
/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @return  Array           The HSV representation
 * @param r
 * @param g
 * @param b
 */
export function rgbToHsv(r, g, b) {
	r /= 255, g /= 255, b /= 255

	let max = Math.max(r, g, b), min = Math.min(r, g, b)
	let h, s, v = max

	let d = max - min
	s = max === 0 ? 0 : d / max

	if (max === min) {
		h = 0 // achromatic
	} else {
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

	return { h, s, v }
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @return  Object           The RGB representation
 * @param h
 * @param s
 * @param v
 */

export function hsvToRgb(h, s, v) {
	let r, g, b

	let i = Math.floor(h * 6)
	let f = h * 6 - i
	let p = v * (1 - s)
	let q = v * (1 - f * s)
	let t = v * (1 - (1 - f) * s)

	switch (i % 6) {
		case 0:
			r = v
			g = t
			b = p
			break
		case 1:
			r = q
			g = v
			b = p
			break
		case 2:
			r = p
			g = v
			b = t
			break
		case 3:
			r = p
			g = q
			b = v
			break
		case 4:
			r = t
			g = p
			b = v
			break
		case 5:
			r = v
			g = p
			b = q
			break
	}

	return { r: r * 255, g: g * 255, b: b * 255 }
}


export function $(selector) {
	return document.body.querySelectorAll(selector)
}
export function setText(selector, text) {
	if (typeof text === 'undefined') return
	$(selector).forEach(el => {
		el.innerHTML = text
	})
}
export function setValue(selector, value) {
	if (typeof value === 'undefined') return
	$(selector).forEach(el => {
		el.value = value
	})
}
export function setProp(selector, prop, value) {
	if (typeof value === 'undefined') return
	$(selector).forEach(el => {
		el[prop] = value
	})
}
export function setAttr(selector, attr, value) {
	if (typeof value === 'undefined') return
	$(selector).forEach(el => {
		el.setAttribute(attr, value)
	})
}
export function click(selector) {
	$(selector).forEach(el => {
		el.click()
	})
}
export function call(selector, method, ...args) {
	$(selector).forEach(el => {
		if (typeof el[method] === 'function') {
			el[method].call(el, ...args)
		}
	})
}
export function request(method = 'POST', path = '', args = {}, body = null) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest
		const params = Object.entries(args)
		const uri = path + (params.length ? '?' + params.map(([key, value]) => `${key}=${value}`).join('&') : '')
		const size = body ? ` [${body.size || body.length} Kb]` : ''
		const output = console.debug(`${method} ${uri} ${size}... `)

		req.open(method, uri, true)
		req.send(body)
		req.addEventListener('loadend', () => {
			if (output) {
				// output.innerHTML += `[${req.status} ${req.statusText}] ${req.responseText.split("\n")[0]}`
				output.innerHTML += `[${req.status} ${req.statusText}]`
			} else {
				console.log('--', `[${req.status} ${req.statusText}]`)
			}
			if (req.status === 200) {
				if (req.getResponseHeader('Content-Type') === 'application/json') {
					resolve(JSON.parse(req.responseText), req)
				} else resolve(req.responseText, req)
			} else {
				reject()
			}
		})
		req.addEventListener('error', reject)
	})
}

export function fetchFile(path, type = '') {
	const $progress = document.createElement('span')
	const $output = console.debug(`FETCH ${path} ... `)
	if ($output) $output.appendChild($progress)
	let canceled
	let progress
	let response
	let stream
	let bytesRead = 0
	const data = []
	const promise = new Promise(async (resolve, reject) => {
		response = await fetch(path)
		stream = response.body.getReader()
		async function next() {
			try {
				const { done, value } = await stream.read()
				if (!done) {
					if (canceled) {
						stream.cancel()
					}
					else {
						bytesRead += value.length
						data.push(value)
						if (progress) progress(bytesRead)
						if ($progress) {
							$progress.innerText = `${formatBytes(bytesRead)}`
						}
					}
					setTimeout(next)
				} else {
					if (canceled) {
						$progress.innerText += ' CANCELED'
						reject()
					} else {
						const file = new Blob(data, { type })
						$progress.innerText += ' OK'
						resolve(file)
					}
				}
			} catch (e) {
				console.log(e)
				reject()
			}
		}
		setTimeout(next)
	})
	promise.progress = (callback) => {
		progress = callback
		return promise
	}
	promise.cancel = () => {
		canceled = true
		// if (stream) stream.cancel()
		return promise
	}
	return promise
}
export async function uploadFile(path, body, sync = false, target = null, useSD = false) {
	const file = new Blob([body])
	const output = console.debug(`UPLOAD ${path} [${(file.size / 1000).toFixed(2)} KB] ... `)
	return new Promise((resolve, reject) => {
		const form = new FormData()
		const req = new XMLHttpRequest()
		form.append('filename', path)
		form.append('file', file)
		req.open('POST', `edit?${sync ? 'sync' : 'nosync'}${target ? `&target=${target}` : ''}${useSD ? '&storage=sd' : ''}`, true)
		req.send(form)
		req.onloadend = (e) => {
			if (output) {
				output.innerHTML += `[${req.status} ${req.statusText}]`
			} else {
				console.log('--', `[${req.status} ${req.statusText}]`)
			}
			if (req.status === 200) {
				resolve(req)
			} else {
				reject(req)
			}
		}
	})
}
export function get(path, params) {
	return request('GET', path, params)
}
export function post(path, params, body) {
	return request('POST', path, params, body)
}
export function exec(cmd) {
	// console.log('execute ' + cmd)
	return request('POST', 'exec', { cmd })
}

export function formatBytes(bytes) {
	if (bytes >= 1000000000) return (bytes / 1000000000).toPrecision(3) + ' GB'
	if (bytes >= 1000000) return (bytes / 1000000).toPrecision(3) + ' MB'
	if (bytes >= 1000) return (bytes / 1000).toPrecision(3) + ' KB'
	return '0.00 B'
}

export function formatTime(duration, showHour = false) {
	const hour = Math.floor(duration / 3600)
	const hourLeft = duration % 3600
	const minute = Math.floor(hourLeft / 60)
	const second = Math.floor(hourLeft % 60)
	const ms = Math.floor((duration % 1) * 100)
	if (showHour || hour)
		return [
			hour.toString().padStart(2, '0'),
			minute.toString().padStart(2, '0'),
			second.toString().padStart(2, '0'),
			ms.toString().padStart(2, '0'),
		].join(':')
	else
		return [
			minute.toString().padStart(2, '0'),
			second.toString().padStart(2, '0'),
			ms.toString().padStart(2, '0')
		].join(':')
}
export async function sendCommand(command = '', ...data) {
	console.log('SEND ' + command + ' ' + data.join(' '))
	let selected = CONFIG.nodes.filter(n => n.selected).map(n => n.id)
	if (!selected.length) selected = ['#']
	for (let id of selected) {
		await send(id, command.toUpperCase(), ...data)
	}
}
Object.assign(global, {
	$,
	setText,
	setValue,
	setProp,
	setAttr,
	click,
	call,
	request,
	get,
	post,
	uploadFile,
	fetchFile,
	sendCommand
})
