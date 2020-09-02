const path = require('path')
const exec = require('child_process').exec
const fs = require('fs')

fs.watch(path.resolve(__dirname, '../data'), { recursive: true, persistent: true }, (action, filename) => {
	if (action == 'change') {
		const filepath = path.resolve(__dirname, '../data/' + filename)
		exec(`curl -F "file=@${filepath};filename=${filename}" 10.0.0.1/edit`)
		console.log(`Uploading "${filename}"`)
	}
})
//
// const fwPath = path.resolve(__dirname, '../.pio/build/esp12/firmware.bin')
// fs.watch(fwPath, {}, (action) => {
// 	if (action == 'change') {
// 		console.log('Uploading firmware...')
// 		exec(`curl -F "file=@${fwPath};filename=/firmware.bin" 10.0.0.1/edit`)
// 	}
// })