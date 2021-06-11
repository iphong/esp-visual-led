module.exports = {
	devtool: 'inline-source-map',
	mode: 'development',
	entry: {
		app: './ts/app.ts',
		utils: './ts/utils.ts',
		remote: './ts/remote.ts',
		background: './ts/background.ts'
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
	target: 'webworker'
}
