
addEventListener('message', e => {
	console.log('message', e.data)
})
chrome['app'].runtime.onLaunched.addListener(function () {
	chrome['app'].window.create('../app.html', {
		id: 'app',
		frame: "none",
		minWidth: 400,
		minHeight: 300
	});
});

chrome.storage.onChanged.addListener(changes => {
	if (changes.serial_connected) {
		handleWindow(!!changes.serial_connected.newValue)
	}
})

chrome.storage.local.get((data) => {
	handleWindow(!!data.serial_connected)
})

function handleWindow(connected:boolean) {
	if (connected) {
		chrome['app'].window.create('../remote.html', {
			id: 'remote',
			width: 250,
			height: 250
		});
		chrome['app'].window.create('../utils.html', {
			id: 'utils',
			width: 270,
			height: 370
		});
	} else {
		const remote = chrome['app'].window.get('remote')
		const utils = chrome['app'].window.get('utils')
		if (remote) remote.close()
		if (utils) utils.close()
	}
}
