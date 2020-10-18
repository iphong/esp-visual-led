module.exports = {
	mode: 'development',
	entry: {
		main: './app/js/index.js',
		app: './app/ts/entry.ts'
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/app/dist'
	},
	resolve: {
		extensions: ['.js', '.ts', '.json']
	},
	module: {
		rules: [
			{ test: /\.css$/, use: 'css-loader' },
			{ test: /\.ts$/, use: 'ts-loader' },
			{ test: /\.js$/, use: 'babel-loader' }
		]
	},
	target: 'web'
}
