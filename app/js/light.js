import unzip from 'unzip-js'
import { LIGHT } from './data'

const led_nums = 36
const rgbFrameRegex = /(\t+)?([0-9]+)ms: setrgb [AB]+ ([0-9]+)ms > ([0-9]+), ([0-9]+), ([0-9]+)/i
const endFrameRegex = /(\t+)?([0-9]+)ms: end/i
const loopFrameRegex = /([0-9]+)ms: loop ([0-9]+)ms/i

export async function parseLTP(file) {
	return new Promise(resolve => {
		$('.tracks').forEach(el => {
			el.width = '100%';
			el.innerHTML = '<div class="loading">loading...</div>'
		})
		unzip(file, (err, zip) => {
			if (err) reject(err)
			zip.readEntries((err, entries) => {
				if (err) reject(err)
				let ended = 0
				entries.forEach(entry => {
					const { name } = entry
					zip.readEntryData(entry, false, (err, stream) => {
						if (err) reject(err)
						let content = []
						stream.on('data', (data) => {
							content.push(data)
						})
						stream.on('end', async () => {
							const file = new Blob(content)
							if (name == "project.lt3") {
								LIGHT.file = file
								const reader = new FileReader
								reader.readAsText(file)
								reader.addEventListener('loadend', () => {
									const data = JSON.parse(reader.result)
									LIGHT.params = data.solution
									LIGHT.tracks = data.tracks
								})
							} else if (name.endsWith('.mp3')) {
								AUDIO.file = file
							} else if (name.startsWith('images/')) {
								console.log(name)
							}
							if (++ended === entries.length) {
								resolve()
							}
						})
					})
				})
			})
		})
	})
}

export async function parseLSF(file) {
	return new Promise(resolve => {
		const reader = new FileReader()
		reader.readAsText(file)
		reader.onload = () => {
			const output = {}
			const data = reader.result.match(/@?\w+[^@]+/mg).map(segment => {
				let id = 'AB'
				if (segment.startsWith('@')) {
					id = segment[1];
					segment = segment.substr(2)
				}
				return output[id] = segment.trim().split(/\r|\n|\r\n/)
					.filter(line => {
						return !!line.match(/^[\t0-9]/)
					})
					.map(line => {
						let matched
						if (matched = line.match(rgbFrameRegex)) {
							let [, , start, transition, r, g, b] = matched
							return { type: 1, start, duration: 0, transition, r, g, b }
						}
						else if (matched = line.match(endFrameRegex)) {
							let [, , start] = matched
							return { type: 2, start }
						}
						else if (matched = line.match(loopFrameRegex)) {
							let [, start, duration] = matched
							return { type: 3, start, duration, frames: [] }
						} else {
							return {}
						}
					}).map(({ start = 0, duration = 0, transition = 0, type = 0, r = 0, g = 0, b = 0 }, index, lines) => {
						const frame = new Uint8Array(16)
						const view = new DataView(frame.buffer)
						if (type === 1 && lines[index + 1]) {
							duration = lines[index + 1].start - start
						}

						view.setUint8(0, type)
						view.setUint32(1, start)
						view.setUint32(5, duration)
						view.setUint32(9, transition)
						view.setUint8(13, r)
						view.setUint8(14, g)
						view.setUint8(15, b)
						// let hex = ''
						// frame.forEach(byte => (hex += (byte.toString(16).padStart(2, '0') + ' ')))
						// console.log(hex)
						return frame
					})
			})
			resolve(data)
		}
	})
}

