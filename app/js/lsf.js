const rgbFrameRegex = /(\t+)?([0-9]+)ms: setrgb [AB]+ ([0-9]+)ms > ([0-9]+), ([0-9]+), ([0-9]+)/i
const endFrameRegex = /(\t+)?([0-9]+)ms: end/i
const loopFrameRegex = /([0-9]+)ms: loop ([0-9]+)ms/i

export async function parseLSF(file) {
	return new Promise(resolve => {
		const reader = new FileReader()
		reader.readAsText(file)
		reader.onload = () => {
			const output = {}
			const data = reader.result.match(/@?\w+[^@]+/mg).map(segment => {
				let id = 'AB'
				if (segment.startsWith('@')) {
					id = segment[1];
					segment = segment.substr(2)
				}
				return output[id] = segment.trim().split(/\r|\n|\r\n/)
					.filter(line => {
						return !!line.match(/^[\t0-9]/)
					})
					.map(line => {
						let matched
						if (matched = line.match(rgbFrameRegex)) {
							let [, , start, transition, r, g, b] = matched
							return { type: 1, start, duration: 0, transition, r, g, b }
						}
						else if (matched = line.match(endFrameRegex)) {
							let [, , start] = matched
							return { type: 2, start }
						}
						else if (matched = line.match(loopFrameRegex)) {
							let [, start, duration] = matched
							return { type: 3, start, duration, frames: [] }
						} else {
							return {}
						}
					}).map(({ start = 0, duration = 0, transition = 0, type = 0, r = 0, g = 0, b = 0 }, index, lines) => {
						const frame = new Uint8Array(16)
						const view = new DataView(frame.buffer)
						if (type === 1 && lines[index + 1]) {
							duration = lines[index + 1].start - start
						}
						view.setUint8(0, type)
						view.setUint32(1, start)
						view.setUint32(5, duration)
						view.setUint32(9, transition)
						view.setUint8(13, r)
						view.setUint8(14, g)
						view.setUint8(15, b)
						let hex = ''
						frame.forEach(byte => (hex += (byte.toString(16).padStart(2, '0') + ' ')))
						console.log(hex)
						return frame
					})
			})
			resolve(data)
		}
	})
}
export async function parseLT3(file) {

}
