const setFrameRegex = /(\t)?([0-9]+)ms: setrgb [AB]+ ([0-9]+)ms > ([0-9]+), ([0-9]+), ([0-9]+)/i
const loopFrameRegex = /([0-9]+)ms: loop ([0-9]+)ms/i
const endFrameRegex = /(\t)?([0-9]+)ms: end/i
function parseLSF(file) {
	const reader = new FileReader()
	reader.readAsText(file)
	reader.onload = () => {
		const threads = reader.result.split(/@\w+/g)
		if (threads.length == 1) {
			parseThread('A', threads[0])
				.then(() => parseThread('B', threads[0]))
		} else if (threads.length == 3) {
			parseThread('A', threads[1])
				.then(() => parseThread('B', threads[2]))
		} else {
			console.warn('Unknown data format', reader.result)
		}
	}
	function parseThread(id, content) {
		const frames = []
		let frame, lastFrame, buf, view
		content.split('\n').forEach(line => {
			if (line.match(setFrameRegex)) {
				let [, tab, start, transition, r, g, b] = line.match(setFrameRegex)
				frame = { type: 'rgb', start, duration: 0, transition, r, g, b }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			else if (line.match(endFrameRegex)) {
				let [, tab, start] = line.match(endFrameRegex)
				frame = { type: 'end', start }
				if (!tab) {
					frames.push(frame)
					lastFrame = frame
				} else {
					lastFrame.frames.push(frame)
				}
			}
			else if (line.match(loopFrameRegex)) {
				let [, start, duration] = line.match(loopFrameRegex)
				frame = { type: 'loop', start, duration, frames: [] }
				lastFrame = frame
				frames.push(frame)
			}
		})
		const lines = []
		// const lines2 = []
		function convert(frames, tab) {
			frames.forEach((frame, index) => {
				switch (frame.type) {
					case 'rgb':
						frame.duration = frames[index + 1].start - frame.start
						lines.push([tab ? '	C' : 'C', frame.start, frame.duration, frame.transition, frame.r, frame.g, frame.b].join(' '))
						// 01  00 00 00 00  00 00 00 00  00 00 00 00  00 00 00
						// buf = new Uint8Array(16)
						// view = new DataView(buf.buffer)
						// view.setUint8(0, 0x01)
						// view.setUint32(1, frame.start)
						// view.setUint32(5, frame.duration)
						// view.setUint32(9, frame.transition)
						// view.setUint8(13, frame.r)
						// view.setUint8(14, frame.g)
						// view.setUint8(15, frame.b)
						// lines2.push(buf)
						break
					case 'loop':
						lines.push(['L', frame.start, frame.duration].join(' '))
						// 02   00 00 00 00  00 00 00 00
						// buf = new Uint8Array(9)
						// view = new DataView(buf.buffer)
						// view.setUint8(0, 0x02)
						// view.setUint32(1, frame.start)
						// view.setUint32(5, frame.duration)
						// convert(frame.frames, true)
						// lines2.push(buf)
						break
					case 'end':
						lines.push([tab ? '	E' : 'E', frame.start].join(' '))
						// 03   00 00 00 00
						// buf = new Uint8Array(5)
						// view = new DataView(buf.buffer)
						// view.setUint8(0, 0x03)
						// view.setUint32(1, frame.start)
						// lines2.push(buf)
						break
				}
			})
		}
		convert(frames)

		const path = `/show/${CONFIG.show}${id}.lsb`
		const blob = new Blob([lines.join('\n')])
		// const path = `/show/${getShow()}${id}.lsb`
		// const blob = new Blob(lines2)

		return uploadFile(path, blob)
	}
}