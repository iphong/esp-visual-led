
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
});
