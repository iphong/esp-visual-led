import { store } from './store'
import $ from 'jquery'

export const $player = $('#player').get(0) as HTMLAudioElement
export const $tempo = $('#tempo').get(0) as HTMLDivElement
export const $waveform = $('#waveform').get(0) as HTMLDivElement
export const $handle = $('#handle').get(0) as HTMLDivElement
export const $main = $('#main').get(0) as HTMLDivElement
export const $tracks = $('#tracks').get(0) as HTMLDivElement

export async function updateTime() {
	if (store.duration) {
		if ($player.duration && !$player.ended) {
			store.time = Math.round($player.currentTime * 1000)
		}
		const ratio = store.time / store.duration
		$main.scrollLeft = ($main.scrollWidth - $main.offsetWidth) * ratio
		$handle.style.left = ratio * 100 + '%'
		$handle.style.transform = `translateX(-${100 - Math.round(ratio * 100)}%)`
	}
}
export async function updateSize() {
	if (store.duration) {
		const width = store.duration / 10
		$tracks.style.width = width + 'px'
		$waveform.style.width = width + 'px'
		$tempo.style.width = width + 'px'
	}
}

export async function renderSerial() {
	console.debug('render serial')
	updateSize()
	return new Promise(resolve => {
		chrome.serial.getDevices(devices => {
			const $devices = $('[data-key="port"]')
			$devices.html('<option value="">...</option>')
			devices.forEach(dev => {
				if (dev.path.startsWith('/dev/cu.')) {
					$(`<option>`)
						.val(dev.path)
						.html(dev.path.replace('/dev/cu.', ''))
						.appendTo($devices)
				}
			})
			$devices.val(store.port)
			resolve(null)
		})
	})
}

export async function renderBeats() {
	if (!$tempo) return
	updateSize()
	if (store.beats && store.beats.length) {
		console.debug('render beats')
		store.beats.reduce((start = 0, end: number, index: number) => {
			const width = end - start
			const counter = index ? `${(index - 1) % 4 + 1}` : `-`
			$('<span class="block">')
				.width(width / 10)
				.html(counter)
				.appendTo('#tempo')
			return end
		})
	}
}

export async function renderWaveform() {
	if (!$waveform) return
	$waveform.innerHTML = ''
	updateSize()
	if (store.waveform && store.waveform.length) {
		console.debug('render waveform')
		const height = $waveform.offsetHeight
		const halfHeight = height / 2
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
		const size = 1

		canvas.width = store.duration / 10
		canvas.height = height
		ctx.lineWidth = 2
		store.waveform.forEach(([max, min, pos, neg], i) => {
			const x = i * size
			ctx.fillStyle = '#333333'
			const p1 = neg / height * halfHeight + halfHeight
			ctx.fillRect(x, p1, size, (pos / height * halfHeight + halfHeight) - p1)

			ctx.fillStyle = '#000000'
			const p2 = Math.round(min / height * halfHeight) + halfHeight
			ctx.fillRect(x, p2, size, Math.round(max / height * halfHeight + halfHeight) - p2)
		})
		$waveform.appendChild(canvas)
	}
}

export async function renderTracks() {
	if (!$tracks) return
	updateSize()
	$tracks.innerHTML = ''
	if (store.tracks && store.tracks.length) {
		store.tracks.forEach((track: any, index: number) => {
			const $track = document.createElement('div')
			const { frames, ...params } = track
			Object.assign($track.dataset, params)
			$track.dataset.index = `${index}`
			$track.classList.add('track')
			$tracks.appendChild($track)
			renderLight($track, track)
		})
	}
}

export function renderLight(container: any, track: any) {
	if (!track.device || !track.frames) return
	switch (track.device) {
		case 1:
		case 2:
			track.frames.forEach(el => {
				const $el = document.createElement('span')
				const { color, ...params } = el
				const { start, duration, ratio, spacing, period } = params
				Object.assign($el.dataset, params)
				$el.style.left = `${start / 10}px`
				$el.style.width = `${duration / 10}px`
				switch (params.type) {
					case 2: // solid
						$el.style.backgroundColor = color[0]
						break
					case 3: // gradient
						$el.style.background = `linear-gradient(90deg, ${color[0]} 0%, ${color[1]} 100%)`
						break
					case 4: // flash
						$el.style.backgroundImage = `url(${drawFlash(color[0], color[1], period, ratio)})`
						break
					case 5: // rainbow
						$el.style.backgroundImage = `url(${drawRainbow(period)})`
						break
					case 6: // dots
						$el.style.backgroundImage = `url(${drawDots(color[0], spacing)})`
						break
					case 7: // pulse
						$el.style.backgroundImage = `url(${drawPulse(color[0], period)})`
						break
					default:
						console.debug('unhandled light type', [params.type])
				}
				container.appendChild($el)
			})
			break
		default:
			return console.debug('unsupported device type', [track.device])
	}
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
		ctx.fillRect(0, 0, len1, 1)
		ctx.fillStyle = color2
		ctx.fillRect(len1, 0, len2, 1)
	}
	return tmpCanvas.toDataURL()
}
function drawDots(color, spacing) {
	tmpCanvas.width = spacing + 2
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = color
		ctx.fillRect(0, 0, 1, 1)
		ctx.fillStyle = 'black'
		ctx.fillRect(1, 0, 1, 1)
	}
	return tmpCanvas.toDataURL()
}
function drawPulse(color, period) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		ctx.fillStyle = color
		ctx.fillRect(0, 0, period, 1)
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, 24, 1)
		ctx.fillStyle = 'white'
		ctx.fillRect(12, 0, 2, 1)
	}
	return tmpCanvas.toDataURL()
}
function drawRainbow(period) {
	tmpCanvas.width = period
	tmpCanvas.height = 1
	const ctx = tmpCanvas.getContext('2d')
	if (ctx) {
		var gradient = ctx.createLinearGradient(0, 0, period, 0)
		gradient.addColorStop(1 / 7 * 0, 'red')
		gradient.addColorStop(1 / 7 * 1, 'orange')
		gradient.addColorStop(1 / 7 * 2, 'yellow')
		gradient.addColorStop(1 / 7 * 3, 'green')
		gradient.addColorStop(1 / 7 * 4, 'cyan')
		gradient.addColorStop(1 / 7 * 5, 'blue')
		gradient.addColorStop(1 / 7 * 6, 'violet')
		gradient.addColorStop(1 / 7 * 7, 'red')
		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, period, 1)
	}
	return tmpCanvas.toDataURL()
}
