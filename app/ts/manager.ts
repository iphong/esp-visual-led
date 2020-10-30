
import * as actions from './actions'
import { onSerialMessage, readStr, sendCommand, serialConnect } from './serial'
import { init } from "./store"

Object.assign(window, actions)

addEventListener('load', async () => {
	await init()
	await serialConnect()
	await onSerialMessage(async (buf) => {
		if (buf.length > 6 && [60, 62].includes(buf[6])) {
			const id = readStr(buf, 6)
			const msg = readStr(buf, buf.length-7, 7)
			if (msg.startsWith('SELECT')) {
				await sendCommand(id, 'BLINK')
			}
			if (msg.startsWith('PING')) {
				const type = buf[11]
				const vbat = (buf[12] << 8) | buf[13]
				const name = readStr(buf, 20, 14);
				console.log(id, type, (vbat/1000+0.04).toPrecision(3), name)
			}
		}
	})
})
