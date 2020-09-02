let initialized = false
const data = {
	show: 0,
	segment: "A"
}

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

function renderUI() {
	document.querySelectorAll('[data-segment]').forEach(el => {
		if (el.dataset.segment == data.segment) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	document.querySelectorAll('[data-show]').forEach(el => {
		if (el.dataset.show == data.show) {
			el.classList.add('selected')
		} else {
			el.classList.remove('selected')
		}
	})
	document.body.classList[data.show == 0 ? 'add' : 'remove']('manual-mode')
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
	if (e.target.dataset.segment) {
		data.segment = e.target.dataset.segment
		renderUI();
	}
	else if (e.target.dataset.show) {
		data.show = e.target.dataset.show;
		stop();
		renderUI();
		request('POST', '/config', { show: e.target.dataset.show })
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
		data.show = res.show
		data.channel = res.channel
		renderUI();
	})
}
