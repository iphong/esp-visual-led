chrome['app'].runtime.onLaunched.addListener(function () {
	chrome['app'].window.create('../app.html', {
		id: 'app',
		frame: "none",
		minWidth: 800,
		minHeight: 100
	});
});
