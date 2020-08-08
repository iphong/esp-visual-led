const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const led_nums = 36

window.addEventListener('dragover', e => {
	e.preventDefault()
})
window.addEventListener('drop', e => {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		uploadFile(file)
	}
})

document.getElementById('upload').addEventListener('change', e => {
	for (let file of e.target.files) {
		uploadFile(file)
	}
	e.target.value = ''
})

function uploadFile(file) {
	const reader = new FileReader()
	reader.readAsDataURL(file)
	reader.addEventListener('loadend', () => {
		let img = new Image()
		img.addEventListener('load', e => {
			const scale = led_nums / img.height
			canvas.width = img.height
			canvas.height = img.width
			ctx.clearRect(0, 0, canvas.width, canvas.height);
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

				const link = document.getElementById('link')
				const rgb = new Uint8ClampedArray(
					ctx.getImageData(0, 0, width, height).data.reduce((output, b, i) => {
						if ((i + 1) % 4 !== 0) {
							output.push(b)
						}
						return output
					}, [])
				)

				const blob = new Blob([rgb])
				const url = window.URL.createObjectURL(blob)
				const name = file.name.replace(/(.*)\.\w+$/, '$1')
				const size = rgb.byteLength
				link.innerHTML += `<li>
        <a href="${url}" download="${name}">${name}</a> (${width}x${height})[${size}]
      </li>`

				// const form = new FormData();
				// form.append("filename", `/images/${name}`);
				// form.append("file", blob);
				// const req = new XMLHttpRequest();
				// req.open("POST", "edit", true);
				// req.send(form);
				// req.onloadend =  (e) => {
				//   console.log('Upload completed.')
				// };
			}
			img.src = canvas.toDataURL()
		})
		img.src = reader.result
	})
}
