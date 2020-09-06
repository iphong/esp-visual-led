function request(method = 'POST', path = '', args = {}, body = null) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest
		const params = Object.entries(args)
		req.open(method, path + (params.length ? '?' + params.map(([key, value]) => `${key}=${value}`).join('&') : ''), true)
		req.send(body)
		req.addEventListener('load', () => {
			// console.log(req.status, req.statusText, req.responseText.trim())
			if (req.status === 200) {
				if (req.getResponseHeader('Content-Type') === 'application/json') {
					resolve(JSON.parse(req.responseText))
				} else resolve(req.responseText)
			} else {
				reject()
			}
		})
		req.addEventListener('error', reject)
	})
}
function uploadFile(path, file) {
	if (typeof file === 'string') file = new Blob([file])
	console.debug(`uploading ${file.size} bytes to ${path}...`)
	return new Promise((resolve, reject) => {
		const form = new FormData()
		const req = new XMLHttpRequest()
		form.append('filename', path)
		form.append('file', file)
		req.open('POST', 'edit', true)
		req.send(form)
		req.onloadend = (e) => {
			if (req.status === 200) {
				resolve(req)
				console.append(`OK`)
			} else {
				reject(req)
				console.append(`FAIl`)
			}
		}
	})
}

function get(path, params) {
	return request('GET', path, params)
}
function post(path, params, body) {
	return request('POST', path, params, body)
}
function sendCommand(command) {
	// console.log('execute ' + command)
	return request('POST', '/command', { command })
}

function loadAudioConfig() {
	return get(`show/${CONFIG.show}.json`).then(res => {
		Object.assign(AUDIO, res)
		renderAudio()
	})
}

let fetchTime = Date.now()
function fetchData() {
	fetchTime = Date.now()
	const next = () => setTimeout(fetchData, 5000 - (Date.now() - fetchTime))
	get('/color').then(res2 => {
		CONFIG.a = { r: res2.a[0], g: res2.a[1], b: res2.a[2] }
		CONFIG.b = { r: res2.b[0], g: res2.b[1], b: res2.b[2] }
		color.rgb = CONFIG[CONFIG.segment]
		updateHSL()
		renderColor()
	})
	// load hardware configs data
	console.info("loading device's configurations...")
	get('/status').then(res => {
		Object.assign(CONFIG, res)
		console.append('OK')
		renderShow()
		if (CONFIG.show) {
			return loadAudioConfig()
		}
	})
}

function stopShow() {
	return sendCommand('end').then(() => {
		call('#player', 'pause')
		setProp('#player', 'currentTime', 0)
	})
}
function startShow() {
	return sendCommand('start').then(() => {
		setProp('#player', 'currentTime', 0)
		return call('#player', 'play')
	})
}