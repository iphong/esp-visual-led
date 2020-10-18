import { send } from "./socket"
import { player } from './audio'
import { module } from "../../webpack.config"

export async function startShow() {
	await send('#>BEGIN')
	player.play()
}
export async function endShow() {
	await send('#>END')
	player.currentTime = player.duration
}
export async function pauseShow() {
	await send('#>PAUSE')
	player.pause()
}
export async function resumeShow() {
	await send('#>RESUME')
	player.play()
}
export async function syncShow() {
	await send('#>SYNC')
}
