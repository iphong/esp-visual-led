import { call, setProp } from "./api"
import { CONFIG } from "./data"
import { send } from "./ws"

export async function saveFile() {
	const handle = await showSaveFilePicker()
	console.log(handle)
}

export async function openFile() {
	const handle = await showOpenFilePicker()
	console.log(handle)
}

export async function startShow() {
	send('#>BEGIN')
	call('#player', 'play')
}

export async function endShow() {
	send('#>END')
	setProp('#player', 'currentTime', CONFIG.params.end / 1000)
	call('#player', 'pause')
}

export async function pauseShow() {
	call('#player', 'pause')
}

export async function resumeShow() {
	call('#player', 'play')
}
