
addEventListener('message', e => {
	console.log('message', e.data)
})
addEventListener('click', e => {
	const target = e.target as HTMLButtonElement
	const data = (target.dataset.send || '').split(' ').map(hex => parseInt(hex, 16))
	const app = chrome['app'].window.get('app').contentWindow
	for (let i=0; i<1; i++) {
		setTimeout(function() {
			app.postMessage(new Uint8Array([2, ...data]))
		}, i * 10)
	}
})
// let state = false
// addEventListener('keydown', e => {
// 	if (state) {
// 		document.getElementById('off').click()
// 	} else {
// 		document.getElementById('green').click()
// 	}
// 	state = !state
// })
addEventListener('load', e => {
	document.body.focus()
})
