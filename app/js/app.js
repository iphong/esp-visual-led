import { parseAudio } from "./audio"
import { AUDIO, CONFIG, LIGHT } from "./data"

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

export function renderHead() {
	const { id, ip, mac, brightness, channel, show } = CONFIG
	setText('#id', id)
	setText('#ip', ip)
	setText('#mac', mac)
}

export function renderNodes() {
	$('section.nodes').forEach(section => {
		section.innerHTML = ''
		CONFIG.nodes.forEach(node => {
			const $node = document.createElement('article')
			$node.classList.add('node')
			$node.innerHTML = node.id
			$node.dataset.device = node.id
			$node.dataset.droppable = true
			section.appendChild($node)
		})
	})
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
		$tracks.style.width = LIGHT.params.end / 50 + 'px'
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
			container.style.height = '40px'
			break;
		case 2:
			container.style.height = '20px'
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
		$el.style.left = `${start / 50}px`
		$el.style.width = `${duration / 50}px`
		let color1, color2
		switch (params.type) {
			case 2: // solid
				$el.style.backgroundColor = toCssColor(color)
				break;
			case 3: // gradient
				color1 = toCssColor(colorStart)
				color2 = toCssColor(colorEnd)
				$el.style.background = `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`
				break;
			case 4: // flash
				color1 = toCssColor(colorStart)
				color2 = toCssColor(colorEnd)
				const { period, ratio } = params
				$el.style.backgroundImage = `url(${drawFlash(color1, color2, period, ratio)})`
				$el.style.backgroundSize = '20%'
				break;
			case 5: // rainbow
				$el.style.backgroundImage = `url(${drawRainbow(params.period)})`
				$el.style.backgroundSize = '20%'
				// $el.style.backgroundImage = `linear-gradient(to right, red, orange , yellow, green, cyan, blue, violet)`
				break;
			case 6: // dots
				$el.style.backgroundImage = `url(${drawDots(toCssColor(color), params.spacing)})`
				$el.style.backgroundSize = '20%'
				break;
			case 7: // pulse
				$el.style.backgroundImage = `url(${drawPulse(toCssColor(color), params.period)})`
				$el.style.backgroundSize = '20%'
			default:
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

export async function renderAudio() {
	if (AUDIO.file) {
		$('.track.waveform').forEach(el => (el.innerHTML = '<div class="loading">Loading...</div>'))
		renderWaveform(await parseAudio(AUDIO.file))
		setAttr('#player', 'src', URL.createObjectURL(AUDIO.file))
	} else {
		setAttr('#player', 'src', '')
		$('.track.waveform').forEach(el => (el.innerHTML = ''))
	}
}

export async function renderWaveform() {
	$('.track.waveform').forEach((wrapper, index) => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext("2d");
		const waveData = AUDIO.channels[index].data
		const height = 80;
		const width = AUDIO.duration * 20
		const halfHeight = height / 2;
		const length = waveData.length;
		const step = Math.round(length / width);

		wrapper.innerHTML = ''
		wrapper.appendChild(canvas)
		
		canvas.width = width;
		canvas.height = height;
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";
		canvas.style.left = Math.round(wrapper.clientWidth / 2) + "px";

		let x = 0,
			sumPositive = 0,
			sumNegative = 0,
			maxPositive = 0,
			maxNegative = 0,
			kNegative = 0,
			kPositive = 0,
			drawIdx = step;
		for (let i = 0; i < length; i++) {
			if (i == drawIdx) {
				const p1 = maxNegative * halfHeight + halfHeight;
				ctx.strokeStyle = '#333333';
				ctx.strokeRect(x, p1, 1, (maxPositive * halfHeight + halfHeight) - p1);

				const p2 = sumNegative / kNegative * halfHeight + halfHeight;
				ctx.strokeStyle = '#eeeeee';
				ctx.strokeRect(x, p2, 1, (sumPositive / kPositive * halfHeight + halfHeight) - p2);
				x++;
				drawIdx += step;
				sumPositive = 0;
				sumNegative = 0;
				maxPositive = 0;
				maxNegative = 0;
				kNegative = 0;
				kPositive = 0;
			} else {
				if (waveData[i] < 0) {
					sumNegative += waveData[i];
					kNegative++;
					if (maxNegative > waveData[i]) maxNegative = waveData[i];
				} else {
					sumPositive += waveData[i];
					kPositive++;
					if (maxPositive < waveData[i]) maxPositive = waveData[i];
				}

			}
		}
	})
}

export async function render() {
	renderHead()
	renderNodes();
	renderShow()
	renderAudio()
}

Object.assign(window, {
	$,
	setText,
	setValue,
	setProp,
	setAttr,
	click,
	call,
	render
})
