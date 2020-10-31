import { store } from "./store"

export const $player = document.getElementById('player') as HTMLAudioElement
export const $shows = document.getElementById('show-select') as HTMLSelectElement
export const $devices = document.getElementById('serial-dev-select') as HTMLSelectElement
export const $tempo = document.getElementById('tempo') as HTMLDivElement
export const $waveform = document.getElementById('waveform') as HTMLDivElement
export const $handle = document.getElementById('handle') as HTMLDivElement
export const $main = document.getElementById('main') as HTMLDivElement
export const $tracks = document.getElementById('tracks') as HTMLDivElement

export async function updateTime() {
	if ($player.duration) {
		const ratio = $player.currentTime / $player.duration
		$main.scrollLeft = ($main.scrollWidth - $main.offsetWidth) * ratio
		$handle.style.left = ratio * 100 + '%'
	}
}
export async function updateSize() {
	if (store.show && store.show.duration) {
		const width = store.show.duration / 10
		$tracks.style.width = width + 'px'
		$waveform.style.width = width + 'px'
		$tempo.style.width = width + 'px'
	}
}

export async function renderSerial() {
	console.log('render serial')
	await renderDevicesList()
	return new Promise(resolve => {
		const $c = document.getElementById('serial-connect')
		const $d = document.getElementById('serial-disconnect')
		if ($c && $d) {
			if (store.serial_connected) {
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

export async function renderAudio(audio: AudioData) {
	$tempo.innerHTML = ''
	$waveform.innerHTML = ''
	await updateSize()
	if (audio) {
		// await renderTempo(audio)
		await renderWaveform(audio)
	}
}

export async function renderTempo(audio: AudioData) {
	if (audio.beats) {
		audio.beats.reduce((start, end, index) => {
			const width = end - start
			const $block = document.createElement('span')
			$block.classList.add('block')
			$block.style.width = width / 10 + 'px'
			$block.innerHTML = index ? `${(index - 1) % 8 + 1}` : `-`
			$tempo.appendChild($block)
			return end
		}, 0)
	}
}

export async function renderWaveform(audio: AudioData) {
	if (audio.waveform) {
		console.log('render audio waveform')
		const height = $waveform.offsetHeight
		const halfHeight = height / 2
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		const size = 1

		canvas.width = audio.duration / 10;
		canvas.height = height;
		ctx.lineWidth = 2
		ctx.lineJoin = 'round'
		audio.waveform.forEach(([max, min, pos, neg], i) => {
			const x = i * size
			ctx.fillStyle = '#333333'
			const p1 = neg / height * halfHeight + halfHeight;
			ctx.fillRect(x, p1, size, (pos / height * halfHeight + halfHeight) - p1);

			ctx.fillStyle = '#000000'
			const p2 = Math.round(min / height * halfHeight) + halfHeight;
			ctx.fillRect(x, p2, size, Math.round(max / height * halfHeight + halfHeight) - p2);
		})
		if (audio.beats) {
			console.log('render audio tempo')
			audio.beats.forEach((time, i) => {
				if (i % 8 === 0) {
					ctx.fillStyle = '#c924ff'
					ctx.fillRect(time / 10 - 1, 0, 1, height);
				}
			})
		}
		$waveform.appendChild(canvas)
	}
}

export async function renderShow(show: ShowData) {
	$tracks.innerHTML = ''
	await updateSize()
	if (store.show) {
		store.show.tracks.forEach((track:any) => {
			const $track = document.createElement('div')
			const { frames, ...params } = track
			Object.assign($track.dataset, params)
			$track.classList.add('track')
			$tracks.appendChild($track)
			renderLight($track, track)
		})
	}
}

export function renderLight(container: any, track: any) {
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
						console.log("unhandled light type", [params.type])
				}
				container.appendChild($el)
			})
			break
		default:
			return console.log('unsupported device type', [track.device])
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
