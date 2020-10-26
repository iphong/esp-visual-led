import { player, waveformData } from "./audio"
import { store } from "./model"

const $devices = document.getElementById('serial-dev-select') as HTMLSelectElement
const $waveform = document.getElementById('waveform') as HTMLDivElement
const $timeline = document.getElementById('timeline') as HTMLDivElement
const $tracks = $timeline.querySelector('.tracks') as HTMLDivElement


export function renderSerial() {
	return new Promise(resolve => {
		const $c = document.getElementById('serial-connect')
		const $d = document.getElementById('serial-disconnect')
		if ($c && $d) {
			if (store.serial_connection_id) {
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

export function renderDevicesList() {
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

export async function renderWaveform(audio: any) {
	console.log('render audio waveform...')
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext("2d");
	if (ctx) {
		const size = 10
		const wave = audio.waveform
		const width = wave.length * size
		const height = $waveform.offsetHeight
		const halfHeight = height / 2

		$waveform.innerHTML = ''
		$waveform.appendChild(canvas)

		canvas.width = width;
		canvas.height = height;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";

		wave.forEach(([max, min, pos, neg], i) => {
			const x = i * size
			const p1 = neg/100 * halfHeight + halfHeight;
				ctx.fillStyle = '#444444';
				ctx.fillRect(x+1, p1, size-2, (pos/100 * halfHeight + halfHeight) - p1);

			const p2 = min/100 * halfHeight + halfHeight;
			ctx.fillStyle = '#000000';
			ctx.fillRect(x+1, p2, size-2, (max/100 * halfHeight + halfHeight) - p2);
		})
	}
}

export async function updateTime() {
	const ratio = player.currentTime / player.duration
	$timeline.scrollLeft = ($timeline.scrollWidth - $timeline.offsetWidth) * ratio
	$waveform.scrollLeft = ($waveform.scrollWidth - $waveform.offsetWidth) * ratio
}

export async function renderShow(show: any) {
	console.log('render light show...')
	$tracks.innerHTML = ''
	$waveform.innerHTML = ''
	$tracks.style.width = (show.audio.duration * 100) + 'px'
	show.tracks.forEach(track => {
		const $track = document.createElement('div')
		const { elements, ...params } = track
		$track.classList.add('track')
		Object.assign($track.dataset, params)
		$tracks.appendChild($track)
		renderLight($track, track)
	})
	$timeline.scrollLeft = 0
	renderWaveform(show.audio)
	return show
}

export function renderLight(container, track) {
	switch (track.device) {
		case 1:
			// container.style.height = '30px'
			break;
		case 2:
			// container.style.height = '30px'
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
	if (ctx) {
		const len1 = period * (ratio / 100)
		const len2 = period * ((100 - ratio) / 100)
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
		gradient.addColorStop(1 / 6 * 0, 'red');
		gradient.addColorStop(1 / 6 * 1, 'orange');
		gradient.addColorStop(1 / 6 * 2, 'yellow');
		gradient.addColorStop(1 / 6 * 3, 'green');
		gradient.addColorStop(1 / 6 * 4, 'cyan');
		gradient.addColorStop(1 / 6 * 5, 'blue');
		gradient.addColorStop(1 / 6 * 6, 'violet');
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, period, 1);
	}
	return tmpCanvas.toDataURL()
}
