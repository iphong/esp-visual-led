const path = require('path')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const fs = require('fs')

const APP_PATH = path.resolve(__dirname, '../app')
const DATA_PATH = path.resolve(__dirname, '../data')
const REMOTE_URL = '10.1.1.1/edit'
// const REMOTE_URL = '10.0.0.131/edit'
// const REMOTE_URL = '10.0.0.162/edit'

exec('webpack -w')

fs.watch(APP_PATH, { recursive: true, persistent: true }, (action, filename) => {
	if (path.basename(filename).startsWith('.') || filename.startsWith('js')) return
	if (action == 'change') {
		const src = path.join(APP_PATH, filename)
		const dst = path.join(DATA_PATH, filename)

		process.stdout.write(`compressing "${filename}" ... `)
		exec(`mkdir -p ${path.dirname(dst)}`)
		exec(`gzip -k ${src}`)
		exec(`mv ${src + '.gz'} ${dst + '.gz'}`)

		process.stdout.write(`uploading "${filename}" ... `)
		exec(`curl -F "file=@${dst + '.gz'};filename=${filename + '.gz'}" ${REMOTE_URL}`)
		process.stdout.write(`DONE\n`)
	}
})
