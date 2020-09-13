document.head.innerHTML += `<style>

x-console main {
	padding: 0;
	margin: 0;
}
x-console {
	z-index: 2000;
	display: block;
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	
	background: #020202c9;
	border: 10px solid #020202c9;
	
	box-sizing: content-box;
	max-height: 120px;
	overflow: auto;
}
x-console input,
x-console output,
x-console span {
	user-select: text;
	font-family: menlo;
	font-size: 12px;
	line-height: 1.5em;
}
x-console input,
x-console span {
	height: 1.5em;
}
x-console input,
x-console output {
	display: block;
	margin: 0;
	padding: 0;
	border: none;
	background: none;
	outline: none;
	white-space: pre !important;
	color: #fff;
	text-align: left;
}
x-console line {
	display: grid;
	grid-template-columns: 20px auto;
}
x-console line span,
x-console line output {
	color: lightgrey;
}
x-console line.debug * {
	color: lightgreen;
}
x-console line.info * {
	color: skyblue;
}
x-console line.warn * {
	color: yellow;
}
x-console line.error * {
	color: orangered;
}
x-console line.input * {
	color: white;
}
x-console line.input {
	display: none;
}
</style>`

class ConsoleElement {
	constructor() {
		this.el = document.createElement('x-console')
		this.el.innerHTML = `
		<main></main>
		<line class="input">
			<span>#</span>
			<input type="text" />
		</line>
		`
		this.main = this.el.querySelector('main')
		this.input = this.el.querySelector('input')
		this.input.addEventListener('keydown', this.handleKeydown.bind(this))
	}

	handleKeydown(e) {
		if (e.key === 'Enter') {
			this.push('#', '', e.target.value)
			try {
				this.push('•', 'info', String(eval(e.target.value)))
			} catch (err) {
				this.push('•', 'error', err.stack)
			}
			e.target.value = ''
			e.target.focus()
		}
	}

	push(icon, type, ...args) {
		const line = document.createElement('line')
		type && line.classList.add(type)
		line.innerHTML = `<span>${icon}</span><output></output>`
		const output = line.querySelector('output')
		output.innerText = args.join(' ')
		this.lastOutput = output
		this.main.appendChild(line)
		this.el.scrollTop = this.el.scrollHeight
	}
}
const logger = new ConsoleElement()
document.body.appendChild(logger.el)

const original = {}
for (let key in console) {
	original[key] = console[key]
}

window.console.log = (...args) => {
	original.log(...args)
	logger.push('•', 'log', ...args)
}
window.console.debug = (...args) => {
	original.debug(...args)
	logger.push('•', 'debug', ...args)
}
window.console.info = (...args) => {
	original.info(...args)
	logger.push('•', 'info', ...args)
}
window.console.warn = (...args) => {
	original.warn(...args)
	logger.push('•', 'warn', ...args)
}
window.console.error = (...args) => {
	original.error(...args)
	logger.push('•', 'error', ...args)
}
window.console.append = (...args) => {
	if (logger.lastOutput) {
		logger.lastOutput.innerHTML = `${logger.lastOutput.innerHTML}${args.join(' ')}`
	}
}