export async function parseIPX(file) {
	const output = {
		images: [],
		sequences: []
	}
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = () => {
		const frame = document.createElement('iframe')
		frame.srcdoc = reader.result.toString()
		frame.onload = () => {
			const doc = frame.contentDocument
			doc.querySelectorAll('Item').forEach(item => {
				const index = parseInt(item.getAttribute('Index'))
				const type = item.getAttribute('Type')
				switch (type) {
					case 'Img':
						const data = item.childNodes[0].nodeValue.replace(/\[CDATA\[(.*)\]\]/, '$1')
						const uploadPath = `/img/${index}`
						let img = output.images[index] = new Image()
						img.src = `data:img/png;base64,${data}`
						img.onload = () => {

							// SCALE AND ROTATE IMAGE
							const scale = led_nums / img.height
							const canvas = document.createElement('canvas')
							const ctx = canvas.getContext('2d')
							document.body.appendChild(canvas)
							canvas.width = (img.height)
							canvas.height = (img.width)
							ctx.clearRect(0, 0, canvas.width, canvas.height)
							ctx.fillStyle = '#000000'
							ctx.fillRect(0, 0, canvas.width, canvas.height)
							ctx.save()
							ctx.translate(img.height / 2, img.width / 2)
							ctx.rotate((90 * Math.PI) / 180)
							ctx.drawImage(img, -img.width / 2, -img.height / 2)
							ctx.restore()

							img = new Image()
							img.onload = () => {
								const width = (canvas.width = led_nums)
								const height = (canvas.height = canvas.height * scale)
								ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
								const rgb = new Uint8ClampedArray(
									ctx.getImageData(0, 0, width, height).data.reduce((output, b, i) => {
										if ((i + 1) % 4 !== 0) {
											output.push(b)
										}
										return output
									}, [])
								)
								const blob = new Blob([rgb])

								// UPLOAD ASSETS

								const form = new FormData()
								form.append('filename', uploadPath)
								form.append('file', blob)
								const req = new XMLHttpRequest()
								req.open('POST', 'edit', true)
								req.send(form)
								req.onloadend = (e) => {
									console.debug('Upload completed.')
								}
							}
							img.src = canvas.toDataURL()
						}
						break
					case 'Seq':
						const length = parseInt(item.getAttribute('Length'))
						output.sequences[index] = new Array(length)
						for (let i = 0; i < length; i++) {
							const child = item.querySelector(`Data${i}`)
							const image = parseInt(child.getAttribute('Index'))
							const duration = parseInt(child.getAttribute('Duration'))
							output.sequences[index][i] = { image, duration }
						}
						break
				}
			})
			document.body.removeChild(frame)
		}
		document.body.appendChild(frame)
	}
}
export function renderShow() {
	$('[data-show]').forEach(el => {
		if (parseInt(el.dataset.show) === CONFIG.show) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	$('.tracks').forEach($tracks => {
		$tracks.innerHTML = ''
		$tracks.style.width = LIGHT.params.end + 'px'
		LIGHT.tracks.forEach(track => {
			const $track = document.createElement('div')
			const { elements, ...params } = track
			$track.classList.add('track')
			Object.assign($track.dataset, params)
			$tracks.appendChild($track)
			renderLight($track, track)
		})
	})
}

export function renderLight(container, track) {
	switch (track.device) {
		case 1:
			container.style.height = '60px'
			break;
		case 2:
			container.style.height = '30px'
			break;
		default:
			return console.log('unsupported device type:', track.device)
	}

	track.elements.forEach(el => {
		const $el = document.createElement('span')
		let { color, colorStart, colorEnd, ...params } = el
		Object.assign($el.dataset, params)
		const start = params.startTime
		const duration = params.endTime - el.startTime
		if (color) color = convertColor(color)
		if (colorStart) colorStart = convertColor(colorStart)
		if (colorEnd) colorEnd = convertColor(colorEnd)
		$el.style.left = `${start}px`
		$el.style.width = `${duration}px`
		let color1, color2
		switch (params.type) {
			case 2: // solid
				$el.style.backgroundColor = toCssColor(color)
				break
			case 3: // gradient
				color1 = toCssColor(colorStart)
				color2 = toCssColor(colorEnd)
				$el.style.background = `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`
				break
			case 4: // flash
				color1 = toCssColor(colorStart)
				color2 = toCssColor(colorEnd)
				const { period, ratio } = params
				$el.style.backgroundImage = `url(${drawFlash(color1, color2, period, ratio)})`
				// $el.style.backgroundSize = '20%'
				break
			case 5: // rainbow
				$el.style.backgroundImage = `url(${drawRainbow(params.period)})`
				// $el.style.backgroundSize = '20%'
				// $el.style.backgroundImage = `linear-gradient(to right, red, orange , yellow, green, cyan, blue, violet)`
				break
			case 6: // dots
				$el.style.backgroundImage = `url(${drawDots(toCssColor(color), params.spacing)})`
				// $el.style.backgroundSize = '20%'
				break
			case 7: // pulse
				$el.style.backgroundImage = `url(${drawPulse(toCssColor(color), params.period)})`
				// $el.style.backgroundSize = '20%'
				break
			default:
				console.log("unhandled light type:", params.type)
		}
		container.appendChild($el)
	})
}

function convertColor({ r, g, b }) {
	return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function toCssColor({ r, g, b }) {
	return `rgb(${r}, ${g}, ${b})`
}

function toCssHSL({ h, s, l }) {
	return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%)`
}

const tmpCanvas = document.createElement('canvas')
function drawFlash(color1, color2, period, ratio) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	const len1 = period * (ratio / 100)
	const len2 = period * ((100 - ratio) / 100)
	ctx.fillStyle = color1
	ctx.fillRect(0, 0, len1, 1);
	ctx.fillStyle = color2
	ctx.fillRect(len1, 0, len2, 1);
	return tmpCanvas.toDataURL()
}
function drawDots(color, spacing) {
	tmpCanvas.width = spacing + 2
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	ctx.fillStyle = color
	ctx.fillRect(0, 0, 1, 1);
	ctx.fillStyle = 'black'
	ctx.fillRect(1, 0, 1, 1);
	return tmpCanvas.toDataURL()
}
function drawPulse(color, period) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	ctx.fillStyle = color
	ctx.fillRect(0, 0, period, 1);
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, 24, 1);
	ctx.fillStyle = 'white'
	ctx.fillRect(12, 0, 2, 1);
	return tmpCanvas.toDataURL()
}
function drawRainbow(period) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	var gradient = ctx.createLinearGradient(0, 0, period, 0);
	gradient.addColorStop(1 / 6 * 0, 'red');
	gradient.addColorStop(1 / 6 * 1, 'orange');
	gradient.addColorStop(1 / 6 * 2, 'yellow');
	gradient.addColorStop(1 / 6 * 3, 'green');
	gradient.addColorStop(1 / 6 * 4, 'cyan');
	gradient.addColorStop(1 / 6 * 5, 'blue');
	gradient.addColorStop(1 / 6 * 6, 'violet');
	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, period, 1);
	return tmpCanvas.toDataURL()
}
