import { parseAudio, player, waveformData } from "./audio"
import { store } from "./model"

const $devices = document.getElementById('serial-dev-select') as HTMLSelectElement
const $tempo = document.getElementById('tempo') as HTMLDivElement
const $waveform = document.getElementById('waveform') as HTMLDivElement
const $handle = document.getElementById('handle') as HTMLDivElement
const $main = document.getElementById('main') as HTMLDivElement
const $tracks = document.getElementById('tracks') as HTMLDivElement


export async function updateTime() {
	if (store.show.solution) {
		const width = store.show_duration / 10
		$tracks.style.width = width + 'px'
		$waveform.style.width = width + 'px'
		$tempo.style.width = width + 'px'
	}

	if (player.duration) {
		const ratio = player.currentTime / (store.show_duration / 1000)

		$main.scrollLeft = ($main.scrollWidth - $main.offsetWidth) * ratio
		// $footer.scrollLeft = ($footer.scrollWidth - $footer.offsetWidth) * ratio

		$handle.style.left = ratio * 100 + '%'
		$handle.style.opacity = '1'
	} else {
		$handle.style.opacity = '0'
	}
}

export async function renderSerial() {
	console.log('render serial toolbar')
	return new Promise(resolve => {
		const $c = document.getElementById('serial-connect')
		const $d = document.getElementById('serial-disconnect')
		if ($c && $d) {
			if (store.serial_connection) {
				$c.setAttribute('hidden', 'hidden')
				$d.removeAttribute('hidden')
				$devices.setAttribute('disabled', 'disabled')
			} else {
				$d.setAttribute('hidden', 'hidden')
				$c.removeAttribute('hidden')
				$devices.removeAttribute('disabled')
			}
		}
		resolve()
	})
}

export async function renderDevicesList() {
	console.log('render serial devices')
	return new Promise(resolve => {
		chrome.serial.getDevices(devices => {
			$devices.innerHTML = '<option value="">...</option>'
			devices.forEach(dev => {
				if (dev.path.startsWith('/dev/cu.')) {
					const option = document.createElement('option')
					option.value = dev.path
					option.innerHTML = dev.path.replace('/dev/cu.', '')
					if (dev.path === store.serial_port)
						option.selected = true
					$devices.appendChild(option)
				}
			})
			resolve()
		})
	})
}

export async function renderAudio(audio: ShowAudio) {
	if (!audio) return
	updateTime()
	renderTempo(audio)
	renderWaveform(audio)
}

export async function renderTempo(audio: ShowAudio) {
	if (audio.beats) {
		$tempo.innerHTML = ''
		audio.beats.reduce((start, end, index) => {
			const width = end - start
			const $block = document.createElement('span')
			$block.classList.add('block')
			$block.style.width = width / 10 + 'px'
			$block.innerHTML = `${(index - 1) % 8 + 1}`
			$tempo.appendChild($block)
			return end
		}, 0)
	}
}

export async function renderWaveform(audio: ShowAudio) {
	$waveform.innerHTML = ''
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext("2d");
	$waveform.appendChild(canvas)
	if (ctx) {
		const height = $waveform.offsetHeight
		const width = $waveform.offsetWidth
		const halfHeight = height / 2
		if (audio.waveform) {
			console.log('render audio waveform')
			const size = 10

			canvas.width = width;
			canvas.height = height;

			ctx.lineWidth = 2
			ctx.lineJoin = 'round'
			audio.waveform.forEach(([max, min, pos, neg], i) => {
				const x = i * size
				ctx.fillStyle = '#333333'
				const p1 = neg / height * halfHeight + halfHeight;
				ctx.fillRect(x + 2, p1, size - 4, (pos / height * halfHeight + halfHeight) - p1);

				ctx.fillStyle = '#000000'
				const p2 = Math.round(min / height * halfHeight) + halfHeight;
				ctx.fillRect(x + 2, p2, size - 4, Math.round(max / height * halfHeight + halfHeight) - p2);
			})
		}

		if (audio.beats) {
			console.log('render audio tempo')
			audio.beats.forEach((time, i) => {
				if (i % 8 === 0) {
					ctx.fillStyle = '#af0'
					ctx.fillRect(time / 10 - 2, 0, 4, 60);
				}
				else if (i % 2 === 0) {
					// ctx.fillStyle = '#8c173f'
					// ctx.fillRect(time / 10 - 1, 0, 2, 60);
				}
			})
		}
	}
}

export async function renderShow(show: ShowData) {
	$tracks.innerHTML = ''
	$waveform.innerHTML = ''
	if (!show.solution || !show.tracks) return
	console.log('render light show')
	updateTime()

	show.tracks.forEach(track => {
		const $track = document.createElement('div')
		const { elements, ...params } = track
		$track.classList.add('track')
		Object.assign($track.dataset, params)
		$tracks.appendChild($track)
		renderLight($track, track)
	})
}

export function renderLight(container, track) {
	switch (track.device) {
		case 1:
			break;
		case 2:
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
		$el.style.left = `${start / 10}px`
		$el.style.width = `${duration / 10}px`
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
				// $el.style.backgroundSize = params.period / 10 + 'px'
				break
			case 6: // dots
				$el.style.backgroundImage = `url(${drawDots(toCssColor(color), params.spacing)})`
				// $el.style.backgroundSize = (params.spacing + 2) + 'px'
				break
			case 7: // pulse
				$el.style.backgroundImage = `url(${drawPulse(toCssColor(color), params.period)})`
				// $el.style.backgroundSize = params.period / 10 + 'px'

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
	tmpCanvas.width = period / 10
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		const len1 = period * (ratio / 100) / 10
		const len2 = period * ((100 - ratio) / 100) / 10
		ctx.fillStyle = color1
		ctx.fillRect(0, 0, len1, 1);
		ctx.fillStyle = color2
		ctx.fillRect(len1, 0, len2, 1);
	}
	return tmpCanvas.toDataURL()
}
function drawDots(color, spacing) {
	tmpCanvas.width = spacing + 2
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = color
		ctx.fillRect(0, 0, 1, 1);
		ctx.fillStyle = 'black'
		ctx.fillRect(1, 0, 1, 1);
	}
	return tmpCanvas.toDataURL()
}
function drawPulse(color, period) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = color
		ctx.fillRect(0, 0, period, 1);
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, 24, 1);
		ctx.fillStyle = 'white'
		ctx.fillRect(12, 0, 2, 1);
	}
	return tmpCanvas.toDataURL()
}
function drawRainbow(period) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		var gradient = ctx.createLinearGradient(0, 0, period, 0);
		gradient.addColorStop(1 / 7 * 0, 'red');
		gradient.addColorStop(1 / 7 * 1, 'orange');
		gradient.addColorStop(1 / 7 * 2, 'yellow');
		gradient.addColorStop(1 / 7 * 3, 'green');
		gradient.addColorStop(1 / 7 * 4, 'cyan');
		gradient.addColorStop(1 / 7 * 5, 'blue');
		gradient.addColorStop(1 / 7 * 6, 'violet');
		gradient.addColorStop(1 / 7 * 7, 'red');
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, period, 1);
	}
	return tmpCanvas.toDataURL()
}
