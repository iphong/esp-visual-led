module.exports = {
	mode: 'development',
	entry: {
		main: './app/js/index.js'
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/app/dist'
	},
	module: {
		rules: [
			{ test: /\.css$/, use: 'css-loader' },
			{ test: /\.ts$/, use: 'ts-loader' },
			{ test: /\.js$/, use: 'babel-loader' }
		]
	},
	target: 'web'
};
