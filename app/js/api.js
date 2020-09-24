global.request = function request(method = 'POST', path = '', args = {}, body = null) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest
		const params = Object.entries(args)
		const uri = path + (params.length ? '?' + params.map(([key, value]) => `${key}=${value}`).join('&') : '')
		console[method === 'DELETE' ? 'error' : method === 'POST' ? 'info' : 'log'](`${method} `)
		console.append(uri)
		console.append(body ? ` [${body.size || body.length} Kb]` : '')
		console.append(` ... `)
		req.open(method, uri, true)
		req.send(body)
		req.addEventListener('loadend', () => {
			console.append(req.status, req.statusText)
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
global.uploadFile = function uploadFile(path, file, sync = false, target = null) {
	if (typeof file === 'string') file = new Blob([file])
	console.warn(`UPLOAD ${path} [${(file.size / 1000).toFixed(2)} KB] ... `)
	return new Promise((resolve, reject) => {
		const form = new FormData()
		const req = new XMLHttpRequest()
		form.append('filename', path)
		form.append('file', file)
		req.open('POST', `edit?${sync ? 'sync' : 'nosync'}&${target ? `target=${target}` : ''}`, true)
		req.send(form)
		req.onloadend = (e) => {
			console.append(req.status, req.statusText)
			if (req.status === 200) {
				resolve(req)
			} else {
				reject(req)
			}
		}
	})
}

global.get = function get(path, params) {
	return request('GET', path, params)
}
global.post = function post(path, params, body) {
	return request('POST', path, params, body)
}
global.sendCommand = function sendCommand(command) {
	// console.log('execute ' + command)
	return request('POST', '/command', { command })
}

global.loadAudioConfig = function loadAudioConfig() {
	return get(`show/${CONFIG.show}.json`).then(res => {
		Object.assign(AUDIO, res)
		renderAudio()
	})
}
window.loadShowData = function loadShowData() {
	return Promise.resolve()
		.then(() => {
			return get(`show/${CONFIG.show}A.lsb`)
				.then(A => renderShowTimeline('#timeline1', A))
				.catch(e => $('#timeline1')[0].innerHTML = '')
		})
		.then(() => {
			return get(`show/${CONFIG.show}B.lsb`)
				.then(B => renderShowTimeline('#timeline2', B))
				.catch(e => $('#timeline2')[0].innerHTML = '')
		})
}


let fetchTime = Date.now()
global.fetchData = function fetchData() {
	fetchTime = Date.now()
	const next = () => {
		// setTimeout(fetchData, 5000 - (Date.now() - fetchTime))
	}
	// load hardware configs data
	return get('/status')
		.then(res => {
			Object.assign(CONFIG, res)
			renderShow()
			get('/color').then(res2 => {
				CONFIG.a = { r: res2.a[0], g: res2.a[1], b: res2.a[2] }
				CONFIG.b = { r: res2.b[0], g: res2.b[1], b: res2.b[2] }
				color.rgb = CONFIG[CONFIG.segment]
				updateHSL()
				renderColor()
				if (CONFIG.show) loadShowData().then(next)
				else next()
			})
		})
}
global.stopShow = function stopShow() {
	return sendCommand('end').then(() => {
		call('#player', 'pause')
		setProp('#player', 'currentTime', 0)
	})
}
global.startShow = function startShow() {
	return sendCommand('start').then(() => {
		setProp('#player', 'currentTime', 0)
		return call('#player', 'play')
	})
}
global.resetShow = function resetShow() {
	console.log(`reset show #${CONFIG.show}`);
	AUDIO = Object.assign({}, AUDIO_DEFAULT)
	AUDIO.id = CONFIG.show
	SHOWS.length = 0
	render()
	return stopShow()
		.then(clearLightShow)
}
global.saveShow = function saveShow() {
	return stopShow()
		.then(saveAudioConfig)
		.then(saveLightShow)
		.then(startShow)
}
