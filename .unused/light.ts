import unzip from 'unzip-js'

// export async function readLTP(file: File): Promise<ShowData> {
// 	const files:any = {}
// 	return new Promise((resolve, reject) => {
// 		unzip(file, (err, zip) => {
// 			if (err) reject(err)
// 			zip.readEntries((err, entries) => {
// 				if (err) reject(err)
// 				let ended = 0
// 				entries.forEach(entry => {
// 					const { name } = entry
// 					zip.readEntryData(entry, false, (err, stream) => {
// 						if (err) reject(err)
// 						let content: Uint8Array[] = []
// 						stream.on('data', (data: Uint8Array) => {
// 							content.push(data)
// 						})
// 						stream.on('end', async () => {
// 							files[name] = new Blob(content)
// 							if (++ended === entries.length) {
// 								resolve(files)
// 							}
// 						})
// 					})
// 				})
// 			})
// 		})
// 	})
// }

// export async function parseLTP(file: File): Promise<ShowData> {
// 	const show: ShowData = {
// 		filename: file.name,
// 		params: {},
// 		tracks: [],
// 		images: [],
// 		audio: {}
// 	}
// 	return new Promise((resolve, reject) => {
// 		unzip(file, (err, zip) => {
// 			if (err) reject(err)
// 			zip.readEntries((err, entries) => {
// 				if (err) reject(err)
// 				let ended = 0
// 				entries.forEach(entry => {
// 					const { name } = entry
// 					zip.readEntryData(entry, false, (err, stream) => {
// 						if (err) reject(err)
// 						let content: Uint8Array[] = []
// 						stream.on('data', (data: Uint8Array) => {
// 							content.push(data)
// 						})
// 						stream.on('end', async () => {
// 							if (name == "project.lt3") {
// 								const file = new Blob(content)
// 								const reader = new FileReader
// 								reader.readAsText(file)
// 								reader.addEventListener('loadend', () => {
// 									if (typeof reader.result === 'string') {
// 										const { solution: params, tracks } = JSON.parse(reader.result)
// 										Object.assign(show, { params, tracks })
// 									}
// 								})
// 							} else if (name.endsWith('.mp3')) {
// 								show.audio.file = new Blob(content, { type: 'audio/mp3' }) as File
// 							} else if (name.startsWith('images/')) {
// 								show.images.push(new Blob(content, { type: 'image/png' }))
// 							}
// 							if (++ended === entries.length) {
// 								resolve(show)
// 							}
// 						})
// 					})
// 				})
// 			})
// 		})
// 	})
// }
