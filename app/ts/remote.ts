
addEventListener('message', e => {
	console.log('message', e.data)
})
addEventListener('click', e => {
	const target = e.target as HTMLButtonElement
	const data = (target.dataset.send || '').split(' ').map(hex => parseInt(hex, 16))
	const app = chrome['app'].window.get('app').contentWindow
	app.postMessage(new Uint8Array([2, ...data]))
})
