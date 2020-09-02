const led_nums = 36

function sendCommand(command) {
	return request('POST', '/command', { command })
}

function request(method = 'POST', path = '', args = {}, body = '') {
	return new Promise((resolve) => {
		const req = new XMLHttpRequest
		const params = Object.entries(args)
		req.open(method, path + (params.length ? '?' + params.map(([key, value]) => `${key}=${value}`).join('&') : ''), true)
		req.send(body)
		req.addEventListener('loadend', () => {
			// console.log(req.status, req.statusText, req.responseText.trim())
			if (req.getResponseHeader('Content-Type') == 'application/json') {
				resolve(JSON.parse(req.responseText))
			} else resolve(req.responseText)
		})
	})
}

function getShow() {
	return document.getElementById('select-show').value
}

function uploadFile(path, file, addr) {
	return new Promise((resolve, reject) => {
		const form = new FormData()
		form.append('filename', path)
		form.append('file', file)
		const req = new XMLHttpRequest()
		req.open('POST', 'edit?target=' + addr, true)
		req.send(form)
		req.onloadend = (e) => {
			if (req.status === 200) resolve()
			else {
				reject()
				console.warn(path, req.status, req.statusText)
			}
		}
	})
}

const setFrameRegex = /(\t)?([0-9]+)ms: setrgb [AB]+ ([0-9]+)ms > ([0-9]+), ([0-9]+), ([0-9]+)/i
const loopFrameRegex = /([0-9]+)ms: loop ([0-9]+)ms/i
const endFrameRegex = /(\t)?([0-9]+)ms: end/i
function parseLSF(file) {
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = () => {
		const threads = reader.result.split(/@\w+/g)
		if (threads.length == 1) {
			parseThread('A', threads[0])
				.then(() => parseThread('B', threads[0]))
				.then(() => console.log('Uploaded.'))
		} else if (threads.length == 3) {
			parseThread('A', threads[1])
				.then(() => parseThread('B', threads[2]))
				.then(() => console.log('Uploaded.'))
		} else {
			console.warn('Unknown data format', reader.result)
		}
	}
	function parseThread(id, content) {
		const frames = []
		let frame, lastFrame, buf, view
		const lines = content.split('\n')
		lines.forEach(line => {
			if (line.match(setFrameRegex)) {
				let [, tab, start, transition, r, g, b] = line.match(setFrameRegex)
				frame = { type: 'rgb', start, duration: 0, transition, r, g, b }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			if (line.match(endFrameRegex)) {
				let [, tab, start] = line.match(endFrameRegex)
				frame = { type: 'end', start }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			if (line.match(loopFrameRegex)) {
				let [, start, duration] = line.match(loopFrameRegex)
				frame = { type: 'loop', start, duration, frames: [] }
				lastFrame = frame
				frames.push(frame)
			}
		})
		const data = []
		const data2 = []
		function convert(frames, tab) {
			frames.forEach((frame, index) => {
				switch (frame.type) {
					case 'rgb':
						frame.duration = frames[index + 1].start - frame.start
						data.push([tab ? '	C' : 'C', frame.start, frame.duration, frame.transition, frame.r, frame.g, frame.b].join(' '))
						// 01  00 00 00 00  00 00 00 00  00 00 00 00  00 00 00
						buf = new Uint8Array(16)
						view = new DataView(buf.buffer)
						view.setUint8(0, 0x01)
						view.setUint32(1, frame.start)
						view.setUint32(5, frame.duration)
						view.setUint32(9, frame.transition)
						view.setUint8(13, frame.r)
						view.setUint8(14, frame.g)
						view.setUint8(15, frame.b)
						data2.push(buf)
						break
					case 'loop':
						data.push(['L', frame.start, frame.duration].join(' '))
						// 02   00 00 00 00  00 00 00 00
						buf = new Uint8Array(9)
						view = new DataView(buf.buffer)
						view.setUint8(0, 0x02)
						view.setUint32(1, frame.start)
						view.setUint32(5, frame.duration)
						convert(frame.frames, true)
						data2.push(buf)
						break
					case 'end':
						data.push([tab ? '	E' : 'E', frame.start].join(' '))
						// 03   00 00 00 00
						buf = new Uint8Array(5)
						view = new DataView(buf.buffer)
						view.setUint8(0, 0x03)
						view.setUint32(1, frame.start)
						data2.push(buf)
						break
				}
			})
		}
		convert(frames)

		const path = `/show/${getShow()}${id}.lsb`
		const blob = new Blob([data.join('\n')])
		// const path = `/show/${getShow()}${id}.lsb`
		// const blob = new Blob(data2)

		return uploadFile(path, blob)
	}
}

function parseIPX(file) {
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
									console.log('Upload completed.')
								}
							}
							img.src = canvas.toDataURL()
						}
						break
					case 'Seq':
						const length = parseInt(item.getAttribute('Length'))
						output.sequences[index] = new Array(length)
						for (let i = 0 ; i < length ; i++) {
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
