let initialized = false

const audio = document.getElementById('player')
const startBtn = document.getElementById('start-button')
const listShow = document.getElementById('list-show')

let audioURL = localStorage.getItem('music_file') || ''
if (audioURL) {
	audio.setAttribute('src', audioURL)
}

for (let i = 0 ; i <= 4 ; i++) {
	const button = document.createElement('button')
	button.innerHTML = `<label>${i}</label>`
	button.dataset.show = `${i}`
	listShow.appendChild(button)
}

function handleFile(file) {
	if (file.name.endsWith('.lsf')) {
		parseLSF(file)
	} else if (file.name.endsWith('.ipx')) {
		parseIPX(file)
	} else if (file.name.endsWith('.mp3')) {
		audioURL = window.URL.createObjectURL(file)
		localStorage.setItem('music_file', audioURL)
		audio.setAttribute('src', audioURL)
	} else {
		console.warn('Unsupported file format:', file.name)
	}
}

function stop() {
	startBtn.classList.remove('selected')
	startBtn.innerText = 'START'
	return sendCommand('end').then(() => {
		audio.pause()
		audio.currentTime = 0
	})
}

function start() {
	startBtn.classList.add('selected')
	startBtn.innerText = 'STOP'
	return sendCommand('start').then(() => {
		audio.currentTime = 0
		audio.play()
	})
}

document.addEventListener('touchstart', function () {
}, true)

window.addEventListener('dragover', e => {
	e.preventDefault()
	if (e.target.dataset.channel) {
		e.target.classList.add('active')
	}
})
window.addEventListener('dragleave', e => {
	e.preventDefault()
	if (e.target.dataset.channel) {
		e.target.classList.remove('active')
	}
})

window.addEventListener('drop', e => {
	e.preventDefault()
	for (let file of e.dataTransfer.files) {
		handleFile(file)
	}
	e.target.classList.remove('active')
})

window.addEventListener('change', e => {
	if (e.target.files) {
		for (let file of e.target.files) {
			handleFile(file)
		}
		e.target.value = ''
	}
	e.target.classList.remove('active')
})

window.addEventListener('click', e => {
	if (e.target.dataset.show) {
		document.getElementById('select-show').value = e.target.dataset.show
		e.target.parentElement.querySelectorAll('[data-show]').forEach(e => e.classList.remove('selected'))
		e.target.classList.add('selected')
		if (initialized) {
			stop()
			request('POST', '/config', { show: e.target.dataset.show })
		}
	} else if (e.target.dataset.channel) {
		if (!e.target.classList.contains('selected')) {
			document.getElementById('select-channel').value = e.target.dataset.channel
			e.target.parentElement.querySelectorAll('[data-channel]').forEach(e => e.classList.remove('selected'))
			e.target.classList.add('selected')
			if (initialized) {
				request('POST', '/config', { channel: e.target.dataset.channel })
			}
		}
	} else {
		switch (e.target['id']) {
			case 'pair-button':
				sendCommand('pair').then(() => {
					console.log('sent pair command.')
				})
				break
			case 'upload-button':
				sendCommand('upload').then(() => {
					console.log('sent upload command.')
				})
				break
			case 'start-button':
				if (e.target.classList.contains('selected')) {
					stop()
				} else {
					start()
				}
				break
			case 'file-button':
				document.getElementById('select-file').click()
				break
			default:
		}
	}
})
window.onload = e => {
	request('GET', '/status').then(res => {
		const show = res.show || 1
		const channel = res.channel || 1
		document.querySelector(`*[data-show="${show}"]`).click()
		// document.querySelector(`*[data-channel="${channel}"]`).click()
		initialized = true
	})
}
