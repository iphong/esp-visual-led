
chrome['app'].runtime.onLaunched.addListener(function () {
	chrome['app'].window.create('../app.html', {
		id: 'player_view',
		frame: "none",
		minWidth: 400,
		minHeight: 300
	});
});
