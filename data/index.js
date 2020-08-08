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
						const uploadPath = `/assets/${index}`
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
