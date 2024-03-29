const path = require('path')

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
		publicPath: './js/',
		filename: '[name].js',
		path: __dirname + '/js'
	},
	resolve: {
		extensions: ['.js', '.ts', '.json'],
		alias: {
			css: path.resolve(__dirname, 'css/'),
			fonts: path.resolve(__dirname, 'fonts/'),
			ts: path.resolve(__dirname, 'ts/')
		}
	},
	module: {
		rules: [
			{ test: /\.css$/, use: 'css-loader' },
			{ test: /\.ts$/, use: 'ts-loader' },
			{ test: /\.js$/, use: 'babel-loader' },
			{ test: /\.(woff|woff2|ttf|eot)$/, use: 'file-loader' }
		]
	},
	target: 'webworker'
}
