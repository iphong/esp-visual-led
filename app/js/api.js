import { LIGHT } from "./data"

const { render } = require("./app")

export function request(method = 'POST', path = '', args = {}, body = null) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest
		const params = Object.entries(args)
		const uri = path + (params.length ? '?' + params.map(([key, value]) => `${key}=${value}`).join('&') : '')
		const size = body ? ` [${body.size || body.length} Kb]` : ''
		const output = console.log(`${method} ${uri} ${size}... `)

		req.open(method, uri, true)
		req.send(body)
		req.addEventListener('load', () => {
			if (output) {
				// output.innerHTML += `[${req.status} ${req.statusText}] ${req.responseText.split("\n")[0]}`
				output.innerHTML += req.statusText
			}
			if (req.status === 200) {
				if (req.getResponseHeader('Content-Type') === 'application/json') {
					resolve(JSON.parse(req.responseText), req)
				} else resolve(req.responseText, req)
			} else {
				reject()
			}
		})
		req.addEventListener('error', reject)
	})
}
export async function uploadFile(path, body, sync = false, target = null) {
	const file = new Blob([body])
	const output = console.log(`UPLOAD ${path} [${(file.size / 1000).toFixed(2)} KB] ... `)
	return new Promise((resolve, reject) => {
		const form = new FormData()
		const req = new XMLHttpRequest()
		form.append('filename', path)
		form.append('file', file)
		req.open('POST', `edit?${sync ? 'sync' : 'nosync'}&${target ? `target=${target}` : ''}`, true)
		req.send(form)
		req.onloadend = (e) => {
			if (output) {
				output.innerHTML += req.statusText
			}
			if (req.status === 200) {
				resolve(req)
			} else {
				reject(req)
			}
		}
	})
}
export function get(path, params) {
	return request('GET', path, params)
}
export function post(path, params, body) {
	return request('POST', path, params, body)
}
export function exec(cmd) {
	// console.log('execute ' + cmd)
	return request('POST', 'exec', { cmd })
}
export async function loadShowData() {
	try {
		const data = await get(`show/${CONFIG.show}.json`)
		LIGHT.params = data.solution
		LIGHT.tracks = data.tracks
	} catch(e) {
		console.log('show not available')
		LIGHT.params = {}
		LIGHT.tracks = []
	}
}
export async function fetchData() {
	const result = await get('stat')
	Object.assign(CONFIG, result)
	if (result.show) await loadShowData();
	render()
}


Object.assign(global, {
	request,
	get,
	post,
	uploadFile,
	loadShowData,
	fetchData
})
