const led_nums = 36

window.addEventListener('dragover', e => {
	e.preventDefault()
})

window.addEventListener('drop', e => {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		if (file.name.endsWith(".lsf")) {
			parseLSF(file)
		}
		else if (file.name.endsWith(".ipx")) {
			parseIPX(file)
		}
		else {
			console.warn("Unsupported file format:", file.name);
		}
	}
})

document.getElementById('upload-ipx').addEventListener('change', e => {
	for (let file of e.target.files) {
		parseIPX(file)
	}
	e.target.value = ''
})

document.getElementById('upload-lsf').addEventListener('change', e => {
	for (let file of e.target.files) {
		parseLSF(file)
	}
	e.target.value = ''
})

document.getElementById('pair').addEventListener('click', e => {
	if (confirm(`Put all channel ${getChannel()} devices to pairing mode...`)) {
		request("POST", "/command", { command: 'pair', channel: getChannel() }).then(() => {
			alert("Done.");
		});
	}
})

function sendCommand(command) {
	request("POST", "/command", { command }).then(() => {
		console.log("Done.");
	});
}

function request(method = "POST", path = "", args = {}, body = "") {
	return new Promise((resolve) => {
		const req = new XMLHttpRequest
		req.open(method, path + '?' + Object.entries(args).map(([key, value]) => `${key}=${value}`).join('&'), true)
		req.send(body)
		req.addEventListener('loadend', () => {
			console.log(req.status, req.statusText, req.responseText.trim());
			resolve();
		})
	})
}

function getShow() {
	return document.getElementById('select-show').value
}
function getChannel() {
	return document.getElementById('select-channel').value
}

function uploadFile(path, file) {
	return new Promise((resolve, reject) => {
		const form = new FormData()
		form.append('filename', path)
		form.append('file', file)
		const req = new XMLHttpRequest()
		req.open('POST', 'edit', true)
		req.send(form)
		req.onloadend = (e) => {
			if (req.status === 200) resolve()
			else {
				reject()
				console.warn(path, req.status, req.statusText);
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
				.then(() => console.log("Uploaded."))
		} else if (threads.length == 3) {
			parseThread('A', threads[1])
				.then(() => parseThread('B', threads[2]))
				.then(() => console.log("Uploaded."))
		} else {
			console.warn('Unknown data format', reader.result)
		}
	}
	function parseThread(id, content) {
		const frames = []
		let frame, lastFrame
		const lines = content.split('\n')
		lines.forEach(line => {
			if (line.match(setFrameRegex)) {
				let [, tab, start, transition, r, g, b] = line.match(setFrameRegex)
				frame = { type: 'set', start, duration: 0, transition, r, g, b }
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
		function convert(frames, tab) {
			frames.forEach((frame, index) => {
				switch (frame.type) {
					case 'set':
						frame.duration = frames[index + 1].start - frame.start
						data.push([tab ? '	rgb' : 'rgb', frame.start, frame.duration, frame.transition, frame.r, frame.g, frame.b].join(' '))
						break
					case 'end':
						data.push([tab ? '	end' : 'end', frame.start].join(' '))
						break
					case 'loop':
						data.push(['loop', frame.start, frame.duration].join(' '))
						convert(frame.frames, true)
						break
				}
			})
		}
		convert(frames)

		const path = `/show/${getShow()}/${getChannel()}${id}`
		const blob = new Blob([data.join('\n')])

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
