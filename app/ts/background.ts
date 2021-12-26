chrome['app'].runtime.onLaunched.addListener(function () {
	chrome['app'].window.create('../app.html', {
		id: 'app',
		frame: "none",
		minWidth: 900,
		minHeight: 100
	});
});
