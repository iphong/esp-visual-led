const $txt = document.getElementById('txt') as HTMLOutputElement
const $hex = document.getElementById('hex') as HTMLOutputElement
const $dec = document.getElementById('dec') as HTMLOutputElement
const $bin = document.getElementById('bin') as HTMLOutputElement
const $int = document.getElementById('int') as HTMLOutputElement
const $res = document.getElementById('res') as HTMLOutputElement
const $array = document.getElementById('arr') as HTMLOutputElement
const $message = document.getElementById('message') as HTMLOutputElement
const $send = document.getElementById('send') as HTMLOutputElement

chrome.storage.local.get('utils_txt', ({ utils_txt:codes }) => {
	if (!codes) return
	$bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ')
	$hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ')
	$dec.innerHTML = codes.map(c => c.toString()).join(' ')
	$txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('')
	$array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ')
})
let codes: number[] = []
addEventListener('input', (e: any) => {
	let value: string = e.target.innerText.replace(/\s+/, '')
	switch (e.target.id) {
		case 'txt':
			codes = value ? value.split('').map(c => c.charCodeAt(0)) : []
			$bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ')
			$hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ')
			$dec.innerHTML = codes.map(c => c.toString()).join(' ')
			$array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ')
			break
		case 'hex':
			value = e.target.innerText.replace(/[^0-9a-f ]/ig, '').trim()
			codes = value ? value.split(' ').map(c => parseInt(c, 16)) : []
			$bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ')
			$dec.innerHTML = codes.map(c => c.toString()).join(' ')
			$txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('')
			$array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ')
			break
		case 'dec':
			value = e.target.innerText.replace(/[^0-9 ]/ig, '').trim()
			codes = value ? value.split(' ').map(c => parseInt(c, 10)) : []
			$bin.innerHTML = codes.map(c => c.toString(2).toUpperCase().padStart(8, '0')).join(' ')
			$hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ')
			$txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('')
			$array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ')
			break
		case 'bin':
			value = e.target.innerText.replace(/[^01 ]/ig, '').trim()
			codes = value ? value.split(' ').map(c => parseInt(c, 2)) : []
			$hex.innerHTML = codes.map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ')
			$dec.innerHTML = codes.map(c => c.toString()).join(' ')
			$txt.innerHTML = codes.map(c => String.fromCharCode(c)).join('')
			$array.innerHTML = codes.map(c => '0x' + c.toString(16).toUpperCase().padStart(2, '0')).join(', ')
			break
		case 'int':
			let res = '\n'
			value = e.target.innerText.replace(/[^0-9]/ig, '').trim()
			if (value) {
				const num = parseFloat(value)
				const buf = new Uint8Array(4)
				const view = new DataView(buf.buffer)

				view.setUint16(0, num)
				res += 'U16 BE = ' + toHEX(buf.slice(0, 2))
				view.setUint16(0, num, true)
				res += 'U16 LE = ' + toHEX(buf.slice(0, 2))

				view.setUint32(0, num)
				res += 'U32 BE = ' + toHEX(buf)
				view.setUint32(0, num, true)
				res += 'U32 LE = ' + toHEX(buf)

				view.setFloat32(0, num)
				res += 'F32 BE = ' + toHEX(buf)
				view.setFloat32(0, num, true)
				res += 'F32 LE = ' + toHEX(buf)
			}
			$res.innerHTML = res
			break
		default: return
	}
	chrome.storage.local.set({ 'utils_txt': codes })
})

function toHEX(bytes: Uint8Array): string {
	return [...bytes].map(c => c.toString(16).toUpperCase().padStart(2, '0')).join(' ') + '\n'
}

$send.addEventListener('click', e => {
	chrome['app'].window.get('app').contentWindow.postMessage(new Uint8Array([2, ...codes]))
})
