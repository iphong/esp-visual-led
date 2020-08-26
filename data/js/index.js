const led_nums = 36

window.addEventListener('dragover', e => {
	e.preventDefault()
})
window.addEventListener('drop', e => {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		parseXML(file)
	}
})

document.getElementById('upload').addEventListener('change', e => {
	for (let file of e.target.files) {
		parseXML(file)
	}
	e.target.value = ''
})

document.getElementById('upload-track').addEventListener('change', e => {
	for (let file of e.target.files) {
		parseLSF(file)
	}
	e.target.value = ''
})


const setFrameRegex = /(\t)?([0-9]+)ms: setrgb AB ([0-9]+)ms > ([0-9]+), ([0-9]+), ([0-9]+)/i
const loopFrameRegex = /([0-9]+)ms: loop ([0-9]+)ms/i
const endFrameRegex = /(\t)?([0-9]+)ms: end/i
function parseLSF(file) {
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = () => {
		const frames = []
		let frame, lastFrame;
		const lines = reader.result.split('\n')
		lines.forEach(line => {
			if (line.match(setFrameRegex)) {
				let [ ,tab, start, transition, r, g, b] = line.match(setFrameRegex)
				frame = { type: 'set', start, duration: 0, transition, r, g, b }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			if (line.match(endFrameRegex)) {
				let [ ,tab, start] = line.match(endFrameRegex)
				frame = { type: 'end', start }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			if (line.match(loopFrameRegex)) {
				let [,start, duration] = line.match(loopFrameRegex)
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
						data.push([tab ? "	rgb" : "rgb", frame.start, frame.duration, frame.transition, frame.r, frame.g, frame.b].join(" "))
						break
					case 'end':
						data.push([tab ? "	end" : "end", frame.start].join(" "))
						break
					case 'loop':
						data.push(["loop", frame.start, frame.duration, frame.frames.length].join(" "))
						convert(frame.frames, true)
						break
				}
			})
		}
		convert(frames)

		console.log(data.join('\n'))
		const form = new FormData();
		form.append("filename", "seq/3");
		form.append("file", new Blob([data.join('\n')]));
		const req = new XMLHttpRequest();
		req.open("POST", "edit", true);
		req.send(form);
		req.onloadend =  (e) => {
			console.log('Upload completed.')
		};
	}
}
function parseLSF2(file) {
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = () => {
		const frames = []
		let frame, lastFrame;
		const lines = reader.result.split('\n')
		lines.forEach(line => {
			if (line.match(setFrameRegex)) {
				let [ ,tab, start, transition, r, g, b] = line.match(setFrameRegex)
				frame = { type: 'set', start, transition, r, g, b }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			if (line.match(endFrameRegex)) {
				let [ ,tab, start] = line.match(endFrameRegex)
				frame = { type: 'end', start }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			if (line.match(loopFrameRegex)) {
				let [,start, duration] = line.match(loopFrameRegex)
				frame = { type: 'loop', start, duration, frames: [] }
				lastFrame = frame
				frames.push(frame)
			}
		})
		const data = []
		function convert(frames) {
			frames.forEach((frame, index) => {
				const bytes = new Uint8Array(16)
				const view = new DataView(bytes.buffer)
				data.push(bytes)
				switch (frame.type) {
					case 'set':
						frame.duration = frames[index + 1].start - frame.start
						view.setUint8(0, 0x01)
						view.setUint32(1, parseInt(frame.start))
						view.setUint32(5, parseInt(frame.duration))
						view.setUint32(9, parseInt(frame.transition))
						view.setUint8(13, parseInt(frame.r))
						view.setUint8(14, parseInt(frame.g))
						view.setUint8(15, parseInt(frame.b))
						break
					case 'loop':
						view.setUint8(0, 0x02)
						view.setUint32(1, parseInt(frame.start))
						view.setUint32(5, parseInt(frame.duration))
						convert(frame.frames)
						break
					case 'end':
						view.setUint8(0, 0x03)
						view.setUint32(1, parseInt(frame.start))
						break
				}
			})
		}
		convert(frames)
		const payload = new Blob(data)
		const form = new FormData();
		form.append("filename", "seq/3");
		form.append("file", payload);
		const req = new XMLHttpRequest();
		req.open("POST", "edit", true);
		req.send(form);
		req.onloadend =  (e) => {
			console.log('Upload completed.')
		};
	}
}

function parseXML(file) {
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

								const form = new FormData();
								form.append("filename", uploadPath);
								form.append("file", blob);
								const req = new XMLHttpRequest();
								req.open("POST", "edit", true);
								req.send(form);
								req.onloadend =  (e) => {
									console.log('Upload completed.')
								};
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

// function uploadFile(file) {
// 	const reader = new FileReader()
// 	reader.readAsDataURL(file)
// 	reader.addEventListener('loadend', () => {
// 		let img = new Image()
// 		img.addEventListener('load', e => {
// 			const scale = led_nums / img.height
// 			canvas.width = img.height
// 			canvas.height = img.width
// 			ctx.clearRect(0, 0, canvas.width, canvas.height);
// 			ctx.fillStyle = '#000000'
// 			ctx.fillRect(0, 0, canvas.width, canvas.height)
// 			ctx.save()
// 			ctx.translate(img.height / 2, img.width / 2)
// 			ctx.rotate((90 * Math.PI) / 180)
// 			ctx.drawImage(img, -img.width / 2, -img.height / 2)
// 			ctx.restore()
//
// 			img = new Image()
// 			img.onload = () => {
// 				const width = (canvas.width = led_nums)
// 				const height = (canvas.height = canvas.height * scale)
// 				ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
//
// 				const link = document.getElementById('link')
// 				const rgb = new Uint8ClampedArray(
// 					ctx.getImageData(0, 0, width, height).data.reduce((output, b, i) => {
// 						if ((i + 1) % 4 !== 0) {
// 							output.push(b)
// 						}
// 						return output
// 					}, [])
// 				)
//
// 				const blob = new Blob([rgb])
// 				const url = window.URL.createObjectURL(blob)
// 				const name = file.name.replace(/(.*)\.\w+$/, '$1')
// 				const size = rgb.byteLength
// 				link.innerHTML += `<li>
//         <a href="${url}" download="${name}">${name}</a> (${width}x${height})[${size}]
//       </li>`
//
// 				const form = new FormData();
// 				form.append("filename", `/images/${name}`);
// 				form.append("file", blob);
// 				const req = new XMLHttpRequest();
// 				req.open("POST", "edit", true);
// 				req.send(form);
// 				req.onloadend =  (e) => {
// 				  console.log('Upload completed.')
// 				};
// 			}
// 			img.src = canvas.toDataURL()
// 		})
// 		img.src = reader.result
// 	})
// }
